import React from 'react';
import Header from './Header';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '../config';

function Layout({ children }) {
    return (
        <React.Fragment>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Header />
            {children}
            <p>Footer</p>
            </GoogleOAuthProvider>
        </React.Fragment>
    );
}

export default Layout;
