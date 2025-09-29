export function MoveWindow(clients: any, variables: any, direction: number) {
    let current_window_index: number
    let swapped_window_index: number
    let windows: any = []

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][2] == variables.current_workspace) {
            windows.push(clients[i])
        }
    }

    windows.sort((a: any, b: any) => a.at(-1) - b.at(-1))

    if(variables.focused_window_index + direction < 0) {
        return
    }

    if(variables.focused_window_index + direction > windows.length - 1) {
        return
    }

    current_window_index = windows[variables.focused_window_index][3]
    swapped_window_index = windows[variables.focused_window_index + direction][3]

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i] == windows[variables.focused_window_index]) {
            clients[i][3] = swapped_window_index
        }

        if(clients[i] == windows[variables.focused_window_index + direction]) {
            clients[i][3] = current_window_index
        }
    }
}
