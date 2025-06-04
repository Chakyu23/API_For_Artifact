<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found">
    <h1>404 - Page introuvable</h1>
    <router-link to="/">Retour à l’accueil</router-link>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.not-found {
  padding: 2rem;
  text-align: center;
  color: white;
}
</style>
