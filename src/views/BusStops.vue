<template>
  <div class="stops">
    <div class="search-container">
      <BaseInput
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Search..."
        class="search-input"
      />
    </div>

    <StopsContainer
      :stops="filteredStops"
      :loading="loading"
      :error="error"
      :selectedStop="selectedStop"
      :clickable="false"
      size="large"
    >
      <template #stop-line="{ stop, line }">
        <div>{{ stop.stop }} {{ line }}</div>
      </template>
    </StopsContainer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import StopsContainer from '@/components/StopsContainer.vue'
import BaseInput from '@/components/Ui/BaseInput.vue'
import type { BusStop } from '@/types/interfaces'
import { debounce } from '@/utils/debounce'

const store = useStore()
const selectedStop = ref<BusStop | null>(null)
const searchQuery = ref('')
const debouncedQuery = ref('')

const busStops = computed(() => store.getters.getBusStops)
const loading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.getError)

const filteredStops = computed(() => {
  if (!debouncedQuery.value) return busStops.value

  const query = debouncedQuery.value.toLowerCase()
  return busStops.value.filter((stop: BusStop) => {
    const lineNumber = parseInt(query)
    if (!isNaN(lineNumber)) {
      return stop.line === lineNumber
    }
    return stop.stop.toLowerCase().includes(query)
  })
})

const handleSearch = debounce(() => {
  debouncedQuery.value = searchQuery.value
}, 300)

onMounted(async () => {
  if (!busStops.value.length) {
    await store.dispatch('fetchAllStops')
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.stops {
  background: color('background', 'primary');
  border-radius: border-radius('lg');
  box-shadow: 0 2px 4px color('shadow', 'light');
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 16px;

  .search-container {
    width: 100%;
    display: flex;
    justify-content: start;
  }

  .search-input {
    width: 100%;
    max-width: 400px;
    padding: spacing('md') spacing('md');
  }
}

@media screen and (min-width: 768px) {
  .stops {
    .search-input {
      width: 30%;
    }
  }
}

@media screen and (max-width: 480px) {
  .stops {
    padding: spacing('sm');
    border-radius: border-radius('md');

    .search-container {
      margin-top: 8px;
      margin-bottom: spacing('md');
    }

    .search-input {
      padding: spacing('sm') spacing('sm');
    }
  }
}
</style>
