import React, { useEffect, useState } from 'react';
import { signin, authenticate, isAuth } from '../../actions/auth';
import Router from 'next/router';


const SigninComponent = () =>
{
    const [values, setValues] = useState({
        email: 'admin@gmail.com',
        password: '123456',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    const { email, password, error, loading, message, showForm } = values;

    const handleChange = (name) => (event) =>
    {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        setValues({ ...values, loading: true, error: false });

        const user = { email, password };

        signin(user).then(result =>
        {
            let { data, success, message } = result;

            if (!success)
            {
                setValues({ ...values, error: message, loading: false });
            } else
            {
                // save user token to cookie
                // save user info to localstorage
                // authenticate user
                authenticate(data, () =>
                {
                    if (isAuth() && isAuth().role === 1) {
                        Router.push(`/admin`);
                    } else
                    {
                        Router.push(`/user`);
                    }

                });
            }
        });

    };

    useEffect(function ()
    {
        if (isAuth() && isAuth().role === 1)
        {
            Router.push(`/admin`);
        } else if (isAuth() && isAuth().role === 0)
        {
            Router.push(`/user`);
        } else
        {
            Router.push(`/signin`);
        }
    }, []);

    const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '');
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');

    const signinForm = () => (
        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Type your email"
                    value={email}
                    onChange={handleChange('email')}
                />
            </div>

            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Type your password"
                    value={password}
                    onChange={handleChange('password')}
                />
            </div>

            <div>
                <button className="btn btn-primary">Signin</button>
            </div>
        </form>
    );

    return (
        <React.Fragment>
            {showLoading()}
            {showError()}
            {showMessage()}
            {showForm && signinForm()}
        </React.Fragment>
    );
};

export default SigninComponent;
