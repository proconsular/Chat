import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { send, sendSafe } from '../redux/actions';
import AuthPage from './AuthPage';
import { SIGNOUT, GET_USERS } from '../redux/actions/types';
import FramePresentor from './Frame';
import { Switch, Route } from 'react-router';
import FrontPresentor from '../pages/Front.page';
import PopularPresentor from '../pages/Popular.page';
import GroupsPresentor from '../pages/Groups.page';
import FriendsPresentor from '../pages/Friends.page';
import ChatPage from '../pages/Chat.page'

const MainRouterComp = ({ user, loadUser, signout, users, getUsers }: {user: any, loadUser: Function, signout: Function, users: [], getUsers: Function}) => {

    useEffect(() => {
        loadUser()
    }, [user.id])

    useEffect(() => {
        if (user.online) {
            getUsers()
        }
    }, [user.online])

    if (user.online) {
        return (
            <FramePresentor>
                <Switch>
                    <Route path="/popular" component={PopularPresentor} />
                    <Route path="/groups" component={GroupsPresentor} />
                    <Route path="/friends" component={FriendsPresentor} />
                    <Route path="/chat" component={ChatPage} />
                    <Route exact path="/" component={FrontPresentor} />
                </Switch>
            </FramePresentor>
        )
    } else {
        return <AuthPage />
    }
}

const stateMapping = (state: any) => ({
    user: state.user,
    users: state.users,
})

const dispatchMapping = (dispatch: any) => ({
    loadUser: () => dispatch(send("LOAD_USER", {})),
    signout: (username: string) => dispatch(send(SIGNOUT, {username})),
    getUsers: () => dispatch(sendSafe(GET_USERS, {}))
})

const container = (props: any) => (
    <MainRouterComp {...props} />
)

export default connect(stateMapping, dispatchMapping)(container)