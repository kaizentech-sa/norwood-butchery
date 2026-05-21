import { createContext, useEffect, useState } from 'react';
// Interfaces
import { ILSModalContext } from 'interfaces/lsModalContext';

export const LSModalContext = createContext<ILSModalContext>({
    isOpen: false,
    openModal: () => {},
    closeModal: () => {}
}); 

type props = {
    children: JSX.Element | JSX.Element[];
}

export const LSModalContextProvider = ({ children }: props) => {
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.dataset.modalScrollY = String(scrollY);
            document.body.style.top = `-${scrollY}px`;
            document.body.classList.add('scroll-locked');
        } else {
            if (!document.body.classList.contains('scroll-locked')) return;
            const scrollY = Number(document.body.dataset.modalScrollY || '0');
            document.body.classList.remove('scroll-locked');
            document.body.style.top = '';
            delete document.body.dataset.modalScrollY;
            window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior });
        }
    }, [isOpen]);

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    return (
        <LSModalContext.Provider value={{
            isOpen,
            openModal,
            closeModal
        }}>
            {children}
        </LSModalContext.Provider>
    )
}