import { useState } from 'react'

type CitySearchFormProps = {
  onSubmit: (city: string) => Promise<boolean>
}

export default function CitySearchForm({ onSubmit }: CitySearchFormProps) {
  const [input, setInput] = useState('')
  const [notFound, setNotFound] = useState(false)

  return (
    <form
      onSubmit={async(e) => {
        e.preventDefault()
        const success = await onSubmit(input)
        setNotFound(!success)
      }}
    >
      <p>We couldn't get your location. Enter your city instead:</p>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setNotFound(false) // clear the error once they start typing again
        }}
        placeholder="e.g. Strasbourg"
      />
      <button type="submit">Search</button>
      {notFound && <p style={{ color: 'red' }}>City not found — try again.</p>}
    </form>
  )
}