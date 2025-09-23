export function ChangeFocus(X: any, direction: number, clients: any, variables: any) {
    if(clients.length < 2) {
        return
    }

    let windows: any = []

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][2] == variables.current_workspace) {
            windows.push(clients[i])
        }
    }

    if(windows.length < 2) {
        return
    }

    let next_focus = variables.focused_window_index + direction

    if(next_focus < 0) {
        //next_focus = clients.length - 1
        next_focus = windows.length - 1
    }

    //if(next_focus > clients.length - 1) {
    if(next_focus > windows.length - 1) {
        next_focus = 0
    }

    //X.SetInputFocus(clients[next_focus][0], 0, 0)
    X.SetInputFocus(windows[next_focus][0], 0, 0)
    variables.focused_window_index = next_focus
}
