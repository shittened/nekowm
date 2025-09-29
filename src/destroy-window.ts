export function DestroyWindow(index: boolean, win: number, X: any, root: number, clients: any, variables: any) {
    if(clients.lenth == 0) {
        return
    }

    if(index) {
        let windows: any = []
    
        for(let i: number = 0; i < clients.length; i++) {
            if(clients[i][2] == variables.current_workspace) {
                windows.push(clients[i])
            }
        }

        if(windows.length == 0) {
            return
        }

        windows.sort((a: any, b: any) => a.at(-1) - b.at(-1))

        for(let i: number = 0; i < clients.length; i++) {
            if(clients[i] == windows[variables.focused_window_index]) {
                X.SetInputFocus(root, 0, 0)
                X.DestroyWindow(clients[i][0])
                clients.splice(i, 1)
            }
        }
    }

    else {
        for(let i: number = 0; i < clients.length; i++) {
            if(clients[i][0] == win) {
                X.SetInputFocus(root, 0, 0)
                X.DestroyWindow(clients[i][0])
                clients.splice(i, 1)
                break
             }
        }
    }
}
