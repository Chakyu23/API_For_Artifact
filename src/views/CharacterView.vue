<template>
  <div class="character-view">
    <CharacterCard
        v-for="(char, index) in characterStore.characters"
        :key="index"
        :character="char"
        @move="openMovePopup(char.name)"
    />

    <!-- Popup de déplacement -->
    <MovePopup
        v-if="selectedCharacterName"
        @validate="handleMove"
        @cancel="selectedCharacterName = null"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCharacterStore } from '@/stores/character'
import { fetchMyCharacters } from '@/request/character'
import { bankGold } from '@/request/Auth'
import CharacterCard from '@/components/CharacterCard.vue'
import MovePopup from '@/components/MovePopup.vue'
import { moveCharacter } from '@/ScriptRaw/basicScript/character/movement' // adapte ce chemin selon ton arborescence réelle

const user = useUserStore()
const characterStore = useCharacterStore()
const selectedCharacterName = ref<string | null>(null)

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

// Ouvre la popup pour le personnage ciblé
const openMovePopup = (name: string) => {
  selectedCharacterName.value = name
}

// Lorsqu'on valide la popup
const handleMove = async ({ x, y }: { x: number; y: number }) => {
  const character = characterStore.characters.find(c => c.name === selectedCharacterName.value)
  if (!character) return

  await moveCharacter(character.name, x, y, user.token, false)
  // Fermer la popup dans tous les cas
  selectedCharacterName.value = null
  // Recharge les données après mouvement

  await loadCharacters()
}

let intervalId: number = 0
onMounted(() => {
  loadCharacters()
  refreshGold()

  ////Si besoin d'auto-refresh plus tard
  //intervalId = window.setInterval(() => {
  //  loadCharacters()
  //  refreshGold()
  //}, 3000)
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
