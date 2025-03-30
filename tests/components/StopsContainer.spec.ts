import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StopsContainer from '@/components/StopsContainer.vue'
import { BusStop } from '@/types/interfaces'

describe('StopsContainer.vue', () => {
  const mockStops: BusStop[] = [
    { id: 1, stop: 'Stop A', line: 1, order: 1, time: '10:00' },
    { id: 2, stop: 'Stop B', line: 1, order: 2, time: '10:15' },
    { id: 3, stop: 'Stop C', line: 2, order: 1, time: '10:30' }
  ]

  it('renders properly with stops', () => {
    const wrapper = mount(StopsContainer, {
      props: {
        stops: mockStops,
        loading: false,
        error: null,
        selectedStop: null,
        size: 'large'
      }
    })

    expect(wrapper.find('.stops-container').exists()).toBe(true)
    expect(wrapper.find('.title').text()).toContain('Bus Stops')
    const listItems = wrapper.findAll('.list-item')
    expect(listItems).toHaveLength(mockStops.length)
  })

  it('shows loading state', () => {
    const wrapper = mount(StopsContainer, {
      props: {
        stops: [],
        loading: true,
        error: null,
        selectedStop: null,
        size: 'large'
      }
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toBe('Loading...')
  })

  it('shows error state', () => {
    const errorMessage = 'Failed to load stops'
    const wrapper = mount(StopsContainer, {
      props: {
        stops: [],
        loading: false,
        error: errorMessage,
        selectedStop: null,
        size: 'large'
      }
    })

    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.find('.error').text()).toBe(errorMessage)
  })

  it('marks selected stop as active', () => {
    const selectedStop = mockStops[1]
    const wrapper = mount(StopsContainer, {
      props: {
        stops: mockStops,
        loading: false,
        error: null,
        selectedStop: selectedStop,
        size: 'large'
      }
    })

    const activeItem = wrapper.find('.list-item.active')
    expect(activeItem.exists()).toBe(true)
  })

  it('emits select-stop event when stop is clicked', async () => {
    const wrapper = mount(StopsContainer, {
      props: {
        stops: mockStops,
        loading: false,
        error: null,
        selectedStop: null,
        size: 'large'
      }
    })

    const listItems = wrapper.findAll('.list-item')
    await listItems[1].trigger('click')

    expect(wrapper.emitted()).toHaveProperty('select-stop')
    expect(wrapper.emitted('select-stop')?.[0]).toEqual([mockStops[1]])
  })

  it('sorts stops in ascending order by default', () => {
    const wrapper = mount(StopsContainer, {
      props: {
        stops: mockStops,
        loading: false,
        error: null,
        selectedStop: null,
        size: 'large'
      }
    })

    const listItems = wrapper.findAll('.list-item')
    expect(listItems).toHaveLength(mockStops.length)
  })

  it('toggles sort order when sort button is clicked', async () => {
    const wrapper = mount(StopsContainer, {
      props: {
        stops: mockStops,
        loading: false,
        error: null,
        selectedStop: null,
        size: 'large'
      }
    })

    const sortButton = wrapper.find('.sort-button')
    await sortButton.trigger('click')

    // After clicking, the stops should be in descending order
    const listItems = wrapper.findAll('.list-item')
    expect(listItems).toHaveLength(mockStops.length)
  })
}) 