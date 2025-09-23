export function ChangeWorkspace(key_name: string, X: any, clients: any, variables: any) {
    const workspace = Math.floor(key_name.split('_')[1]) - 1

    if(workspace == variables.current_workspace) {
        return
    }

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][2] == workspace) {
            X.MapWindow(clients[i][1])
            X.MapWindow(clients[i][0])
        }
        
        else {
            X.UnmapWindow(clients[i][1])
            X.UnmapWindow(clients[i][0])
        }
    }

    variables.current_workspace = workspace
}
