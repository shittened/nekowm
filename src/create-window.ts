export function CreateWindow(event: any, X: any, root: number, resolution: number[], clients: any, variables: any, x11: any) {
    const event_masks: any = x11.eventMask.Exposure | x11.eventMask.StructureNotify | x11.eventMask.KeyPress | x11.eventMask.EnterWindow
    const win: number = event.wid

    X.CreateWindow(win, root, 0, 0, resolution[0], resolution[1], 0, 0, 0, 0, {eventMask: event_masks})
    X.MapWindow(win)
    X.ChangeWindowAttributes(win, {eventMask: event_masks, borderWidth: 4, borderPixel: 0xff000000})
    clients.push([win, 0, variables.current_workspace, clients.length])
}
