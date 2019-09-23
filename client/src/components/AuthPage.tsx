import React, { useState } from 'react'
import SignUpForm from './SignupForm'
import SignInForm from './SigninForm'

import { mergeStyleSets } from '@uifabric/merge-styles'

const getStyles = () => {
    return mergeStyleSets({
        box: {
            width: 300,
            padding: 20,
            background: "#444",
            marginLeft: "auto",
            marginRight: "auto",
            color: "#ddd",
            fontSize: 20,
            selectors: {
                'input': {
                    display: "block",
                    margin: 8,
                    marginLeft: 0,
                    marginRight: 0,
                    width: "100%",
                    boxSizing: "border-box",
                }
            }
        }
    })
}

const AuthPage = () => {
    let [style] = useState(getStyles())
    let [signIn, setSignIn] = useState(true)

    let form = signIn ? <SignInForm /> : <SignUpForm />

    return (
        <div className={style.box}>
            {form}
            <div>
                {signIn ? (
                    <button onClick={() => setSignIn(false)}>Need an account?</button>
                ) : (
                    <button onClick={() => setSignIn(true)}>Already have an account?</button>
                )}
            </div>
        </div>
    )
}

export default AuthPage