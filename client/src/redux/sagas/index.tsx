import * as users from "./users"

export const initSagas = (sagaMiddleware: any) => {
    let sagas: any[] = [
        ...Object.values(users)    
    ]
    sagas.forEach(sagaMiddleware.run.bind(sagaMiddleware))
}

