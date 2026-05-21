// Router
import { Link } from 'react-router-dom';
// Logo
import norwoodLogo from 'assets/img/logo/norwood-logo.png';
// Icons
import { ReactComponent as PhoneIcon } from 'assets/icons/phone.svg';
import { ReactComponent as AddressIcon } from 'assets/icons/address.svg';
import { ReactComponent as EmailIcon } from 'assets/icons/email.svg';
// Styles
import './Footer.css';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Footer Header */}
                <header className="footer-header">
                    <div className="fh-line"></div>
                    <div className="fh-logo">
                        <img src={norwoodLogo} alt="Norwood Halal Butchery" />
                    </div>
                    <div className="fh-line"></div>
                </header>

                {/* Footer body grid */}
                <div className="footer-body">

                    {/* Brand column */}
                    <div className="footer-col footer-brand">
                        <h3 className="footer-col-title">Norwood Halal Butchery</h3>
                        <p className="footer-tagline">
                            "Premium certified halal meats, served fresh daily. From our family to yours — quality you can trust, cuts you'll love."
                        </p>
                        <span className="footer-halal-badge">&#9670; 100% HALAL CERTIFIED &#9670;</span>
                    </div>

                    {/* Navigation column */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Navigate</h4>
                        <nav className="footer-nav">
                            <Link className="footer-link navbar-link" to='/'>Home</Link>
                            <Link className="footer-link navbar-link" to='/shop/all'>Shop All</Link>
                            <Link className="footer-link navbar-link" to='/shop/wagyu'>Wagyu</Link>
                            <Link className="footer-link navbar-link" to='/shop/feedlot'>Feedlot</Link>
                            <Link className="footer-link navbar-link" to='/shop/standard'>Standard</Link>
                        </nav>
                    </div>

                    {/* Contact column */}
                    <div className="footer-col">
                        <h4 className="footer-col-title">Contact</h4>
                        <div className="footer-contact">
                            <div className="footer-contact-item">
                                <AddressIcon className="footer-contact-icon" />
                                <span>Norwood, Johannesburg<br />Gauteng, South Africa</span>
                            </div>
                            <div className="footer-contact-item">
                                <PhoneIcon className="footer-contact-icon" />
                                <span>+27 11 000 0000</span>
                            </div>
                            <div className="footer-contact-item">
                                <EmailIcon className="footer-contact-icon" />
                                <span>info@norwoodbutchery.co.za</span>
                            </div>
                        </div>
                        <div className="footer-hours">
                            <p>Mon – Sat: <strong>7:00 AM – 6:00 PM</strong></p>
                            <p>Sunday: <strong>Closed</strong></p>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="fh-line"></div>
                    <p className="footer-copyright">
                        &copy; {new Date().getFullYear()} Norwood Halal Butchery. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    )
}
