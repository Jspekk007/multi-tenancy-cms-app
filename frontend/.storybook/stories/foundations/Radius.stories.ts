export default {
  title: 'Foundations/Border Radius',
}

const radii = [
  {
    name: 'radius-sm',
    value: '4px',
  },
  {
    name: 'radius-md',
    value: '8px',
  },
  {
    name: 'radius-lg',
    value: '12px',
  },
  {
    name: 'radius-full',
    value: '9999px',
  },
]

export const RadiusTokens = () => ({
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
      <div
        v-for="radius in radii"
        :key="radius.name"
        :style="{ width: '100px', height: '100px', background: '#1e40af', borderRadius: radius.value }"
      >
        <div style="color: white; font-size: 0.75rem; text-align: center; margin-top: 110px;">{{ radius.name }}</div>
      </div>
    </div>
  `,
  data() {
    return { radii }
  },
})
