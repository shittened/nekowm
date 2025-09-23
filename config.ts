export const config: any = {}

config.mod = 'Mod4'
config.gaps = 8
config.layout = 'master-stack'
config.startup =  [
    'nitrogen --restore',
    'picom',
    'xfce4-power-manager',
]
