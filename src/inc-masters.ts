export function IncMasters(variables: any, amount: number) {
    let future_masters: number = variables.masters

    future_masters += amount

    if(future_masters < 1) {
        return
    }

    variables.masters = future_masters
}
