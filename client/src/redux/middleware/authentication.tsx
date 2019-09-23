
export const authenticate = (store: any) => (next: any) => (action: any) => {
    if (action.secure) {
        action.payload.token = store.getState().user.token
    }
    next(action)
}