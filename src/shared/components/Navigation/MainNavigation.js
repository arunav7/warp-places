import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

import './MainNavigation.css'
import MainHeader from './MainHeader'
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer'
import Backdrop from '../UIElements/Backdrop'

const MainNavigation = (props) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false)

    const openDrawerHandler = () => {
        setDrawerOpen(true)
    }

    const closeDrawerHandler = () => {
        setDrawerOpen(false)
    }
    
    return (
        <Fragment>
            {isDrawerOpen && <Backdrop onClick={closeDrawerHandler}/>}
            <SideDrawer show={isDrawerOpen} onClick={closeDrawerHandler}>
                <nav className='main-navigation__drawer-nav'>
                    <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className='main-navigation__menu-btn' onClick={openDrawerHandler}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className='main-navigation__title'>
                    <Link to='/'>Your Places</Link>
                </h1>
                <nav className='main-navigation__header-nav'>
                    <NavLinks />
                </nav>
            </MainHeader>
        </Fragment>
    )
}

export default MainNavigation