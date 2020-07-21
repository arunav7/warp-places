import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import Spinner from './shared/components/UIElements/Spinner';

const Users = React.lazy(() => import('./users/pages/Users'))
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'))
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'))
const EditPlace = React.lazy(() => import('./places/pages/EditPlace'))
const Auth = React.lazy(() => import('./users/pages/Auth'))

function App() {
  const { token, login, logout, userId } = useAuth() 

  let routes
  if(token) {
    routes = (
      <Switch>
        <Route path='/' exact component={Users}/>
        <Route path='/:userId/places' exact component={UserPlaces}/>
        <Route path='/places/new' exact component={NewPlace}/>
        <Route path='/places/:placeId' exact component={EditPlace}/>
        <Redirect to='/' />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/' exact component={Users}/>
        <Route path='/:userId/places' exact component={UserPlaces}/>
        <Route path='/auth' exact component={Auth}/>
        <Redirect to='/auth' />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, token, userId, login, logout}}>
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={
            <div className='center'>
              <Spinner />
            </div>
          }>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
