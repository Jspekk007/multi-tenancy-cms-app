export default {
  title: 'Foundations/Shadows',
}

const shadows = [
  {
    name: 'shadow-sm',
    value: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  {
    name: 'shadow-md',
    value: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  {
    name: 'shadow-lg',
    value: '0 10px 15px rgba(0, 0, 0, 0.15)',
  },
]

export const ShadowTokens = () => ({
  template: `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 2rem;">
      <div v-for="shadow in shadows" :key="shadow.name">
        <div
          :style="{ boxShadow: shadow.value, padding: '1rem', borderRadius: '8px', background: 'white', border: '1px solid #e5e7eb' }"
        >
          <strong>{{ shadow.name }}</strong><br />
          <small>{{ shadow.value }}</small>
        </div>
      </div>
    </div>
  `,
  data() {
    return { shadows }
  },
})
