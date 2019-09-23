import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

const ProviderWrapper = ({ children=[], store }: {children: JSX.Element[] | JSX.Element, store: any}) => (
    <Provider store={store}>
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </Provider>
)

export default ProviderWrapper