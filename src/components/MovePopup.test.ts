import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovePopup from '@/components/MovePopup.vue'

describe('MovePopup.vue', () => {
    it('affiche bien les champs', () => {
        const wrapper = mount(MovePopup)
        expect(wrapper.find('input#x').exists()).toBe(true)
        expect(wrapper.find('input#y').exists()).toBe(true)
        expect(wrapper.text()).toContain('Déplacement')
    })

    it('émet validate avec les bonnes coordonnées', async () => {
        const wrapper = mount(MovePopup)

        await wrapper.find('input#x').setValue(3)
        await wrapper.find('input#y').setValue(7)

        await wrapper.find('form').trigger('submit.prevent')

        expect(wrapper.emitted('validate')).toBeTruthy()
        expect(wrapper.emitted('validate')![0]).toEqual([{ x: 3, y: 7 }])
    })

    it('émet cancel lorsqu’on clique sur Annuler', async () => {
        const wrapper = mount(MovePopup)

        await wrapper.find('button[type="button"]').trigger('click')

        expect(wrapper.emitted('cancel')).toBeTruthy()
    })
})
