<template>
  <div class="character-view">
    <CharacterCard
        v-for="(char, index) in characterStore.characters"
        :key="index"
        :character="char"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCharacterStore } from '@/stores/character'
import { fetchMyCharacters } from '@/request/character'
import CharacterCard from '@/components/CharacterCard.vue'
import {bankGold} from "@/request/Auth";

const user = useUserStore()
const characterStore = useCharacterStore()

const loadCharacters = async () => {
  if (!user.token) return
  const characters = await fetchMyCharacters(user.token)
  characterStore.loadCharacters(characters)
}

const refreshGold = async () => {
  if (!user.token) return
  const result = await bankGold(user.token)
  if (typeof result === 'number') {
    user.updateGold(result)
  }
}

let intervalId: number = 0

const onFocus = () => {
  if (document.visibilityState === 'visible') {
    loadCharacters()
  }
}

onMounted(() => {
  loadCharacters()
  refreshGold()

  // intervalId = window.setInterval(() => {
  //   loadCharacters()
  //   refreshGold()
  // }, 3000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    loadCharacters()
    refreshGold()
  }
})
</script>

<style scoped>
.character-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}
</style>
