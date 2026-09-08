import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import { useListings } from '../context/Listingscontext';
import { geocodeCity } from '../api/geocode';

export default function Publishoffer() {
  const { user } = useAuth();
  const { addListing } = useListings();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await geocodeCity(address)
      if (!result) {
        setError("Adresse introuvable, essayez d'être plus précis.")
        return
      }
      const [lat, lng] = result

    addListing({
      title,
      company: user?.companyName ?? 'Entreprise',
      description,
      address,
      date: new Date().toISOString(),
      lat,
      lng,
    })

      navigate('/map')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="publish-offer">
      <h1>Publier une offre</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Titre du poste
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description complète
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Adresse du poste
          <input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="ex: 10 rue de la Gare, Strasbourg" />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publication...' : "Publier l'offre"}
        </button>
      </form>
    </div>
  );
}