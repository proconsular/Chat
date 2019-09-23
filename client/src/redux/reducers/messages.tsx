import { DID_GET_MESSAGES, DID_SEND_MESSAGE, DID_GET_MESSAGE } from "../actions/types"

export default (state: any[] = [], action: any) => {
    let next = Object.assign([], state)

    switch(action.type) {
        case DID_GET_MESSAGES: {
            return Object.assign([], action.payload)
        }
        case DID_SEND_MESSAGE: {
            return [...next, action.payload]
        }
        case DID_GET_MESSAGE: {
            return [...next, action.payload]
        }
        default:
            return next
    }
}