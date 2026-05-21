import { useEffect, useRef, useState } from 'react';
// Logo
import norwoodLogo from 'assets/img/logo/norwood-logo.png';
// Router
import { Link, useLocation } from 'react-router-dom';
// Icons
import { ReactComponent as AwardIcon } from 'assets/icons/award.svg';
import { ReactComponent as AddCartIcon } from 'assets/icons/add-cart.svg';
// Images
import artisanCheeseImg from 'assets/img/others/provolone.webp';
import boereworsImg from 'assets/img/others/sausages.webp';
import breadsImg from 'assets/img/others/breads.webp';
import aboutUsImg from 'assets/img/others/aside.webp';
// Components
import { ItemListContainer } from 'components/common/itemListContainer/ItemListContainer';
// Utils
import { isIOS } from 'utils/isIOS';
// Styles
import './Home.css';


export const Home = () => {

    const [loadingScreen, setLoadingScreen] = useState({
        loading: true,
        percentage: 0
    });

    const aboutUs = useRef<HTMLElement>(null);
    const scrollToAboutUs = () => aboutUs?.current?.scrollIntoView({ behavior: 'smooth' });

    const location = useLocation();

    useEffect(() => {
        location.hash === '#about-us' ?
            scrollToAboutUs()
        :
            window.scrollTo(0, 0);
    }, [location])

    useEffect(() => {
        let loadingInterval = setInterval(() => {
            loadingScreen.percentage < 100 ?
                setLoadingScreen({
                    ...loadingScreen,
                    percentage: loadingScreen.percentage++
                })
            :
                setTimeout(() => {
                    setLoadingScreen({
                        ...loadingScreen,
                        loading: false
                    })
                    clearInterval(loadingInterval);
                }, 750)
        }, 18);

        setTimeout(() => {
            setLoadingScreen({
                ...loadingScreen,
                percentage: 0
            })
        }, 500);
    }, [])

    return (
        <>
            {/* Loading Screen */}
            <div
                style={loadingScreen.loading ? {} : {opacity: '0', pointerEvents: 'none'}}
                className="home-loading"
            >
                <div className="home-loading-content">
                    <img src={norwoodLogo} alt="Norwood Halal Butchery" />
                    <p className="home-loading-name">Norwood Halal Butchery</p>
                    <div className="home-loading-bar-track">
                        <div
                            className="home-loading-bar-fill"
                            style={{ width: `${loadingScreen.percentage}%` }}
                        />
                    </div>
                    <span>{loadingScreen.percentage}%</span>
                </div>
            </div>

            {/* Home */}
            <div className="home">

                {/* Hero Section */}
                <section
                    style={isIOS() ? {backgroundAttachment: 'initial'} : {}}
                    className="hero-section"
                >
                    <div className="hs-greeting">
                        <div className="hs-badge">&#9670; HALAL CERTIFIED &#9670;</div>
                        <h1>Norwood's Finest<br />Halal Butchery</h1>
                        <p className="hs-sub">Premium certified halal meats — sourced fresh, cut with care, served with pride in Norwood, Johannesburg.</p>
                        <Link className="button hsg-search-meats-btn" to='/shop/all'>Shop Now</Link>
                    </div>
                </section>

                {/* Bestsellers Section */}
                <section className="bestsellers-section">

                    <div className="bs-title">
                        <AwardIcon className="award-icon" />
                        <h2>Our Bestsellers</h2>
                    </div>

                    <ItemListContainer category={'bestsellers'} limit={true} />

                    <Link className="button bs-btn" to='/shop/all'>View All Products</Link>

                </section>

                {/* Feature Strip */}
                <div className="feature-strip">
                    <div className="feature-item">
                        <span className="feature-icon">🥩</span>
                        <div>
                            <strong>100% Halal</strong>
                            <p>Certified & Compliant</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🔪</span>
                        <div>
                            <strong>Expert Butchers</strong>
                            <p>Hand-cut to order</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">❄️</span>
                        <div>
                            <strong>Always Fresh</strong>
                            <p>Delivered daily</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📦</span>
                        <div>
                            <strong>Local Delivery</strong>
                            <p>Norwood & surrounds</p>
                        </div>
                    </div>
                </div>

                {/* Other Products Section */}
                <section className="other-products-section">

                    <div className="ops-title">
                        <AddCartIcon className="add-cart-home-icon" />
                        <h2>Also Available</h2>
                    </div>

                    <div className="ops-products">

                        <div className="op-item">
                            <img src={artisanCheeseImg} alt="Artisan Cheeses" />
                            <div className="op-item-info">
                                <h3>Artisan Cheeses</h3>
                                <span>From R 85 / kg</span>
                            </div>
                        </div>

                        <div className="op-item">
                            <img src={boereworsImg} alt="Halal Boerewors" />
                            <div className="op-item-info">
                                <h3>Halal Boerewors</h3>
                                <span>From R 65 / kg</span>
                            </div>
                        </div>

                        <div className="op-item">
                            <img src={breadsImg} alt="Fresh Breads & Rolls" />
                            <div className="op-item-info">
                                <h3>Fresh Breads & Rolls</h3>
                                <span>From R 15 each</span>
                            </div>
                        </div>

                    </div>

                    <Link className="button ops-btn" to='/shop/other'>View All Products</Link>

                </section>

                {/* About Us Section */}
                <section ref={aboutUs} className="about-us-section">

                    <div className="aus-grid">
                        <img src={aboutUsImg} alt="Norwood Halal Butchery" />

                        <div className="aus-info">
                            <h2>About Us</h2>
                            <p>Welcome to Norwood Halal Butchery — your trusted neighbourhood halal butchery in the heart of Norwood, Johannesburg. We take immense pride in providing our community with the finest selection of certified halal beef, lamb, chicken, and specialty cuts.</p>
                            <p>Every product we carry is sourced from certified halal suppliers and handled with the utmost care to ensure quality, freshness, and full compliance with Islamic dietary requirements. Our expert butchers are dedicated to delivering the perfect cut, every time.</p>
                            <Link className="button aus-btn" to='/#about-us'>Our Promise</Link>
                        </div>
                    </div>

                </section>

            </div>
        </>
    )
}
