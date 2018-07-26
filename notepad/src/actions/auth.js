import axios from 'axios';
import cookie from 'react-cookie';

export const PENDING = 'PENDING';
export const ERROR = 'ERROR';
export const SUCCESS_NOTE = 'SUCCESS_NOTE';
export const SUCCESS_NOTES = 'SUCCESS_NOTES';
export const UPDATING = "UPDATING";
export const SUCCESS_USER = "SUCCESS_USER";
export const AUTH_USER = 'auth_user',
    UNAUTH_USER = 'unauth_user',
    AUTH_ERROR = 'auth_error',
    FORGOT_PASSWORD_REQUEST = 'forgot_password_request',
    RESET_PASSWORD_REQUEST = 'reset_password_request',
    PROTECTED_TEST = 'protected_test';

export const errorHandler = (dispatch, error, type) => {
    let errorMessage = '';

    if (error.data.error) {
        errorMessage = error.data.error;
    } else if (error.data) {
        errorMessage = error.data;
    } else {
        errorMessage = error;
    }

    if (error.status === 401) {
        dispatch({
            type: type,
            payload: 'You are not authorized to do this. Please login and try again.'
        });
        logoutUser();
    } else {
        dispatch({
            type: type,
            payload: errorMessage
        });
    }
}


export const createUser = (user) => {
    return dispatch => {
        dispatch({ type: PENDING });
        console.log(user);
        axios
            .post(`http://localhost:5000/users/auth/register`, user)
            .then(response => {
                cookie.save('token', response.data.token, { path: '/users/auth/register' });
                dispatch({ type: SUCCESS_USER, users: response.data })
                window.location.href = '/users/notes';
            })
            .catch(() => {
                dispatch({ type: ERROR, error: 'ERROR CREATING USER' })
            })
    }
}

export const loginUser = ({ email, password }) => {
    return dispatch => {
        dispatch({ type: PENDING });
        axios
            .put(`http://localhost:5000/users/auth/login`, { email, password })
            .then(response => {
                cookie.save('token', response.data.token, { path: '/users/auth/login' });
                dispatch({ type: AUTH_USER, user: response.data })
                window.location.href = '/users/notes';

            })
            .catch(() => {
                dispatch({ type: ERROR, error: 'ERROR LOGGIN IN!' })
            })
    }
}
export function logoutUser() {
    return function (dispatch) {
        dispatch({ type: UNAUTH_USER });
        cookie.remove('token', { path: '/users/auth/logout' });

        window.location.href = '/users/auth/login';
    }
}

export function protectedTest() {
    return function (dispatch) {
        axios.get(`http://localhost:5000/users/auth/login/protected`, {
            headers: { 'Authorization': cookie.load('token') }
        })
            .then(response => {
                dispatch({
                    type: PROTECTED_TEST,
                    payload: response.data.content
                });
            })
            .catch((error) => {
                errorHandler(dispatch, error.response, AUTH_ERROR)
            });
    }
}
