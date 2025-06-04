import { URL_API } from '@/constants'

export async function fetchMyCharacters(token: string) {
    const url = `${URL_API}/my/characters?page=1&size=50`
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await fetch(url, options)
        const json = await response.json()
        console.log(json)
        return json?.data ?? []
    } catch (error) {
        console.error('Erreur lors du chargement des personnages:', error)
        return []
    }
}