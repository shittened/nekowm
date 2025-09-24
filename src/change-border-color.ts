export function ChangeBorderColor(X: any, clients: any, variables: any) {
    let windows: any = []

    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][2] == variables.current_workspace) {
            windows.push(clients[i])
        }
    }

    windows.sort((a: any, b: any) => a.at(-1) - b.at(-1))

    for(let i: number = 0; i < windows.length; i++) {
        if(i == variables.focused_window_index) {
            X.ChangeWindowAttributes(windows[i][0], {borderPixel: 0xffffff})
        }

        else {
            X.ChangeWindowAttributes(windows[i][0], {borderPixel: 0xff000000})
        }
    }
}
