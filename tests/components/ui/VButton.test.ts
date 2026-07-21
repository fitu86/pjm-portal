import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VButton from '@/components/ui/VButton.vue';

describe('VButton', () => {
  it('renderiza correctamente', () => {
    const wrapper = mount(VButton, {
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.text()).toBe('Click me');
  });

  it('emite evento click', async () => {
    const wrapper = mount(VButton);
    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('está deshabilitado cuando loading=true', () => {
    const wrapper = mount(VButton, {
      props: { loading: true },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});
