export function Tile(X: any, root: number, clients: any, resolution: number[], variables: any) {
    if(clients.length == 0) {
        X.SetInputFocus(root, 0, 0)
        return
    }

    let win_x: number
    let win_y: number
    let win_width: number
    let win_height: number
    let gaps: number = variables.gaps
    //let windows: any = variables.workspace_windows
    let windows: any = []

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][2] == variables.current_workspace) {
            windows.push(clients[i])
        }
    }

    if(windows.length == 0) {
        X.SetInputFocus(root, 0, 0)
        return
    }

    windows.sort((a: any, b: any) => a.at(-1) - b.at(-1))

    switch(variables.layout) {
        case 'master-stack':
            for(let i:number = 0; i < windows.length; i++) {
                if(windows.length == 1) {
                    win_x = gaps
                    win_y = gaps
                    win_width = resolution[0] - gaps * 2
                    win_height = resolution[1] - gaps * 2
                }

                else {
                    if(i >= variables.masters) { //stack
                        win_x = resolution[0] / 2 + gaps
                        win_y = Math.floor(resolution[1] / (windows.length - variables.masters)) * (variables.masters - i) * -1 + gaps
                        win_height = Math.floor(resolution[1] / (windows.length - variables.masters)) - gaps * 2
                        win_width = resolution[0] / 2 - gaps * 2
                    }

                    else { //master
                        win_x = gaps
                        win_y = Math.floor(resolution[1] / variables.masters) * i + gaps
                        win_height = Math.floor(resolution[1] / variables.masters) - gaps * 2

                        if(windows.length - variables.masters == 0) {
                            win_width = resolution[0] - gaps * 2
                        }
                        else {
                            win_width = resolution[0] / 2 - gaps * 2
                        }

                    }
                }

                X.ConfigureWindow(windows[i][0], {
                    x: 0,
                    y: 0,
                    width: win_width,
                    height: win_height
                })

                X.ConfigureWindow(windows[i][1], {
                    x: win_x,
                    y: win_y,
                    width: win_width,
                    height: win_height
                })

            }
        break

        case 'columns':
            for(let i:number = 0; i < windows.length; i++) {
                X.ConfigureWindow(windows[i][0], {
                    x: 0,
                    y: 0,
                    width: Math.floor(resolution[0] / windows.length),
                    height: resolution[1]
                })

                X.ConfigureWindow(windows[i][1], {
                    x: Math.floor(resolution[0] / windows.length) * i,
                    y: 0,
                    width: Math.floor(resolution[0] / windows.length),
                    height: resolution[1]
                })
            }
        break
    }

    X.SetInputFocus(windows[windows.length - 1][0], 0, 0)
    variables.focused_window_index = windows.length - 1
}
