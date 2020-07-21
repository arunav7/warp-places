import React, { useContext, Fragment } from 'react'
import { useHistory } from 'react-router-dom'

import './PlaceForm.css'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import Spinner from '../../shared/components/UIElements/Spinner'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'

const NewPlace = () => {
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearErorr } = useHttpClient()
    const history = useHistory()

    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
        false
    )
    
    const submitHandler = async event => {
        event.preventDefault()
        
        try {
            const formData = new FormData()
            formData.append('title', formState.inputs.title.value)
            formData.append('description', formState.inputs.description.value)
            formData.append('address', formState.inputs.address.value)
            formData.append('image', formState.inputs.image.value)
            
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places`, 'POST', formData, {
                Authorization: 'Bearer ' + auth.token
            })
            history.push('/')
        } catch(err) {}
    }

    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearErorr}/>
            <form className='place-form' onSubmit={submitHandler}>
                {isLoading && <Spinner asOverlay/>}
                <Input 
                    label='Title' 
                    type='text'
                    id='title' 
                    element='input' 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText='Please enter a valid Title.'
                    onInput={inputHandler}
                />
                <Input 
                    label='Description'
                    id='description' 
                    element='textarea' 
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorText='Please enter a valid Description(at least 5 char).'
                    onInput={inputHandler}
                />
                <Input 
                    label='Address' 
                    type='text'
                    id='address' 
                    element='input' 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText='Please enter a valid Address.'
                    onInput={inputHandler}
                />
                <ImageUpload id='image' onInput={inputHandler} center/>
                <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
            </form>
        </Fragment>
    )
}

export default NewPlace