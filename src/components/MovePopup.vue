<template>
  <div class="overlay">
    <div class="popup">
      <h2>Déplacement</h2>

      <form @submit.prevent="submit">
        <label for="x">Coordonnée X :</label>
        <input id="x" type="number" v-model.number="form.x" required />

        <label for="y">Coordonnée Y :</label>
        <input id="y" type="number" v-model.number="form.y" required />

        <div class="buttons">
          <button type="submit">Valider</button>
          <button type="button" @click="$emit('cancel')">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  x: 0,
  y: 0
})

const emit = defineEmits<{
  (e: 'validate', coords: { x: number, y: number }): void
  (e: 'cancel'): void
}>()

const submit = () => {
  emit('validate', { x: form.value.x, y: form.value.y })
}

</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  color: black;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup {
  background-color: white;
  padding: 0.7rem;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  color: black;
}

.buttons {
  display: flex;
  justify-content: space-between;
}
</style>
