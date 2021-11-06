import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import api from '../api';
import LoginErrorModal from "../components/LoginErrorModal";
import RegisterUserErrorModal from "../components/RegisterUserErrorModal";

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    REGISTER_USER_ERROR: "REGISTER_USER_ERROR",
    LOGIN_ERROR: "LOGIN_ERROR",
    LOGOUT_USER: "LOGOUT_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        registerUserError: false,
        loginError: false,
        errorMsg: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    registerUserError: false,
                    loginError: false
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    registerUserError: false,
                    loginError: false
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    registerUserError: false,
                    loginError: false
                })
            }
            case AuthActionType.REGISTER_USER_ERROR: {
                return setAuth({
                    registerUserError: payload.registerUserError,
                    loginError: false,
                    errorMsg: payload.errorMsg
                });
            }
            case AuthActionType.LOGIN_ERROR: {
                return setAuth({
                    registerUserError: false,
                    loginError: payload.loginError,
                    errorMsg: payload.errorMsg
                });
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        try {
            const response = await api.getLoggedIn();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            }
        }
        catch(err) {
        }
    }

    auth.logoutUser = async function () {
        try {
            const response = await api.logoutUser();
            if(response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGOUT_USER,
                    payload: {
                        loggedIn: false,
                        user: null
                    }
                });
            }
        }
        catch(err) {
        }
    }

    auth.registerUser = async function(userData, store) {
        try {
            const response = await api.registerUser(userData);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }
        catch(err) {
            authReducer({
                type: AuthActionType.REGISTER_USER_ERROR,
                payload: {
                    registerUserError: true,
                    errorMsg: err.response.data.errorMessage
                }
            })
        }
    }

    auth.loginUser = async function(userData, store) {
        try {
            const response = await api.loginUser(userData);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }
        catch(err) {
            authReducer({
                type: AuthActionType.LOGIN_ERROR,
                payload: {
                    loginError: true,
                    errorMsg: err.response.data.errorMessage
                }
            })
        }

    }

    auth.setLoginError = function() {
        authReducer({
            type: AuthActionType.LOGIN_ERROR,
            payload: {
                loginError: false
            }
        })
    }

    auth.setRegisterUserError = function() {
        authReducer({
            type: AuthActionType.REGISTER_USER_ERROR,
            payload: {
                registerUserError: false
            }
        })
    }

    if(auth.loginError) {
        return (
            <div>
                <LoginErrorModal
                errorMsg={auth.errorMsg}
                setLoginErrorCallback={auth.setLoginError}
                loginError={auth.loginError}>
                </LoginErrorModal>
                <AuthContext.Provider value={{
                    auth
                }}>
                    {props.children}
                </AuthContext.Provider>
            </div>
        );
    }
    else if(auth.registerUserError) {
        return (
            <div>
                <RegisterUserErrorModal
                errorMsg={auth.errorMsg}
                setRegisterUserErrorCallback={auth.setRegisterUserError}
                registerUserError={auth.registerUserError}>
                </RegisterUserErrorModal>
                <AuthContext.Provider value={{
                    auth
                }}>
                    {props.children}
                </AuthContext.Provider>
            </div>
        );
    }
    else {
        return (
            <AuthContext.Provider value={{
                auth
            }}>
                {props.children}
            </AuthContext.Provider>
        );
    }
}

export default AuthContext;
export { AuthContextProvider };