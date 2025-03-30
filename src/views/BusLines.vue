<template>
  <div class="bus-lines">
    <BusLineGrid
      :bus-lines="busLines"
      :selected-line="selectedLine"
      @select-line="selectLine"
    />

    <div class="content-sections">
      <div class="content-section">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="!selectedLine" class="placeholder-section custom-border">
          <div class="placeholder-content">Please select the bus line first</div>
        </div>
        <div v-else class="stops-list">
          <div class="stops-list-header">
            <h4>Bus Line: {{ selectedLine }}</h4>
          </div>
          <StopsContainer
            size="small"
            :stops="filteredBusStops"
            :loading="loading"
            :error="error"
            :sort-order="stopsSortOrder"
            :selected-stop="selectedStop"
            :clickable="true"
            @toggle-sort="toggleStopsSort"
            @select-stop="selectedStop = $event"
          >
            <template #stop-line="{ stop, line }">
              <div>
                {{ stop.stop }}
                {{ line }}
              </div>
            </template>
          </StopsContainer>
        </div>
      </div>

      <div class="content-section">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div
          v-else-if="!selectedLine || !selectedStop"
          class="placeholder-section custom-border"
        >
          <div class="placeholder-content">
            {{
              !selectedLine
                ? 'Please select the bus line first'
                : 'Please select the bus stop first'
            }}
          </div>
        </div>
        <div v-else class="times-list">
          <div class="stops-list-header" v-if="selectedStop">
            <h4>Bus Stop: {{ selectedStop.stop }} {{ selectedStop.line }}</h4>
          </div>
          <TimesContainer :times="filteredTimes" :loading="loading" :error="error" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { BusStop } from '@/types/interfaces'
import BusLineGrid from '@/components/BusLineGrid.vue'
import StopsContainer from '@/components/StopsContainer.vue'
import TimesContainer from '@/components/TimesContainer.vue'
import { useStore } from 'vuex'

const store = useStore()

const busLines = computed(() => store.getters.getBusLines)
const uniqueBusStops = computed(() => store.getters.getUniqueBusStops)
const loading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.getError)
const stopsSortOrder = computed(() => store.state.stopsSortOrder)
const times = computed(() => store.getters.getTimes)
const selectedLine = ref(null)
const selectedStop = ref<BusStop | null>(null)

const selectLine = async (line: any) => {
  selectedLine.value = line
  selectedStop.value = null
}

const filteredBusStops = computed(() => {
  return uniqueBusStops.value.filter((stop: BusStop) => stop.line == selectedLine.value)
})

const filteredTimes = computed(() => {
  if (!selectedStop.value) return []
  return times.value[selectedStop.value.stop + selectedStop.value.line] || []
})

const toggleStopsSort = () => {
  store.commit('toggleStopsSortOrder')
}

onMounted(async () => {
  if (!busLines.value.length) {
    await store.dispatch('fetchAllStops')
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

div.custom-border:before {
  content: '';
  position: absolute;
  border: 10px dashed #9a9da4;
  border-radius: border-radius('sm');
  top: -9px;
  bottom: 2px;
  left: -9px;
  right: -9px;
}

div {
  overflow: hidden;
  position: relative;
}

.bus-lines {
  padding: spacing('md') 0;

  .title {
    font-size: font-size('lg');
    font-weight: 600;
    margin-bottom: spacing('lg');
  }

  .tabs {
    display: flex;
    gap: spacing('md');
    margin-bottom: spacing('xl');
    border-bottom: 1px solid color('border', 'light');
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    .tab {
      padding: spacing('sm') spacing('md');
      border: none;
      background: none;
      font-size: font-size('sm');
      color: color('text', 'secondary');
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;

      &.active {
        color: color('primary');
        border-bottom: 2px solid color('primary');
        margin-bottom: -1px;
      }
    }
  }

  .select-line {
    h3 {
      font-size: font-size('sm');
      font-weight: normal;
    }
  }

  .content-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: spacing('xl');
    height: 100%;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: spacing('md');
    }
  }

  .content-section {
    height: 40vh;
    overflow: hidden;

    @media (max-width: 768px) {
      height: 50vh;
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: spacing('md');

    h3 {
      margin: 0;
      font-size: font-size('sm');
      font-weight: 500;
    }
  }

  .sort-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: font-size('sm');
    color: color('text', 'secondary');
    padding: spacing('xs') spacing('sm');

    &:hover {
      color: color('text', 'primary');
    }
  }

  .placeholder-section {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: color('background', 'primary');
    min-height: 444px;

    @media (max-width: 768px) {
      min-height: 300px;
    }
  }

  .placeholder-content {
    color: color('text', 'secondary');
    font-style: italic;
    text-align: center;
    padding: spacing('md');
  }

  .stops-list,
  .times-list {
    height: 100%;
    background-color: color('background', 'primary');
    -webkit-overflow-scrolling: touch;
  }

  .list-item {
    padding: spacing('md') spacing('md');
    cursor: pointer;
    border-bottom: 1px solid color('border', 'light');
    transition: $transition;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: color('background', 'hover');
    }
  }

  .loading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: color('text', 'secondary');
  }

  .error {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: color('error');
    padding: spacing('md');
    text-align: center;
  }

  .stops-list-header {
    padding: 24px 24px 8px 24px;

    @media (max-width: 768px) {
      padding: spacing('lg');
    }

    h4 {
      margin: 0;
      font-size: 14px;
      line-height: 24px;
      font-weight: 600;
      word-break: break-word;
    }
  }
}
</style>
