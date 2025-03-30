<template>
  <div class="stops-container">
    <h2 class="title">Time</h2>

    <div class="list-container">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="list">
        <div v-for="time in times" :key="time" class="list-item">
          {{ time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
interface Props {
  times: Array<string>
  loading: boolean
  error: string | null
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.stops-container {
  display: flex;
  flex-direction: column;
  background-color: color('background', 'primary');

  .title {
    color: color('text', 'black');
    display: flex;
    align-items: center;
    gap: spacing('sm');
    padding: spacing('xxl');
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
  }

  .sort-button {
    background: none;
    border: none;
    font-size: font-size('sm');
    padding: spacing('xs');
    color: color('text', 'secondary');
  }

  .list-container {
    border-top: 1px solid color('border', 'light');
    overflow: hidden;
  }

  .list {
    max-height: 290px;
    overflow-y: auto;
  }

  .list-item {
    padding: spacing('xxl');
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    border-bottom: 1px solid color('border', 'lighter');
    transition: $transition;
  }

  .list-item:last-child {
    border-bottom: none;
  }

  .loading {
    padding: spacing('xl');
    text-align: center;
    color: color('text', 'secondary');
  }

  .error {
    padding: spacing('xl');
    text-align: center;
    color: color('error');
  }
}
</style>
