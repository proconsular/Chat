
export default (state: any[] = [], action: any) => {
    let next = Object.assign([], state)

    if (action.type.startsWith("DID")) {
        return [...next, action]
    }

    return next
}