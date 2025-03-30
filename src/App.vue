<template>
  <div class="app">
    <main class="main">
      <AppHeader />
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/Ui/AppHeader.vue'
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
@import '@/styles/_variables.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
}

.app {
  min-height: 100vh;
  overflow-x: hidden;
  background-color: color('background', 'primary-light');
}

.main {
  padding: 2rem;
  margin: 0 auto;
  max-width: 1200px;
  min-height: calc(100vh - 4rem);
  overflow-y: auto;
}
</style>
