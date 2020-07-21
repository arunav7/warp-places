import React, { useState, Fragment, useContext } from 'react'

import './PlaceItem.css'
import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import Modal from '../../shared/components/UIElements/Modal'
import Map from '../../shared/components/UIElements/Map'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Spinner from '../../shared/components/UIElements/Spinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

const PlaceItem = (props) => {
    const auth = useContext(AuthContext)
    const [showMap, setShowMap] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { isLoading, error, sendRequest, clearErorr } = useHttpClient()

    const openMapHandler = () => setShowMap(true)
    const closeMapHandler = () => setShowMap(false)

    const showDeleteConfirmHandler = () => setShowModal(true)
    const cancelHandler = () => setShowModal(false)
    const deleteHandler = async () => {
        setShowModal(false)
        try {
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`, 'DELETE', undefined, {
                Authorization: 'Bearer ' + auth.token
            })
            props.onDelete(props.id)
        }catch(err) {}
    }
    
    return (
        <Fragment>
            <ErrorModal error={error} onClear={clearErorr}/>
            <Modal 
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass='place-item__modal-content'
                footerClass='place-item__modal-actions'
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className='map-container'>
                    <Map center={props.coordinates} zoom={16}/>
                </div>
            </Modal>
            <Modal 
                show={showModal}
                onCancel={cancelHandler}
                header='Are you sure'
                footerClass='place-item__modal-actions'
                footer={
                    <Fragment>
                        <Button inverse onClick={cancelHandler}>CANCEL</Button>
                        <Button danger onClick={deleteHandler}>DELETE</Button>
                    </Fragment>
                }
            >
                <p>Do you want to proceed and delete the place ? This can't be undone hereafter </p>
            </Modal>
            <li className='place-item'>
                <Card className='place-item__content'>
                    {isLoading && <Spinner asOverlay/>}
                    <div className='place-item__image'>
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title}/>
                    </div>
                    <div className='place-item__info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>View on Map</Button>
                        { auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>Edit</Button>}
                        { auth.userId === props.creatorId && <Button danger onClick={showDeleteConfirmHandler}>Delete</Button>}
                    </div>
                </Card>
            </li>
        </Fragment>
    )
}

export default PlaceItem