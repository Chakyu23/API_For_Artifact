<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal">
      <h2>{{ title }}</h2>
      <form @submit.prevent="submit">
        <div
            v-for="field in fields"
            :key="field.name"
            class="form-field"
        >
          <label :for="field.name">{{ field.label }}</label>
          <input
              v-model="formData[field.name]"
              :type="field.type || 'text'"
              :id="field.name"
              :required="field.required || false"
          />
        </div>
        <div class="actions">
          <button type="button" @click="emit('close')">Annuler</button>
          <button type="submit">Valider</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

export interface Field {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number'
  required?: boolean
}

const props = defineProps<{
  title: string
  fields: Field[]
}>()

const emit = defineEmits<{
  (e: 'submit', data: Record<string, string | number>): void
  (e: 'close'): void
}>()

const formData = reactive<Record<string, string | number>>({})

for (const field of props.fields) {
  formData[field.name] = ''
}

const submit = () => {
  emit('submit', formData)
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
}

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
