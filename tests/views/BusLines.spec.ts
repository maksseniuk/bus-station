import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BusLines from '@/views/BusLines.vue'
import { createStore } from 'vuex'
import { BusStop } from '@/types/interfaces'

describe('BusLines.vue', () => {
  const mockBusLines = [1, 2, 3]
  const mockStops: BusStop[] = [
    { id: 1, stop: 'Stop A', line: 1, order: 1, time: '10:00' },
    { id: 2, stop: 'Stop B', line: 1, order: 2, time: '10:15' },
    { id: 3, stop: 'Stop C', line: 2, order: 1, time: '10:30' }
  ]
  const mockTimes = {
    'Stop A1': ['10:00', '10:30'],
    'Stop B1': ['10:15', '10:45'],
    'Stop C2': ['10:30', '11:00']
  }

  const createMockStore = (state = {}) => {
    return createStore({
      state: {
        busLines: mockBusLines,
        uniqueBusStops: mockStops,
        loading: false,
        error: null,
        stopsSortOrder: 'asc',
        times: mockTimes,
        ...state
      },
      getters: {
        getBusLines: (state) => state.busLines,
        getUniqueBusStops: (state) => state.uniqueBusStops,
        isLoading: (state) => state.loading,
        getError: (state) => state.error,
        getTimes: (state) => state.times
      },
      mutations: {
        toggleStopsSortOrder: (state) => {
          state.stopsSortOrder = state.stopsSortOrder === 'asc' ? 'desc' : 'asc'
        }
      },
      actions: {
        fetchAllStops: async () => {}
      }
    })
  }

  it('renders properly with initial state', () => {
    const store = createMockStore()
    const wrapper = mount(BusLines, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.find('.bus-lines').exists()).toBe(true)
    expect(wrapper.find('.placeholder-section').exists()).toBe(true)
    expect(wrapper.find('.placeholder-content').text()).toBe('Please select the bus line first')
  })

  it('shows loading state', () => {
    const store = createMockStore({ loading: true })
    const wrapper = mount(BusLines, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toBe('Loading...')
  })

  it('shows error state', () => {
    const errorMessage = 'Failed to load data'
    const store = createMockStore({ error: errorMessage })
    const wrapper = mount(BusLines, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.find('.error').text()).toBe(errorMessage)
  })

  it('displays bus lines grid', () => {
    const store = createMockStore()
    const wrapper = mount(BusLines, {
      global: {
        plugins: [store]
      }
    })

    const busLineGrid = wrapper.findComponent({ name: 'BusLineGrid' })
    expect(busLineGrid.exists()).toBe(true)
    expect(busLineGrid.props('busLines')).toEqual(mockBusLines)
  })

  it('filters stops when bus line is selected', async () => {
    const store = createMockStore()
    const wrapper = mount(BusLines, {
      global: {
        plugins: [store]
      }
    })

    const busLineGrid = wrapper.findComponent({ name: 'BusLineGrid' })
    await busLineGrid.vm.$emit('select-line', 1)

    const stopsContainer = wrapper.findComponent({ name: 'StopsContainer' })
    expect(stopsContainer.props('stops')).toEqual(mockStops.filter(stop => stop.line === 1))
  })

  it('shows times when stop is selected', async () => {
    const store = createMockStore()
    const wrapper = mount(BusLines, {
      global: {
        plugins: [store]
      }
    })

    const busLineGrid = wrapper.findComponent({ name: 'BusLineGrid' })
    await busLineGrid.vm.$emit('select-line', 1)

    const stopsContainer = wrapper.findComponent({ name: 'StopsContainer' })
    await stopsContainer.vm.$emit('select-stop', mockStops[0])
    
    const timesContainer = wrapper.findComponent({ name: 'TimesContainer' })
    expect(timesContainer.props('times')).toEqual(mockTimes['Stop A1'])
  })

  it('toggles stops sort order', async () => {
    const store = createMockStore()
    const wrapper = mount(BusLines, {
      global: {
        plugins: [store]
      }
    })

    // First select a line to show the StopsContainer
    const busLineGrid = wrapper.findComponent({ name: 'BusLineGrid' })
    await busLineGrid.vm.$emit('select-line', 1)

    const stopsContainer = wrapper.findComponent({ name: 'StopsContainer' })
    await stopsContainer.vm.$emit('toggle-sort')
    expect(store.state.stopsSortOrder).toBe('desc')
  })
}) 