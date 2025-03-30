import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '@/components/Ui/AppHeader.vue'
import { createTestRouter } from '../setup'
import { Router } from 'vue-router'

describe('AppHeader.vue', () => {
  let router: Router

  beforeEach(() => {
    router = createTestRouter()
  })

  const routerLinkStub = {
    template: '<a :href="to" class="nav-link"><slot></slot></a>',
    props: ['to']
  }

  it('renders properly', async () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: routerLinkStub
        }
      }
    })
    await router.isReady()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.title').text()).toBe('Timetable')
  })

  it('contains navigation links', async () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: routerLinkStub
        }
      }
    })
    await router.isReady()
    const navLinks = wrapper.findAll('.nav-link')
    expect(navLinks).toHaveLength(2)
    expect(navLinks[0].text().trim()).toBe('Bus Lines')
    expect(navLinks[1].text().trim()).toBe('Stops')
  })

  it('has correct router-link destinations', async () => {
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: routerLinkStub
        }
      }
    })
    await router.isReady()
    const navLinks = wrapper.findAll('.nav-link')
    expect(navLinks[0].attributes('href')).toBe('/')
    expect(navLinks[1].attributes('href')).toBe('/stops')
  })
}) 