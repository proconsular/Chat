import { DID_GET_USERS } from '../actions/types'

export default (state = [], action: any) => {
    let next = Object.assign([], state)

    switch (action.type) {
        case DID_GET_USERS: {
            return Object.assign([], action.payload)
        }
        default: {
            break
        }
    }

    return next
}