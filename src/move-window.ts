export function MoveWindow(X: any, win: number, clients: any, variables: any, direction: number) {
    let current_window_index: number
    let swapped_window_index: number
    let windows: any = []

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][2] == variables.current_workspace) {
            windows.push(clients[i])
        }
    }

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][0] == win) {
            if(i + direction < 0 || i + direction > windows.length - 1) {
                return
            }

            current_window_index = clients[i][3]
            swapped_window_index = clients[i + direction][3]
            clients[i][3] = swapped_window_index
            clients[i + direction][3] = current_window_index

            return clients[i + direction][0]
        }
    }
}
