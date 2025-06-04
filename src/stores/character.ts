import { defineStore } from 'pinia'

export interface Character {
    name: string
    position: { x: number; y: number }
    maxHp: number
    currentHp: number
    xp: number
    level: number
    xpToNextLevel: number
    gold: number
    skinName: string
    mapName: string
    cooldown: number
    cooldownExpiration: string
}

interface CharacterState {
    characters: Character[]
}

export const useCharacterStore = defineStore('character', {
    state: (): CharacterState => ({
        characters: []
    }),

    actions: {
        /**
         * Charge une liste de personnages depuis l'API
         */
        loadCharacters(apiData: any[]) {
            this.characters = apiData.map((data): Character => ({
                name: data.name,
                position: { x: data.x, y: data.y },
                maxHp: data.max_hp,
                currentHp: data.hp,
                xp: data.xp,
                level: data.level,
                xpToNextLevel: data.max_xp,
                gold: data.gold,
                skinName: data.skin,
                mapName: '', // ou `data.map` si dispo plus tard
                cooldown: data.cooldown,
                cooldownExpiration: data.cooldown_expiration
            }))
        },

        /**
         * Met à jour un personnage par son nom
         */
        updateCharacter(name: string, partialData: Partial<Character>) {
            const char = this.characters.find(c => c.name === name)
            if (char) Object.assign(char, partialData)
        }
    }
})
