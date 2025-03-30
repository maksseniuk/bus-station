<template>
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="{ 'rotate-180': sortOrder === 'desc' }"
  >
    <path
      d="M10.6667 8.66671L8 11.3334M8 11.3334L5.33334 8.66671M8 11.3334L8 4.66671M6.66667 14.6667H9.33333C11.2002 14.6667 12.1336 14.6667 12.8466 14.3034C13.4738 13.9838 13.9838 13.4739 14.3034 12.8467C14.6667 12.1336 14.6667 11.2002 14.6667 9.33338V6.66671C14.6667 4.79987 14.6667 3.86644 14.3034 3.15341C13.9838 2.5262 13.4738 2.01626 12.8466 1.69669C12.1336 1.33337 11.2002 1.33337 9.33334 1.33337H6.66667C4.79983 1.33337 3.86641 1.33337 3.15337 1.69669C2.52616 2.01626 2.01623 2.5262 1.69665 3.15341C1.33334 3.86644 1.33334 4.79986 1.33334 6.6667V9.33337C1.33334 11.2002 1.33334 12.1336 1.69665 12.8467C2.01623 13.4739 2.52616 13.9838 3.15337 14.3034C3.86641 14.6667 4.79983 14.6667 6.66667 14.6667Z"
      stroke="#63666E"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
defineProps<{
  sortOrder: 'asc' | 'desc'
}>()
</script>

<script lang="ts">
export default {
  name: 'SortIcon',
}
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease-in-out;
}
</style>
