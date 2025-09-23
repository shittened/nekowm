const x11 = require('x11') as any
const Exec = require('child_process').exec
import {ChangeFocus} from './src/focus-window.ts'
import {Tile} from './src/tile.ts'
import {Keybindings} from './src/keybindings.ts'
import {DestroyWindow} from './src/destroy-window.ts'
import {CreateWindow} from './src/create-window.ts'
import {config} from './config.ts'
import {IncMasters} from './src/inc-masters.ts'
import {ChangeWorkspace} from './src/change-workspace.ts'
import {MoveWindow} from './src/move-window.ts'
import {WindowChangeWorkspace} from './src/window-change-workspace.ts'
import {Spotlight} from './src/spotlight.ts'

const base_key: number = 16
const modifiers: {} = {
    Shift: 1,
    Lock: 2,     // Caps Lock
    Control: 4,
    Mod1: 8,     // Alt
    Mod2: 16,
    Mod3: 32,
    Mod4: 64,    // Super/Win
    Mod5: 128
}
const screen: string = ':0'

Object.keys(modifiers).forEach(key => {
    modifiers[key] += base_key
})

const modkey: number = modifiers[config.mod]
let last_event_seq: any
const variables: {} = {
    focused_window_index: 0,
    masters: 1,
    layout: config.layout,
    gaps: config.gaps,
    current_workspace: 0,
    workspace_windows: [],
}

x11.createClient({display: screen}, (err: any, display: any, ) => {

    if(err) {
        throw err
    }

    const event_masks: any = x11.eventMask.SubstructureRedirect | 
        x11.eventMask.SubstructureNotify |
        x11.eventMask.KeyPress //|
        //x11.eventMask.KeyRelease

    const X: any = display.client
    const root: number = display.screen[0].root
    const resolution: number[] = [display.screen[0].pixel_width, display.screen[0].pixel_height]
    let clients: any = []
    const key_min: number = display.min_keycode
    const key_max: number = display.max_keycode 
    let charcodes: any = {}
    let keycodes: any = {}

    X.SetInputFocus(root, 0, 0)

    X.ChangeWindowAttributes(root, {eventMask: event_masks}, (err: any) => {
        if (err) {
            console.error('Another WM already running')
            process.exit(1)
        }
        for (let code = key_min; code <= key_max; code++) {
            X.GrabKey(root, 0, 64, code, 1, 1)
        }
    })

    console.log('Welcome to nekowm')
    //Exec('echo ' + display + ' > ./logs.txt')

    X.on('error', (err: any) => {
        console.error('X error:', err)
    })

    for(const code_name in x11.keySyms) {
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
        }
    })

    X.require('composite', (err: any, Composite: any) => {
        if(err) {
            console.log(err)
        }
        else {
            Composite.RedirectSubwindows(root, 0)
        }
    })

    //X.QueryExtension('XInpuExtension', (err: any, ext: any) => {
    //    if(err) throw err
    //    X.require('xinput2', (err: any, XI2: any) => {
    //        if(err) throw err
    //        const mask = Buffer.alloc(4)
    //        mask.writeUInt32LE(1 << 0)
    //        XI2.SelectEvents(root, [{deviceid: 2, mask}])
    //    })

    //    X.om('event', (event: any) => {
    //        if(event.name == 'RawKeyPress') {
    //            Keybindings(event, X, root, keycodes, clients, resolution, true, last_event_seq)
    //        }
    //    })
    //})
        
    X.on('event', (event: any) => {
        //console.log('X event:', event)
        switch(event.name) {
            case 'MapRequest':
                CreateWindow(event, X, root, resolution, clients, variables, x11)
                Tile(X, root, clients, resolution, variables)
                break
            case 'DestroyNotify':
                DestroyWindow(event.wid, X, root, clients)
                Tile(X, root, clients, resolution, variables)
                break
            case 'KeyPress':
            //case 'RawKeyPress':
                //X.GrabKeyboard(root, false, 1, 1, x11.Time.CurrentTime)
                Keybindings(event, X, root, keycodes, clients, resolution, false, last_event_seq, variables, Exec, DestroyWindow, ChangeFocus, modkey, Tile, IncMasters, ChangeWorkspace, MoveWindow, WindowChangeWorkspace, Spotlight)
                //Keybindings(event, X, root, keycodes, clients, resolution)
                //X.UngabKeyboard(x11.Time.CurrentTime)
                break
        }
    })

    //InitAtoms(X)

    for(let i: number = 0; i < config.startup.length; i++) {
        Exec(config.startup[i])
    }
})
