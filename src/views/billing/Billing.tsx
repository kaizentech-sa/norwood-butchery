import React, { useContext, useEffect, useState } from 'react';
// Components
import { ViewHeader } from 'components/common/viewHeader/ViewHeader';
import { BillingCartResume } from './components/billingCartResume/BillingCartResume';
import { OrderModal } from './components/orderModal/OrderModal';
// Contexts
import { CartContext } from 'contexts/CartContext';
// Utils
import { containNumbers, containLetters } from 'utils/formValidation';
// Interfaces
import { Product } from 'interfaces/product';
// Styles
import './Billing.css';


export const Billing = () => {

    const { products, expressShipping, cardPayment, setExpressShipping, setCardPayment, clear, getSubtotal, getTotal, cartLength } = useContext(CartContext);

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [direction, setDirection] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');

    const [orderId, setOrderId] = useState('');
    const [orderReceived, setOrderReceived] = useState(false);
    const [productsOrdered, setProductsOrdered] = useState<Product[]>([]);
    const [productsOrderedTotal, setProductsOrderedTotal] = useState(0);
    const [orderModalOpen, setOrderModalOpen] = useState(false);

    const [errors, setErrors] = useState({
        name: '', lastname: '', province: '', city: '', direction: '', postalCode: '', phone: ''
    });

    const resetErrors = () => setErrors({
        name: '', lastname: '', province: '', city: '', direction: '', postalCode: '', phone: ''
    });

    const formValidation = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (cartLength() <= 0) return;

        if (!name || !lastname || !province || !city || !direction || !postalCode || !phone) {
            setErrors({
                name: !name ? 'Required' : '',
                lastname: !lastname ? 'Required' : '',
                province: !province ? 'Required' : '',
                city: !city ? 'Required' : '',
                direction: !direction ? 'Required' : '',
                postalCode: !postalCode ? 'Required' : '',
                phone: !phone ? 'Required' : '',
            });
            window.scrollTo(0, 0);
            return;
        }

        if (containNumbers(name) || containNumbers(lastname) || containNumbers(city) || !containNumbers(direction) || !containLetters(direction)) {
            setErrors({
                name: containNumbers(name) ? 'No numbers allowed' : '',
                lastname: containNumbers(lastname) ? 'No numbers allowed' : '',
                province: '',
                city: containNumbers(city) ? 'No numbers allowed' : '',
                direction: (!containNumbers(direction) || !containLetters(direction)) ? 'Include street name and number' : '',
                postalCode: '',
                phone: '',
            });
            window.scrollTo(0, 0);
            return;
        }

        if (name.length < 2 || lastname.length < 2 || city.length < 2 || postalCode.length < 3 || postalCode.length > 8 || phone.length < 9) {
            setErrors({
                name: name.length < 2 ? 'Too short' : '',
                lastname: lastname.length < 2 ? 'Too short' : '',
                province: '',
                city: city.length < 2 ? 'Too short' : '',
                direction: '',
                postalCode: (postalCode.length < 3 || postalCode.length > 8) ? 'Invalid postal code' : '',
                phone: phone.length < 9 ? 'Enter a valid SA number' : '',
            });
            window.scrollTo(0, 0);
            return;
        }

        if (!orderReceived) {
            const generatedId = `NHB-${Date.now().toString(36).toUpperCase()}`;
            setOrderId(generatedId);
            setOrderModalOpen(true);
            setOrderReceived(true);
            setProductsOrdered(products);
            setProductsOrderedTotal(getTotal());
            clear();
            resetErrors();
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <OrderModal
                data={{ name, lastname, country: province, city, direction, postalCode, phone }}
                id={orderId}
                products={productsOrdered}
                total={productsOrderedTotal}
                isOpen={orderModalOpen}
            />

            <div className="billing">
                <ViewHeader title={'Checkout'} />

                <form autoComplete="off" className="billing-main-grid" onSubmit={formValidation}>

                    {/* Billing information */}
                    <div className="billing-information">
                        <h3 className="bi-title">Delivery Information</h3>

                        <div className="bi-fields">

                            <div className="name-lastname">
                                <div className="form-field">
                                    <label htmlFor="name">
                                        First Name
                                        <span style={errors.name ? { animation: 'error 0.5s' } : {}} className="form-error">
                                            {errors.name && `(${errors.name})`}
                                        </span>
                                    </label>
                                    <input
                                        style={errors.name ? { borderColor: 'var(--red-100)' } : {}}
                                        type="text" name="name" id="name"
                                        value={name} onChange={e => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="lastname">
                                        Last Name
                                        <span style={errors.lastname ? { animation: 'error 0.5s' } : {}} className="form-error">
                                            {errors.lastname && `(${errors.lastname})`}
                                        </span>
                                    </label>
                                    <input
                                        style={errors.lastname ? { borderColor: 'var(--red-100)' } : {}}
                                        type="text" name="lastname" id="lastname"
                                        value={lastname} onChange={e => setLastname(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="province">
                                    Province
                                    <span style={errors.province ? { animation: 'error 0.5s' } : {}} className="form-error">
                                        {errors.province && `(${errors.province})`}
                                    </span>
                                </label>
                                <select
                                    style={errors.province ? { borderColor: 'var(--red-100)' } : {}}
                                    name="province" id="province"
                                    value={province} onChange={e => setProvince(e.target.value)}
                                >
                                    <option value="" disabled>Select province</option>
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
                                    <span style={errors.city ? { animation: 'error 0.5s' } : {}} className="form-error">
                                        {errors.city && `(${errors.city})`}
                                    </span>
                                </label>
                                <input
                                    style={errors.city ? { borderColor: 'var(--red-100)' } : {}}
                                    type="text" name="city" id="city"
                                    value={city} onChange={e => setCity(e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="street">
                                    Street & House / Unit Number
                                    <span style={errors.direction ? { animation: 'error 0.5s' } : {}} className="form-error">
                                        {errors.direction && `(${errors.direction})`}
                                    </span>
                                </label>
                                <input
                                    style={errors.direction ? { borderColor: 'var(--red-100)' } : {}}
                                    type="text" name="street" id="street"
                                    value={direction} onChange={e => setDirection(e.target.value)}
                                />
                            </div>

                            <div className="postal-phone">
                                <div className="form-field">
                                    <label htmlFor="postal-code">
                                        Postal Code
                                        <span style={errors.postalCode ? { animation: 'error 0.5s' } : {}} className="form-error">
                                            {errors.postalCode && `(${errors.postalCode})`}
                                        </span>
                                    </label>
                                    <input
                                        style={errors.postalCode ? { borderColor: 'var(--red-100)' } : {}}
                                        type="text" name="postal_code" id="postal-code"
                                        value={postalCode} onChange={e => setPostalCode(e.target.value)}
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="phone">
                                        Phone (SA)
                                        <span style={errors.phone ? { animation: 'error 0.5s' } : {}} className="form-error">
                                            {errors.phone && `(${errors.phone})`}
                                        </span>
                                    </label>
                                    <input
                                        style={errors.phone ? { borderColor: 'var(--red-100)' } : {}}
                                        type="tel" name="phone" id="phone"
                                        placeholder="e.g. 0821234567"
                                        value={phone} onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Order resume */}
                    <div className="order-resume">
                        <h3 className="or-title">Your Order</h3>

                        <BillingCartResume />

                        <div className="or-cost">
                            <div className="orc-subtotal">
                                <label>Subtotal</label>
                                <span>R {getSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="orc-shipping">
                                <label>Delivery</label>
                                <div className="orcs-select">
                                    <div>
                                        <input
                                            type="radio" name="shipping_type" id="standard"
                                            checked={!expressShipping}
                                            onChange={() => setExpressShipping(false)}
                                        />
                                        <label htmlFor="standard">Standard (2–4 days)</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio" name="shipping_type" id="express"
                                            checked={expressShipping}
                                            onChange={() => setExpressShipping(true)}
                                        />
                                        <label htmlFor="express">Express (Next day)</label>
                                    </div>
                                </div>
                                <div className="orcs-prices">
                                    <span>R 80.00</span>
                                    <span>R 150.00</span>
                                </div>
                            </div>
                            <div className="orc-total orc-subtotal">
                                <label>Total</label>
                                <span>R {getTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="payment-options">
                            <div>
                                <input
                                    type="radio" name="payment_type" id="delivery"
                                    checked={!cardPayment}
                                    onChange={() => setCardPayment(false)}
                                />
                                <label htmlFor="delivery">Cash on delivery</label>
                            </div>
                            <div>
                                <input
                                    type="radio" name="payment_type" id="card"
                                    checked={cardPayment}
                                    onChange={() => setCardPayment(true)}
                                />
                                <label htmlFor="card">EFT / Card payment</label>
                            </div>
                        </div>

                        <input type="submit" value="Place Order" className="button finish-order-btn" />
                    </div>

                </form>
            </div>
        </>
    )
}
