import { DID_SIGNIN, DID_SIGNOUT } from "../actions/types"

const initialState = {
    online: false,
    username: "not-signed-in",
    id: 0,
    token: "",
    updated: new Date(0),
}

export default (state = Object.assign({}, initialState), action: any) => {
    let next = Object.assign({}, state)

    switch(action.type) {
        case DID_SIGNIN: {
            next.username = action.payload.username
            next.id = action.payload.id
            next.token = action.payload.token
            next.online = true
            next.updated = action.payload.updated
            localStorage.setItem('user', JSON.stringify(next))
            return next
        }
        case "LOAD_USER": {
            let data = localStorage.getItem('user')
            if (data) {
                return JSON.parse(data)                
            }
            return next
        }
        case DID_SIGNOUT: {
            localStorage.removeItem('user')
            return Object.assign({}, initialState)
        }
        default: {

            return next
        }
    }
}