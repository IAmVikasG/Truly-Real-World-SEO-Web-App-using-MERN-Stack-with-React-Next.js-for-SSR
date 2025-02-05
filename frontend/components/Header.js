import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { APP_NAME } from '../config';
import { signout, isAuth } from '../actions/auth';
import NProgress from 'nprogress';
import Router from 'next/router';
import Search from './blog/Search';



Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

import
    {
        Collapse,
        Navbar,
        NavbarToggler,
        Nav,
        NavItem,
        NavLink
    } from 'reactstrap';

const Header = () =>
{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggle = () =>
    {
        setIsOpen(!isOpen);
    };

    const handleSignout = () =>
    {
        signout(() =>
        {
            router.replace('/signin');
        });
    };

    const handleRedirectionOfDashboard = (role) =>
    {
        switch (role) {
            case 0:
                return router.replace('/user');

            case 1:
                return router.replace('/admin');

            default:
                break;
        }
    }

    useEffect(() =>
    {
        setIsAuthenticated(isAuth());
    }, []);

    return (
        <>
            <Navbar color="light" light expand="md">
                <Link href="/" legacyBehavior>
                    <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
                </Link>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <>
                            <NavItem>
                                <Link href="/blogs" legacyBehavior passHref>
                                    <NavLink style={{ cursor: 'pointer' }}>Blogs</NavLink>
                                </Link>
                            </NavItem>
                            <NavItem>
                                <Link href="/contact" legacyBehavior passHref>
                                    <NavLink style={{ cursor: 'pointer' }}>Contact</NavLink>
                                </Link>
                            </NavItem>

                            {!isAuthenticated && (
                                <>
                                    <NavItem>
                                        <Link href="/signin" legacyBehavior passHref>
                                            <NavLink style={{ cursor: 'pointer' }}>Signin</NavLink>
                                        </Link>
                                    </NavItem>
                                    <NavItem>
                                        <Link href="/signup" legacyBehavior passHref>
                                            <NavLink style={{ cursor: 'pointer' }}>Signup</NavLink>
                                        </Link>
                                    </NavItem>
                                </>
                            )}

                            {isAuthenticated && isAuthenticated.role == 0 && (
                                <NavItem>
                                    <NavLink style={{ cursor: 'pointer' }} onClick={() => handleRedirectionOfDashboard(isAuthenticated.role)}>
                                        {`${isAuthenticated.name}'s Dashboard`}
                                    </NavLink>
                                </NavItem>
                            )}

                            {isAuthenticated && isAuthenticated.role == 1 && (
                                <NavItem>
                                    <NavLink style={{ cursor: 'pointer' }} onClick={() => handleRedirectionOfDashboard(isAuthenticated.role)}>
                                        {`${isAuthenticated.name}'s Dashboard`}
                                    </NavLink>
                                </NavItem>
                            )}

                            {isAuthenticated && (
                                <NavItem>
                                    <NavLink style={{ cursor: 'pointer' }} onClick={handleSignout}>
                                        Signout
                                    </NavLink>
                                </NavItem>
                            )}

                            <NavItem>
                                <Link href="/user/crud/blog" legacyBehavior passHref>
                                    <NavLink className="btn btn-primary text-light">Write a blog</NavLink>
                                </Link>
                            </NavItem>
                        </>
                    </Nav>
                </Collapse>
            </Navbar>
            <Search />
        </>
    );
};

export default Header;
