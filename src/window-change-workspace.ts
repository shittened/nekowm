export function WindowChangeWorkspace(key_name: string, X: any, clients: any, variables: any) {
    const workspace = Math.floor(key_name.split('_')[1]) - 1
    let windows: any = []

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][2] == variables.current_workspace) {
            windows.push(clients[i])
        }
    }

    windows.sort((a: any, b: any) => a.at(-1) - b.at(-1))

    if(workspace == variables.current_workspace) {
        return
    }

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i] == windows[variables.focused_window_index]) {
            clients[i][2] = workspace
            X.UnmapWindow(clients[i][1])
            X.UnmapWindow(clients[i][0])
        }
    }
}
