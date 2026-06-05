import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'App';
import reportWebVitals from 'misc/reportWebVitals';
// Router
import { BrowserRouter } from 'react-router-dom';
// Contexts
import { AuthContextProvider } from 'contexts/AuthContext';
import { CartContextProvider } from 'contexts/CartContext';
import { LSModalContextProvider } from 'contexts/LSModalContext';
import { ShopProvider } from 'shop/core/ShopProvider';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <CartContextProvider>
                    <ShopProvider>
                        <LSModalContextProvider>
                            <App />
                        </LSModalContextProvider>
                    </ShopProvider>
                </CartContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
