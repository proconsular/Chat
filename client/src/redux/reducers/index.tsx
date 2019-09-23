import { combineReducers } from 'redux'

import user from './user'
import users from './users'
import chat from './chat'
import chats from './chats'
import messages from './messages'
import notifications from './notifications'

export default combineReducers({
    user,
    users,
    chat,
    chats,
    messages,
    notifications,
})