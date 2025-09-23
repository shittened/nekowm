export function WindowChangeWorkspace(key_name: string, X: any, clients: any, variables: any, win: number) {
    const workspace = Math.floor(key_name.split('_')[1]) - 1

    if(workspace == variables.current_workspace) {
        return
    }

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][0] == win) {
            clients[i][2] = workspace
            X.UnmapWindow(clients[i][1])
            X.UnmapWindow(clients[i][0])
        }
    }
}
