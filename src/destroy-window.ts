export function DestroyWindow(win: number, X: any, root: number, clients: any) {
    for(let i: number = 0; i < clients.length; i++) {
        if(clients[i][0] == win) {
            X.SetInputFocus(root, 0, 0)

            X.DestroyWindow(clients[i][1])
            clients.splice(i, 1)
            break
         }
    }
}
