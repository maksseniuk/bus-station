import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import AppHeader from '@/components/Ui/AppHeader.vue'
import { createTestRouter } from '../setup'
import { Router } from 'vue-router'

describe('App.vue', () => {
  let router: Router

  beforeEach(() => {
    router = createTestRouter()
  })

  it('renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.app').exists()).toBe(true)
    expect(wrapper.find('.main').exists()).toBe(true)
  })

  it('contains AppHeader component', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.findComponent(AppHeader).exists()).toBe(true)
  })

  it('contains router-view', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          RouterView: true
        }
      }
    })
    expect(wrapper.find('router-view-stub').exists()).toBe(true)
  })
}) 