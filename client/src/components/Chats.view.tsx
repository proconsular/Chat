import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { sendSafe } from '../redux/actions'
import { GET_USERS, GET_CHATS, LEAVE_CHAT, UPDATE_CHAT } from '../redux/actions/types'
import { mergeStyleSets } from '@uifabric/merge-styles'
import { History } from 'history'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { socket } from '../socket'

const getStyles = () => {
    return mergeStyleSets({
        view: {
            background: "#aaa",
            width: 500,
            minHeight: 300,
            padding: 18,
            paddingLeft: 24,
            paddingRight: 24,
            borderRadius: 4,
            border: "1px solid #555",
            boxShadow: "0px 0px 3px 3px #3335",
        },
        user: {
            width: 100,
            height: 100,
            background: "#4442",
            padding: 12,
            borderRadius: 2,
            display: 'inline-block',
            marginLeft: 8,
            marginRight: 8,
            margin: 8,
            selectors: {
                ':hover': {
                    background: "#4445",
                }
            }
        }
    })
}

const ChatsView = ({chats, open, leave, rename} : {chats: any[], open: Function, leave: Function, rename: Function}) => {
    let [style] = useState(getStyles())

    return (
        <div className={style.view}>
            {chats.map(chat => {
                return (
                    <div className={style.user}>
                        <div>{chat.name}</div>
                        <button onClick={() => open(chat.id)}>Open</button>
                        <button onClick={() => rename(chat.id)}>Rename</button>
                        <button onClick={() => leave(chat.id)}>Leave</button>
                    </div>
                )
            })}
        </div>
    )
}

const ChatsController = ({ user, chats, getChats, leaveChat, updateChat, history } : { user: any, chats: any[], getChats: Function, leaveChat: Function, updateChat: Function, history: History }) => {

    useEffect(() => {
        getChats(user.id)
    }, [])

    let open = (id: number) => {
        history.push(`/chat?id=${id}`)
    }

    let leave = (id: number) => {
        leaveChat(user.id, id)
    }

    let rename = (id: number) => {
        let name = window.prompt("Name: ")
        if (name) {
            updateChat(id, name)
        }
    }

    return <ChatsView chats={chats} open={open} rename={rename} leave={leave} />
}

const mapToState = (state: any) => ({
    user: state.user,
    chats: state.chats
})

const mapToDispatch = (dispatch: any) => ({
    getChats: (userId: number) => dispatch(sendSafe(GET_CHATS, {userId})),
    leaveChat: (userId: number, id: number) => dispatch(sendSafe(LEAVE_CHAT, {userId, id})),
    updateChat: (id: number, name: string) => dispatch(sendSafe(UPDATE_CHAT, {id, name}))
})

const container = (props: any) => (
    <ChatsController {...props} />
)

export default withRouter<any, any>(connect(mapToState, mapToDispatch)(container))