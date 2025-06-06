import {URL_API} from "@/constants";

export async function bankGold(Token: string): Promise<number | null> {
    if (!Token) return null

    console.log(Token);
    const url = URL_API + '/my/bank'
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${Token}`
        }
    }

    try {
        const response = await fetch(url, options)

        if (response.status === 404) {
            // Pas de gold à la banque, mais token valide
            return 0
        }

        if (!response.ok) {
            return null
        }

        const json = await response.json()
        const gold = json?.data?.gold
        console.log(json)
        return typeof gold === 'number' ? gold : 0
    } catch (error) {
        console.error('Gold fetch error:', error)
        return null
    }
}
