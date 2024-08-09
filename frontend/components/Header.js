import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { APP_NAME } from '../config';
import { signout, isAuth } from '../actions/auth';

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
        <div>
            <Navbar color="light" light expand="md">
                <Link href="/" legacyBehavior>
                    <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
                </Link>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <>
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
                            {isAuthenticated && (
                                <NavItem>
                                    <NavLink style={{ cursor: 'pointer' }} onClick={handleSignout}>
                                        Signout
                                    </NavLink>
                                </NavItem>
                            )}
                            {isAuthenticated && isAuthenticated.role == 0 && (
                                <NavItem>
                                    <NavLink style={{ cursor: 'pointer' }} onClick={()=>handleRedirectionOfDashboard(isAuthenticated.role)}>
                                        {`${isAuthenticated.name}'s Dashboard`}
                                    </NavLink>
                                </NavItem>
                            )}
                            {isAuthenticated && isAuthenticated.role == 1 && (
                                <NavItem>
                                    <NavLink style={{ cursor: 'pointer' }} onClick={()=>handleRedirectionOfDashboard(isAuthenticated.role)}>
                                        {`${isAuthenticated.name}'s Dashboard`}
                                    </NavLink>
                                </NavItem>
                            )}

                        </>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};

export default Header;
