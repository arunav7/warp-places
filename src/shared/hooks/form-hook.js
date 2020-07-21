import { useCallback, useReducer } from 'react'

const formReducer = (state, action) => {
    switch(action.type) {
        case 'INPUT_CHANGE':
            let isFormValid = true
            for(const inputId in state.inputs) {
                if(!state.inputs[inputId]){
                    continue
                }
                if(inputId === action.inputId) {
                    isFormValid = isFormValid && action.isValid
                }
                else {
                    isFormValid = isFormValid && state.inputs[inputId].isValid
                }
            }
            return {
                ...state,
                inputs : {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.isValid
                    }
                },
                isValid: isFormValid
            }
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.isFormValid
            }
        default:
            return state
    }
}

export const useForm = (initialInputs, initialIsValid) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialIsValid
    })

    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value,
            inputId: id,
            isValid
        })
    }, [])   // stores the callback fn in the memory to reuse it

    const setFormData = useCallback((formInputs, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: formInputs,
            isFormValid: formValidity 
        })
    }, [])

    return [formState, inputHandler, setFormData]
}