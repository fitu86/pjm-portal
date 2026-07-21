import type { ComponentConfig } from '@/components/registry';

export default {
  id: 'text-input',
  name: 'Text Input',
  icon: 'text_fields',
  component: () => import('./TextInput.vue'),
  types: ['string', 'text'],
  options: {
    placeholder: {
      type: 'string',
      default: '',
    },
    maxLength: {
      type: 'number',
      default: null,
    },
  },
} as ComponentConfig;
