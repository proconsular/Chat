import { DID_GET_CHAT, DID_MAKE_CHAT, MAKE_CHAT } from "../actions/types"

export default (state = {users:[]}, action: any) => {
    let next = Object.assign({}, state)

    switch(action.type) {
        case DID_MAKE_CHAT:
        case DID_GET_CHAT: {
            return Object.assign({}, action.payload)
        }
        case MAKE_CHAT: {
            return {users: []}
        }
        default: 
            return next
    }
}