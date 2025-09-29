export function Bar(createCanvas: any, X: any, root: number, resolution: number[], config: any) {
    const bar: number = X.AllocID()
    const gc: number = X.AllocID()
    const canvas: any = createCanvas(resolution[0], 40)
    const c: any = canvas.getContext('2d')

    X.CreateWindow(bar, root, config.bar_margin_lr - config.bar_border, config.gaps - config.bar_border, resolution[0] - config.bar_margin_lr * 2, config.bar_height, 0, 0, 0, 
    //X.CreateWindow(bar, root, 0, 0, resolution[0], 40, 0, 0, 0, 
        {eventMask: 0, backgroundPixel: 0x000000})
        //{eventMask: 0})
    X.MapWindow(bar)
    X.CreateGC(gc, bar)

    c.fillStyle = '#000000'
    c.fillRect(0, 0, resolution[0] - config.bar_margin_lr * 2, config.bar_height)
    //c.fillRect(0, 0, resolution[0], 40)
    c.fillStyle = '#ffffff'
    c.font = 'bold 20px CodeNewRoman Nerd Font'
    c.fillText('Ohayo onii-chan', 20, 20)

    const buffer: any = canvas.toBuffer('raw')

    //X.PutImage(2, bar, gc, resolution[0], config.bar_height, 0, 0, 0, 24, buffer)
    X.PutImage(2, bar, gc, resolution[0], 40, 0, 0, 0, 24, buffer)

    X.ChangeWindowAttributes(bar, {eventmask: 0, backgroundPixel: 0x000000, borderWidth: 4, borderPixel: 0xffffff})
    X.ConfigureWindow(bar, {borderWidth: config.bar_border})
}
