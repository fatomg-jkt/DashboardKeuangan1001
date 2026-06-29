let hookValues = [];
let hookIndex = 0;
let rerender = () => {};

export const Fragment = Symbol('Fragment');
export class Component { constructor(props) { this.props = props || {}; this.state = {}; } setState(next) { this.state = { ...this.state, ...(typeof next === 'function' ? next(this.state, this.props) : next) }; rerender(); } }
export function createElement(type, props, ...children) { return { type, props: props || {}, children: children.flat().filter((child) => child !== null && child !== undefined && child !== false) }; }
export function useState(initialValue) { const slot = hookIndex++; if (hookValues[slot] === undefined) hookValues[slot] = typeof initialValue === 'function' ? initialValue() : initialValue; return [hookValues[slot], (next) => { hookValues[slot] = typeof next === 'function' ? next(hookValues[slot]) : next; rerender(); }]; }
export function useMemo(factory) { return factory(); }
function setProp(element, key, value) { if (key === 'className') element.setAttribute('class', value); else if (key === 'style' && value && typeof value === 'object') Object.assign(element.style, value); else if (key.startsWith('on') && typeof value === 'function') element.addEventListener(key.slice(2).toLowerCase(), value); else if (key !== 'children' && value !== false) element.setAttribute(key, value === true ? '' : value); }
export function renderVNode(vnode) { if (Array.isArray(vnode)) { const fragment = document.createDocumentFragment(); vnode.forEach((child) => fragment.appendChild(renderVNode(child))); return fragment; } if (typeof vnode === 'string' || typeof vnode === 'number') return document.createTextNode(String(vnode)); if (!vnode) return document.createTextNode(''); if (vnode.type === Fragment) { const fragment = document.createDocumentFragment(); vnode.children.forEach((child) => fragment.appendChild(renderVNode(child))); return fragment; } if (typeof vnode.type === 'function') { if (vnode.type.prototype instanceof Component) { const instance = new vnode.type({ ...vnode.props, children: vnode.children }); return renderVNode(instance.render()); } return renderVNode(vnode.type({ ...vnode.props, children: vnode.children })); } const element = document.createElement(vnode.type); Object.entries(vnode.props || {}).forEach(([key, value]) => setProp(element, key, value)); vnode.children.forEach((child) => element.appendChild(renderVNode(child))); return element; }
export function setRenderer(fn) { rerender = fn; }
export function resetHooks() { hookIndex = 0; }
export default { createElement, useState, useMemo, Fragment, Component };
