import React, { useEffect, useState } from 'react';
import { isAuth, signup } from '../../actions/auth';

const SignupComponent = () =>
{
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    const { name, email, password, error, loading, message, showForm } = values;

    const handleChange = (name) => (event) =>
    {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        setValues({ ...values, loading: true, error: false });

        const user = { name, email, password };

        signup(user).then(data =>
        {
            if (data.error)
            {
                setValues({ ...values, error: data.error, loading: false });
            } else
            {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    loading: false,
                    message: data.message,
                    showForm: false
                });
            }
        });

    };

    useEffect(function ()
    {
        isAuth() && Router.push('/');
    }, []);

    const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '');
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');

    const signupForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type your name"
                    value={name}
                    onChange={handleChange('name')}
                />
            </div>

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
            {showForm && signupForm()}
        </React.Fragment>
    );
};

export default SignupComponent;
