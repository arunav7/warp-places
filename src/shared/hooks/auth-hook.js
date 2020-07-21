import { useCallback, useEffect, useState } from 'react'

let logoutTimer
export const useAuth = () => {
  const [token, setToken] = useState()
  const [tokenExpiry, setTokenExpiry] = useState(null)
  const [userId, setUserId] = useState(null)

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token)
    setUserId(uid)
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000*60*60)
    setTokenExpiry(tokenExpirationDate)
    localStorage.setItem(
      'userData', 
      JSON.stringify({ 
        userId: uid, 
        token, 
        expiration: tokenExpirationDate.toISOString()
      }))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpiry(null)
    setUserId(null)              // Clearing the userId when user logs out
    localStorage.removeItem('userData')    // clearing token on logout
  }, [])
  
  useEffect(() => {
    if(token && tokenExpiry) {
      const remianingTime = tokenExpiry.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remianingTime)
    }else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpiry])

  // Auto Login if the page refresh is performed
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if(storedData && storedData.token && new Date(storedData.expiration) > new Date())
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
  }, [login])

  return { token, login, logout, userId }
}