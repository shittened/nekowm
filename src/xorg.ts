export function SetNormalHints(X: any, win: number, width: number, height: number) {
    const hints = Buffer.alloc(18 * 4)

    const psize = 1 << 5
    const pminsize = 1 << 1
    const pmaxsize = 1 << 2
    const resizeinc = 1 << 16

    hints.writeUInt32LE(psize | pminsize | pmaxsize | resizeinc, 0)
    hints.writeUInt32LE(0, 4)
    hints.writeUInt32LE(0, 8)
    hints.writeUInt32LE(width, 12)
    hints.writeUInt32LE(height, 16)
    hints.writeUInt32LE(width, 20)
    hints.writeUInt32LE(height, 24)
    hints.writeUInt32LE(width, 28)
    hints.writeUInt32LE(height, 32)
    hints.writeUInt32LE(1, 36)
    hints.writeUInt32LE(1, 40)

    X.ChangeProperty(0, win, X.atoms.WM_NORMAL_HINTS, X.atoms.WM_SIZE_HINTS, 32, hints)
}

export function SetWMName(X: any, win: number, name: string) {
    X.ChangeProperty(0, win, X.atoms._NET_WM_NAME, X.atoms.UTF8_STRING, 8, Buffer.from(name))
}

export function SetNetWMState(X: any, win: number, states: number[]) {
    const buf = Buffer.alloc(states.length * 4)

    for(let i: number = 0; i < states.length; i++) {
        buf.writeUInt32LE(states[i], i * 4)
    }

    X.ChangeProperty(0, win, X.atoms._NET_WM_STATE, X.atoms.ATOM, 32, buf)
}

export function InitAtoms(X: any) {
    const atom_names = '_NET_WM_NAME'
    //const atom_names = [
    //    'WM_NORMAL_HINTS',
    //    '_NET_WM_NAME',
    //    'UTF8_STRING',
    //    '_NET_WM_STATE',
    //    '_NET_WM_STATE_MAXIMIZED_HORZ',
    //    '_NET_WM_STATE_MAXIMIZED_VERT',
    //]

    //X.InternAtom(false, atom_names, (err: any, atoms: Record<string, number>) => {
    X.InternAtom(false, atom_names, (err: any, atoms: any) => {
        if(err) throw err
        X.atoms = atoms
    })
}
