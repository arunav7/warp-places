import { createContext } from 'react'

export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    userId: null,                 // will be fetched from DB when user signup or login
    login: () => {},
    logout: () => {}
})
