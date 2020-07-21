import React, { useReducer, useEffect } from 'react'
import { validate } from '../../util/validators'

import './Input.css'

const inputReducer = (state, action) => {
    switch(action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            }
        case 'TOUCHED':
            return {
                ...state,
                isTouched: true
            }    
        default:
            return state
    }
}

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '',                                                  // initial state value
        isValid: props.initialValid || false,                                              // initial state isValid
        isTouched: false
    })

    const {id, onInput} = props
    const {value, isValid} = inputState

    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput])

    const changeHandler = (event) => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        })
    }
    
    const touchHandler = () => {
        dispatch({
            type: 'TOUCHED'
        })
    }

    const element = (
        props.element === 'input' ? (
            <input 
                id={props.id} 
                type={props.type} 
                placeholder={props.placeholder}
                value={inputState.value}
                onBlur={touchHandler}
                onChange={changeHandler}/>
         ) : (
             <textarea 
                id={props.id} 
                rows={props.rows || 3}
                value={inputState.value}
                onBlur={touchHandler}
                onChange={changeHandler}/>
         ) 
    )
    
    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    )
}

export default Input