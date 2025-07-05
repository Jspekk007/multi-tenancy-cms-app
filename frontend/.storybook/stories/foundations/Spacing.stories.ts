export default {
  title: 'Foundations/Spacing',
}

const spacings = [
  {
    name: '0',
    value: '0',
  },
  {
    name: '1',
    value: '0.25rem',
  },
  {
    name: '2',
    value: '0.5rem',
  },
  {
    name: '3',
    value: '0.75rem',
  },
  {
    name: '4',
    value: '1rem',
  },
  {
    name: '5',
    value: '1.25rem',
  },
  {
    name: '6',
    value: '1.5rem',
  },
  {
    name: '8',
    value: '2rem',
  },
  {
    name: '10',
    value: '2.5rem',
  },
  {
    name: '12',
    value: '3rem',
  },
]

export const SpacingTokens = () => ({
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div v-for="spacing in spacings" :key="spacing.name">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 120px">{{ '$spacing-' + spacing.name }}</div>
          <div :style="{ width: spacing.value, height: '1rem', background: '#1e40af' }"></div>
          <div>{{ spacing.value }}</div>
        </div>
      </div>
    </div>
  `,
  data() {
    return { spacings }
  },
})
