<script setup>
import { COLORS } from '@/assets/colors'
import { ref } from 'vue'
import { movement } from '@/request/test.js'
import Navbar from "@/components/Navbar.vue";

// État de chargement (utile pour bloquer le bouton pendant l'attente)
const loading = ref(false)

const handleClick = async () => {
  loading.value = true
  try {
    await movement()
    console.log('Terminé !')
  } catch (error) {
    console.error('Erreur :', error)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <navbar />

    <router-view />

</template>

<style scoped>

</style>
