import React from 'react';
import ProviderWrapper from './ProviderWrapper';
import { getStore } from './redux/store';
import MainRouter from './components/MainRouter';

const App = () => {
    return (
        <ProviderWrapper store={getStore()}>
            <MainRouter />
        </ProviderWrapper>
    ) 
}

export default App;
