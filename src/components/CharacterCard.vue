<template>
  <div
      class="character-card"
      :class="{ 'cooldown-active': isInCooldown }"
  >
    <!-- Colonne gauche (Skin + Map) -->
    <div class="left-column">
      <div><strong>Skin :</strong> {{ character.skinName }}</div>
      <div><strong>Map :</strong> {{ character.mapName || 'Inconnue' }}</div>
    </div>

    <!-- Colonne centrale -->
    <div class="center-column">
      <div class="name-level">
        <span class="name bold">{{ character.name }}</span>
        <span class="level">LVL [{{ character.level }}]</span>
      </div>

      <div class="bar-container">
        <img src="@/assets/HP-64px.png" alt="" class="icon64">
        <div class="bar">
          <div class="bar-track">
            <div class="bar-fill hp" :style="{ width: hpPercent + '%' }"></div>
            <span class="bar-text">{{ character.currentHp }} / {{ character.maxHp }}</span>
          </div>
        </div>
      </div>

      <div class="bar-container">
        <img src="@/assets/XP-64px.png" alt="" class="icon64">
        <div class="bar">
          <div class="bar-track">
            <div class="bar-fill xp" :style="{ width: xpPercent + '%' }"></div>
            <span class="bar-text">{{ character.xp }} / {{ character.xpToNextLevel }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Colonne droite (Gold + coordonnée + boutons) -->
    <div class="right-column">
      <div class="bold">{{ character.gold }} 🪙</div>
      <div>[{{ character.position.x }}, {{ character.position.y }}]</div>

      <div class="action-box">
        <img
            @click="onMove"
            src="@/assets/Fight-32px.png"
            alt=""
            class="icon32 iconButton"
            :class="{ disabled: isInCooldown }"
        />
        <img
            @click="onRest"
            src="@/assets/Rest-32px.png"
            alt=""
            class="icon32 iconButton"
            :class="{ disabled: isInCooldown }"
        />
        <img
            @click="onBattle"
            src="@/assets/Move-32px.png"
            alt=""
            class="icon32 iconButton"
            :class="{ disabled: isInCooldown }"
        />
      </div>
    </div>

    <!-- Barre de cooldown -->
    <transition name="cooldown-transition">
      <div v-if="hasCooldown" class="cooldown-bar">
        {{ cooldownRemaining }}
        <div class="cooldown-progress" :style="{ width: cooldownPercent + '%' }"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import type { Character } from '@/stores/character'
import { computed, onUnmounted, ref } from 'vue'

const props = defineProps<{
  character: Character
}>()

const now = ref(Date.now())

const cooldownEnd = computed(() =>
    props.character.cooldownExpiration ? new Date(props.character.cooldownExpiration).getTime() : 0
)

const isInCooldown = computed(() => cooldownEnd.value > now.value)
const hasCooldown = computed(() => !!props.character.cooldown && !!props.character.cooldownExpiration)

const cooldownPercent = computed(() => {
  if (!hasCooldown.value) return 0
  const duration = props.character.cooldown * 1000
  const start = cooldownEnd.value - duration
  const elapsed = now.value - start
  return Math.max(0, Math.min(100, (1 - elapsed / duration) * 100))
})

const cooldownRemaining = computed(() => {
  const diff = cooldownEnd.value - now.value
  if (diff <= 0) return 'Disponible'
  const seconds = Math.floor(diff / 1000)
  return seconds >= 60
      ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
      : `${seconds}s`
})

const hpPercent = computed(() =>
    Math.min(100, (props.character.currentHp / props.character.maxHp) * 100)
)

const xpPercent = computed(() =>
    Math.min(100, (props.character.xp / props.character.xpToNextLevel) * 100)
)

const interval = setInterval(() => {
  now.value = Date.now()
}, 100)

onUnmounted(() => {
  clearInterval(interval)
})

const onMove = () => {
  if (isInCooldown.value) return
  console.log('Move', props.character.name)
}

const onRest = () => {
  if (isInCooldown.value) return
  console.log('Rest', props.character.name)
}

const onBattle = () => {
  if (isInCooldown.value) return
  console.log('Fight', props.character.name)
}
</script>

<style scoped>
.character-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  background-color: gray;
  color: black;
  padding: 1.5rem 1.5rem 2.5rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  position: relative;
  transition: transform 0.3s ease;
}

.character-card:hover {
  transform: scale(1.01);
}

.left-column,
.center-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.center-column {
  width: 80%;
}

.right-column {
  text-align: center;
}

.name-level {
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.name {
  margin-right: 0.5rem;
}

.bar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.bar {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
  margin-left: 1rem;
}

.bar-track {
  position: relative;
  background-color: #444;
  height: 22px;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.bar-fill.hp {
  background-color: #e53935;
}

.bar-fill.xp {
  background-color: #9ea8f6;
}

.bar-text {
  position: absolute;
  width: 100%;
  text-align: center;
  color: #fff;
  font-weight: bold;
  line-height: 22px;
}

.action-box {
  display: flex;
  gap: 0.4rem;
  margin-top: 1rem;
  background-color: darkgray;
  padding: 0.5rem;
  border-radius: 6px;
}

.iconButton.disabled {
  filter: grayscale(1) brightness(0.6);
  cursor: not-allowed;
  pointer-events: none; /* ← empêche tout clic même si JS n'a pas bloqué */
}

.cooldown-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #444;
  color: white;
  text-align: center;
  font-weight: bold;
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.cooldown-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: #e5c635;
  transition: width 0.5s ease;
}

.cooldown-transition-enter-active,
.cooldown-transition-leave-active {
  transition: opacity 0.3s ease;
}
.cooldown-transition-enter-from,
.cooldown-transition-leave-to {
  opacity: 0;
}
</style>
