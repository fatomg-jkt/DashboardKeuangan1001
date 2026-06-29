import { renderVNode, resetHooks, setRenderer } from './react.js';
export function createRoot(container) { return { render(vnode) { const draw = () => { resetHooks(); container.replaceChildren(renderVNode(vnode)); }; setRenderer(draw); draw(); } }; }
