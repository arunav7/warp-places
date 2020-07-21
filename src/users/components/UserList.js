import React from 'react'
import './UserList.css'

import UserItem from '../components/UserItem'
import Card from '../../shared/components/UIElements/Card'

const UserList = props => {
    if(props.items.length === 0) {
        return (
            <div className='center'>
                <Card>
                <p>No User Found!</p>
                </Card>
            </div>
        )
    }

    return <ul className='users-list'>
        {props.items.map(user => 
            <UserItem 
                key={user.id}
                id={user.id}
                name={user.name}
                image={user.image}
                placeCount={user.places.length}/>
        )}
    </ul>
}

export default UserList