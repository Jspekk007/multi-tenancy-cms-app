export default {
  title: 'Foundations/Colors',
}

const colors = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
  'gray-100',
  'gray-200',
  'gray-300',
  'gray-400',
  'gray-500',
  'gray-600',
  'gray-700',
  'gray-800',
  'gray-900',
]

export const AllColors = () => ({
  template: `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem;">
      <div v-for="color in colors" :key="color">
        <div :style="{ backgroundColor: color.startsWith('gray') ? 'var(--' + color + ')' : 'var(--color-' + color + ')', height: '60px', borderRadius: '8px' }"></div>
        <div style="text-align: center; margin-top: 4px;">{{ color }}</div>
      </div>
    </div>
  `,
  data() {
    return { colors }
  },
})
