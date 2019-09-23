import React, { FormEvent, useState } from 'react'
import { connect } from 'react-redux'
import { SIGNUP } from '../redux/actions/types'
import { send } from '../redux/actions'

const SignUpForm = ({signup} : {signup: Function}) => {
    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    let [confirmPassword, setConfirmPassword] = useState("")

    let submit = (event: FormEvent) => {
        event.preventDefault()

        if (password === confirmPassword) {
            signup(username, password)
        }
    }


    return (
        <div>
            Sign Up:
            <form onSubmit={submit}>
                <input type="text" placeholder="Username" name="username" onChange={e => setUsername(e.target.value)} value={username} />
                <input type="password" placeholder="Password" name="password" onChange={e => setPassword(e.target.value)} value={password} />
                <input type="password" placeholder="Retype password" name="reenter-password" onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

const mapToState = (state: any) => ({
    user: state.user
})

const mapToDispatch = (dispatch: Function) => ({
    signup: (username: string, password: string) => dispatch(send(SIGNUP, {username, password}))
})

const container = (props: any) => (
    <SignUpForm {...props} />
)

export default connect(mapToState, mapToDispatch)(container)