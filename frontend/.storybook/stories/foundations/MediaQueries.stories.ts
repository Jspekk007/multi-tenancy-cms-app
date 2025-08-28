export default {
  title: 'Layout/Media Queries',
}

export const BreakpointDemo = () => ({
  template: `
    <div class="breakpoint-demo">
      <div class="box">Resize the window to see styles change</div>
    </div>
  `,
  styles: [
    `
    .breakpoint-demo .box {
      background: #1e40af;
      color: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      transition: background 0.3s ease;
    }

    @media (min-width: 640px) {
      .breakpoint-demo .box {
        background: #0ea5e9;
      }
    }

    @media (min-width: 768px) {
      .breakpoint-demo .box {
        background: #10b981;
      }
    }

    @media (min-width: 1024px) {
      .breakpoint-demo .box {
        background: #f59e0b;
      }
    }

    @media (min-width: 1280px) {
      .breakpoint-demo .box {
        background: #ef4444;
      }
    }

    @media (min-width: 1536px) {
      .breakpoint-demo .box {
        background: #8b5cf6;
      }
    }
    `,
  ],
})
