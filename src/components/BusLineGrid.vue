<template>
  <div class="select-line">
    <h5 class="select-line-title">Select Bus Line</h5>
    <div class="bus-line-grid">
      <button
        v-for="line in busLines"
        :key="line"
        class="bus-line-button"
        :class="{ active: selectedLine === line }"
        @click="$emit('select-line', line)"
      >
        {{ line }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  busLines: (string | number)[]
  selectedLine: string | number | null
}>()

defineEmits<{
  (e: 'select-line', line: string | number): void
}>()
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.select-line {
  margin-bottom: spacing('md');
  background: color('background', 'white');
  border-radius: border-radius('sm');
  padding: spacing('lg');

  .select-line-title {
    text-align: start;
    padding-bottom: spacing('xxl');
    font-size: 14px;
    font-weight: 600;
    line-height: 24px;
  }

  .bus-line-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: spacing('md');
  }

  .bus-line-button {
    padding: 8px 16px;
    border: none;
    background: color('primary');
    color: color('text', 'white');
    border-radius: border-radius('sm');
    cursor: pointer;
    font-size: 14px;
    line-height: 16px;
    transition: $transition;
    box-shadow: 0 1px 2px color('shadow', 'light');

    &:hover {
      background: color('primary-hover');
      transform: translateY(-1px);
      box-shadow: 0 2px 4px color('shadow', 'medium');
    }

    &.active {
      background: color('active-dark');
      box-shadow: 0 2px 4px color('shadow', 'medium');
    }
  }
}
</style>
