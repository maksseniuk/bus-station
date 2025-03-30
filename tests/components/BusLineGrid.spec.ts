import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BusLineGrid from '@/components/BusLineGrid.vue'

describe('BusLineGrid.vue', () => {
  const busLines = ['1', '2', '3', '4']
  
  it('renders properly with bus lines', () => {
    const wrapper = mount(BusLineGrid, {
      props: {
        busLines,
        selectedLine: null
      }
    })
    
    expect(wrapper.find('.select-line').exists()).toBe(true)
    expect(wrapper.find('.select-line-title').text()).toBe('Select Bus Line')
    const buttons = wrapper.findAll('.bus-line-button')
    expect(buttons).toHaveLength(busLines.length)
    buttons.forEach((button, index) => {
      expect(button.text()).toBe(busLines[index])
    })
  })

  it('marks selected line as active', () => {
    const selectedLine = '2'
    const wrapper = mount(BusLineGrid, {
      props: {
        busLines,
        selectedLine
      }
    })

    const activeButton = wrapper.find('.bus-line-button.active')
    expect(activeButton.exists()).toBe(true)
    expect(activeButton.text()).toBe(selectedLine)
  })

  it('emits select-line event when button is clicked', async () => {
    const wrapper = mount(BusLineGrid, {
      props: {
        busLines,
        selectedLine: null
      }
    })

    const buttons = wrapper.findAll('.bus-line-button')
    await buttons[1].trigger('click')

    expect(wrapper.emitted()).toHaveProperty('select-line')
    expect(wrapper.emitted('select-line')?.[0]).toEqual([busLines[1]])
  })
}) 