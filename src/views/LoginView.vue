<template>
  <div class="auth-container">
    <div class="auth-card">
      <form @submit.prevent="handleLogin">
        <input
            v-model="tokenInput"
            type="text"
            required
            placeholder="Enter your token..."
        />

        <ButtonStd variant="success" type="submit">
          Login
        </ButtonStd>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { bankGold } from '@/request/Auth'
import ButtonStd from '@/components/ButtonStd.vue'

const router = useRouter()
const user = useUserStore()

const tokenInput = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''

  const gold = await bankGold(tokenInput.value)

  if (typeof gold !== 'number') {
    errorMessage.value = 'Token invalide ou expiré.'
    return
  }

  user.login(tokenInput.value, gold)
  await router.push('/character')
}
</script>

<style scoped>
</style>
