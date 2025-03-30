import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BusStops from '@/views/BusStops.vue'
import { createStore } from 'vuex'
import { BusStop } from '@/types/interfaces'

describe('BusStops.vue', () => {
  const mockStops: BusStop[] = [
    { id: 1, stop: 'Stop A', line: 1, order: 1, time: '10:00' },
    { id: 2, stop: 'Stop B', line: 1, order: 2, time: '10:15' },
    { id: 3, stop: 'Stop C', line: 2, order: 1, time: '10:30' }
  ]

  const createMockStore = (state = {}) => {
    return createStore({
      state: {
        busStops: mockStops,
        loading: false,
        error: null,
        ...state
      },
      getters: {
        getBusStops: (state) => state.busStops,
        isLoading: (state) => state.loading,
        getError: (state) => state.error
      },
      actions: {
        fetchAllStops: async () => {}
      }
    })
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mountComponent = (store: any) => {
    return mount(BusStops, {
      global: {
        plugins: [store],
        stubs: {
          BaseInput: {
            template: '<input class="search-input" v-model="value" @input="$emit(\'input\', $event)" />',
            props: ['modelValue'],
            computed: {
              value: {
                get() {
                  return this.modelValue
                },
                set(value: string) {
                  this.$emit('update:modelValue', value)
                }
              }
            }
          }
        }
      }
    })
  }

  it('renders properly with initial state', () => {
    const store = createMockStore()
    const wrapper = mountComponent(store)

    expect(wrapper.find('.stops').exists()).toBe(true)
    expect(wrapper.find('.search-container').exists()).toBe(true)
    expect(wrapper.find('.search-input').exists()).toBe(true)
  })

  it('shows loading state', () => {
    const store = createMockStore({ loading: true })
    const wrapper = mountComponent(store)

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toBe('Loading...')
  })

  it('shows error state', () => {
    const errorMessage = 'Failed to load stops'
    const store = createMockStore({ error: errorMessage })
    const wrapper = mountComponent(store)

    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.find('.error').text()).toBe(errorMessage)
  })

  it('filters stops by search query', async () => {
    const store = createMockStore()
    const wrapper = mountComponent(store)

    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('Stop A')
    await searchInput.trigger('input')

    // Fast-forward debounce timer
    await vi.advanceTimersByTime(300)

    const stopsContainer = wrapper.findComponent({ name: 'StopsContainer' })
    const filteredStops = stopsContainer.props('stops')
    expect(filteredStops).toHaveLength(1)
    expect(filteredStops[0].stop).toBe('Stop A')
  })

  it('filters stops by line number', async () => {
    const store = createMockStore()
    const wrapper = mountComponent(store)

    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('1')
    await searchInput.trigger('input')

    // Fast-forward debounce timer
    await vi.advanceTimersByTime(300)

    const stopsContainer = wrapper.findComponent({ name: 'StopsContainer' })
    expect(stopsContainer.props('stops')).toEqual([mockStops[0], mockStops[1]])
  })

  it('shows all stops when search query is empty', async () => {
    const store = createMockStore()
    const wrapper = mountComponent(store)

    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('')
    await searchInput.trigger('input')

    // Fast-forward debounce timer
    await vi.advanceTimersByTime(300)

    const stopsContainer = wrapper.findComponent({ name: 'StopsContainer' })
    expect(stopsContainer.props('stops')).toEqual(mockStops)
  })
}) 