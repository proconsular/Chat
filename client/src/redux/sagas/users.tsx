import { takeLatest, put, call } from 'redux-saga/effects'
import { SIGNUP, SIGNIN, DID_SIGNIN, SIGNOUT, DID_SIGNOUT, GET_USERS, DID_GET_USERS, GET_CHATS, DID_GET_CHATS, DID_GET_CHAT, GET_CHAT, DID_GET_MESSAGES, GET_MESSAGES, SEND_MESSAGE, DID_SEND_MESSAGE, MAKE_CHAT, DID_MAKE_CHAT, LEAVE_CHAT, DID_LEAVE_CHAT, UPDATE_CHAT, DID_UPDATE_CHAT } from '../actions/types'
import { send } from '../actions'

class Request {
    method: string
    url: string
    token: string

    constructor(method: string, url: string) {
        this.method = method
        this.url = url
        this.token = ""
    }

    async send(body: object | undefined = undefined): Promise<Response> {
        let data: any = {
            method: this.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }
        if (body !== undefined)
            data = {...data, body: JSON.stringify(body)}
        if (this.token != "")
            data.headers.authorization = "Bearer " + this.token
        return fetch(this.url, data)
    }
}

export function* signup() {
   yield takeLatest(SIGNUP, function* (data: any) {
        try {
            let request = new Request('POST', '/api/accounts')
            let response = yield request.send(data.payload)
            let json = yield response.json()
            if (json.error) {
                throw new Error(json)
            }
            yield performSignin(data)
        } catch (err) {
            console.log(err)
        }
   })
}

export function* signin() {
    yield takeLatest(SIGNIN, performSignin)
}

function* performSignin (data: any) {
    try {
        let username = data.payload.username
        let password = data.payload.password
        let request = new Request('GET', `/api/accounts?username=${username}&password=${password}`)
        let response = yield request.send()
        let json = yield response.json()
        if (json.error) {
            throw new Error("Wrong username/password")
        }
        json.updated = new Date()
        yield put(send(DID_SIGNIN, json))
    } catch (err) {
        console.log(err)
    }
}

export function* signout() {
    yield takeLatest(SIGNOUT, function* (data: any) {
        try {
            let username = data.payload.username
            let request = new Request('PUT', `/api/accounts?username=${username}`)
            let response = yield request.send({online: false})
            let json = yield response.json()
            if (json.error) {
                throw new Error(json)
            }
            yield put(send(DID_SIGNOUT, {}))
        } catch (err) {
            console.log(err)
        }
    })
}

export function* getUsers() {
    yield takeLatest(GET_USERS, function* (data: any) {
        try {
            let request = new Request('GET', '/api/users')
            request.token = data.payload.token
            let response = yield request.send()
            let json = yield response.json()
            if (json.error) {
                console.log(json)
                throw new Error("Cannot load users.")
            }
            yield put(send(DID_GET_USERS, json))
        } catch (err) {
            console.log(err)
        }
    })
}

export function* getChats() {
    yield takeLatest(GET_CHATS, function* (data: any) {
        try {
            let request = new Request('GET', `/api/chats?userId=${data.payload.userId}`)
            request.token = data.payload.token
            let response = yield request.send()
            let json = yield response.json()
            if (json.error) {
                throw new Error("Cannot get chats.")
            }
            yield put(send(DID_GET_CHATS, json))
        } catch (err) {
            console.log(err)
        }
    })
}

export function* getChat() {
    yield takeLatest(GET_CHAT, function* (data: any) {
        try {
            let request = new Request('GET', `/api/chats?id=${data.payload.id}`)
            request.token = data.payload.token
            let response = yield request.send()
            let json = yield response.json()
            if (json.error) {
                throw new Error("Cannot get chat.")
            }
            yield put(send(DID_GET_CHAT, json))
        } catch (err) {
            console.log(err)
        }
    })
}

export function* makeChat() {
    yield takeLatest(MAKE_CHAT, function* (data: any) {
        try {
            let request = new Request('POST', `/api/chats`)
            request.token = data.payload.token
            let response = yield request.send({
                name: data.payload.name,
                users: data.payload.users
            })
            let json = yield response.json()
            if (json.error) {
                throw new Error("Cannot make chat.")
            }
            yield put(send(DID_MAKE_CHAT, json))
        } catch (err) {
            console.log(err)
        }
    })
}

export function* getMessages() {
    yield takeLatest(GET_MESSAGES, function* (data: any) {
        try {
            let request = new Request('GET', `/api/messages?chatId=${data.payload.chatId}`)
            request.token = data.payload.token
            let response = yield request.send()
            let json = yield response.json()
            if (json.error) {
                throw new Error("Cannot get messages.")
            }
            yield put(send(DID_GET_MESSAGES, json))
        } catch (err) {
            console.log(err)
        }
    })
}

export function* sendMessage() {
    yield takeLatest(SEND_MESSAGE, function* (data: any) {
        try {
            let request = new Request('POST', `/api/messages`)
            request.token = data.payload.token
            let response = yield request.send({
                contents: data.payload.contents,
                senderId: data.payload.senderId,
                chatId: data.payload.chatId
            })
            let json = yield response.json()
            if (json.error) {
                throw new Error("Cannot send message.")
            }
            yield put(send(DID_SEND_MESSAGE, json))
        } catch (err) {
            console.log(err)
        }
    })
}

export function* leaveChat() {
    yield takeLatest(LEAVE_CHAT, function* (data: any) {
        try {
            let request = new Request('DELETE', `/api/chats?userId=${data.payload.userId}&id=${data.payload.id}`)
            request.token = data.payload.token
            let response = yield request.send()
            let json = yield response.json()
            if (json.error) {
                throw new Error("Cannot send message.")
            }
            yield put(send(DID_LEAVE_CHAT, {object: json.object, ...data.payload}))
        } catch (err) {
            console.log(err)
        }
    })
}

export function* updateChat() {
    yield takeLatest(UPDATE_CHAT, function* (data: any) {
        try {
            let request = new Request('PUT', `/api/chats?id=${data.payload.id}`)
            request.token = data.payload.token
            let body = Object.assign({}, data.payload)
            delete body.id
            let response = yield request.send(body)
            let json = yield response.json()
            if (json.error) {
                throw new Error("Cannot update chat.")
            }
            delete data.payload.token
            yield put(send(DID_UPDATE_CHAT, data.payload))
        } catch (err) {
            console.log(err)
        }
    })
}
