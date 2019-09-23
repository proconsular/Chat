import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { sendSafe } from '../redux/actions'
import { GET_USERS, MAKE_CHAT } from '../redux/actions/types'
import { mergeStyleSets } from '@uifabric/merge-styles'
import { withRouter } from 'react-router'
import { History } from 'history'

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

const UsersView = ({users, open} : {users: any[], open: Function}) => {
    let [style] = useState(getStyles())

    return (
        <div className={style.view}>
            {users.map(user => {
                return (
                    <div className={style.user}>
                        <div>{user.username}</div>
                        <button onClick={() => open(user.id)}>Chat</button>
                    </div>
                )
            })}
        </div>
    )
}

const UsersController = ({ user, users, getUsers, chat, makeChat, history } : { user: any, users: any[], getUsers: Function, chat: any, makeChat: Function, history: History }) => {
    let [sent, setSent] = useState(false)

    useEffect(() => {
        getUsers()
    }, [users.length])

    useEffect(() => {
        if (chat.id !== undefined && sent) {
            history.push(`/chat?id=${chat.id}`)
        }
    }, [chat])

    let startChat = (other: number) => {
        let name = prompt("Name of Chat:", "New Chat")
        if (name !== undefined) {
            makeChat(name, [user.id, other])
            setSent(true)
        }
    }

    return <UsersView users={users.filter(other => other.id != user.id)} open={startChat} />
}

const mapToState = (state: any) => ({
    user: state.user,
    users: state.users,
    chat: state.chat,
})

const mapToDispatch = (dispatch: any) => ({
    getUsers: () => dispatch(sendSafe(GET_USERS, {})),
    makeChat: (name: string, users: number[]) => dispatch(sendSafe(MAKE_CHAT, {name, users}))
})

const container = (props: any) => (
    <UsersController {...props} />
)

export default withRouter<any, any>(connect(mapToState, mapToDispatch)(container))