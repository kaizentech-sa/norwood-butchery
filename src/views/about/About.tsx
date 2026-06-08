import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ViewHeader } from 'components/common/viewHeader/ViewHeader';
import aboutUsImg from 'assets/img/others/aside.webp';
import './About.css';

export const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="about-page">
            <ViewHeader title="About Us" />

            <section className="about-intro">
                <div className="about-intro-grid">
                    <img src={aboutUsImg} alt="Norwood Halal Butchery" />
                    <div className="about-intro-copy">
                        <h2>Welcome to Norwood Halal Butchery</h2>
                        <p>
                            We are a neighbourhood halal butchery in the heart of Norwood, Johannesburg,
                            serving our community with premium certified halal meats, expert cuts, and
                            friendly service you can trust.
                        </p>
                        <p>
                            From everyday family meals to special occasions, we are committed to
                            quality, freshness, and full compliance with Islamic dietary requirements.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-values">
                <h2>What We Stand For</h2>
                <div className="about-values-grid">
                    <article className="about-value-card">
                        <h3>100% Halal</h3>
                        <p>All our products are sourced from certified halal suppliers and handled with care.</p>
                    </article>
                    <article className="about-value-card">
                        <h3>Expert Butchers</h3>
                        <p>Our team cuts to order so you get exactly what you need, every time.</p>
                    </article>
                    <article className="about-value-card">
                        <h3>Always Fresh</h3>
                        <p>We prioritise freshness and quality in every product on our shelves.</p>
                    </article>
                    <article className="about-value-card">
                        <h3>Community First</h3>
                        <p>Proudly serving Norwood and surrounding areas with dependable local service.</p>
                    </article>
                </div>
            </section>

            <section className="about-cta">
                <p>Ready to shop our range of halal meats and more?</p>
                <Link className="button about-cta-btn" to="/shop/all">
                    Browse Products
                </Link>
            </section>
        </div>
    );
};
