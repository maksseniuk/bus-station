export interface BusStop {
  id: number
  stop: string
  order: number
  line: number
  time: string
}


export type BusLine = number

export interface State {
  busLines: BusLine[]
  busStops: BusStop[]
  times: Record<string, string[]>
  loading: boolean
  error: string | null
  uniqueBusStops: BusStop[]
} 