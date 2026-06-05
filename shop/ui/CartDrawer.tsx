/**
 * Sam's Hardware Cart Drawer Component
 * 
 * A slide-out cart drawer with Teenage Engineering styling.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { formatPrice } from '../utils/helpers';
import { SHOP_CONFIG, SHOP_ROUTES } from '../utils/constants';
import type { CartItem } from '../core/ports';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  onRemoveItem: (productId: number, variationId?: number) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  total,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Animation on open/close
  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        pointerEvents: 'auto',
      });
      
      gsap.to(drawerRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        pointerEvents: 'none',
      });
      
      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          document.body.style.overflow = '';
        },
      });
    }
  }, [isOpen]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-te-dark/80 backdrop-blur-sm opacity-0 pointer-events-none"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-te-white shadow-2xl translate-x-full"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-te-grey/20 p-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-te-dark" size={24} />
              <h2 className="text-lg font-bold tracking-tight text-te-dark">
                YOUR CART ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="te-button h-10 w-10 !p-0 flex items-center justify-center"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="mb-4 text-te-grey" size={64} strokeWidth={1} />
                <p className="mb-2 text-lg font-medium text-te-dark">Your cart is empty</p>
                <p className="mb-6 text-sm text-te-grey">Add some products to get started</p>
                <Link href={SHOP_ROUTES.SHOP} onClick={onClose}>
                  <button className="te-button-primary">
                    CONTINUE SHOPPING
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={`${item.productId}-${item.variationId || 'default'}`}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-te-grey/20 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm uppercase tracking-wider text-te-grey">Subtotal</span>
                <span className="text-xl font-bold text-te-dark">{formatPrice(total)}</span>
              </div>
              <p className="mb-4 text-xs text-te-grey">
                Shipping and taxes calculated at checkout
              </p>
              <div className="flex gap-3">
                <Link href={SHOP_ROUTES.CART} onClick={onClose} className="flex-1">
                  <button className="te-button w-full">VIEW CART</button>
                </Link>
                <Link href={SHOP_ROUTES.CHECKOUT} onClick={onClose} className="flex-1">
                  <button className="te-button-primary w-full">CHECKOUT</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Cart Item Card Sub-component
interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  onRemove: (productId: number, variationId?: number) => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const price = Number(item.salePrice ?? item.price ?? item.regularPrice) || 0;
  const lineTotal = price * item.quantity;
  
  return (
    <div className="flex gap-4 te-panel p-3">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-te-grey/20">
        <Image
          src={item.image || SHOP_CONFIG.PLACEHOLDER_IMAGE}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      
      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-te-dark truncate">{item.name}</h3>
        
        {/* Variation */}
        {item.variation && Object.keys(item.variation).length > 0 && (
          <p className="text-xs text-te-grey mt-1">
            {Object.entries(item.variation).map(([key, value]) => (
              <span key={key}>{key}: {value} </span>
            ))}
          </p>
        )}
        
        <div className="mt-2 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center border border-te-grey/30">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1, item.variationId)}
              className="h-8 w-8 flex items-center justify-center text-te-dark hover:bg-te-grey/10 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.variationId)}
              disabled={item.soldIndividually}
              className="h-8 w-8 flex items-center justify-center text-te-dark hover:bg-te-grey/10 transition-colors disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {/* Price & Remove */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-te-dark">{formatPrice(lineTotal)}</span>
            <button
              onClick={() => onRemove(item.productId, item.variationId)}
              className="text-te-grey hover:text-te-dark transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;

