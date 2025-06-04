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
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCharacterStore } from '@/stores/character'
import { fetchMyCharacters } from '@/request/character'
import CharacterCard from '@/components/CharacterCard.vue'

const user = useUserStore()
const characterStore = useCharacterStore()

onMounted(async () => {
  if (!user.token) return
  const apiCharacters = await fetchMyCharacters(user.token)
  characterStore.loadCharacters(apiCharacters)
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
