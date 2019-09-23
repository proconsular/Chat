import { DID_GET_CHATS, DID_LEAVE_CHAT, DID_UPDATE_CHAT } from "../actions/types"

export default (state: any[] = [], action: any) => {
    let next = Object.assign([], state)

    switch(action.type) {
        case DID_GET_CHATS: {
            return Object.assign([], action.payload)
        }
        case DID_LEAVE_CHAT: {
            let index = next.findIndex((element: any) => {
                return element.id === action.payload.id
            })
            next.splice(index, 1)
            return next
        }
        case DID_UPDATE_CHAT: {
            let index = next.findIndex((element: any) => {
                return element.id === action.payload.id
            })
            next.splice(index, 1, action.payload)
            return next
        }
        default:
            return next
    }
}