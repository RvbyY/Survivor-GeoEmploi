export async function geocodeCity(
  query: string
): Promise<[number, number] | null> {
  const response = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`
  )
  const data = await response.json()

  if (data.features.length === 0) {
    console.log('No match found for', query)
    return null
  }

  const [lng, lat] = data.features[0].geometry.coordinates
  return [lat, lng]
}