import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { mergeStyleSets } from '@uifabric/merge-styles'

import classnames from 'classnames'
import { sendSafe, send } from '../redux/actions'
import { GET_CHAT, GET_MESSAGES, SEND_MESSAGE, DID_GET_MESSAGE } from '../redux/actions/types'
import { withRouter } from 'react-router'

import querystring from 'query-string'
import { socket } from '../socket'

const getStyles = () => {
    return mergeStyleSets({
        box: {
            background: "#aaa",
            width: 500,
            height: 500,
            borderRadius: 2,
            position: "relative",
        },
        title: {
            background: "#ccc",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            padding: 4,
            paddingLeft: 16,
            paddingRight: 16,
        },
        name: {
            fontSize: 18,
            display: "inline-block",
            margin: 4,
            verticalAlign: "top",
        },
        members: {
            display: "inline-block",
            verticalAlign: "top",
        },
        user: {
            display: "inline-block",
            verticalAlign: "top",
            marginRight: 8,
            marginLeft: 8,
            fontSize: 18,
            background: "#3333",
            padding: 0,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 4,
        },
        content: {
            padding: 16,
            overflow: "scroll",
            height: "78%",
        },
        message: {
            background: "#888",
            padding: 4,
            paddingLeft: 8,
            paddingRight: 8,
            marginBottom: 12,
            borderRadius: 2,
        },
        usersMessage: {
            background: "#d88 !important"
        },
        compose: {
            position: "absolute",
            bottom: 0,
            padding: 0,
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            borderTop: "1px solid #444"
        },
        textbox: {
            border: "none",
            width: "80%",
            fontSize: 18,
            padding: 8,
            boxSizing: "border-box",
            borderBottomLeftRadius: 2,
        },
        sendButton: {
            border: "none",
            borderLeft: "1px solid #2225",
            width: "20%",
            fontSize: 18,
            padding: 8,
            borderBottomRightRadius: 2,
            background: "#999",
            boxSizing: "border-box",
            selectors: {
                ':hover': {
                    background: "#aaa"
                },
                ':active': {
                    background: "#ccc",
                }
            }
        }
    })
}

const ChatView = function ({user, chat = {users: []}, messages = [], send} : {user: any, chat: any, messages: any[], send: Function}) {
    let [style] = useState(getStyles())
    let [text, setText] = useState("")
    let [content, setContent] = useState()

    let enter = (event: any) => {
        if (event.keyCode === 13) {
            send(text)
            setText('')
        }
    }

    useEffect(() => {
        if (content !== undefined) {
            content.scrollTop = content.scrollHeight
        }
    }, [messages])

    return (
        <div className={style.box} onKeyDown={enter}>
            <div className={style.title}>
                <div className={style.name}>{chat.name}</div>
                <div className={style.members}>
                    {chat.users.map((other: any) => {
                        return (
                            <div className={classnames(style.user)} key={other.id}>{other.username}</div>
                        )
                    })}
                </div>
            </div>
            <div ref={ref => setContent(ref)} className={style.content}>
                {messages.map(message => {
                    return (
                        <div className={classnames(style.message, {[style.usersMessage]: user.id == message.senderId})} key={message.id}>
                            {message.contents}
                        </div>
                    )
                })}
            </div>
            <div className={style.compose}>
                <input className={style.textbox} type="text" value={text} onChange={e => setText(e.target.value)} />
                <button className={style.sendButton} onClick={() => {
                    send(text)
                    setText("")
                }}>Send</button>
            </div>
        </div>
    )
}

const ChatController = ({user, chat, getChat, messages, getMessages, gotMessage, sendMessage, location} : {user: any, chat: any, gotMessage: Function, messages: any[], getMessages: Function, getChat: Function, sendMessage: Function, location: Location}) => {
    useEffect(() => {
        const values = querystring.parse(location.search)
        getChat(values.id)
        getMessages(values.id)
    }, [chat.id])

    useEffect(() => {
        if (chat.id) {
            socket.on('message', (message: any) => {
                if (message.chatId === chat.id)
                    gotMessage(message)
            })
        }
        return () => {
            socket.off('message')
        }
    }, [chat.id])

    let send = (text: string) => {
        if (text != "")
            socket.emit('message', {contents: text, senderId: user.id, chatId: chat.id})
    }
    
    if (chat.users !== undefined) {
        return <ChatView user={user} chat={chat} messages={messages} send={send} />
    } else {
        return <div>Loading...</div>
    }
}

const mapToState = (state: any) => ({
    user: state.user,
    chat: state.chat,
    messages: state.messages,
})

const mapToDispatch = (dispatch: any) => ({
    getChat: (id: number) => dispatch(sendSafe(GET_CHAT, {id})),
    getMessages: (chatId: number) => dispatch(sendSafe(GET_MESSAGES, {chatId})),
    sendMessage: (contents: string, senderId: number, chatId: number) => dispatch(sendSafe(SEND_MESSAGE, {contents, senderId, chatId})),
    gotMessage: (message: any) => dispatch(send(DID_GET_MESSAGE, message))
})

const container = (props: any) => {
    return <ChatController {...props} />
}

export default withRouter<any, any>(connect(mapToState, mapToDispatch)(container))