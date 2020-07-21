import React, { useState, useContext} from 'react'

import './Auth.css'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import Card from '../../shared/components/UIElements/Card'
import { AuthContext } from '../../shared/context/auth-context'
import Spinner from '../../shared/components/UIElements/Spinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'

const Auth = () => {
    const auth = useContext(AuthContext)
    const [isLoginMode, setLoginMode] = useState(true)
    const { isLoading, error, sendRequest, clearErorr } = useHttpClient()

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    )

    const switchModeHandler = () => {
        if(!isLoginMode) {               // Switching from SIGNUP to LOGIN
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined
                }, 
                formState.inputs.email.isValid && formState.inputs.password.isValid
            )
        }else {                         // Switching from LOGIN to SIGNUP
            setFormData(
                {
                    ...formState.inputs,
                    name : {
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
        }
        setLoginMode(prevMode => !prevMode)
    }

    const submitHandler = async event => {
        event.preventDefault()

        if(isLoginMode){
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/login`, 
                    'POST', 
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                )
                auth.login(responseData.userId, responseData.token)    // passing user id from the DB to the AuthContext
            } catch(err) {
                console.log(err)
            }
        } else {
            try {
                const formData = new FormData()                 // since image is stored as binary data JSON cannot be used
                formData.append('name', formState.inputs.name.value)
                formData.append('email', formState.inputs.email.value)
                formData.append('password', formState.inputs.password.value)
                formData.append('image', formState.inputs.image.value)

                // formData sets up its own header, we do not need to pass it manually
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, 'POST', formData)
                
                auth.login(responseData.userId, responseData.token)   // passing user id from the DB to the AuthContext
            } catch(err) {
                console.log(err)
            }
        }
    }

    return (
        <div className='center'>
            <ErrorModal error={error} onClear={clearErorr} />
            <Card className='authentication'>
                {isLoading && <Spinner asOverlay/>}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={submitHandler}>
                    {!isLoginMode && (
                        <Input 
                            label='Your Name'
                            type='text'
                            id='name'
                            element='input'
                            validators={[VALIDATOR_REQUIRE()]} 
                            errorText='Please enter a valid Name.'
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && <ImageUpload id='image' center onInput={inputHandler}/>}
                    <Input 
                        label='Email' 
                        type='email'
                        id='email' 
                        element='input' 
                        validators={[VALIDATOR_EMAIL()]} 
                        errorText='Please enter a valid Email.'
                        onInput={inputHandler}
                    />
                    <Input 
                        label='Password' 
                        type='password'
                        id='password' 
                        element='input' 
                        validators={[VALIDATOR_MINLENGTH(6)]} 
                        errorText='Password should be atleast 6 characters long'
                        onInput={inputHandler}
                    />
                    <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
                </form>
                <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
            </Card>
        </div>
    )
}

export default Auth