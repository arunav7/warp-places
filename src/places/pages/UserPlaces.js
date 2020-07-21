import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'

import PlaceList from '../components/PlaceList'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import Spinner from '../../shared/components/UIElements/Spinner'

const UserPlaces = (props) => {
    const [loadedPlaces, setLoadedPlaces] = useState()
    const { isLoading, error, sendRequest, clearErorr } = useHttpClient()

    const userId = useParams().userId         // stores the route parameter using the useParams hook
    
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`)
                setLoadedPlaces(responseData.places)
            }catch(err) {}
        }
        fetchPlaces()
    }, [sendRequest, userId])

    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
    }

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearErorr}/>
            {isLoading && (
                <div className='center'>
                    <Spinner />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDelete={placeDeleteHandler}/>}
        </Fragment>
    )
}

export default UserPlaces
