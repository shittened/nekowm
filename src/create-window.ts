export function CreateWindow(event: any, X: any, root: number, resolution: number[], clients: any, variables: any, x11: any) {
    const event_masks_create: any = x11.eventMask.Exposure | x11.eventMask.StructureNotify
    const event_masks: any = x11.eventMask.Exposure | x11.eventMask.StructureNotify | x11.eventMask.KeyPress
    const win: number = event.wid
    const frame: number = X.AllocID()

    //if(clients.length == 4) return
    //Exec('echo ' + clients.length + ' >> ./logs.txt')

    X.CreateWindow(frame, root, 0, 0, resolution[0], resolution[1], 0, 0, 0, 0, {eventMask: event_masks_create})

    X.ReparentWindow(win, frame, 0, 0);
    X.MapWindow(frame)
    X.MapWindow(win)

    X.ChangeWindowAttributes(win, {eventMask: event_masks})

    clients.push([win, frame, variables.current_workspace, clients.length])
}
