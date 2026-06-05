/**
 * Sam's Hardware Product Card Component
 * 
 * A reusable product card with Teenage Engineering-inspired styling.
 */

'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, ShoppingCart, Heart, Zap, Settings } from 'lucide-react';
import { gsap } from 'gsap';
import { formatPrice, getDiscountPercentage } from '../utils/helpers';
import { SHOP_CONFIG, SHOP_ROUTES } from '../utils/constants';
import type { Product } from '../core/ports';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onAddToCart, onQuickView, className = '' }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Mouse enter animation
  const handleMouseEnter = () => {
    if (window.innerWidth < 768) return;
    if (!cardRef.current || !overlayRef.current) return;
    
    gsap.to(cardRef.current, {
      y: -8,
      duration: 0.3,
      ease: 'power2.out',
    });
    
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
    });
  };
  
  // Mouse leave animation
  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    if (!cardRef.current || !overlayRef.current) return;
    
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
    
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
    });
  };
  
  const imageUrl = product.images?.[0] || SHOP_CONFIG.PLACEHOLDER_IMAGE;
  const isOnSale = product.onSale && product.salePrice && product.salePrice < product.regularPrice;
  const discountPercent = isOnSale ? getDiscountPercentage(product.regularPrice, product.salePrice!) : 0;
  const isOutOfStock = product.stockStatus === 'outofstock';
  const hasVariations = product.type === 'variable' || product.hasVariations || (product.variations && product.variations.length > 0);
  
  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;

    if (hasVariations) {
      router.push(`${SHOP_ROUTES.PRODUCT}/${product.id}`);
      return;
    }

    onAddToCart?.(product);
  };
  
  return (
    <div
      ref={cardRef}
      className={`group relative max-xl:mx-auto w-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`${SHOP_ROUTES.PRODUCT}/${product.id}`} className='block group'>
        {/* Product image container */}
        <div className='relative bg-white h-44 sm:h-56 lg:h-64 w-full overflow-hidden border-2 border-[var(--te-grey-200)] group-hover:border-[var(--te-yellow)] transition-colors duration-300'>
          {/* Yellow accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--te-yellow)] via-[var(--te-yellow)] to-transparent z-20" />
          
          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-[var(--te-grey-300)] group-hover:border-[var(--te-yellow)] transition-colors z-10" />
          <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-[var(--te-grey-300)] group-hover:border-[var(--te-yellow)] transition-colors z-10" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-[var(--te-grey-300)] group-hover:border-[var(--te-yellow)] transition-colors z-10" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-[var(--te-grey-300)] group-hover:border-[var(--te-yellow)] transition-colors z-10" />
          
          {/* Discount badge */}
          {isOnSale && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2 py-1 bg-[var(--te-red)] text-[var(--te-white)]">
              <Zap size={10} />
              <span className="text-[10px] font-bold font-mono">-{discountPercent}%</span>
            </div>
          )}
          
          {/* Stock indicator LED */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${!isOutOfStock ? 'bg-[var(--te-green)] shadow-[0_0_8px_rgba(0,200,83,0.6)]' : 'bg-[var(--te-red)]'}`} />
            <span className="text-[8px] font-bold text-[var(--te-grey-400)] tracking-widest uppercase">
              {!isOutOfStock ? 'IN STOCK' : 'OUT'}
            </span>
          </div>
          
          {/* Product image */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Image
              src={imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className='max-h-32 sm:max-h-40 lg:max-h-48 w-auto object-contain transition-transform duration-500 group-hover:scale-110'
            />
          </div>
          
          {/* Hover overlay with actions */}
          <div 
            ref={overlayRef}
            className="absolute inset-0 bg-[var(--te-dark)]/80 flex items-center justify-center opacity-0 z-30"
          >
            <div ref={actionsRef} className="flex gap-3">
              {onQuickView && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  className="flex items-center justify-center w-12 h-12 bg-[var(--te-red)] text-[var(--te-white)] hover:bg-[var(--te-red-light)] transition-colors"
                  aria-label="Quick view"
                >
                  <Eye size={20} />
                </button>
              )}
              <button
                onClick={handleAction}
                disabled={isOutOfStock}
                className="flex items-center justify-center w-12 h-12 bg-[var(--te-red)] text-[var(--te-white)] hover:bg-[var(--te-red-light)] transition-colors disabled:opacity-50"
                aria-label={hasVariations ? "Select Options" : "Add to cart"}
                title={hasVariations ? "Select Options" : "Add to Cart"}
              >
                {hasVariations ? <Settings size={20} /> : <ShoppingCart size={20} />}
              </button>
            </div>
          </div>
          
        </div>
        
        {/* Product info */}
        <div className='pt-4 px-1'>
          {/* Category tag */}
          {product.categories && product.categories.length > 0 && (
            <span className="text-[9px] font-bold text-[var(--te-yellow)] tracking-[0.2em] uppercase">
              {product.categories[0]}
            </span>
          )}
          
          {/* Product name */}
          <h3 className='font-sans text-sm sm:text-base font-semibold text-[var(--te-dark)] normal-case tracking-normal mt-1 truncate group-hover:text-[var(--te-yellow)] transition-colors'>
            {product.name}
          </h3>
          
          {/* Price section */}
          <div className='flex items-end justify-between mt-3 pt-3 border-t border-[var(--te-grey-200)]'>
            <div className="flex flex-col">
              {isOnSale && (
                <span className='text-xs text-[var(--te-grey-400)] line-through font-mono mb-0.5'>
                  {formatPrice(product.regularPrice)}
                </span>
              )}
              <span className='text-lg sm:text-xl font-black text-[var(--te-dark)] font-mono leading-none'>
                {formatPrice(isOnSale ? product.salePrice : product.price)}
              </span>
            </div>
            
            {/* Quick add button */}
            <button 
              className="flex items-center justify-center w-8 h-8 bg-[var(--te-red)] text-[var(--te-white)] hover:bg-[var(--te-red-light)] transition-all disabled:opacity-50 disabled:hover:bg-[var(--te-red)] disabled:cursor-not-allowed"
              onClick={handleAction}
              disabled={isOutOfStock}
              aria-label={hasVariations ? "Select Options" : "Add to cart"}
              title={hasVariations ? "Select Options" : "Add to Cart"}
            >
              {hasVariations ? <Settings size={14} /> : <ShoppingCart size={14} />}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
