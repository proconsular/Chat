
export const send = (type: string, payload: object) => ({
    type,
    payload,
})

export const sendSafe = (type: string, payload: object) => ({
    type,
    payload,
    secure: true,
})