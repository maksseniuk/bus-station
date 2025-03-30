import { describe, it, expect } from 'vitest'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

describe('Router Configuration', () => {
  it('should have correct routes', () => {
    const routes = router.getRoutes()
    expect(routes).toHaveLength(2)
  })

  it('should have BusLines route configured correctly', () => {
    const route = router.getRoutes().find(route => route.name === 'BusLines')
    expect(route).toBeDefined()
    expect(route?.path).toBe('/')
    expect(route?.name).toBe('BusLines')
    expect(route?.components?.default).toBeDefined()
  })

  it('should have BusStops route configured correctly', () => {
    const route = router.getRoutes().find(route => route.name === 'BusStops')
    expect(route).toBeDefined()
    expect(route?.path).toBe('/stops')
    expect(route?.name).toBe('BusStops')
    expect(route?.components?.default).toBeDefined()
  })

  it('should use lazy loading for routes', () => {
    const routes = router.getRoutes()
    routes.forEach(route => {
      if (route.components?.default) {
        const component = route.components.default as any
        // Check if the component is a function (lazy loaded)
        expect(typeof component).toBe('function')
      }
    })
  })
}) 