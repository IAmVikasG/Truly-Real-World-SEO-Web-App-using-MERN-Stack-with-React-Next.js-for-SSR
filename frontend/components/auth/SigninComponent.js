import React, { useState } from 'react';
import { signin } from '../../actions/auth';
import Router from 'next/router';


const SigninComponent = () =>
{
    const [values, setValues] = useState({
        email: '',
        password: '',
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

        signin(user).then(data =>
        {
            if (data.error)
            {
                setValues({ ...values, error: data.error, loading: false });
            } else
            {
                // save user token to cookie
                // save user info to localstorage
                // authenticate user
                Router.push(`/`);
            }
        });

    };

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
                <button className="btn btn-primary">Signup</button>
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
