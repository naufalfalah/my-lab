/**
 * Sätteri hast plugin: wraps each `## heading` and the content after it
 * (up to the next `##`) in <section class="step" id="step-N" data-step="N">.
 *
 * Runs at build time, so every step is in the HTML even without JS.
 * Only top-level `##` count; MDX import/export nodes stay at the root.
 * Numbering must match the sidebar in src/layouts/LabLayout.astro.
 */
export const stepsPlugin = {
  name: 'my-lab-steps',
  element: {
    // Never matches; satteri requires at least one visitor besides hooks.
    filter: ['my-lab-noop'],
    visit() {},
  },
  after(root, ctx) {
    const children = [];
    let current = null;
    let count = 0;

    for (const node of root.children) {
      if (node.type === 'mdxjsEsm') {
        children.push(node);
        continue;
      }
      if (node.type === 'element' && node.tagName === 'h2') {
        count += 1;
        current = {
          type: 'element',
          tagName: 'section',
          properties: { id: `step-${count}`, className: ['step'], dataStep: String(count) },
          children: [],
        };
        children.push(current);
      }
      (current ? current.children : children).push(node);
    }

    if (count > 0) ctx.setField(root, 'children', children);
  },
};
