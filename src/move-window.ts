export function MoveWindow(win: number, clients: any, variables: any, direction: number) {
    let current_window_index: number
    let swapped_window_index: number
    let windows: any = []

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][2] == variables.current_workspace) {
            windows.push(clients[i])
        }
    }

    windows.sort((a: any, b: any) => a.at(-1) - b.at(-1))

    for(let i: number = 0; i < windows.length; i++) {
        if(windows[i][0] == win) {
            if(i + direction < 0 || i + direction > windows.length - 1) {
                return
            }

            current_window_index = windows[i][3]
            swapped_window_index = windows[i + direction][3]

            for(let j: number = 0; j < clients.length; j ++) {
                if(windows[i] == clients[j]) {
                    clients[j][3] = swapped_window_index
                }

                if(windows[i + direction] == clients[j]) {
                    clients[j][3] = current_window_index
                }
            }
        }
    }
}
