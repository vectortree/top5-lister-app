import { Link } from 'react-router-dom';
import AuthContext from '../auth';
import { useContext } from 'react';

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    return (
        <div id="splash-screen">
            <div id="title">
                The Top 5<br />
                Lister
            </div>
            <div id="description">
                A category-based item-ranking system and a space where people can freely <br/>
                share and discuss their preferences and opinions on any topic!
            </div>
            <div id="welcome-screen-button-1">
                <Link to="/register/">Create New Account</Link>
            </div>
            <div id="welcome-screen-button-2">
                <Link to="/login/">Login</Link>
            </div>
            <div id="welcome-screen-button-3">
                <Link
                to="/"
                onClick={() => auth.loginAsGuest()}>
                    Continue as Guest
                </Link>
            </div>
            <div id="welcome-screen-footer">
                Developed by Starr Xu
            </div>
        </div>
    )
}