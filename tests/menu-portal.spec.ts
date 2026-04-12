import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Treeselect from '../src/components/Treeselect.vue'

vi.unmock('../src/components/MenuPortal.vue')
vi.unmock('../src/components/Menu.vue')
vi.unmock('../src/components/Control.vue')

describe('Menu Portal (appendToBody)', () => {

  it('renders portal target in body when appendToBody=true', async () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [{ id: 'a', label: 'A' }],
        appendToBody: true
      },
      attachTo: document.body
    })

    const control = wrapper.find('.vue-treeselect__control')
    await control.trigger('mousedown')
    await nextTick()
    await nextTick()

    const portalTarget = document.body.querySelector('.vue-treeselect__portal-target')
    expect(portalTarget).not.toBeNull()

    wrapper.unmount()
  })

  it('renders Menu component inside portal target', async () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [{ id: 'a', label: 'A' }],
        appendToBody: true
      },
      attachTo: document.body
    })

    const control = wrapper.find('.vue-treeselect__control')
    await control.trigger('mousedown')
    await nextTick()
    await nextTick()

    const portalTarget = document.body.querySelector('.vue-treeselect__portal-target')
    expect(portalTarget).not.toBeNull()

    const menu = portalTarget?.querySelector('.vue-treeselect__menu')
    expect(menu).not.toBeNull()

    wrapper.unmount()
  })

  it('positions menu near control element', async () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [{ id: 'a', label: 'A' }],
        appendToBody: true
      },
      attachTo: document.body
    })

    const mockRect = {
      top: 100, bottom: 136, left: 50, right: 300,
      width: 250, height: 36, x: 50, y: 100, toJSON: () => {},
    }
    const origGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = function() {
      if (this.classList.contains('vue-treeselect__control')) return mockRect
      return origGetBoundingClientRect.call(this)
    }

    const control = wrapper.find('.vue-treeselect__control')
    await control.trigger('mousedown')
    await nextTick()
    await nextTick()
    await nextTick()

    HTMLElement.prototype.getBoundingClientRect = origGetBoundingClientRect

    const portalTarget = document.querySelector('.vue-treeselect__portal-target') as HTMLElement
    expect(portalTarget).not.toBeNull()

    const topPosition = parseInt(portalTarget.style.top || '0', 10)
    const leftPosition = parseInt(portalTarget.style.left || '0', 10)

    expect(topPosition).toBeGreaterThan(0)
    expect(leftPosition).toBeGreaterThanOrEqual(0)
    expect(parseInt(portalTarget.style.width || '0', 10)).toBeGreaterThan(0)

    wrapper.unmount()
  })

  it('renders menu inline when appendToBody=false (regression test)', async () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [{ id: 'a', label: 'A' }],
        appendToBody: false
      },
      attachTo: document.body
    })

    const control = wrapper.find('.vue-treeselect__control')
    await control.trigger('mousedown')
    await nextTick()
    await nextTick()

    const portalTarget = document.body.querySelector('.vue-treeselect__portal-target')
    expect(portalTarget).toBeNull()

    const menu = wrapper.find('.vue-treeselect__menu')
    expect(menu.exists()).toBe(true)

    wrapper.unmount()
  })
})
