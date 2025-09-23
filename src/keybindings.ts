export function Keybindings(event: any, X: any, root: number, keycodes: {}, clients: any, resolution: number[], 
    raw: boolean, last_event_seq: any, variables: any, Exec: any, DestroyWindow: any, ChangeFocus: any, modkey: number, Tile: any, IncMasters: any, ChangeWorkspace: any, MoveWindow: any, WindowChangeWorkspace: any, Spotlight: any) {

    let key: number
    let state: number
    //key = event.keycode
    //state = event.rawData.readUInt16LE(28);

    //if(event.seq == last_event_seq) {
    //    return
    //}

    //last_event_seq = event.seq

    if(raw) {
        key = event.detail
        state = event.mods.effective
    }
    else {
        key = event.keycode
        state = event.rawData.readUInt16LE(28);
    }
    //console.log(key, state, key_name)
    let key_name: string = keycodes[String(key)][0]
    if(state == modkey) {
        switch(key_name) {
            case 'XK_Return':
                Exec('kitty')
                break
            case 'XK_q':
                DestroyWindow(event.wid, X, root, clients)
                Tile(X, root, clients, resolution, variables)
                break
            case 'XK_r':
                Exec('dmenu_run')
                break
            case 'XK_Delete':
                Exec('killall bun')
                break
            case 'XK_Left':
                ChangeFocus(X, -1, clients, variables)
                break
            case 'XK_Right':
                ChangeFocus(X, 1, clients, variables)
                break
            case 'XK_1':
            case 'XK_2':
            case 'XK_3':
            case 'XK_4':
            case 'XK_5':
            case 'XK_6':
            case 'XK_7':
            case 'XK_8':
            case 'XK_9':
                ChangeWorkspace(key_name, X, clients, variables)
                Tile(X, root, clients, resolution, variables)
                break
            case 'XK_F10':
                Spotlight(X, clients, variables, resolution)
                break
        }
    }

    if(state == modkey + 1) {
        let win: number

        switch(key_name) {
            case 'XK_o':
                IncMasters(variables, 1)
                Tile(X, root, clients, resolution, variables)
                break
            case 'XK_p':
                IncMasters(variables, -1)
                Tile(X, root, clients, resolution, variables)
                break
            case 'XK_Left':
                win = MoveWindow(event.wid, clients, -1)
                Tile(X, root, clients, resolution, variables)
                //X.SetInputFocus(win, 0, 0)
                break
            case 'XK_Right':
                win = MoveWindow(event.wid, clients, 1)
                Tile(X, root, clients, resolution, variables)
                //X.SetInputFocus(win, 0, 0)
                break
            case 'XK_1':
            case 'XK_2':
            case 'XK_3':
            case 'XK_4':
            case 'XK_5':
            case 'XK_6':
            case 'XK_7':
            case 'XK_8':
            case 'XK_9':
                WindowChangeWorkspace(key_name, X, clients, variables, event.wid)
                Tile(X, root, clients, resolution, variables)
                break
        }
    }
}
