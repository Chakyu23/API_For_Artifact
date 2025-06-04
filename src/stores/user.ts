import { defineStore } from 'pinia'

interface UserState {
    token: string | null
    gold: number
    isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: null,
        gold: 0,
        isAuthenticated: false
    }),

    actions: {
        login(token: string, gold: number) {
            this.token = token
            this.gold = gold
            this.isAuthenticated = true
        },

        logout() {
            this.token = null
            this.gold = 0
            this.isAuthenticated = false
        },

        updateGold(amount: number) {
            this.gold = amount
        }
    }
})
