export function Tile(X: any, root: number, clients: any, resolution: number[], variables: any, reset_focus: boolean, config: any) {
    if(clients.length == 0) {
        X.SetInputFocus(root, 0, 0)
        return
    }

    let win_x: number
    let win_y: number
    let win_width: number
    let win_height: number
    let gaps: number = variables.gaps
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
                    win_x = gaps * 2
                    win_y = gaps * 3 + config.bar_height + config.bar_border * 2
                    win_width = resolution[0] - gaps * 4
                    win_height = resolution[1] - gaps * 3 - config.bar_height - config.bar_border * 2 - gaps * 2
                }

                else {
                    if(i >= variables.masters) { //stack
                        win_x = resolution[0] / 2 - variables.master_width * 10
                        win_y = Math.floor((resolution[1] - config.bar_height - config.bar_border * 2 - gaps * 3) / (windows.length - variables.masters)) * (i - variables.masters) + gaps * 3 + config.bar_height + config.bar_border * 2
                        //if(i == variables.focused_window_index) {
                        //    win_y -= Math.floor((windows[i][1] * 10) / (windows.length - variables.masters - 1))
                        //}

                        win_width = resolution[0] / 2 - gaps * 2 + variables.master_width * 10

                        win_height = Math.floor((resolution[1] - config.bar_height - config.bar_border * 2 - gaps * 3) / (windows.length - variables.masters)) - gaps * 2
                        //if(windows.length - variables.masters > 1) {
                        //    win_height += windows[i][1] * 10
                        //}
                    }

                    else { //master
                        win_x = gaps * 2
                        win_y = Math.floor((resolution[1] - config.bar_height - config.bar_border * 2 - gaps * 3) / variables.masters) * i + gaps * 3 + config.bar_height + config.bar_border * 2
                        //if(i == variables.focused_window_index) {
                        //    win_y -= windows[i][1] * 10
                        //}

                        win_height = Math.floor((resolution[1] - config.bar_height - config.bar_border * 2 - gaps * 3) / variables.masters) - gaps * 2

                        if(windows.length - variables.masters == 0) {
                            win_width = resolution[0] - gaps * 3
                        }
                        else {
                            win_width = resolution[0] / 2 - gaps * 3
                        }
                        win_width -= variables.master_width * 10

                        //if(variables.masters > 1) {
                        //    win_height += windows[i][1] * 10
                        //}
                    }
                }

                X.ConfigureWindow(windows[i][0], {
                    x: win_x,
                    y: win_y,
                    width: win_width - variables.border_width * 2,
                    height: win_height - variables.border_width * 2,
                    borderWidth: variables.border_width,
                })
            }
        break

        case 'columns':
            for(let i:number = 0; i < windows.length; i++) {
                X.ConfigureWindow(windows[i][0], {
                    x: Math.floor(resolution[0] / windows.length) * i,
                    y: 0,
                    width: Math.floor(resolution[0] / windows.length),
                    height: resolution[1]
                })
            }
        break
    }

    if(reset_focus) {
        X.SetInputFocus(windows[windows.length - 1][0], 0, 0)
        variables.focused_window_index = windows.length - 1
    }
}
