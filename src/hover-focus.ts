export function HoverFocus(X: any, event: any, clients: any, variables: any) {

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

    X.SetInputFocus(event.wid, 0, 0)

    windows.sort((a: any, b: any) => a.at(-1) - b.at(-1))

    for(let i: number = 0; i < windows.length; i++) {
        if(windows[i][0] == event.wid) {
            variables.focused_window_index = i
        }
    }
}
