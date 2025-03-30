import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimesContainer from '@/components/TimesContainer.vue'

describe('TimesContainer.vue', () => {
  const mockTimes = ['10:00', '10:15', '10:30', '10:45']

  it('renders properly with times', () => {
    const wrapper = mount(TimesContainer, {
      props: {
        times: mockTimes,
        loading: false,
        error: null
      }
    })

    expect(wrapper.find('.stops-container').exists()).toBe(true)
    expect(wrapper.find('.title').text()).toBe('Time')
    const listItems = wrapper.findAll('.list-item')
    expect(listItems).toHaveLength(mockTimes.length)
    listItems.forEach((item, index) => {
      expect(item.text()).toBe(mockTimes[index])
    })
  })

  it('shows loading state', () => {
    const wrapper = mount(TimesContainer, {
      props: {
        times: [],
        loading: true,
        error: null
      }
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toBe('Loading...')
  })

  it('shows error state', () => {
    const errorMessage = 'Failed to load times'
    const wrapper = mount(TimesContainer, {
      props: {
        times: [],
        loading: false,
        error: errorMessage
      }
    })

    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.find('.error').text()).toBe(errorMessage)
  })

  it('displays times in the correct format', () => {
    const wrapper = mount(TimesContainer, {
      props: {
        times: mockTimes,
        loading: false,
        error: null
      }
    })

    const listItems = wrapper.findAll('.list-item')
    listItems.forEach((item, index) => {
      expect(item.text().trim()).toMatch(/^\d{2}:\d{2}$/)
      expect(item.text().trim()).toBe(mockTimes[index])
    })
  })
}) 