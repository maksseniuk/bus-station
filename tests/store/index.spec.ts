import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore, Store } from 'vuex'
import { busService } from '@/services/busService'
import { State, BusStop } from '@/types/interfaces'

// Mock the busService
vi.mock('@/services/busService', () => ({
  busService: {
    getAllStops: vi.fn(),
    getStopsByLine: vi.fn(),
    getTimesByLineAndStop: vi.fn(),
  },
}))

describe('Vuex Store', () => {
  let storeInstance: Store<State>

  beforeEach(() => {
    // Create a new store instance with the store configuration
    storeInstance = createStore<State>({
      state: {
        busLines: [],
        busStops: [],
        uniqueBusStops: [],
        times: {},
        loading: false,
        error: null,
      },
      getters: {
        getBusLines: (state: State): number[] => state.busLines,
        getBusStops: (state: State): BusStop[] => state.busStops,
        getUniqueBusStops: (state: State): BusStop[] => state.uniqueBusStops,
        getTimes: (state: State): Record<string, string[]> => state.times,
        isLoading: (state: State): boolean => state.loading,
        getError: (state: State): string | null => state.error,
      },
      mutations: {
        setBusLines(state: State, lines: number[]): void {
          state.busLines = lines.sort()
        },
        setBusStops(state: State, stops: BusStop[]): void {
          state.busStops = stops.sort((a, b) => a.order - b.order)
        },
        setTimes(state: State, times: Record<string, string[]>): void {
          state.times = times
        },
        setLoading(state: State, loading: boolean): void {
          state.loading = loading
        },
        setError(state: State, error: string | null): void {
          state.error = error
        },
        setUniqueBusStops(state: State, stops: BusStop[]): void {
          state.uniqueBusStops = stops
        },
        clearError(state: State): void {
          state.error = null
        }
      },
      actions: {
        async fetchAllStops({ commit }): Promise<void> {
          try {
            commit('clearError')
            commit('setLoading', true)
            
            const stops = await busService.getAllStops()
            
            const uniqueLines = [...new Set(stops.map((stop: BusStop) => stop.line))]
            const uniqueBusStops = Array.from(
              new Map(stops.map((stop: BusStop) => [stop.stop, stop])).values()
            )
            
            const timesByStopAndLine: Record<string, string[]> = {}
            
            stops.forEach((stop: BusStop) => {
              const key = `${stop.stop}${stop.line}`
              if (!timesByStopAndLine[key]) {
                timesByStopAndLine[key] = []
              }
              timesByStopAndLine[key].push(stop.time)
            })
            
            Object.keys(timesByStopAndLine).forEach(key => {
              timesByStopAndLine[key].sort((a: string, b: string) => {
                const [aHours, aMinutes] = a.split(':').map(Number)
                const [bHours, bMinutes] = b.split(':').map(Number)
                return aHours === bHours ? aMinutes - bMinutes : aHours - bHours
              })
            })

            commit('setTimes', timesByStopAndLine)
            commit('setBusLines', uniqueLines)
            commit('setBusStops', stops)
            commit('setUniqueBusStops', uniqueBusStops)
          } catch (error) {
            commit('setError', error instanceof Error ? error.message : 'Failed to fetch stops')
          } finally {
            commit('setLoading', false)
          }
        },

        async fetchBusStops({ commit }, lineId: number): Promise<void> {
          try {
            commit('clearError')
            commit('setLoading', true)
            const lineStops = await busService.getStopsByLine(lineId)
            commit('setBusStops', lineStops)
          } catch (error) {
            commit('setError', error instanceof Error ? error.message : 'Failed to fetch bus stops')
          } finally {
            commit('setLoading', false)
          }
        },

        async fetchTimes({ commit }, { lineId, stopId }: { lineId: number, stopId: number }): Promise<void> {
          try {
            commit('clearError')
            commit('setLoading', true)
            const stops = await busService.getTimesByLineAndStop(lineId, stopId)
            
            const timesByStopAndLine: Record<string, string[]> = {}
            stops.forEach((stop: BusStop) => {
              const key = `${stop.stop}${stop.line}`
              if (!timesByStopAndLine[key]) {
                timesByStopAndLine[key] = []
              }
              timesByStopAndLine[key].push(stop.time)
            })
            
            Object.keys(timesByStopAndLine).forEach(key => {
              timesByStopAndLine[key].sort((a: string, b: string) => {
                const [aHours, aMinutes] = a.split(':').map(Number)
                const [bHours, bMinutes] = b.split(':').map(Number)
                return aHours === bHours ? aMinutes - bMinutes : aHours - bHours
              })
            })

            commit('setTimes', timesByStopAndLine)
          } catch (error) {
            commit('setError', error instanceof Error ? error.message : 'Failed to fetch times')
          } finally {
            commit('setLoading', false)
          }
        }
      },
      modules: {}
    })
    vi.clearAllMocks()
  })

  describe('State', () => {
    it('should initialize with default state', () => {
      const state = storeInstance.state
      expect(state.busLines).toEqual([])
      expect(state.busStops).toEqual([])
      expect(state.uniqueBusStops).toEqual([])
      expect(state.times).toEqual({})
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })
  })

  describe('Getters', () => {
    it('should return bus lines', () => {
      const state = storeInstance.state
      state.busLines = [1, 2, 3]
      expect(storeInstance.getters.getBusLines).toEqual([1, 2, 3])
    })

    it('should return bus stops', () => {
      const stops: BusStop[] = [{ id: 1, stop: 'Stop 1', line: 1, order: 1, time: '10:00' }]
      const state = storeInstance.state
      state.busStops = stops
      expect(storeInstance.getters.getBusStops).toEqual(stops)
    })

    it('should return unique bus stops', () => {
      const stops: BusStop[] = [{ id: 1, stop: 'Stop 1', line: 1, order: 1, time: '10:00' }]
      const state = storeInstance.state
      state.uniqueBusStops = stops
      expect(storeInstance.getters.getUniqueBusStops).toEqual(stops)
    })

    it('should return times', () => {
      const times: Record<string, string[]> = { 'Stop 11': ['10:00', '11:00'] }
      const state = storeInstance.state
      state.times = times
      expect(storeInstance.getters.getTimes).toEqual(times)
    })

    it('should return loading state', () => {
      const state = storeInstance.state
      state.loading = true
      expect(storeInstance.getters.isLoading).toBe(true)
    })

    it('should return error', () => {
      const state = storeInstance.state
      state.error = 'Test error'
      expect(storeInstance.getters.getError).toBe('Test error')
    })
  })

  describe('Mutations', () => {
    it('should set bus lines', () => {
      const lines = [3, 1, 2]
      storeInstance.commit('setBusLines', lines)
      const state = storeInstance.state
      expect(state.busLines).toEqual([1, 2, 3])
    })

    it('should set bus stops', () => {
      const stops: BusStop[] = [
        { id: 1, stop: 'Stop 1', line: 1, order: 2, time: '10:00' },
        { id: 2, stop: 'Stop 2', line: 1, order: 1, time: '11:00' },
      ]
      storeInstance.commit('setBusStops', stops)
      const state = storeInstance.state
      expect(state.busStops).toEqual([
        { id: 2, stop: 'Stop 2', line: 1, order: 1, time: '11:00' },
        { id: 1, stop: 'Stop 1', line: 1, order: 2, time: '10:00' },
      ])
    })

    it('should set times', () => {
      const times: Record<string, string[]> = { 'Stop 11': ['10:00', '11:00'] }
      storeInstance.commit('setTimes', times)
      const state = storeInstance.state
      expect(state.times).toEqual(times)
    })

    it('should set loading state', () => {
      storeInstance.commit('setLoading', true)
      const state = storeInstance.state
      expect(state.loading).toBe(true)
    })

    it('should set error', () => {
      storeInstance.commit('setError', 'Test error')
      const state = storeInstance.state
      expect(state.error).toBe('Test error')
    })

    it('should clear error', () => {
      const state = storeInstance.state
      state.error = 'Test error'
      storeInstance.commit('clearError')
      expect(state.error).toBe(null)
    })
  })

  describe('Actions', () => {
    it('should fetch all stops successfully', async () => {
      const mockStops: BusStop[] = [
        { id: 1, stop: 'Stop 1', line: 1, order: 1, time: '10:00' },
        { id: 2, stop: 'Stop 2', line: 1, order: 2, time: '11:00' },
      ]
      vi.mocked(busService.getAllStops).mockResolvedValue(mockStops)

      await storeInstance.dispatch('fetchAllStops')

      const state = storeInstance.state
      expect(state.busLines).toEqual([1])
      expect(state.busStops).toEqual(mockStops)
      expect(state.uniqueBusStops).toHaveLength(2)
      expect(state.times).toHaveProperty('Stop 11')
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('should handle error when fetching all stops', async () => {
      vi.mocked(busService.getAllStops).mockRejectedValue(new Error('API Error'))

      await storeInstance.dispatch('fetchAllStops')

      const state = storeInstance.state
      expect(state.error).toBe('API Error')
      expect(state.loading).toBe(false)
    })

    it('should fetch bus stops by line successfully', async () => {
      const mockStops: BusStop[] = [
        { id: 1, stop: 'Stop 1', line: 1, order: 1, time: '10:00' },
      ]
      vi.mocked(busService.getStopsByLine).mockResolvedValue(mockStops)

      await storeInstance.dispatch('fetchBusStops', 1)

      const state = storeInstance.state
      expect(state.busStops).toEqual(mockStops)
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('should fetch times by line and stop successfully', async () => {
      const mockStops: BusStop[] = [
        { id: 1, stop: 'Stop 1', line: 1, order: 1, time: '10:00' },
        { id: 1, stop: 'Stop 1', line: 1, order: 2, time: '11:00' },
      ]
      vi.mocked(busService.getTimesByLineAndStop).mockResolvedValue(mockStops)

      await storeInstance.dispatch('fetchTimes', { lineId: 1, stopId: 1 })

      const state = storeInstance.state
      expect(state.times).toEqual({
        'Stop 11': ['10:00', '11:00']
      })
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })
  })
}) 