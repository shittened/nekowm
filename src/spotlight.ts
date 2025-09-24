export function Spotlight(X: any, clients: any, variables: any, resolution: number[]) {
    if(clients.length == 0) {
        return
    }

    let windows: any = []

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][2] == variables.current_workspace) {
            windows.push(clients[i])
        }
    }

    if(windows.length != 1) {
        return
    }

    
    //X.ConfigureWindow(windows[0][0], {
    //    x: 0,
    //    y: 0,
    //    width: Math.floor(resolution[0] / 1.5),
    //    height: Math.floor(resolution[1] / 1.5)
    //})

    X.ConfigureWindow(windows[0][0], {
        x: resolution[0] / 6,
        y: resolution[1] / 6,
        width: Math.floor(resolution[0] / 1.5),
        height: Math.floor(resolution[1] / 1.5)
    })
}
