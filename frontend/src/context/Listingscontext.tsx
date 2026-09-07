import { createContext, useContext, useState, type ReactNode } from 'react';
import initialListings from '../data/mockListings'
import type { Listing } from '../data/mockListings'

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id'>) => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);

  //TODO: link with backend

  const addListing = (listing: Omit<Listing, 'id'>) => {
  const newListing: Listing = {
      ...listing,
      id: Date.now(),
    }
    setListings((prev) => [newListing, ...prev])
  }

  return (
    <ListingsContext.Provider value={{ listings, addListing }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error('useListings must be used within ListingsProvider');
  return ctx;
}