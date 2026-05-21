import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as CloseIcon } from 'assets/icons/x.svg';
import { ReactComponent as GoBackIcon } from 'assets/icons/arrow-left.svg';
import norwoodLogo from 'assets/img/logo/norwood-logo.png';
import './HamburguerMenuCanvas.css';

type props = {
    hamburguerMenuOpen: boolean;
    closeHamburguerMenu: () => void;
}

/* Lock body scroll (iOS-safe: position:fixed + stored scroll offset) */
const lockScroll = () => {
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = String(scrollY);
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('scroll-locked');
};

const unlockScroll = () => {
    if (!document.body.classList.contains('scroll-locked')) return;
    const scrollY = Number(document.body.dataset.scrollY || '0');
    document.body.classList.remove('scroll-locked');
    document.body.style.top = '';
    delete document.body.dataset.scrollY;
    window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior });
};

export const HamburguerMenuCanvas = ({ hamburguerMenuOpen, closeHamburguerMenu }: props) => {
    const [viewCategories, setViewCategories] = useState<boolean>(false);

    useEffect(() => {
        if (hamburguerMenuOpen) {
            lockScroll();
        } else {
            unlockScroll();
        }
        return unlockScroll; // cleanup on unmount only (guard inside unlockScroll prevents double-fire)
    }, [hamburguerMenuOpen]);

    const handleClose = () => {
        closeHamburguerMenu();
        setTimeout(() => setViewCategories(false), 400);
    };

    const handleNavClick = () => {
        handleClose();
    };

    return (
        <>
            {/* Dark backdrop — separate from the panel so tapping it closes */}
            <div
                className="hm-backdrop"
                aria-hidden="true"
                style={hamburguerMenuOpen ? { opacity: 1, pointerEvents: 'all' } : { opacity: 0, pointerEvents: 'none' }}
                onClick={handleClose}
            />

            {/* Slide-in panel */}
            <div
                className="hm-canva"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                style={hamburguerMenuOpen
                    ? { transform: 'translateX(0)', opacity: 1, pointerEvents: 'all' }
                    : { transform: 'translateX(-100%)', opacity: 0, pointerEvents: 'none' }
                }
            >
                {/* Logo */}
                <img src={norwoodLogo} alt="Norwood Halal Butchery" className="hm-logo" />

                {/* Go Back Button */}
                <button
                    className="goback-btn-hm"
                    style={viewCategories ? { transform: 'translateX(0)' } : {}}
                    onClick={() => setViewCategories(false)}
                    aria-label="Go back"
                >
                    <GoBackIcon className="goback-icon-hm" />
                </button>

                {/* Close Button */}
                <button className="close-btn" onClick={handleClose} aria-label="Close menu">
                    <CloseIcon className="close-icon" />
                </button>

                {/* Main Links */}
                <div className="main-links" style={viewCategories ? { transform: 'translateX(-100vw)' } : {}}>
                    <Link className="navbar-link nbl-hm" to='/' onClick={handleNavClick}>Home</Link>
                    <button className="navbar-link nbl-hm nbl-hm-cat" onClick={() => setViewCategories(true)}>Categories</button>
                    <Link className="navbar-link nbl-hm" to='/shop/all' onClick={handleNavClick}>Shop</Link>
                </div>

                {/* Category Links */}
                <div className="cat-links" style={viewCategories ? { transform: 'translateX(0)' } : { opacity: 0 }}>
                    <Link className="navbar-link nbl-hm" to='/shop/wagyu' onClick={handleNavClick}>Wagyu</Link>
                    <Link className="navbar-link nbl-hm" to='/shop/feedlot' onClick={handleNavClick}>Feedlot</Link>
                    <Link className="navbar-link nbl-hm" to='/shop/standard' onClick={handleNavClick}>Standard</Link>
                    <Link className="navbar-link nbl-hm" to='/shop/other' onClick={handleNavClick}>Others</Link>
                </div>

                {/* Halal badge */}
                <p className="hm-halal-badge">&#9670; 100% Halal Certified &#9670;</p>
            </div>
        </>
    );
};
