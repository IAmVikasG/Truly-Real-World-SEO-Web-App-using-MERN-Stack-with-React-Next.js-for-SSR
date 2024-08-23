import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle, authenticate, isAuth } from '../../actions/auth';
import { GOOGLE_CLIENT_ID } from '../../config';

const LoginGoogle = () =>
{
    const responseGoogleSuccess = (response) =>
    {
        const tokenId = response.credential; // This is where the token is retrieved in @react-oauth/google
        const user = { tokenId };

        loginWithGoogle(user).then(data =>
        {
            if (data.error)
            {
                console.log(data.error);
            } else
            {
                authenticate(data, () =>
                {
                    if (isAuth() && isAuth().role === 1)
                    {
                        Router.push(`/admin`);
                    } else
                    {
                        Router.push(`/user`);
                    }
                });
            }
        });
    };

    const responseGoogleError = () =>
    {
        console.log('Google login failed. Try again.');
    };

    return (
        <div className="pb-3">
            <GoogleLogin
                onSuccess={responseGoogleSuccess}
                onError={responseGoogleError}
            />
        </div>
    );
};

export default LoginGoogle;
