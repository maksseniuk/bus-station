import { createStore } from 'vuex'
import { BusStop, State } from '../types/interfaces'
import { StoreType, MutationType, ActionType, ActionContextType } from '../types/store'
import { busService } from '../services/busService'

export default createStore<State>({
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
  } as MutationType,

  actions: {
    async fetchAllStops({ commit }: ActionContextType): Promise<void> {
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

    async fetchBusStops({ commit }: ActionContextType, lineId: number): Promise<void> {
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

    async fetchTimes({ commit }: ActionContextType, { lineId, stopId }: { lineId: number, stopId: number }): Promise<void> {
      try {
        commit('clearError')
        commit('setLoading', true)
        const times = await busService.getTimesByLineAndStop(lineId, stopId)
        commit('setTimes', times)
      } catch (error) {
        commit('setError', error instanceof Error ? error.message : 'Failed to fetch times')
      } finally {
        commit('setLoading', false)
      }
    }
  } as ActionType,

  modules: {}
} as StoreType)
