import React, { useState, FormEvent } from 'react'
import { connect } from 'react-redux'
import { send } from '../redux/actions'
import { SIGNIN } from '../redux/actions/types'

const SignInForm = ({signin} : {signin: Function}) => {
    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")

    let submit = (event: FormEvent) => {
        event.preventDefault()

        signin(username, password)
    }

    return (
        <div>
            Sign In:
            <form onSubmit={submit}>
                <input type="text" placeholder="Username" name="username" onChange={e => setUsername(e.target.value)} value={username} />
                <input type="password" placeholder="Password" name="password" onChange={e => setPassword(e.target.value)} value={password} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

const mapToDispatch = (dispatch: Function) => ({
    signin: (username: string, password: string) => dispatch(send(SIGNIN, {username, password}))
})

const container = (props: any) => (
    <SignInForm {...props} />
)

export default connect(null, mapToDispatch)(container)
