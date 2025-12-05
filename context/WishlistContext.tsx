// context/WishlistContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (bookId: string) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToWishlist = (bookId: string) => {
    setWishlist(prev => [...prev, bookId]);
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist(prev => prev.filter(id => id !== bookId));
  };

  const isInWishlist = (bookId: string) => {
    return wishlist.includes(bookId);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};