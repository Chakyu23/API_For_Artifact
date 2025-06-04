<template>
  <button
      :class="['app-button', variant]"
      :disabled="variant === 'disabled' || disabled"
      @click="onClick"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { COLORS } from '@/assets/colors'
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  variant?: 'primary' | 'success' | 'danger' | 'disabled'
  disabled?: boolean
}>()

const emits = defineEmits<{
  (e: 'click'): void
}>()

const onClick = () => {
  if (props.variant !== 'disabled' && !props.disabled) emits('click')
}
</script>

<style scoped>
.app-button {
  padding: 0.6rem 2rem;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: white;
  width: min-content;
}

/* Primary */
.app-button.primary {
  background-color: v-bind('COLORS.Primary');
}

.app-button.primary:hover {
  background-color: v-bind('COLORS.Hover');
}

/* Success */
.app-button.success {
  background-color: v-bind('COLORS.Primary');;
}

.app-button.success:hover {
  background-color: v-bind('COLORS.Success');
}

/* Danger */
.app-button.danger {
  background-color: v-bind('COLORS.Primary');;
}

.app-button.danger:hover {
  background-color: v-bind('COLORS.Danger');
}

/* Disabled */
.app-button.disabled {
  background-color: v-bind('COLORS.Secondary');;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
