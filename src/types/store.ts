import { State, BusStop, BusLine } from './interfaces'
import { ActionContext, CommitOptions } from 'vuex'

// Mutation Types
export type MutationType = {
  setBusLines: (state: State, lines: BusLine[]) => void
  setBusStops: (state: State, stops: BusStop[]) => void
  setTimes: (state: State, times: Record<string, string[]>) => void
  setLoading: (state: State, loading: boolean) => void
  setError: (state: State, error: string | null) => void
  setUniqueBusStops: (state: State, stops: BusStop[]) => void
  clearError: (state: State) => void
}

// Action Context Type
export type ActionContextType = ActionContext<State, State>

// Commit Type
export type CommitType = {
  <K extends keyof MutationType>(
    key: K,
    payload: Parameters<MutationType[K]>[1],
    options?: CommitOptions
  ): void
}

// Action Types
export type ActionType = {
  fetchAllStops: (context: ActionContextType) => Promise<void>
  fetchBusStops: (context: ActionContextType, lineId: number) => Promise<void>
  fetchTimes: (context: ActionContextType, params: { lineId: number; stopId: number }) => Promise<void>
}

// Store Type
export type StoreType = {
  state: State
  getters: {
    getBusLines: (state: State) => BusLine[]
    getBusStops: (state: State) => BusStop[]
    getUniqueBusStops: (state: State) => BusStop[]
    getTimes: (state: State) => Record<string, string[]>
    isLoading: (state: State) => boolean
    getError: (state: State) => string | null
  }
  mutations: MutationType
  actions: ActionType
} 