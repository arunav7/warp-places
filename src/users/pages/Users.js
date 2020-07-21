import React, { useEffect, useState, Fragment } from 'react'

import UserList from '../components/UserList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import Spinner from '../../shared/components/UIElements/Spinner'
import { useHttpClient } from '../../shared/hooks/http-hook'

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState()
    const { isLoading, error, sendRequest, clearErorr } = useHttpClient()

    // callback in useEffect should not be async as useEffect does not expects a promise
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`)
                setLoadedUsers(responseData.users)        // since server sends users array
                console.log(responseData.users.id)
            } catch(err) {}
        }
        fetchUsers()
    }, [sendRequest])       // no dependency implies that useEffect will only render once

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearErorr}/>
            {isLoading && (
                <div className='center'>
                    <Spinner />
                </div>
            )}
            {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
        </Fragment>
    )
}

export default Users