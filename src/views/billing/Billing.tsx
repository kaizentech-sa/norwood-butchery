import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ViewHeader } from 'components/common/viewHeader/ViewHeader';
import { BillingCartResume } from './components/billingCartResume/BillingCartResume';
import { useShop } from 'shop/core/ShopProvider';
import { formatPrice } from 'shop/utils/helpers';
import { containLetters, containNumbers } from 'utils/formValidation';
import {
    getSavedShippingType,
    getShippingMethod,
    getShippingPrice,
} from 'utils/cartShipping';
import './Billing.css';

export const Billing = () => {
    const { cart, checkout } = useShop();
    const { items, total: subtotal, itemCount, initialized, clearCart } = cart;
    const { loading, error, stockErrors, processCheckout, clearError } = checkout;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');
    const [customerNote, setCustomerNote] = useState('');

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        province: '',
        city: '',
        address: '',
        postalCode: '',
        phone: '',
    });

    const shippingType = getSavedShippingType();
    const shippingPrice = getShippingPrice(subtotal, shippingType);
    const orderTotal = subtotal + shippingPrice;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const resetErrors = () =>
        setErrors({
            firstName: '',
            lastName: '',
            email: '',
            province: '',
            city: '',
            address: '',
            postalCode: '',
            phone: '',
        });

    const formValidation = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        clearError();

        if (itemCount <= 0) return;

        if (!firstName || !lastName || !email || !province || !city || !address || !postalCode || !phone) {
            setErrors({
                firstName: !firstName ? 'Required' : '',
                lastName: !lastName ? 'Required' : '',
                email: !email ? 'Required' : '',
                province: !province ? 'Required' : '',
                city: !city ? 'Required' : '',
                address: !address ? 'Required' : '',
                postalCode: !postalCode ? 'Required' : '',
                phone: !phone ? 'Required' : '',
            });
            window.scrollTo(0, 0);
            return;
        }

        if (
            containNumbers(firstName) ||
            containNumbers(lastName) ||
            containNumbers(city) ||
            !containNumbers(address) ||
            !containLetters(address)
        ) {
            setErrors({
                firstName: containNumbers(firstName) ? 'No numbers allowed' : '',
                lastName: containNumbers(lastName) ? 'No numbers allowed' : '',
                email: '',
                province: '',
                city: containNumbers(city) ? 'No numbers allowed' : '',
                address: !containNumbers(address) || !containLetters(address) ? 'Include street name and number' : '',
                postalCode: '',
                phone: '',
            });
            window.scrollTo(0, 0);
            return;
        }

        if (
            firstName.length < 2 ||
            lastName.length < 2 ||
            city.length < 2 ||
            postalCode.length < 3 ||
            postalCode.length > 8 ||
            phone.length < 9 ||
            !email.includes('@')
        ) {
            setErrors({
                firstName: firstName.length < 2 ? 'Too short' : '',
                lastName: lastName.length < 2 ? 'Too short' : '',
                email: !email.includes('@') ? 'Enter a valid email' : '',
                province: '',
                city: city.length < 2 ? 'Too short' : '',
                address: '',
                postalCode: postalCode.length < 3 || postalCode.length > 8 ? 'Invalid postal code' : '',
                phone: phone.length < 9 ? 'Enter a valid SA number' : '',
            });
            window.scrollTo(0, 0);
            return;
        }

        resetErrors();

        const stockValid = await checkout.validateStock(items);
        if (!stockValid) {
            window.scrollTo(0, 0);
            return;
        }

        const shippingMethod = getShippingMethod(subtotal, shippingType);

        const success = await processCheckout(
            items,
            {
                firstName,
                lastName,
                email,
                phone,
                address,
                city,
                state: province,
                postcode: postalCode,
                country: 'ZA',
                useSameAddress: true,
                customerNote: customerNote || undefined,
                deliveryMethod: 'shipping',
            },
            shippingMethod
        );

        if (success) {
            clearCart();
        }
    };

    if (initialized && itemCount === 0) {
        return <Navigate to="/cart" replace />;
    }

    if (!initialized) {
        return null;
    }

    return (
        <div className="billing">
            <ViewHeader title="Checkout" />

            {(error || stockErrors.length > 0) && (
                <div className="billing-errors" role="alert">
                    {error && <p>{error}</p>}
                    {stockErrors.map((stockError) => (
                        <p key={stockError.productId}>
                            {stockError.name ? `${stockError.name}: ` : ''}
                            {stockError.error}
                        </p>
                    ))}
                </div>
            )}

            <form autoComplete="off" className="billing-main-grid" onSubmit={formValidation}>
                <div className="billing-information">
                    <h3 className="bi-title">Delivery Information</h3>

                    <div className="bi-fields">
                        <div className="name-lastname">
                            <div className="form-field">
                                <label htmlFor="firstName">
                                    First Name
                                    <span className="form-error">{errors.firstName && `(${errors.firstName})`}</span>
                                </label>
                                <input
                                    style={errors.firstName ? { borderColor: 'var(--red-100)' } : {}}
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="lastName">
                                    Last Name
                                    <span className="form-error">{errors.lastName && `(${errors.lastName})`}</span>
                                </label>
                                <input
                                    style={errors.lastName ? { borderColor: 'var(--red-100)' } : {}}
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">
                                Email
                                <span className="form-error">{errors.email && `(${errors.email})`}</span>
                            </label>
                            <input
                                style={errors.email ? { borderColor: 'var(--red-100)' } : {}}
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="province">
                                Province
                                <span className="form-error">{errors.province && `(${errors.province})`}</span>
                            </label>
                            <select
                                style={errors.province ? { borderColor: 'var(--red-100)' } : {}}
                                id="province"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            >
                                <option value="" disabled>
                                    Select province
                                </option>
                                <option value="Gauteng">Gauteng</option>
                                <option value="Western Cape">Western Cape</option>
                                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                <option value="Eastern Cape">Eastern Cape</option>
                                <option value="Limpopo">Limpopo</option>
                                <option value="Mpumalanga">Mpumalanga</option>
                                <option value="North West">North West</option>
                                <option value="Free State">Free State</option>
                                <option value="Northern Cape">Northern Cape</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="city">
                                Town / City
                                <span className="form-error">{errors.city && `(${errors.city})`}</span>
                            </label>
                            <input
                                style={errors.city ? { borderColor: 'var(--red-100)' } : {}}
                                type="text"
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="street">
                                Street & House / Unit Number
                                <span className="form-error">{errors.address && `(${errors.address})`}</span>
                            </label>
                            <input
                                style={errors.address ? { borderColor: 'var(--red-100)' } : {}}
                                type="text"
                                id="street"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="postal-phone">
                            <div className="form-field">
                                <label htmlFor="postal-code">
                                    Postal Code
                                    <span className="form-error">{errors.postalCode && `(${errors.postalCode})`}</span>
                                </label>
                                <input
                                    style={errors.postalCode ? { borderColor: 'var(--red-100)' } : {}}
                                    type="text"
                                    id="postal-code"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="phone">
                                    Phone (SA)
                                    <span className="form-error">{errors.phone && `(${errors.phone})`}</span>
                                </label>
                                <input
                                    style={errors.phone ? { borderColor: 'var(--red-100)' } : {}}
                                    type="tel"
                                    id="phone"
                                    placeholder="e.g. 0821234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="customer-note">Order Notes (optional)</label>
                            <textarea
                                id="customer-note"
                                rows={3}
                                value={customerNote}
                                onChange={(e) => setCustomerNote(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="order-resume">
                    <h3 className="or-title">Your Order</h3>

                    <BillingCartResume items={items} />

                    <div className="or-cost">
                        <div className="orc-subtotal">
                            <label>Subtotal</label>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="orc-subtotal">
                            <label>Delivery</label>
                            <span>
                                {shippingPrice === 0 ? 'Free' : formatPrice(shippingPrice)}
                            </span>
                        </div>
                        <div className="orc-total orc-subtotal">
                            <label>Total</label>
                            <span>{formatPrice(orderTotal)}</span>
                        </div>
                    </div>

                    <p className="billing-payment-note">
                        You will be redirected to PayFast to complete your payment securely.
                    </p>

                    <input
                        type="submit"
                        value={loading ? 'Processing...' : 'Pay with PayFast'}
                        className="button finish-order-btn"
                        disabled={loading}
                    />

                    <Link to="/cart" className="billing-back-link">
                        Back to Cart
                    </Link>
                </div>
            </form>
        </div>
    );
};
