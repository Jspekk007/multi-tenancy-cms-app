export default {
  title: 'Layout/Grid System',
}

export const ResponsiveGrid = () => ({
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h4>Basic Grid Examples</h4>
        <div v-for="cols in [1, 2, 3, 4]" :key="cols">
          <p><strong>cols-{{ cols }}</strong></p>
          <div :class="'grid cols-' + cols + ' gap-2'">
            <div v-for="i in cols" :key="i" class="grid-box">Item {{ i }}</div>
          </div>
        </div>
      </div>

      <div>
        <h4>Responsive Grid (CSS only)</h4>
        <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
          <div class="grid-box" v-for="n in 6" :key="n">Responsive {{ n }}</div>
        </div>
      </div>

      <div>
        <h4>Nested Grid</h4>
        <div class="grid cols-2 gap-4">
          <div class="grid-box">Column 1</div>
          <div>
            <div class="grid cols-2 gap-2">
              <div class="grid-box">Nested 1</div>
              <div class="grid-box">Nested 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .grid-box {
        background: #1e40af;
        color: white;
        padding: 1rem;
        text-align: center;
        border-radius: 0.5rem;
      }
    `,
  ],
})
