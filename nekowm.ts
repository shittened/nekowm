const x11 = require('x11') as any
import {exec, spawn} from 'child_process'
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
import {HoverFocus} from './src/hover-focus.ts'
import {ChangeBorderColor} from './src/change-border-color.ts'
import {ResizeWindow} from './src/resize-window.ts'
import {createCanvas} from 'canvas'
import {Bar} from './src/bar.ts'

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
const variables: {} = {
    focused_window_index: 0,
    masters: 1,
    layout: config.layout,
    gaps: config.gaps,
    current_workspace: 0,
    workspace_windows: [],
    master_width: 0,
    border_width: config.border_width,
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
        //for (let code = key_min; code <= key_max; code++) {
        //    X.GrabKey(root, 0, 64, code, 1, 1)
        //}
    })

    console.log('Welcome to nekowm')

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

    const rawkeys: any = spawn('/home/shitten/projects/nekowm/rawkeys')

    rawkeys.stdout.on('data', (data: any) => {
        let line: any = data.toString().trim().split(':');
        
        if(line[0] == 'release') {
            return
        }

        line = line[1].split(',')
        const keycode = Math.floor(line[0].split('=')[1])
        const mask = Math.floor(line[1].split('=')[1].split('x')[1])

        //exec('xcowsay "' + keycode + ' '+ mask + '"')
        //if(mask != '0x50') {
        if(mask < 40) {
            return
        }

        //let windows: any = []

        //for(let i: number = 0; i < clients.length; i++) {
        //    if(clients[i][2] == variables.current_workspace) {
        //        windows.push(clients[i])
        //    }
        //}

        //windows.sort((a: any, b: any) => a.at(-1) - b.at(-1))

        Keybindings(X, root, keycode, mask, keycodes, clients, resolution, variables, exec, DestroyWindow, ChangeFocus, modkey, Tile, IncMasters, ChangeWorkspace, MoveWindow, WindowChangeWorkspace, Spotlight, ChangeBorderColor, ResizeWindow, config)
    })
        
    X.on('event', (event: any) => {
        //exec('xcowsay -t 0 ' + JSON.stringify(event))
        switch(event.name) {
            case 'MapRequest':
                CreateWindow(event, X, root, resolution, clients, variables, x11)
                Tile(X, root, clients, resolution, variables, true, config)
                ChangeBorderColor(X, clients, variables)
                break
            case 'DestroyNotify':
                DestroyWindow(false, event.wid, X, root, clients, variables)
                Tile(X, root, clients, resolution, variables, true, config)
                break
            //case 'KeyPress':
            //case 'RawKeyPress':
                //Keybindings(event, X, root, keycodes, clients, resolution, false, last_event_seq, variables, exec, DestroyWindow, ChangeFocus, modkey, Tile, IncMasters, ChangeWorkspace, MoveWindow, WindowChangeWorkspace, Spotlight, ChangeBorderColor, ResizeWindow)
                //break
            case 'EnterNotify':
                HoverFocus(X, event, clients, variables)
                ChangeBorderColor(X, clients, variables)
        }
    })

    for(let i: number = 0; i < config.startup.length; i++) {
        exec(config.startup[i])
    }

    Bar(createCanvas, X, root, resolution, config)
    //exec('python3 ~/projects/nekowm/src/nekobar.py')
})
