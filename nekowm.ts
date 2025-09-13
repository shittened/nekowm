const x11 = require('x11') as any
const Exec = require('child_process').exec

const base_key: int = 16
let modifiers: {} = {
    Shift: 1,
    Lock: 2,     // Caps Lock
    Control: 4,
    Mod1: 8,     // Alt
    Mod2: 16,
    Mod3: 32,
    Mod4: 64,    // Super/Win
    Mod5: 128
}

Object.keys(modifiers).forEach(key => {
    modifiers[key] += base_key
})

x11.createClient({display: ':1'}, (err: any, display: any, ) => {

    if(err) {
        throw err
    }

    const event_masks: any = x11.eventMask.SubstructureRedirect | 
        x11.eventMask.SubstructureNotify |
        x11.eventMask.KeyPress |
        x11.eventMask.KeyRelease

    const X: any = display.client
    const root: number = display.screen[0].root
    const resolution: number[] = [display.screen[0].pixel_width, display.screen[0].pixel_height]
    const clients: any = new Map<number, number>()
    const key_min: number = display.min_keycode
    const key_max: number = display.max_keycode 
    let charcodes: any = {}
    let keycodes: any = {}

    X.ChangeWindowAttributes(root, {eventMask: event_masks}, (err: any) => {
        if (err) {
            console.error('Another WM already running')
            process.exit(1)
        }
    })

    console.log('Welcome to nekowm')

    X.on('error', (err: any) => {
        console.error('X error:', err)
    })

    for(code_name in x11.keySyms) {
        const key_data = x11.keySyms[code_name].code
        charcodes[key_data] =  code_name
    }

    X.GetKeyboardMapping(key_min, key_max - key_min, function(err: any, list: number[][]) {
        for(let i: number = 0; i < list.length; i++) {
            keycodes[i + key_min] = []
            let sublist: any[] = list[i]

            for(let j: number = 0; j < sublist.length; j++) {
                keycodes[i + key_min].push(charcodes[sublist[j]] || 'keysim_' + sublist[j].toString(16))
            }
            //console.log(sublist)
        }
        //console.log(keycodes)
    })
        
    //X.GrabKey(root, 1, 8, [keycodes], 0, 0);
    //for (let code = key_min; code <= key_max; code++) {
    //    X.GrabKey(root, 0, x11.Modifiers.Any, code, 0, 0); // grab all keys for testing
    //}

    X.on('event', (event: any) => {
        //console.log('X event:', event)
        switch(event.name) {
            case 'MapRequest':
                CreateWindow(event, X, root, resolution, clients)
                break
            case 'DestroyNotify':
                DestroyWindow(event.wid, X, clients, root)
                break
            case 'KeyPress':
                Keybindings(event, X, root, keycodes, clients)
                break
        }
    })

    //console.log(charcodes)
    //console.log(x11.keySyms)

})

function CreateWindow(event: any, X: any, root: number, resolution: number[], clients: any) {
    const event_masks: any = x11.eventMask.Exposure | x11.eventMask.StructureNotify | x11.eventMask.KeyPress
    const win: number = event.wid
    const frame: number = X.AllocID()
    X.CreateWindow(frame, root, 0, 0, resolution[0], resolution[1], 0, 0, 0, 0, {eventMask: x11.eventMask.Exposure})
    X.ReparentWindow(win, frame, 0, 0);
    X.MapWindow(frame)
    X.MapWindow(win)
    X.ChangeWindowAttributes(win, {eventMask: event_masks})
    clients.set(win, frame)
}

function DestroyWindow(win: number, X: any, clients: any, root: number) {
    const frame = clients.get(win)
    if(frame) {
        X.DestroyWindow(frame)
        clients.delete(win)
        X.SetInputFocus(root, 0, 0)
    }
}

function Keybindings(event: any, X: any, root: number, keycodes: {}, clients: any) {
    const key: number = event.keycode
    const state: number = event.rawData.readUInt16LE(28);
    let key_name: string = keycodes[String(key)][0]
    console.log(key, state, key_name)
    if(state == modifiers.Mod1) {
        switch(key_name) {
            case 'XK_Return':
                OpenApp(X, 'kitty')
                break
            case 'XK_q':
                DestroyWindow(event.wid, X, clients, root)
                break
        }
    }
}

function OpenApp(X: any, appname: string) {
    Exec('DISPLAY=:1 ' + appname)
}
