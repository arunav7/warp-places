import React from 'react'

import './PlaceList.css'
import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import PlaceItem from './PlaceItem'

const PlaceList = (props) => {
    if(props.items.length === 0) {
        return (
            <div className='place-list center'>
                <Card>
                    <h2>No Places Found. Want to create one ?</h2>
                    <Button to='/places/new'>Share</Button>
                </Card>
            </div>
        )
    }
    
    return (
        <ul className='place-list'>
            {props.items.map(place => (
                <PlaceItem 
                    key={place.id}
                    id={place.id}
                    image={place.image}
                    title={place.title}
                    description={place.description}
                    creatorId={place.creator}
                    address={place.address}
                    coordinates={place.location}
                    onDelete={props.onDelete}
                />
            ))}
        </ul>
    )
}

export default PlaceList