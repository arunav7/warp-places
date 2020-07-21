import React, { useEffect, useState, Fragment, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import './PlaceForm.css'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import Card from '../../shared/components/UIElements/Card'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Spinner from '../../shared/components/UIElements/Spinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { AuthContext } from '../../shared/context/auth-context'



const EditPlace = () => {
    const placeId = useParams().placeId
    const [loadedPlace, setLoadedPlace] = useState()
    const history = useHistory()
    const auth = useContext(AuthContext)

    const {isLoading, error, sendRequest, clearErorr} = useHttpClient()
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    )
    
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
                setLoadedPlace(responseData.place)
                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true
                        }
                    },
                    true
                )
            }catch(error) {}
        }
        fetchPlace()
    }, [sendRequest, placeId, setFormData])

    if(isLoading) {
        return (
            <div className='center'>
                <Spinner />
            </div>
        )
    }

    if(!loadedPlace && !error) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find any place</h2>
                </Card>
            </div>
        )
    }
    
    const submitHandler = async (event) => {
        event.preventDefault()

        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 
                'PATCH', 
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }), 
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            )
            history.push(`/${auth.userId}/places`)
        }catch(err) {}
    }

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearErorr} />
            {!isLoading && loadedPlace && (
                <form className='place-form' onSubmit={submitHandler}>
                    <Input 
                        label='Title' 
                        type='text'
                        id='title' 
                        element='input' 
                        validators={[VALIDATOR_REQUIRE()]} 
                        errorText='Please enter a valid Title.'
                        onInput={inputHandler}
                        initialValue={loadedPlace.title}
                        initialValid={true}
                    />
                    <Input 
                        label='Description' 
                        id='description' 
                        element='textarea' 
                        validators={[VALIDATOR_MINLENGTH(5)]} 
                        errorText='Please enter a valid description(at least 5 characters).'
                        onInput={inputHandler}
                        initialValue={loadedPlace.description}
                        initialValid={true}
                    />
                    <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
                </form>
            )}
        </Fragment>
    )
}

export default EditPlace