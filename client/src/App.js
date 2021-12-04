import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    HomeWrapper,
    RegisterScreen,
    Statusbar,
    WorkspaceScreen,
    SignInSide
} from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>        
                    <AppBanner/>
                    <Switch>
                        <Route path="/" exact component={HomeWrapper} />
                        <Route path="/login/" exact component= {SignInSide} />
                        <Route path="/logout/" exact component= {HomeWrapper} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/top5list/:id" exact component={WorkspaceScreen} />
                        <Redirect to="/" />
                    </Switch>
                    <Statusbar/>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App