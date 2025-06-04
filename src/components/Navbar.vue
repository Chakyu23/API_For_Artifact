<template>
  <nav class="navbar">
    <!-- Logo -->
    <router-link to="/">
      <img src="@/assets/Logo-White.svg" alt="Logo" class="icon64 light" />
    </router-link>

    <!-- Si utilisateur connecté -->
    <template v-if="user.isAuthenticated">
      <div class="nav-tabs">
        <router-link to="/" class="nav-button">HOME</router-link>
        <router-link to="/character" class="nav-button">CHARACTER</router-link>
        <a :href="URL_CLIENT" target="_blank" rel="noopener noreferrer" class="nav-button">CLIENT</a>
      </div>

      <div class="user-section">
        <span class="gold">{{ user.gold }} 🪙</span>
        <img @click="logout" src="@/assets/LogOut-64px.png" alt="Logo" class="icon48 light"/>
      </div>
    </template>

    <!-- Si non connecté -->
    <template v-else>
      <div class="auth-buttons">
        <router-link to="/login">Connexion</router-link>
      </div>
    </template>
  </nav>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { URL_CLIENT } from '@/constants'
import { COLORS } from '@/assets/colors'

const user = useUserStore()
const router = useRouter()

const logout = () => {
  user.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  height: 80px;
  background-color: v-bind('COLORS.dark');
  color: v-bind('COLORS.light');
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.nav-tabs,
.auth-buttons,
.user-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-tabs a,
.auth-buttons a {
  color: v-bind('COLORS.light');
  text-decoration: none;
  font-weight: 500;
}

.nav-tabs a:hover,
.auth-buttons a:hover {
  color: v-bind('COLORS.light');
}

.gold {
  font-weight: 600;
  text-align: end;
  width: 120px;
}

button {
  background: none;
  border: none;
  color: v-bind('COLORS.light');
  cursor: pointer;
  font-size: 1rem;
  align-items: center;
}

button:hover {
  color: v-bind('COLORS.light');
}


</style>
