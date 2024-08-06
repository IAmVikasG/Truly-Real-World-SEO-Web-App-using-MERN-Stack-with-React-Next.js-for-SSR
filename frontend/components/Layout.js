import React from 'react';
import Header from './Header';

function Layout({ children }) {
    return (
        <React.Fragment>
            <Header />
            {children}
            <p>Footer</p>
        </React.Fragment>
    );
}

export default Layout;
