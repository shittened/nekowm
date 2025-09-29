export function Keybindings(X: any, root: number, key: number, mask: number, keycodes: {}, clients: any, resolution: number[], variables: any, Exec: any, DestroyWindow: any, ChangeFocus: any, modkey: number, Tile: any, IncMasters: any, ChangeWorkspace: any, MoveWindow: any, WindowChangeWorkspace: any, Spotlight: any, ChangeBorderColor: any, ResizeWindow: any, config: any) {

    let key_name: string = keycodes[String(key)][0]
    //Exec('xcowsay "' + key + ' ' + win + ' ' + key_name + '"')
    switch(mask) {
        case 40:
        case 42:
        case 50:
        case 52:
            switch(key_name) {
                case 'XK_Return':
                    Exec('kitty')
                    break
                case 'XK_q':
                    DestroyWindow(true, 0, X, root, clients, variables)
                    Tile(X, root, clients, resolution, variables, true, config)
                    ChangeBorderColor(X, clients, variables)
                    break
                case 'XK_r':
                    Exec('dmenu_run -l 15 -z 600')
                    break
                case 'XK_Left':
                    ChangeFocus(X, -1, clients, variables)
                    ChangeBorderColor(X, clients, variables)
                    break
                case 'XK_Right':
                    ChangeFocus(X, 1, clients, variables)
                    ChangeBorderColor(X, clients, variables)
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
                    Tile(X, root, clients, resolution, variables, true, config)
                    ChangeBorderColor(X, clients, variables)
                    break
                case 'XK_F10':
                    Spotlight(X, clients, variables, resolution)
                    break
                case 'XK_f':
                    Exec('pcmanfm')
                    break
            }
            break

        case 41:
        case 43:
        case 51:
        case 53:
            switch(key_name) {
                case 'XK_o':
                    IncMasters(variables, 1)
                    Tile(X, root, clients, resolution, variables, false, config)
                    ChangeBorderColor(X, clients, variables)
                    break
                case 'XK_p':
                    IncMasters(variables, -1)
                    Tile(X, root, clients, resolution, variables, false, config)
                    ChangeBorderColor(X, clients, variables)
                    break
                case 'XK_Left':
                    MoveWindow(clients, variables, -1)
                    Tile(X, root, clients, resolution, variables, false, config)
                    ChangeFocus(X, -1, clients, variables)
                    ChangeBorderColor(X, clients, variables)
                    break
                case 'XK_Right':
                    MoveWindow(clients, variables, 1)
                    Tile(X, root, clients, resolution, variables, false, config)
                    ChangeFocus(X, 1, clients, variables)
                    ChangeBorderColor(X, clients, variables)
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
                    WindowChangeWorkspace(key_name, X, clients, variables)
                    Tile(X, root, clients, resolution, variables, true, config)
                    ChangeBorderColor(X, clients, variables)
                    break
            }
            break

        case 44:
        case 46:
        case 54:
        case 56:
            switch(key_name) {
                case 'XK_Left':
                    ResizeWindow(clients, variables, [1, 0])
                    Tile(X, root, clients, resolution, variables, false, config)
                    break
                case 'XK_Right':
                    ResizeWindow(clients, variables, [-1, 0])
                    Tile(X, root, clients, resolution, variables, false, config)
                    break
                case 'XK_Up':
                    ResizeWindow(clients, variables, [0, 1])
                    Tile(X, root, clients, resolution, variables, false, config)
                    break
                case 'XK_Down':
                    ResizeWindow(clients, variables, [0, -1])
                    Tile(X, root, clients, resolution, variables, false, config)
                    break
            }
            break
    }
}
