const x11 = require('x11') as any

x11.createClient({display: ':1'}, (err: any, display: any, ) => {

    if(err) {
        throw err
    }

    const X: any = display.client
    const root: number = display.screen[0].root
    const resolution: number[] = [display.screen[0].pixel_width, display.screen[0].pixel_height]

    X.ChangeWindowAttributes(root, {
        eventMask: x11.eventMask.SubstructureRedirect | x11.eventMask.SubstructureNotify
    }, (err: any) => {
        if (err) {
            console.error('Another WM already running')
            process.exit(1)
        }
    })

    console.log('Welcome to nekowm')
    //console.log(display.screen[0])

    X.on('event', (event: any) => {
        console.log('X event:', event)
        switch(event.name) {
            case 'MapRequest':
                CreateWindow(event, X, root, resolution)
                break
        }
    })

    X.on('error', (err: any) => {
        console.error('X error:', err)
    })
})

function CreateWindow(event: any, X: any, root: number, resolution: number[]) {
    const win: number = event.wid
    const frame: number = X.AllocID()
    X.CreateWindow(frame, root, 0, 0, resolution[0], resolution[1], 0, 0, 0, 0, {eventMask: x11.eventMask.Exposure})
    X.ReparentWindow(win, frame, 0, 0);
    X.ChangeWindowAttributes(win, {
        eventMask: x11.eventMask.Exposure | x11.eventMask.StructureNotify
    })
    X.MapWindow(frame)
    X.MapWindow(win)
}
