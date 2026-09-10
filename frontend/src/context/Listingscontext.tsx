import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import initialListings, { type Listing } from '../data/mockListings'
import { useAuth } from './Authcontext'

interface ListingsContextType {
  listings: Listing[]
  addListing: (listing: Omit<Listing, 'id'>) => Promise<void>
  removeListing: (id: number) => Promise<void>
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { token } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    fetch('http://localhost:8080/offer/get')
      .then(async (response) => {
        if (!response.ok) throw new Error('Impossible de charger les offres')
        return response.json()
      })
      .then((offers) => {
        const persistedListings: Listing[] = (offers ?? []).map((offer: BackendOffer): Listing => ({
          id: offer.id,
          title: offer.offer_name,
          company: offer.company_name,
          description: offer.description,
          address: offer.address,
          date: offer.date,
          lat: offer.latitude,
          lng: offer.longitude,
        }))
        const persistedIds = new Set(persistedListings.map((listing) => listing.id))
        setListings([
          ...persistedListings,
          ...initialListings.filter((listing) => !persistedIds.has(listing.id)),
        ])
      })
      .catch(() => setListings([]))
  }, [])

  const addListing = async (listing: Omit<Listing, 'id'>) => {
    if (!token) throw new Error('Utilisateur non connecté')

    const response = await fetch('http://localhost:8080/offer/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        offer_name: listing.title,
        description: listing.description,
        address: listing.address,
        company_name: listing.company,
        salary: 0,
        latitude: listing.lat,
        longitude: listing.lng,
        max_distance: 0,
      }),
    })
    if (!response.ok) throw new Error('Impossible de créer l’offre')

    const createdOffer = await response.json()
    setListings((previous) => [{
      ...listing,
      id: createdOffer.id,
    }, ...previous])
  }

  const removeListing = async (id: number) => {
    if (!token) throw new Error('Utilisateur non connecté')
    const response = await fetch(`http://localhost:8080/offer/delete/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Impossible de supprimer l’offre')
    setListings((previous) => previous.filter((listing) => listing.id !== id))
  }

  const contextValue = useMemo(
    () => ({ listings, addListing, removeListing }),
    [listings, token],
  )

  return (
    <ListingsContext.Provider value={contextValue}>
      {children}
    </ListingsContext.Provider>
  );
}

type BackendOffer = {
  id: number
  offer_name: string
  description: string
  address: string
  company_name: string
  date: string
  latitude: number
  longitude: number
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error('useListings must be used within ListingsProvider');
  return ctx;
}