export function ResizeWindow(clients: any, variables: any, direction: number[]) {
    //let windows: any = []

    //for(let i: number = 0; i < clients.length; i++) {
    //    if(clients[i][2] == variables.current_workspace) {
    //        windows.push(clients[i])
    //    }
    //}

    //windows.sort((a: any, b: any) => a.at(-1) - b.at(-1))

    //for(let j: number = 0; j < clients.length; j++) {
    //    if(clients[j] == windows[variables.focused_window_index]) {
    //        clients[j][1] += direction[1]
    //    }

    //    else {
    //        if(variables.focused_window_index >= variables.masters) { //stack
    //            if(j >= variables.masters) {
    //                clients[j][1] -= direction[1]
    //            }
    //        }

    //        else { //master
    //            if(j < variables.masters) {
    //                clients[j][1] -= direction[1]
    //            }
    //        }
    //    }
    //}

    variables.master_width += direction[0]
}
