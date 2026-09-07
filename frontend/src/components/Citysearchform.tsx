import { useState } from 'react'

type CitySearchFormProps = {
  onSubmit: (city: string) => Promise<boolean>
}

export default function CitySearchForm({ onSubmit }: CitySearchFormProps) {
  const [input, setInput] = useState('')
  const [notFound, setNotFound] = useState(false)

  return (
    <form
      className="city-search"
      onSubmit={async (e) => {
        e.preventDefault()
        const success = await onSubmit(input)
        setNotFound(!success)
      }}
    >
      <p>Nous n'avons pas pu vous localiser. Indiquez votre ville :</p>
      <div className="city-search__row">
        <input
          className="city-search__input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setNotFound(false)
          }}
          placeholder="ex. Strasbourg"
        />
        <button className="btn btn--primary" type="submit">
          Rechercher
        </button>
      </div>
      {notFound && <p className="city-search__error">Ville introuvable — réessayez.</p>}
    </form>
  )
}