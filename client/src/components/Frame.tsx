import React, { useState } from 'react'
import { mergeStyleSets } from '@uifabric/merge-styles'
import { NavLink } from 'react-router-dom'
import FriendsPresentor from '../pages/Friends.page'
import { sendSafe } from '../redux/actions'
import { SIGNOUT } from '../redux/actions/types'
import { connect } from 'react-redux'

const getStyles = () => {
    return mergeStyleSets({
        main: {
            background: "#444",
            margin: 0,
        },
        bar: {
            background: "#777",
            padding: 18,
            paddingTop: 12,
            paddingBottom: 12,
            borderBottom: "1px solid #111",
            fontSize: 18,
        },
        contents: {
            padding: 18,
        },
        account: {
            background: "#9997",
            verticalAlign: "top",
            display: "inline-block",
            width: 150,
            padding: 4,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 4,
            cursor: "pointer",
            selectors: {
                'div': {
                    display: "inline-block",
                    verticalAlign: "middle",
                },
                ':hover': {
                    background: "#999d",
                }
            }
        },
        icon: {
            background: "#eee",
            width: 20,
            height: 20,
            borderRadius: 30,
            display: "inline-block"
        },
        username: {
            textAlign: "center",
            padding: 2,
            float: "right",
            color: "#eee",
        },
        navbar: {
            display: 'inline-block',
            verticalAlign: "top",
            padding: 4,
            selectors: {
                'ul': {
                    listStyle: "none",
                },
                'li': {
                    display: "inline-block",
                    marginLeft: 4,
                    marginRight: 4,
                    selectors: {
                        ':first-child': {
                            marginLeft: 0,
                        }
                    }
                },
                'a': {
                    textDecoration: "none",
                    color: "#eeea",
                    // background: "#eee3",
                    padding: 4,
                    paddingLeft: 12,
                    paddingRight: 12,
                    borderRadius: 2,
                    selectors: {
                        ':hover': {
                            background: "#eee3",
                            color: "#eeef",
                        }
                    }
                }
            }
        }
    })
}

const FramePresentor = ({user, signout, children} : {user: any, signout: Function, children: JSX.Element[] | JSX.Element}) => {
    const [style] = useState(getStyles())

    return (
        <div className={style.main}>
            <div className={style.bar}>
                <div className={style.navbar}>
                    <ul>
                        <li>
                            <NavLink to="/">Front</NavLink>
                        </li>
                        <li>
                            <NavLink to="/friends">Friends</NavLink>
                        </li>
                        <li>
                            <NavLink to="/groups">Groups</NavLink>
                        </li>
                        <li>
                            <NavLink to="/popular">Popular</NavLink>
                        </li>
                    </ul>
                </div>
                <div className={style.account}>
                    <div className={style.icon}></div>
                    <div className={style.username}>{user.username}</div>
                </div>
                <div>
                    <a onClick={() => signout()}>Signout</a>
                </div>
            </div>
            <div className={style.contents}>
                {children}
            </div>
        </div>
    )
}

const FrameController = ({user, signout, children} : {user: any, signout: Function, children: JSX.Element[] | JSX.Element}) => {

    return (
        <FramePresentor user={user} signout={() => signout(user.username)}>
            {children}
        </FramePresentor>
    )
}

const mapToState = (state: any) => ({
    user: state.user
})

const mapToDispatch = (dispatch: Function) => ({
    signout: (username: string) => dispatch(sendSafe(SIGNOUT, {username}))
})

const container = (props: any) => (
    <FrameController {...props} />
)

export default connect(mapToState, mapToDispatch)(container)