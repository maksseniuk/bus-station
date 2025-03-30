<template>
  <div class="stops-container">
    <h2 class="title">
      Bus Stops
      <button class="sort-button" @click="toggleSort">
        <SortIcon :sortOrder="sortOrder" />
      </button>
    </h2>

    <div class="list-container">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else :class="`list-${size} list`">
        <div
          v-for="stop in filteredStops"
          :key="stop.id"
          class="list-item"
          :class="{
            active: selectedStop?.stop === stop.stop,
            'not-clickable': !clickable,
          }"
          @click="clickable && $emit('select-stop', stop)"
        >
          <slot name="stop-line" :stop="stop" :line="stop.line" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, defineEmits } from 'vue'
import SortIcon from '@/components/icons/SortIcon.vue'
import { BusStop } from '@/types/interfaces'
interface Props {
  stops: Array<BusStop>
  loading: boolean
  error: string | null
  selectedStop: BusStop | null
  size: 'small' | 'large'
  clickable: boolean
}

const props = defineProps<Props>()
const sortOrder = ref<'asc' | 'desc'>('asc')

const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const searchQuery = ref('')
const filteredStops = computed(() => {
  let filtered = props.stops
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((stop) => stop.stop.toLowerCase().includes(query))
  }

  return [...filtered].sort((a, b) => {
    const comparison = a.stop.localeCompare(b.stop)
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})
defineEmits(['select-stop'])
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.stops-container {
  display: flex;
  flex-direction: column;
  background-color: color('background', 'primary');

  .title {
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    color: color('text', 'black');
    display: flex;
    align-items: center;
    gap: 6px;
    padding: spacing('xxl');
  }

  .sort-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: font-size('sm');
    padding: spacing('xs');
    color: color('text', 'secondary');

    &:hover {
      color: color('text', 'primary');
    }
  }

  .list-container {
    border-top: 1px solid color('border', 'light');
    overflow: hidden;
  }

  .list {
    overflow-y: auto;
  }

  .list-small {
    max-height: 290px;
  }

  .list-large {
    max-height: 50vh;
  }

  .list-item {
    padding: 24px 20px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    border-bottom: 1px solid color('border', 'lighter');
    cursor: pointer;
    transition: $transition;

    &:hover {
      background-color: color('background', 'hover');
    }

    &.active {
      background-color: color('primary', 'light');
      color: color('primary');
    }

    &.not-clickable {
      cursor: default;
      &:hover {
        background-color: transparent;
      }
    }
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
