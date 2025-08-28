export default {
  title: 'Accessibility/Helpers',
}

export const VisuallyHiddenDemo = () => ({
  template: `
    <div>
      <p>This button has a <code>visually-hidden</code> label:</p>
      <button>
        <span class="visually-hidden">Save this item</span>
        💾
      </button>
    </div>
  `,
})

export const SkipLink = () => ({
  template: `
    <div>
      <a href="#main-content" class="skip-link">Skip to main content</a>

      <header style="padding: 2rem; background: #f3f4f6;">
        <h1>Welcome to the App</h1>
        <p>This is the header.</p>
      </header>

      <main id="main-content" style="padding: 2rem;">
        <h2>Main Content</h2>
        <p>This is the main content users should skip to.</p>
      </main>
    </div>
  `,
})
