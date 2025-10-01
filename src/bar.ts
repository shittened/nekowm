export function Bar(createCanvas: any, X: any, root: number, resolution: number[], config: any, variables: any) {
    const bar: number = X.AllocID()
    const gc: number = X.AllocID()
    const canvas: any = createCanvas(resolution[0], 40)
    const c: any = canvas.getContext('2d')

    X.CreateWindow(bar, root, config.bar_margin_lr - config.bar_border, config.gaps - config.bar_border, resolution[0] - config.bar_margin_lr * 2, config.bar_height, 0, 0, 0, {eventMask: 0, backgroundPixel: 0x000000})
    X.MapWindow(bar)
    X.CreateGC(gc, bar)

    function Update() {
        const datetime: any = new Date()
        const widgets: string[] = []

        let dt: any = {
            hour: String(datetime.getHours()),
            minute: String(datetime.getMinutes()),
            day: String(datetime.getDay()),
            month: String(datetime.getMonth()),
            year: String(Math.floor(datetime.getYear()) + 1900)
        }

        for(const [key, value] of Object.entries(dt)) {
            if(value.length == 1) {
                dt[key] = '0' + value
            }
        }


        const time: string = dt.hour + ':' + dt.minute
        let date: string = String(dt.day + '.' + dt.month + '.' + dt.year)

        config.bar_widgets.forEach(widget => {
            if(widget.charAt(0) == '$') {
                switch(widget) {
                    case '$date':
                        widgets.push(date)
                        break
                    case '$time':
                        widgets.push(time)
                        break
                }
            }

            else {
                widgets.push(widget)
            }
        })

        c.fillStyle = '#000000'
        c.fillRect(0, 0, resolution[0] - config.bar_margin_lr * 2, config.bar_height)
        c.fillStyle = '#ffffff'
        c.font = 'bold 20px CodeNewRoman Nerd Font Mono'
        c.textAlign = 'right'
        c.fillText(widgets.join(' | '), resolution[0] - config.bar_margin_lr - config.bar_border - 30, Math.floor(config.bar_height / 1.4))
        c.textAlign = 'left'
        for(let i: number = 0; i < 9; i++) {
            if(i == variables.current_workspace) {
                c.fillStyle = '#ffffff'
                c.fillRect(config.bar_margin_lr - 15 + i * 20, 0, 20, config.bar_height)
                c.fillStyle = '#000000'
            }
            else {
                c.fillStyle = '#ffffff'
            }
            c.fillText(String(i + 1), config.bar_margin_lr - 10 + i * 20, Math.floor(config.bar_height/ 1.4))
        }
        //c.fillRect(200, 0, 200, config.bar_height)

        X.PutImage(2, bar, gc, resolution[0], 40, 0, 0, 0, 24, canvas.toBuffer('raw'))

    }
    X.ChangeWindowAttributes(bar, {eventmask: 0, backgroundPixel: 0x000000, borderWidth: 4, borderPixel: 0xffffff})
    X.ConfigureWindow(bar, {borderWidth: config.bar_border})
    setInterval(Update, 200)
}
