export default {
  title: 'Layout/Flex Utilities',
}

export const FlexLayouts = () => ({
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h4>Horizontal Row with Gap</h4>
        <div class="flex row gap-2 flex-demo">
          <div class="flex-box">One</div>
          <div class="flex-box">Two</div>
          <div class="flex-box">Three</div>
        </div>
      </div>

      <div>
        <h4>Vertical Column with Gap</h4>
        <div class="flex col gap-2 flex-demo" style="height: 150px;">
          <div class="flex-box">Top</div>
          <div class="flex-box">Middle</div>
          <div class="flex-box">Bottom</div>
        </div>
      </div>

      <div>
        <h4>Justify + Align</h4>
        <div class="flex row justify-between items-center gap-4 flex-demo" style="height: 100px;">
          <div class="flex-box">Left</div>
          <div class="flex-box">Right</div>
        </div>
      </div>

      <div>
        <h4>Wrap + Center</h4>
        <div class="flex row wrap justify-center items-center gap-2 flex-demo" style="max-width: 400px;">
          <div class="flex-box" v-for="n in 6" :key="n">Box {{ n }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .flex-box {
        background: #1e40af;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        min-width: 80px;
        text-align: center;
      }

      .flex-demo {
        border: 1px dashed #ccc;
        padding: 1rem;
        border-radius: 0.5rem;
        background: #f9fafb;
      }
    `,
  ],
})
