
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var my_components = (function (exports) {
	'use strict';

	/** @returns {void} */
	function noop() {}

	/** @returns {void} */
	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {string} style_sheet_id
	 * @param {string} styles
	 * @returns {void}
	 */
	function append_styles(target, style_sheet_id, styles) {
		const append_styles_to = get_root_for_style(target);
		if (!append_styles_to.getElementById(style_sheet_id)) {
			const style = element('style');
			style.id = style_sheet_id;
			style.textContent = styles;
			append_stylesheet(append_styles_to, style);
		}
	}

	/**
	 * @param {Node} node
	 * @returns {ShadowRoot | Document}
	 */
	function get_root_for_style(node) {
		if (!node) return document;
		const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
		if (root && /** @type {ShadowRoot} */ (root).host) {
			return /** @type {ShadowRoot} */ (root);
		}
		return node.ownerDocument;
	}

	/**
	 * @param {ShadowRoot | Document} node
	 * @param {HTMLStyleElement} style
	 * @returns {CSSStyleSheet}
	 */
	function append_stylesheet(node, style) {
		append(/** @type {Document} */ (node).head || node, style);
		return style.sheet;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @returns {void} */
	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @returns {void} */
	function set_input_value(input, value) {
		input.value = value == null ? '' : value;
	}

	/**
	 * @returns {void} */
	function select_option(select, value, mounting) {
		for (let i = 0; i < select.options.length; i += 1) {
			const option = select.options[i];
			if (option.__value === value) {
				option.selected = true;
				return;
			}
		}
		if (!mounting || value !== undefined) {
			select.selectedIndex = -1; // no option should be selected
		}
	}

	function select_value(select) {
		const selected_option = select.querySelector(':checked');
		return selected_option && selected_option.__value;
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @param {HTMLElement} element
	 * @returns {{}}
	 */
	function get_custom_elements_slots(element) {
		const result = {};
		element.childNodes.forEach(
			/** @param {Element} node */ (node) => {
				result[node.slot || 'default'] = true;
			}
		);
		return result;
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	/**
	 * Schedules a callback to run immediately before the component is unmounted.
	 *
	 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
	 * only one that runs inside a server-side component.
	 *
	 * https://svelte.dev/docs/svelte#ondestroy
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	/** @returns {void} */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				const nodes = children(options.target);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	let SvelteElement;

	if (typeof HTMLElement === 'function') {
		SvelteElement = class extends HTMLElement {
			$$componentCtor;
			$$slots;
			$$component;
			$$connected = false;
			$$data = {};
			$$reflecting = false;
			/** @type {Record<string, CustomElementPropDefinition>} */
			$$props_definition = {};
			/** @type {Record<string, Function[]>} */
			$$listeners = {};
			/** @type {Map<Function, Function>} */
			$$listener_unsubscribe_fns = new Map();

			constructor($$componentCtor, $$slots, use_shadow_dom) {
				super();
				this.$$componentCtor = $$componentCtor;
				this.$$slots = $$slots;
				if (use_shadow_dom) {
					this.attachShadow({ mode: 'open' });
				}
			}

			addEventListener(type, listener, options) {
				// We can't determine upfront if the event is a custom event or not, so we have to
				// listen to both. If someone uses a custom event with the same name as a regular
				// browser event, this fires twice - we can't avoid that.
				this.$$listeners[type] = this.$$listeners[type] || [];
				this.$$listeners[type].push(listener);
				if (this.$$component) {
					const unsub = this.$$component.$on(type, listener);
					this.$$listener_unsubscribe_fns.set(listener, unsub);
				}
				super.addEventListener(type, listener, options);
			}

			removeEventListener(type, listener, options) {
				super.removeEventListener(type, listener, options);
				if (this.$$component) {
					const unsub = this.$$listener_unsubscribe_fns.get(listener);
					if (unsub) {
						unsub();
						this.$$listener_unsubscribe_fns.delete(listener);
					}
				}
			}

			async connectedCallback() {
				this.$$connected = true;
				if (!this.$$component) {
					// We wait one tick to let possible child slot elements be created/mounted
					await Promise.resolve();
					if (!this.$$connected) {
						return;
					}
					function create_slot(name) {
						return () => {
							let node;
							const obj = {
								c: function create() {
									node = document.createElement('slot');
									if (name !== 'default') {
										node.setAttribute('name', name);
									}
								},
								/**
								 * @param {HTMLElement} target
								 * @param {HTMLElement} [anchor]
								 */
								m: function mount(target, anchor) {
									insert(target, node, anchor);
								},
								d: function destroy(detaching) {
									if (detaching) {
										detach(node);
									}
								}
							};
							return obj;
						};
					}
					const $$slots = {};
					const existing_slots = get_custom_elements_slots(this);
					for (const name of this.$$slots) {
						if (name in existing_slots) {
							$$slots[name] = [create_slot(name)];
						}
					}
					for (const attribute of this.attributes) {
						// this.$$data takes precedence over this.attributes
						const name = this.$$get_prop_name(attribute.name);
						if (!(name in this.$$data)) {
							this.$$data[name] = get_custom_element_value(
								name,
								attribute.value,
								this.$$props_definition,
								'toProp'
							);
						}
					}
					this.$$component = new this.$$componentCtor({
						target: this.shadowRoot || this,
						props: {
							...this.$$data,
							$$slots,
							$$scope: {
								ctx: []
							}
						}
					});
					for (const type in this.$$listeners) {
						for (const listener of this.$$listeners[type]) {
							const unsub = this.$$component.$on(type, listener);
							this.$$listener_unsubscribe_fns.set(listener, unsub);
						}
					}
					this.$$listeners = {};
				}
			}

			// We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
			// and setting attributes through setAttribute etc, this is helpful
			attributeChangedCallback(attr, _oldValue, newValue) {
				if (this.$$reflecting) return;
				attr = this.$$get_prop_name(attr);
				this.$$data[attr] = get_custom_element_value(
					attr,
					newValue,
					this.$$props_definition,
					'toProp'
				);
				this.$$component?.$set({ [attr]: this.$$data[attr] });
			}

			disconnectedCallback() {
				this.$$connected = false;
				// In a microtask, because this could be a move within the DOM
				Promise.resolve().then(() => {
					if (!this.$$connected) {
						this.$$component.$destroy();
						this.$$component = undefined;
					}
				});
			}

			$$get_prop_name(attribute_name) {
				return (
					Object.keys(this.$$props_definition).find(
						(key) =>
							this.$$props_definition[key].attribute === attribute_name ||
							(!this.$$props_definition[key].attribute && key.toLowerCase() === attribute_name)
					) || attribute_name
				);
			}
		};
	}

	/**
	 * @param {string} prop
	 * @param {any} value
	 * @param {Record<string, CustomElementPropDefinition>} props_definition
	 * @param {'toAttribute' | 'toProp'} [transform]
	 */
	function get_custom_element_value(prop, value, props_definition, transform) {
		const type = props_definition[prop]?.type;
		value = type === 'Boolean' && typeof value !== 'boolean' ? value != null : value;
		if (!transform || !props_definition[prop]) {
			return value;
		} else if (transform === 'toAttribute') {
			switch (type) {
				case 'Object':
				case 'Array':
					return value == null ? null : JSON.stringify(value);
				case 'Boolean':
					return value ? '' : null;
				case 'Number':
					return value == null ? null : value;
				default:
					return value;
			}
		} else {
			switch (type) {
				case 'Object':
				case 'Array':
					return value && JSON.parse(value);
				case 'Boolean':
					return value; // conversion already handled above
				case 'Number':
					return value != null ? +value : value;
				default:
					return value;
			}
		}
	}

	/**
	 * @internal
	 *
	 * Turn a Svelte component into a custom element.
	 * @param {import('./public.js').ComponentType} Component  A Svelte component constructor
	 * @param {Record<string, CustomElementPropDefinition>} props_definition  The props to observe
	 * @param {string[]} slots  The slots to create
	 * @param {string[]} accessors  Other accessors besides the ones for props the component has
	 * @param {boolean} use_shadow_dom  Whether to use shadow DOM
	 */
	function create_custom_element(
		Component,
		props_definition,
		slots,
		accessors,
		use_shadow_dom
	) {
		const Class = class extends SvelteElement {
			constructor() {
				super(Component, slots, use_shadow_dom);
				this.$$props_definition = props_definition;
			}
			static get observedAttributes() {
				return Object.keys(props_definition).map((key) =>
					(props_definition[key].attribute || key).toLowerCase()
				);
			}
		};
		Object.keys(props_definition).forEach((prop) => {
			Object.defineProperty(Class.prototype, prop, {
				get() {
					return this.$$component && prop in this.$$component
						? this.$$component[prop]
						: this.$$data[prop];
				},
				set(value) {
					value = get_custom_element_value(prop, value, props_definition);
					this.$$data[prop] = value;
					this.$$component?.$set({ [prop]: value });
					if (props_definition[prop].reflect) {
						this.$$reflecting = true;
						const attribute_value = get_custom_element_value(
							prop,
							value,
							props_definition,
							'toAttribute'
						);
						if (attribute_value == null) {
							this.removeAttribute(prop);
						} else {
							this.setAttribute(props_definition[prop].attribute || prop, attribute_value);
						}
						this.$$reflecting = false;
					}
				}
			});
		});
		accessors.forEach((accessor) => {
			Object.defineProperty(Class.prototype, accessor, {
				get() {
					return this.$$component?.[accessor];
				}
			});
		});
		Component.element = /** @type {any} */ (Class);
		return Class;
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	/**
	 * The current version, as set in package.json.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-version
	 * @type {string}
	 */
	const VERSION = '4.0.1';
	const PUBLIC_VERSION = '4';

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @returns {void}
	 */
	function dispatch_dev(type, detail) {
		document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append_dev(target, node) {
		dispatch_dev('SvelteDOMInsert', { target, node });
		append(target, node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert_dev(target, node, anchor) {
		dispatch_dev('SvelteDOMInsert', { target, node, anchor });
		insert(target, node, anchor);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach_dev(node) {
		dispatch_dev('SvelteDOMRemove', { node });
		detach(node);
	}

	/**
	 * @param {Node} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @param {boolean} [has_prevent_default]
	 * @param {boolean} [has_stop_propagation]
	 * @param {boolean} [has_stop_immediate_propagation]
	 * @returns {() => void}
	 */
	function listen_dev(
		node,
		event,
		handler,
		options,
		has_prevent_default,
		has_stop_propagation,
		has_stop_immediate_propagation
	) {
		const modifiers =
			options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
		if (has_prevent_default) modifiers.push('preventDefault');
		if (has_stop_propagation) modifiers.push('stopPropagation');
		if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');
		dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
		const dispose = listen(node, event, handler, options);
		return () => {
			dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
			dispose();
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr_dev(node, attribute, value) {
		attr(node, attribute, value);
		if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
		else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}

	/**
	 * @param {Element} node
	 * @param {string} property
	 * @param {any} [value]
	 * @returns {void}
	 */
	function prop_dev(node, property, value) {
		node[property] = value;
		dispatch_dev('SvelteDOMSetProperty', { node, property, value });
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data_dev(text, data) {
		data = '' + data;
		if (text.data === data) return;
		dispatch_dev('SvelteDOMSetData', { node: text, data });
		text.data = /** @type {string} */ (data);
	}

	function ensure_array_like_dev(arg) {
		if (
			typeof arg !== 'string' &&
			!(arg && typeof arg === 'object' && 'length' in arg) &&
			!(typeof Symbol === 'function' && arg && Symbol.iterator in arg)
		) {
			throw new Error('{#each} only works with iterable values.');
		}
		return ensure_array_like(arg);
	}

	/**
	 * @returns {void} */
	function validate_slots(name, slot, keys) {
		for (const slot_key of Object.keys(slot)) {
			if (!~keys.indexOf(slot_key)) {
				console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
			}
		}
	}

	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 *
	 * Can be used to create strongly typed Svelte components.
	 *
	 * #### Example:
	 *
	 * You have component library on npm called `component-library`, from which
	 * you export a component called `MyComponent`. For Svelte+TypeScript users,
	 * you want to provide typings. Therefore you create a `index.d.ts`:
	 * ```ts
	 * import { SvelteComponent } from "svelte";
	 * export class MyComponent extends SvelteComponent<{foo: string}> {}
	 * ```
	 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
	 * to provide intellisense and to use the component like this in a Svelte file
	 * with TypeScript:
	 * ```svelte
	 * <script lang="ts">
	 * 	import { MyComponent } from "component-library";
	 * </script>
	 * <MyComponent foo={'bar'} />
	 * ```
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 * @template {Record<string, any>} [Slots=any]
	 * @extends {SvelteComponent<Props, Events>}
	 */
	class SvelteComponentDev extends SvelteComponent {
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Props}
		 */
		$$prop_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Events}
		 */
		$$events_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Slots}
		 */
		$$slot_def;

		/** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error("'target' is a required option");
			}
			super();
		}

		/** @returns {void} */
		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn('Component was already destroyed'); // eslint-disable-line no-console
			};
		}

		/** @returns {void} */
		$capture_state() {}

		/** @returns {void} */
		$inject_state() {}
	}

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	/* src\Counter.svelte generated by Svelte v4.0.1 */
	const file$2 = "src\\Counter.svelte";

	function add_css$2(target) {
		append_styles(target, "svelte-jb1zd4", "button.svelte-jb1zd4{font-family:inherit;font-size:inherit;padding:1em 2em;color:#ff3e00;background-color:rgba(255, 62, 0, 0.1);border-radius:2em;border:2px solid rgba(255, 62, 0, 0);outline:none;width:200px;font-variant-numeric:tabular-nums;cursor:pointer}button.svelte-jb1zd4:focus{border:2px solid #ff3e00}button.svelte-jb1zd4:active{background-color:rgba(255, 62, 0, 0.2)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ291bnRlci5zdmVsdGUiLCJzb3VyY2VzIjpbIkNvdW50ZXIuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzdmVsdGU6b3B0aW9ucyBjdXN0b21FbGVtZW50PVwibXktY291bnRlclwiIC8+XG5cbjxzY3JpcHQ+XG4gICAgZXhwb3J0IGxldCBjb3VudCA9IDA7XG5cbiAgICAvLyBzdmVsdGUtaWdub3JlIHVudXNlZC1leHBvcnQtbGV0XG4gICAgZXhwb3J0IGxldCBudW1EYXRhID0ge307XG4gICAgXG4gICAgY29uc3QgaW5jcmVtZW50ID0gKCkgPT4ge1xuICAgICAgICBjb3VudCA9IHBhcnNlSW50KGNvdW50KSArIDE7XG4gICAgfTtcbiAgICBjb25zdCBkZWNyZW1lbnQgPSAoKSA9PiB7XG4gICAgICAgIGNvdW50ID0gcGFyc2VJbnQoY291bnQpIC0gMTtcbiAgICB9O1xuXG4gICAgLy8gc3ZlbHRlLWlnbm9yZSB1bnVzZWQtZXhwb3J0LWxldFxuICAgIGV4cG9ydCBsZXQgaW5jTnVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpbmNyZW1lbnQoKTtcbiAgICB9O1xuXG4gICAgLy8gc3ZlbHRlLWlnbm9yZSB1bnVzZWQtZXhwb3J0LWxldFxuICAgIGV4cG9ydCBsZXQgZGVjTnVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWNyZW1lbnQoKTtcbiAgICB9O1xuPC9zY3JpcHQ+XG5cbjxidXR0b24gb246Y2xpY2s9e2luY3JlbWVudH0+XG4gICAgQ2xpY2tzOiB7Y291bnR9XG48L2J1dHRvbj5cblxuPHN0eWxlPlxuICAgIGJ1dHRvbiB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuICAgICAgICBmb250LXNpemU6IGluaGVyaXQ7XG4gICAgICAgIHBhZGRpbmc6IDFlbSAyZW07XG4gICAgICAgIGNvbG9yOiAjZmYzZTAwO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgNjIsIDAsIDAuMSk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDJlbTtcbiAgICAgICAgYm9yZGVyOiAycHggc29saWQgcmdiYSgyNTUsIDYyLCAwLCAwKTtcbiAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgd2lkdGg6IDIwMHB4O1xuICAgICAgICBmb250LXZhcmlhbnQtbnVtZXJpYzogdGFidWxhci1udW1zO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgfVxuXG4gICAgYnV0dG9uOmZvY3VzIHtcbiAgICAgICAgYm9yZGVyOiAycHggc29saWQgI2ZmM2UwMDtcbiAgICB9XG5cbiAgICBidXR0b246YWN0aXZlIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDYyLCAwLCAwLjIpO1xuICAgIH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK0JJLG9CQUFPLENBQ0gsV0FBVyxDQUFFLE9BQU8sQ0FDcEIsU0FBUyxDQUFFLE9BQU8sQ0FDbEIsT0FBTyxDQUFFLEdBQUcsQ0FBQyxHQUFHLENBQ2hCLEtBQUssQ0FBRSxPQUFPLENBQ2QsZ0JBQWdCLENBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDdkMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDckMsT0FBTyxDQUFFLElBQUksQ0FDYixLQUFLLENBQUUsS0FBSyxDQUNaLG9CQUFvQixDQUFFLFlBQVksQ0FDbEMsTUFBTSxDQUFFLE9BQ1osQ0FFQSxvQkFBTSxNQUFPLENBQ1QsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FDdEIsQ0FFQSxvQkFBTSxPQUFRLENBQ1YsZ0JBQWdCLENBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQzFDIn0= */");
	}

	function create_fragment$2(ctx) {
		let button;
		let t0;
		let t1;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				button = element("button");
				t0 = text("Clicks: ");
				t1 = text(/*count*/ ctx[0]);
				attr_dev(button, "class", "svelte-jb1zd4");
				add_location(button, file$2, 26, 0, 527);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);
				append_dev(button, t0);
				append_dev(button, t1);

				if (!mounted) {
					dispose = listen_dev(button, "click", /*increment*/ ctx[1], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*count*/ 1) set_data_dev(t1, /*count*/ ctx[0]);
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(button);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$2.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('my-counter', slots, []);
		let { count = 0 } = $$props;
		let { numData = {} } = $$props;

		const increment = () => {
			$$invalidate(0, count = parseInt(count) + 1);
		};

		const decrement = () => {
			$$invalidate(0, count = parseInt(count) - 1);
		};

		let { incNum = function () {
			increment();
		} } = $$props;

		let { decNum = function () {
			decrement();
		} } = $$props;

		const writable_props = ['count', 'numData', 'incNum', 'decNum'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<my-counter> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('count' in $$props) $$invalidate(0, count = $$props.count);
			if ('numData' in $$props) $$invalidate(2, numData = $$props.numData);
			if ('incNum' in $$props) $$invalidate(3, incNum = $$props.incNum);
			if ('decNum' in $$props) $$invalidate(4, decNum = $$props.decNum);
		};

		$$self.$capture_state = () => ({
			count,
			numData,
			increment,
			decrement,
			incNum,
			decNum
		});

		$$self.$inject_state = $$props => {
			if ('count' in $$props) $$invalidate(0, count = $$props.count);
			if ('numData' in $$props) $$invalidate(2, numData = $$props.numData);
			if ('incNum' in $$props) $$invalidate(3, incNum = $$props.incNum);
			if ('decNum' in $$props) $$invalidate(4, decNum = $$props.decNum);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [count, increment, numData, incNum, decNum];
	}

	class Counter extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(
				this,
				options,
				instance$2,
				create_fragment$2,
				safe_not_equal,
				{
					count: 0,
					numData: 2,
					incNum: 3,
					decNum: 4
				},
				add_css$2
			);

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Counter",
				options,
				id: create_fragment$2.name
			});
		}

		get count() {
			return this.$$.ctx[0];
		}

		set count(count) {
			this.$$set({ count });
			flush();
		}

		get numData() {
			return this.$$.ctx[2];
		}

		set numData(numData) {
			this.$$set({ numData });
			flush();
		}

		get incNum() {
			return this.$$.ctx[3];
		}

		set incNum(incNum) {
			this.$$set({ incNum });
			flush();
		}

		get decNum() {
			return this.$$.ctx[4];
		}

		set decNum(decNum) {
			this.$$set({ decNum });
			flush();
		}
	}

	customElements.define("my-counter", create_custom_element(Counter, {"count":{},"numData":{},"incNum":{},"decNum":{}}, [], [], true));

	/* src\Clock.svelte generated by Svelte v4.0.1 */
	const file$1 = "src\\Clock.svelte";

	function add_css$1(target) {
		append_styles(target, "svelte-13yqp5d", "span.svelte-13yqp5d{font-family:inherit;font-size:inherit;padding:1em 2em;color:#ff3e00;background-color:rgba(255, 62, 0, 0.1);border-radius:2em;border:2px solid rgba(255, 62, 0, 0);outline:none;width:200px;font-variant-numeric:tabular-nums;cursor:pointer}span.svelte-13yqp5d:active{background-color:rgba(255, 62, 0, 0.2)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xvY2suc3ZlbHRlIiwic291cmNlcyI6WyJDbG9jay5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHN2ZWx0ZTpvcHRpb25zIGN1c3RvbUVsZW1lbnQ9XCJteS1jbG9ja1wiIC8+XG5cbjxzY3JpcHQ+XG4gICAgaW1wb3J0IHsgb25Nb3VudCwgb25EZXN0cm95IH0gZnJvbSBcInN2ZWx0ZVwiO1xuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKTtcbiAgICBsZXQgaW50ZXJ2YWw7XG5cbiAgICBvbk1vdW50KCgpID0+IHtcbiAgICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoKS50b0xvY2FsZVRpbWVTdHJpbmcoKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfSk7XG5cbiAgICBvbkRlc3Ryb3koKCkgPT4ge1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICB9KTtcbjwvc2NyaXB0PlxuXG48c3Bhbj57ZGF0ZSB8fCBcIlwifTwvc3Bhbj5cblxuPHN0eWxlPlxuICAgIHNwYW4ge1xuICAgICAgICBmb250LWZhbWlseTogaW5oZXJpdDtcbiAgICAgICAgZm9udC1zaXplOiBpbmhlcml0O1xuICAgICAgICBwYWRkaW5nOiAxZW0gMmVtO1xuICAgICAgICBjb2xvcjogI2ZmM2UwMDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDYyLCAwLCAwLjEpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAyZW07XG4gICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHJnYmEoMjU1LCA2MiwgMCwgMCk7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIHdpZHRoOiAyMDBweDtcbiAgICAgICAgZm9udC12YXJpYW50LW51bWVyaWM6IHRhYnVsYXItbnVtcztcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cblxuICAgIHNwYW46YWN0aXZlIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDYyLCAwLCAwLjIpO1xuICAgIH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUJJLG1CQUFLLENBQ0QsV0FBVyxDQUFFLE9BQU8sQ0FDcEIsU0FBUyxDQUFFLE9BQU8sQ0FDbEIsT0FBTyxDQUFFLEdBQUcsQ0FBQyxHQUFHLENBQ2hCLEtBQUssQ0FBRSxPQUFPLENBQ2QsZ0JBQWdCLENBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDdkMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDckMsT0FBTyxDQUFFLElBQUksQ0FDYixLQUFLLENBQUUsS0FBSyxDQUNaLG9CQUFvQixDQUFFLFlBQVksQ0FDbEMsTUFBTSxDQUFFLE9BQ1osQ0FFQSxtQkFBSSxPQUFRLENBQ1IsZ0JBQWdCLENBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQzFDIn0= */");
	}

	function create_fragment$1(ctx) {
		let span;
		let t_value = (/*date*/ ctx[0] || "") + "";
		let t;

		const block = {
			c: function create() {
				span = element("span");
				t = text(t_value);
				attr_dev(span, "class", "svelte-13yqp5d");
				add_location(span, file$1, 18, 0, 382);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, span, anchor);
				append_dev(span, t);
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*date*/ 1 && t_value !== (t_value = (/*date*/ ctx[0] || "") + "")) set_data_dev(t, t_value);
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(span);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$1.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('my-clock', slots, []);
		let date = new Date().toLocaleTimeString();
		let interval;

		onMount(() => {
			interval = setInterval(
				() => {
					$$invalidate(0, date = new Date().toLocaleTimeString());
				},
				1000
			);
		});

		onDestroy(() => {
			clearInterval(interval);
		});

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<my-clock> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ onMount, onDestroy, date, interval });

		$$self.$inject_state = $$props => {
			if ('date' in $$props) $$invalidate(0, date = $$props.date);
			if ('interval' in $$props) interval = $$props.interval;
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [date];
	}

	class Clock extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css$1);

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Clock",
				options,
				id: create_fragment$1.name
			});
		}
	}

	customElements.define("my-clock", create_custom_element(Clock, {}, [], [], true));

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function commonjsRequire(path) {
		throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
	}

	var moment$1 = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
		    module.exports = factory() ;
		}(commonjsGlobal, (function () {
		    var hookCallback;

		    function hooks() {
		        return hookCallback.apply(null, arguments);
		    }

		    // This is done to register the method called with moment()
		    // without creating circular dependencies.
		    function setHookCallback(callback) {
		        hookCallback = callback;
		    }

		    function isArray(input) {
		        return (
		            input instanceof Array ||
		            Object.prototype.toString.call(input) === '[object Array]'
		        );
		    }

		    function isObject(input) {
		        // IE8 will treat undefined and null as object if it wasn't for
		        // input != null
		        return (
		            input != null &&
		            Object.prototype.toString.call(input) === '[object Object]'
		        );
		    }

		    function hasOwnProp(a, b) {
		        return Object.prototype.hasOwnProperty.call(a, b);
		    }

		    function isObjectEmpty(obj) {
		        if (Object.getOwnPropertyNames) {
		            return Object.getOwnPropertyNames(obj).length === 0;
		        } else {
		            var k;
		            for (k in obj) {
		                if (hasOwnProp(obj, k)) {
		                    return false;
		                }
		            }
		            return true;
		        }
		    }

		    function isUndefined(input) {
		        return input === void 0;
		    }

		    function isNumber(input) {
		        return (
		            typeof input === 'number' ||
		            Object.prototype.toString.call(input) === '[object Number]'
		        );
		    }

		    function isDate(input) {
		        return (
		            input instanceof Date ||
		            Object.prototype.toString.call(input) === '[object Date]'
		        );
		    }

		    function map(arr, fn) {
		        var res = [],
		            i,
		            arrLen = arr.length;
		        for (i = 0; i < arrLen; ++i) {
		            res.push(fn(arr[i], i));
		        }
		        return res;
		    }

		    function extend(a, b) {
		        for (var i in b) {
		            if (hasOwnProp(b, i)) {
		                a[i] = b[i];
		            }
		        }

		        if (hasOwnProp(b, 'toString')) {
		            a.toString = b.toString;
		        }

		        if (hasOwnProp(b, 'valueOf')) {
		            a.valueOf = b.valueOf;
		        }

		        return a;
		    }

		    function createUTC(input, format, locale, strict) {
		        return createLocalOrUTC(input, format, locale, strict, true).utc();
		    }

		    function defaultParsingFlags() {
		        // We need to deep clone this object.
		        return {
		            empty: false,
		            unusedTokens: [],
		            unusedInput: [],
		            overflow: -2,
		            charsLeftOver: 0,
		            nullInput: false,
		            invalidEra: null,
		            invalidMonth: null,
		            invalidFormat: false,
		            userInvalidated: false,
		            iso: false,
		            parsedDateParts: [],
		            era: null,
		            meridiem: null,
		            rfc2822: false,
		            weekdayMismatch: false,
		        };
		    }

		    function getParsingFlags(m) {
		        if (m._pf == null) {
		            m._pf = defaultParsingFlags();
		        }
		        return m._pf;
		    }

		    var some;
		    if (Array.prototype.some) {
		        some = Array.prototype.some;
		    } else {
		        some = function (fun) {
		            var t = Object(this),
		                len = t.length >>> 0,
		                i;

		            for (i = 0; i < len; i++) {
		                if (i in t && fun.call(this, t[i], i, t)) {
		                    return true;
		                }
		            }

		            return false;
		        };
		    }

		    function isValid(m) {
		        if (m._isValid == null) {
		            var flags = getParsingFlags(m),
		                parsedParts = some.call(flags.parsedDateParts, function (i) {
		                    return i != null;
		                }),
		                isNowValid =
		                    !isNaN(m._d.getTime()) &&
		                    flags.overflow < 0 &&
		                    !flags.empty &&
		                    !flags.invalidEra &&
		                    !flags.invalidMonth &&
		                    !flags.invalidWeekday &&
		                    !flags.weekdayMismatch &&
		                    !flags.nullInput &&
		                    !flags.invalidFormat &&
		                    !flags.userInvalidated &&
		                    (!flags.meridiem || (flags.meridiem && parsedParts));

		            if (m._strict) {
		                isNowValid =
		                    isNowValid &&
		                    flags.charsLeftOver === 0 &&
		                    flags.unusedTokens.length === 0 &&
		                    flags.bigHour === undefined;
		            }

		            if (Object.isFrozen == null || !Object.isFrozen(m)) {
		                m._isValid = isNowValid;
		            } else {
		                return isNowValid;
		            }
		        }
		        return m._isValid;
		    }

		    function createInvalid(flags) {
		        var m = createUTC(NaN);
		        if (flags != null) {
		            extend(getParsingFlags(m), flags);
		        } else {
		            getParsingFlags(m).userInvalidated = true;
		        }

		        return m;
		    }

		    // Plugins that add properties should also add the key here (null value),
		    // so we can properly clone ourselves.
		    var momentProperties = (hooks.momentProperties = []),
		        updateInProgress = false;

		    function copyConfig(to, from) {
		        var i,
		            prop,
		            val,
		            momentPropertiesLen = momentProperties.length;

		        if (!isUndefined(from._isAMomentObject)) {
		            to._isAMomentObject = from._isAMomentObject;
		        }
		        if (!isUndefined(from._i)) {
		            to._i = from._i;
		        }
		        if (!isUndefined(from._f)) {
		            to._f = from._f;
		        }
		        if (!isUndefined(from._l)) {
		            to._l = from._l;
		        }
		        if (!isUndefined(from._strict)) {
		            to._strict = from._strict;
		        }
		        if (!isUndefined(from._tzm)) {
		            to._tzm = from._tzm;
		        }
		        if (!isUndefined(from._isUTC)) {
		            to._isUTC = from._isUTC;
		        }
		        if (!isUndefined(from._offset)) {
		            to._offset = from._offset;
		        }
		        if (!isUndefined(from._pf)) {
		            to._pf = getParsingFlags(from);
		        }
		        if (!isUndefined(from._locale)) {
		            to._locale = from._locale;
		        }

		        if (momentPropertiesLen > 0) {
		            for (i = 0; i < momentPropertiesLen; i++) {
		                prop = momentProperties[i];
		                val = from[prop];
		                if (!isUndefined(val)) {
		                    to[prop] = val;
		                }
		            }
		        }

		        return to;
		    }

		    // Moment prototype object
		    function Moment(config) {
		        copyConfig(this, config);
		        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
		        if (!this.isValid()) {
		            this._d = new Date(NaN);
		        }
		        // Prevent infinite loop in case updateOffset creates new moment
		        // objects.
		        if (updateInProgress === false) {
		            updateInProgress = true;
		            hooks.updateOffset(this);
		            updateInProgress = false;
		        }
		    }

		    function isMoment(obj) {
		        return (
		            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
		        );
		    }

		    function warn(msg) {
		        if (
		            hooks.suppressDeprecationWarnings === false &&
		            typeof console !== 'undefined' &&
		            console.warn
		        ) {
		            console.warn('Deprecation warning: ' + msg);
		        }
		    }

		    function deprecate(msg, fn) {
		        var firstTime = true;

		        return extend(function () {
		            if (hooks.deprecationHandler != null) {
		                hooks.deprecationHandler(null, msg);
		            }
		            if (firstTime) {
		                var args = [],
		                    arg,
		                    i,
		                    key,
		                    argLen = arguments.length;
		                for (i = 0; i < argLen; i++) {
		                    arg = '';
		                    if (typeof arguments[i] === 'object') {
		                        arg += '\n[' + i + '] ';
		                        for (key in arguments[0]) {
		                            if (hasOwnProp(arguments[0], key)) {
		                                arg += key + ': ' + arguments[0][key] + ', ';
		                            }
		                        }
		                        arg = arg.slice(0, -2); // Remove trailing comma and space
		                    } else {
		                        arg = arguments[i];
		                    }
		                    args.push(arg);
		                }
		                warn(
		                    msg +
		                        '\nArguments: ' +
		                        Array.prototype.slice.call(args).join('') +
		                        '\n' +
		                        new Error().stack
		                );
		                firstTime = false;
		            }
		            return fn.apply(this, arguments);
		        }, fn);
		    }

		    var deprecations = {};

		    function deprecateSimple(name, msg) {
		        if (hooks.deprecationHandler != null) {
		            hooks.deprecationHandler(name, msg);
		        }
		        if (!deprecations[name]) {
		            warn(msg);
		            deprecations[name] = true;
		        }
		    }

		    hooks.suppressDeprecationWarnings = false;
		    hooks.deprecationHandler = null;

		    function isFunction(input) {
		        return (
		            (typeof Function !== 'undefined' && input instanceof Function) ||
		            Object.prototype.toString.call(input) === '[object Function]'
		        );
		    }

		    function set(config) {
		        var prop, i;
		        for (i in config) {
		            if (hasOwnProp(config, i)) {
		                prop = config[i];
		                if (isFunction(prop)) {
		                    this[i] = prop;
		                } else {
		                    this['_' + i] = prop;
		                }
		            }
		        }
		        this._config = config;
		        // Lenient ordinal parsing accepts just a number in addition to
		        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
		        // TODO: Remove "ordinalParse" fallback in next major release.
		        this._dayOfMonthOrdinalParseLenient = new RegExp(
		            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
		                '|' +
		                /\d{1,2}/.source
		        );
		    }

		    function mergeConfigs(parentConfig, childConfig) {
		        var res = extend({}, parentConfig),
		            prop;
		        for (prop in childConfig) {
		            if (hasOwnProp(childConfig, prop)) {
		                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
		                    res[prop] = {};
		                    extend(res[prop], parentConfig[prop]);
		                    extend(res[prop], childConfig[prop]);
		                } else if (childConfig[prop] != null) {
		                    res[prop] = childConfig[prop];
		                } else {
		                    delete res[prop];
		                }
		            }
		        }
		        for (prop in parentConfig) {
		            if (
		                hasOwnProp(parentConfig, prop) &&
		                !hasOwnProp(childConfig, prop) &&
		                isObject(parentConfig[prop])
		            ) {
		                // make sure changes to properties don't modify parent config
		                res[prop] = extend({}, res[prop]);
		            }
		        }
		        return res;
		    }

		    function Locale(config) {
		        if (config != null) {
		            this.set(config);
		        }
		    }

		    var keys;

		    if (Object.keys) {
		        keys = Object.keys;
		    } else {
		        keys = function (obj) {
		            var i,
		                res = [];
		            for (i in obj) {
		                if (hasOwnProp(obj, i)) {
		                    res.push(i);
		                }
		            }
		            return res;
		        };
		    }

		    var defaultCalendar = {
		        sameDay: '[Today at] LT',
		        nextDay: '[Tomorrow at] LT',
		        nextWeek: 'dddd [at] LT',
		        lastDay: '[Yesterday at] LT',
		        lastWeek: '[Last] dddd [at] LT',
		        sameElse: 'L',
		    };

		    function calendar(key, mom, now) {
		        var output = this._calendar[key] || this._calendar['sameElse'];
		        return isFunction(output) ? output.call(mom, now) : output;
		    }

		    function zeroFill(number, targetLength, forceSign) {
		        var absNumber = '' + Math.abs(number),
		            zerosToFill = targetLength - absNumber.length,
		            sign = number >= 0;
		        return (
		            (sign ? (forceSign ? '+' : '') : '-') +
		            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
		            absNumber
		        );
		    }

		    var formattingTokens =
		            /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
		        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
		        formatFunctions = {},
		        formatTokenFunctions = {};

		    // token:    'M'
		    // padded:   ['MM', 2]
		    // ordinal:  'Mo'
		    // callback: function () { this.month() + 1 }
		    function addFormatToken(token, padded, ordinal, callback) {
		        var func = callback;
		        if (typeof callback === 'string') {
		            func = function () {
		                return this[callback]();
		            };
		        }
		        if (token) {
		            formatTokenFunctions[token] = func;
		        }
		        if (padded) {
		            formatTokenFunctions[padded[0]] = function () {
		                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
		            };
		        }
		        if (ordinal) {
		            formatTokenFunctions[ordinal] = function () {
		                return this.localeData().ordinal(
		                    func.apply(this, arguments),
		                    token
		                );
		            };
		        }
		    }

		    function removeFormattingTokens(input) {
		        if (input.match(/\[[\s\S]/)) {
		            return input.replace(/^\[|\]$/g, '');
		        }
		        return input.replace(/\\/g, '');
		    }

		    function makeFormatFunction(format) {
		        var array = format.match(formattingTokens),
		            i,
		            length;

		        for (i = 0, length = array.length; i < length; i++) {
		            if (formatTokenFunctions[array[i]]) {
		                array[i] = formatTokenFunctions[array[i]];
		            } else {
		                array[i] = removeFormattingTokens(array[i]);
		            }
		        }

		        return function (mom) {
		            var output = '',
		                i;
		            for (i = 0; i < length; i++) {
		                output += isFunction(array[i])
		                    ? array[i].call(mom, format)
		                    : array[i];
		            }
		            return output;
		        };
		    }

		    // format date using native date object
		    function formatMoment(m, format) {
		        if (!m.isValid()) {
		            return m.localeData().invalidDate();
		        }

		        format = expandFormat(format, m.localeData());
		        formatFunctions[format] =
		            formatFunctions[format] || makeFormatFunction(format);

		        return formatFunctions[format](m);
		    }

		    function expandFormat(format, locale) {
		        var i = 5;

		        function replaceLongDateFormatTokens(input) {
		            return locale.longDateFormat(input) || input;
		        }

		        localFormattingTokens.lastIndex = 0;
		        while (i >= 0 && localFormattingTokens.test(format)) {
		            format = format.replace(
		                localFormattingTokens,
		                replaceLongDateFormatTokens
		            );
		            localFormattingTokens.lastIndex = 0;
		            i -= 1;
		        }

		        return format;
		    }

		    var defaultLongDateFormat = {
		        LTS: 'h:mm:ss A',
		        LT: 'h:mm A',
		        L: 'MM/DD/YYYY',
		        LL: 'MMMM D, YYYY',
		        LLL: 'MMMM D, YYYY h:mm A',
		        LLLL: 'dddd, MMMM D, YYYY h:mm A',
		    };

		    function longDateFormat(key) {
		        var format = this._longDateFormat[key],
		            formatUpper = this._longDateFormat[key.toUpperCase()];

		        if (format || !formatUpper) {
		            return format;
		        }

		        this._longDateFormat[key] = formatUpper
		            .match(formattingTokens)
		            .map(function (tok) {
		                if (
		                    tok === 'MMMM' ||
		                    tok === 'MM' ||
		                    tok === 'DD' ||
		                    tok === 'dddd'
		                ) {
		                    return tok.slice(1);
		                }
		                return tok;
		            })
		            .join('');

		        return this._longDateFormat[key];
		    }

		    var defaultInvalidDate = 'Invalid date';

		    function invalidDate() {
		        return this._invalidDate;
		    }

		    var defaultOrdinal = '%d',
		        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

		    function ordinal(number) {
		        return this._ordinal.replace('%d', number);
		    }

		    var defaultRelativeTime = {
		        future: 'in %s',
		        past: '%s ago',
		        s: 'a few seconds',
		        ss: '%d seconds',
		        m: 'a minute',
		        mm: '%d minutes',
		        h: 'an hour',
		        hh: '%d hours',
		        d: 'a day',
		        dd: '%d days',
		        w: 'a week',
		        ww: '%d weeks',
		        M: 'a month',
		        MM: '%d months',
		        y: 'a year',
		        yy: '%d years',
		    };

		    function relativeTime(number, withoutSuffix, string, isFuture) {
		        var output = this._relativeTime[string];
		        return isFunction(output)
		            ? output(number, withoutSuffix, string, isFuture)
		            : output.replace(/%d/i, number);
		    }

		    function pastFuture(diff, output) {
		        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
		        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
		    }

		    var aliases = {};

		    function addUnitAlias(unit, shorthand) {
		        var lowerCase = unit.toLowerCase();
		        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
		    }

		    function normalizeUnits(units) {
		        return typeof units === 'string'
		            ? aliases[units] || aliases[units.toLowerCase()]
		            : undefined;
		    }

		    function normalizeObjectUnits(inputObject) {
		        var normalizedInput = {},
		            normalizedProp,
		            prop;

		        for (prop in inputObject) {
		            if (hasOwnProp(inputObject, prop)) {
		                normalizedProp = normalizeUnits(prop);
		                if (normalizedProp) {
		                    normalizedInput[normalizedProp] = inputObject[prop];
		                }
		            }
		        }

		        return normalizedInput;
		    }

		    var priorities = {};

		    function addUnitPriority(unit, priority) {
		        priorities[unit] = priority;
		    }

		    function getPrioritizedUnits(unitsObj) {
		        var units = [],
		            u;
		        for (u in unitsObj) {
		            if (hasOwnProp(unitsObj, u)) {
		                units.push({ unit: u, priority: priorities[u] });
		            }
		        }
		        units.sort(function (a, b) {
		            return a.priority - b.priority;
		        });
		        return units;
		    }

		    function isLeapYear(year) {
		        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
		    }

		    function absFloor(number) {
		        if (number < 0) {
		            // -0 -> 0
		            return Math.ceil(number) || 0;
		        } else {
		            return Math.floor(number);
		        }
		    }

		    function toInt(argumentForCoercion) {
		        var coercedNumber = +argumentForCoercion,
		            value = 0;

		        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
		            value = absFloor(coercedNumber);
		        }

		        return value;
		    }

		    function makeGetSet(unit, keepTime) {
		        return function (value) {
		            if (value != null) {
		                set$1(this, unit, value);
		                hooks.updateOffset(this, keepTime);
		                return this;
		            } else {
		                return get(this, unit);
		            }
		        };
		    }

		    function get(mom, unit) {
		        return mom.isValid()
		            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
		            : NaN;
		    }

		    function set$1(mom, unit, value) {
		        if (mom.isValid() && !isNaN(value)) {
		            if (
		                unit === 'FullYear' &&
		                isLeapYear(mom.year()) &&
		                mom.month() === 1 &&
		                mom.date() === 29
		            ) {
		                value = toInt(value);
		                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
		                    value,
		                    mom.month(),
		                    daysInMonth(value, mom.month())
		                );
		            } else {
		                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
		            }
		        }
		    }

		    // MOMENTS

		    function stringGet(units) {
		        units = normalizeUnits(units);
		        if (isFunction(this[units])) {
		            return this[units]();
		        }
		        return this;
		    }

		    function stringSet(units, value) {
		        if (typeof units === 'object') {
		            units = normalizeObjectUnits(units);
		            var prioritized = getPrioritizedUnits(units),
		                i,
		                prioritizedLen = prioritized.length;
		            for (i = 0; i < prioritizedLen; i++) {
		                this[prioritized[i].unit](units[prioritized[i].unit]);
		            }
		        } else {
		            units = normalizeUnits(units);
		            if (isFunction(this[units])) {
		                return this[units](value);
		            }
		        }
		        return this;
		    }

		    var match1 = /\d/, //       0 - 9
		        match2 = /\d\d/, //      00 - 99
		        match3 = /\d{3}/, //     000 - 999
		        match4 = /\d{4}/, //    0000 - 9999
		        match6 = /[+-]?\d{6}/, // -999999 - 999999
		        match1to2 = /\d\d?/, //       0 - 99
		        match3to4 = /\d\d\d\d?/, //     999 - 9999
		        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
		        match1to3 = /\d{1,3}/, //       0 - 999
		        match1to4 = /\d{1,4}/, //       0 - 9999
		        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
		        matchUnsigned = /\d+/, //       0 - inf
		        matchSigned = /[+-]?\d+/, //    -inf - inf
		        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
		        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
		        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
		        // any word (or two) characters or numbers including two/three word month in arabic.
		        // includes scottish gaelic two word and hyphenated months
		        matchWord =
		            /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
		        regexes;

		    regexes = {};

		    function addRegexToken(token, regex, strictRegex) {
		        regexes[token] = isFunction(regex)
		            ? regex
		            : function (isStrict, localeData) {
		                  return isStrict && strictRegex ? strictRegex : regex;
		              };
		    }

		    function getParseRegexForToken(token, config) {
		        if (!hasOwnProp(regexes, token)) {
		            return new RegExp(unescapeFormat(token));
		        }

		        return regexes[token](config._strict, config._locale);
		    }

		    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
		    function unescapeFormat(s) {
		        return regexEscape(
		            s
		                .replace('\\', '')
		                .replace(
		                    /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
		                    function (matched, p1, p2, p3, p4) {
		                        return p1 || p2 || p3 || p4;
		                    }
		                )
		        );
		    }

		    function regexEscape(s) {
		        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		    }

		    var tokens = {};

		    function addParseToken(token, callback) {
		        var i,
		            func = callback,
		            tokenLen;
		        if (typeof token === 'string') {
		            token = [token];
		        }
		        if (isNumber(callback)) {
		            func = function (input, array) {
		                array[callback] = toInt(input);
		            };
		        }
		        tokenLen = token.length;
		        for (i = 0; i < tokenLen; i++) {
		            tokens[token[i]] = func;
		        }
		    }

		    function addWeekParseToken(token, callback) {
		        addParseToken(token, function (input, array, config, token) {
		            config._w = config._w || {};
		            callback(input, config._w, config, token);
		        });
		    }

		    function addTimeToArrayFromToken(token, input, config) {
		        if (input != null && hasOwnProp(tokens, token)) {
		            tokens[token](input, config._a, config, token);
		        }
		    }

		    var YEAR = 0,
		        MONTH = 1,
		        DATE = 2,
		        HOUR = 3,
		        MINUTE = 4,
		        SECOND = 5,
		        MILLISECOND = 6,
		        WEEK = 7,
		        WEEKDAY = 8;

		    function mod(n, x) {
		        return ((n % x) + x) % x;
		    }

		    var indexOf;

		    if (Array.prototype.indexOf) {
		        indexOf = Array.prototype.indexOf;
		    } else {
		        indexOf = function (o) {
		            // I know
		            var i;
		            for (i = 0; i < this.length; ++i) {
		                if (this[i] === o) {
		                    return i;
		                }
		            }
		            return -1;
		        };
		    }

		    function daysInMonth(year, month) {
		        if (isNaN(year) || isNaN(month)) {
		            return NaN;
		        }
		        var modMonth = mod(month, 12);
		        year += (month - modMonth) / 12;
		        return modMonth === 1
		            ? isLeapYear(year)
		                ? 29
		                : 28
		            : 31 - ((modMonth % 7) % 2);
		    }

		    // FORMATTING

		    addFormatToken('M', ['MM', 2], 'Mo', function () {
		        return this.month() + 1;
		    });

		    addFormatToken('MMM', 0, 0, function (format) {
		        return this.localeData().monthsShort(this, format);
		    });

		    addFormatToken('MMMM', 0, 0, function (format) {
		        return this.localeData().months(this, format);
		    });

		    // ALIASES

		    addUnitAlias('month', 'M');

		    // PRIORITY

		    addUnitPriority('month', 8);

		    // PARSING

		    addRegexToken('M', match1to2);
		    addRegexToken('MM', match1to2, match2);
		    addRegexToken('MMM', function (isStrict, locale) {
		        return locale.monthsShortRegex(isStrict);
		    });
		    addRegexToken('MMMM', function (isStrict, locale) {
		        return locale.monthsRegex(isStrict);
		    });

		    addParseToken(['M', 'MM'], function (input, array) {
		        array[MONTH] = toInt(input) - 1;
		    });

		    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
		        var month = config._locale.monthsParse(input, token, config._strict);
		        // if we didn't find a month name, mark the date as invalid.
		        if (month != null) {
		            array[MONTH] = month;
		        } else {
		            getParsingFlags(config).invalidMonth = input;
		        }
		    });

		    // LOCALES

		    var defaultLocaleMonths =
		            'January_February_March_April_May_June_July_August_September_October_November_December'.split(
		                '_'
		            ),
		        defaultLocaleMonthsShort =
		            'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
		        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
		        defaultMonthsShortRegex = matchWord,
		        defaultMonthsRegex = matchWord;

		    function localeMonths(m, format) {
		        if (!m) {
		            return isArray(this._months)
		                ? this._months
		                : this._months['standalone'];
		        }
		        return isArray(this._months)
		            ? this._months[m.month()]
		            : this._months[
		                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
		                      ? 'format'
		                      : 'standalone'
		              ][m.month()];
		    }

		    function localeMonthsShort(m, format) {
		        if (!m) {
		            return isArray(this._monthsShort)
		                ? this._monthsShort
		                : this._monthsShort['standalone'];
		        }
		        return isArray(this._monthsShort)
		            ? this._monthsShort[m.month()]
		            : this._monthsShort[
		                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
		              ][m.month()];
		    }

		    function handleStrictParse(monthName, format, strict) {
		        var i,
		            ii,
		            mom,
		            llc = monthName.toLocaleLowerCase();
		        if (!this._monthsParse) {
		            // this is not used
		            this._monthsParse = [];
		            this._longMonthsParse = [];
		            this._shortMonthsParse = [];
		            for (i = 0; i < 12; ++i) {
		                mom = createUTC([2000, i]);
		                this._shortMonthsParse[i] = this.monthsShort(
		                    mom,
		                    ''
		                ).toLocaleLowerCase();
		                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
		            }
		        }

		        if (strict) {
		            if (format === 'MMM') {
		                ii = indexOf.call(this._shortMonthsParse, llc);
		                return ii !== -1 ? ii : null;
		            } else {
		                ii = indexOf.call(this._longMonthsParse, llc);
		                return ii !== -1 ? ii : null;
		            }
		        } else {
		            if (format === 'MMM') {
		                ii = indexOf.call(this._shortMonthsParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._longMonthsParse, llc);
		                return ii !== -1 ? ii : null;
		            } else {
		                ii = indexOf.call(this._longMonthsParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._shortMonthsParse, llc);
		                return ii !== -1 ? ii : null;
		            }
		        }
		    }

		    function localeMonthsParse(monthName, format, strict) {
		        var i, mom, regex;

		        if (this._monthsParseExact) {
		            return handleStrictParse.call(this, monthName, format, strict);
		        }

		        if (!this._monthsParse) {
		            this._monthsParse = [];
		            this._longMonthsParse = [];
		            this._shortMonthsParse = [];
		        }

		        // TODO: add sorting
		        // Sorting makes sure if one month (or abbr) is a prefix of another
		        // see sorting in computeMonthsParse
		        for (i = 0; i < 12; i++) {
		            // make the regex if we don't have it already
		            mom = createUTC([2000, i]);
		            if (strict && !this._longMonthsParse[i]) {
		                this._longMonthsParse[i] = new RegExp(
		                    '^' + this.months(mom, '').replace('.', '') + '$',
		                    'i'
		                );
		                this._shortMonthsParse[i] = new RegExp(
		                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
		                    'i'
		                );
		            }
		            if (!strict && !this._monthsParse[i]) {
		                regex =
		                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
		                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
		            }
		            // test the regex
		            if (
		                strict &&
		                format === 'MMMM' &&
		                this._longMonthsParse[i].test(monthName)
		            ) {
		                return i;
		            } else if (
		                strict &&
		                format === 'MMM' &&
		                this._shortMonthsParse[i].test(monthName)
		            ) {
		                return i;
		            } else if (!strict && this._monthsParse[i].test(monthName)) {
		                return i;
		            }
		        }
		    }

		    // MOMENTS

		    function setMonth(mom, value) {
		        var dayOfMonth;

		        if (!mom.isValid()) {
		            // No op
		            return mom;
		        }

		        if (typeof value === 'string') {
		            if (/^\d+$/.test(value)) {
		                value = toInt(value);
		            } else {
		                value = mom.localeData().monthsParse(value);
		                // TODO: Another silent failure?
		                if (!isNumber(value)) {
		                    return mom;
		                }
		            }
		        }

		        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
		        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
		        return mom;
		    }

		    function getSetMonth(value) {
		        if (value != null) {
		            setMonth(this, value);
		            hooks.updateOffset(this, true);
		            return this;
		        } else {
		            return get(this, 'Month');
		        }
		    }

		    function getDaysInMonth() {
		        return daysInMonth(this.year(), this.month());
		    }

		    function monthsShortRegex(isStrict) {
		        if (this._monthsParseExact) {
		            if (!hasOwnProp(this, '_monthsRegex')) {
		                computeMonthsParse.call(this);
		            }
		            if (isStrict) {
		                return this._monthsShortStrictRegex;
		            } else {
		                return this._monthsShortRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_monthsShortRegex')) {
		                this._monthsShortRegex = defaultMonthsShortRegex;
		            }
		            return this._monthsShortStrictRegex && isStrict
		                ? this._monthsShortStrictRegex
		                : this._monthsShortRegex;
		        }
		    }

		    function monthsRegex(isStrict) {
		        if (this._monthsParseExact) {
		            if (!hasOwnProp(this, '_monthsRegex')) {
		                computeMonthsParse.call(this);
		            }
		            if (isStrict) {
		                return this._monthsStrictRegex;
		            } else {
		                return this._monthsRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_monthsRegex')) {
		                this._monthsRegex = defaultMonthsRegex;
		            }
		            return this._monthsStrictRegex && isStrict
		                ? this._monthsStrictRegex
		                : this._monthsRegex;
		        }
		    }

		    function computeMonthsParse() {
		        function cmpLenRev(a, b) {
		            return b.length - a.length;
		        }

		        var shortPieces = [],
		            longPieces = [],
		            mixedPieces = [],
		            i,
		            mom;
		        for (i = 0; i < 12; i++) {
		            // make the regex if we don't have it already
		            mom = createUTC([2000, i]);
		            shortPieces.push(this.monthsShort(mom, ''));
		            longPieces.push(this.months(mom, ''));
		            mixedPieces.push(this.months(mom, ''));
		            mixedPieces.push(this.monthsShort(mom, ''));
		        }
		        // Sorting makes sure if one month (or abbr) is a prefix of another it
		        // will match the longer piece.
		        shortPieces.sort(cmpLenRev);
		        longPieces.sort(cmpLenRev);
		        mixedPieces.sort(cmpLenRev);
		        for (i = 0; i < 12; i++) {
		            shortPieces[i] = regexEscape(shortPieces[i]);
		            longPieces[i] = regexEscape(longPieces[i]);
		        }
		        for (i = 0; i < 24; i++) {
		            mixedPieces[i] = regexEscape(mixedPieces[i]);
		        }

		        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
		        this._monthsShortRegex = this._monthsRegex;
		        this._monthsStrictRegex = new RegExp(
		            '^(' + longPieces.join('|') + ')',
		            'i'
		        );
		        this._monthsShortStrictRegex = new RegExp(
		            '^(' + shortPieces.join('|') + ')',
		            'i'
		        );
		    }

		    // FORMATTING

		    addFormatToken('Y', 0, 0, function () {
		        var y = this.year();
		        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
		    });

		    addFormatToken(0, ['YY', 2], 0, function () {
		        return this.year() % 100;
		    });

		    addFormatToken(0, ['YYYY', 4], 0, 'year');
		    addFormatToken(0, ['YYYYY', 5], 0, 'year');
		    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

		    // ALIASES

		    addUnitAlias('year', 'y');

		    // PRIORITIES

		    addUnitPriority('year', 1);

		    // PARSING

		    addRegexToken('Y', matchSigned);
		    addRegexToken('YY', match1to2, match2);
		    addRegexToken('YYYY', match1to4, match4);
		    addRegexToken('YYYYY', match1to6, match6);
		    addRegexToken('YYYYYY', match1to6, match6);

		    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
		    addParseToken('YYYY', function (input, array) {
		        array[YEAR] =
		            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
		    });
		    addParseToken('YY', function (input, array) {
		        array[YEAR] = hooks.parseTwoDigitYear(input);
		    });
		    addParseToken('Y', function (input, array) {
		        array[YEAR] = parseInt(input, 10);
		    });

		    // HELPERS

		    function daysInYear(year) {
		        return isLeapYear(year) ? 366 : 365;
		    }

		    // HOOKS

		    hooks.parseTwoDigitYear = function (input) {
		        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
		    };

		    // MOMENTS

		    var getSetYear = makeGetSet('FullYear', true);

		    function getIsLeapYear() {
		        return isLeapYear(this.year());
		    }

		    function createDate(y, m, d, h, M, s, ms) {
		        // can't just apply() to create a date:
		        // https://stackoverflow.com/q/181348
		        var date;
		        // the date constructor remaps years 0-99 to 1900-1999
		        if (y < 100 && y >= 0) {
		            // preserve leap years using a full 400 year cycle, then reset
		            date = new Date(y + 400, m, d, h, M, s, ms);
		            if (isFinite(date.getFullYear())) {
		                date.setFullYear(y);
		            }
		        } else {
		            date = new Date(y, m, d, h, M, s, ms);
		        }

		        return date;
		    }

		    function createUTCDate(y) {
		        var date, args;
		        // the Date.UTC function remaps years 0-99 to 1900-1999
		        if (y < 100 && y >= 0) {
		            args = Array.prototype.slice.call(arguments);
		            // preserve leap years using a full 400 year cycle, then reset
		            args[0] = y + 400;
		            date = new Date(Date.UTC.apply(null, args));
		            if (isFinite(date.getUTCFullYear())) {
		                date.setUTCFullYear(y);
		            }
		        } else {
		            date = new Date(Date.UTC.apply(null, arguments));
		        }

		        return date;
		    }

		    // start-of-first-week - start-of-year
		    function firstWeekOffset(year, dow, doy) {
		        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
		            fwd = 7 + dow - doy,
		            // first-week day local weekday -- which local weekday is fwd
		            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

		        return -fwdlw + fwd - 1;
		    }

		    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
		    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
		        var localWeekday = (7 + weekday - dow) % 7,
		            weekOffset = firstWeekOffset(year, dow, doy),
		            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
		            resYear,
		            resDayOfYear;

		        if (dayOfYear <= 0) {
		            resYear = year - 1;
		            resDayOfYear = daysInYear(resYear) + dayOfYear;
		        } else if (dayOfYear > daysInYear(year)) {
		            resYear = year + 1;
		            resDayOfYear = dayOfYear - daysInYear(year);
		        } else {
		            resYear = year;
		            resDayOfYear = dayOfYear;
		        }

		        return {
		            year: resYear,
		            dayOfYear: resDayOfYear,
		        };
		    }

		    function weekOfYear(mom, dow, doy) {
		        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
		            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
		            resWeek,
		            resYear;

		        if (week < 1) {
		            resYear = mom.year() - 1;
		            resWeek = week + weeksInYear(resYear, dow, doy);
		        } else if (week > weeksInYear(mom.year(), dow, doy)) {
		            resWeek = week - weeksInYear(mom.year(), dow, doy);
		            resYear = mom.year() + 1;
		        } else {
		            resYear = mom.year();
		            resWeek = week;
		        }

		        return {
		            week: resWeek,
		            year: resYear,
		        };
		    }

		    function weeksInYear(year, dow, doy) {
		        var weekOffset = firstWeekOffset(year, dow, doy),
		            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
		        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
		    }

		    // FORMATTING

		    addFormatToken('w', ['ww', 2], 'wo', 'week');
		    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

		    // ALIASES

		    addUnitAlias('week', 'w');
		    addUnitAlias('isoWeek', 'W');

		    // PRIORITIES

		    addUnitPriority('week', 5);
		    addUnitPriority('isoWeek', 5);

		    // PARSING

		    addRegexToken('w', match1to2);
		    addRegexToken('ww', match1to2, match2);
		    addRegexToken('W', match1to2);
		    addRegexToken('WW', match1to2, match2);

		    addWeekParseToken(
		        ['w', 'ww', 'W', 'WW'],
		        function (input, week, config, token) {
		            week[token.substr(0, 1)] = toInt(input);
		        }
		    );

		    // HELPERS

		    // LOCALES

		    function localeWeek(mom) {
		        return weekOfYear(mom, this._week.dow, this._week.doy).week;
		    }

		    var defaultLocaleWeek = {
		        dow: 0, // Sunday is the first day of the week.
		        doy: 6, // The week that contains Jan 6th is the first week of the year.
		    };

		    function localeFirstDayOfWeek() {
		        return this._week.dow;
		    }

		    function localeFirstDayOfYear() {
		        return this._week.doy;
		    }

		    // MOMENTS

		    function getSetWeek(input) {
		        var week = this.localeData().week(this);
		        return input == null ? week : this.add((input - week) * 7, 'd');
		    }

		    function getSetISOWeek(input) {
		        var week = weekOfYear(this, 1, 4).week;
		        return input == null ? week : this.add((input - week) * 7, 'd');
		    }

		    // FORMATTING

		    addFormatToken('d', 0, 'do', 'day');

		    addFormatToken('dd', 0, 0, function (format) {
		        return this.localeData().weekdaysMin(this, format);
		    });

		    addFormatToken('ddd', 0, 0, function (format) {
		        return this.localeData().weekdaysShort(this, format);
		    });

		    addFormatToken('dddd', 0, 0, function (format) {
		        return this.localeData().weekdays(this, format);
		    });

		    addFormatToken('e', 0, 0, 'weekday');
		    addFormatToken('E', 0, 0, 'isoWeekday');

		    // ALIASES

		    addUnitAlias('day', 'd');
		    addUnitAlias('weekday', 'e');
		    addUnitAlias('isoWeekday', 'E');

		    // PRIORITY
		    addUnitPriority('day', 11);
		    addUnitPriority('weekday', 11);
		    addUnitPriority('isoWeekday', 11);

		    // PARSING

		    addRegexToken('d', match1to2);
		    addRegexToken('e', match1to2);
		    addRegexToken('E', match1to2);
		    addRegexToken('dd', function (isStrict, locale) {
		        return locale.weekdaysMinRegex(isStrict);
		    });
		    addRegexToken('ddd', function (isStrict, locale) {
		        return locale.weekdaysShortRegex(isStrict);
		    });
		    addRegexToken('dddd', function (isStrict, locale) {
		        return locale.weekdaysRegex(isStrict);
		    });

		    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
		        var weekday = config._locale.weekdaysParse(input, token, config._strict);
		        // if we didn't get a weekday name, mark the date as invalid
		        if (weekday != null) {
		            week.d = weekday;
		        } else {
		            getParsingFlags(config).invalidWeekday = input;
		        }
		    });

		    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
		        week[token] = toInt(input);
		    });

		    // HELPERS

		    function parseWeekday(input, locale) {
		        if (typeof input !== 'string') {
		            return input;
		        }

		        if (!isNaN(input)) {
		            return parseInt(input, 10);
		        }

		        input = locale.weekdaysParse(input);
		        if (typeof input === 'number') {
		            return input;
		        }

		        return null;
		    }

		    function parseIsoWeekday(input, locale) {
		        if (typeof input === 'string') {
		            return locale.weekdaysParse(input) % 7 || 7;
		        }
		        return isNaN(input) ? null : input;
		    }

		    // LOCALES
		    function shiftWeekdays(ws, n) {
		        return ws.slice(n, 7).concat(ws.slice(0, n));
		    }

		    var defaultLocaleWeekdays =
		            'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
		        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
		        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
		        defaultWeekdaysRegex = matchWord,
		        defaultWeekdaysShortRegex = matchWord,
		        defaultWeekdaysMinRegex = matchWord;

		    function localeWeekdays(m, format) {
		        var weekdays = isArray(this._weekdays)
		            ? this._weekdays
		            : this._weekdays[
		                  m && m !== true && this._weekdays.isFormat.test(format)
		                      ? 'format'
		                      : 'standalone'
		              ];
		        return m === true
		            ? shiftWeekdays(weekdays, this._week.dow)
		            : m
		            ? weekdays[m.day()]
		            : weekdays;
		    }

		    function localeWeekdaysShort(m) {
		        return m === true
		            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
		            : m
		            ? this._weekdaysShort[m.day()]
		            : this._weekdaysShort;
		    }

		    function localeWeekdaysMin(m) {
		        return m === true
		            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
		            : m
		            ? this._weekdaysMin[m.day()]
		            : this._weekdaysMin;
		    }

		    function handleStrictParse$1(weekdayName, format, strict) {
		        var i,
		            ii,
		            mom,
		            llc = weekdayName.toLocaleLowerCase();
		        if (!this._weekdaysParse) {
		            this._weekdaysParse = [];
		            this._shortWeekdaysParse = [];
		            this._minWeekdaysParse = [];

		            for (i = 0; i < 7; ++i) {
		                mom = createUTC([2000, 1]).day(i);
		                this._minWeekdaysParse[i] = this.weekdaysMin(
		                    mom,
		                    ''
		                ).toLocaleLowerCase();
		                this._shortWeekdaysParse[i] = this.weekdaysShort(
		                    mom,
		                    ''
		                ).toLocaleLowerCase();
		                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
		            }
		        }

		        if (strict) {
		            if (format === 'dddd') {
		                ii = indexOf.call(this._weekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            } else if (format === 'ddd') {
		                ii = indexOf.call(this._shortWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            } else {
		                ii = indexOf.call(this._minWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            }
		        } else {
		            if (format === 'dddd') {
		                ii = indexOf.call(this._weekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._shortWeekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._minWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            } else if (format === 'ddd') {
		                ii = indexOf.call(this._shortWeekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._weekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._minWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            } else {
		                ii = indexOf.call(this._minWeekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._weekdaysParse, llc);
		                if (ii !== -1) {
		                    return ii;
		                }
		                ii = indexOf.call(this._shortWeekdaysParse, llc);
		                return ii !== -1 ? ii : null;
		            }
		        }
		    }

		    function localeWeekdaysParse(weekdayName, format, strict) {
		        var i, mom, regex;

		        if (this._weekdaysParseExact) {
		            return handleStrictParse$1.call(this, weekdayName, format, strict);
		        }

		        if (!this._weekdaysParse) {
		            this._weekdaysParse = [];
		            this._minWeekdaysParse = [];
		            this._shortWeekdaysParse = [];
		            this._fullWeekdaysParse = [];
		        }

		        for (i = 0; i < 7; i++) {
		            // make the regex if we don't have it already

		            mom = createUTC([2000, 1]).day(i);
		            if (strict && !this._fullWeekdaysParse[i]) {
		                this._fullWeekdaysParse[i] = new RegExp(
		                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
		                    'i'
		                );
		                this._shortWeekdaysParse[i] = new RegExp(
		                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
		                    'i'
		                );
		                this._minWeekdaysParse[i] = new RegExp(
		                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
		                    'i'
		                );
		            }
		            if (!this._weekdaysParse[i]) {
		                regex =
		                    '^' +
		                    this.weekdays(mom, '') +
		                    '|^' +
		                    this.weekdaysShort(mom, '') +
		                    '|^' +
		                    this.weekdaysMin(mom, '');
		                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
		            }
		            // test the regex
		            if (
		                strict &&
		                format === 'dddd' &&
		                this._fullWeekdaysParse[i].test(weekdayName)
		            ) {
		                return i;
		            } else if (
		                strict &&
		                format === 'ddd' &&
		                this._shortWeekdaysParse[i].test(weekdayName)
		            ) {
		                return i;
		            } else if (
		                strict &&
		                format === 'dd' &&
		                this._minWeekdaysParse[i].test(weekdayName)
		            ) {
		                return i;
		            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
		                return i;
		            }
		        }
		    }

		    // MOMENTS

		    function getSetDayOfWeek(input) {
		        if (!this.isValid()) {
		            return input != null ? this : NaN;
		        }
		        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
		        if (input != null) {
		            input = parseWeekday(input, this.localeData());
		            return this.add(input - day, 'd');
		        } else {
		            return day;
		        }
		    }

		    function getSetLocaleDayOfWeek(input) {
		        if (!this.isValid()) {
		            return input != null ? this : NaN;
		        }
		        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
		        return input == null ? weekday : this.add(input - weekday, 'd');
		    }

		    function getSetISODayOfWeek(input) {
		        if (!this.isValid()) {
		            return input != null ? this : NaN;
		        }

		        // behaves the same as moment#day except
		        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
		        // as a setter, sunday should belong to the previous week.

		        if (input != null) {
		            var weekday = parseIsoWeekday(input, this.localeData());
		            return this.day(this.day() % 7 ? weekday : weekday - 7);
		        } else {
		            return this.day() || 7;
		        }
		    }

		    function weekdaysRegex(isStrict) {
		        if (this._weekdaysParseExact) {
		            if (!hasOwnProp(this, '_weekdaysRegex')) {
		                computeWeekdaysParse.call(this);
		            }
		            if (isStrict) {
		                return this._weekdaysStrictRegex;
		            } else {
		                return this._weekdaysRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_weekdaysRegex')) {
		                this._weekdaysRegex = defaultWeekdaysRegex;
		            }
		            return this._weekdaysStrictRegex && isStrict
		                ? this._weekdaysStrictRegex
		                : this._weekdaysRegex;
		        }
		    }

		    function weekdaysShortRegex(isStrict) {
		        if (this._weekdaysParseExact) {
		            if (!hasOwnProp(this, '_weekdaysRegex')) {
		                computeWeekdaysParse.call(this);
		            }
		            if (isStrict) {
		                return this._weekdaysShortStrictRegex;
		            } else {
		                return this._weekdaysShortRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
		                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
		            }
		            return this._weekdaysShortStrictRegex && isStrict
		                ? this._weekdaysShortStrictRegex
		                : this._weekdaysShortRegex;
		        }
		    }

		    function weekdaysMinRegex(isStrict) {
		        if (this._weekdaysParseExact) {
		            if (!hasOwnProp(this, '_weekdaysRegex')) {
		                computeWeekdaysParse.call(this);
		            }
		            if (isStrict) {
		                return this._weekdaysMinStrictRegex;
		            } else {
		                return this._weekdaysMinRegex;
		            }
		        } else {
		            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
		                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
		            }
		            return this._weekdaysMinStrictRegex && isStrict
		                ? this._weekdaysMinStrictRegex
		                : this._weekdaysMinRegex;
		        }
		    }

		    function computeWeekdaysParse() {
		        function cmpLenRev(a, b) {
		            return b.length - a.length;
		        }

		        var minPieces = [],
		            shortPieces = [],
		            longPieces = [],
		            mixedPieces = [],
		            i,
		            mom,
		            minp,
		            shortp,
		            longp;
		        for (i = 0; i < 7; i++) {
		            // make the regex if we don't have it already
		            mom = createUTC([2000, 1]).day(i);
		            minp = regexEscape(this.weekdaysMin(mom, ''));
		            shortp = regexEscape(this.weekdaysShort(mom, ''));
		            longp = regexEscape(this.weekdays(mom, ''));
		            minPieces.push(minp);
		            shortPieces.push(shortp);
		            longPieces.push(longp);
		            mixedPieces.push(minp);
		            mixedPieces.push(shortp);
		            mixedPieces.push(longp);
		        }
		        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
		        // will match the longer piece.
		        minPieces.sort(cmpLenRev);
		        shortPieces.sort(cmpLenRev);
		        longPieces.sort(cmpLenRev);
		        mixedPieces.sort(cmpLenRev);

		        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
		        this._weekdaysShortRegex = this._weekdaysRegex;
		        this._weekdaysMinRegex = this._weekdaysRegex;

		        this._weekdaysStrictRegex = new RegExp(
		            '^(' + longPieces.join('|') + ')',
		            'i'
		        );
		        this._weekdaysShortStrictRegex = new RegExp(
		            '^(' + shortPieces.join('|') + ')',
		            'i'
		        );
		        this._weekdaysMinStrictRegex = new RegExp(
		            '^(' + minPieces.join('|') + ')',
		            'i'
		        );
		    }

		    // FORMATTING

		    function hFormat() {
		        return this.hours() % 12 || 12;
		    }

		    function kFormat() {
		        return this.hours() || 24;
		    }

		    addFormatToken('H', ['HH', 2], 0, 'hour');
		    addFormatToken('h', ['hh', 2], 0, hFormat);
		    addFormatToken('k', ['kk', 2], 0, kFormat);

		    addFormatToken('hmm', 0, 0, function () {
		        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
		    });

		    addFormatToken('hmmss', 0, 0, function () {
		        return (
		            '' +
		            hFormat.apply(this) +
		            zeroFill(this.minutes(), 2) +
		            zeroFill(this.seconds(), 2)
		        );
		    });

		    addFormatToken('Hmm', 0, 0, function () {
		        return '' + this.hours() + zeroFill(this.minutes(), 2);
		    });

		    addFormatToken('Hmmss', 0, 0, function () {
		        return (
		            '' +
		            this.hours() +
		            zeroFill(this.minutes(), 2) +
		            zeroFill(this.seconds(), 2)
		        );
		    });

		    function meridiem(token, lowercase) {
		        addFormatToken(token, 0, 0, function () {
		            return this.localeData().meridiem(
		                this.hours(),
		                this.minutes(),
		                lowercase
		            );
		        });
		    }

		    meridiem('a', true);
		    meridiem('A', false);

		    // ALIASES

		    addUnitAlias('hour', 'h');

		    // PRIORITY
		    addUnitPriority('hour', 13);

		    // PARSING

		    function matchMeridiem(isStrict, locale) {
		        return locale._meridiemParse;
		    }

		    addRegexToken('a', matchMeridiem);
		    addRegexToken('A', matchMeridiem);
		    addRegexToken('H', match1to2);
		    addRegexToken('h', match1to2);
		    addRegexToken('k', match1to2);
		    addRegexToken('HH', match1to2, match2);
		    addRegexToken('hh', match1to2, match2);
		    addRegexToken('kk', match1to2, match2);

		    addRegexToken('hmm', match3to4);
		    addRegexToken('hmmss', match5to6);
		    addRegexToken('Hmm', match3to4);
		    addRegexToken('Hmmss', match5to6);

		    addParseToken(['H', 'HH'], HOUR);
		    addParseToken(['k', 'kk'], function (input, array, config) {
		        var kInput = toInt(input);
		        array[HOUR] = kInput === 24 ? 0 : kInput;
		    });
		    addParseToken(['a', 'A'], function (input, array, config) {
		        config._isPm = config._locale.isPM(input);
		        config._meridiem = input;
		    });
		    addParseToken(['h', 'hh'], function (input, array, config) {
		        array[HOUR] = toInt(input);
		        getParsingFlags(config).bigHour = true;
		    });
		    addParseToken('hmm', function (input, array, config) {
		        var pos = input.length - 2;
		        array[HOUR] = toInt(input.substr(0, pos));
		        array[MINUTE] = toInt(input.substr(pos));
		        getParsingFlags(config).bigHour = true;
		    });
		    addParseToken('hmmss', function (input, array, config) {
		        var pos1 = input.length - 4,
		            pos2 = input.length - 2;
		        array[HOUR] = toInt(input.substr(0, pos1));
		        array[MINUTE] = toInt(input.substr(pos1, 2));
		        array[SECOND] = toInt(input.substr(pos2));
		        getParsingFlags(config).bigHour = true;
		    });
		    addParseToken('Hmm', function (input, array, config) {
		        var pos = input.length - 2;
		        array[HOUR] = toInt(input.substr(0, pos));
		        array[MINUTE] = toInt(input.substr(pos));
		    });
		    addParseToken('Hmmss', function (input, array, config) {
		        var pos1 = input.length - 4,
		            pos2 = input.length - 2;
		        array[HOUR] = toInt(input.substr(0, pos1));
		        array[MINUTE] = toInt(input.substr(pos1, 2));
		        array[SECOND] = toInt(input.substr(pos2));
		    });

		    // LOCALES

		    function localeIsPM(input) {
		        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
		        // Using charAt should be more compatible.
		        return (input + '').toLowerCase().charAt(0) === 'p';
		    }

		    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
		        // Setting the hour should keep the time, because the user explicitly
		        // specified which hour they want. So trying to maintain the same hour (in
		        // a new timezone) makes sense. Adding/subtracting hours does not follow
		        // this rule.
		        getSetHour = makeGetSet('Hours', true);

		    function localeMeridiem(hours, minutes, isLower) {
		        if (hours > 11) {
		            return isLower ? 'pm' : 'PM';
		        } else {
		            return isLower ? 'am' : 'AM';
		        }
		    }

		    var baseConfig = {
		        calendar: defaultCalendar,
		        longDateFormat: defaultLongDateFormat,
		        invalidDate: defaultInvalidDate,
		        ordinal: defaultOrdinal,
		        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
		        relativeTime: defaultRelativeTime,

		        months: defaultLocaleMonths,
		        monthsShort: defaultLocaleMonthsShort,

		        week: defaultLocaleWeek,

		        weekdays: defaultLocaleWeekdays,
		        weekdaysMin: defaultLocaleWeekdaysMin,
		        weekdaysShort: defaultLocaleWeekdaysShort,

		        meridiemParse: defaultLocaleMeridiemParse,
		    };

		    // internal storage for locale config files
		    var locales = {},
		        localeFamilies = {},
		        globalLocale;

		    function commonPrefix(arr1, arr2) {
		        var i,
		            minl = Math.min(arr1.length, arr2.length);
		        for (i = 0; i < minl; i += 1) {
		            if (arr1[i] !== arr2[i]) {
		                return i;
		            }
		        }
		        return minl;
		    }

		    function normalizeLocale(key) {
		        return key ? key.toLowerCase().replace('_', '-') : key;
		    }

		    // pick the locale from the array
		    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
		    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
		    function chooseLocale(names) {
		        var i = 0,
		            j,
		            next,
		            locale,
		            split;

		        while (i < names.length) {
		            split = normalizeLocale(names[i]).split('-');
		            j = split.length;
		            next = normalizeLocale(names[i + 1]);
		            next = next ? next.split('-') : null;
		            while (j > 0) {
		                locale = loadLocale(split.slice(0, j).join('-'));
		                if (locale) {
		                    return locale;
		                }
		                if (
		                    next &&
		                    next.length >= j &&
		                    commonPrefix(split, next) >= j - 1
		                ) {
		                    //the next array item is better than a shallower substring of this one
		                    break;
		                }
		                j--;
		            }
		            i++;
		        }
		        return globalLocale;
		    }

		    function isLocaleNameSane(name) {
		        // Prevent names that look like filesystem paths, i.e contain '/' or '\'
		        return name.match('^[^/\\\\]*$') != null;
		    }

		    function loadLocale(name) {
		        var oldLocale = null,
		            aliasedRequire;
		        // TODO: Find a better way to register and load all the locales in Node
		        if (
		            locales[name] === undefined &&
		            'object' !== 'undefined' &&
		            module &&
		            module.exports &&
		            isLocaleNameSane(name)
		        ) {
		            try {
		                oldLocale = globalLocale._abbr;
		                aliasedRequire = commonjsRequire;
		                aliasedRequire('./locale/' + name);
		                getSetGlobalLocale(oldLocale);
		            } catch (e) {
		                // mark as not found to avoid repeating expensive file require call causing high CPU
		                // when trying to find en-US, en_US, en-us for every format call
		                locales[name] = null; // null means not found
		            }
		        }
		        return locales[name];
		    }

		    // This function will load locale and then set the global locale.  If
		    // no arguments are passed in, it will simply return the current global
		    // locale key.
		    function getSetGlobalLocale(key, values) {
		        var data;
		        if (key) {
		            if (isUndefined(values)) {
		                data = getLocale(key);
		            } else {
		                data = defineLocale(key, values);
		            }

		            if (data) {
		                // moment.duration._locale = moment._locale = data;
		                globalLocale = data;
		            } else {
		                if (typeof console !== 'undefined' && console.warn) {
		                    //warn user if arguments are passed but the locale could not be set
		                    console.warn(
		                        'Locale ' + key + ' not found. Did you forget to load it?'
		                    );
		                }
		            }
		        }

		        return globalLocale._abbr;
		    }

		    function defineLocale(name, config) {
		        if (config !== null) {
		            var locale,
		                parentConfig = baseConfig;
		            config.abbr = name;
		            if (locales[name] != null) {
		                deprecateSimple(
		                    'defineLocaleOverride',
		                    'use moment.updateLocale(localeName, config) to change ' +
		                        'an existing locale. moment.defineLocale(localeName, ' +
		                        'config) should only be used for creating a new locale ' +
		                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
		                );
		                parentConfig = locales[name]._config;
		            } else if (config.parentLocale != null) {
		                if (locales[config.parentLocale] != null) {
		                    parentConfig = locales[config.parentLocale]._config;
		                } else {
		                    locale = loadLocale(config.parentLocale);
		                    if (locale != null) {
		                        parentConfig = locale._config;
		                    } else {
		                        if (!localeFamilies[config.parentLocale]) {
		                            localeFamilies[config.parentLocale] = [];
		                        }
		                        localeFamilies[config.parentLocale].push({
		                            name: name,
		                            config: config,
		                        });
		                        return null;
		                    }
		                }
		            }
		            locales[name] = new Locale(mergeConfigs(parentConfig, config));

		            if (localeFamilies[name]) {
		                localeFamilies[name].forEach(function (x) {
		                    defineLocale(x.name, x.config);
		                });
		            }

		            // backwards compat for now: also set the locale
		            // make sure we set the locale AFTER all child locales have been
		            // created, so we won't end up with the child locale set.
		            getSetGlobalLocale(name);

		            return locales[name];
		        } else {
		            // useful for testing
		            delete locales[name];
		            return null;
		        }
		    }

		    function updateLocale(name, config) {
		        if (config != null) {
		            var locale,
		                tmpLocale,
		                parentConfig = baseConfig;

		            if (locales[name] != null && locales[name].parentLocale != null) {
		                // Update existing child locale in-place to avoid memory-leaks
		                locales[name].set(mergeConfigs(locales[name]._config, config));
		            } else {
		                // MERGE
		                tmpLocale = loadLocale(name);
		                if (tmpLocale != null) {
		                    parentConfig = tmpLocale._config;
		                }
		                config = mergeConfigs(parentConfig, config);
		                if (tmpLocale == null) {
		                    // updateLocale is called for creating a new locale
		                    // Set abbr so it will have a name (getters return
		                    // undefined otherwise).
		                    config.abbr = name;
		                }
		                locale = new Locale(config);
		                locale.parentLocale = locales[name];
		                locales[name] = locale;
		            }

		            // backwards compat for now: also set the locale
		            getSetGlobalLocale(name);
		        } else {
		            // pass null for config to unupdate, useful for tests
		            if (locales[name] != null) {
		                if (locales[name].parentLocale != null) {
		                    locales[name] = locales[name].parentLocale;
		                    if (name === getSetGlobalLocale()) {
		                        getSetGlobalLocale(name);
		                    }
		                } else if (locales[name] != null) {
		                    delete locales[name];
		                }
		            }
		        }
		        return locales[name];
		    }

		    // returns locale data
		    function getLocale(key) {
		        var locale;

		        if (key && key._locale && key._locale._abbr) {
		            key = key._locale._abbr;
		        }

		        if (!key) {
		            return globalLocale;
		        }

		        if (!isArray(key)) {
		            //short-circuit everything else
		            locale = loadLocale(key);
		            if (locale) {
		                return locale;
		            }
		            key = [key];
		        }

		        return chooseLocale(key);
		    }

		    function listLocales() {
		        return keys(locales);
		    }

		    function checkOverflow(m) {
		        var overflow,
		            a = m._a;

		        if (a && getParsingFlags(m).overflow === -2) {
		            overflow =
		                a[MONTH] < 0 || a[MONTH] > 11
		                    ? MONTH
		                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
		                    ? DATE
		                    : a[HOUR] < 0 ||
		                      a[HOUR] > 24 ||
		                      (a[HOUR] === 24 &&
		                          (a[MINUTE] !== 0 ||
		                              a[SECOND] !== 0 ||
		                              a[MILLISECOND] !== 0))
		                    ? HOUR
		                    : a[MINUTE] < 0 || a[MINUTE] > 59
		                    ? MINUTE
		                    : a[SECOND] < 0 || a[SECOND] > 59
		                    ? SECOND
		                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
		                    ? MILLISECOND
		                    : -1;

		            if (
		                getParsingFlags(m)._overflowDayOfYear &&
		                (overflow < YEAR || overflow > DATE)
		            ) {
		                overflow = DATE;
		            }
		            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
		                overflow = WEEK;
		            }
		            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
		                overflow = WEEKDAY;
		            }

		            getParsingFlags(m).overflow = overflow;
		        }

		        return m;
		    }

		    // iso 8601 regex
		    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
		    var extendedIsoRegex =
		            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
		        basicIsoRegex =
		            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
		        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
		        isoDates = [
		            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
		            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
		            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
		            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
		            ['YYYY-DDD', /\d{4}-\d{3}/],
		            ['YYYY-MM', /\d{4}-\d\d/, false],
		            ['YYYYYYMMDD', /[+-]\d{10}/],
		            ['YYYYMMDD', /\d{8}/],
		            ['GGGG[W]WWE', /\d{4}W\d{3}/],
		            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
		            ['YYYYDDD', /\d{7}/],
		            ['YYYYMM', /\d{6}/, false],
		            ['YYYY', /\d{4}/, false],
		        ],
		        // iso time formats and regexes
		        isoTimes = [
		            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
		            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
		            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
		            ['HH:mm', /\d\d:\d\d/],
		            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
		            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
		            ['HHmmss', /\d\d\d\d\d\d/],
		            ['HHmm', /\d\d\d\d/],
		            ['HH', /\d\d/],
		        ],
		        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
		        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
		        rfc2822 =
		            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
		        obsOffsets = {
		            UT: 0,
		            GMT: 0,
		            EDT: -4 * 60,
		            EST: -5 * 60,
		            CDT: -5 * 60,
		            CST: -6 * 60,
		            MDT: -6 * 60,
		            MST: -7 * 60,
		            PDT: -7 * 60,
		            PST: -8 * 60,
		        };

		    // date from iso format
		    function configFromISO(config) {
		        var i,
		            l,
		            string = config._i,
		            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
		            allowTime,
		            dateFormat,
		            timeFormat,
		            tzFormat,
		            isoDatesLen = isoDates.length,
		            isoTimesLen = isoTimes.length;

		        if (match) {
		            getParsingFlags(config).iso = true;
		            for (i = 0, l = isoDatesLen; i < l; i++) {
		                if (isoDates[i][1].exec(match[1])) {
		                    dateFormat = isoDates[i][0];
		                    allowTime = isoDates[i][2] !== false;
		                    break;
		                }
		            }
		            if (dateFormat == null) {
		                config._isValid = false;
		                return;
		            }
		            if (match[3]) {
		                for (i = 0, l = isoTimesLen; i < l; i++) {
		                    if (isoTimes[i][1].exec(match[3])) {
		                        // match[2] should be 'T' or space
		                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
		                        break;
		                    }
		                }
		                if (timeFormat == null) {
		                    config._isValid = false;
		                    return;
		                }
		            }
		            if (!allowTime && timeFormat != null) {
		                config._isValid = false;
		                return;
		            }
		            if (match[4]) {
		                if (tzRegex.exec(match[4])) {
		                    tzFormat = 'Z';
		                } else {
		                    config._isValid = false;
		                    return;
		                }
		            }
		            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
		            configFromStringAndFormat(config);
		        } else {
		            config._isValid = false;
		        }
		    }

		    function extractFromRFC2822Strings(
		        yearStr,
		        monthStr,
		        dayStr,
		        hourStr,
		        minuteStr,
		        secondStr
		    ) {
		        var result = [
		            untruncateYear(yearStr),
		            defaultLocaleMonthsShort.indexOf(monthStr),
		            parseInt(dayStr, 10),
		            parseInt(hourStr, 10),
		            parseInt(minuteStr, 10),
		        ];

		        if (secondStr) {
		            result.push(parseInt(secondStr, 10));
		        }

		        return result;
		    }

		    function untruncateYear(yearStr) {
		        var year = parseInt(yearStr, 10);
		        if (year <= 49) {
		            return 2000 + year;
		        } else if (year <= 999) {
		            return 1900 + year;
		        }
		        return year;
		    }

		    function preprocessRFC2822(s) {
		        // Remove comments and folding whitespace and replace multiple-spaces with a single space
		        return s
		            .replace(/\([^()]*\)|[\n\t]/g, ' ')
		            .replace(/(\s\s+)/g, ' ')
		            .replace(/^\s\s*/, '')
		            .replace(/\s\s*$/, '');
		    }

		    function checkWeekday(weekdayStr, parsedInput, config) {
		        if (weekdayStr) {
		            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
		            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
		                weekdayActual = new Date(
		                    parsedInput[0],
		                    parsedInput[1],
		                    parsedInput[2]
		                ).getDay();
		            if (weekdayProvided !== weekdayActual) {
		                getParsingFlags(config).weekdayMismatch = true;
		                config._isValid = false;
		                return false;
		            }
		        }
		        return true;
		    }

		    function calculateOffset(obsOffset, militaryOffset, numOffset) {
		        if (obsOffset) {
		            return obsOffsets[obsOffset];
		        } else if (militaryOffset) {
		            // the only allowed military tz is Z
		            return 0;
		        } else {
		            var hm = parseInt(numOffset, 10),
		                m = hm % 100,
		                h = (hm - m) / 100;
		            return h * 60 + m;
		        }
		    }

		    // date and time from ref 2822 format
		    function configFromRFC2822(config) {
		        var match = rfc2822.exec(preprocessRFC2822(config._i)),
		            parsedArray;
		        if (match) {
		            parsedArray = extractFromRFC2822Strings(
		                match[4],
		                match[3],
		                match[2],
		                match[5],
		                match[6],
		                match[7]
		            );
		            if (!checkWeekday(match[1], parsedArray, config)) {
		                return;
		            }

		            config._a = parsedArray;
		            config._tzm = calculateOffset(match[8], match[9], match[10]);

		            config._d = createUTCDate.apply(null, config._a);
		            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

		            getParsingFlags(config).rfc2822 = true;
		        } else {
		            config._isValid = false;
		        }
		    }

		    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
		    function configFromString(config) {
		        var matched = aspNetJsonRegex.exec(config._i);
		        if (matched !== null) {
		            config._d = new Date(+matched[1]);
		            return;
		        }

		        configFromISO(config);
		        if (config._isValid === false) {
		            delete config._isValid;
		        } else {
		            return;
		        }

		        configFromRFC2822(config);
		        if (config._isValid === false) {
		            delete config._isValid;
		        } else {
		            return;
		        }

		        if (config._strict) {
		            config._isValid = false;
		        } else {
		            // Final attempt, use Input Fallback
		            hooks.createFromInputFallback(config);
		        }
		    }

		    hooks.createFromInputFallback = deprecate(
		        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
		            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
		            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
		        function (config) {
		            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
		        }
		    );

		    // Pick the first defined of two or three arguments.
		    function defaults(a, b, c) {
		        if (a != null) {
		            return a;
		        }
		        if (b != null) {
		            return b;
		        }
		        return c;
		    }

		    function currentDateArray(config) {
		        // hooks is actually the exported moment object
		        var nowValue = new Date(hooks.now());
		        if (config._useUTC) {
		            return [
		                nowValue.getUTCFullYear(),
		                nowValue.getUTCMonth(),
		                nowValue.getUTCDate(),
		            ];
		        }
		        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
		    }

		    // convert an array to a date.
		    // the array should mirror the parameters below
		    // note: all values past the year are optional and will default to the lowest possible value.
		    // [year, month, day , hour, minute, second, millisecond]
		    function configFromArray(config) {
		        var i,
		            date,
		            input = [],
		            currentDate,
		            expectedWeekday,
		            yearToUse;

		        if (config._d) {
		            return;
		        }

		        currentDate = currentDateArray(config);

		        //compute day of the year from weeks and weekdays
		        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
		            dayOfYearFromWeekInfo(config);
		        }

		        //if the day of the year is set, figure out what it is
		        if (config._dayOfYear != null) {
		            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

		            if (
		                config._dayOfYear > daysInYear(yearToUse) ||
		                config._dayOfYear === 0
		            ) {
		                getParsingFlags(config)._overflowDayOfYear = true;
		            }

		            date = createUTCDate(yearToUse, 0, config._dayOfYear);
		            config._a[MONTH] = date.getUTCMonth();
		            config._a[DATE] = date.getUTCDate();
		        }

		        // Default to current date.
		        // * if no year, month, day of month are given, default to today
		        // * if day of month is given, default month and year
		        // * if month is given, default only year
		        // * if year is given, don't default anything
		        for (i = 0; i < 3 && config._a[i] == null; ++i) {
		            config._a[i] = input[i] = currentDate[i];
		        }

		        // Zero out whatever was not defaulted, including time
		        for (; i < 7; i++) {
		            config._a[i] = input[i] =
		                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
		        }

		        // Check for 24:00:00.000
		        if (
		            config._a[HOUR] === 24 &&
		            config._a[MINUTE] === 0 &&
		            config._a[SECOND] === 0 &&
		            config._a[MILLISECOND] === 0
		        ) {
		            config._nextDay = true;
		            config._a[HOUR] = 0;
		        }

		        config._d = (config._useUTC ? createUTCDate : createDate).apply(
		            null,
		            input
		        );
		        expectedWeekday = config._useUTC
		            ? config._d.getUTCDay()
		            : config._d.getDay();

		        // Apply timezone offset from input. The actual utcOffset can be changed
		        // with parseZone.
		        if (config._tzm != null) {
		            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
		        }

		        if (config._nextDay) {
		            config._a[HOUR] = 24;
		        }

		        // check for mismatching day of week
		        if (
		            config._w &&
		            typeof config._w.d !== 'undefined' &&
		            config._w.d !== expectedWeekday
		        ) {
		            getParsingFlags(config).weekdayMismatch = true;
		        }
		    }

		    function dayOfYearFromWeekInfo(config) {
		        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

		        w = config._w;
		        if (w.GG != null || w.W != null || w.E != null) {
		            dow = 1;
		            doy = 4;

		            // TODO: We need to take the current isoWeekYear, but that depends on
		            // how we interpret now (local, utc, fixed offset). So create
		            // a now version of current config (take local/utc/offset flags, and
		            // create now).
		            weekYear = defaults(
		                w.GG,
		                config._a[YEAR],
		                weekOfYear(createLocal(), 1, 4).year
		            );
		            week = defaults(w.W, 1);
		            weekday = defaults(w.E, 1);
		            if (weekday < 1 || weekday > 7) {
		                weekdayOverflow = true;
		            }
		        } else {
		            dow = config._locale._week.dow;
		            doy = config._locale._week.doy;

		            curWeek = weekOfYear(createLocal(), dow, doy);

		            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

		            // Default to current week.
		            week = defaults(w.w, curWeek.week);

		            if (w.d != null) {
		                // weekday -- low day numbers are considered next week
		                weekday = w.d;
		                if (weekday < 0 || weekday > 6) {
		                    weekdayOverflow = true;
		                }
		            } else if (w.e != null) {
		                // local weekday -- counting starts from beginning of week
		                weekday = w.e + dow;
		                if (w.e < 0 || w.e > 6) {
		                    weekdayOverflow = true;
		                }
		            } else {
		                // default to beginning of week
		                weekday = dow;
		            }
		        }
		        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
		            getParsingFlags(config)._overflowWeeks = true;
		        } else if (weekdayOverflow != null) {
		            getParsingFlags(config)._overflowWeekday = true;
		        } else {
		            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
		            config._a[YEAR] = temp.year;
		            config._dayOfYear = temp.dayOfYear;
		        }
		    }

		    // constant that refers to the ISO standard
		    hooks.ISO_8601 = function () {};

		    // constant that refers to the RFC 2822 form
		    hooks.RFC_2822 = function () {};

		    // date from string and format string
		    function configFromStringAndFormat(config) {
		        // TODO: Move this to another part of the creation flow to prevent circular deps
		        if (config._f === hooks.ISO_8601) {
		            configFromISO(config);
		            return;
		        }
		        if (config._f === hooks.RFC_2822) {
		            configFromRFC2822(config);
		            return;
		        }
		        config._a = [];
		        getParsingFlags(config).empty = true;

		        // This array is used to make a Date, either with `new Date` or `Date.UTC`
		        var string = '' + config._i,
		            i,
		            parsedInput,
		            tokens,
		            token,
		            skipped,
		            stringLength = string.length,
		            totalParsedInputLength = 0,
		            era,
		            tokenLen;

		        tokens =
		            expandFormat(config._f, config._locale).match(formattingTokens) || [];
		        tokenLen = tokens.length;
		        for (i = 0; i < tokenLen; i++) {
		            token = tokens[i];
		            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
		                [])[0];
		            if (parsedInput) {
		                skipped = string.substr(0, string.indexOf(parsedInput));
		                if (skipped.length > 0) {
		                    getParsingFlags(config).unusedInput.push(skipped);
		                }
		                string = string.slice(
		                    string.indexOf(parsedInput) + parsedInput.length
		                );
		                totalParsedInputLength += parsedInput.length;
		            }
		            // don't parse if it's not a known token
		            if (formatTokenFunctions[token]) {
		                if (parsedInput) {
		                    getParsingFlags(config).empty = false;
		                } else {
		                    getParsingFlags(config).unusedTokens.push(token);
		                }
		                addTimeToArrayFromToken(token, parsedInput, config);
		            } else if (config._strict && !parsedInput) {
		                getParsingFlags(config).unusedTokens.push(token);
		            }
		        }

		        // add remaining unparsed input length to the string
		        getParsingFlags(config).charsLeftOver =
		            stringLength - totalParsedInputLength;
		        if (string.length > 0) {
		            getParsingFlags(config).unusedInput.push(string);
		        }

		        // clear _12h flag if hour is <= 12
		        if (
		            config._a[HOUR] <= 12 &&
		            getParsingFlags(config).bigHour === true &&
		            config._a[HOUR] > 0
		        ) {
		            getParsingFlags(config).bigHour = undefined;
		        }

		        getParsingFlags(config).parsedDateParts = config._a.slice(0);
		        getParsingFlags(config).meridiem = config._meridiem;
		        // handle meridiem
		        config._a[HOUR] = meridiemFixWrap(
		            config._locale,
		            config._a[HOUR],
		            config._meridiem
		        );

		        // handle era
		        era = getParsingFlags(config).era;
		        if (era !== null) {
		            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
		        }

		        configFromArray(config);
		        checkOverflow(config);
		    }

		    function meridiemFixWrap(locale, hour, meridiem) {
		        var isPm;

		        if (meridiem == null) {
		            // nothing to do
		            return hour;
		        }
		        if (locale.meridiemHour != null) {
		            return locale.meridiemHour(hour, meridiem);
		        } else if (locale.isPM != null) {
		            // Fallback
		            isPm = locale.isPM(meridiem);
		            if (isPm && hour < 12) {
		                hour += 12;
		            }
		            if (!isPm && hour === 12) {
		                hour = 0;
		            }
		            return hour;
		        } else {
		            // this is not supposed to happen
		            return hour;
		        }
		    }

		    // date from string and array of format strings
		    function configFromStringAndArray(config) {
		        var tempConfig,
		            bestMoment,
		            scoreToBeat,
		            i,
		            currentScore,
		            validFormatFound,
		            bestFormatIsValid = false,
		            configfLen = config._f.length;

		        if (configfLen === 0) {
		            getParsingFlags(config).invalidFormat = true;
		            config._d = new Date(NaN);
		            return;
		        }

		        for (i = 0; i < configfLen; i++) {
		            currentScore = 0;
		            validFormatFound = false;
		            tempConfig = copyConfig({}, config);
		            if (config._useUTC != null) {
		                tempConfig._useUTC = config._useUTC;
		            }
		            tempConfig._f = config._f[i];
		            configFromStringAndFormat(tempConfig);

		            if (isValid(tempConfig)) {
		                validFormatFound = true;
		            }

		            // if there is any input that was not parsed add a penalty for that format
		            currentScore += getParsingFlags(tempConfig).charsLeftOver;

		            //or tokens
		            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

		            getParsingFlags(tempConfig).score = currentScore;

		            if (!bestFormatIsValid) {
		                if (
		                    scoreToBeat == null ||
		                    currentScore < scoreToBeat ||
		                    validFormatFound
		                ) {
		                    scoreToBeat = currentScore;
		                    bestMoment = tempConfig;
		                    if (validFormatFound) {
		                        bestFormatIsValid = true;
		                    }
		                }
		            } else {
		                if (currentScore < scoreToBeat) {
		                    scoreToBeat = currentScore;
		                    bestMoment = tempConfig;
		                }
		            }
		        }

		        extend(config, bestMoment || tempConfig);
		    }

		    function configFromObject(config) {
		        if (config._d) {
		            return;
		        }

		        var i = normalizeObjectUnits(config._i),
		            dayOrDate = i.day === undefined ? i.date : i.day;
		        config._a = map(
		            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
		            function (obj) {
		                return obj && parseInt(obj, 10);
		            }
		        );

		        configFromArray(config);
		    }

		    function createFromConfig(config) {
		        var res = new Moment(checkOverflow(prepareConfig(config)));
		        if (res._nextDay) {
		            // Adding is smart enough around DST
		            res.add(1, 'd');
		            res._nextDay = undefined;
		        }

		        return res;
		    }

		    function prepareConfig(config) {
		        var input = config._i,
		            format = config._f;

		        config._locale = config._locale || getLocale(config._l);

		        if (input === null || (format === undefined && input === '')) {
		            return createInvalid({ nullInput: true });
		        }

		        if (typeof input === 'string') {
		            config._i = input = config._locale.preparse(input);
		        }

		        if (isMoment(input)) {
		            return new Moment(checkOverflow(input));
		        } else if (isDate(input)) {
		            config._d = input;
		        } else if (isArray(format)) {
		            configFromStringAndArray(config);
		        } else if (format) {
		            configFromStringAndFormat(config);
		        } else {
		            configFromInput(config);
		        }

		        if (!isValid(config)) {
		            config._d = null;
		        }

		        return config;
		    }

		    function configFromInput(config) {
		        var input = config._i;
		        if (isUndefined(input)) {
		            config._d = new Date(hooks.now());
		        } else if (isDate(input)) {
		            config._d = new Date(input.valueOf());
		        } else if (typeof input === 'string') {
		            configFromString(config);
		        } else if (isArray(input)) {
		            config._a = map(input.slice(0), function (obj) {
		                return parseInt(obj, 10);
		            });
		            configFromArray(config);
		        } else if (isObject(input)) {
		            configFromObject(config);
		        } else if (isNumber(input)) {
		            // from milliseconds
		            config._d = new Date(input);
		        } else {
		            hooks.createFromInputFallback(config);
		        }
		    }

		    function createLocalOrUTC(input, format, locale, strict, isUTC) {
		        var c = {};

		        if (format === true || format === false) {
		            strict = format;
		            format = undefined;
		        }

		        if (locale === true || locale === false) {
		            strict = locale;
		            locale = undefined;
		        }

		        if (
		            (isObject(input) && isObjectEmpty(input)) ||
		            (isArray(input) && input.length === 0)
		        ) {
		            input = undefined;
		        }
		        // object construction must be done this way.
		        // https://github.com/moment/moment/issues/1423
		        c._isAMomentObject = true;
		        c._useUTC = c._isUTC = isUTC;
		        c._l = locale;
		        c._i = input;
		        c._f = format;
		        c._strict = strict;

		        return createFromConfig(c);
		    }

		    function createLocal(input, format, locale, strict) {
		        return createLocalOrUTC(input, format, locale, strict, false);
		    }

		    var prototypeMin = deprecate(
		            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
		            function () {
		                var other = createLocal.apply(null, arguments);
		                if (this.isValid() && other.isValid()) {
		                    return other < this ? this : other;
		                } else {
		                    return createInvalid();
		                }
		            }
		        ),
		        prototypeMax = deprecate(
		            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
		            function () {
		                var other = createLocal.apply(null, arguments);
		                if (this.isValid() && other.isValid()) {
		                    return other > this ? this : other;
		                } else {
		                    return createInvalid();
		                }
		            }
		        );

		    // Pick a moment m from moments so that m[fn](other) is true for all
		    // other. This relies on the function fn to be transitive.
		    //
		    // moments should either be an array of moment objects or an array, whose
		    // first element is an array of moment objects.
		    function pickBy(fn, moments) {
		        var res, i;
		        if (moments.length === 1 && isArray(moments[0])) {
		            moments = moments[0];
		        }
		        if (!moments.length) {
		            return createLocal();
		        }
		        res = moments[0];
		        for (i = 1; i < moments.length; ++i) {
		            if (!moments[i].isValid() || moments[i][fn](res)) {
		                res = moments[i];
		            }
		        }
		        return res;
		    }

		    // TODO: Use [].sort instead?
		    function min() {
		        var args = [].slice.call(arguments, 0);

		        return pickBy('isBefore', args);
		    }

		    function max() {
		        var args = [].slice.call(arguments, 0);

		        return pickBy('isAfter', args);
		    }

		    var now = function () {
		        return Date.now ? Date.now() : +new Date();
		    };

		    var ordering = [
		        'year',
		        'quarter',
		        'month',
		        'week',
		        'day',
		        'hour',
		        'minute',
		        'second',
		        'millisecond',
		    ];

		    function isDurationValid(m) {
		        var key,
		            unitHasDecimal = false,
		            i,
		            orderLen = ordering.length;
		        for (key in m) {
		            if (
		                hasOwnProp(m, key) &&
		                !(
		                    indexOf.call(ordering, key) !== -1 &&
		                    (m[key] == null || !isNaN(m[key]))
		                )
		            ) {
		                return false;
		            }
		        }

		        for (i = 0; i < orderLen; ++i) {
		            if (m[ordering[i]]) {
		                if (unitHasDecimal) {
		                    return false; // only allow non-integers for smallest unit
		                }
		                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
		                    unitHasDecimal = true;
		                }
		            }
		        }

		        return true;
		    }

		    function isValid$1() {
		        return this._isValid;
		    }

		    function createInvalid$1() {
		        return createDuration(NaN);
		    }

		    function Duration(duration) {
		        var normalizedInput = normalizeObjectUnits(duration),
		            years = normalizedInput.year || 0,
		            quarters = normalizedInput.quarter || 0,
		            months = normalizedInput.month || 0,
		            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
		            days = normalizedInput.day || 0,
		            hours = normalizedInput.hour || 0,
		            minutes = normalizedInput.minute || 0,
		            seconds = normalizedInput.second || 0,
		            milliseconds = normalizedInput.millisecond || 0;

		        this._isValid = isDurationValid(normalizedInput);

		        // representation for dateAddRemove
		        this._milliseconds =
		            +milliseconds +
		            seconds * 1e3 + // 1000
		            minutes * 6e4 + // 1000 * 60
		            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
		        // Because of dateAddRemove treats 24 hours as different from a
		        // day when working around DST, we need to store them separately
		        this._days = +days + weeks * 7;
		        // It is impossible to translate months into days without knowing
		        // which months you are are talking about, so we have to store
		        // it separately.
		        this._months = +months + quarters * 3 + years * 12;

		        this._data = {};

		        this._locale = getLocale();

		        this._bubble();
		    }

		    function isDuration(obj) {
		        return obj instanceof Duration;
		    }

		    function absRound(number) {
		        if (number < 0) {
		            return Math.round(-1 * number) * -1;
		        } else {
		            return Math.round(number);
		        }
		    }

		    // compare two arrays, return the number of differences
		    function compareArrays(array1, array2, dontConvert) {
		        var len = Math.min(array1.length, array2.length),
		            lengthDiff = Math.abs(array1.length - array2.length),
		            diffs = 0,
		            i;
		        for (i = 0; i < len; i++) {
		            if (
		                (dontConvert && array1[i] !== array2[i]) ||
		                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
		            ) {
		                diffs++;
		            }
		        }
		        return diffs + lengthDiff;
		    }

		    // FORMATTING

		    function offset(token, separator) {
		        addFormatToken(token, 0, 0, function () {
		            var offset = this.utcOffset(),
		                sign = '+';
		            if (offset < 0) {
		                offset = -offset;
		                sign = '-';
		            }
		            return (
		                sign +
		                zeroFill(~~(offset / 60), 2) +
		                separator +
		                zeroFill(~~offset % 60, 2)
		            );
		        });
		    }

		    offset('Z', ':');
		    offset('ZZ', '');

		    // PARSING

		    addRegexToken('Z', matchShortOffset);
		    addRegexToken('ZZ', matchShortOffset);
		    addParseToken(['Z', 'ZZ'], function (input, array, config) {
		        config._useUTC = true;
		        config._tzm = offsetFromString(matchShortOffset, input);
		    });

		    // HELPERS

		    // timezone chunker
		    // '+10:00' > ['10',  '00']
		    // '-1530'  > ['-15', '30']
		    var chunkOffset = /([\+\-]|\d\d)/gi;

		    function offsetFromString(matcher, string) {
		        var matches = (string || '').match(matcher),
		            chunk,
		            parts,
		            minutes;

		        if (matches === null) {
		            return null;
		        }

		        chunk = matches[matches.length - 1] || [];
		        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
		        minutes = +(parts[1] * 60) + toInt(parts[2]);

		        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
		    }

		    // Return a moment from input, that is local/utc/zone equivalent to model.
		    function cloneWithOffset(input, model) {
		        var res, diff;
		        if (model._isUTC) {
		            res = model.clone();
		            diff =
		                (isMoment(input) || isDate(input)
		                    ? input.valueOf()
		                    : createLocal(input).valueOf()) - res.valueOf();
		            // Use low-level api, because this fn is low-level api.
		            res._d.setTime(res._d.valueOf() + diff);
		            hooks.updateOffset(res, false);
		            return res;
		        } else {
		            return createLocal(input).local();
		        }
		    }

		    function getDateOffset(m) {
		        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
		        // https://github.com/moment/moment/pull/1871
		        return -Math.round(m._d.getTimezoneOffset());
		    }

		    // HOOKS

		    // This function will be called whenever a moment is mutated.
		    // It is intended to keep the offset in sync with the timezone.
		    hooks.updateOffset = function () {};

		    // MOMENTS

		    // keepLocalTime = true means only change the timezone, without
		    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
		    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
		    // +0200, so we adjust the time as needed, to be valid.
		    //
		    // Keeping the time actually adds/subtracts (one hour)
		    // from the actual represented time. That is why we call updateOffset
		    // a second time. In case it wants us to change the offset again
		    // _changeInProgress == true case, then we have to adjust, because
		    // there is no such time in the given timezone.
		    function getSetOffset(input, keepLocalTime, keepMinutes) {
		        var offset = this._offset || 0,
		            localAdjust;
		        if (!this.isValid()) {
		            return input != null ? this : NaN;
		        }
		        if (input != null) {
		            if (typeof input === 'string') {
		                input = offsetFromString(matchShortOffset, input);
		                if (input === null) {
		                    return this;
		                }
		            } else if (Math.abs(input) < 16 && !keepMinutes) {
		                input = input * 60;
		            }
		            if (!this._isUTC && keepLocalTime) {
		                localAdjust = getDateOffset(this);
		            }
		            this._offset = input;
		            this._isUTC = true;
		            if (localAdjust != null) {
		                this.add(localAdjust, 'm');
		            }
		            if (offset !== input) {
		                if (!keepLocalTime || this._changeInProgress) {
		                    addSubtract(
		                        this,
		                        createDuration(input - offset, 'm'),
		                        1,
		                        false
		                    );
		                } else if (!this._changeInProgress) {
		                    this._changeInProgress = true;
		                    hooks.updateOffset(this, true);
		                    this._changeInProgress = null;
		                }
		            }
		            return this;
		        } else {
		            return this._isUTC ? offset : getDateOffset(this);
		        }
		    }

		    function getSetZone(input, keepLocalTime) {
		        if (input != null) {
		            if (typeof input !== 'string') {
		                input = -input;
		            }

		            this.utcOffset(input, keepLocalTime);

		            return this;
		        } else {
		            return -this.utcOffset();
		        }
		    }

		    function setOffsetToUTC(keepLocalTime) {
		        return this.utcOffset(0, keepLocalTime);
		    }

		    function setOffsetToLocal(keepLocalTime) {
		        if (this._isUTC) {
		            this.utcOffset(0, keepLocalTime);
		            this._isUTC = false;

		            if (keepLocalTime) {
		                this.subtract(getDateOffset(this), 'm');
		            }
		        }
		        return this;
		    }

		    function setOffsetToParsedOffset() {
		        if (this._tzm != null) {
		            this.utcOffset(this._tzm, false, true);
		        } else if (typeof this._i === 'string') {
		            var tZone = offsetFromString(matchOffset, this._i);
		            if (tZone != null) {
		                this.utcOffset(tZone);
		            } else {
		                this.utcOffset(0, true);
		            }
		        }
		        return this;
		    }

		    function hasAlignedHourOffset(input) {
		        if (!this.isValid()) {
		            return false;
		        }
		        input = input ? createLocal(input).utcOffset() : 0;

		        return (this.utcOffset() - input) % 60 === 0;
		    }

		    function isDaylightSavingTime() {
		        return (
		            this.utcOffset() > this.clone().month(0).utcOffset() ||
		            this.utcOffset() > this.clone().month(5).utcOffset()
		        );
		    }

		    function isDaylightSavingTimeShifted() {
		        if (!isUndefined(this._isDSTShifted)) {
		            return this._isDSTShifted;
		        }

		        var c = {},
		            other;

		        copyConfig(c, this);
		        c = prepareConfig(c);

		        if (c._a) {
		            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
		            this._isDSTShifted =
		                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
		        } else {
		            this._isDSTShifted = false;
		        }

		        return this._isDSTShifted;
		    }

		    function isLocal() {
		        return this.isValid() ? !this._isUTC : false;
		    }

		    function isUtcOffset() {
		        return this.isValid() ? this._isUTC : false;
		    }

		    function isUtc() {
		        return this.isValid() ? this._isUTC && this._offset === 0 : false;
		    }

		    // ASP.NET json date format regex
		    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
		        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
		        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
		        // and further modified to allow for strings containing both week and day
		        isoRegex =
		            /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

		    function createDuration(input, key) {
		        var duration = input,
		            // matching against regexp is expensive, do it on demand
		            match = null,
		            sign,
		            ret,
		            diffRes;

		        if (isDuration(input)) {
		            duration = {
		                ms: input._milliseconds,
		                d: input._days,
		                M: input._months,
		            };
		        } else if (isNumber(input) || !isNaN(+input)) {
		            duration = {};
		            if (key) {
		                duration[key] = +input;
		            } else {
		                duration.milliseconds = +input;
		            }
		        } else if ((match = aspNetRegex.exec(input))) {
		            sign = match[1] === '-' ? -1 : 1;
		            duration = {
		                y: 0,
		                d: toInt(match[DATE]) * sign,
		                h: toInt(match[HOUR]) * sign,
		                m: toInt(match[MINUTE]) * sign,
		                s: toInt(match[SECOND]) * sign,
		                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
		            };
		        } else if ((match = isoRegex.exec(input))) {
		            sign = match[1] === '-' ? -1 : 1;
		            duration = {
		                y: parseIso(match[2], sign),
		                M: parseIso(match[3], sign),
		                w: parseIso(match[4], sign),
		                d: parseIso(match[5], sign),
		                h: parseIso(match[6], sign),
		                m: parseIso(match[7], sign),
		                s: parseIso(match[8], sign),
		            };
		        } else if (duration == null) {
		            // checks for null or undefined
		            duration = {};
		        } else if (
		            typeof duration === 'object' &&
		            ('from' in duration || 'to' in duration)
		        ) {
		            diffRes = momentsDifference(
		                createLocal(duration.from),
		                createLocal(duration.to)
		            );

		            duration = {};
		            duration.ms = diffRes.milliseconds;
		            duration.M = diffRes.months;
		        }

		        ret = new Duration(duration);

		        if (isDuration(input) && hasOwnProp(input, '_locale')) {
		            ret._locale = input._locale;
		        }

		        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
		            ret._isValid = input._isValid;
		        }

		        return ret;
		    }

		    createDuration.fn = Duration.prototype;
		    createDuration.invalid = createInvalid$1;

		    function parseIso(inp, sign) {
		        // We'd normally use ~~inp for this, but unfortunately it also
		        // converts floats to ints.
		        // inp may be undefined, so careful calling replace on it.
		        var res = inp && parseFloat(inp.replace(',', '.'));
		        // apply sign while we're at it
		        return (isNaN(res) ? 0 : res) * sign;
		    }

		    function positiveMomentsDifference(base, other) {
		        var res = {};

		        res.months =
		            other.month() - base.month() + (other.year() - base.year()) * 12;
		        if (base.clone().add(res.months, 'M').isAfter(other)) {
		            --res.months;
		        }

		        res.milliseconds = +other - +base.clone().add(res.months, 'M');

		        return res;
		    }

		    function momentsDifference(base, other) {
		        var res;
		        if (!(base.isValid() && other.isValid())) {
		            return { milliseconds: 0, months: 0 };
		        }

		        other = cloneWithOffset(other, base);
		        if (base.isBefore(other)) {
		            res = positiveMomentsDifference(base, other);
		        } else {
		            res = positiveMomentsDifference(other, base);
		            res.milliseconds = -res.milliseconds;
		            res.months = -res.months;
		        }

		        return res;
		    }

		    // TODO: remove 'name' arg after deprecation is removed
		    function createAdder(direction, name) {
		        return function (val, period) {
		            var dur, tmp;
		            //invert the arguments, but complain about it
		            if (period !== null && !isNaN(+period)) {
		                deprecateSimple(
		                    name,
		                    'moment().' +
		                        name +
		                        '(period, number) is deprecated. Please use moment().' +
		                        name +
		                        '(number, period). ' +
		                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
		                );
		                tmp = val;
		                val = period;
		                period = tmp;
		            }

		            dur = createDuration(val, period);
		            addSubtract(this, dur, direction);
		            return this;
		        };
		    }

		    function addSubtract(mom, duration, isAdding, updateOffset) {
		        var milliseconds = duration._milliseconds,
		            days = absRound(duration._days),
		            months = absRound(duration._months);

		        if (!mom.isValid()) {
		            // No op
		            return;
		        }

		        updateOffset = updateOffset == null ? true : updateOffset;

		        if (months) {
		            setMonth(mom, get(mom, 'Month') + months * isAdding);
		        }
		        if (days) {
		            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
		        }
		        if (milliseconds) {
		            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
		        }
		        if (updateOffset) {
		            hooks.updateOffset(mom, days || months);
		        }
		    }

		    var add = createAdder(1, 'add'),
		        subtract = createAdder(-1, 'subtract');

		    function isString(input) {
		        return typeof input === 'string' || input instanceof String;
		    }

		    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
		    function isMomentInput(input) {
		        return (
		            isMoment(input) ||
		            isDate(input) ||
		            isString(input) ||
		            isNumber(input) ||
		            isNumberOrStringArray(input) ||
		            isMomentInputObject(input) ||
		            input === null ||
		            input === undefined
		        );
		    }

		    function isMomentInputObject(input) {
		        var objectTest = isObject(input) && !isObjectEmpty(input),
		            propertyTest = false,
		            properties = [
		                'years',
		                'year',
		                'y',
		                'months',
		                'month',
		                'M',
		                'days',
		                'day',
		                'd',
		                'dates',
		                'date',
		                'D',
		                'hours',
		                'hour',
		                'h',
		                'minutes',
		                'minute',
		                'm',
		                'seconds',
		                'second',
		                's',
		                'milliseconds',
		                'millisecond',
		                'ms',
		            ],
		            i,
		            property,
		            propertyLen = properties.length;

		        for (i = 0; i < propertyLen; i += 1) {
		            property = properties[i];
		            propertyTest = propertyTest || hasOwnProp(input, property);
		        }

		        return objectTest && propertyTest;
		    }

		    function isNumberOrStringArray(input) {
		        var arrayTest = isArray(input),
		            dataTypeTest = false;
		        if (arrayTest) {
		            dataTypeTest =
		                input.filter(function (item) {
		                    return !isNumber(item) && isString(input);
		                }).length === 0;
		        }
		        return arrayTest && dataTypeTest;
		    }

		    function isCalendarSpec(input) {
		        var objectTest = isObject(input) && !isObjectEmpty(input),
		            propertyTest = false,
		            properties = [
		                'sameDay',
		                'nextDay',
		                'lastDay',
		                'nextWeek',
		                'lastWeek',
		                'sameElse',
		            ],
		            i,
		            property;

		        for (i = 0; i < properties.length; i += 1) {
		            property = properties[i];
		            propertyTest = propertyTest || hasOwnProp(input, property);
		        }

		        return objectTest && propertyTest;
		    }

		    function getCalendarFormat(myMoment, now) {
		        var diff = myMoment.diff(now, 'days', true);
		        return diff < -6
		            ? 'sameElse'
		            : diff < -1
		            ? 'lastWeek'
		            : diff < 0
		            ? 'lastDay'
		            : diff < 1
		            ? 'sameDay'
		            : diff < 2
		            ? 'nextDay'
		            : diff < 7
		            ? 'nextWeek'
		            : 'sameElse';
		    }

		    function calendar$1(time, formats) {
		        // Support for single parameter, formats only overload to the calendar function
		        if (arguments.length === 1) {
		            if (!arguments[0]) {
		                time = undefined;
		                formats = undefined;
		            } else if (isMomentInput(arguments[0])) {
		                time = arguments[0];
		                formats = undefined;
		            } else if (isCalendarSpec(arguments[0])) {
		                formats = arguments[0];
		                time = undefined;
		            }
		        }
		        // We want to compare the start of today, vs this.
		        // Getting start-of-today depends on whether we're local/utc/offset or not.
		        var now = time || createLocal(),
		            sod = cloneWithOffset(now, this).startOf('day'),
		            format = hooks.calendarFormat(this, sod) || 'sameElse',
		            output =
		                formats &&
		                (isFunction(formats[format])
		                    ? formats[format].call(this, now)
		                    : formats[format]);

		        return this.format(
		            output || this.localeData().calendar(format, this, createLocal(now))
		        );
		    }

		    function clone() {
		        return new Moment(this);
		    }

		    function isAfter(input, units) {
		        var localInput = isMoment(input) ? input : createLocal(input);
		        if (!(this.isValid() && localInput.isValid())) {
		            return false;
		        }
		        units = normalizeUnits(units) || 'millisecond';
		        if (units === 'millisecond') {
		            return this.valueOf() > localInput.valueOf();
		        } else {
		            return localInput.valueOf() < this.clone().startOf(units).valueOf();
		        }
		    }

		    function isBefore(input, units) {
		        var localInput = isMoment(input) ? input : createLocal(input);
		        if (!(this.isValid() && localInput.isValid())) {
		            return false;
		        }
		        units = normalizeUnits(units) || 'millisecond';
		        if (units === 'millisecond') {
		            return this.valueOf() < localInput.valueOf();
		        } else {
		            return this.clone().endOf(units).valueOf() < localInput.valueOf();
		        }
		    }

		    function isBetween(from, to, units, inclusivity) {
		        var localFrom = isMoment(from) ? from : createLocal(from),
		            localTo = isMoment(to) ? to : createLocal(to);
		        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
		            return false;
		        }
		        inclusivity = inclusivity || '()';
		        return (
		            (inclusivity[0] === '('
		                ? this.isAfter(localFrom, units)
		                : !this.isBefore(localFrom, units)) &&
		            (inclusivity[1] === ')'
		                ? this.isBefore(localTo, units)
		                : !this.isAfter(localTo, units))
		        );
		    }

		    function isSame(input, units) {
		        var localInput = isMoment(input) ? input : createLocal(input),
		            inputMs;
		        if (!(this.isValid() && localInput.isValid())) {
		            return false;
		        }
		        units = normalizeUnits(units) || 'millisecond';
		        if (units === 'millisecond') {
		            return this.valueOf() === localInput.valueOf();
		        } else {
		            inputMs = localInput.valueOf();
		            return (
		                this.clone().startOf(units).valueOf() <= inputMs &&
		                inputMs <= this.clone().endOf(units).valueOf()
		            );
		        }
		    }

		    function isSameOrAfter(input, units) {
		        return this.isSame(input, units) || this.isAfter(input, units);
		    }

		    function isSameOrBefore(input, units) {
		        return this.isSame(input, units) || this.isBefore(input, units);
		    }

		    function diff(input, units, asFloat) {
		        var that, zoneDelta, output;

		        if (!this.isValid()) {
		            return NaN;
		        }

		        that = cloneWithOffset(input, this);

		        if (!that.isValid()) {
		            return NaN;
		        }

		        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

		        units = normalizeUnits(units);

		        switch (units) {
		            case 'year':
		                output = monthDiff(this, that) / 12;
		                break;
		            case 'month':
		                output = monthDiff(this, that);
		                break;
		            case 'quarter':
		                output = monthDiff(this, that) / 3;
		                break;
		            case 'second':
		                output = (this - that) / 1e3;
		                break; // 1000
		            case 'minute':
		                output = (this - that) / 6e4;
		                break; // 1000 * 60
		            case 'hour':
		                output = (this - that) / 36e5;
		                break; // 1000 * 60 * 60
		            case 'day':
		                output = (this - that - zoneDelta) / 864e5;
		                break; // 1000 * 60 * 60 * 24, negate dst
		            case 'week':
		                output = (this - that - zoneDelta) / 6048e5;
		                break; // 1000 * 60 * 60 * 24 * 7, negate dst
		            default:
		                output = this - that;
		        }

		        return asFloat ? output : absFloor(output);
		    }

		    function monthDiff(a, b) {
		        if (a.date() < b.date()) {
		            // end-of-month calculations work correct when the start month has more
		            // days than the end month.
		            return -monthDiff(b, a);
		        }
		        // difference in months
		        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
		            // b is in (anchor - 1 month, anchor + 1 month)
		            anchor = a.clone().add(wholeMonthDiff, 'months'),
		            anchor2,
		            adjust;

		        if (b - anchor < 0) {
		            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
		            // linear across the month
		            adjust = (b - anchor) / (anchor - anchor2);
		        } else {
		            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
		            // linear across the month
		            adjust = (b - anchor) / (anchor2 - anchor);
		        }

		        //check for negative zero, return zero if negative zero
		        return -(wholeMonthDiff + adjust) || 0;
		    }

		    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
		    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

		    function toString() {
		        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
		    }

		    function toISOString(keepOffset) {
		        if (!this.isValid()) {
		            return null;
		        }
		        var utc = keepOffset !== true,
		            m = utc ? this.clone().utc() : this;
		        if (m.year() < 0 || m.year() > 9999) {
		            return formatMoment(
		                m,
		                utc
		                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
		                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
		            );
		        }
		        if (isFunction(Date.prototype.toISOString)) {
		            // native implementation is ~50x faster, use it when we can
		            if (utc) {
		                return this.toDate().toISOString();
		            } else {
		                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
		                    .toISOString()
		                    .replace('Z', formatMoment(m, 'Z'));
		            }
		        }
		        return formatMoment(
		            m,
		            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
		        );
		    }

		    /**
		     * Return a human readable representation of a moment that can
		     * also be evaluated to get a new moment which is the same
		     *
		     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
		     */
		    function inspect() {
		        if (!this.isValid()) {
		            return 'moment.invalid(/* ' + this._i + ' */)';
		        }
		        var func = 'moment',
		            zone = '',
		            prefix,
		            year,
		            datetime,
		            suffix;
		        if (!this.isLocal()) {
		            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
		            zone = 'Z';
		        }
		        prefix = '[' + func + '("]';
		        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
		        datetime = '-MM-DD[T]HH:mm:ss.SSS';
		        suffix = zone + '[")]';

		        return this.format(prefix + year + datetime + suffix);
		    }

		    function format(inputString) {
		        if (!inputString) {
		            inputString = this.isUtc()
		                ? hooks.defaultFormatUtc
		                : hooks.defaultFormat;
		        }
		        var output = formatMoment(this, inputString);
		        return this.localeData().postformat(output);
		    }

		    function from(time, withoutSuffix) {
		        if (
		            this.isValid() &&
		            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
		        ) {
		            return createDuration({ to: this, from: time })
		                .locale(this.locale())
		                .humanize(!withoutSuffix);
		        } else {
		            return this.localeData().invalidDate();
		        }
		    }

		    function fromNow(withoutSuffix) {
		        return this.from(createLocal(), withoutSuffix);
		    }

		    function to(time, withoutSuffix) {
		        if (
		            this.isValid() &&
		            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
		        ) {
		            return createDuration({ from: this, to: time })
		                .locale(this.locale())
		                .humanize(!withoutSuffix);
		        } else {
		            return this.localeData().invalidDate();
		        }
		    }

		    function toNow(withoutSuffix) {
		        return this.to(createLocal(), withoutSuffix);
		    }

		    // If passed a locale key, it will set the locale for this
		    // instance.  Otherwise, it will return the locale configuration
		    // variables for this instance.
		    function locale(key) {
		        var newLocaleData;

		        if (key === undefined) {
		            return this._locale._abbr;
		        } else {
		            newLocaleData = getLocale(key);
		            if (newLocaleData != null) {
		                this._locale = newLocaleData;
		            }
		            return this;
		        }
		    }

		    var lang = deprecate(
		        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
		        function (key) {
		            if (key === undefined) {
		                return this.localeData();
		            } else {
		                return this.locale(key);
		            }
		        }
		    );

		    function localeData() {
		        return this._locale;
		    }

		    var MS_PER_SECOND = 1000,
		        MS_PER_MINUTE = 60 * MS_PER_SECOND,
		        MS_PER_HOUR = 60 * MS_PER_MINUTE,
		        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

		    // actual modulo - handles negative numbers (for dates before 1970):
		    function mod$1(dividend, divisor) {
		        return ((dividend % divisor) + divisor) % divisor;
		    }

		    function localStartOfDate(y, m, d) {
		        // the date constructor remaps years 0-99 to 1900-1999
		        if (y < 100 && y >= 0) {
		            // preserve leap years using a full 400 year cycle, then reset
		            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
		        } else {
		            return new Date(y, m, d).valueOf();
		        }
		    }

		    function utcStartOfDate(y, m, d) {
		        // Date.UTC remaps years 0-99 to 1900-1999
		        if (y < 100 && y >= 0) {
		            // preserve leap years using a full 400 year cycle, then reset
		            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
		        } else {
		            return Date.UTC(y, m, d);
		        }
		    }

		    function startOf(units) {
		        var time, startOfDate;
		        units = normalizeUnits(units);
		        if (units === undefined || units === 'millisecond' || !this.isValid()) {
		            return this;
		        }

		        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

		        switch (units) {
		            case 'year':
		                time = startOfDate(this.year(), 0, 1);
		                break;
		            case 'quarter':
		                time = startOfDate(
		                    this.year(),
		                    this.month() - (this.month() % 3),
		                    1
		                );
		                break;
		            case 'month':
		                time = startOfDate(this.year(), this.month(), 1);
		                break;
		            case 'week':
		                time = startOfDate(
		                    this.year(),
		                    this.month(),
		                    this.date() - this.weekday()
		                );
		                break;
		            case 'isoWeek':
		                time = startOfDate(
		                    this.year(),
		                    this.month(),
		                    this.date() - (this.isoWeekday() - 1)
		                );
		                break;
		            case 'day':
		            case 'date':
		                time = startOfDate(this.year(), this.month(), this.date());
		                break;
		            case 'hour':
		                time = this._d.valueOf();
		                time -= mod$1(
		                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
		                    MS_PER_HOUR
		                );
		                break;
		            case 'minute':
		                time = this._d.valueOf();
		                time -= mod$1(time, MS_PER_MINUTE);
		                break;
		            case 'second':
		                time = this._d.valueOf();
		                time -= mod$1(time, MS_PER_SECOND);
		                break;
		        }

		        this._d.setTime(time);
		        hooks.updateOffset(this, true);
		        return this;
		    }

		    function endOf(units) {
		        var time, startOfDate;
		        units = normalizeUnits(units);
		        if (units === undefined || units === 'millisecond' || !this.isValid()) {
		            return this;
		        }

		        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

		        switch (units) {
		            case 'year':
		                time = startOfDate(this.year() + 1, 0, 1) - 1;
		                break;
		            case 'quarter':
		                time =
		                    startOfDate(
		                        this.year(),
		                        this.month() - (this.month() % 3) + 3,
		                        1
		                    ) - 1;
		                break;
		            case 'month':
		                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
		                break;
		            case 'week':
		                time =
		                    startOfDate(
		                        this.year(),
		                        this.month(),
		                        this.date() - this.weekday() + 7
		                    ) - 1;
		                break;
		            case 'isoWeek':
		                time =
		                    startOfDate(
		                        this.year(),
		                        this.month(),
		                        this.date() - (this.isoWeekday() - 1) + 7
		                    ) - 1;
		                break;
		            case 'day':
		            case 'date':
		                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
		                break;
		            case 'hour':
		                time = this._d.valueOf();
		                time +=
		                    MS_PER_HOUR -
		                    mod$1(
		                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
		                        MS_PER_HOUR
		                    ) -
		                    1;
		                break;
		            case 'minute':
		                time = this._d.valueOf();
		                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
		                break;
		            case 'second':
		                time = this._d.valueOf();
		                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
		                break;
		        }

		        this._d.setTime(time);
		        hooks.updateOffset(this, true);
		        return this;
		    }

		    function valueOf() {
		        return this._d.valueOf() - (this._offset || 0) * 60000;
		    }

		    function unix() {
		        return Math.floor(this.valueOf() / 1000);
		    }

		    function toDate() {
		        return new Date(this.valueOf());
		    }

		    function toArray() {
		        var m = this;
		        return [
		            m.year(),
		            m.month(),
		            m.date(),
		            m.hour(),
		            m.minute(),
		            m.second(),
		            m.millisecond(),
		        ];
		    }

		    function toObject() {
		        var m = this;
		        return {
		            years: m.year(),
		            months: m.month(),
		            date: m.date(),
		            hours: m.hours(),
		            minutes: m.minutes(),
		            seconds: m.seconds(),
		            milliseconds: m.milliseconds(),
		        };
		    }

		    function toJSON() {
		        // new Date(NaN).toJSON() === null
		        return this.isValid() ? this.toISOString() : null;
		    }

		    function isValid$2() {
		        return isValid(this);
		    }

		    function parsingFlags() {
		        return extend({}, getParsingFlags(this));
		    }

		    function invalidAt() {
		        return getParsingFlags(this).overflow;
		    }

		    function creationData() {
		        return {
		            input: this._i,
		            format: this._f,
		            locale: this._locale,
		            isUTC: this._isUTC,
		            strict: this._strict,
		        };
		    }

		    addFormatToken('N', 0, 0, 'eraAbbr');
		    addFormatToken('NN', 0, 0, 'eraAbbr');
		    addFormatToken('NNN', 0, 0, 'eraAbbr');
		    addFormatToken('NNNN', 0, 0, 'eraName');
		    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

		    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
		    addFormatToken('y', ['yy', 2], 0, 'eraYear');
		    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
		    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

		    addRegexToken('N', matchEraAbbr);
		    addRegexToken('NN', matchEraAbbr);
		    addRegexToken('NNN', matchEraAbbr);
		    addRegexToken('NNNN', matchEraName);
		    addRegexToken('NNNNN', matchEraNarrow);

		    addParseToken(
		        ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
		        function (input, array, config, token) {
		            var era = config._locale.erasParse(input, token, config._strict);
		            if (era) {
		                getParsingFlags(config).era = era;
		            } else {
		                getParsingFlags(config).invalidEra = input;
		            }
		        }
		    );

		    addRegexToken('y', matchUnsigned);
		    addRegexToken('yy', matchUnsigned);
		    addRegexToken('yyy', matchUnsigned);
		    addRegexToken('yyyy', matchUnsigned);
		    addRegexToken('yo', matchEraYearOrdinal);

		    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
		    addParseToken(['yo'], function (input, array, config, token) {
		        var match;
		        if (config._locale._eraYearOrdinalRegex) {
		            match = input.match(config._locale._eraYearOrdinalRegex);
		        }

		        if (config._locale.eraYearOrdinalParse) {
		            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
		        } else {
		            array[YEAR] = parseInt(input, 10);
		        }
		    });

		    function localeEras(m, format) {
		        var i,
		            l,
		            date,
		            eras = this._eras || getLocale('en')._eras;
		        for (i = 0, l = eras.length; i < l; ++i) {
		            switch (typeof eras[i].since) {
		                case 'string':
		                    // truncate time
		                    date = hooks(eras[i].since).startOf('day');
		                    eras[i].since = date.valueOf();
		                    break;
		            }

		            switch (typeof eras[i].until) {
		                case 'undefined':
		                    eras[i].until = +Infinity;
		                    break;
		                case 'string':
		                    // truncate time
		                    date = hooks(eras[i].until).startOf('day').valueOf();
		                    eras[i].until = date.valueOf();
		                    break;
		            }
		        }
		        return eras;
		    }

		    function localeErasParse(eraName, format, strict) {
		        var i,
		            l,
		            eras = this.eras(),
		            name,
		            abbr,
		            narrow;
		        eraName = eraName.toUpperCase();

		        for (i = 0, l = eras.length; i < l; ++i) {
		            name = eras[i].name.toUpperCase();
		            abbr = eras[i].abbr.toUpperCase();
		            narrow = eras[i].narrow.toUpperCase();

		            if (strict) {
		                switch (format) {
		                    case 'N':
		                    case 'NN':
		                    case 'NNN':
		                        if (abbr === eraName) {
		                            return eras[i];
		                        }
		                        break;

		                    case 'NNNN':
		                        if (name === eraName) {
		                            return eras[i];
		                        }
		                        break;

		                    case 'NNNNN':
		                        if (narrow === eraName) {
		                            return eras[i];
		                        }
		                        break;
		                }
		            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
		                return eras[i];
		            }
		        }
		    }

		    function localeErasConvertYear(era, year) {
		        var dir = era.since <= era.until ? +1 : -1;
		        if (year === undefined) {
		            return hooks(era.since).year();
		        } else {
		            return hooks(era.since).year() + (year - era.offset) * dir;
		        }
		    }

		    function getEraName() {
		        var i,
		            l,
		            val,
		            eras = this.localeData().eras();
		        for (i = 0, l = eras.length; i < l; ++i) {
		            // truncate time
		            val = this.clone().startOf('day').valueOf();

		            if (eras[i].since <= val && val <= eras[i].until) {
		                return eras[i].name;
		            }
		            if (eras[i].until <= val && val <= eras[i].since) {
		                return eras[i].name;
		            }
		        }

		        return '';
		    }

		    function getEraNarrow() {
		        var i,
		            l,
		            val,
		            eras = this.localeData().eras();
		        for (i = 0, l = eras.length; i < l; ++i) {
		            // truncate time
		            val = this.clone().startOf('day').valueOf();

		            if (eras[i].since <= val && val <= eras[i].until) {
		                return eras[i].narrow;
		            }
		            if (eras[i].until <= val && val <= eras[i].since) {
		                return eras[i].narrow;
		            }
		        }

		        return '';
		    }

		    function getEraAbbr() {
		        var i,
		            l,
		            val,
		            eras = this.localeData().eras();
		        for (i = 0, l = eras.length; i < l; ++i) {
		            // truncate time
		            val = this.clone().startOf('day').valueOf();

		            if (eras[i].since <= val && val <= eras[i].until) {
		                return eras[i].abbr;
		            }
		            if (eras[i].until <= val && val <= eras[i].since) {
		                return eras[i].abbr;
		            }
		        }

		        return '';
		    }

		    function getEraYear() {
		        var i,
		            l,
		            dir,
		            val,
		            eras = this.localeData().eras();
		        for (i = 0, l = eras.length; i < l; ++i) {
		            dir = eras[i].since <= eras[i].until ? +1 : -1;

		            // truncate time
		            val = this.clone().startOf('day').valueOf();

		            if (
		                (eras[i].since <= val && val <= eras[i].until) ||
		                (eras[i].until <= val && val <= eras[i].since)
		            ) {
		                return (
		                    (this.year() - hooks(eras[i].since).year()) * dir +
		                    eras[i].offset
		                );
		            }
		        }

		        return this.year();
		    }

		    function erasNameRegex(isStrict) {
		        if (!hasOwnProp(this, '_erasNameRegex')) {
		            computeErasParse.call(this);
		        }
		        return isStrict ? this._erasNameRegex : this._erasRegex;
		    }

		    function erasAbbrRegex(isStrict) {
		        if (!hasOwnProp(this, '_erasAbbrRegex')) {
		            computeErasParse.call(this);
		        }
		        return isStrict ? this._erasAbbrRegex : this._erasRegex;
		    }

		    function erasNarrowRegex(isStrict) {
		        if (!hasOwnProp(this, '_erasNarrowRegex')) {
		            computeErasParse.call(this);
		        }
		        return isStrict ? this._erasNarrowRegex : this._erasRegex;
		    }

		    function matchEraAbbr(isStrict, locale) {
		        return locale.erasAbbrRegex(isStrict);
		    }

		    function matchEraName(isStrict, locale) {
		        return locale.erasNameRegex(isStrict);
		    }

		    function matchEraNarrow(isStrict, locale) {
		        return locale.erasNarrowRegex(isStrict);
		    }

		    function matchEraYearOrdinal(isStrict, locale) {
		        return locale._eraYearOrdinalRegex || matchUnsigned;
		    }

		    function computeErasParse() {
		        var abbrPieces = [],
		            namePieces = [],
		            narrowPieces = [],
		            mixedPieces = [],
		            i,
		            l,
		            eras = this.eras();

		        for (i = 0, l = eras.length; i < l; ++i) {
		            namePieces.push(regexEscape(eras[i].name));
		            abbrPieces.push(regexEscape(eras[i].abbr));
		            narrowPieces.push(regexEscape(eras[i].narrow));

		            mixedPieces.push(regexEscape(eras[i].name));
		            mixedPieces.push(regexEscape(eras[i].abbr));
		            mixedPieces.push(regexEscape(eras[i].narrow));
		        }

		        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
		        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
		        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
		        this._erasNarrowRegex = new RegExp(
		            '^(' + narrowPieces.join('|') + ')',
		            'i'
		        );
		    }

		    // FORMATTING

		    addFormatToken(0, ['gg', 2], 0, function () {
		        return this.weekYear() % 100;
		    });

		    addFormatToken(0, ['GG', 2], 0, function () {
		        return this.isoWeekYear() % 100;
		    });

		    function addWeekYearFormatToken(token, getter) {
		        addFormatToken(0, [token, token.length], 0, getter);
		    }

		    addWeekYearFormatToken('gggg', 'weekYear');
		    addWeekYearFormatToken('ggggg', 'weekYear');
		    addWeekYearFormatToken('GGGG', 'isoWeekYear');
		    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

		    // ALIASES

		    addUnitAlias('weekYear', 'gg');
		    addUnitAlias('isoWeekYear', 'GG');

		    // PRIORITY

		    addUnitPriority('weekYear', 1);
		    addUnitPriority('isoWeekYear', 1);

		    // PARSING

		    addRegexToken('G', matchSigned);
		    addRegexToken('g', matchSigned);
		    addRegexToken('GG', match1to2, match2);
		    addRegexToken('gg', match1to2, match2);
		    addRegexToken('GGGG', match1to4, match4);
		    addRegexToken('gggg', match1to4, match4);
		    addRegexToken('GGGGG', match1to6, match6);
		    addRegexToken('ggggg', match1to6, match6);

		    addWeekParseToken(
		        ['gggg', 'ggggg', 'GGGG', 'GGGGG'],
		        function (input, week, config, token) {
		            week[token.substr(0, 2)] = toInt(input);
		        }
		    );

		    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
		        week[token] = hooks.parseTwoDigitYear(input);
		    });

		    // MOMENTS

		    function getSetWeekYear(input) {
		        return getSetWeekYearHelper.call(
		            this,
		            input,
		            this.week(),
		            this.weekday(),
		            this.localeData()._week.dow,
		            this.localeData()._week.doy
		        );
		    }

		    function getSetISOWeekYear(input) {
		        return getSetWeekYearHelper.call(
		            this,
		            input,
		            this.isoWeek(),
		            this.isoWeekday(),
		            1,
		            4
		        );
		    }

		    function getISOWeeksInYear() {
		        return weeksInYear(this.year(), 1, 4);
		    }

		    function getISOWeeksInISOWeekYear() {
		        return weeksInYear(this.isoWeekYear(), 1, 4);
		    }

		    function getWeeksInYear() {
		        var weekInfo = this.localeData()._week;
		        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
		    }

		    function getWeeksInWeekYear() {
		        var weekInfo = this.localeData()._week;
		        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
		    }

		    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
		        var weeksTarget;
		        if (input == null) {
		            return weekOfYear(this, dow, doy).year;
		        } else {
		            weeksTarget = weeksInYear(input, dow, doy);
		            if (week > weeksTarget) {
		                week = weeksTarget;
		            }
		            return setWeekAll.call(this, input, week, weekday, dow, doy);
		        }
		    }

		    function setWeekAll(weekYear, week, weekday, dow, doy) {
		        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
		            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

		        this.year(date.getUTCFullYear());
		        this.month(date.getUTCMonth());
		        this.date(date.getUTCDate());
		        return this;
		    }

		    // FORMATTING

		    addFormatToken('Q', 0, 'Qo', 'quarter');

		    // ALIASES

		    addUnitAlias('quarter', 'Q');

		    // PRIORITY

		    addUnitPriority('quarter', 7);

		    // PARSING

		    addRegexToken('Q', match1);
		    addParseToken('Q', function (input, array) {
		        array[MONTH] = (toInt(input) - 1) * 3;
		    });

		    // MOMENTS

		    function getSetQuarter(input) {
		        return input == null
		            ? Math.ceil((this.month() + 1) / 3)
		            : this.month((input - 1) * 3 + (this.month() % 3));
		    }

		    // FORMATTING

		    addFormatToken('D', ['DD', 2], 'Do', 'date');

		    // ALIASES

		    addUnitAlias('date', 'D');

		    // PRIORITY
		    addUnitPriority('date', 9);

		    // PARSING

		    addRegexToken('D', match1to2);
		    addRegexToken('DD', match1to2, match2);
		    addRegexToken('Do', function (isStrict, locale) {
		        // TODO: Remove "ordinalParse" fallback in next major release.
		        return isStrict
		            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
		            : locale._dayOfMonthOrdinalParseLenient;
		    });

		    addParseToken(['D', 'DD'], DATE);
		    addParseToken('Do', function (input, array) {
		        array[DATE] = toInt(input.match(match1to2)[0]);
		    });

		    // MOMENTS

		    var getSetDayOfMonth = makeGetSet('Date', true);

		    // FORMATTING

		    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

		    // ALIASES

		    addUnitAlias('dayOfYear', 'DDD');

		    // PRIORITY
		    addUnitPriority('dayOfYear', 4);

		    // PARSING

		    addRegexToken('DDD', match1to3);
		    addRegexToken('DDDD', match3);
		    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
		        config._dayOfYear = toInt(input);
		    });

		    // HELPERS

		    // MOMENTS

		    function getSetDayOfYear(input) {
		        var dayOfYear =
		            Math.round(
		                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
		            ) + 1;
		        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
		    }

		    // FORMATTING

		    addFormatToken('m', ['mm', 2], 0, 'minute');

		    // ALIASES

		    addUnitAlias('minute', 'm');

		    // PRIORITY

		    addUnitPriority('minute', 14);

		    // PARSING

		    addRegexToken('m', match1to2);
		    addRegexToken('mm', match1to2, match2);
		    addParseToken(['m', 'mm'], MINUTE);

		    // MOMENTS

		    var getSetMinute = makeGetSet('Minutes', false);

		    // FORMATTING

		    addFormatToken('s', ['ss', 2], 0, 'second');

		    // ALIASES

		    addUnitAlias('second', 's');

		    // PRIORITY

		    addUnitPriority('second', 15);

		    // PARSING

		    addRegexToken('s', match1to2);
		    addRegexToken('ss', match1to2, match2);
		    addParseToken(['s', 'ss'], SECOND);

		    // MOMENTS

		    var getSetSecond = makeGetSet('Seconds', false);

		    // FORMATTING

		    addFormatToken('S', 0, 0, function () {
		        return ~~(this.millisecond() / 100);
		    });

		    addFormatToken(0, ['SS', 2], 0, function () {
		        return ~~(this.millisecond() / 10);
		    });

		    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
		    addFormatToken(0, ['SSSS', 4], 0, function () {
		        return this.millisecond() * 10;
		    });
		    addFormatToken(0, ['SSSSS', 5], 0, function () {
		        return this.millisecond() * 100;
		    });
		    addFormatToken(0, ['SSSSSS', 6], 0, function () {
		        return this.millisecond() * 1000;
		    });
		    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
		        return this.millisecond() * 10000;
		    });
		    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
		        return this.millisecond() * 100000;
		    });
		    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
		        return this.millisecond() * 1000000;
		    });

		    // ALIASES

		    addUnitAlias('millisecond', 'ms');

		    // PRIORITY

		    addUnitPriority('millisecond', 16);

		    // PARSING

		    addRegexToken('S', match1to3, match1);
		    addRegexToken('SS', match1to3, match2);
		    addRegexToken('SSS', match1to3, match3);

		    var token, getSetMillisecond;
		    for (token = 'SSSS'; token.length <= 9; token += 'S') {
		        addRegexToken(token, matchUnsigned);
		    }

		    function parseMs(input, array) {
		        array[MILLISECOND] = toInt(('0.' + input) * 1000);
		    }

		    for (token = 'S'; token.length <= 9; token += 'S') {
		        addParseToken(token, parseMs);
		    }

		    getSetMillisecond = makeGetSet('Milliseconds', false);

		    // FORMATTING

		    addFormatToken('z', 0, 0, 'zoneAbbr');
		    addFormatToken('zz', 0, 0, 'zoneName');

		    // MOMENTS

		    function getZoneAbbr() {
		        return this._isUTC ? 'UTC' : '';
		    }

		    function getZoneName() {
		        return this._isUTC ? 'Coordinated Universal Time' : '';
		    }

		    var proto = Moment.prototype;

		    proto.add = add;
		    proto.calendar = calendar$1;
		    proto.clone = clone;
		    proto.diff = diff;
		    proto.endOf = endOf;
		    proto.format = format;
		    proto.from = from;
		    proto.fromNow = fromNow;
		    proto.to = to;
		    proto.toNow = toNow;
		    proto.get = stringGet;
		    proto.invalidAt = invalidAt;
		    proto.isAfter = isAfter;
		    proto.isBefore = isBefore;
		    proto.isBetween = isBetween;
		    proto.isSame = isSame;
		    proto.isSameOrAfter = isSameOrAfter;
		    proto.isSameOrBefore = isSameOrBefore;
		    proto.isValid = isValid$2;
		    proto.lang = lang;
		    proto.locale = locale;
		    proto.localeData = localeData;
		    proto.max = prototypeMax;
		    proto.min = prototypeMin;
		    proto.parsingFlags = parsingFlags;
		    proto.set = stringSet;
		    proto.startOf = startOf;
		    proto.subtract = subtract;
		    proto.toArray = toArray;
		    proto.toObject = toObject;
		    proto.toDate = toDate;
		    proto.toISOString = toISOString;
		    proto.inspect = inspect;
		    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
		        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
		            return 'Moment<' + this.format() + '>';
		        };
		    }
		    proto.toJSON = toJSON;
		    proto.toString = toString;
		    proto.unix = unix;
		    proto.valueOf = valueOf;
		    proto.creationData = creationData;
		    proto.eraName = getEraName;
		    proto.eraNarrow = getEraNarrow;
		    proto.eraAbbr = getEraAbbr;
		    proto.eraYear = getEraYear;
		    proto.year = getSetYear;
		    proto.isLeapYear = getIsLeapYear;
		    proto.weekYear = getSetWeekYear;
		    proto.isoWeekYear = getSetISOWeekYear;
		    proto.quarter = proto.quarters = getSetQuarter;
		    proto.month = getSetMonth;
		    proto.daysInMonth = getDaysInMonth;
		    proto.week = proto.weeks = getSetWeek;
		    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
		    proto.weeksInYear = getWeeksInYear;
		    proto.weeksInWeekYear = getWeeksInWeekYear;
		    proto.isoWeeksInYear = getISOWeeksInYear;
		    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
		    proto.date = getSetDayOfMonth;
		    proto.day = proto.days = getSetDayOfWeek;
		    proto.weekday = getSetLocaleDayOfWeek;
		    proto.isoWeekday = getSetISODayOfWeek;
		    proto.dayOfYear = getSetDayOfYear;
		    proto.hour = proto.hours = getSetHour;
		    proto.minute = proto.minutes = getSetMinute;
		    proto.second = proto.seconds = getSetSecond;
		    proto.millisecond = proto.milliseconds = getSetMillisecond;
		    proto.utcOffset = getSetOffset;
		    proto.utc = setOffsetToUTC;
		    proto.local = setOffsetToLocal;
		    proto.parseZone = setOffsetToParsedOffset;
		    proto.hasAlignedHourOffset = hasAlignedHourOffset;
		    proto.isDST = isDaylightSavingTime;
		    proto.isLocal = isLocal;
		    proto.isUtcOffset = isUtcOffset;
		    proto.isUtc = isUtc;
		    proto.isUTC = isUtc;
		    proto.zoneAbbr = getZoneAbbr;
		    proto.zoneName = getZoneName;
		    proto.dates = deprecate(
		        'dates accessor is deprecated. Use date instead.',
		        getSetDayOfMonth
		    );
		    proto.months = deprecate(
		        'months accessor is deprecated. Use month instead',
		        getSetMonth
		    );
		    proto.years = deprecate(
		        'years accessor is deprecated. Use year instead',
		        getSetYear
		    );
		    proto.zone = deprecate(
		        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
		        getSetZone
		    );
		    proto.isDSTShifted = deprecate(
		        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
		        isDaylightSavingTimeShifted
		    );

		    function createUnix(input) {
		        return createLocal(input * 1000);
		    }

		    function createInZone() {
		        return createLocal.apply(null, arguments).parseZone();
		    }

		    function preParsePostFormat(string) {
		        return string;
		    }

		    var proto$1 = Locale.prototype;

		    proto$1.calendar = calendar;
		    proto$1.longDateFormat = longDateFormat;
		    proto$1.invalidDate = invalidDate;
		    proto$1.ordinal = ordinal;
		    proto$1.preparse = preParsePostFormat;
		    proto$1.postformat = preParsePostFormat;
		    proto$1.relativeTime = relativeTime;
		    proto$1.pastFuture = pastFuture;
		    proto$1.set = set;
		    proto$1.eras = localeEras;
		    proto$1.erasParse = localeErasParse;
		    proto$1.erasConvertYear = localeErasConvertYear;
		    proto$1.erasAbbrRegex = erasAbbrRegex;
		    proto$1.erasNameRegex = erasNameRegex;
		    proto$1.erasNarrowRegex = erasNarrowRegex;

		    proto$1.months = localeMonths;
		    proto$1.monthsShort = localeMonthsShort;
		    proto$1.monthsParse = localeMonthsParse;
		    proto$1.monthsRegex = monthsRegex;
		    proto$1.monthsShortRegex = monthsShortRegex;
		    proto$1.week = localeWeek;
		    proto$1.firstDayOfYear = localeFirstDayOfYear;
		    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

		    proto$1.weekdays = localeWeekdays;
		    proto$1.weekdaysMin = localeWeekdaysMin;
		    proto$1.weekdaysShort = localeWeekdaysShort;
		    proto$1.weekdaysParse = localeWeekdaysParse;

		    proto$1.weekdaysRegex = weekdaysRegex;
		    proto$1.weekdaysShortRegex = weekdaysShortRegex;
		    proto$1.weekdaysMinRegex = weekdaysMinRegex;

		    proto$1.isPM = localeIsPM;
		    proto$1.meridiem = localeMeridiem;

		    function get$1(format, index, field, setter) {
		        var locale = getLocale(),
		            utc = createUTC().set(setter, index);
		        return locale[field](utc, format);
		    }

		    function listMonthsImpl(format, index, field) {
		        if (isNumber(format)) {
		            index = format;
		            format = undefined;
		        }

		        format = format || '';

		        if (index != null) {
		            return get$1(format, index, field, 'month');
		        }

		        var i,
		            out = [];
		        for (i = 0; i < 12; i++) {
		            out[i] = get$1(format, i, field, 'month');
		        }
		        return out;
		    }

		    // ()
		    // (5)
		    // (fmt, 5)
		    // (fmt)
		    // (true)
		    // (true, 5)
		    // (true, fmt, 5)
		    // (true, fmt)
		    function listWeekdaysImpl(localeSorted, format, index, field) {
		        if (typeof localeSorted === 'boolean') {
		            if (isNumber(format)) {
		                index = format;
		                format = undefined;
		            }

		            format = format || '';
		        } else {
		            format = localeSorted;
		            index = format;
		            localeSorted = false;

		            if (isNumber(format)) {
		                index = format;
		                format = undefined;
		            }

		            format = format || '';
		        }

		        var locale = getLocale(),
		            shift = localeSorted ? locale._week.dow : 0,
		            i,
		            out = [];

		        if (index != null) {
		            return get$1(format, (index + shift) % 7, field, 'day');
		        }

		        for (i = 0; i < 7; i++) {
		            out[i] = get$1(format, (i + shift) % 7, field, 'day');
		        }
		        return out;
		    }

		    function listMonths(format, index) {
		        return listMonthsImpl(format, index, 'months');
		    }

		    function listMonthsShort(format, index) {
		        return listMonthsImpl(format, index, 'monthsShort');
		    }

		    function listWeekdays(localeSorted, format, index) {
		        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
		    }

		    function listWeekdaysShort(localeSorted, format, index) {
		        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
		    }

		    function listWeekdaysMin(localeSorted, format, index) {
		        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
		    }

		    getSetGlobalLocale('en', {
		        eras: [
		            {
		                since: '0001-01-01',
		                until: +Infinity,
		                offset: 1,
		                name: 'Anno Domini',
		                narrow: 'AD',
		                abbr: 'AD',
		            },
		            {
		                since: '0000-12-31',
		                until: -Infinity,
		                offset: 1,
		                name: 'Before Christ',
		                narrow: 'BC',
		                abbr: 'BC',
		            },
		        ],
		        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
		        ordinal: function (number) {
		            var b = number % 10,
		                output =
		                    toInt((number % 100) / 10) === 1
		                        ? 'th'
		                        : b === 1
		                        ? 'st'
		                        : b === 2
		                        ? 'nd'
		                        : b === 3
		                        ? 'rd'
		                        : 'th';
		            return number + output;
		        },
		    });

		    // Side effect imports

		    hooks.lang = deprecate(
		        'moment.lang is deprecated. Use moment.locale instead.',
		        getSetGlobalLocale
		    );
		    hooks.langData = deprecate(
		        'moment.langData is deprecated. Use moment.localeData instead.',
		        getLocale
		    );

		    var mathAbs = Math.abs;

		    function abs() {
		        var data = this._data;

		        this._milliseconds = mathAbs(this._milliseconds);
		        this._days = mathAbs(this._days);
		        this._months = mathAbs(this._months);

		        data.milliseconds = mathAbs(data.milliseconds);
		        data.seconds = mathAbs(data.seconds);
		        data.minutes = mathAbs(data.minutes);
		        data.hours = mathAbs(data.hours);
		        data.months = mathAbs(data.months);
		        data.years = mathAbs(data.years);

		        return this;
		    }

		    function addSubtract$1(duration, input, value, direction) {
		        var other = createDuration(input, value);

		        duration._milliseconds += direction * other._milliseconds;
		        duration._days += direction * other._days;
		        duration._months += direction * other._months;

		        return duration._bubble();
		    }

		    // supports only 2.0-style add(1, 's') or add(duration)
		    function add$1(input, value) {
		        return addSubtract$1(this, input, value, 1);
		    }

		    // supports only 2.0-style subtract(1, 's') or subtract(duration)
		    function subtract$1(input, value) {
		        return addSubtract$1(this, input, value, -1);
		    }

		    function absCeil(number) {
		        if (number < 0) {
		            return Math.floor(number);
		        } else {
		            return Math.ceil(number);
		        }
		    }

		    function bubble() {
		        var milliseconds = this._milliseconds,
		            days = this._days,
		            months = this._months,
		            data = this._data,
		            seconds,
		            minutes,
		            hours,
		            years,
		            monthsFromDays;

		        // if we have a mix of positive and negative values, bubble down first
		        // check: https://github.com/moment/moment/issues/2166
		        if (
		            !(
		                (milliseconds >= 0 && days >= 0 && months >= 0) ||
		                (milliseconds <= 0 && days <= 0 && months <= 0)
		            )
		        ) {
		            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
		            days = 0;
		            months = 0;
		        }

		        // The following code bubbles up values, see the tests for
		        // examples of what that means.
		        data.milliseconds = milliseconds % 1000;

		        seconds = absFloor(milliseconds / 1000);
		        data.seconds = seconds % 60;

		        minutes = absFloor(seconds / 60);
		        data.minutes = minutes % 60;

		        hours = absFloor(minutes / 60);
		        data.hours = hours % 24;

		        days += absFloor(hours / 24);

		        // convert days to months
		        monthsFromDays = absFloor(daysToMonths(days));
		        months += monthsFromDays;
		        days -= absCeil(monthsToDays(monthsFromDays));

		        // 12 months -> 1 year
		        years = absFloor(months / 12);
		        months %= 12;

		        data.days = days;
		        data.months = months;
		        data.years = years;

		        return this;
		    }

		    function daysToMonths(days) {
		        // 400 years have 146097 days (taking into account leap year rules)
		        // 400 years have 12 months === 4800
		        return (days * 4800) / 146097;
		    }

		    function monthsToDays(months) {
		        // the reverse of daysToMonths
		        return (months * 146097) / 4800;
		    }

		    function as(units) {
		        if (!this.isValid()) {
		            return NaN;
		        }
		        var days,
		            months,
		            milliseconds = this._milliseconds;

		        units = normalizeUnits(units);

		        if (units === 'month' || units === 'quarter' || units === 'year') {
		            days = this._days + milliseconds / 864e5;
		            months = this._months + daysToMonths(days);
		            switch (units) {
		                case 'month':
		                    return months;
		                case 'quarter':
		                    return months / 3;
		                case 'year':
		                    return months / 12;
		            }
		        } else {
		            // handle milliseconds separately because of floating point math errors (issue #1867)
		            days = this._days + Math.round(monthsToDays(this._months));
		            switch (units) {
		                case 'week':
		                    return days / 7 + milliseconds / 6048e5;
		                case 'day':
		                    return days + milliseconds / 864e5;
		                case 'hour':
		                    return days * 24 + milliseconds / 36e5;
		                case 'minute':
		                    return days * 1440 + milliseconds / 6e4;
		                case 'second':
		                    return days * 86400 + milliseconds / 1000;
		                // Math.floor prevents floating point math errors here
		                case 'millisecond':
		                    return Math.floor(days * 864e5) + milliseconds;
		                default:
		                    throw new Error('Unknown unit ' + units);
		            }
		        }
		    }

		    // TODO: Use this.as('ms')?
		    function valueOf$1() {
		        if (!this.isValid()) {
		            return NaN;
		        }
		        return (
		            this._milliseconds +
		            this._days * 864e5 +
		            (this._months % 12) * 2592e6 +
		            toInt(this._months / 12) * 31536e6
		        );
		    }

		    function makeAs(alias) {
		        return function () {
		            return this.as(alias);
		        };
		    }

		    var asMilliseconds = makeAs('ms'),
		        asSeconds = makeAs('s'),
		        asMinutes = makeAs('m'),
		        asHours = makeAs('h'),
		        asDays = makeAs('d'),
		        asWeeks = makeAs('w'),
		        asMonths = makeAs('M'),
		        asQuarters = makeAs('Q'),
		        asYears = makeAs('y');

		    function clone$1() {
		        return createDuration(this);
		    }

		    function get$2(units) {
		        units = normalizeUnits(units);
		        return this.isValid() ? this[units + 's']() : NaN;
		    }

		    function makeGetter(name) {
		        return function () {
		            return this.isValid() ? this._data[name] : NaN;
		        };
		    }

		    var milliseconds = makeGetter('milliseconds'),
		        seconds = makeGetter('seconds'),
		        minutes = makeGetter('minutes'),
		        hours = makeGetter('hours'),
		        days = makeGetter('days'),
		        months = makeGetter('months'),
		        years = makeGetter('years');

		    function weeks() {
		        return absFloor(this.days() / 7);
		    }

		    var round = Math.round,
		        thresholds = {
		            ss: 44, // a few seconds to seconds
		            s: 45, // seconds to minute
		            m: 45, // minutes to hour
		            h: 22, // hours to day
		            d: 26, // days to month/week
		            w: null, // weeks to month
		            M: 11, // months to year
		        };

		    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
		    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
		        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
		    }

		    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
		        var duration = createDuration(posNegDuration).abs(),
		            seconds = round(duration.as('s')),
		            minutes = round(duration.as('m')),
		            hours = round(duration.as('h')),
		            days = round(duration.as('d')),
		            months = round(duration.as('M')),
		            weeks = round(duration.as('w')),
		            years = round(duration.as('y')),
		            a =
		                (seconds <= thresholds.ss && ['s', seconds]) ||
		                (seconds < thresholds.s && ['ss', seconds]) ||
		                (minutes <= 1 && ['m']) ||
		                (minutes < thresholds.m && ['mm', minutes]) ||
		                (hours <= 1 && ['h']) ||
		                (hours < thresholds.h && ['hh', hours]) ||
		                (days <= 1 && ['d']) ||
		                (days < thresholds.d && ['dd', days]);

		        if (thresholds.w != null) {
		            a =
		                a ||
		                (weeks <= 1 && ['w']) ||
		                (weeks < thresholds.w && ['ww', weeks]);
		        }
		        a = a ||
		            (months <= 1 && ['M']) ||
		            (months < thresholds.M && ['MM', months]) ||
		            (years <= 1 && ['y']) || ['yy', years];

		        a[2] = withoutSuffix;
		        a[3] = +posNegDuration > 0;
		        a[4] = locale;
		        return substituteTimeAgo.apply(null, a);
		    }

		    // This function allows you to set the rounding function for relative time strings
		    function getSetRelativeTimeRounding(roundingFunction) {
		        if (roundingFunction === undefined) {
		            return round;
		        }
		        if (typeof roundingFunction === 'function') {
		            round = roundingFunction;
		            return true;
		        }
		        return false;
		    }

		    // This function allows you to set a threshold for relative time strings
		    function getSetRelativeTimeThreshold(threshold, limit) {
		        if (thresholds[threshold] === undefined) {
		            return false;
		        }
		        if (limit === undefined) {
		            return thresholds[threshold];
		        }
		        thresholds[threshold] = limit;
		        if (threshold === 's') {
		            thresholds.ss = limit - 1;
		        }
		        return true;
		    }

		    function humanize(argWithSuffix, argThresholds) {
		        if (!this.isValid()) {
		            return this.localeData().invalidDate();
		        }

		        var withSuffix = false,
		            th = thresholds,
		            locale,
		            output;

		        if (typeof argWithSuffix === 'object') {
		            argThresholds = argWithSuffix;
		            argWithSuffix = false;
		        }
		        if (typeof argWithSuffix === 'boolean') {
		            withSuffix = argWithSuffix;
		        }
		        if (typeof argThresholds === 'object') {
		            th = Object.assign({}, thresholds, argThresholds);
		            if (argThresholds.s != null && argThresholds.ss == null) {
		                th.ss = argThresholds.s - 1;
		            }
		        }

		        locale = this.localeData();
		        output = relativeTime$1(this, !withSuffix, th, locale);

		        if (withSuffix) {
		            output = locale.pastFuture(+this, output);
		        }

		        return locale.postformat(output);
		    }

		    var abs$1 = Math.abs;

		    function sign(x) {
		        return (x > 0) - (x < 0) || +x;
		    }

		    function toISOString$1() {
		        // for ISO strings we do not use the normal bubbling rules:
		        //  * milliseconds bubble up until they become hours
		        //  * days do not bubble at all
		        //  * months bubble up until they become years
		        // This is because there is no context-free conversion between hours and days
		        // (think of clock changes)
		        // and also not between days and months (28-31 days per month)
		        if (!this.isValid()) {
		            return this.localeData().invalidDate();
		        }

		        var seconds = abs$1(this._milliseconds) / 1000,
		            days = abs$1(this._days),
		            months = abs$1(this._months),
		            minutes,
		            hours,
		            years,
		            s,
		            total = this.asSeconds(),
		            totalSign,
		            ymSign,
		            daysSign,
		            hmsSign;

		        if (!total) {
		            // this is the same as C#'s (Noda) and python (isodate)...
		            // but not other JS (goog.date)
		            return 'P0D';
		        }

		        // 3600 seconds -> 60 minutes -> 1 hour
		        minutes = absFloor(seconds / 60);
		        hours = absFloor(minutes / 60);
		        seconds %= 60;
		        minutes %= 60;

		        // 12 months -> 1 year
		        years = absFloor(months / 12);
		        months %= 12;

		        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
		        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

		        totalSign = total < 0 ? '-' : '';
		        ymSign = sign(this._months) !== sign(total) ? '-' : '';
		        daysSign = sign(this._days) !== sign(total) ? '-' : '';
		        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

		        return (
		            totalSign +
		            'P' +
		            (years ? ymSign + years + 'Y' : '') +
		            (months ? ymSign + months + 'M' : '') +
		            (days ? daysSign + days + 'D' : '') +
		            (hours || minutes || seconds ? 'T' : '') +
		            (hours ? hmsSign + hours + 'H' : '') +
		            (minutes ? hmsSign + minutes + 'M' : '') +
		            (seconds ? hmsSign + s + 'S' : '')
		        );
		    }

		    var proto$2 = Duration.prototype;

		    proto$2.isValid = isValid$1;
		    proto$2.abs = abs;
		    proto$2.add = add$1;
		    proto$2.subtract = subtract$1;
		    proto$2.as = as;
		    proto$2.asMilliseconds = asMilliseconds;
		    proto$2.asSeconds = asSeconds;
		    proto$2.asMinutes = asMinutes;
		    proto$2.asHours = asHours;
		    proto$2.asDays = asDays;
		    proto$2.asWeeks = asWeeks;
		    proto$2.asMonths = asMonths;
		    proto$2.asQuarters = asQuarters;
		    proto$2.asYears = asYears;
		    proto$2.valueOf = valueOf$1;
		    proto$2._bubble = bubble;
		    proto$2.clone = clone$1;
		    proto$2.get = get$2;
		    proto$2.milliseconds = milliseconds;
		    proto$2.seconds = seconds;
		    proto$2.minutes = minutes;
		    proto$2.hours = hours;
		    proto$2.days = days;
		    proto$2.weeks = weeks;
		    proto$2.months = months;
		    proto$2.years = years;
		    proto$2.humanize = humanize;
		    proto$2.toISOString = toISOString$1;
		    proto$2.toString = toISOString$1;
		    proto$2.toJSON = toISOString$1;
		    proto$2.locale = locale;
		    proto$2.localeData = localeData;

		    proto$2.toIsoString = deprecate(
		        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
		        toISOString$1
		    );
		    proto$2.lang = lang;

		    // FORMATTING

		    addFormatToken('X', 0, 0, 'unix');
		    addFormatToken('x', 0, 0, 'valueOf');

		    // PARSING

		    addRegexToken('x', matchSigned);
		    addRegexToken('X', matchTimestamp);
		    addParseToken('X', function (input, array, config) {
		        config._d = new Date(parseFloat(input) * 1000);
		    });
		    addParseToken('x', function (input, array, config) {
		        config._d = new Date(toInt(input));
		    });

		    //! moment.js

		    hooks.version = '2.29.4';

		    setHookCallback(createLocal);

		    hooks.fn = proto;
		    hooks.min = min;
		    hooks.max = max;
		    hooks.now = now;
		    hooks.utc = createUTC;
		    hooks.unix = createUnix;
		    hooks.months = listMonths;
		    hooks.isDate = isDate;
		    hooks.locale = getSetGlobalLocale;
		    hooks.invalid = createInvalid;
		    hooks.duration = createDuration;
		    hooks.isMoment = isMoment;
		    hooks.weekdays = listWeekdays;
		    hooks.parseZone = createInZone;
		    hooks.localeData = getLocale;
		    hooks.isDuration = isDuration;
		    hooks.monthsShort = listMonthsShort;
		    hooks.weekdaysMin = listWeekdaysMin;
		    hooks.defineLocale = defineLocale;
		    hooks.updateLocale = updateLocale;
		    hooks.locales = listLocales;
		    hooks.weekdaysShort = listWeekdaysShort;
		    hooks.normalizeUnits = normalizeUnits;
		    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
		    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
		    hooks.calendarFormat = getCalendarFormat;
		    hooks.prototype = proto;

		    // currently HTML5 input type only supports 24-hour formats
		    hooks.HTML5_FMT = {
		        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
		        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
		        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
		        DATE: 'YYYY-MM-DD', // <input type="date" />
		        TIME: 'HH:mm', // <input type="time" />
		        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
		        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
		        WEEK: 'GGGG-[W]WW', // <input type="week" />
		        MONTH: 'YYYY-MM', // <input type="month" />
		    };

		    return hooks;

		}))); 
	} (moment$1));

	var momentExports = moment$1.exports;
	var moment = /*@__PURE__*/getDefaultExportFromCjs(momentExports);

	/* src\Calendar.svelte generated by Svelte v4.0.1 */
	const file = "src\\Calendar.svelte";

	function add_css(target) {
		append_styles(target, "svelte-glgx6q", ":host{--calendar-active-text-color:#444;--calendar-inactive-text-color:#aaa;--calendar-background-color:#fff;--calendar-border-color:#ddd}[data-theme=\"dark\"].svelte-glgx6q.svelte-glgx6q.svelte-glgx6q{--calendar-active-text-color:#fff;--calendar-inactive-text-color:#aaa;--calendar-background-color:#444;--calendar-border-color:#555}div.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q,ul.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q,li.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q{padding:0;margin:0}select.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q{display:inline-block;width:auto;font-size:1rem;color:var(--calendar-active-text-color);background-color:var(--calendar-background-color)}select.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q:hover{border-color:var(--calendar-active-text-color)}div.calendar-container.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q{display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;width:100%;min-width:15rem;height:100%;overflow:auto}div.calendar-controls.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q{display:initial;white-space:nowrap;width:100%}div.calendar-view.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q{display:flex;flex-direction:column;width:100%;height:100%}ul.calendar-weekdays.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q{display:flex;flex-direction:row;justify-content:center;width:100%;height:4rem;list-style:none}ul.calendar-weekdays.svelte-glgx6q li.svelte-glgx6q.svelte-glgx6q{display:flex;flex-direction:row;justify-content:center;align-items:center;width:100%;height:100%;font-size:1.5rem;font-weight:bold}ul.calendar-days.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;width:100%;height:calc(100% - 4.5rem);list-style:none}ul.calendar-days.svelte-glgx6q>li.svelte-glgx6q.svelte-glgx6q{display:flex;flex-direction:row;justify-content:center;align-items:center;width:calc(100% / 7)}ul.calendar-days.svelte-glgx6q>li.svelte-glgx6q>div.svelte-glgx6q{display:flex;flex-direction:row;justify-content:center;align-items:center;width:calc(100% - 0.22rem);height:calc(100% - 0.22rem);border:0.01rem solid var(--calendar-border-color);padding:0.2rem;font-size:1.5rem}ul.calendar-days.svelte-glgx6q>li.svelte-glgx6q.svelte-glgx6q:hover{background-color:rgba(80, 170, 170, 0.3) !important}ul.calendar-days.svelte-glgx6q>li.current-month.svelte-glgx6q.svelte-glgx6q{color:var(--calendar-active-text-color);background-color:var(--calendar-background-color);height:auto}ul.calendar-days.svelte-glgx6q>li.other-month.svelte-glgx6q.svelte-glgx6q{color:var(--calendar-inactive-text-color);background-color:var(--calendar-background-color);height:auto}ul.calendar-days.svelte-glgx6q>li.today.svelte-glgx6q.svelte-glgx6q{background-color:rgba(230, 110, 110, 0.3)}span.calendar-day-num.svelte-glgx6q.svelte-glgx6q.svelte-glgx6q{width:100%;align-self:normal;text-align:right}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FsZW5kYXIuc3ZlbHRlIiwic291cmNlcyI6WyJDYWxlbmRhci5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHN2ZWx0ZTpvcHRpb25zIGN1c3RvbUVsZW1lbnQ9XCJteS1jYWxlbmRhclwiIC8+XG5cbjxzY3JpcHQ+XG4gICAgaW1wb3J0IG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG4gICAgaW1wb3J0IHsgb25Nb3VudCwgb25EZXN0cm95IH0gZnJvbSBcInN2ZWx0ZVwiO1xuXG4gICAgbGV0IHRoZW1lID0gXCJsaWdodFwiO1xuXG4gICAgZnVuY3Rpb24gc2V0VGhlbWVGcm9tSFRNTCgpIHtcbiAgICAgICAgdGhlbWUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiKSB8fCBcImxpZ2h0XCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2JzZXJ2ZVRoZW1lQ2hhbmdlcygpIHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSBcImRhdGEtdGhlbWVcIikge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaGVtZUZyb21IVE1MKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgeyBhdHRyaWJ1dGVzOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgeWVhclJhbmdlQmVmb3JlID0gMjtcbiAgICBleHBvcnQgbGV0IHllYXJSYW5nZUFmdGVyID0gMTtcblxuICAgIGxldCBzZWxlY3RvclllYXIsIHNlbGVjdG9yTW9udGg7XG5cbiAgICBjb25zdCBjYWxlbmRhckRhdGEgPSB7XG4gICAgICAgIHNlbGVjdGVkWWVhcjogMCxcbiAgICAgICAgc2VsZWN0ZWRNb250aDogMCxcbiAgICAgICAgd2Vla05hbWVzOiBbXSxcbiAgICAgICAgeWVhcnM6IFtdLFxuICAgICAgICBtb250aHM6IFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXSxcbiAgICAgICAgZGF5czogW10sXG4gICAgfTtcblxuICAgIGNvbnN0IHNldHVwU2VsZWN0b3JZZWFycyA9IChkYXRlKSA9PiB7XG4gICAgICAgIGNhbGVuZGFyRGF0YS5zZWxlY3RlZFllYXIgPSBwYXJzZUludChtb21lbnQoZGF0ZSkuZm9ybWF0KFwiWVlZWVwiKSk7XG4gICAgICAgIGNvbnN0IGJlZ2luWWVhciA9IGNhbGVuZGFyRGF0YS5zZWxlY3RlZFllYXIgLSB5ZWFyUmFuZ2VCZWZvcmU7XG4gICAgICAgIGNvbnN0IGVuZFllYXIgPSBjYWxlbmRhckRhdGEuc2VsZWN0ZWRZZWFyICsgeWVhclJhbmdlQWZ0ZXI7XG5cbiAgICAgICAgY2FsZW5kYXJEYXRhLnllYXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSBiZWdpblllYXI7IGkgPD0gZW5kWWVhcjsgaSsrKSB7XG4gICAgICAgICAgICBjYWxlbmRhckRhdGEueWVhcnMucHVzaChpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzZXR1cFNlbGVjdG9yTW9udGhzID0gKGRhdGUpID0+IHtcbiAgICAgICAgY2FsZW5kYXJEYXRhLnNlbGVjdGVkTW9udGggPSBwYXJzZUludChtb21lbnQoZGF0ZSkuZm9ybWF0KFwiTU1cIikpO1xuXG4gICAgICAgIGNhbGVuZGFyRGF0YS5tb250aHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTI7IGkrKykge1xuICAgICAgICAgICAgY2FsZW5kYXJEYXRhLm1vbnRocy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG1vdmVUb2RheSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdG9kYXkgPSBtb21lbnQoKTtcbiAgICAgICAgc2V0dXBEYXlzKHRvZGF5KTtcbiAgICB9O1xuXG4gICAgY29uc3QgbW92ZVByZXZpb3VzTW9udGggPSAod3RmKSA9PiB7XG4gICAgICAgIGNvbnN0IHltID0gYCR7Y2FsZW5kYXJEYXRhLnNlbGVjdGVkWWVhcn0tJHtjYWxlbmRhckRhdGEuc2VsZWN0ZWRNb250aH1gO1xuICAgICAgICBjb25zdCBwcmV2aW91c01vbnRoID0gbW9tZW50KHltLCBcIllZWVktTU1cIikuc3VidHJhY3QoMSwgXCJtb250aFwiKTtcbiAgICAgICAgc2V0dXBEYXlzKHByZXZpb3VzTW9udGgpO1xuICAgIH07XG5cbiAgICBjb25zdCBtb3ZlTmV4dE1vbnRoID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB5bSA9IGAke2NhbGVuZGFyRGF0YS5zZWxlY3RlZFllYXJ9LSR7Y2FsZW5kYXJEYXRhLnNlbGVjdGVkTW9udGh9YDtcbiAgICAgICAgY29uc3QgbmV4dE1vbnRoID0gbW9tZW50KHltLCBcIllZWVktTU1cIikuYWRkKDEsIFwibW9udGhcIik7XG4gICAgICAgIHNldHVwRGF5cyhuZXh0TW9udGgpO1xuICAgIH07XG5cbiAgICBjb25zdCBtb3ZlRGF0ZUJ5U2VsZWN0b3IgPSAoKSA9PiB7XG4gICAgICAgIGlmIChzZWxlY3RvclllYXIgJiYgc2VsZWN0b3JNb250aCkge1xuICAgICAgICAgICAgY2FsZW5kYXJEYXRhLnNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHNlbGVjdG9yWWVhci52YWx1ZSk7XG4gICAgICAgICAgICBjYWxlbmRhckRhdGEuc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KHNlbGVjdG9yTW9udGgudmFsdWUpO1xuXG4gICAgICAgICAgICBjb25zdCB5bSA9IGAke2NhbGVuZGFyRGF0YS5zZWxlY3RlZFllYXJ9LSR7Y2FsZW5kYXJEYXRhLnNlbGVjdGVkTW9udGh9YDtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkWWVhck1vbnRoID0gbW9tZW50KHltLCBcIllZWVktTU1cIik7XG4gICAgICAgICAgICBzZXR1cERheXMoc2VsZWN0ZWRZZWFyTW9udGgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHNldHVwRGF5cyA9IChyZWZlcmVuY2VEYXRlKSA9PiB7XG4gICAgICAgIGNvbnN0IHdlZWtOYW1lcyA9IG1vbWVudC53ZWVrZGF5c1Nob3J0KHRydWUpO1xuICAgICAgICBjYWxlbmRhckRhdGEud2Vla05hbWVzID0gd2Vla05hbWVzO1xuXG4gICAgICAgIGNvbnN0IHJlZkRheSA9IG1vbWVudChyZWZlcmVuY2VEYXRlKTsgLy8gbm9ybWFsbHkgdG9kYXlcblxuICAgICAgICBjYWxlbmRhckRhdGEuc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KHJlZkRheS5mb3JtYXQoXCJNTVwiKSk7XG4gICAgICAgIGNhbGVuZGFyRGF0YS5zZWxlY3RlZFllYXIgPSBwYXJzZUludChyZWZEYXkuZm9ybWF0KFwiWVlZWVwiKSk7XG4gICAgICAgIGNhbGVuZGFyRGF0YS5kYXlzID0gW107XG5cbiAgICAgICAgY29uc3Qgc3RhcnRPZk1vbnRoID0gbW9tZW50KHJlZkRheSkuc3RhcnRPZihcIm1vbnRoXCIpO1xuICAgICAgICBjb25zdCBlbmRPZk1vbnRoID0gbW9tZW50KHJlZkRheSkuZW5kT2YoXCJtb250aFwiKTtcblxuICAgICAgICBjb25zdCBzdGFydE9mQ2FsZW5kYXIgPSBtb21lbnQoc3RhcnRPZk1vbnRoKS5zdGFydE9mKFwid2Vla1wiKTtcbiAgICAgICAgY29uc3QgZW5kT2ZDYWxlbmRhciA9IG1vbWVudChlbmRPZk1vbnRoKS5lbmRPZihcIndlZWtcIik7XG5cbiAgICAgICAgY29uc3QgZGF5ID0gc3RhcnRPZkNhbGVuZGFyO1xuICAgICAgICB3aGlsZSAoZGF5LmlzU2FtZU9yQmVmb3JlKGVuZE9mQ2FsZW5kYXIpKSB7XG4gICAgICAgICAgICBjYWxlbmRhckRhdGEuZGF5cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBudW06IGRheS5mb3JtYXQoXCJEXCIpLFxuICAgICAgICAgICAgICAgIGlzQ3VycmVudE1vbnRoOiBkYXkuaXNTYW1lKHJlZkRheSwgXCJtb250aFwiKSxcbiAgICAgICAgICAgICAgICBpc1RvZGF5OiBkYXkuaXNTYW1lKG1vbWVudCgpLCBcImRheVwiKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF5LmFkZCgxLCBcImRheVwiKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBvbk1vdW50KCgpID0+IHtcbiAgICAgICAgc2V0VGhlbWVGcm9tSFRNTCgpO1xuICAgICAgICBvYnNlcnZlVGhlbWVDaGFuZ2VzKCk7XG5cbiAgICAgICAgbW9tZW50LmxvY2FsZShcImtvXCIpO1xuICAgICAgICBjb25zdCB0b2RheSA9IG1vbWVudCgpO1xuXG4gICAgICAgIHNldHVwU2VsZWN0b3JZZWFycyh0b2RheSk7XG4gICAgICAgIHNldHVwU2VsZWN0b3JNb250aHModG9kYXkpO1xuICAgICAgICBzZXR1cERheXModG9kYXkpO1xuICAgIH0pO1xuXG4gICAgb25EZXN0cm95KCgpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH0pO1xuPC9zY3JpcHQ+XG5cbjxkaXYgY2xhc3M9XCJjYWxlbmRhci1jb250YWluZXJcIiBkYXRhLXRoZW1lPXt0aGVtZX0+XG4gICAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJnbG9iYWwuY3NzXCIgLz5cbiAgICA8ZGl2IGNsYXNzPVwiY2FsZW5kYXItY29udHJvbHNcIj5cbiAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgbmFtZT1cImNhbGVuZGFyLXNlbGVjdG9yLXllYXJcIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlllYXJcIlxuICAgICAgICAgICAgb246Y2hhbmdlPXttb3ZlRGF0ZUJ5U2VsZWN0b3J9XG4gICAgICAgICAgICBiaW5kOnRoaXM9e3NlbGVjdG9yWWVhcn1cbiAgICAgICAgICAgIGJpbmQ6dmFsdWU9e2NhbGVuZGFyRGF0YS5zZWxlY3RlZFllYXJ9XG4gICAgICAgID5cbiAgICAgICAgICAgIHsjZWFjaCBjYWxlbmRhckRhdGEueWVhcnMgYXMgeWVhcn1cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt5ZWFyfT57eWVhcn08L29wdGlvbj5cbiAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgPC9zZWxlY3Q+XG5cbiAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgbmFtZT1cImNhbGVuZGFyLXNlbGVjdG9yLW1vbnRoXCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJNb250aFwiXG4gICAgICAgICAgICBvbjpjaGFuZ2U9e21vdmVEYXRlQnlTZWxlY3Rvcn1cbiAgICAgICAgICAgIGJpbmQ6dGhpcz17c2VsZWN0b3JNb250aH1cbiAgICAgICAgICAgIGJpbmQ6dmFsdWU9e2NhbGVuZGFyRGF0YS5zZWxlY3RlZE1vbnRofVxuICAgICAgICA+XG4gICAgICAgICAgICB7I2VhY2ggY2FsZW5kYXJEYXRhLm1vbnRocyBhcyBtb250aH1cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXttb250aH0+e21vbnRofTwvb3B0aW9uPlxuICAgICAgICAgICAgey9lYWNofVxuICAgICAgICA8L3NlbGVjdD5cblxuICAgICAgICA8YnV0dG9uIG9uOmNsaWNrPXsoKSA9PiBtb3ZlVG9kYXkoKX0+VG9kYXk8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBvbjpjbGljaz17bW92ZVByZXZpb3VzTW9udGh9PiBQcmV2aW91cyBNb250aCA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBvbjpjbGljaz17bW92ZU5leHRNb250aH0+IE5leHQgTW9udGggPC9idXR0b24+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiY2FsZW5kYXItdmlld1wiPlxuICAgICAgICA8dWwgY2xhc3M9XCJjYWxlbmRhci13ZWVrZGF5c1wiPlxuICAgICAgICAgICAgeyNlYWNoIGNhbGVuZGFyRGF0YS53ZWVrTmFtZXMgYXMgd2Vla05hbWV9XG4gICAgICAgICAgICAgICAgPGxpPnt3ZWVrTmFtZX08L2xpPlxuICAgICAgICAgICAgey9lYWNofVxuICAgICAgICA8L3VsPlxuICAgICAgICA8dWwgY2xhc3M9XCJjYWxlbmRhci1kYXlzXCI+XG4gICAgICAgICAgICB7I2VhY2ggY2FsZW5kYXJEYXRhLmRheXMgYXMgZGF5fVxuICAgICAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIlxuICAgICAgICAgICAgICAgICAgICBjYWxlbmRhci1kYXlcbiAgICAgICAgICAgICAgICAgICAge2RheS5pc0N1cnJlbnRNb250aCA/ICdjdXJyZW50LW1vbnRoJyA6ICdvdGhlci1tb250aCd9XG4gICAgICAgICAgICAgICAgICAgIHtkYXkuaXNUb2RheSA/ICd0b2RheScgOiAnJ31cIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbGVuZGFyLWRheS1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FsZW5kYXItZGF5LW51bVwiPntkYXkubnVtfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgPC91bD5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48c3R5bGU+XG4gICAgOmhvc3Qge1xuICAgICAgICAtLWNhbGVuZGFyLWFjdGl2ZS10ZXh0LWNvbG9yOiAjNDQ0O1xuICAgICAgICAtLWNhbGVuZGFyLWluYWN0aXZlLXRleHQtY29sb3I6ICNhYWE7XG4gICAgICAgIC0tY2FsZW5kYXItYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgICAgICAgLS1jYWxlbmRhci1ib3JkZXItY29sb3I6ICNkZGQ7XG4gICAgfVxuXG4gICAgW2RhdGEtdGhlbWU9XCJkYXJrXCJdIHtcbiAgICAgICAgLS1jYWxlbmRhci1hY3RpdmUtdGV4dC1jb2xvcjogI2ZmZjtcbiAgICAgICAgLS1jYWxlbmRhci1pbmFjdGl2ZS10ZXh0LWNvbG9yOiAjYWFhO1xuICAgICAgICAtLWNhbGVuZGFyLWJhY2tncm91bmQtY29sb3I6ICM0NDQ7XG4gICAgICAgIC0tY2FsZW5kYXItYm9yZGVyLWNvbG9yOiAjNTU1O1xuICAgIH1cblxuICAgIGRpdixcbiAgICB1bCxcbiAgICBsaSB7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG5cbiAgICBzZWxlY3Qge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgICAgICBmb250LXNpemU6IDFyZW07XG4gICAgICAgIGNvbG9yOiB2YXIoLS1jYWxlbmRhci1hY3RpdmUtdGV4dC1jb2xvcik7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNhbGVuZGFyLWJhY2tncm91bmQtY29sb3IpO1xuICAgIH1cblxuICAgIHNlbGVjdDpob3ZlciB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogdmFyKC0tY2FsZW5kYXItYWN0aXZlLXRleHQtY29sb3IpO1xuICAgIH1cblxuICAgIGRpdi5jYWxlbmRhci1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWluLXdpZHRoOiAxNXJlbTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBvdmVyZmxvdzogYXV0bztcbiAgICB9XG5cbiAgICBkaXYuY2FsZW5kYXItY29udHJvbHMge1xuICAgICAgICBkaXNwbGF5OiBpbml0aWFsO1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICBkaXYuY2FsZW5kYXItdmlldyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgfVxuXG4gICAgdWwuY2FsZW5kYXItd2Vla2RheXMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogNHJlbTtcbiAgICAgICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICB9XG5cbiAgICB1bC5jYWxlbmRhci13ZWVrZGF5cyBsaSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgfVxuXG4gICAgdWwuY2FsZW5kYXItZGF5cyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDQuNXJlbSk7XG4gICAgICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgfVxuXG4gICAgdWwuY2FsZW5kYXItZGF5cyA+IGxpIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiBjYWxjKDEwMCUgLyA3KTtcbiAgICB9XG5cbiAgICB1bC5jYWxlbmRhci1kYXlzID4gbGkgPiBkaXYge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IGNhbGMoMTAwJSAtIDAuMjJyZW0pO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDAuMjJyZW0pO1xuICAgICAgICBib3JkZXI6IDAuMDFyZW0gc29saWQgdmFyKC0tY2FsZW5kYXItYm9yZGVyLWNvbG9yKTtcbiAgICAgICAgcGFkZGluZzogMC4ycmVtO1xuICAgICAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICB9XG5cbiAgICB1bC5jYWxlbmRhci1kYXlzID4gbGk6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDgwLCAxNzAsIDE3MCwgMC4zKSAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgIHVsLmNhbGVuZGFyLWRheXMgPiBsaS5jdXJyZW50LW1vbnRoIHtcbiAgICAgICAgY29sb3I6IHZhcigtLWNhbGVuZGFyLWFjdGl2ZS10ZXh0LWNvbG9yKTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2FsZW5kYXItYmFja2dyb3VuZC1jb2xvcik7XG4gICAgICAgIGhlaWdodDogYXV0bztcbiAgICB9XG5cbiAgICB1bC5jYWxlbmRhci1kYXlzID4gbGkub3RoZXItbW9udGgge1xuICAgICAgICBjb2xvcjogdmFyKC0tY2FsZW5kYXItaW5hY3RpdmUtdGV4dC1jb2xvcik7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNhbGVuZGFyLWJhY2tncm91bmQtY29sb3IpO1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgfVxuXG4gICAgdWwuY2FsZW5kYXItZGF5cyA+IGxpLnRvZGF5IHtcbiAgICAgICAgLyogYmFja2dyb3VuZC1jb2xvcjogcmVkOyAqL1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIzMCwgMTEwLCAxMTAsIDAuMyk7XG4gICAgfVxuXG4gICAgc3Bhbi5jYWxlbmRhci1kYXktbnVtIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGFsaWduLXNlbGY6IG5vcm1hbDtcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgfVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEwTEksS0FBTSxDQUNGLDRCQUE0QixDQUFFLElBQUksQ0FDbEMsOEJBQThCLENBQUUsSUFBSSxDQUNwQywyQkFBMkIsQ0FBRSxJQUFJLENBQ2pDLHVCQUF1QixDQUFFLElBQzdCLENBRUEsQ0FBQyxVQUFVLENBQUMsTUFBTSwyQ0FBRSxDQUNoQiw0QkFBNEIsQ0FBRSxJQUFJLENBQ2xDLDhCQUE4QixDQUFFLElBQUksQ0FDcEMsMkJBQTJCLENBQUUsSUFBSSxDQUNqQyx1QkFBdUIsQ0FBRSxJQUM3QixDQUVBLDZDQUFHLENBQ0gsNENBQUUsQ0FDRiw0Q0FBRyxDQUNDLE9BQU8sQ0FBRSxDQUFDLENBQ1YsTUFBTSxDQUFFLENBQ1osQ0FFQSxnREFBTyxDQUNILE9BQU8sQ0FBRSxZQUFZLENBQ3JCLEtBQUssQ0FBRSxJQUFJLENBQ1gsU0FBUyxDQUFFLElBQUksQ0FDZixLQUFLLENBQUUsSUFBSSw0QkFBNEIsQ0FBQyxDQUN4QyxnQkFBZ0IsQ0FBRSxJQUFJLDJCQUEyQixDQUNyRCxDQUVBLGdEQUFNLE1BQU8sQ0FDVCxZQUFZLENBQUUsSUFBSSw0QkFBNEIsQ0FDbEQsQ0FFQSxHQUFHLDZEQUFvQixDQUNuQixPQUFPLENBQUUsSUFBSSxDQUNiLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLGVBQWUsQ0FBRSxVQUFVLENBQzNCLFdBQVcsQ0FBRSxVQUFVLENBQ3ZCLEtBQUssQ0FBRSxJQUFJLENBQ1gsU0FBUyxDQUFFLEtBQUssQ0FDaEIsTUFBTSxDQUFFLElBQUksQ0FDWixRQUFRLENBQUUsSUFDZCxDQUVBLEdBQUcsNERBQW1CLENBQ2xCLE9BQU8sQ0FBRSxPQUFPLENBQ2hCLFdBQVcsQ0FBRSxNQUFNLENBQ25CLEtBQUssQ0FBRSxJQUNYLENBRUEsR0FBRyx3REFBZSxDQUNkLE9BQU8sQ0FBRSxJQUFJLENBQ2IsY0FBYyxDQUFFLE1BQU0sQ0FDdEIsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFDWixDQUVBLEVBQUUsNERBQW1CLENBQ2pCLE9BQU8sQ0FBRSxJQUFJLENBQ2IsY0FBYyxDQUFFLEdBQUcsQ0FDbkIsZUFBZSxDQUFFLE1BQU0sQ0FDdkIsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxJQUNoQixDQUVBLEVBQUUsZ0NBQWtCLENBQUMsOEJBQUcsQ0FDcEIsT0FBTyxDQUFFLElBQUksQ0FDYixjQUFjLENBQUUsR0FBRyxDQUNuQixlQUFlLENBQUUsTUFBTSxDQUN2QixXQUFXLENBQUUsTUFBTSxDQUNuQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osU0FBUyxDQUFFLE1BQU0sQ0FDakIsV0FBVyxDQUFFLElBQ2pCLENBRUEsRUFBRSx3REFBZSxDQUNiLE9BQU8sQ0FBRSxJQUFJLENBQ2IsY0FBYyxDQUFFLEdBQUcsQ0FDbkIsU0FBUyxDQUFFLElBQUksQ0FDZixlQUFlLENBQUUsTUFBTSxDQUN2QixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQzNCLFVBQVUsQ0FBRSxJQUNoQixDQUVBLEVBQUUsNEJBQWMsQ0FBRyw4QkFBRyxDQUNsQixPQUFPLENBQUUsSUFBSSxDQUNiLGNBQWMsQ0FBRSxHQUFHLENBQ25CLGVBQWUsQ0FBRSxNQUFNLENBQ3ZCLFdBQVcsQ0FBRSxNQUFNLENBQ25CLEtBQUssQ0FBRSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN4QixDQUVBLEVBQUUsNEJBQWMsQ0FBRyxnQkFBRSxDQUFHLGlCQUFJLENBQ3hCLE9BQU8sQ0FBRSxJQUFJLENBQ2IsY0FBYyxDQUFFLEdBQUcsQ0FDbkIsZUFBZSxDQUFFLE1BQU0sQ0FDdkIsV0FBVyxDQUFFLE1BQU0sQ0FDbkIsS0FBSyxDQUFFLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDM0IsTUFBTSxDQUFFLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDNUIsTUFBTSxDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxDQUNsRCxPQUFPLENBQUUsTUFBTSxDQUNmLFNBQVMsQ0FBRSxNQUNmLENBRUEsRUFBRSw0QkFBYyxDQUFHLDhCQUFFLE1BQU8sQ0FDeEIsZ0JBQWdCLENBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUM5QyxDQUVBLEVBQUUsNEJBQWMsQ0FBRyxFQUFFLDBDQUFlLENBQ2hDLEtBQUssQ0FBRSxJQUFJLDRCQUE0QixDQUFDLENBQ3hDLGdCQUFnQixDQUFFLElBQUksMkJBQTJCLENBQUMsQ0FDbEQsTUFBTSxDQUFFLElBQ1osQ0FFQSxFQUFFLDRCQUFjLENBQUcsRUFBRSx3Q0FBYSxDQUM5QixLQUFLLENBQUUsSUFBSSw4QkFBOEIsQ0FBQyxDQUMxQyxnQkFBZ0IsQ0FBRSxJQUFJLDJCQUEyQixDQUFDLENBQ2xELE1BQU0sQ0FBRSxJQUNaLENBRUEsRUFBRSw0QkFBYyxDQUFHLEVBQUUsa0NBQU8sQ0FFeEIsZ0JBQWdCLENBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQzdDLENBRUEsSUFBSSwyREFBa0IsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxVQUFVLENBQUUsTUFBTSxDQUNsQixVQUFVLENBQUUsS0FDaEIifQ== */");
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[20] = list[i];
		return child_ctx;
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[23] = list[i];
		return child_ctx;
	}

	function get_each_context_2(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[26] = list[i];
		return child_ctx;
	}

	function get_each_context_3(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[29] = list[i];
		return child_ctx;
	}

	// (141:12) {#each calendarData.years as year}
	function create_each_block_3(ctx) {
		let option;
		let t_value = /*year*/ ctx[29] + "";
		let t;
		let option_value_value;

		const block = {
			c: function create() {
				option = element("option");
				t = text(t_value);
				option.__value = option_value_value = /*year*/ ctx[29];
				set_input_value(option, option.__value);
				add_location(option, file, 141, 16, 4341);
			},
			m: function mount(target, anchor) {
				insert_dev(target, option, anchor);
				append_dev(option, t);
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*calendarData*/ 8 && t_value !== (t_value = /*year*/ ctx[29] + "")) set_data_dev(t, t_value);

				if (dirty[0] & /*calendarData*/ 8 && option_value_value !== (option_value_value = /*year*/ ctx[29])) {
					prop_dev(option, "__value", option_value_value);
					set_input_value(option, option.__value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(option);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_3.name,
			type: "each",
			source: "(141:12) {#each calendarData.years as year}",
			ctx
		});

		return block;
	}

	// (153:12) {#each calendarData.months as month}
	function create_each_block_2(ctx) {
		let option;
		let t_value = /*month*/ ctx[26] + "";
		let t;
		let option_value_value;

		const block = {
			c: function create() {
				option = element("option");
				t = text(t_value);
				option.__value = option_value_value = /*month*/ ctx[26];
				set_input_value(option, option.__value);
				add_location(option, file, 153, 16, 4715);
			},
			m: function mount(target, anchor) {
				insert_dev(target, option, anchor);
				append_dev(option, t);
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*calendarData*/ 8 && t_value !== (t_value = /*month*/ ctx[26] + "")) set_data_dev(t, t_value);

				if (dirty[0] & /*calendarData*/ 8 && option_value_value !== (option_value_value = /*month*/ ctx[26])) {
					prop_dev(option, "__value", option_value_value);
					set_input_value(option, option.__value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(option);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_2.name,
			type: "each",
			source: "(153:12) {#each calendarData.months as month}",
			ctx
		});

		return block;
	}

	// (165:12) {#each calendarData.weekNames as weekName}
	function create_each_block_1(ctx) {
		let li;
		let t_value = /*weekName*/ ctx[23] + "";
		let t;

		const block = {
			c: function create() {
				li = element("li");
				t = text(t_value);
				attr_dev(li, "class", "svelte-glgx6q");
				add_location(li, file, 165, 16, 5141);
			},
			m: function mount(target, anchor) {
				insert_dev(target, li, anchor);
				append_dev(li, t);
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*calendarData*/ 8 && t_value !== (t_value = /*weekName*/ ctx[23] + "")) set_data_dev(t, t_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(li);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_1.name,
			type: "each",
			source: "(165:12) {#each calendarData.weekNames as weekName}",
			ctx
		});

		return block;
	}

	// (170:12) {#each calendarData.days as day}
	function create_each_block(ctx) {
		let li;
		let div;
		let span;
		let t0_value = /*day*/ ctx[20].num + "";
		let t0;
		let t1;
		let li_class_value;

		const block = {
			c: function create() {
				li = element("li");
				div = element("div");
				span = element("span");
				t0 = text(t0_value);
				t1 = space();
				attr_dev(span, "class", "calendar-day-num svelte-glgx6q");
				add_location(span, file, 177, 24, 5580);
				attr_dev(div, "class", "calendar-day-container svelte-glgx6q");
				add_location(div, file, 176, 20, 5519);

				attr_dev(li, "class", li_class_value = "calendar-day " + (/*day*/ ctx[20].isCurrentMonth
				? 'current-month'
				: 'other-month') + " " + (/*day*/ ctx[20].isToday ? 'today' : '') + " svelte-glgx6q");

				add_location(li, file, 170, 16, 5291);
			},
			m: function mount(target, anchor) {
				insert_dev(target, li, anchor);
				append_dev(li, div);
				append_dev(div, span);
				append_dev(span, t0);
				append_dev(li, t1);
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*calendarData*/ 8 && t0_value !== (t0_value = /*day*/ ctx[20].num + "")) set_data_dev(t0, t0_value);

				if (dirty[0] & /*calendarData*/ 8 && li_class_value !== (li_class_value = "calendar-day " + (/*day*/ ctx[20].isCurrentMonth
				? 'current-month'
				: 'other-month') + " " + (/*day*/ ctx[20].isToday ? 'today' : '') + " svelte-glgx6q")) {
					attr_dev(li, "class", li_class_value);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(li);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(170:12) {#each calendarData.days as day}",
			ctx
		});

		return block;
	}

	function create_fragment(ctx) {
		let div2;
		let link;
		let t0;
		let div0;
		let select0;
		let t1;
		let select1;
		let t2;
		let button0;
		let t4;
		let button1;
		let t6;
		let button2;
		let t8;
		let div1;
		let ul0;
		let t9;
		let ul1;
		let mounted;
		let dispose;
		let each_value_3 = ensure_array_like_dev(/*calendarData*/ ctx[3].years);
		let each_blocks_3 = [];

		for (let i = 0; i < each_value_3.length; i += 1) {
			each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
		}

		let each_value_2 = ensure_array_like_dev(/*calendarData*/ ctx[3].months);
		let each_blocks_2 = [];

		for (let i = 0; i < each_value_2.length; i += 1) {
			each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
		}

		let each_value_1 = ensure_array_like_dev(/*calendarData*/ ctx[3].weekNames);
		let each_blocks_1 = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
		}

		let each_value = ensure_array_like_dev(/*calendarData*/ ctx[3].days);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		const block = {
			c: function create() {
				div2 = element("div");
				link = element("link");
				t0 = space();
				div0 = element("div");
				select0 = element("select");

				for (let i = 0; i < each_blocks_3.length; i += 1) {
					each_blocks_3[i].c();
				}

				t1 = space();
				select1 = element("select");

				for (let i = 0; i < each_blocks_2.length; i += 1) {
					each_blocks_2[i].c();
				}

				t2 = space();
				button0 = element("button");
				button0.textContent = "Today";
				t4 = space();
				button1 = element("button");
				button1.textContent = "Previous Month";
				t6 = space();
				button2 = element("button");
				button2.textContent = "Next Month";
				t8 = space();
				div1 = element("div");
				ul0 = element("ul");

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].c();
				}

				t9 = space();
				ul1 = element("ul");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr_dev(link, "rel", "stylesheet");
				attr_dev(link, "href", "global.css");
				add_location(link, file, 131, 4, 3969);
				attr_dev(select0, "name", "calendar-selector-year");
				attr_dev(select0, "aria-label", "Year");
				attr_dev(select0, "class", "svelte-glgx6q");
				if (/*calendarData*/ ctx[3].selectedYear === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[11].call(select0));
				add_location(select0, file, 133, 8, 4057);
				attr_dev(select1, "name", "calendar-selector-month");
				attr_dev(select1, "aria-label", "Month");
				attr_dev(select1, "class", "svelte-glgx6q");
				if (/*calendarData*/ ctx[3].selectedMonth === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[13].call(select1));
				add_location(select1, file, 145, 8, 4425);
				add_location(button0, file, 157, 8, 4801);
				add_location(button1, file, 158, 8, 4861);
				add_location(button2, file, 159, 8, 4932);
				attr_dev(div0, "class", "calendar-controls svelte-glgx6q");
				add_location(div0, file, 132, 4, 4017);
				attr_dev(ul0, "class", "calendar-weekdays svelte-glgx6q");
				add_location(ul0, file, 163, 8, 5039);
				attr_dev(ul1, "class", "calendar-days svelte-glgx6q");
				add_location(ul1, file, 168, 8, 5203);
				attr_dev(div1, "class", "calendar-view svelte-glgx6q");
				add_location(div1, file, 162, 4, 5003);
				attr_dev(div2, "class", "calendar-container svelte-glgx6q");
				attr_dev(div2, "data-theme", /*theme*/ ctx[0]);
				add_location(div2, file, 130, 0, 3913);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div2, anchor);
				append_dev(div2, link);
				append_dev(div2, t0);
				append_dev(div2, div0);
				append_dev(div0, select0);

				for (let i = 0; i < each_blocks_3.length; i += 1) {
					if (each_blocks_3[i]) {
						each_blocks_3[i].m(select0, null);
					}
				}

				/*select0_binding*/ ctx[10](select0);
				select_option(select0, /*calendarData*/ ctx[3].selectedYear, true);
				append_dev(div0, t1);
				append_dev(div0, select1);

				for (let i = 0; i < each_blocks_2.length; i += 1) {
					if (each_blocks_2[i]) {
						each_blocks_2[i].m(select1, null);
					}
				}

				/*select1_binding*/ ctx[12](select1);
				select_option(select1, /*calendarData*/ ctx[3].selectedMonth, true);
				append_dev(div0, t2);
				append_dev(div0, button0);
				append_dev(div0, t4);
				append_dev(div0, button1);
				append_dev(div0, t6);
				append_dev(div0, button2);
				append_dev(div2, t8);
				append_dev(div2, div1);
				append_dev(div1, ul0);

				for (let i = 0; i < each_blocks_1.length; i += 1) {
					if (each_blocks_1[i]) {
						each_blocks_1[i].m(ul0, null);
					}
				}

				append_dev(div1, t9);
				append_dev(div1, ul1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(ul1, null);
					}
				}

				if (!mounted) {
					dispose = [
						listen_dev(select0, "change", /*moveDateBySelector*/ ctx[7], false, false, false, false),
						listen_dev(select0, "change", /*select0_change_handler*/ ctx[11]),
						listen_dev(select1, "change", /*moveDateBySelector*/ ctx[7], false, false, false, false),
						listen_dev(select1, "change", /*select1_change_handler*/ ctx[13]),
						listen_dev(button0, "click", /*click_handler*/ ctx[14], false, false, false, false),
						listen_dev(button1, "click", /*movePreviousMonth*/ ctx[5], false, false, false, false),
						listen_dev(button2, "click", /*moveNextMonth*/ ctx[6], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*calendarData*/ 8) {
					each_value_3 = ensure_array_like_dev(/*calendarData*/ ctx[3].years);
					let i;

					for (i = 0; i < each_value_3.length; i += 1) {
						const child_ctx = get_each_context_3(ctx, each_value_3, i);

						if (each_blocks_3[i]) {
							each_blocks_3[i].p(child_ctx, dirty);
						} else {
							each_blocks_3[i] = create_each_block_3(child_ctx);
							each_blocks_3[i].c();
							each_blocks_3[i].m(select0, null);
						}
					}

					for (; i < each_blocks_3.length; i += 1) {
						each_blocks_3[i].d(1);
					}

					each_blocks_3.length = each_value_3.length;
				}

				if (dirty[0] & /*calendarData*/ 8) {
					select_option(select0, /*calendarData*/ ctx[3].selectedYear);
				}

				if (dirty[0] & /*calendarData*/ 8) {
					each_value_2 = ensure_array_like_dev(/*calendarData*/ ctx[3].months);
					let i;

					for (i = 0; i < each_value_2.length; i += 1) {
						const child_ctx = get_each_context_2(ctx, each_value_2, i);

						if (each_blocks_2[i]) {
							each_blocks_2[i].p(child_ctx, dirty);
						} else {
							each_blocks_2[i] = create_each_block_2(child_ctx);
							each_blocks_2[i].c();
							each_blocks_2[i].m(select1, null);
						}
					}

					for (; i < each_blocks_2.length; i += 1) {
						each_blocks_2[i].d(1);
					}

					each_blocks_2.length = each_value_2.length;
				}

				if (dirty[0] & /*calendarData*/ 8) {
					select_option(select1, /*calendarData*/ ctx[3].selectedMonth);
				}

				if (dirty[0] & /*calendarData*/ 8) {
					each_value_1 = ensure_array_like_dev(/*calendarData*/ ctx[3].weekNames);
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_1, i);

						if (each_blocks_1[i]) {
							each_blocks_1[i].p(child_ctx, dirty);
						} else {
							each_blocks_1[i] = create_each_block_1(child_ctx);
							each_blocks_1[i].c();
							each_blocks_1[i].m(ul0, null);
						}
					}

					for (; i < each_blocks_1.length; i += 1) {
						each_blocks_1[i].d(1);
					}

					each_blocks_1.length = each_value_1.length;
				}

				if (dirty[0] & /*calendarData*/ 8) {
					each_value = ensure_array_like_dev(/*calendarData*/ ctx[3].days);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ul1, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}

				if (dirty[0] & /*theme*/ 1) {
					attr_dev(div2, "data-theme", /*theme*/ ctx[0]);
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div2);
				}

				destroy_each(each_blocks_3, detaching);
				/*select0_binding*/ ctx[10](null);
				destroy_each(each_blocks_2, detaching);
				/*select1_binding*/ ctx[12](null);
				destroy_each(each_blocks_1, detaching);
				destroy_each(each_blocks, detaching);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('my-calendar', slots, []);
		let theme = "light";

		function setThemeFromHTML() {
			$$invalidate(0, theme = document.documentElement.getAttribute("data-theme") || "light");
		}

		function observeThemeChanges() {
			const observer = new MutationObserver(mutations => {
					for (const mutation of mutations) {
						if (mutation.attributeName === "data-theme") {
							setThemeFromHTML();
						}
					}
				});

			observer.observe(document.documentElement, { attributes: true });
		}

		let { yearRangeBefore = 2 } = $$props;
		let { yearRangeAfter = 1 } = $$props;
		let selectorYear, selectorMonth;

		const calendarData = {
			selectedYear: 0,
			selectedMonth: 0,
			weekNames: [],
			years: [],
			months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			days: []
		};

		const setupSelectorYears = date => {
			$$invalidate(3, calendarData.selectedYear = parseInt(moment(date).format("YYYY")), calendarData);
			const beginYear = calendarData.selectedYear - yearRangeBefore;
			const endYear = calendarData.selectedYear + yearRangeAfter;
			$$invalidate(3, calendarData.years = [], calendarData);

			for (let i = beginYear; i <= endYear; i++) {
				calendarData.years.push(i);
			}
		};

		const setupSelectorMonths = date => {
			$$invalidate(3, calendarData.selectedMonth = parseInt(moment(date).format("MM")), calendarData);
			$$invalidate(3, calendarData.months = [], calendarData);

			for (let i = 1; i <= 12; i++) {
				calendarData.months.push(i);
			}
		};

		const moveToday = () => {
			const today = moment();
			setupDays(today);
		};

		const movePreviousMonth = wtf => {
			const ym = `${calendarData.selectedYear}-${calendarData.selectedMonth}`;
			const previousMonth = moment(ym, "YYYY-MM").subtract(1, "month");
			setupDays(previousMonth);
		};

		const moveNextMonth = () => {
			const ym = `${calendarData.selectedYear}-${calendarData.selectedMonth}`;
			const nextMonth = moment(ym, "YYYY-MM").add(1, "month");
			setupDays(nextMonth);
		};

		const moveDateBySelector = () => {
			if (selectorYear && selectorMonth) {
				$$invalidate(3, calendarData.selectedYear = parseInt(selectorYear.value), calendarData);
				$$invalidate(3, calendarData.selectedMonth = parseInt(selectorMonth.value), calendarData);
				const ym = `${calendarData.selectedYear}-${calendarData.selectedMonth}`;
				const selectedYearMonth = moment(ym, "YYYY-MM");
				setupDays(selectedYearMonth);
			}
		};

		const setupDays = referenceDate => {
			const weekNames = moment.weekdaysShort(true);
			$$invalidate(3, calendarData.weekNames = weekNames, calendarData);
			const refDay = moment(referenceDate); // normally today
			$$invalidate(3, calendarData.selectedMonth = parseInt(refDay.format("MM")), calendarData);
			$$invalidate(3, calendarData.selectedYear = parseInt(refDay.format("YYYY")), calendarData);
			$$invalidate(3, calendarData.days = [], calendarData);
			const startOfMonth = moment(refDay).startOf("month");
			const endOfMonth = moment(refDay).endOf("month");
			const startOfCalendar = moment(startOfMonth).startOf("week");
			const endOfCalendar = moment(endOfMonth).endOf("week");
			const day = startOfCalendar;

			while (day.isSameOrBefore(endOfCalendar)) {
				calendarData.days.push({
					num: day.format("D"),
					isCurrentMonth: day.isSame(refDay, "month"),
					isToday: day.isSame(moment(), "day")
				});

				day.add(1, "day");
			}
		};

		onMount(() => {
			setThemeFromHTML();
			observeThemeChanges();
			moment.locale("ko");
			const today = moment();
			setupSelectorYears(today);
			setupSelectorMonths(today);
			setupDays(today);
		});

		onDestroy(() => {
			observer.disconnect();
		});

		const writable_props = ['yearRangeBefore', 'yearRangeAfter'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<my-calendar> was created with unknown prop '${key}'`);
		});

		function select0_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				selectorYear = $$value;
				$$invalidate(1, selectorYear);
			});
		}

		function select0_change_handler() {
			calendarData.selectedYear = select_value(this);
			$$invalidate(3, calendarData);
		}

		function select1_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				selectorMonth = $$value;
				$$invalidate(2, selectorMonth);
			});
		}

		function select1_change_handler() {
			calendarData.selectedMonth = select_value(this);
			$$invalidate(3, calendarData);
		}

		const click_handler = () => moveToday();

		$$self.$$set = $$props => {
			if ('yearRangeBefore' in $$props) $$invalidate(8, yearRangeBefore = $$props.yearRangeBefore);
			if ('yearRangeAfter' in $$props) $$invalidate(9, yearRangeAfter = $$props.yearRangeAfter);
		};

		$$self.$capture_state = () => ({
			moment,
			onMount,
			onDestroy,
			theme,
			setThemeFromHTML,
			observeThemeChanges,
			yearRangeBefore,
			yearRangeAfter,
			selectorYear,
			selectorMonth,
			calendarData,
			setupSelectorYears,
			setupSelectorMonths,
			moveToday,
			movePreviousMonth,
			moveNextMonth,
			moveDateBySelector,
			setupDays
		});

		$$self.$inject_state = $$props => {
			if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
			if ('yearRangeBefore' in $$props) $$invalidate(8, yearRangeBefore = $$props.yearRangeBefore);
			if ('yearRangeAfter' in $$props) $$invalidate(9, yearRangeAfter = $$props.yearRangeAfter);
			if ('selectorYear' in $$props) $$invalidate(1, selectorYear = $$props.selectorYear);
			if ('selectorMonth' in $$props) $$invalidate(2, selectorMonth = $$props.selectorMonth);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			theme,
			selectorYear,
			selectorMonth,
			calendarData,
			moveToday,
			movePreviousMonth,
			moveNextMonth,
			moveDateBySelector,
			yearRangeBefore,
			yearRangeAfter,
			select0_binding,
			select0_change_handler,
			select1_binding,
			select1_change_handler,
			click_handler
		];
	}

	class Calendar extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, { yearRangeBefore: 8, yearRangeAfter: 9 }, add_css, [-1, -1]);

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Calendar",
				options,
				id: create_fragment.name
			});
		}

		get yearRangeBefore() {
			return this.$$.ctx[8];
		}

		set yearRangeBefore(yearRangeBefore) {
			this.$$set({ yearRangeBefore });
			flush();
		}

		get yearRangeAfter() {
			return this.$$.ctx[9];
		}

		set yearRangeAfter(yearRangeAfter) {
			this.$$set({ yearRangeAfter });
			flush();
		}
	}

	customElements.define("my-calendar", create_custom_element(Calendar, {"yearRangeBefore":{},"yearRangeAfter":{}}, [], [], true));

	exports.Calendar = Calendar;
	exports.Clock = Clock;
	exports.Counter = Counter;

	return exports;

})({});
//# sourceMappingURL=components.js.map
