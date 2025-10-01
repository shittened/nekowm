export const config: any = {}

config.mod = 'Mod4'
config.gaps = 8
config.layout = 'master-stack'
config.startup =  [
    'nitrogen --restore',
    'picom',
    'xfce4-power-manager',
]
config.border_width = 4
config.bar_height = 30
config.bar_margin_lr = 20
config.bar_border = 4
config.bar_widgets = ['Ohayo','$time', '$date']
