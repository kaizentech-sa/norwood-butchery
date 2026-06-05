import { useState } from 'react';
// Router
import { Link } from 'react-router-dom';
// Toasts
import { logoutToast } from 'utils/toasts';
// Logo
import norwoodLogo from 'assets/img/logo/norwood-logo.png';
// Icons
import { ReactComponent as HamburguerIcon } from 'assets/icons/hamburguer-menu.svg';
import { ReactComponent as UserIcon } from 'assets/icons/user.svg';
import { ReactComponent as DropdownItemIcon } from 'assets/icons/arrow-right-circle.svg';
// Components
import { HamburguerMenuCanvas } from './components/HamburguerMenuCanvas/HamburguerMenuCanvas';
import { CartWidget } from './components/cartWidget/CartWidget';
import { UserInfo } from './components/userInfo/UserInfo';
// Auth
import { useAuth } from 'hooks/useAuth';
// Styles
import './NavBar.css';


export const NavBar = () => {

    const [hamburguerMenuOpen, sethamburguerMenuOpen] = useState<boolean>(false);
    const openHamburguerMenu = () => sethamburguerMenuOpen(true);
    const closeHamburguerMenu = () => sethamburguerMenuOpen(false);

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const openDropdown = () => setDropdownOpen(true);
    const closeDropdown = () => setDropdownOpen(false);

    const [userInfoOpen, setUserInfoOpen] = useState<boolean>(false);
    const toggleUserInfo = () => setUserInfoOpen(!userInfoOpen);
    const closeUserInfo = () => setUserInfoOpen(false);

    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        closeUserInfo();
        logoutToast();
    };

    return (
        <>
            <HamburguerMenuCanvas hamburguerMenuOpen={hamburguerMenuOpen} closeHamburguerMenu={closeHamburguerMenu} />

            {/* Halal announcement bar — two copies for seamless marquee loop */}
            <div className="halal-bar" aria-label="100% Halal Certified • Norwood, Johannesburg • Mon–Sat 7am–6pm">
                <div className="halal-bar-inner" aria-hidden="true">
                    <span>&#9670; 100% HALAL CERTIFIED &#9670; NORWOOD, JOHANNESBURG &#9670; MON–SAT: 7AM–6PM &#9670;</span>
                    <span>&#9670; 100% HALAL CERTIFIED &#9670; NORWOOD, JOHANNESBURG &#9670; MON–SAT: 7AM–6PM &#9670;</span>
                </div>
            </div>

            {/* Navbar */}
            <header className="navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <div className="nc-left">
                        <Link to='/'>
                            <img src={norwoodLogo} alt="Norwood Halal Butchery" className="navbar-logo" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="nc-right">
                        <Link className="navbar-link nbl-section" to='/'> Home </Link>

                        <div
                            onMouseEnter={() => openDropdown()}
                            onMouseLeave={() => closeDropdown()}
                        >
                            <button className="navbar-link nbl-section nbl-cat">
                                Categories
                            </button>

                            <div className="transparent-div" style={dropdownOpen ? {opacity: '1', pointerEvents: 'all'} : {}}></div>

                            <div className="cat-dropdown-menu"
                                style={dropdownOpen ? {opacity: '1', pointerEvents: 'all'} : {}}
                            >
                                <ul>
                                    <li className="cdm-item" onClick={() => closeDropdown()}>
                                        <Link to='/shop/wagyu' className="cdm-item-link">
                                            <DropdownItemIcon className="dd-item-icon" />
                                            Wagyu
                                        </Link>
                                    </li>
                                    <li className="cdm-item" onClick={() => closeDropdown()}>
                                        <Link to='/shop/feedlot' className="cdm-item-link">
                                            <DropdownItemIcon className="dd-item-icon" />
                                            Feedlot
                                        </Link>
                                    </li>
                                    <li className="cdm-item" onClick={() => closeDropdown()}>
                                        <Link to='/shop/standard' className="cdm-item-link">
                                            <DropdownItemIcon className="dd-item-icon" />
                                            Standard
                                        </Link>
                                    </li>
                                    <li className="cdm-item" onClick={() => closeDropdown()}>
                                        <Link to='/shop/other' className="cdm-item-link">
                                            <DropdownItemIcon className="dd-item-icon" />
                                            Others
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <Link className="navbar-link nbl-section" to='/shop/all'> Shop </Link>

                        {/* Hamburger Menu (mobile) */}
                        <button
                            className="navbar-link hamburguer-menu"
                            onClick={() => openHamburguerMenu()}
                            aria-label="Open menu"
                        >
                            <HamburguerIcon className="hamburguer-icon" />
                        </button>

                        { user &&
                            <div>
                                <button className="user-btn" onClick={() => toggleUserInfo()}>
                                    <UserIcon className="user-icon" />
                                </button>
                                <UserInfo
                                    isOpen={userInfoOpen}
                                    email={user.email}
                                    logout={handleLogout}
                                    closeUserInfo={closeUserInfo}
                                />
                            </div>
                        }

                        {/* Cart Button */}
                        <Link to='/cart' aria-label="Cart">
                            <CartWidget />
                        </Link>
                    </nav>
                </div>
            </header>
        </>
    )
}
