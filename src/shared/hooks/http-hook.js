import { useCallback, useState, useRef, useEffect } from "react"

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const activeHttpRequest = useRef([])

    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setIsLoading(true)
            const httpAbortCtrl = new AbortController()    // aborts the http request if user switch between the pages while data is fetched
            activeHttpRequest.current.push(httpAbortCtrl)

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: httpAbortCtrl.signal
                })
                const responseData = await response.json()

                activeHttpRequest.current.filter(
                    reqCtrl => reqCtrl !== httpAbortCtrl
                )

                if(!response.ok){
                    throw new Error(responseData.message)
                }
                setIsLoading(false)
                return responseData
            } catch(err) {
                setError(err.message)
                setIsLoading(false)
                throw err
            }
        }, 
    [])

    useEffect(() => {
        return () => {
            activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, [])

    const clearErorr = () => {
        setError(null)
    }

    return { isLoading, error, sendRequest, clearErorr }
}