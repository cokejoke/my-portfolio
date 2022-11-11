
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function assign$1(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign$1($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
    }
    function append$1(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$1() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children$1(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
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
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind$1(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
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
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
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
                const nodes = children$1(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append$1(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * Combines valid class names.
     *
     * @param classes - An array with classes.
     *
     * @return A concatenated string with provided class names.
     */
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    /**
     * Iterates over the provided object by own enumerable keys with calling the iteratee function.
     *
     * @param object   - An object to iterate over.
     * @param iteratee - An iteratee function that takes the value and key as arguments.
     *
     * @return A provided object itself.
     */
    function forOwn$1(object, iteratee) {
        if (object) {
            const keys = Object.keys(object);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key !== '__proto__') {
                    if (iteratee(object[key], key) === false) {
                        break;
                    }
                }
            }
        }
        return object;
    }

    function getSlides(splide) {
        const children = splide.Components.Elements?.list.children;
        return children && Array.prototype.slice.call(children) || [];
    }

    /**
     * Checks if the given subject is an object or not.
     *
     * @param subject - A subject to check.
     *
     * @return `true` if the subject is an object, or otherwise `false`.
     */
    function isObject$1(subject) {
        return subject !== null && typeof subject === 'object';
    }

    /**
     * Checks if provided two arrays are shallowly equal or not.
     *
     * @param subject1 - An array to test.
     * @param subject2 - Anther array to test.
     *
     * @return `true` if they are considered as equal, or otherwise `false`.
     */
    function isEqualDeep(subject1, subject2) {
        if (Array.isArray(subject1) && Array.isArray(subject2)) {
            return subject1.length === subject2.length
                && !subject1.some((elm, index) => !isEqualDeep(elm, subject2[index]));
        }
        if (isObject$1(subject1) && isObject$1(subject2)) {
            const keys1 = Object.keys(subject1);
            const keys2 = Object.keys(subject2);
            return keys1.length === keys2.length && !keys1.some(key => {
                return !Object.prototype.hasOwnProperty.call(subject2, key)
                    || !isEqualDeep(subject1[key], subject2[key]);
            });
        }
        return subject1 === subject2;
    }

    /**
     * Checks if provided two arrays are shallowly equal or not.
     *
     * @param array1 - An array to test.
     * @param array2 - Anther array to test.
     *
     * @return `true` if they are considered as equal, or otherwise `false`.
     */
    function isEqualShallow(array1, array2) {
        return array1.length === array2.length
            && !array1.some((elm, index) => elm !== array2[index]);
    }

    /**
     * Recursively merges source properties to the object.
     * Be aware that this method does not merge arrays. They are just duplicated by `slice()`.
     *
     * @param object - An object to merge properties to.
     * @param source - A source object to merge properties from.
     *
     * @return A new object with merged properties.
     */
    function merge$1(object, source) {
        const merged = object;
        forOwn$1(source, (value, key) => {
            if (Array.isArray(value)) {
                merged[key] = value.slice();
            }
            else if (isObject$1(value)) {
                merged[key] = merge$1(isObject$1(merged[key]) ? merged[key] : {}, value);
            }
            else {
                merged[key] = value;
            }
        });
        return merged;
    }

    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

    /*!
     * Splide.js
     * Version  : 4.0.4
     * License  : MIT
     * Copyright: 2022 Naotoshi Fujita
     */
    var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
    var CREATED = 1;
    var MOUNTED = 2;
    var IDLE = 3;
    var MOVING = 4;
    var SCROLLING = 5;
    var DRAGGING = 6;
    var DESTROYED = 7;
    var STATES = {
      CREATED: CREATED,
      MOUNTED: MOUNTED,
      IDLE: IDLE,
      MOVING: MOVING,
      SCROLLING: SCROLLING,
      DRAGGING: DRAGGING,
      DESTROYED: DESTROYED
    };

    function empty(array) {
      array.length = 0;
    }

    function slice(arrayLike, start, end) {
      return Array.prototype.slice.call(arrayLike, start, end);
    }

    function apply(func) {
      return func.bind.apply(func, [null].concat(slice(arguments, 1)));
    }

    var nextTick = setTimeout;

    var noop = function noop() {};

    function raf(func) {
      return requestAnimationFrame(func);
    }

    function typeOf(type, subject) {
      return typeof subject === type;
    }

    function isObject(subject) {
      return !isNull(subject) && typeOf("object", subject);
    }

    var isArray = Array.isArray;
    var isFunction = apply(typeOf, "function");
    var isString = apply(typeOf, "string");
    var isUndefined = apply(typeOf, "undefined");

    function isNull(subject) {
      return subject === null;
    }

    function isHTMLElement(subject) {
      return subject instanceof HTMLElement;
    }

    function toArray(value) {
      return isArray(value) ? value : [value];
    }

    function forEach(values, iteratee) {
      toArray(values).forEach(iteratee);
    }

    function includes(array, value) {
      return array.indexOf(value) > -1;
    }

    function push(array, items) {
      array.push.apply(array, toArray(items));
      return array;
    }

    function toggleClass(elm, classes, add) {
      if (elm) {
        forEach(classes, function (name) {
          if (name) {
            elm.classList[add ? "add" : "remove"](name);
          }
        });
      }
    }

    function addClass(elm, classes) {
      toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
    }

    function append(parent, children) {
      forEach(children, parent.appendChild.bind(parent));
    }

    function before(nodes, ref) {
      forEach(nodes, function (node) {
        var parent = (ref || node).parentNode;

        if (parent) {
          parent.insertBefore(node, ref);
        }
      });
    }

    function matches(elm, selector) {
      return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
    }

    function children(parent, selector) {
      var children2 = parent ? slice(parent.children) : [];
      return selector ? children2.filter(function (child) {
        return matches(child, selector);
      }) : children2;
    }

    function child(parent, selector) {
      return selector ? children(parent, selector)[0] : parent.firstElementChild;
    }

    var ownKeys = Object.keys;

    function forOwn(object, iteratee, right) {
      if (object) {
        var keys = ownKeys(object);
        keys = right ? keys.reverse() : keys;

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];

          if (key !== "__proto__") {
            if (iteratee(object[key], key) === false) {
              break;
            }
          }
        }
      }

      return object;
    }

    function assign(object) {
      slice(arguments, 1).forEach(function (source) {
        forOwn(source, function (value, key) {
          object[key] = source[key];
        });
      });
      return object;
    }

    function merge(object) {
      slice(arguments, 1).forEach(function (source) {
        forOwn(source, function (value, key) {
          if (isArray(value)) {
            object[key] = value.slice();
          } else if (isObject(value)) {
            object[key] = merge({}, isObject(object[key]) ? object[key] : {}, value);
          } else {
            object[key] = value;
          }
        });
      });
      return object;
    }

    function omit(object, keys) {
      toArray(keys || ownKeys(object)).forEach(function (key) {
        delete object[key];
      });
    }

    function removeAttribute(elms, attrs) {
      forEach(elms, function (elm) {
        forEach(attrs, function (attr) {
          elm && elm.removeAttribute(attr);
        });
      });
    }

    function setAttribute(elms, attrs, value) {
      if (isObject(attrs)) {
        forOwn(attrs, function (value2, name) {
          setAttribute(elms, name, value2);
        });
      } else {
        forEach(elms, function (elm) {
          isNull(value) || value === "" ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
        });
      }
    }

    function create(tag, attrs, parent) {
      var elm = document.createElement(tag);

      if (attrs) {
        isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
      }

      parent && append(parent, elm);
      return elm;
    }

    function style(elm, prop, value) {
      if (isUndefined(value)) {
        return getComputedStyle(elm)[prop];
      }

      if (!isNull(value)) {
        elm.style[prop] = "" + value;
      }
    }

    function display(elm, display2) {
      style(elm, "display", display2);
    }

    function focus(elm) {
      elm["setActive"] && elm["setActive"]() || elm.focus({
        preventScroll: true
      });
    }

    function getAttribute(elm, attr) {
      return elm.getAttribute(attr);
    }

    function hasClass(elm, className) {
      return elm && elm.classList.contains(className);
    }

    function rect(target) {
      return target.getBoundingClientRect();
    }

    function remove(nodes) {
      forEach(nodes, function (node) {
        if (node && node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
    }

    function parseHtml(html) {
      return child(new DOMParser().parseFromString(html, "text/html").body);
    }

    function prevent(e, stopPropagation) {
      e.preventDefault();

      if (stopPropagation) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function query(parent, selector) {
      return parent && parent.querySelector(selector);
    }

    function queryAll(parent, selector) {
      return selector ? slice(parent.querySelectorAll(selector)) : [];
    }

    function removeClass(elm, classes) {
      toggleClass(elm, classes, false);
    }

    function timeOf(e) {
      return e.timeStamp;
    }

    function unit(value) {
      return isString(value) ? value : value ? value + "px" : "";
    }

    var PROJECT_CODE = "splide";
    var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;

    function assert(condition, message) {
      if (!condition) {
        throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
      }
    }

    var min = Math.min,
        max = Math.max,
        floor = Math.floor,
        ceil = Math.ceil,
        abs = Math.abs;

    function approximatelyEqual(x, y, epsilon) {
      return abs(x - y) < epsilon;
    }

    function between(number, minOrMax, maxOrMin, exclusive) {
      var minimum = min(minOrMax, maxOrMin);
      var maximum = max(minOrMax, maxOrMin);
      return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
    }

    function clamp(number, x, y) {
      var minimum = min(x, y);
      var maximum = max(x, y);
      return min(max(minimum, number), maximum);
    }

    function sign(x) {
      return +(x > 0) - +(x < 0);
    }

    function format(string, replacements) {
      forEach(replacements, function (replacement) {
        string = string.replace("%s", "" + replacement);
      });
      return string;
    }

    function pad(number) {
      return number < 10 ? "0" + number : "" + number;
    }

    var ids = {};

    function uniqueId(prefix) {
      return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
    }

    function EventBinder() {
      var listeners = [];

      function bind(targets, events, callback, options) {
        forEachEvent(targets, events, function (target, event, namespace) {
          var isEventTarget = ("addEventListener" in target);
          var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
          isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
          listeners.push([target, event, namespace, callback, remover]);
        });
      }

      function unbind(targets, events, callback) {
        forEachEvent(targets, events, function (target, event, namespace) {
          listeners = listeners.filter(function (listener) {
            if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
              listener[4]();
              return false;
            }

            return true;
          });
        });
      }

      function dispatch(target, type, detail) {
        var e;
        var bubbles = true;

        if (typeof CustomEvent === "function") {
          e = new CustomEvent(type, {
            bubbles: bubbles,
            detail: detail
          });
        } else {
          e = document.createEvent("CustomEvent");
          e.initCustomEvent(type, bubbles, false, detail);
        }

        target.dispatchEvent(e);
        return e;
      }

      function forEachEvent(targets, events, iteratee) {
        forEach(targets, function (target) {
          target && forEach(events, function (events2) {
            events2.split(" ").forEach(function (eventNS) {
              var fragment = eventNS.split(".");
              iteratee(target, fragment[0], fragment[1]);
            });
          });
        });
      }

      function destroy() {
        listeners.forEach(function (data) {
          data[4]();
        });
        empty(listeners);
      }

      return {
        bind: bind,
        unbind: unbind,
        dispatch: dispatch,
        destroy: destroy
      };
    }

    var EVENT_MOUNTED = "mounted";
    var EVENT_READY = "ready";
    var EVENT_MOVE = "move";
    var EVENT_MOVED = "moved";
    var EVENT_SHIFTED = "shifted";
    var EVENT_CLICK = "click";
    var EVENT_ACTIVE = "active";
    var EVENT_INACTIVE = "inactive";
    var EVENT_VISIBLE = "visible";
    var EVENT_HIDDEN = "hidden";
    var EVENT_SLIDE_KEYDOWN = "slide:keydown";
    var EVENT_REFRESH = "refresh";
    var EVENT_UPDATED = "updated";
    var EVENT_RESIZE = "resize";
    var EVENT_RESIZED = "resized";
    var EVENT_DRAG = "drag";
    var EVENT_DRAGGING = "dragging";
    var EVENT_DRAGGED = "dragged";
    var EVENT_SCROLL = "scroll";
    var EVENT_SCROLLED = "scrolled";
    var EVENT_DESTROY = "destroy";
    var EVENT_ARROWS_MOUNTED = "arrows:mounted";
    var EVENT_ARROWS_UPDATED = "arrows:updated";
    var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
    var EVENT_PAGINATION_UPDATED = "pagination:updated";
    var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
    var EVENT_AUTOPLAY_PLAY = "autoplay:play";
    var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
    var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
    var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";

    function EventInterface(Splide2) {
      var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
      var binder = EventBinder();

      function on(events, callback) {
        binder.bind(bus, toArray(events).join(" "), function (e) {
          callback.apply(callback, isArray(e.detail) ? e.detail : []);
        });
      }

      function emit(event) {
        binder.dispatch(bus, event, slice(arguments, 1));
      }

      if (Splide2) {
        Splide2.event.on(EVENT_DESTROY, binder.destroy);
      }

      return assign(binder, {
        bus: bus,
        on: on,
        off: apply(binder.unbind, bus),
        emit: emit
      });
    }

    function RequestInterval(interval, onInterval, onUpdate, limit) {
      var now = Date.now;
      var startTime;
      var rate = 0;
      var id;
      var paused = true;
      var count = 0;

      function update() {
        if (!paused) {
          rate = interval ? min((now() - startTime) / interval, 1) : 1;
          onUpdate && onUpdate(rate);

          if (rate >= 1) {
            onInterval();
            startTime = now();

            if (limit && ++count >= limit) {
              return pause();
            }
          }

          raf(update);
        }
      }

      function start(resume) {
        !resume && cancel();
        startTime = now() - (resume ? rate * interval : 0);
        paused = false;
        raf(update);
      }

      function pause() {
        paused = true;
      }

      function rewind() {
        startTime = now();
        rate = 0;

        if (onUpdate) {
          onUpdate(rate);
        }
      }

      function cancel() {
        id && cancelAnimationFrame(id);
        rate = 0;
        id = 0;
        paused = true;
      }

      function set(time) {
        interval = time;
      }

      function isPaused() {
        return paused;
      }

      return {
        start: start,
        rewind: rewind,
        pause: pause,
        cancel: cancel,
        set: set,
        isPaused: isPaused
      };
    }

    function State(initialState) {
      var state = initialState;

      function set(value) {
        state = value;
      }

      function is(states) {
        return includes(toArray(states), state);
      }

      return {
        set: set,
        is: is
      };
    }

    function Throttle(func, duration) {
      var interval;

      function throttled() {
        if (!interval) {
          interval = RequestInterval(duration || 0, function () {
            func();
            interval = null;
          }, null, 1);
          interval.start();
        }
      }

      return throttled;
    }

    function Media(Splide2, Components2, options) {
      var state = Splide2.state;
      var breakpoints = options.breakpoints || {};
      var reducedMotion = options.reducedMotion || {};
      var binder = EventBinder();
      var queries = [];

      function setup() {
        var isMin = options.mediaQuery === "min";
        ownKeys(breakpoints).sort(function (n, m) {
          return isMin ? +n - +m : +m - +n;
        }).forEach(function (key) {
          register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
        });
        register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
        update();
      }

      function destroy(completely) {
        if (completely) {
          binder.destroy();
        }
      }

      function register(options2, query) {
        var queryList = matchMedia(query);
        binder.bind(queryList, "change", update);
        queries.push([options2, queryList]);
      }

      function update() {
        var destroyed = state.is(DESTROYED);
        var direction = options.direction;
        var merged = queries.reduce(function (merged2, entry) {
          return merge(merged2, entry[1].matches ? entry[0] : {});
        }, {});
        omit(options);
        set(merged);

        if (options.destroy) {
          Splide2.destroy(options.destroy === "completely");
        } else if (destroyed) {
          destroy(true);
          Splide2.mount();
        } else {
          direction !== options.direction && Splide2.refresh();
        }
      }

      function reduce(enable) {
        if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches) {
          enable ? merge(options, reducedMotion) : omit(options, ownKeys(reducedMotion));
        }
      }

      function set(opts, user) {
        merge(options, opts);
        user && merge(Object.getPrototypeOf(options), opts);

        if (!state.is(CREATED)) {
          Splide2.emit(EVENT_UPDATED, options);
        }
      }

      return {
        setup: setup,
        destroy: destroy,
        reduce: reduce,
        set: set
      };
    }

    var ARROW = "Arrow";
    var ARROW_LEFT = ARROW + "Left";
    var ARROW_RIGHT = ARROW + "Right";
    var ARROW_UP = ARROW + "Up";
    var ARROW_DOWN = ARROW + "Down";
    var RTL = "rtl";
    var TTB = "ttb";
    var ORIENTATION_MAP = {
      width: ["height"],
      left: ["top", "right"],
      right: ["bottom", "left"],
      x: ["y"],
      X: ["Y"],
      Y: ["X"],
      ArrowLeft: [ARROW_UP, ARROW_RIGHT],
      ArrowRight: [ARROW_DOWN, ARROW_LEFT]
    };

    function Direction(Splide2, Components2, options) {
      function resolve(prop, axisOnly, direction) {
        direction = direction || options.direction;
        var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
        return ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index] || prop.replace(/width|left|right/i, function (match, offset) {
          var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
          return offset > 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
        });
      }

      function orient(value) {
        return value * (options.direction === RTL ? 1 : -1);
      }

      return {
        resolve: resolve,
        orient: orient
      };
    }

    var ROLE = "role";
    var TAB_INDEX = "tabindex";
    var DISABLED = "disabled";
    var ARIA_PREFIX = "aria-";
    var ARIA_CONTROLS = ARIA_PREFIX + "controls";
    var ARIA_CURRENT = ARIA_PREFIX + "current";
    var ARIA_SELECTED = ARIA_PREFIX + "selected";
    var ARIA_LABEL = ARIA_PREFIX + "label";
    var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
    var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
    var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
    var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
    var ARIA_LIVE = ARIA_PREFIX + "live";
    var ARIA_BUSY = ARIA_PREFIX + "busy";
    var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
    var ALL_ATTRIBUTES = [ROLE, TAB_INDEX, DISABLED, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_LABELLEDBY, ARIA_HIDDEN, ARIA_ORIENTATION, ARIA_ROLEDESCRIPTION];
    var CLASS_ROOT = PROJECT_CODE;
    var CLASS_TRACK = PROJECT_CODE + "__track";
    var CLASS_LIST = PROJECT_CODE + "__list";
    var CLASS_SLIDE = PROJECT_CODE + "__slide";
    var CLASS_CLONE = CLASS_SLIDE + "--clone";
    var CLASS_CONTAINER = CLASS_SLIDE + "__container";
    var CLASS_ARROWS = PROJECT_CODE + "__arrows";
    var CLASS_ARROW = PROJECT_CODE + "__arrow";
    var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
    var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
    var CLASS_PAGINATION = PROJECT_CODE + "__pagination";
    var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
    var CLASS_PROGRESS = PROJECT_CODE + "__progress";
    var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
    var CLASS_TOGGLE = PROJECT_CODE + "__toggle";
    var CLASS_SPINNER = PROJECT_CODE + "__spinner";
    var CLASS_SR = PROJECT_CODE + "__sr";
    var CLASS_INITIALIZED = "is-initialized";
    var CLASS_ACTIVE = "is-active";
    var CLASS_PREV = "is-prev";
    var CLASS_NEXT = "is-next";
    var CLASS_VISIBLE = "is-visible";
    var CLASS_LOADING = "is-loading";
    var CLASS_FOCUS_IN = "is-focus-in";
    var STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING, CLASS_FOCUS_IN];
    var CLASSES = {
      slide: CLASS_SLIDE,
      clone: CLASS_CLONE,
      arrows: CLASS_ARROWS,
      arrow: CLASS_ARROW,
      prev: CLASS_ARROW_PREV,
      next: CLASS_ARROW_NEXT,
      pagination: CLASS_PAGINATION,
      page: CLASS_PAGINATION_PAGE,
      spinner: CLASS_SPINNER
    };

    function closest(from, selector) {
      if (isFunction(from.closest)) {
        return from.closest(selector);
      }

      var elm = from;

      while (elm && elm.nodeType === 1) {
        if (matches(elm, selector)) {
          break;
        }

        elm = elm.parentElement;
      }

      return elm;
    }

    var FRICTION = 5;
    var LOG_INTERVAL = 200;
    var POINTER_DOWN_EVENTS = "touchstart mousedown";
    var POINTER_MOVE_EVENTS = "touchmove mousemove";
    var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";

    function Elements(Splide2, Components2, options) {
      var _EventInterface = EventInterface(Splide2),
          on = _EventInterface.on,
          bind = _EventInterface.bind;

      var root = Splide2.root;
      var i18n = options.i18n;
      var elements = {};
      var slides = [];
      var rootClasses = [];
      var trackClasses = [];
      var track;
      var list;
      var isUsingKey;

      function setup() {
        collect();
        init();
        update();
      }

      function mount() {
        on(EVENT_REFRESH, destroy);
        on(EVENT_REFRESH, setup);
        on(EVENT_UPDATED, update);
        bind(document, POINTER_DOWN_EVENTS + " keydown", function (e) {
          isUsingKey = e.type === "keydown";
        }, {
          capture: true
        });
        bind(root, "focusin", function () {
          toggleClass(root, CLASS_FOCUS_IN, !!isUsingKey);
        });
      }

      function destroy(completely) {
        var attrs = ALL_ATTRIBUTES.concat("style");
        empty(slides);
        removeClass(root, rootClasses);
        removeClass(track, trackClasses);
        removeAttribute([track, list], attrs);
        removeAttribute(root, completely ? attrs : ["style", ARIA_ROLEDESCRIPTION]);
      }

      function update() {
        removeClass(root, rootClasses);
        removeClass(track, trackClasses);
        rootClasses = getClasses(CLASS_ROOT);
        trackClasses = getClasses(CLASS_TRACK);
        addClass(root, rootClasses);
        addClass(track, trackClasses);
        setAttribute(root, ARIA_LABEL, options.label);
        setAttribute(root, ARIA_LABELLEDBY, options.labelledby);
      }

      function collect() {
        track = find("." + CLASS_TRACK);
        list = child(track, "." + CLASS_LIST);
        assert(track && list, "A track/list element is missing.");
        push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
        forOwn({
          arrows: CLASS_ARROWS,
          pagination: CLASS_PAGINATION,
          prev: CLASS_ARROW_PREV,
          next: CLASS_ARROW_NEXT,
          bar: CLASS_PROGRESS_BAR,
          toggle: CLASS_TOGGLE
        }, function (className, key) {
          elements[key] = find("." + className);
        });
        assign(elements, {
          root: root,
          track: track,
          list: list,
          slides: slides
        });
      }

      function init() {
        var id = root.id || uniqueId(PROJECT_CODE);
        var role = options.role;
        root.id = id;
        track.id = track.id || id + "-track";
        list.id = list.id || id + "-list";

        if (!getAttribute(root, ROLE) && root.tagName !== "SECTION" && role) {
          setAttribute(root, ROLE, role);
        }

        setAttribute(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
        setAttribute(list, ROLE, "presentation");
      }

      function find(selector) {
        var elm = query(root, selector);
        return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
      }

      function getClasses(base) {
        return [base + "--" + options.type, base + "--" + options.direction, options.drag && base + "--draggable", options.isNavigation && base + "--nav", base === CLASS_ROOT && CLASS_ACTIVE];
      }

      return assign(elements, {
        setup: setup,
        mount: mount,
        destroy: destroy
      });
    }

    var SLIDE = "slide";
    var LOOP = "loop";
    var FADE = "fade";

    function Slide$1(Splide2, index, slideIndex, slide) {
      var event = EventInterface(Splide2);
      var on = event.on,
          emit = event.emit,
          bind = event.bind;
      var Components = Splide2.Components,
          root = Splide2.root,
          options = Splide2.options;
      var isNavigation = options.isNavigation,
          updateOnMove = options.updateOnMove,
          i18n = options.i18n,
          pagination = options.pagination,
          slideFocus = options.slideFocus;
      var resolve = Components.Direction.resolve;
      var styles = getAttribute(slide, "style");
      var label = getAttribute(slide, ARIA_LABEL);
      var isClone = slideIndex > -1;
      var container = child(slide, "." + CLASS_CONTAINER);
      var focusableNodes = queryAll(slide, options.focusableNodes || "");
      var destroyed;

      function mount() {
        if (!isClone) {
          slide.id = root.id + "-slide" + pad(index + 1);
          setAttribute(slide, ROLE, pagination ? "tabpanel" : "group");
          setAttribute(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
          setAttribute(slide, ARIA_LABEL, label || format(i18n.slideLabel, [index + 1, Splide2.length]));
        }

        listen();
      }

      function listen() {
        bind(slide, "click", apply(emit, EVENT_CLICK, self));
        bind(slide, "keydown", apply(emit, EVENT_SLIDE_KEYDOWN, self));
        on([EVENT_MOVED, EVENT_SHIFTED, EVENT_SCROLLED], update);
        on(EVENT_NAVIGATION_MOUNTED, initNavigation);

        if (updateOnMove) {
          on(EVENT_MOVE, onMove);
        }
      }

      function destroy() {
        destroyed = true;
        event.destroy();
        removeClass(slide, STATUS_CLASSES);
        removeAttribute(slide, ALL_ATTRIBUTES);
        setAttribute(slide, "style", styles);
        setAttribute(slide, ARIA_LABEL, label || "");
      }

      function initNavigation() {
        var controls = Splide2.splides.map(function (target) {
          var Slide2 = target.splide.Components.Slides.getAt(index);
          return Slide2 ? Slide2.slide.id : "";
        }).join(" ");
        setAttribute(slide, ARIA_LABEL, format(i18n.slideX, (isClone ? slideIndex : index) + 1));
        setAttribute(slide, ARIA_CONTROLS, controls);
        setAttribute(slide, ROLE, slideFocus ? "button" : "");
        slideFocus && removeAttribute(slide, ARIA_ROLEDESCRIPTION);
      }

      function onMove() {
        if (!destroyed) {
          update();
        }
      }

      function update() {
        if (!destroyed) {
          var curr = Splide2.index;
          updateActivity();
          updateVisibility();
          toggleClass(slide, CLASS_PREV, index === curr - 1);
          toggleClass(slide, CLASS_NEXT, index === curr + 1);
        }
      }

      function updateActivity() {
        var active = isActive();

        if (active !== hasClass(slide, CLASS_ACTIVE)) {
          toggleClass(slide, CLASS_ACTIVE, active);
          setAttribute(slide, ARIA_CURRENT, isNavigation && active || "");
          emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self);
        }
      }

      function updateVisibility() {
        var visible = isVisible();
        var hidden = !visible && (!isActive() || isClone);

        if (!Splide2.state.is([MOVING, SCROLLING])) {
          setAttribute(slide, ARIA_HIDDEN, hidden || "");
        }

        setAttribute(focusableNodes, TAB_INDEX, hidden ? -1 : "");

        if (slideFocus) {
          setAttribute(slide, TAB_INDEX, hidden ? -1 : 0);
        }

        if (visible !== hasClass(slide, CLASS_VISIBLE)) {
          toggleClass(slide, CLASS_VISIBLE, visible);
          emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self);
        }

        if (!visible && document.activeElement === slide) {
          var Slide2 = Components.Slides.getAt(Splide2.index);
          Slide2 && focus(Slide2.slide);
        }
      }

      function style$1(prop, value, useContainer) {
        style(useContainer && container || slide, prop, value);
      }

      function isActive() {
        var curr = Splide2.index;
        return curr === index || options.cloneStatus && curr === slideIndex;
      }

      function isVisible() {
        if (Splide2.is(FADE)) {
          return isActive();
        }

        var trackRect = rect(Components.Elements.track);
        var slideRect = rect(slide);
        var left = resolve("left");
        var right = resolve("right");
        return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
      }

      function isWithin(from, distance) {
        var diff = abs(from - index);

        if (!isClone && (options.rewind || Splide2.is(LOOP))) {
          diff = min(diff, Splide2.length - diff);
        }

        return diff <= distance;
      }

      var self = {
        index: index,
        slideIndex: slideIndex,
        slide: slide,
        container: container,
        isClone: isClone,
        mount: mount,
        destroy: destroy,
        update: update,
        style: style$1,
        isWithin: isWithin
      };
      return self;
    }

    function Slides(Splide2, Components2, options) {
      var _EventInterface2 = EventInterface(Splide2),
          on = _EventInterface2.on,
          emit = _EventInterface2.emit,
          bind = _EventInterface2.bind;

      var _Components2$Elements = Components2.Elements,
          slides = _Components2$Elements.slides,
          list = _Components2$Elements.list;
      var Slides2 = [];

      function mount() {
        init();
        on(EVENT_REFRESH, destroy);
        on(EVENT_REFRESH, init);
        on([EVENT_MOUNTED, EVENT_REFRESH], function () {
          Slides2.sort(function (Slide1, Slide2) {
            return Slide1.index - Slide2.index;
          });
        });
      }

      function init() {
        slides.forEach(function (slide, index) {
          register(slide, index, -1);
        });
      }

      function destroy() {
        forEach$1(function (Slide2) {
          Slide2.destroy();
        });
        empty(Slides2);
      }

      function update() {
        forEach$1(function (Slide2) {
          Slide2.update();
        });
      }

      function register(slide, index, slideIndex) {
        var object = Slide$1(Splide2, index, slideIndex, slide);
        object.mount();
        Slides2.push(object);
      }

      function get(excludeClones) {
        return excludeClones ? filter(function (Slide2) {
          return !Slide2.isClone;
        }) : Slides2;
      }

      function getIn(page) {
        var Controller = Components2.Controller;
        var index = Controller.toIndex(page);
        var max = Controller.hasFocus() ? 1 : options.perPage;
        return filter(function (Slide2) {
          return between(Slide2.index, index, index + max - 1);
        });
      }

      function getAt(index) {
        return filter(index)[0];
      }

      function add(items, index) {
        forEach(items, function (slide) {
          if (isString(slide)) {
            slide = parseHtml(slide);
          }

          if (isHTMLElement(slide)) {
            var ref = slides[index];
            ref ? before(slide, ref) : append(list, slide);
            addClass(slide, options.classes.slide);
            observeImages(slide, apply(emit, EVENT_RESIZE));
          }
        });
        emit(EVENT_REFRESH);
      }

      function remove$1(matcher) {
        remove(filter(matcher).map(function (Slide2) {
          return Slide2.slide;
        }));
        emit(EVENT_REFRESH);
      }

      function forEach$1(iteratee, excludeClones) {
        get(excludeClones).forEach(iteratee);
      }

      function filter(matcher) {
        return Slides2.filter(isFunction(matcher) ? matcher : function (Slide2) {
          return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
        });
      }

      function style(prop, value, useContainer) {
        forEach$1(function (Slide2) {
          Slide2.style(prop, value, useContainer);
        });
      }

      function observeImages(elm, callback) {
        var images = queryAll(elm, "img");
        var length = images.length;

        if (length) {
          images.forEach(function (img) {
            bind(img, "load error", function () {
              if (! --length) {
                callback();
              }
            });
          });
        } else {
          callback();
        }
      }

      function getLength(excludeClones) {
        return excludeClones ? slides.length : Slides2.length;
      }

      function isEnough() {
        return Slides2.length > options.perPage;
      }

      return {
        mount: mount,
        destroy: destroy,
        update: update,
        register: register,
        get: get,
        getIn: getIn,
        getAt: getAt,
        add: add,
        remove: remove$1,
        forEach: forEach$1,
        filter: filter,
        style: style,
        getLength: getLength,
        isEnough: isEnough
      };
    }

    function Layout(Splide2, Components2, options) {
      var _EventInterface3 = EventInterface(Splide2),
          on = _EventInterface3.on,
          bind = _EventInterface3.bind,
          emit = _EventInterface3.emit;

      var Slides = Components2.Slides;
      var resolve = Components2.Direction.resolve;
      var _Components2$Elements2 = Components2.Elements,
          root = _Components2$Elements2.root,
          track = _Components2$Elements2.track,
          list = _Components2$Elements2.list;
      var getAt = Slides.getAt,
          styleSlides = Slides.style;
      var vertical;
      var rootRect;

      function mount() {
        init();
        bind(window, "resize load", Throttle(apply(emit, EVENT_RESIZE)));
        on([EVENT_UPDATED, EVENT_REFRESH], init);
        on(EVENT_RESIZE, resize);
      }

      function init() {
        rootRect = null;
        vertical = options.direction === TTB;
        style(root, "maxWidth", unit(options.width));
        style(track, resolve("paddingLeft"), cssPadding(false));
        style(track, resolve("paddingRight"), cssPadding(true));
        resize();
      }

      function resize() {
        var newRect = rect(root);

        if (!rootRect || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
          style(track, "height", cssTrackHeight());
          styleSlides(resolve("marginRight"), unit(options.gap));
          styleSlides("width", cssSlideWidth());
          styleSlides("height", cssSlideHeight(), true);
          rootRect = newRect;
          emit(EVENT_RESIZED);
        }
      }

      function cssPadding(right) {
        var padding = options.padding;
        var prop = resolve(right ? "right" : "left");
        return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
      }

      function cssTrackHeight() {
        var height = "";

        if (vertical) {
          height = cssHeight();
          assert(height, "height or heightRatio is missing.");
          height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
        }

        return height;
      }

      function cssHeight() {
        return unit(options.height || rect(list).width * options.heightRatio);
      }

      function cssSlideWidth() {
        return options.autoWidth ? null : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
      }

      function cssSlideHeight() {
        return unit(options.fixedHeight) || (vertical ? options.autoHeight ? null : cssSlideSize() : cssHeight());
      }

      function cssSlideSize() {
        var gap = unit(options.gap);
        return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
      }

      function listSize() {
        return rect(list)[resolve("width")];
      }

      function slideSize(index, withoutGap) {
        var Slide = getAt(index || 0);
        return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
      }

      function totalSize(index, withoutGap) {
        var Slide = getAt(index);

        if (Slide) {
          var right = rect(Slide.slide)[resolve("right")];
          var left = rect(list)[resolve("left")];
          return abs(right - left) + (withoutGap ? 0 : getGap());
        }

        return 0;
      }

      function sliderSize() {
        return totalSize(Splide2.length - 1, true) - totalSize(-1, true);
      }

      function getGap() {
        var Slide = getAt(0);
        return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
      }

      function getPadding(right) {
        return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
      }

      return {
        mount: mount,
        listSize: listSize,
        slideSize: slideSize,
        sliderSize: sliderSize,
        totalSize: totalSize,
        getPadding: getPadding
      };
    }

    var MULTIPLIER = 2;

    function Clones(Splide2, Components2, options) {
      var _EventInterface4 = EventInterface(Splide2),
          on = _EventInterface4.on,
          emit = _EventInterface4.emit;

      var Elements = Components2.Elements,
          Slides = Components2.Slides;
      var resolve = Components2.Direction.resolve;
      var clones = [];
      var cloneCount;

      function mount() {
        init();
        on(EVENT_REFRESH, destroy);
        on(EVENT_REFRESH, init);
        on([EVENT_UPDATED, EVENT_RESIZE], observe);
      }

      function init() {
        if (cloneCount = computeCloneCount()) {
          generate(cloneCount);
          emit(EVENT_RESIZE);
        }
      }

      function destroy() {
        remove(clones);
        empty(clones);
      }

      function observe() {
        if (cloneCount < computeCloneCount()) {
          emit(EVENT_REFRESH);
        }
      }

      function generate(count) {
        var slides = Slides.get().slice();
        var length = slides.length;

        if (length) {
          while (slides.length < count) {
            push(slides, slides);
          }

          push(slides.slice(-count), slides.slice(0, count)).forEach(function (Slide, index) {
            var isHead = index < count;
            var clone = cloneDeep(Slide.slide, index);
            isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
            push(clones, clone);
            Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
          });
        }
      }

      function cloneDeep(elm, index) {
        var clone = elm.cloneNode(true);
        addClass(clone, options.classes.clone);
        clone.id = Splide2.root.id + "-clone" + pad(index + 1);
        return clone;
      }

      function computeCloneCount() {
        var clones2 = options.clones;

        if (!Splide2.is(LOOP)) {
          clones2 = 0;
        } else if (!clones2) {
          var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
          var fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
          clones2 = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage * MULTIPLIER;
        }

        return clones2;
      }

      return {
        mount: mount,
        destroy: destroy
      };
    }

    function Move(Splide2, Components2, options) {
      var _EventInterface5 = EventInterface(Splide2),
          on = _EventInterface5.on,
          emit = _EventInterface5.emit;

      var set = Splide2.state.set;
      var _Components2$Layout = Components2.Layout,
          slideSize = _Components2$Layout.slideSize,
          getPadding = _Components2$Layout.getPadding,
          totalSize = _Components2$Layout.totalSize,
          listSize = _Components2$Layout.listSize,
          sliderSize = _Components2$Layout.sliderSize;
      var _Components2$Directio = Components2.Direction,
          resolve = _Components2$Directio.resolve,
          orient = _Components2$Directio.orient;
      var _Components2$Elements3 = Components2.Elements,
          list = _Components2$Elements3.list,
          track = _Components2$Elements3.track;
      var Transition;

      function mount() {
        Transition = Components2.Transition;
        on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
      }

      function reposition() {
        if (!Components2.Controller.isBusy()) {
          Components2.Scroll.cancel();
          jump(Splide2.index);
          Components2.Slides.update();
        }
      }

      function move(dest, index, prev, callback) {
        var position = getPosition();
        var crossing = sign(dest - prev) * orient(toPosition(dest) - position) < 0;

        if ((dest !== index || crossing) && canShift(dest > prev)) {
          cancel();
          translate(shift(position, dest > prev), true);
        }

        set(MOVING);
        emit(EVENT_MOVE, index, prev, dest);
        Transition.start(index, function () {
          set(IDLE);
          emit(EVENT_MOVED, index, prev, dest);
          callback && callback();
        });
      }

      function jump(index) {
        translate(toPosition(index, true));
      }

      function translate(position, preventLoop) {
        if (!Splide2.is(FADE)) {
          var destination = preventLoop ? position : loop(position);
          style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
          position !== destination && emit(EVENT_SHIFTED);
        }
      }

      function loop(position) {
        if (Splide2.is(LOOP)) {
          var diff = orient(position - getPosition());
          var exceededMin = exceededLimit(false, position) && diff < 0;
          var exceededMax = exceededLimit(true, position) && diff > 0;

          if (exceededMin || exceededMax) {
            position = shift(position, exceededMax);
          }
        }

        return position;
      }

      function shift(position, backwards) {
        var excess = position - getLimit(backwards);
        var size = sliderSize();
        position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
        return position;
      }

      function cancel() {
        translate(getPosition());
        Transition.cancel();
      }

      function toIndex(position) {
        var Slides = Components2.Slides.get();
        var index = 0;
        var minDistance = Infinity;

        for (var i = 0; i < Slides.length; i++) {
          var slideIndex = Slides[i].index;
          var distance = abs(toPosition(slideIndex, true) - position);

          if (distance <= minDistance) {
            minDistance = distance;
            index = slideIndex;
          } else {
            break;
          }
        }

        return index;
      }

      function toPosition(index, trimming) {
        var position = orient(totalSize(index - 1) - offset(index));
        return trimming ? trim(position) : position;
      }

      function getPosition() {
        var left = resolve("left");
        return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
      }

      function trim(position) {
        if (options.trimSpace && Splide2.is(SLIDE)) {
          position = clamp(position, 0, orient(sliderSize() - listSize()));
        }

        return position;
      }

      function offset(index) {
        var focus = options.focus;
        return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
      }

      function getLimit(max) {
        return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
      }

      function canShift(backwards) {
        var shifted = orient(shift(getPosition(), backwards));
        return backwards ? shifted >= 0 : shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
      }

      function exceededLimit(max, position) {
        position = isUndefined(position) ? getPosition() : position;
        var exceededMin = max !== true && orient(position) < orient(getLimit(false));
        var exceededMax = max !== false && orient(position) > orient(getLimit(true));
        return exceededMin || exceededMax;
      }

      return {
        mount: mount,
        move: move,
        jump: jump,
        translate: translate,
        shift: shift,
        cancel: cancel,
        toIndex: toIndex,
        toPosition: toPosition,
        getPosition: getPosition,
        getLimit: getLimit,
        exceededLimit: exceededLimit,
        reposition: reposition
      };
    }

    function Controller(Splide2, Components2, options) {
      var _EventInterface6 = EventInterface(Splide2),
          on = _EventInterface6.on;

      var Move = Components2.Move;
      var getPosition = Move.getPosition,
          getLimit = Move.getLimit,
          toPosition = Move.toPosition;
      var _Components2$Slides = Components2.Slides,
          isEnough = _Components2$Slides.isEnough,
          getLength = _Components2$Slides.getLength;
      var isLoop = Splide2.is(LOOP);
      var isSlide = Splide2.is(SLIDE);
      var getNext = apply(getAdjacent, false);
      var getPrev = apply(getAdjacent, true);
      var currIndex = options.start || 0;
      var prevIndex = currIndex;
      var slideCount;
      var perMove;
      var perPage;

      function mount() {
        init();
        on([EVENT_UPDATED, EVENT_REFRESH], init);
      }

      function init() {
        slideCount = getLength(true);
        perMove = options.perMove;
        perPage = options.perPage;
        var index = clamp(currIndex, 0, slideCount - 1);

        if (index !== currIndex) {
          currIndex = index;
          Move.reposition();
        }
      }

      function go(control, allowSameIndex, callback) {
        if (!isBusy()) {
          var dest = parse(control);
          var index = loop(dest);

          if (index > -1 && (allowSameIndex || index !== currIndex)) {
            setIndex(index);
            Move.move(dest, index, prevIndex, callback);
          }
        }
      }

      function scroll(destination, duration, snap, callback) {
        Components2.Scroll.scroll(destination, duration, snap, function () {
          setIndex(loop(Move.toIndex(Move.getPosition())));
          callback && callback();
        });
      }

      function parse(control) {
        var index = currIndex;

        if (isString(control)) {
          var _ref = control.match(/([+\-<>])(\d+)?/) || [],
              indicator = _ref[1],
              number = _ref[2];

          if (indicator === "+" || indicator === "-") {
            index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex);
          } else if (indicator === ">") {
            index = number ? toIndex(+number) : getNext(true);
          } else if (indicator === "<") {
            index = getPrev(true);
          }
        } else {
          index = isLoop ? control : clamp(control, 0, getEnd());
        }

        return index;
      }

      function getAdjacent(prev, destination) {
        var number = perMove || (hasFocus() ? 1 : perPage);
        var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex, !(perMove || hasFocus()));

        if (dest === -1 && isSlide) {
          if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
            return prev ? 0 : getEnd();
          }
        }

        return destination ? dest : loop(dest);
      }

      function computeDestIndex(dest, from, snapPage) {
        if (isEnough()) {
          var end = getEnd();
          var index = computeMovableDestIndex(dest);

          if (index !== dest) {
            from = dest;
            dest = index;
            snapPage = false;
          }

          if (dest < 0 || dest > end) {
            if (between(0, dest, from, true) || between(end, from, dest, true)) {
              dest = toIndex(toPage(dest));
            } else {
              if (isLoop) {
                dest = snapPage ? dest < 0 ? -(slideCount % perPage || perPage) : slideCount : dest;
              } else if (options.rewind) {
                dest = dest < 0 ? end : 0;
              } else {
                dest = -1;
              }
            }
          } else {
            if (snapPage && dest !== from) {
              dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
            }
          }
        } else {
          dest = -1;
        }

        return dest;
      }

      function computeMovableDestIndex(dest) {
        if (isSlide && options.trimSpace === "move" && dest !== currIndex) {
          var position = getPosition();

          while (position === toPosition(dest, true) && between(dest, 0, Splide2.length - 1, !options.rewind)) {
            dest < currIndex ? --dest : ++dest;
          }
        }

        return dest;
      }

      function loop(index) {
        return isLoop ? (index + slideCount) % slideCount || 0 : index;
      }

      function getEnd() {
        return max(slideCount - (hasFocus() || isLoop && perMove ? 1 : perPage), 0);
      }

      function toIndex(page) {
        return clamp(hasFocus() ? page : perPage * page, 0, getEnd());
      }

      function toPage(index) {
        return hasFocus() ? index : floor((index >= getEnd() ? slideCount - 1 : index) / perPage);
      }

      function toDest(destination) {
        var closest = Move.toIndex(destination);
        return isSlide ? clamp(closest, 0, getEnd()) : closest;
      }

      function setIndex(index) {
        if (index !== currIndex) {
          prevIndex = currIndex;
          currIndex = index;
        }
      }

      function getIndex(prev) {
        return prev ? prevIndex : currIndex;
      }

      function hasFocus() {
        return !isUndefined(options.focus) || options.isNavigation;
      }

      function isBusy() {
        return Splide2.state.is([MOVING, SCROLLING]) && !!options.waitForTransition;
      }

      return {
        mount: mount,
        go: go,
        scroll: scroll,
        getNext: getNext,
        getPrev: getPrev,
        getAdjacent: getAdjacent,
        getEnd: getEnd,
        setIndex: setIndex,
        getIndex: getIndex,
        toIndex: toIndex,
        toPage: toPage,
        toDest: toDest,
        hasFocus: hasFocus,
        isBusy: isBusy
      };
    }

    var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
    var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
    var SIZE = 40;

    function Arrows(Splide2, Components2, options) {
      var event = EventInterface(Splide2);
      var on = event.on,
          bind = event.bind,
          emit = event.emit;
      var classes = options.classes,
          i18n = options.i18n;
      var Elements = Components2.Elements,
          Controller = Components2.Controller;
      var userArrows = Elements.arrows,
          track = Elements.track;
      var wrapper = userArrows;
      var prev = Elements.prev;
      var next = Elements.next;
      var created;
      var wrapperClasses;
      var arrows = {};

      function mount() {
        init();
        on(EVENT_UPDATED, remount);
      }

      function remount() {
        destroy();
        mount();
      }

      function init() {
        var enabled = options.arrows;

        if (enabled && !(prev && next)) {
          createArrows();
        }

        if (prev && next) {
          assign(arrows, {
            prev: prev,
            next: next
          });
          display(wrapper, enabled ? "" : "none");
          addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);

          if (enabled) {
            listen();
            update();
            setAttribute([prev, next], ARIA_CONTROLS, track.id);
            emit(EVENT_ARROWS_MOUNTED, prev, next);
          }
        }
      }

      function destroy() {
        event.destroy();
        removeClass(wrapper, wrapperClasses);

        if (created) {
          remove(userArrows ? [prev, next] : wrapper);
          prev = next = null;
        } else {
          removeAttribute([prev, next], ALL_ATTRIBUTES);
        }
      }

      function listen() {
        on([EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED], update);
        bind(next, "click", apply(go, ">"));
        bind(prev, "click", apply(go, "<"));
      }

      function go(control) {
        Controller.go(control, true);
      }

      function createArrows() {
        wrapper = userArrows || create("div", classes.arrows);
        prev = createArrow(true);
        next = createArrow(false);
        created = true;
        append(wrapper, [prev, next]);
        !userArrows && before(wrapper, track);
      }

      function createArrow(prev2) {
        var arrow = "<button class=\"" + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + "\" type=\"button\"><svg xmlns=\"" + XML_NAME_SPACE + "\" viewBox=\"0 0 " + SIZE + " " + SIZE + "\" width=\"" + SIZE + "\" height=\"" + SIZE + "\" focusable=\"false\"><path d=\"" + (options.arrowPath || PATH) + "\" />";
        return parseHtml(arrow);
      }

      function update() {
        var index = Splide2.index;
        var prevIndex = Controller.getPrev();
        var nextIndex = Controller.getNext();
        var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
        var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
        prev.disabled = prevIndex < 0;
        next.disabled = nextIndex < 0;
        setAttribute(prev, ARIA_LABEL, prevLabel);
        setAttribute(next, ARIA_LABEL, nextLabel);
        emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
      }

      return {
        arrows: arrows,
        mount: mount,
        destroy: destroy
      };
    }

    var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";

    function Autoplay(Splide2, Components2, options) {
      var _EventInterface7 = EventInterface(Splide2),
          on = _EventInterface7.on,
          bind = _EventInterface7.bind,
          emit = _EventInterface7.emit;

      var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), onAnimationFrame);
      var isPaused = interval.isPaused;
      var Elements = Components2.Elements,
          _Components2$Elements4 = Components2.Elements,
          root = _Components2$Elements4.root,
          toggle = _Components2$Elements4.toggle;
      var autoplay = options.autoplay;
      var hovered;
      var focused;
      var stopped = autoplay === "pause";

      function mount() {
        if (autoplay) {
          listen();
          toggle && setAttribute(toggle, ARIA_CONTROLS, Elements.track.id);
          stopped || play();
          update();
        }
      }

      function listen() {
        if (options.pauseOnHover) {
          bind(root, "mouseenter mouseleave", function (e) {
            hovered = e.type === "mouseenter";
            autoToggle();
          });
        }

        if (options.pauseOnFocus) {
          bind(root, "focusin focusout", function (e) {
            focused = e.type === "focusin";
            autoToggle();
          });
        }

        if (toggle) {
          bind(toggle, "click", function () {
            stopped ? play() : pause(true);
          });
        }

        on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
        on(EVENT_MOVE, onMove);
      }

      function play() {
        if (isPaused() && Components2.Slides.isEnough()) {
          interval.start(!options.resetProgress);
          focused = hovered = stopped = false;
          update();
          emit(EVENT_AUTOPLAY_PLAY);
        }
      }

      function pause(stop) {
        if (stop === void 0) {
          stop = true;
        }

        stopped = !!stop;
        update();

        if (!isPaused()) {
          interval.pause();
          emit(EVENT_AUTOPLAY_PAUSE);
        }
      }

      function autoToggle() {
        if (!stopped) {
          hovered || focused ? pause(false) : play();
        }
      }

      function update() {
        if (toggle) {
          toggleClass(toggle, CLASS_ACTIVE, !stopped);
          setAttribute(toggle, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
        }
      }

      function onAnimationFrame(rate) {
        var bar = Elements.bar;
        bar && style(bar, "width", rate * 100 + "%");
        emit(EVENT_AUTOPLAY_PLAYING, rate);
      }

      function onMove(index) {
        var Slide = Components2.Slides.getAt(index);
        interval.set(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
      }

      return {
        mount: mount,
        destroy: interval.cancel,
        play: play,
        pause: pause,
        isPaused: isPaused
      };
    }

    function Cover(Splide2, Components2, options) {
      var _EventInterface8 = EventInterface(Splide2),
          on = _EventInterface8.on;

      function mount() {
        if (options.cover) {
          on(EVENT_LAZYLOAD_LOADED, apply(toggle, true));
          on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply(cover, true));
        }
      }

      function cover(cover2) {
        Components2.Slides.forEach(function (Slide) {
          var img = child(Slide.container || Slide.slide, "img");

          if (img && img.src) {
            toggle(cover2, img, Slide);
          }
        });
      }

      function toggle(cover2, img, Slide) {
        Slide.style("background", cover2 ? "center/cover no-repeat url(\"" + img.src + "\")" : "", true);
        display(img, cover2 ? "none" : "");
      }

      return {
        mount: mount,
        destroy: apply(cover, false)
      };
    }

    var BOUNCE_DIFF_THRESHOLD = 10;
    var BOUNCE_DURATION = 600;
    var FRICTION_FACTOR = 0.6;
    var BASE_VELOCITY = 1.5;
    var MIN_DURATION = 800;

    function Scroll(Splide2, Components2, options) {
      var _EventInterface9 = EventInterface(Splide2),
          on = _EventInterface9.on,
          emit = _EventInterface9.emit;

      var set = Splide2.state.set;
      var Move = Components2.Move;
      var getPosition = Move.getPosition,
          getLimit = Move.getLimit,
          exceededLimit = Move.exceededLimit,
          translate = Move.translate;
      var interval;
      var callback;
      var friction = 1;

      function mount() {
        on(EVENT_MOVE, clear);
        on([EVENT_UPDATED, EVENT_REFRESH], cancel);
      }

      function scroll(destination, duration, snap, onScrolled, noConstrain) {
        var from = getPosition();
        clear();

        if (snap) {
          var size = Components2.Layout.sliderSize();
          var offset = sign(destination) * size * floor(abs(destination) / size) || 0;
          destination = Move.toPosition(Components2.Controller.toDest(destination % size)) + offset;
        }

        var noDistance = approximatelyEqual(from, destination, 1);
        friction = 1;
        duration = noDistance ? 0 : duration || max(abs(destination - from) / BASE_VELOCITY, MIN_DURATION);
        callback = onScrolled;
        interval = RequestInterval(duration, onEnd, apply(update, from, destination, noConstrain), 1);
        set(SCROLLING);
        emit(EVENT_SCROLL);
        interval.start();
      }

      function onEnd() {
        set(IDLE);
        callback && callback();
        emit(EVENT_SCROLLED);
      }

      function update(from, to, noConstrain, rate) {
        var position = getPosition();
        var target = from + (to - from) * easing(rate);
        var diff = (target - position) * friction;
        translate(position + diff);

        if (Splide2.is(SLIDE) && !noConstrain && exceededLimit()) {
          friction *= FRICTION_FACTOR;

          if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
            scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
          }
        }
      }

      function clear() {
        if (interval) {
          interval.cancel();
        }
      }

      function cancel() {
        if (interval && !interval.isPaused()) {
          clear();
          onEnd();
        }
      }

      function easing(t) {
        var easingFunc = options.easingFunc;
        return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
      }

      return {
        mount: mount,
        destroy: clear,
        scroll: scroll,
        cancel: cancel
      };
    }

    var SCROLL_LISTENER_OPTIONS = {
      passive: false,
      capture: true
    };

    function Drag(Splide2, Components2, options) {
      var _EventInterface10 = EventInterface(Splide2),
          on = _EventInterface10.on,
          emit = _EventInterface10.emit,
          bind = _EventInterface10.bind,
          unbind = _EventInterface10.unbind;

      var state = Splide2.state;
      var Move = Components2.Move,
          Scroll = Components2.Scroll,
          Controller = Components2.Controller,
          track = Components2.Elements.track,
          reduce = Components2.Media.reduce;
      var _Components2$Directio2 = Components2.Direction,
          resolve = _Components2$Directio2.resolve,
          orient = _Components2$Directio2.orient;
      var getPosition = Move.getPosition,
          exceededLimit = Move.exceededLimit;
      var basePosition;
      var baseEvent;
      var prevBaseEvent;
      var isFree;
      var dragging;
      var exceeded = false;
      var clickPrevented;
      var disabled;
      var target;

      function mount() {
        bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
        bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
        bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
        bind(track, "click", onClick, {
          capture: true
        });
        bind(track, "dragstart", prevent);
        on([EVENT_MOUNTED, EVENT_UPDATED], init);
      }

      function init() {
        var drag = options.drag;
        disable(!drag);
        isFree = drag === "free";
      }

      function onPointerDown(e) {
        clickPrevented = false;

        if (!disabled) {
          var isTouch = isTouchEvent(e);

          if (isDraggable(e.target) && (isTouch || !e.button)) {
            if (!Controller.isBusy()) {
              target = isTouch ? track : window;
              dragging = state.is([MOVING, SCROLLING]);
              prevBaseEvent = null;
              bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
              bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
              Move.cancel();
              Scroll.cancel();
              save(e);
            } else {
              prevent(e, true);
            }
          }
        }
      }

      function onPointerMove(e) {
        if (!state.is(DRAGGING)) {
          state.set(DRAGGING);
          emit(EVENT_DRAG);
        }

        if (e.cancelable) {
          if (dragging) {
            Move.translate(basePosition + constrain(diffCoord(e)));
            var expired = diffTime(e) > LOG_INTERVAL;
            var hasExceeded = exceeded !== (exceeded = exceededLimit());

            if (expired || hasExceeded) {
              save(e);
            }

            clickPrevented = true;
            emit(EVENT_DRAGGING);
            prevent(e);
          } else if (isSliderDirection(e)) {
            dragging = shouldStart(e);
            prevent(e);
          }
        }
      }

      function onPointerUp(e) {
        if (state.is(DRAGGING)) {
          state.set(IDLE);
          emit(EVENT_DRAGGED);
        }

        if (dragging) {
          move(e);
          prevent(e);
        }

        unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
        unbind(target, POINTER_UP_EVENTS, onPointerUp);
        dragging = false;
      }

      function onClick(e) {
        if (!disabled && clickPrevented) {
          prevent(e, true);
        }
      }

      function save(e) {
        prevBaseEvent = baseEvent;
        baseEvent = e;
        basePosition = getPosition();
      }

      function move(e) {
        var velocity = computeVelocity(e);
        var destination = computeDestination(velocity);
        var rewind = options.rewind && options.rewindByDrag;
        reduce(false);

        if (isFree) {
          Controller.scroll(destination, 0, options.snap);
        } else if (Splide2.is(FADE)) {
          Controller.go(orient(sign(velocity)) < 0 ? rewind ? "<" : "-" : rewind ? ">" : "+");
        } else if (Splide2.is(SLIDE) && exceeded && rewind) {
          Controller.go(exceededLimit(true) ? ">" : "<");
        } else {
          Controller.go(Controller.toDest(destination), true);
        }

        reduce(true);
      }

      function shouldStart(e) {
        var thresholds = options.dragMinThreshold;
        var isObj = isObject(thresholds);
        var mouse = isObj && thresholds.mouse || 0;
        var touch = (isObj ? thresholds.touch : +thresholds) || 10;
        return abs(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
      }

      function isSliderDirection(e) {
        return abs(diffCoord(e)) > abs(diffCoord(e, true));
      }

      function computeVelocity(e) {
        if (Splide2.is(LOOP) || !exceeded) {
          var time = diffTime(e);

          if (time && time < LOG_INTERVAL) {
            return diffCoord(e) / time;
          }
        }

        return 0;
      }

      function computeDestination(velocity) {
        return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
      }

      function diffCoord(e, orthogonal) {
        return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
      }

      function diffTime(e) {
        return timeOf(e) - timeOf(getBaseEvent(e));
      }

      function getBaseEvent(e) {
        return baseEvent === e && prevBaseEvent || baseEvent;
      }

      function coordOf(e, orthogonal) {
        return (isTouchEvent(e) ? e.changedTouches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
      }

      function constrain(diff) {
        return diff / (exceeded && Splide2.is(SLIDE) ? FRICTION : 1);
      }

      function isDraggable(target2) {
        var noDrag = options.noDrag;
        return !matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) && (!noDrag || !matches(target2, noDrag));
      }

      function isTouchEvent(e) {
        return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
      }

      function isDragging() {
        return dragging;
      }

      function disable(value) {
        disabled = value;
      }

      return {
        mount: mount,
        disable: disable,
        isDragging: isDragging
      };
    }

    var NORMALIZATION_MAP = {
      Spacebar: " ",
      Right: ARROW_RIGHT,
      Left: ARROW_LEFT,
      Up: ARROW_UP,
      Down: ARROW_DOWN
    };

    function normalizeKey(key) {
      key = isString(key) ? key : key.key;
      return NORMALIZATION_MAP[key] || key;
    }

    var KEYBOARD_EVENT = "keydown";

    function Keyboard(Splide2, Components2, options) {
      var _EventInterface11 = EventInterface(Splide2),
          on = _EventInterface11.on,
          bind = _EventInterface11.bind,
          unbind = _EventInterface11.unbind;

      var root = Splide2.root;
      var resolve = Components2.Direction.resolve;
      var target;
      var disabled;

      function mount() {
        init();
        on(EVENT_UPDATED, destroy);
        on(EVENT_UPDATED, init);
        on(EVENT_MOVE, onMove);
      }

      function init() {
        var keyboard = options.keyboard;

        if (keyboard) {
          target = keyboard === "global" ? window : root;
          bind(target, KEYBOARD_EVENT, onKeydown);
        }
      }

      function destroy() {
        unbind(target, KEYBOARD_EVENT);
      }

      function disable(value) {
        disabled = value;
      }

      function onMove() {
        var _disabled = disabled;
        disabled = true;
        nextTick(function () {
          disabled = _disabled;
        });
      }

      function onKeydown(e) {
        if (!disabled) {
          var key = normalizeKey(e);

          if (key === resolve(ARROW_LEFT)) {
            Splide2.go("<");
          } else if (key === resolve(ARROW_RIGHT)) {
            Splide2.go(">");
          }
        }
      }

      return {
        mount: mount,
        destroy: destroy,
        disable: disable
      };
    }

    var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
    var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
    var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";

    function LazyLoad(Splide2, Components2, options) {
      var _EventInterface12 = EventInterface(Splide2),
          on = _EventInterface12.on,
          off = _EventInterface12.off,
          bind = _EventInterface12.bind,
          emit = _EventInterface12.emit;

      var isSequential = options.lazyLoad === "sequential";
      var events = [EVENT_MOUNTED, EVENT_REFRESH, EVENT_MOVED, EVENT_SCROLLED];
      var entries = [];

      function mount() {
        if (options.lazyLoad) {
          init();
          on(EVENT_REFRESH, init);
          isSequential || on(events, observe);
        }
      }

      function init() {
        empty(entries);
        Components2.Slides.forEach(function (Slide) {
          queryAll(Slide.slide, IMAGE_SELECTOR).forEach(function (img) {
            var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
            var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);

            if (src !== img.src || srcset !== img.srcset) {
              var className = options.classes.spinner;
              var parent = img.parentElement;
              var spinner = child(parent, "." + className) || create("span", className, parent);
              entries.push([img, Slide, spinner]);
              img.src || display(img, "none");
            }
          });
        });
        isSequential && loadNext();
      }

      function observe() {
        entries = entries.filter(function (data) {
          var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
          return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
        });
        entries.length || off(events);
      }

      function load(data) {
        var img = data[0];
        addClass(data[1].slide, CLASS_LOADING);
        bind(img, "load error", apply(onLoad, data));
        setAttribute(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
        setAttribute(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
        removeAttribute(img, SRC_DATA_ATTRIBUTE);
        removeAttribute(img, SRCSET_DATA_ATTRIBUTE);
      }

      function onLoad(data, e) {
        var img = data[0],
            Slide = data[1];
        removeClass(Slide.slide, CLASS_LOADING);

        if (e.type !== "error") {
          remove(data[2]);
          display(img, "");
          emit(EVENT_LAZYLOAD_LOADED, img, Slide);
          emit(EVENT_RESIZE);
        }

        isSequential && loadNext();
      }

      function loadNext() {
        entries.length && load(entries.shift());
      }

      return {
        mount: mount,
        destroy: apply(empty, entries)
      };
    }

    function Pagination(Splide2, Components2, options) {
      var event = EventInterface(Splide2);
      var on = event.on,
          emit = event.emit,
          bind = event.bind;
      var Slides = Components2.Slides,
          Elements = Components2.Elements,
          Controller = Components2.Controller;
      var hasFocus = Controller.hasFocus,
          getIndex = Controller.getIndex,
          go = Controller.go;
      var resolve = Components2.Direction.resolve;
      var items = [];
      var list;
      var paginationClasses;

      function mount() {
        destroy();
        on([EVENT_UPDATED, EVENT_REFRESH], mount);

        if (options.pagination && Slides.isEnough()) {
          on([EVENT_MOVE, EVENT_SCROLL, EVENT_SCROLLED], update);
          createPagination();
          update();
          emit(EVENT_PAGINATION_MOUNTED, {
            list: list,
            items: items
          }, getAt(Splide2.index));
        }
      }

      function destroy() {
        if (list) {
          remove(Elements.pagination ? slice(list.children) : list);
          removeClass(list, paginationClasses);
          empty(items);
          list = null;
        }

        event.destroy();
      }

      function createPagination() {
        var length = Splide2.length;
        var classes = options.classes,
            i18n = options.i18n,
            perPage = options.perPage;
        var max = hasFocus() ? length : ceil(length / perPage);
        list = Elements.pagination || create("ul", classes.pagination, Elements.track.parentElement);
        addClass(list, paginationClasses = CLASS_PAGINATION + "--" + getDirection());
        setAttribute(list, ROLE, "tablist");
        setAttribute(list, ARIA_LABEL, i18n.select);
        setAttribute(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");

        for (var i = 0; i < max; i++) {
          var li = create("li", null, list);
          var button = create("button", {
            class: classes.page,
            type: "button"
          }, li);
          var controls = Slides.getIn(i).map(function (Slide) {
            return Slide.slide.id;
          });
          var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
          bind(button, "click", apply(onClick, i));

          if (options.paginationKeyboard) {
            bind(button, "keydown", apply(onKeydown, i));
          }

          setAttribute(li, ROLE, "presentation");
          setAttribute(button, ROLE, "tab");
          setAttribute(button, ARIA_CONTROLS, controls.join(" "));
          setAttribute(button, ARIA_LABEL, format(text, i + 1));
          setAttribute(button, TAB_INDEX, -1);
          items.push({
            li: li,
            button: button,
            page: i
          });
        }
      }

      function onClick(page) {
        go(">" + page, true);
      }

      function onKeydown(page, e) {
        var length = items.length;
        var key = normalizeKey(e);
        var dir = getDirection();
        var nextPage = -1;

        if (key === resolve(ARROW_RIGHT, false, dir)) {
          nextPage = ++page % length;
        } else if (key === resolve(ARROW_LEFT, false, dir)) {
          nextPage = (--page + length) % length;
        } else if (key === "Home") {
          nextPage = 0;
        } else if (key === "End") {
          nextPage = length - 1;
        }

        var item = items[nextPage];

        if (item) {
          focus(item.button);
          go(">" + nextPage);
          prevent(e, true);
        }
      }

      function getDirection() {
        return options.paginationDirection || options.direction;
      }

      function getAt(index) {
        return items[Controller.toPage(index)];
      }

      function update() {
        var prev = getAt(getIndex(true));
        var curr = getAt(getIndex());

        if (prev) {
          var button = prev.button;
          removeClass(button, CLASS_ACTIVE);
          removeAttribute(button, ARIA_SELECTED);
          setAttribute(button, TAB_INDEX, -1);
        }

        if (curr) {
          var _button = curr.button;
          addClass(_button, CLASS_ACTIVE);
          setAttribute(_button, ARIA_SELECTED, true);
          setAttribute(_button, TAB_INDEX, "");
        }

        emit(EVENT_PAGINATION_UPDATED, {
          list: list,
          items: items
        }, prev, curr);
      }

      return {
        items: items,
        mount: mount,
        destroy: destroy,
        getAt: getAt,
        update: update
      };
    }

    var TRIGGER_KEYS = [" ", "Enter"];

    function Sync(Splide2, Components2, options) {
      var isNavigation = options.isNavigation,
          slideFocus = options.slideFocus;
      var events = [];

      function setup() {
        Splide2.options = {
          slideFocus: isUndefined(slideFocus) ? isNavigation : slideFocus
        };
      }

      function mount() {
        Splide2.splides.forEach(function (target) {
          if (!target.isParent) {
            sync(Splide2, target.splide);
            sync(target.splide, Splide2);
          }
        });

        if (isNavigation) {
          navigate();
        }
      }

      function destroy() {
        events.forEach(function (event) {
          event.destroy();
        });
        empty(events);
      }

      function remount() {
        destroy();
        mount();
      }

      function sync(splide, target) {
        var event = EventInterface(splide);
        event.on(EVENT_MOVE, function (index, prev, dest) {
          target.go(target.is(LOOP) ? dest : index);
        });
        events.push(event);
      }

      function navigate() {
        var event = EventInterface(Splide2);
        var on = event.on;
        on(EVENT_CLICK, onClick);
        on(EVENT_SLIDE_KEYDOWN, onKeydown);
        on([EVENT_MOUNTED, EVENT_UPDATED], update);
        events.push(event);
        event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
      }

      function update() {
        setAttribute(Components2.Elements.list, ARIA_ORIENTATION, options.direction === TTB ? "vertical" : "");
      }

      function onClick(Slide) {
        Splide2.go(Slide.index);
      }

      function onKeydown(Slide, e) {
        if (includes(TRIGGER_KEYS, normalizeKey(e))) {
          onClick(Slide);
          prevent(e);
        }
      }

      return {
        setup: setup,
        mount: mount,
        destroy: destroy,
        remount: remount
      };
    }

    function Wheel(Splide2, Components2, options) {
      var _EventInterface13 = EventInterface(Splide2),
          bind = _EventInterface13.bind;

      var lastTime = 0;

      function mount() {
        if (options.wheel) {
          bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
        }
      }

      function onWheel(e) {
        if (e.cancelable) {
          var deltaY = e.deltaY;
          var backwards = deltaY < 0;
          var timeStamp = timeOf(e);

          var _min = options.wheelMinThreshold || 0;

          var sleep = options.wheelSleep || 0;

          if (abs(deltaY) > _min && timeStamp - lastTime > sleep) {
            Splide2.go(backwards ? "<" : ">");
            lastTime = timeStamp;
          }

          shouldPrevent(backwards) && prevent(e);
        }
      }

      function shouldPrevent(backwards) {
        return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
      }

      return {
        mount: mount
      };
    }

    var SR_REMOVAL_DELAY = 90;

    function Live(Splide2, Components2, options) {
      var _EventInterface14 = EventInterface(Splide2),
          on = _EventInterface14.on;

      var track = Components2.Elements.track;
      var enabled = options.live && !options.isNavigation;
      var sr = create("span", CLASS_SR);
      var interval = RequestInterval(SR_REMOVAL_DELAY, apply(toggle, false));

      function mount() {
        if (enabled) {
          disable(!Components2.Autoplay.isPaused());
          setAttribute(track, ARIA_ATOMIC, true);
          sr.textContent = "\u2026";
          on(EVENT_AUTOPLAY_PLAY, apply(disable, true));
          on(EVENT_AUTOPLAY_PAUSE, apply(disable, false));
          on([EVENT_MOVED, EVENT_SCROLLED], apply(toggle, true));
        }
      }

      function toggle(active) {
        setAttribute(track, ARIA_BUSY, active);

        if (active) {
          append(track, sr);
          interval.start();
        } else {
          remove(sr);
        }
      }

      function destroy() {
        removeAttribute(track, [ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY]);
        remove(sr);
      }

      function disable(disabled) {
        if (enabled) {
          setAttribute(track, ARIA_LIVE, disabled ? "off" : "polite");
        }
      }

      return {
        mount: mount,
        disable: disable,
        destroy: destroy
      };
    }

    var ComponentConstructors = /*#__PURE__*/Object.freeze({
      __proto__: null,
      Media: Media,
      Direction: Direction,
      Elements: Elements,
      Slides: Slides,
      Layout: Layout,
      Clones: Clones,
      Move: Move,
      Controller: Controller,
      Arrows: Arrows,
      Autoplay: Autoplay,
      Cover: Cover,
      Scroll: Scroll,
      Drag: Drag,
      Keyboard: Keyboard,
      LazyLoad: LazyLoad,
      Pagination: Pagination,
      Sync: Sync,
      Wheel: Wheel,
      Live: Live
    });
    var I18N = {
      prev: "Previous slide",
      next: "Next slide",
      first: "Go to first slide",
      last: "Go to last slide",
      slideX: "Go to slide %s",
      pageX: "Go to page %s",
      play: "Start autoplay",
      pause: "Pause autoplay",
      carousel: "carousel",
      slide: "slide",
      select: "Select a slide to show",
      slideLabel: "%s of %s"
    };
    var DEFAULTS = {
      type: "slide",
      role: "region",
      speed: 400,
      perPage: 1,
      cloneStatus: true,
      arrows: true,
      pagination: true,
      paginationKeyboard: true,
      interval: 5e3,
      pauseOnHover: true,
      pauseOnFocus: true,
      resetProgress: true,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      drag: true,
      direction: "ltr",
      trimSpace: true,
      focusableNodes: "a, button, textarea, input, select, iframe",
      live: true,
      classes: CLASSES,
      i18n: I18N,
      reducedMotion: {
        speed: 0,
        rewindSpeed: 0,
        autoplay: "pause"
      }
    };

    function Fade(Splide2, Components2, options) {
      var _EventInterface15 = EventInterface(Splide2),
          on = _EventInterface15.on;

      function mount() {
        on([EVENT_MOUNTED, EVENT_REFRESH], function () {
          nextTick(function () {
            Components2.Slides.style("transition", "opacity " + options.speed + "ms " + options.easing);
          });
        });
      }

      function start(index, done) {
        var track = Components2.Elements.track;
        style(track, "height", unit(rect(track).height));
        nextTick(function () {
          done();
          style(track, "height", "");
        });
      }

      return {
        mount: mount,
        start: start,
        cancel: noop
      };
    }

    function Slide(Splide2, Components2, options) {
      var _EventInterface16 = EventInterface(Splide2),
          bind = _EventInterface16.bind;

      var Move = Components2.Move,
          Controller = Components2.Controller,
          Scroll = Components2.Scroll;
      var list = Components2.Elements.list;
      var transition = apply(style, list, "transition");
      var endCallback;

      function mount() {
        bind(list, "transitionend", function (e) {
          if (e.target === list && endCallback) {
            cancel();
            endCallback();
          }
        });
      }

      function start(index, done) {
        var destination = Move.toPosition(index, true);
        var position = Move.getPosition();
        var speed = getSpeed(index);

        if (abs(destination - position) >= 1 && speed >= 1) {
          if (options.useScroll) {
            Scroll.scroll(destination, speed, false, done);
          } else {
            transition("transform " + speed + "ms " + options.easing);
            Move.translate(destination, true);
            endCallback = done;
          }
        } else {
          Move.jump(index);
          done();
        }
      }

      function cancel() {
        transition("");
        Scroll.cancel();
      }

      function getSpeed(index) {
        var rewindSpeed = options.rewindSpeed;

        if (Splide2.is(SLIDE) && rewindSpeed) {
          var prev = Controller.getIndex(true);
          var end = Controller.getEnd();

          if (prev === 0 && index >= end || prev >= end && index === 0) {
            return rewindSpeed;
          }
        }

        return options.speed;
      }

      return {
        mount: mount,
        start: start,
        cancel: cancel
      };
    }

    var _Splide = /*#__PURE__*/function () {
      function _Splide(target, options) {
        this.event = EventInterface();
        this.Components = {};
        this.state = State(CREATED);
        this.splides = [];
        this._o = {};
        this._E = {};
        var root = isString(target) ? query(document, target) : target;
        assert(root, root + " is invalid.");
        this.root = root;
        options = merge({
          label: getAttribute(root, ARIA_LABEL) || "",
          labelledby: getAttribute(root, ARIA_LABELLEDBY) || ""
        }, DEFAULTS, _Splide.defaults, options || {});

        try {
          merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
        } catch (e) {
          assert(false, "Invalid JSON");
        }

        this._o = Object.create(merge({}, options));
      }

      var _proto = _Splide.prototype;

      _proto.mount = function mount(Extensions, Transition) {
        var _this = this;

        var state = this.state,
            Components2 = this.Components;
        assert(state.is([CREATED, DESTROYED]), "Already mounted!");
        state.set(CREATED);
        this._C = Components2;
        this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
        this._E = Extensions || this._E;
        var Constructors = assign({}, ComponentConstructors, this._E, {
          Transition: this._T
        });
        forOwn(Constructors, function (Component, key) {
          var component = Component(_this, Components2, _this._o);
          Components2[key] = component;
          component.setup && component.setup();
        });
        forOwn(Components2, function (component) {
          component.mount && component.mount();
        });
        this.emit(EVENT_MOUNTED);
        addClass(this.root, CLASS_INITIALIZED);
        state.set(IDLE);
        this.emit(EVENT_READY);
        return this;
      };

      _proto.sync = function sync(splide) {
        this.splides.push({
          splide: splide
        });
        splide.splides.push({
          splide: this,
          isParent: true
        });

        if (this.state.is(IDLE)) {
          this._C.Sync.remount();

          splide.Components.Sync.remount();
        }

        return this;
      };

      _proto.go = function go(control) {
        this._C.Controller.go(control);

        return this;
      };

      _proto.on = function on(events, callback) {
        this.event.on(events, callback);
        return this;
      };

      _proto.off = function off(events) {
        this.event.off(events);
        return this;
      };

      _proto.emit = function emit(event) {
        var _this$event;

        (_this$event = this.event).emit.apply(_this$event, [event].concat(slice(arguments, 1)));

        return this;
      };

      _proto.add = function add(slides, index) {
        this._C.Slides.add(slides, index);

        return this;
      };

      _proto.remove = function remove(matcher) {
        this._C.Slides.remove(matcher);

        return this;
      };

      _proto.is = function is(type) {
        return this._o.type === type;
      };

      _proto.refresh = function refresh() {
        this.emit(EVENT_REFRESH);
        return this;
      };

      _proto.destroy = function destroy(completely) {
        if (completely === void 0) {
          completely = true;
        }

        var event = this.event,
            state = this.state;

        if (state.is(CREATED)) {
          EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely));
        } else {
          forOwn(this._C, function (component) {
            component.destroy && component.destroy(completely);
          }, true);
          event.emit(EVENT_DESTROY);
          event.destroy();
          completely && empty(this.splides);
          state.set(DESTROYED);
        }

        return this;
      };

      _createClass(_Splide, [{
        key: "options",
        get: function get() {
          return this._o;
        },
        set: function set(options) {
          this._C.Media.set(options, true);
        }
      }, {
        key: "length",
        get: function get() {
          return this._C.Slides.getLength(true);
        }
      }, {
        key: "index",
        get: function get() {
          return this._C.Controller.getIndex();
        }
      }]);

      return _Splide;
    }();

    var Splide = _Splide;
    Splide.defaults = {};
    Splide.STATES = STATES;

    const EVENTS_WITHOUT_ARGS = [
        EVENT_MOUNTED,
        EVENT_REFRESH,
        EVENT_RESIZE,
        EVENT_RESIZED,
        EVENT_DRAG,
        EVENT_DRAGGING,
        EVENT_DRAGGED,
        EVENT_SCROLL,
        EVENT_SCROLLED,
        EVENT_DESTROY,
        EVENT_AUTOPLAY_PLAY,
        EVENT_AUTOPLAY_PAUSE,
    ];
    /**
     * Binds Splide events to the svelte dispatcher.
     *
     * @since 0.1.0
     *
     * @param splide     - A splide instance.
     * @param dispatchFn - A dispatch function created by `createEventDispatcher()`.
     */
    function bind(splide, dispatchFn) {
        const dispatch = (event, detail = {}) => {
            dispatchFn(transform(event), { splide, ...detail });
        };
        splide.on(EVENT_CLICK, (Slide, e) => {
            dispatch(EVENT_CLICK, { Slide, e });
        });
        splide.on(EVENT_MOVE, (index, prev, dest) => {
            dispatch(EVENT_MOVE, { index, prev, dest });
        });
        splide.on(EVENT_MOVED, (index, prev, dest) => {
            dispatch(EVENT_MOVED, { index, prev, dest });
        });
        splide.on(EVENT_ACTIVE, (Slide) => {
            dispatch(EVENT_ACTIVE, { Slide });
        });
        splide.on(EVENT_INACTIVE, (Slide) => {
            dispatch(EVENT_INACTIVE, { Slide });
        });
        splide.on(EVENT_VISIBLE, (Slide) => {
            dispatch(EVENT_VISIBLE, { Slide });
        });
        splide.on(EVENT_HIDDEN, (Slide) => {
            dispatch(EVENT_HIDDEN, { Slide });
        });
        splide.on(EVENT_UPDATED, (options) => {
            dispatch(EVENT_UPDATED, options);
        });
        splide.on(EVENT_ARROWS_MOUNTED, (prev, next) => {
            dispatch(EVENT_ARROWS_MOUNTED, { prev, next });
        });
        splide.on(EVENT_ARROWS_UPDATED, (prev, next) => {
            dispatch(EVENT_ARROWS_UPDATED, { prev, next });
        });
        splide.on(EVENT_PAGINATION_MOUNTED, (data, item) => {
            dispatch(EVENT_PAGINATION_MOUNTED, { data, item });
        });
        splide.on(EVENT_PAGINATION_UPDATED, (data, prev, curr) => {
            dispatch(EVENT_PAGINATION_UPDATED, { data, prev, curr });
        });
        splide.on(EVENT_NAVIGATION_MOUNTED, (splides) => {
            dispatch(EVENT_NAVIGATION_MOUNTED, { splides });
        });
        splide.on(EVENT_AUTOPLAY_PLAYING, (rate) => {
            dispatch(EVENT_AUTOPLAY_PLAYING, { rate });
        });
        splide.on(EVENT_LAZYLOAD_LOADED, (img, Slide) => {
            dispatch(EVENT_LAZYLOAD_LOADED, { img, Slide });
        });
        EVENTS_WITHOUT_ARGS.forEach(event => {
            splide.on(event, () => {
                dispatch(event);
            });
        });
    }
    /**
     * Transforms Splide event names to the camel case.
     *
     * @since 0.1.0
     *
     * @param event - An event name to transform.
     *
     * @return A transformed event name.
     */
    function transform(event) {
        return event.split(':')
            .map((fragment, index) => {
            return index > 0 ? fragment.charAt(0).toUpperCase() + fragment.slice(1) : fragment;
        })
            .join('')
            .replace('Lazyload', 'LazyLoad');
    }

    /* node_modules/@splidejs/svelte-splide/components/Splide/Splide.svelte generated by Svelte v3.49.0 */
    const file$f = "node_modules/@splidejs/svelte-splide/components/Splide/Splide.svelte";

    // (102:2) { :else }
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(102:2) { :else }",
    		ctx
    	});

    	return block;
    }

    // (98:2) { #if hasTrack }
    function create_if_block$2(ctx) {
    	let splidetrack;
    	let current;

    	splidetrack = new SplideTrack({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(splidetrack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(splidetrack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const splidetrack_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				splidetrack_changes.$$scope = { dirty, ctx };
    			}

    			splidetrack.$set(splidetrack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(splidetrack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(splidetrack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(splidetrack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(98:2) { #if hasTrack }",
    		ctx
    	});

    	return block;
    }

    // (99:4) <SplideTrack>
    function create_default_slot$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(99:4) <SplideTrack>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_class_value;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*hasTrack*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let div_levels = [
    		{
    			class: div_class_value = classNames('splide', /*className*/ ctx[0])
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign$1(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			set_attributes(div, div_data);
    			add_location(div, file$f, 92, 0, 2389);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding*/ ctx[12](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className*/ 1 && div_class_value !== (div_class_value = classNames('splide', /*className*/ ctx[0]))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			/*div_binding*/ ctx[12](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","options","splide","extensions","transition","hasTrack","go","sync"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Splide', slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { options = {} } = $$props;
    	let { splide = undefined } = $$props;
    	let { extensions = undefined } = $$props;
    	let { transition = undefined } = $$props;
    	let { hasTrack = true } = $$props;

    	/**
     * A dispatcher function.
     * The `createEventDispatcher` type assertion does not accept a type alias.
     * If specified, the svelte kit fails to generate a type of `events` and it will be `CustomEvent<any>`.
     * Also, the svelte action does not provide the way to specify event types.
     */
    	const dispatch = createEventDispatcher();

    	/**
     * The root element.
     */
    	let root;

    	/**
     * Holds the previous slide elements.
     */
    	let prevSlides;

    	/**
     * Holds the previous options.
     */
    	let prevOptions = merge$1({}, options);

    	onMount(() => {
    		$$invalidate(4, splide = new Splide(root, options));
    		bind(splide, dispatch);
    		splide.mount(extensions, transition);
    		prevSlides = getSlides(splide);
    		return () => splide.destroy();
    	});

    	afterUpdate(() => {
    		if (splide) {
    			const newSlides = getSlides(splide);

    			if (!isEqualShallow(prevSlides, newSlides)) {
    				splide.refresh();
    				prevSlides = newSlides.slice();
    			}
    		}
    	});

    	function go(control) {
    		splide?.go(control);
    	}

    	function sync(target) {
    		splide?.sync(target);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			root = $$value;
    			$$invalidate(2, root);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('options' in $$new_props) $$invalidate(5, options = $$new_props.options);
    		if ('splide' in $$new_props) $$invalidate(4, splide = $$new_props.splide);
    		if ('extensions' in $$new_props) $$invalidate(6, extensions = $$new_props.extensions);
    		if ('transition' in $$new_props) $$invalidate(7, transition = $$new_props.transition);
    		if ('hasTrack' in $$new_props) $$invalidate(1, hasTrack = $$new_props.hasTrack);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classNames,
    		getSlides,
    		isEqualDeep,
    		isEqualShallow,
    		merge: merge$1,
    		Splide,
    		afterUpdate,
    		createEventDispatcher,
    		onMount,
    		bind,
    		SplideTrack,
    		className,
    		options,
    		splide,
    		extensions,
    		transition,
    		hasTrack,
    		dispatch,
    		root,
    		prevSlides,
    		prevOptions,
    		go,
    		sync
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('options' in $$props) $$invalidate(5, options = $$new_props.options);
    		if ('splide' in $$props) $$invalidate(4, splide = $$new_props.splide);
    		if ('extensions' in $$props) $$invalidate(6, extensions = $$new_props.extensions);
    		if ('transition' in $$props) $$invalidate(7, transition = $$new_props.transition);
    		if ('hasTrack' in $$props) $$invalidate(1, hasTrack = $$new_props.hasTrack);
    		if ('root' in $$props) $$invalidate(2, root = $$new_props.root);
    		if ('prevSlides' in $$props) prevSlides = $$new_props.prevSlides;
    		if ('prevOptions' in $$props) $$invalidate(10, prevOptions = $$new_props.prevOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*splide, prevOptions, options*/ 1072) {
    			/**
     * Updates splide options only when they have difference with previous options.
     */
    			if (splide && !isEqualDeep(prevOptions, options)) {
    				$$invalidate(4, splide.options = options, splide);
    				$$invalidate(10, prevOptions = merge$1({}, prevOptions));
    			}
    		}
    	};

    	return [
    		className,
    		hasTrack,
    		root,
    		$$restProps,
    		splide,
    		options,
    		extensions,
    		transition,
    		go,
    		sync,
    		prevOptions,
    		slots,
    		div_binding,
    		$$scope
    	];
    }

    class Splide_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			class: 0,
    			options: 5,
    			splide: 4,
    			extensions: 6,
    			transition: 7,
    			hasTrack: 1,
    			go: 8,
    			sync: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Splide_1",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		return this.$$.ctx[0];
    	}

    	set class(className) {
    		this.$$set({ class: className });
    		flush();
    	}

    	get options() {
    		return this.$$.ctx[5];
    	}

    	set options(options) {
    		this.$$set({ options });
    		flush();
    	}

    	get splide() {
    		return this.$$.ctx[4];
    	}

    	set splide(splide) {
    		this.$$set({ splide });
    		flush();
    	}

    	get extensions() {
    		return this.$$.ctx[6];
    	}

    	set extensions(extensions) {
    		this.$$set({ extensions });
    		flush();
    	}

    	get transition() {
    		return this.$$.ctx[7];
    	}

    	set transition(transition) {
    		this.$$set({ transition });
    		flush();
    	}

    	get hasTrack() {
    		return this.$$.ctx[1];
    	}

    	set hasTrack(hasTrack) {
    		this.$$set({ hasTrack });
    		flush();
    	}

    	get go() {
    		return this.$$.ctx[8];
    	}

    	set go(value) {
    		throw new Error("<Splide>: Cannot set read-only property 'go'");
    	}

    	get sync() {
    		return this.$$.ctx[9];
    	}

    	set sync(value) {
    		throw new Error("<Splide>: Cannot set read-only property 'sync'");
    	}
    }

    /* node_modules/@splidejs/svelte-splide/components/SplideTrack/SplideTrack.svelte generated by Svelte v3.49.0 */
    const file$e = "node_modules/@splidejs/svelte-splide/components/SplideTrack/SplideTrack.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let ul;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	let div_levels = [
    		{
    			class: div_class_value = classNames('splide__track', /*className*/ ctx[0])
    		},
    		/*$$restProps*/ ctx[1]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign$1(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", "splide__list");
    			add_location(ul, file$e, 6, 2, 204);
    			set_attributes(div, div_data);
    			add_location(div, file$e, 5, 0, 125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className*/ 1 && div_class_value !== (div_class_value = classNames('splide__track', /*className*/ ctx[0]))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SplideTrack', slots, ['default']);
    	let { class: className = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classNames, className });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className, $$restProps, $$scope, slots];
    }

    class SplideTrack extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$e, create_fragment$e, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SplideTrack",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get class() {
    		throw new Error("<SplideTrack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<SplideTrack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@splidejs/svelte-splide/components/SplideSlide/SplideSlide.svelte generated by Svelte v3.49.0 */
    const file$d = "node_modules/@splidejs/svelte-splide/components/SplideSlide/SplideSlide.svelte";

    function create_fragment$d(ctx) {
    	let li;
    	let li_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	let li_levels = [
    		{
    			class: li_class_value = classNames('splide__slide', /*className*/ ctx[0])
    		},
    		/*$$restProps*/ ctx[1]
    	];

    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign$1(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$d, 5, 0, 125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				(!current || dirty & /*className*/ 1 && li_class_value !== (li_class_value = classNames('splide__slide', /*className*/ ctx[0]))) && { class: li_class_value },
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SplideSlide', slots, ['default']);
    	let { class: className = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classNames, className });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className, $$restProps, $$scope, slots];
    }

    class SplideSlide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$d, create_fragment$d, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SplideSlide",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get class() {
    		throw new Error("<SplideSlide>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<SplideSlide>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Sidebar.svelte generated by Svelte v3.49.0 */
    const file$c = "src/components/Sidebar.svelte";

    function create_fragment$c(ctx) {
    	let nav;
    	let h1;
    	let t0;
    	let span0;
    	let span1;
    	let t3;
    	let ul;
    	let li0;
    	let span2;
    	let a0;
    	let t6;
    	let li1;
    	let span3;
    	let a1;
    	let t9;
    	let li2;
    	let span4;
    	let a2;
    	let t12;
    	let li3;
    	let span5;
    	let a3;
    	let t15;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			h1 = element("h1");
    			t0 = text("J");
    			span0 = element("span");
    			span0.textContent = "ustin";
    			span1 = element("span");
    			span1.textContent = ".";
    			t3 = space();
    			ul = element("ul");
    			li0 = element("li");
    			span2 = element("span");
    			span2.textContent = "home";
    			a0 = element("a");
    			a0.textContent = "Home";
    			t6 = space();
    			li1 = element("li");
    			span3 = element("span");
    			span3.textContent = "person";
    			a1 = element("a");
    			a1.textContent = "About";
    			t9 = space();
    			li2 = element("li");
    			span4 = element("span");
    			span4.textContent = "web";
    			a2 = element("a");
    			a2.textContent = "Projects";
    			t12 = space();
    			li3 = element("li");
    			span5 = element("span");
    			span5.textContent = "mail";
    			a3 = element("a");
    			a3.textContent = "Contact";
    			t15 = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(span0, "id", "hide-on-mobile");
    			attr_dev(span0, "class", "svelte-17btb6l");
    			add_location(span0, file$c, 6, 9, 118);
    			attr_dev(span1, "id", "dot");
    			attr_dev(span1, "class", "svelte-17btb6l");
    			add_location(span1, file$c, 6, 47, 156);
    			attr_dev(h1, "class", "svelte-17btb6l");
    			add_location(h1, file$c, 6, 4, 113);
    			attr_dev(span2, "class", "material-symbols-outlined svelte-17btb6l");
    			add_location(span2, file$c, 8, 63, 259);
    			attr_dev(a0, "class", "svelte-17btb6l");
    			add_location(a0, file$c, 8, 114, 310);
    			attr_dev(li0, "class", "svelte-17btb6l");
    			toggle_class(li0, "active", /*index*/ ctx[1] === 0);
    			add_location(li0, file$c, 8, 8, 204);
    			attr_dev(span3, "class", "material-symbols-outlined svelte-17btb6l");
    			add_location(span3, file$c, 11, 63, 403);
    			attr_dev(a1, "class", "svelte-17btb6l");
    			add_location(a1, file$c, 11, 116, 456);
    			attr_dev(li1, "class", "svelte-17btb6l");
    			toggle_class(li1, "active", /*index*/ ctx[1] === 1);
    			add_location(li1, file$c, 11, 8, 348);
    			attr_dev(span4, "class", "material-symbols-outlined svelte-17btb6l");
    			add_location(span4, file$c, 14, 63, 550);
    			attr_dev(a2, "class", "svelte-17btb6l");
    			add_location(a2, file$c, 14, 113, 600);
    			attr_dev(li2, "class", "svelte-17btb6l");
    			toggle_class(li2, "active", /*index*/ ctx[1] === 2);
    			add_location(li2, file$c, 14, 8, 495);
    			attr_dev(span5, "class", "material-symbols-outlined svelte-17btb6l");
    			add_location(span5, file$c, 17, 63, 697);
    			attr_dev(a3, "class", "svelte-17btb6l");
    			add_location(a3, file$c, 17, 114, 748);
    			attr_dev(li3, "class", "svelte-17btb6l");
    			toggle_class(li3, "active", /*index*/ ctx[1] === 3);
    			add_location(li3, file$c, 17, 8, 642);
    			attr_dev(ul, "class", "svelte-17btb6l");
    			add_location(ul, file$c, 7, 4, 190);
    			attr_dev(nav, "class", "svelte-17btb6l");
    			add_location(nav, file$c, 5, 0, 102);
    			attr_dev(div, "id", "spacer");
    			attr_dev(div, "class", "svelte-17btb6l");
    			add_location(div, file$c, 21, 0, 798);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, h1);
    			append_dev(h1, t0);
    			append_dev(h1, span0);
    			append_dev(h1, span1);
    			append_dev(nav, t3);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, span2);
    			append_dev(li0, a0);
    			append_dev(ul, t6);
    			append_dev(ul, li1);
    			append_dev(li1, span3);
    			append_dev(li1, a1);
    			append_dev(ul, t9);
    			append_dev(ul, li2);
    			append_dev(li2, span4);
    			append_dev(li2, a2);
    			append_dev(ul, t12);
    			append_dev(ul, li3);
    			append_dev(li3, span5);
    			append_dev(li3, a3);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						li0,
    						"click",
    						function () {
    							if (is_function(/*splide*/ ctx[0].go(0))) /*splide*/ ctx[0].go(0).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						li1,
    						"click",
    						function () {
    							if (is_function(/*splide*/ ctx[0].go(1))) /*splide*/ ctx[0].go(1).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						li2,
    						"click",
    						function () {
    							if (is_function(/*splide*/ ctx[0].go(2))) /*splide*/ ctx[0].go(2).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						li3,
    						"click",
    						function () {
    							if (is_function(/*splide*/ ctx[0].go(3))) /*splide*/ ctx[0].go(3).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*index*/ 2) {
    				toggle_class(li0, "active", /*index*/ ctx[1] === 0);
    			}

    			if (dirty & /*index*/ 2) {
    				toggle_class(li1, "active", /*index*/ ctx[1] === 1);
    			}

    			if (dirty & /*index*/ 2) {
    				toggle_class(li2, "active", /*index*/ ctx[1] === 2);
    			}

    			if (dirty & /*index*/ 2) {
    				toggle_class(li3, "active", /*index*/ ctx[1] === 3);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sidebar', slots, ['default']);
    	let { splide } = $$props;
    	let { index } = $$props;
    	const writable_props = ['splide', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('splide' in $$props) $$invalidate(0, splide = $$props.splide);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ splide, index });

    	$$self.$inject_state = $$props => {
    		if ('splide' in $$props) $$invalidate(0, splide = $$props.splide);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [splide, index, $$scope, slots];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$c, create_fragment$c, safe_not_equal, { splide: 0, index: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*splide*/ ctx[0] === undefined && !('splide' in props)) {
    			console.warn("<Sidebar> was created without expected prop 'splide'");
    		}

    		if (/*index*/ ctx[1] === undefined && !('index' in props)) {
    			console.warn("<Sidebar> was created without expected prop 'index'");
    		}
    	}

    	get splide() {
    		throw new Error("<Sidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set splide(value) {
    		throw new Error("<Sidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Sidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Sidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /** @type {import(types').HasSingleTextNode} */
    const hasSingleTextNode = el => el.childNodes.length === 1 && el.childNodes[0].nodeType === 3;

    /** @type {import(types').CreateElement} */
    const createElement = (text, elementTag) => {
    	const element = document.createElement(elementTag);
    	element.textContent = text;
    	return element
    };

    const filterOutStaticElements = child => child.dataset.static === undefined;

    /** @type {import(types').GetElements} */
    const getElements = (node, { parentElement }) => {
    	if (hasSingleTextNode(parentElement)) {
    		const text = parentElement.textContent;
    		const childNode = createElement(parentElement.textContent, 'p');
    		parentElement.textContent = '';
    		parentElement.appendChild(childNode);
    		return [{ currentNode: childNode, text }]
    	}

    	if (hasSingleTextNode(node)) {
    		const textWithFilteredAmpersand = node.innerHTML.replaceAll('&amp;', '&');
    		return [{ currentNode: node, text: textWithFilteredAmpersand }]
    	} else {
    		const children = [...node.children].filter(filterOutStaticElements);
    		const allChildren = children.flatMap(child => getElements(child, { parentElement }));
    		return allChildren
    	}
    };

    const runOnEveryParentUntil = async (element, parent, callback) => {
    	if (!parent) {
    		console.error('The specified parent element does not exists!');
    		return
    	}

    	let currentElement = element;
    	do {
    		if (currentElement === parent) return

    		callback(currentElement);

    		currentElement = currentElement.parentElement || currentElement.parentNode;
    	} while (currentElement !== null && currentElement.nodeType === 1)
    };

    const makeNestedStaticElementsVisible = parentElement => {
    	const staticElements = [...parentElement.querySelectorAll('[data-static]')];
    	for (const staticElement of staticElements) {
    		runOnEveryParentUntil(staticElement, parentElement, currentStaticElement => {
    			const isParentElement = currentStaticElement !== staticElement;
    			isParentElement && currentStaticElement.classList.add('finished-typing');
    		});
    	}
    };

    const getSelectedMode = async options => {
    	if (options.loop || options.loopRandom) {
    		return (await Promise.resolve().then(function () { return loopTypewriter$1; })).mode
    	} else if (options.scramble) {
    		return (await Promise.resolve().then(function () { return scramble; })).mode
    	} else {
    		return (await Promise.resolve().then(function () { return typewriter; })).mode
    	}
    };

    /** @type {import('types').TypewriterMainFn} */
    const typewriter$1 = async (node, options) => {
    	makeNestedStaticElementsVisible(node);
    	const mode = await getSelectedMode(options);
    	const elements = getElements(node, { parentElement: node, ...options });
    	if (options.delay > 0) {
    		const { sleep } = await Promise.resolve().then(function () { return sleep$1; });
    		await sleep(options.delay);
    		node.classList.remove('delay');
    	}
    	mode(elements, { parentElement: node, ...options });
    };

    /* node_modules/svelte-typewriter/src/Typewriter.svelte generated by Svelte v3.49.0 */
    const file$b = "node_modules/svelte-typewriter/src/Typewriter.svelte";

    function create_fragment$b(ctx) {
    	let t;
    	let div;
    	let typewriter_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			t = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "typewriter-container svelte-1tebko8");
    			toggle_class(div, "cursor", /*cursor*/ ctx[0]);
    			toggle_class(div, "delay", /*options*/ ctx[1].delay > 0);

    			set_style(
    				div,
    				"--cursor-color",
    				typeof /*cursor*/ ctx[0] === 'string'
    				? /*cursor*/ ctx[0]
    				: 'black',
    				false
    			);

    			add_location(div, file$b, 51, 0, 1049);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(typewriter_action = typewriter$1.call(null, div, /*options*/ ctx[1]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (typewriter_action && is_function(typewriter_action.update) && dirty & /*options*/ 2) typewriter_action.update.call(null, /*options*/ ctx[1]);

    			if (dirty & /*cursor*/ 1) {
    				toggle_class(div, "cursor", /*cursor*/ ctx[0]);
    			}

    			if (dirty & /*options*/ 2) {
    				toggle_class(div, "delay", /*options*/ ctx[1].delay > 0);
    			}

    			if (dirty & /*cursor*/ 1) {
    				set_style(
    					div,
    					"--cursor-color",
    					typeof /*cursor*/ ctx[0] === 'string'
    					? /*cursor*/ ctx[0]
    					: 'black',
    					false
    				);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let options;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Typewriter', slots, ['default']);
    	let { interval = 30 } = $$props;
    	let { cascade = false } = $$props;
    	let { loop = false } = $$props;
    	let { loopRandom = false } = $$props;
    	let { scramble = false } = $$props;
    	let { scrambleSlowdown = scramble ? true : false } = $$props;
    	let { cursor = true } = $$props;
    	let { delay = 0 } = $$props;
    	let { unwriteInterval = false } = $$props;
    	const dispatch = createEventDispatcher();

    	const writable_props = [
    		'interval',
    		'cascade',
    		'loop',
    		'loopRandom',
    		'scramble',
    		'scrambleSlowdown',
    		'cursor',
    		'delay',
    		'unwriteInterval'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Typewriter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('interval' in $$props) $$invalidate(2, interval = $$props.interval);
    		if ('cascade' in $$props) $$invalidate(3, cascade = $$props.cascade);
    		if ('loop' in $$props) $$invalidate(4, loop = $$props.loop);
    		if ('loopRandom' in $$props) $$invalidate(5, loopRandom = $$props.loopRandom);
    		if ('scramble' in $$props) $$invalidate(6, scramble = $$props.scramble);
    		if ('scrambleSlowdown' in $$props) $$invalidate(7, scrambleSlowdown = $$props.scrambleSlowdown);
    		if ('cursor' in $$props) $$invalidate(0, cursor = $$props.cursor);
    		if ('delay' in $$props) $$invalidate(8, delay = $$props.delay);
    		if ('unwriteInterval' in $$props) $$invalidate(9, unwriteInterval = $$props.unwriteInterval);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		typewriter: typewriter$1,
    		interval,
    		cascade,
    		loop,
    		loopRandom,
    		scramble,
    		scrambleSlowdown,
    		cursor,
    		delay,
    		unwriteInterval,
    		dispatch,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('interval' in $$props) $$invalidate(2, interval = $$props.interval);
    		if ('cascade' in $$props) $$invalidate(3, cascade = $$props.cascade);
    		if ('loop' in $$props) $$invalidate(4, loop = $$props.loop);
    		if ('loopRandom' in $$props) $$invalidate(5, loopRandom = $$props.loopRandom);
    		if ('scramble' in $$props) $$invalidate(6, scramble = $$props.scramble);
    		if ('scrambleSlowdown' in $$props) $$invalidate(7, scrambleSlowdown = $$props.scrambleSlowdown);
    		if ('cursor' in $$props) $$invalidate(0, cursor = $$props.cursor);
    		if ('delay' in $$props) $$invalidate(8, delay = $$props.delay);
    		if ('unwriteInterval' in $$props) $$invalidate(9, unwriteInterval = $$props.unwriteInterval);
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*interval, cascade, loop, loopRandom, scramble, scrambleSlowdown, cursor, delay, unwriteInterval*/ 1021) {
    			$$invalidate(1, options = {
    				interval,
    				cascade,
    				loop,
    				loopRandom,
    				scramble,
    				scrambleSlowdown,
    				cursor,
    				delay,
    				dispatch,
    				unwriteInterval
    			});
    		}
    	};

    	return [
    		cursor,
    		options,
    		interval,
    		cascade,
    		loop,
    		loopRandom,
    		scramble,
    		scrambleSlowdown,
    		delay,
    		unwriteInterval,
    		$$scope,
    		slots
    	];
    }

    class Typewriter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			interval: 2,
    			cascade: 3,
    			loop: 4,
    			loopRandom: 5,
    			scramble: 6,
    			scrambleSlowdown: 7,
    			cursor: 0,
    			delay: 8,
    			unwriteInterval: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Typewriter",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get interval() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set interval(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cascade() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cascade(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loop() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loop(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loopRandom() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loopRandom(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scramble() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scramble(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrambleSlowdown() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrambleSlowdown(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cursor() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cursor(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get delay() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set delay(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unwriteInterval() {
    		throw new Error("<Typewriter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unwriteInterval(value) {
    		throw new Error("<Typewriter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.49.0 */
    const file$a = "src/components/Button.svelte";

    function create_fragment$a(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*href*/ ctx[0]);
    			set_style(a, "width", /*width*/ ctx[1]);
    			attr_dev(a, "class", "svelte-1fncw19");
    			add_location(a, file$a, 6, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*href*/ 1) {
    				attr_dev(a, "href", /*href*/ ctx[0]);
    			}

    			if (!current || dirty & /*width*/ 2) {
    				set_style(a, "width", /*width*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { href } = $$props;
    	let { width = 'auto' } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ['href', 'width'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch('click');

    	$$self.$$set = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		href,
    		width,
    		createEventDispatcher,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, width, dispatch, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, { href: 0, width: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*href*/ ctx[0] === undefined && !('href' in props)) {
    			console.warn("<Button> was created without expected prop 'href'");
    		}
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/page/Home.svelte generated by Svelte v3.49.0 */
    const file$9 = "src/page/Home.svelte";

    // (14:16) <Typewriter loop>
    function create_default_slot_1$1(ctx) {
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let span5;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			span0.textContent = "Front-End Developer";
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "Back-End Developer";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "Hobby guitarist";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "motivated Programmer";
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "bad singer";
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "Member of the human species";
    			attr_dev(span0, "class", "svelte-18z9je2");
    			add_location(span0, file$9, 14, 20, 446);
    			attr_dev(span1, "class", "svelte-18z9je2");
    			add_location(span1, file$9, 15, 20, 500);
    			attr_dev(span2, "class", "svelte-18z9je2");
    			add_location(span2, file$9, 16, 20, 553);
    			attr_dev(span3, "class", "svelte-18z9je2");
    			add_location(span3, file$9, 17, 20, 603);
    			attr_dev(span4, "class", "svelte-18z9je2");
    			add_location(span4, file$9, 18, 20, 658);
    			attr_dev(span5, "class", "svelte-18z9je2");
    			add_location(span5, file$9, 19, 20, 703);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, span2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, span3, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, span4, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, span5, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(span3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(span4);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(span5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(14:16) <Typewriter loop>",
    		ctx
    	});

    	return block;
    }

    // (38:8) <Button on:click={splide.go(3)}>
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Contact");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(38:8) <Button on:click={splide.go(3)}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div2;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let p;
    	let t3;
    	let span;
    	let typewriter;
    	let t4;
    	let div0;
    	let a0;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let a1;
    	let img2;
    	let img2_src_value;
    	let t6;
    	let a2;
    	let img3;
    	let img3_src_value;
    	let t7;
    	let a3;
    	let img4;
    	let img4_src_value;
    	let t8;
    	let button;
    	let current;

    	typewriter = new Typewriter({
    			props: {
    				loop: true,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*splide*/ ctx[0].go(3))) /*splide*/ ctx[0].go(3).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Justin Mankowski";
    			t2 = space();
    			p = element("p");
    			t3 = text("I'm a\r\n            ");
    			span = element("span");
    			create_component(typewriter.$$.fragment);
    			t4 = space();
    			div0 = element("div");
    			a0 = element("a");
    			img1 = element("img");
    			t5 = space();
    			a1 = element("a");
    			img2 = element("img");
    			t6 = space();
    			a2 = element("a");
    			img3 = element("img");
    			t7 = space();
    			a3 = element("a");
    			img4 = element("img");
    			t8 = space();
    			create_component(button.$$.fragment);
    			if (!src_url_equal(img0.src, img0_src_value = "/me.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Justin Mankowski Picture");
    			attr_dev(img0, "class", "svelte-18z9je2");
    			add_location(img0, file$9, 8, 8, 236);
    			attr_dev(h1, "class", "svelte-18z9je2");
    			add_location(h1, file$9, 9, 8, 296);
    			attr_dev(span, "id", "typewriter");
    			attr_dev(span, "class", "svelte-18z9je2");
    			add_location(span, file$9, 12, 12, 367);
    			attr_dev(p, "class", "svelte-18z9je2");
    			add_location(p, file$9, 10, 8, 331);
    			if (!src_url_equal(img1.src, img1_src_value = "/svg/dribbble.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Dribble");
    			attr_dev(img1, "class", "svelte-18z9je2");
    			add_location(img1, file$9, 25, 16, 926);
    			attr_dev(a0, "href", "https://dribbble.com/j_mankowski");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$9, 24, 12, 849);
    			if (!src_url_equal(img2.src, img2_src_value = "/svg/twitter.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Twitter");
    			attr_dev(img2, "class", "svelte-18z9je2");
    			add_location(img2, file$9, 28, 16, 1076);
    			attr_dev(a1, "href", "https://twitter.com/CokeJokeYT");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$9, 27, 12, 1001);
    			if (!src_url_equal(img3.src, img3_src_value = "/svg/github.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "GitHub");
    			attr_dev(img3, "class", "svelte-18z9je2");
    			add_location(img3, file$9, 31, 16, 1222);
    			attr_dev(a2, "href", "https://github.com/cokejoke");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$9, 30, 12, 1150);
    			if (!src_url_equal(img4.src, img4_src_value = "/svg/linkedin.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "LinkedIn");
    			attr_dev(img4, "class", "svelte-18z9je2");
    			add_location(img4, file$9, 34, 16, 1393);
    			attr_dev(a3, "href", "https://www.linkedin.com/in/justin-mankowski-76788b192");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$9, 33, 12, 1294);
    			attr_dev(div0, "id", "links");
    			attr_dev(div0, "class", "svelte-18z9je2");
    			add_location(div0, file$9, 23, 8, 819);
    			attr_dev(div1, "class", "centered-text svelte-18z9je2");
    			add_location(div1, file$9, 7, 4, 199);
    			attr_dev(div2, "id", "home");
    			attr_dev(div2, "class", "svelte-18z9je2");
    			add_location(div2, file$9, 6, 0, 178);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(p, span);
    			mount_component(typewriter, span, null);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img1);
    			append_dev(div0, t5);
    			append_dev(div0, a1);
    			append_dev(a1, img2);
    			append_dev(div0, t6);
    			append_dev(div0, a2);
    			append_dev(a2, img3);
    			append_dev(div0, t7);
    			append_dev(div0, a3);
    			append_dev(a3, img4);
    			append_dev(div1, t8);
    			mount_component(button, div1, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const typewriter_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				typewriter_changes.$$scope = { dirty, ctx };
    			}

    			typewriter.$set(typewriter_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(typewriter.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(typewriter.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(typewriter);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let { splide } = $$props;
    	const writable_props = ['splide'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('splide' in $$props) $$invalidate(0, splide = $$props.splide);
    	};

    	$$self.$capture_state = () => ({ Typewriter, Button, splide });

    	$$self.$inject_state = $$props => {
    		if ('splide' in $$props) $$invalidate(0, splide = $$props.splide);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [splide];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, { splide: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*splide*/ ctx[0] === undefined && !('splide' in props)) {
    			console.warn("<Home> was created without expected prop 'splide'");
    		}
    	}

    	get splide() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set splide(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/page/About.svelte generated by Svelte v3.49.0 */

    const file$8 = "src/page/About.svelte";

    function create_fragment$8(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let p;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "About me";
    			t1 = space();
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "I already had a fascination for modern technology at an early age. Ultimately, I also found a place in\r\n                the world of modern technology. My specialty is the front-end, but now and then I also make the\r\n                back-end, which also gives me a lot of fun and joy. I never get bored in this world because there is\r\n                always something new to learn, for example, a new better front-end framework.";
    			attr_dev(h1, "class", "svelte-pbgef8");
    			add_location(h1, file$8, 4, 8, 77);
    			attr_dev(p, "class", "svelte-pbgef8");
    			add_location(p, file$8, 6, 12, 137);
    			attr_dev(div0, "id", "box-text");
    			attr_dev(div0, "class", "svelte-pbgef8");
    			add_location(div0, file$8, 5, 8, 104);
    			attr_dev(div1, "id", "box");
    			attr_dev(div1, "class", "svelte-pbgef8");
    			add_location(div1, file$8, 3, 4, 53);
    			attr_dev(div2, "id", "about");
    			attr_dev(div2, "class", "svelte-pbgef8");
    			add_location(div2, file$8, 2, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /**
     * Atropos 1.0.2
     * Touch-friendly 3D parallax hover effects
     * https://atroposjs.com
     *
     * Copyright 2021-2022 
     *
     * Released under the MIT License
     *
     * Released on: February 17, 2022
     */

    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends.apply(this, arguments);
    }

    /* eslint-disable no-restricted-globals */
    var $ = function $(el, sel) {
      return el.querySelector(sel);
    };

    var $$ = function $$(el, sel) {
      return el.querySelectorAll(sel);
    };

    var removeUndefinedProps = function removeUndefinedProps(obj) {
      if (obj === void 0) {
        obj = {};
      }

      var result = {};
      Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] !== 'undefined') result[key] = obj[key];
      });
      return result;
    };

    function Atropos(originalParams) {
      if (originalParams === void 0) {
        originalParams = {};
      }

      var _originalParams = originalParams,
          el = _originalParams.el,
          eventsEl = _originalParams.eventsEl;
      var self = {
        __atropos__: true,
        params: _extends({
          alwaysActive: false,
          activeOffset: 50,
          shadowOffset: 50,
          shadowScale: 1,
          duration: 300,
          rotate: true,
          rotateTouch: true,
          rotateXMax: 15,
          rotateYMax: 15,
          rotateXInvert: false,
          rotateYInvert: false,
          stretchX: 0,
          stretchY: 0,
          stretchZ: 0,
          commonOrigin: true,
          shadow: true,
          highlight: true,
          onEnter: null,
          onLeave: null,
          onRotate: null
        }, removeUndefinedProps(originalParams || {})),
        destroyed: false,
        isActive: false
      };
      var params = self.params;
      var rotateEl;
      var scaleEl;
      var innerEl;
      var elBoundingClientRect;
      var eventsElBoundingClientRect;
      var shadowEl;
      var highlightEl;
      var isScrolling;
      var clientXStart;
      var clientYStart;
      var queue = [];
      var queueFrameId;

      var purgeQueue = function purgeQueue() {
        queueFrameId = requestAnimationFrame(function () {
          queue.forEach(function (data) {
            if (typeof data === 'function') {
              data();
            } else {
              var element = data.element,
                  prop = data.prop,
                  value = data.value;
              element.style[prop] = value;
            }
          });
          queue.splice(0, queue.length);
          purgeQueue();
        });
      };

      purgeQueue();

      var $setDuration = function $setDuration(element, value) {
        queue.push({
          element: element,
          prop: 'transitionDuration',
          value: value
        });
      };

      var $setEasing = function $setEasing(element, value) {
        queue.push({
          element: element,
          prop: 'transitionTimingFunction',
          value: value
        });
      };

      var $setTransform = function $setTransform(element, value) {
        queue.push({
          element: element,
          prop: 'transform',
          value: value
        });
      };

      var $setOpacity = function $setOpacity(element, value) {
        queue.push({
          element: element,
          prop: 'opacity',
          value: value
        });
      };

      var $setOrigin = function $setOrigin(element, value) {
        queue.push({
          element: element,
          prop: 'transformOrigin',
          value: value
        });
      };

      var $on = function $on(element, event, handler, props) {
        return element.addEventListener(event, handler, props);
      };

      var $off = function $off(element, event, handler, props) {
        return element.removeEventListener(event, handler, props);
      };

      var createShadow = function createShadow() {
        var created;
        shadowEl = $(el, '.atropos-shadow');

        if (!shadowEl) {
          shadowEl = document.createElement('span');
          shadowEl.classList.add('atropos-shadow');
          created = true;
        }

        $setTransform(shadowEl, "translate3d(0,0,-" + params.shadowOffset + "px) scale(" + params.shadowScale + ")");

        if (created) {
          rotateEl.appendChild(shadowEl);
        }
      };

      var createHighlight = function createHighlight() {
        var created;
        highlightEl = $(el, '.atropos-highlight');

        if (!highlightEl) {
          highlightEl = document.createElement('span');
          highlightEl.classList.add('atropos-highlight');
          created = true;
        }

        $setTransform(highlightEl, "translate3d(0,0,0)");

        if (created) {
          innerEl.appendChild(highlightEl);
        }
      };

      var setChildrenOffset = function setChildrenOffset(_ref) {
        var _ref$rotateXPercentag = _ref.rotateXPercentage,
            rotateXPercentage = _ref$rotateXPercentag === void 0 ? 0 : _ref$rotateXPercentag,
            _ref$rotateYPercentag = _ref.rotateYPercentage,
            rotateYPercentage = _ref$rotateYPercentag === void 0 ? 0 : _ref$rotateYPercentag,
            duration = _ref.duration,
            opacityOnly = _ref.opacityOnly,
            easeOut = _ref.easeOut;

        var getOpacity = function getOpacity(element) {
          if (element.dataset.atroposOpacity && typeof element.dataset.atroposOpacity === 'string') {
            return element.dataset.atroposOpacity.split(';').map(function (v) {
              return parseFloat(v);
            });
          }

          return undefined;
        };

        $$(el, '[data-atropos-offset], [data-atropos-opacity]').forEach(function (childEl) {
          $setDuration(childEl, duration);
          $setEasing(childEl, easeOut ? 'ease-out' : '');
          var elementOpacity = getOpacity(childEl);

          if (rotateXPercentage === 0 && rotateYPercentage === 0) {
            if (!opacityOnly) $setTransform(childEl, "translate3d(0, 0, 0)");
            if (elementOpacity) $setOpacity(childEl, elementOpacity[0]);
          } else {
            var childElOffset = parseFloat(childEl.dataset.atroposOffset) / 100;

            if (!Number.isNaN(childElOffset) && !opacityOnly) {
              $setTransform(childEl, "translate3d(" + -rotateYPercentage * -childElOffset + "%, " + rotateXPercentage * -childElOffset + "%, 0)");
            }

            if (elementOpacity) {
              var min = elementOpacity[0],
                  max = elementOpacity[1];
              var rotatePercentage = Math.max(Math.abs(rotateXPercentage), Math.abs(rotateYPercentage));
              $setOpacity(childEl, min + (max - min) * rotatePercentage / 100);
            }
          }
        });
      };

      var setElements = function setElements(clientX, clientY) {
        var isMultiple = el !== eventsEl;

        if (!elBoundingClientRect) {
          elBoundingClientRect = el.getBoundingClientRect();
        }

        if (isMultiple && !eventsElBoundingClientRect) {
          eventsElBoundingClientRect = eventsEl.getBoundingClientRect();
        }

        if (typeof clientX === 'undefined' && typeof clientY === 'undefined') {
          var rect = isMultiple ? eventsElBoundingClientRect : elBoundingClientRect;
          clientX = rect.left + rect.width / 2;
          clientY = rect.top + rect.height / 2;
        }

        var rotateX = 0;
        var rotateY = 0;
        var _elBoundingClientRect = elBoundingClientRect,
            top = _elBoundingClientRect.top,
            left = _elBoundingClientRect.left,
            width = _elBoundingClientRect.width,
            height = _elBoundingClientRect.height;
        var transformOrigin;

        if (!isMultiple) {
          var centerX = width / 2;
          var centerY = height / 2;
          var coordX = clientX - left;
          var coordY = clientY - top;
          rotateY = params.rotateYMax * (coordX - centerX) / (width / 2) * -1;
          rotateX = params.rotateXMax * (coordY - centerY) / (height / 2);
        } else {
          var _eventsElBoundingClie = eventsElBoundingClientRect,
              parentTop = _eventsElBoundingClie.top,
              parentLeft = _eventsElBoundingClie.left,
              parentWidth = _eventsElBoundingClie.width,
              parentHeight = _eventsElBoundingClie.height;
          var offsetLeft = left - parentLeft;
          var offsetTop = top - parentTop;

          var _centerX = width / 2 + offsetLeft;

          var _centerY = height / 2 + offsetTop;

          var _coordX = clientX - parentLeft;

          var _coordY = clientY - parentTop;

          rotateY = params.rotateYMax * (_coordX - _centerX) / (parentWidth - width / 2) * -1;
          rotateX = params.rotateXMax * (_coordY - _centerY) / (parentHeight - height / 2);
          transformOrigin = clientX - left + "px " + (clientY - top) + "px";
        }

        rotateX = Math.min(Math.max(-rotateX, -params.rotateXMax), params.rotateXMax);
        if (params.rotateXInvert) rotateX = -rotateX;
        rotateY = Math.min(Math.max(-rotateY, -params.rotateYMax), params.rotateYMax);
        if (params.rotateYInvert) rotateY = -rotateY;
        var rotateXPercentage = rotateX / params.rotateXMax * 100;
        var rotateYPercentage = rotateY / params.rotateYMax * 100;
        var stretchX = (isMultiple ? rotateYPercentage / 100 * params.stretchX : 0) * (params.rotateYInvert ? -1 : 1);
        var stretchY = (isMultiple ? rotateXPercentage / 100 * params.stretchY : 0) * (params.rotateXInvert ? -1 : 1);
        var stretchZ = isMultiple ? Math.max(Math.abs(rotateXPercentage), Math.abs(rotateYPercentage)) / 100 * params.stretchZ : 0;
        $setTransform(rotateEl, "translate3d(" + stretchX + "%, " + -stretchY + "%, " + -stretchZ + "px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)");

        if (transformOrigin && params.commonOrigin) {
          $setOrigin(rotateEl, transformOrigin);
        }

        if (highlightEl) {
          $setDuration(highlightEl, params.duration + "ms");
          $setEasing(highlightEl, 'ease-out');
          $setTransform(highlightEl, "translate3d(" + -rotateYPercentage * 0.25 + "%, " + rotateXPercentage * 0.25 + "%, 0)");
          $setOpacity(highlightEl, Math.max(Math.abs(rotateXPercentage), Math.abs(rotateYPercentage)) / 100);
        }

        setChildrenOffset({
          rotateXPercentage: rotateXPercentage,
          rotateYPercentage: rotateYPercentage,
          duration: params.duration + "ms",
          easeOut: true
        });
        if (typeof params.onRotate === 'function') params.onRotate(rotateX, rotateY);
      };

      var activate = function activate() {
        queue.push(function () {
          return el.classList.add('atropos-active');
        });
        $setDuration(rotateEl, params.duration + "ms");
        $setEasing(rotateEl, 'ease-out');
        $setTransform(scaleEl, "translate3d(0,0, " + params.activeOffset + "px)");
        $setDuration(scaleEl, params.duration + "ms");
        $setEasing(scaleEl, 'ease-out');

        if (shadowEl) {
          $setDuration(shadowEl, params.duration + "ms");
          $setEasing(shadowEl, 'ease-out');
        }

        self.isActive = true;
      };

      var onPointerEnter = function onPointerEnter(e) {
        isScrolling = undefined;
        if (e.type === 'pointerdown' && e.pointerType === 'mouse') return;
        if (e.type === 'pointerenter' && e.pointerType !== 'mouse') return;

        if (e.type === 'pointerdown') {
          e.preventDefault();
        }

        clientXStart = e.clientX;
        clientYStart = e.clientY;

        if (params.alwaysActive) {
          elBoundingClientRect = undefined;
          eventsElBoundingClientRect = undefined;
          return;
        }

        activate();
        if (typeof params.onEnter === 'function') params.onEnter();
      };

      var onTouchMove = function onTouchMove(e) {
        if (isScrolling === false && e.cancelable) {
          e.preventDefault();
        }
      };

      var onPointerMove = function onPointerMove(e) {
        if (!params.rotate || !self.isActive) return;

        if (e.pointerType !== 'mouse') {
          if (!params.rotateTouch) return;
          e.preventDefault();
        }

        var clientX = e.clientX,
            clientY = e.clientY;
        var diffX = clientX - clientXStart;
        var diffY = clientY - clientYStart;

        if (typeof params.rotateTouch === 'string' && (diffX !== 0 || diffY !== 0) && typeof isScrolling === 'undefined') {
          if (diffX * diffX + diffY * diffY >= 25) {
            var touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
            isScrolling = params.rotateTouch === 'scroll-y' ? touchAngle > 45 : 90 - touchAngle > 45;
          }

          if (isScrolling === false) {
            el.classList.add('atropos-rotate-touch');

            if (e.cancelable) {
              e.preventDefault();
            }
          }
        }

        if (e.pointerType !== 'mouse' && isScrolling) {
          return;
        }

        setElements(clientX, clientY);
      };

      var onPointerLeave = function onPointerLeave(e) {
        elBoundingClientRect = undefined;
        eventsElBoundingClientRect = undefined;
        if (!self.isActive) return;
        if (e && e.type === 'pointerup' && e.pointerType === 'mouse') return;
        if (e && e.type === 'pointerleave' && e.pointerType !== 'mouse') return;

        if (typeof params.rotateTouch === 'string' && isScrolling) {
          el.classList.remove('atropos-rotate-touch');
        }

        if (params.alwaysActive) {
          setElements();
          if (typeof params.onRotate === 'function') params.onRotate(0, 0);
          if (typeof params.onLeave === 'function') params.onLeave();
          return;
        }

        queue.push(function () {
          return el.classList.remove('atropos-active');
        });
        $setDuration(scaleEl, params.duration + "ms");
        $setEasing(scaleEl, '');
        $setTransform(scaleEl, "translate3d(0,0, " + 0 + "px)");

        if (shadowEl) {
          $setDuration(shadowEl, params.duration + "ms");
          $setEasing(shadowEl, '');
        }

        if (highlightEl) {
          $setDuration(highlightEl, params.duration + "ms");
          $setEasing(highlightEl, '');
          $setTransform(highlightEl, "translate3d(0, 0, 0)");
          $setOpacity(highlightEl, 0);
        }

        $setDuration(rotateEl, params.duration + "ms");
        $setEasing(rotateEl, '');
        $setTransform(rotateEl, "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)");
        setChildrenOffset({
          duration: params.duration + "ms"
        });
        self.isActive = false;
        if (typeof params.onRotate === 'function') params.onRotate(0, 0);
        if (typeof params.onLeave === 'function') params.onLeave();
      };

      var onDocumentClick = function onDocumentClick(e) {
        var clickTarget = e.target;

        if (!eventsEl.contains(clickTarget) && clickTarget !== eventsEl && self.isActive) {
          onPointerLeave();
        }
      };

      var initDOM = function initDOM() {
        if (typeof el === 'string') {
          el = $(document, el);
        }

        if (!el) return; // eslint-disable-next-line

        if (el.__atropos__) return;

        if (typeof eventsEl !== 'undefined') {
          if (typeof eventsEl === 'string') {
            eventsEl = $(document, eventsEl);
          }
        } else {
          eventsEl = el;
        }

        Object.assign(self, {
          el: el
        });
        rotateEl = $(el, '.atropos-rotate');
        scaleEl = $(el, '.atropos-scale');
        innerEl = $(el, '.atropos-inner'); // eslint-disable-next-line

        el.__atropos__ = self;
      };

      var init = function init() {
        initDOM();
        if (!el || !eventsEl) return;

        if (params.shadow) {
          createShadow();
        }

        if (params.highlight) {
          createHighlight();
        }

        if (params.rotateTouch) {
          if (typeof params.rotateTouch === 'string') {
            el.classList.add("atropos-rotate-touch-" + params.rotateTouch);
          } else {
            el.classList.add('atropos-rotate-touch');
          }
        }

        if ($(el, '[data-atropos-opacity]')) {
          setChildrenOffset({
            opacityOnly: true
          });
        }

        $on(document, 'click', onDocumentClick);
        $on(eventsEl, 'pointerdown', onPointerEnter);
        $on(eventsEl, 'pointerenter', onPointerEnter);
        $on(eventsEl, 'pointermove', onPointerMove);
        $on(eventsEl, 'touchmove', onTouchMove);
        $on(eventsEl, 'pointerleave', onPointerLeave);
        $on(eventsEl, 'pointerup', onPointerLeave);
        $on(eventsEl, 'lostpointercapture', onPointerLeave);

        if (params.alwaysActive) {
          activate();
          setElements();
        }
      };

      var destroy = function destroy() {
        self.destroyed = true;
        cancelAnimationFrame(queueFrameId);
        $off(document, 'click', onDocumentClick);
        $off(eventsEl, 'pointerdown', onPointerEnter);
        $off(eventsEl, 'pointerenter', onPointerEnter);
        $off(eventsEl, 'pointermove', onPointerMove);
        $off(eventsEl, 'touchmove', onTouchMove);
        $off(eventsEl, 'pointerleave', onPointerLeave);
        $off(eventsEl, 'pointerup', onPointerLeave);
        $off(eventsEl, 'lostpointercapture', onPointerLeave); // eslint-disable-next-line

        delete el.__atropos__;
      };

      self.destroy = destroy;
      init(); // eslint-disable-next-line

      return self;
    }

    /* node_modules/atropos/svelte/atropos-svelte.svelte generated by Svelte v3.49.0 */

    const file$7 = "node_modules/atropos/svelte/atropos-svelte.svelte";
    const get_root_slot_changes = dirty => ({});
    const get_root_slot_context = ctx => ({});
    const get_scale_slot_changes = dirty => ({});
    const get_scale_slot_context = ctx => ({});
    const get_rotate_slot_changes = dirty => ({});
    const get_rotate_slot_context = ctx => ({});

    // (90:8) {#if highlight || typeof highlight === 'undefined'}
    function create_if_block_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "atropos-highlight");
    			add_location(span, file$7, 90, 10, 2185);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(90:8) {#if highlight || typeof highlight === 'undefined'}",
    		ctx
    	});

    	return block;
    }

    // (95:6) {#if shadow || typeof shadow === 'undefined'}
    function create_if_block$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "atropos-shadow");
    			add_location(span, file$7, 95, 8, 2337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(95:6) {#if shadow || typeof shadow === 'undefined'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let span2;
    	let span1;
    	let span0;
    	let t0;
    	let span0_class_value;
    	let t1;
    	let t2;
    	let span1_class_value;
    	let t3;
    	let span2_class_value;
    	let t4;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);
    	let if_block0 = (/*highlight*/ ctx[5] || typeof /*highlight*/ ctx[5] === 'undefined') && create_if_block_1(ctx);
    	const rotate_slot_template = /*#slots*/ ctx[26].rotate;
    	const rotate_slot = create_slot(rotate_slot_template, ctx, /*$$scope*/ ctx[25], get_rotate_slot_context);
    	let if_block1 = (/*shadow*/ ctx[4] || typeof /*shadow*/ ctx[4] === 'undefined') && create_if_block$1(ctx);
    	const scale_slot_template = /*#slots*/ ctx[26].scale;
    	const scale_slot = create_slot(scale_slot_template, ctx, /*$$scope*/ ctx[25], get_scale_slot_context);
    	const root_slot_template = /*#slots*/ ctx[26].root;
    	const root_slot = create_slot(root_slot_template, ctx, /*$$scope*/ ctx[25], get_root_slot_context);

    	let div_levels = [
    		{
    			class: div_class_value = /*cls*/ ctx[7]('atropos', /*className*/ ctx[0])
    		},
    		/*$$restProps*/ ctx[8]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign$1(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span2 = element("span");
    			span1 = element("span");
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (rotate_slot) rotate_slot.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (scale_slot) scale_slot.c();
    			t4 = space();
    			if (root_slot) root_slot.c();
    			attr_dev(span0, "class", span0_class_value = /*cls*/ ctx[7]('atropos-inner', /*innerClass*/ ctx[3]));
    			add_location(span0, file$7, 87, 6, 2050);
    			attr_dev(span1, "class", span1_class_value = /*cls*/ ctx[7]('atropos-rotate', /*rotateClass*/ ctx[2]));
    			add_location(span1, file$7, 86, 4, 1994);
    			attr_dev(span2, "class", span2_class_value = /*cls*/ ctx[7]('atropos-scale', /*scaleClass*/ ctx[1]));
    			add_location(span2, file$7, 85, 2, 1942);
    			set_attributes(div, div_data);
    			add_location(div, file$7, 84, 0, 1865);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span2);
    			append_dev(span2, span1);
    			append_dev(span1, span0);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			append_dev(span0, t0);
    			if (if_block0) if_block0.m(span0, null);
    			append_dev(span1, t1);

    			if (rotate_slot) {
    				rotate_slot.m(span1, null);
    			}

    			append_dev(span1, t2);
    			if (if_block1) if_block1.m(span1, null);
    			append_dev(span2, t3);

    			if (scale_slot) {
    				scale_slot.m(span2, null);
    			}

    			append_dev(div, t4);

    			if (root_slot) {
    				root_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[27](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[25], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*highlight*/ ctx[5] || typeof /*highlight*/ ctx[5] === 'undefined') {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(span0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty[0] & /*innerClass*/ 8 && span0_class_value !== (span0_class_value = /*cls*/ ctx[7]('atropos-inner', /*innerClass*/ ctx[3]))) {
    				attr_dev(span0, "class", span0_class_value);
    			}

    			if (rotate_slot) {
    				if (rotate_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						rotate_slot,
    						rotate_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(rotate_slot_template, /*$$scope*/ ctx[25], dirty, get_rotate_slot_changes),
    						get_rotate_slot_context
    					);
    				}
    			}

    			if (/*shadow*/ ctx[4] || typeof /*shadow*/ ctx[4] === 'undefined') {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(span1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty[0] & /*rotateClass*/ 4 && span1_class_value !== (span1_class_value = /*cls*/ ctx[7]('atropos-rotate', /*rotateClass*/ ctx[2]))) {
    				attr_dev(span1, "class", span1_class_value);
    			}

    			if (scale_slot) {
    				if (scale_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						scale_slot,
    						scale_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(scale_slot_template, /*$$scope*/ ctx[25], dirty, get_scale_slot_changes),
    						get_scale_slot_context
    					);
    				}
    			}

    			if (!current || dirty[0] & /*scaleClass*/ 2 && span2_class_value !== (span2_class_value = /*cls*/ ctx[7]('atropos-scale', /*scaleClass*/ ctx[1]))) {
    				attr_dev(span2, "class", span2_class_value);
    			}

    			if (root_slot) {
    				if (root_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						root_slot,
    						root_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(root_slot_template, /*$$scope*/ ctx[25], dirty, get_root_slot_changes),
    						get_root_slot_context
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className*/ 1 && div_class_value !== (div_class_value = /*cls*/ ctx[7]('atropos', /*className*/ ctx[0]))) && { class: div_class_value },
    				dirty[0] & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(rotate_slot, local);
    			transition_in(scale_slot, local);
    			transition_in(root_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(rotate_slot, local);
    			transition_out(scale_slot, local);
    			transition_out(root_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (rotate_slot) rotate_slot.d(detaching);
    			if (if_block1) if_block1.d();
    			if (scale_slot) scale_slot.d(detaching);
    			if (root_slot) root_slot.d(detaching);
    			/*div_binding*/ ctx[27](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","scaleClass","rotateClass","innerClass","eventsEl","alwaysActive","activeOffset","shadowOffset","shadowScale","duration","rotate","rotateTouch","rotateXMax","rotateYMax","rotateXInvert","rotateYInvert","stretchX","stretchY","stretchZ","commonOrigin","shadow","highlight"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Atropos_svelte', slots, ['default','rotate','scale','root']);
    	let { class: className = '' } = $$props;
    	let { scaleClass = '' } = $$props;
    	let { rotateClass = '' } = $$props;
    	let { innerClass = '' } = $$props;
    	let { eventsEl = undefined } = $$props;
    	let { alwaysActive = undefined } = $$props;
    	let { activeOffset = undefined } = $$props;
    	let { shadowOffset = undefined } = $$props;
    	let { shadowScale = undefined } = $$props;
    	let { duration = undefined } = $$props;
    	let { rotate = undefined } = $$props;
    	let { rotateTouch = undefined } = $$props;
    	let { rotateXMax = undefined } = $$props;
    	let { rotateYMax = undefined } = $$props;
    	let { rotateXInvert = undefined } = $$props;
    	let { rotateYInvert = undefined } = $$props;
    	let { stretchX = undefined } = $$props;
    	let { stretchY = undefined } = $$props;
    	let { stretchZ = undefined } = $$props;
    	let { commonOrigin = true } = $$props;
    	let { shadow = true } = $$props;
    	let { highlight = true } = $$props;
    	const emit = createEventDispatcher();
    	let elRef = null;
    	let atroposRef = null;

    	const cls = (...args) => {
    		return args.filter(c => !!c).join(' ');
    	};

    	const init = () => {
    		atroposRef = Atropos({
    			el: elRef,
    			eventsEl,
    			alwaysActive,
    			activeOffset,
    			shadowOffset,
    			shadowScale,
    			duration,
    			rotate,
    			rotateTouch,
    			rotateXMax,
    			rotateYMax,
    			rotateXInvert,
    			rotateYInvert,
    			stretchX,
    			stretchY,
    			stretchZ,
    			commonOrigin,
    			onEnter() {
    				emit('enter');
    			},
    			onLeave() {
    				emit('leave');
    			},
    			onRotate(...args) {
    				emit('rotate', args);
    			}
    		});
    	};

    	const destroy = () => {
    		if (atroposRef) {
    			atroposRef.destroy();
    			atroposRef = null;
    		}
    	};

    	onMount(() => {
    		init();
    	});

    	onDestroy(() => {
    		destroy();
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			elRef = $$value;
    			$$invalidate(6, elRef);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ('scaleClass' in $$new_props) $$invalidate(1, scaleClass = $$new_props.scaleClass);
    		if ('rotateClass' in $$new_props) $$invalidate(2, rotateClass = $$new_props.rotateClass);
    		if ('innerClass' in $$new_props) $$invalidate(3, innerClass = $$new_props.innerClass);
    		if ('eventsEl' in $$new_props) $$invalidate(9, eventsEl = $$new_props.eventsEl);
    		if ('alwaysActive' in $$new_props) $$invalidate(10, alwaysActive = $$new_props.alwaysActive);
    		if ('activeOffset' in $$new_props) $$invalidate(11, activeOffset = $$new_props.activeOffset);
    		if ('shadowOffset' in $$new_props) $$invalidate(12, shadowOffset = $$new_props.shadowOffset);
    		if ('shadowScale' in $$new_props) $$invalidate(13, shadowScale = $$new_props.shadowScale);
    		if ('duration' in $$new_props) $$invalidate(14, duration = $$new_props.duration);
    		if ('rotate' in $$new_props) $$invalidate(15, rotate = $$new_props.rotate);
    		if ('rotateTouch' in $$new_props) $$invalidate(16, rotateTouch = $$new_props.rotateTouch);
    		if ('rotateXMax' in $$new_props) $$invalidate(17, rotateXMax = $$new_props.rotateXMax);
    		if ('rotateYMax' in $$new_props) $$invalidate(18, rotateYMax = $$new_props.rotateYMax);
    		if ('rotateXInvert' in $$new_props) $$invalidate(19, rotateXInvert = $$new_props.rotateXInvert);
    		if ('rotateYInvert' in $$new_props) $$invalidate(20, rotateYInvert = $$new_props.rotateYInvert);
    		if ('stretchX' in $$new_props) $$invalidate(21, stretchX = $$new_props.stretchX);
    		if ('stretchY' in $$new_props) $$invalidate(22, stretchY = $$new_props.stretchY);
    		if ('stretchZ' in $$new_props) $$invalidate(23, stretchZ = $$new_props.stretchZ);
    		if ('commonOrigin' in $$new_props) $$invalidate(24, commonOrigin = $$new_props.commonOrigin);
    		if ('shadow' in $$new_props) $$invalidate(4, shadow = $$new_props.shadow);
    		if ('highlight' in $$new_props) $$invalidate(5, highlight = $$new_props.highlight);
    		if ('$$scope' in $$new_props) $$invalidate(25, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		AtroposCore: Atropos,
    		className,
    		scaleClass,
    		rotateClass,
    		innerClass,
    		eventsEl,
    		alwaysActive,
    		activeOffset,
    		shadowOffset,
    		shadowScale,
    		duration,
    		rotate,
    		rotateTouch,
    		rotateXMax,
    		rotateYMax,
    		rotateXInvert,
    		rotateYInvert,
    		stretchX,
    		stretchY,
    		stretchZ,
    		commonOrigin,
    		shadow,
    		highlight,
    		emit,
    		elRef,
    		atroposRef,
    		cls,
    		init,
    		destroy
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(0, className = $$new_props.className);
    		if ('scaleClass' in $$props) $$invalidate(1, scaleClass = $$new_props.scaleClass);
    		if ('rotateClass' in $$props) $$invalidate(2, rotateClass = $$new_props.rotateClass);
    		if ('innerClass' in $$props) $$invalidate(3, innerClass = $$new_props.innerClass);
    		if ('eventsEl' in $$props) $$invalidate(9, eventsEl = $$new_props.eventsEl);
    		if ('alwaysActive' in $$props) $$invalidate(10, alwaysActive = $$new_props.alwaysActive);
    		if ('activeOffset' in $$props) $$invalidate(11, activeOffset = $$new_props.activeOffset);
    		if ('shadowOffset' in $$props) $$invalidate(12, shadowOffset = $$new_props.shadowOffset);
    		if ('shadowScale' in $$props) $$invalidate(13, shadowScale = $$new_props.shadowScale);
    		if ('duration' in $$props) $$invalidate(14, duration = $$new_props.duration);
    		if ('rotate' in $$props) $$invalidate(15, rotate = $$new_props.rotate);
    		if ('rotateTouch' in $$props) $$invalidate(16, rotateTouch = $$new_props.rotateTouch);
    		if ('rotateXMax' in $$props) $$invalidate(17, rotateXMax = $$new_props.rotateXMax);
    		if ('rotateYMax' in $$props) $$invalidate(18, rotateYMax = $$new_props.rotateYMax);
    		if ('rotateXInvert' in $$props) $$invalidate(19, rotateXInvert = $$new_props.rotateXInvert);
    		if ('rotateYInvert' in $$props) $$invalidate(20, rotateYInvert = $$new_props.rotateYInvert);
    		if ('stretchX' in $$props) $$invalidate(21, stretchX = $$new_props.stretchX);
    		if ('stretchY' in $$props) $$invalidate(22, stretchY = $$new_props.stretchY);
    		if ('stretchZ' in $$props) $$invalidate(23, stretchZ = $$new_props.stretchZ);
    		if ('commonOrigin' in $$props) $$invalidate(24, commonOrigin = $$new_props.commonOrigin);
    		if ('shadow' in $$props) $$invalidate(4, shadow = $$new_props.shadow);
    		if ('highlight' in $$props) $$invalidate(5, highlight = $$new_props.highlight);
    		if ('elRef' in $$props) $$invalidate(6, elRef = $$new_props.elRef);
    		if ('atroposRef' in $$props) atroposRef = $$new_props.atroposRef;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		className,
    		scaleClass,
    		rotateClass,
    		innerClass,
    		shadow,
    		highlight,
    		elRef,
    		cls,
    		$$restProps,
    		eventsEl,
    		alwaysActive,
    		activeOffset,
    		shadowOffset,
    		shadowScale,
    		duration,
    		rotate,
    		rotateTouch,
    		rotateXMax,
    		rotateYMax,
    		rotateXInvert,
    		rotateYInvert,
    		stretchX,
    		stretchY,
    		stretchZ,
    		commonOrigin,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Atropos_svelte extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				class: 0,
    				scaleClass: 1,
    				rotateClass: 2,
    				innerClass: 3,
    				eventsEl: 9,
    				alwaysActive: 10,
    				activeOffset: 11,
    				shadowOffset: 12,
    				shadowScale: 13,
    				duration: 14,
    				rotate: 15,
    				rotateTouch: 16,
    				rotateXMax: 17,
    				rotateYMax: 18,
    				rotateXInvert: 19,
    				rotateYInvert: 20,
    				stretchX: 21,
    				stretchY: 22,
    				stretchZ: 23,
    				commonOrigin: 24,
    				shadow: 4,
    				highlight: 5
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Atropos_svelte",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get class() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scaleClass() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scaleClass(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotateClass() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotateClass(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get innerClass() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set innerClass(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get eventsEl() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set eventsEl(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alwaysActive() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alwaysActive(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeOffset() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeOffset(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shadowOffset() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shadowOffset(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shadowScale() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shadowScale(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotate() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotate(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotateTouch() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotateTouch(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotateXMax() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotateXMax(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotateYMax() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotateYMax(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotateXInvert() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotateXInvert(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotateYInvert() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotateYInvert(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stretchX() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stretchX(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stretchY() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stretchY(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stretchZ() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stretchZ(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get commonOrigin() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set commonOrigin(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shadow() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shadow(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlight() {
    		throw new Error("<Atropos_svelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlight(value) {
    		throw new Error("<Atropos_svelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Project.svelte generated by Svelte v3.49.0 */
    const file$6 = "src/components/Project.svelte";

    // (8:4) <Atropos shadow={false} highlight={false} class="my-atropos">
    function create_default_slot$2(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t;
    	let style_background_image = `url(${/*img*/ ctx[1]})`;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t = text(/*name*/ ctx[0]);
    			add_location(h2, file$6, 10, 16, 330);
    			attr_dev(div0, "class", "inner svelte-w5rk30");
    			add_location(div0, file$6, 9, 12, 293);
    			attr_dev(div1, "class", "project svelte-w5rk30");
    			set_style(div1, "background-image", style_background_image, false);
    			add_location(div1, file$6, 8, 8, 222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1) set_data_dev(t, /*name*/ ctx[0]);

    			if (dirty & /*img*/ 2 && style_background_image !== (style_background_image = `url(${/*img*/ ctx[1]})`)) {
    				set_style(div1, "background-image", style_background_image, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(8:4) <Atropos shadow={false} highlight={false} class=\\\"my-atropos\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let a;
    	let atropos;
    	let current;

    	atropos = new Atropos_svelte({
    			props: {
    				shadow: false,
    				highlight: false,
    				class: "my-atropos",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			create_component(atropos.$$.fragment);
    			attr_dev(a, "href", /*href*/ ctx[2]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-w5rk30");
    			add_location(a, file$6, 6, 0, 119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			mount_component(atropos, a, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const atropos_changes = {};

    			if (dirty & /*$$scope, img, name*/ 11) {
    				atropos_changes.$$scope = { dirty, ctx };
    			}

    			atropos.$set(atropos_changes);

    			if (!current || dirty & /*href*/ 4) {
    				attr_dev(a, "href", /*href*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(atropos.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(atropos.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			destroy_component(atropos);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project', slots, []);
    	let { name } = $$props;
    	let { img } = $$props;
    	let { href } = $$props;
    	const writable_props = ['name', 'img', 'href'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('img' in $$props) $$invalidate(1, img = $$props.img);
    		if ('href' in $$props) $$invalidate(2, href = $$props.href);
    	};

    	$$self.$capture_state = () => ({ Atropos: Atropos_svelte, name, img, href });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('img' in $$props) $$invalidate(1, img = $$props.img);
    		if ('href' in $$props) $$invalidate(2, href = $$props.href);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, img, href];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { name: 0, img: 1, href: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Project> was created without expected prop 'name'");
    		}

    		if (/*img*/ ctx[1] === undefined && !('img' in props)) {
    			console.warn("<Project> was created without expected prop 'img'");
    		}

    		if (/*href*/ ctx[2] === undefined && !('href' in props)) {
    			console.warn("<Project> was created without expected prop 'href'");
    		}
    	}

    	get name() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/page/Projects.svelte generated by Svelte v3.49.0 */
    const file$5 = "src/page/Projects.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let project0;
    	let t2;
    	let project1;
    	let t3;
    	let project2;
    	let current;

    	project0 = new Project({
    			props: {
    				name: "WhatTheGif",
    				img: "/projects/WhatTheGif.png",
    				href: "https://github.com/chammmel/whatthegif"
    			},
    			$$inline: true
    		});

    	project1 = new Project({
    			props: {
    				name: "SmashMC",
    				img: "/projects/SmashMC.png",
    				href: "https://smashmc.eu"
    			},
    			$$inline: true
    		});

    	project2 = new Project({
    			props: {
    				name: "review-ui",
    				img: "/projects/review-ui.png",
    				href: "https://cokejoke.github.io/review-ui/"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "My Projects";
    			t1 = space();
    			div0 = element("div");
    			create_component(project0.$$.fragment);
    			t2 = space();
    			create_component(project1.$$.fragment);
    			t3 = space();
    			create_component(project2.$$.fragment);
    			attr_dev(h1, "class", "svelte-1k3p1w1");
    			add_location(h1, file$5, 5, 8, 137);
    			attr_dev(div0, "class", "row svelte-1k3p1w1");
    			add_location(div0, file$5, 6, 8, 167);
    			attr_dev(div1, "class", "inner svelte-1k3p1w1");
    			add_location(div1, file$5, 4, 4, 108);
    			attr_dev(div2, "id", "projects");
    			attr_dev(div2, "class", "svelte-1k3p1w1");
    			add_location(div2, file$5, 3, 0, 83);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(project0, div0, null);
    			append_dev(div0, t2);
    			mount_component(project1, div0, null);
    			append_dev(div0, t3);
    			mount_component(project2, div0, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(project0.$$.fragment, local);
    			transition_in(project1.$$.fragment, local);
    			transition_in(project2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(project0.$$.fragment, local);
    			transition_out(project1.$$.fragment, local);
    			transition_out(project2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(project0);
    			destroy_component(project1);
    			destroy_component(project2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Project });
    	return [];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/Input.svelte generated by Svelte v3.49.0 */

    const file$4 = "src/components/Input.svelte";

    function create_fragment$4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", /*type*/ ctx[1]);
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			input.value = /*value*/ ctx[0];
    			attr_dev(input, "class", "svelte-vl1097");
    			add_location(input, file$4, 8, 0, 218);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*handleInput*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*type*/ 2) {
    				attr_dev(input, "type", /*type*/ ctx[1]);
    			}

    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				prop_dev(input, "value", /*value*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { type = 'text' } = $$props;
    	let { placeholder = '' } = $$props;
    	let { value = '' } = $$props;

    	const handleInput = e => {
    		$$invalidate(0, value = type.match(/^(number|range)$/)
    		? +e.target.value
    		: e.target.value);
    	};

    	const writable_props = ['type', 'placeholder', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ type, placeholder, value, handleInput });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, type, placeholder, handleInput];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { type: 1, placeholder: 2, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Textarea.svelte generated by Svelte v3.49.0 */

    const file$3 = "src/components/Textarea.svelte";

    function create_fragment$3(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "placeholder", /*placeholder*/ ctx[1]);
    			textarea.value = /*value*/ ctx[0];
    			attr_dev(textarea, "class", "svelte-1rael7j");
    			add_location(textarea, file$3, 8, 0, 167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*handleInput*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*placeholder*/ 2) {
    				attr_dev(textarea, "placeholder", /*placeholder*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 1) {
    				prop_dev(textarea, "value", /*value*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Textarea', slots, []);
    	let { type = 'text' } = $$props;
    	let { placeholder = '' } = $$props;
    	let { value = '' } = $$props;

    	const handleInput = e => {
    		$$invalidate(0, value = e.target.value);
    	};

    	const writable_props = ['type', 'placeholder', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Textarea> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('placeholder' in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ type, placeholder, value, handleInput });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(3, type = $$props.type);
    		if ('placeholder' in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, placeholder, handleInput, type];
    }

    class Textarea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, { type: 3, placeholder: 1, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Textarea",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get type() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const store = {
        _origin: 'https://api.emailjs.com',
    };

    /**
     * Initiation
     * @param {string} publicKey - set the EmailJS public key
     * @param {string} origin - set the EmailJS origin
     */
    const init = (publicKey, origin = 'https://api.emailjs.com') => {
        store._userID = publicKey;
        store._origin = origin;
    };

    const validateParams = (publicKey, serviceID, templateID) => {
        if (!publicKey) {
            throw 'The public key is required. Visit https://dashboard.emailjs.com/admin/account';
        }
        if (!serviceID) {
            throw 'The service ID is required. Visit https://dashboard.emailjs.com/admin';
        }
        if (!templateID) {
            throw 'The template ID is required. Visit https://dashboard.emailjs.com/admin/templates';
        }
        return true;
    };

    class EmailJSResponseStatus {
        constructor(httpResponse) {
            this.status = httpResponse.status;
            this.text = httpResponse.responseText;
        }
    }

    const sendPost = (url, data, headers = {}) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', ({ target }) => {
                const responseStatus = new EmailJSResponseStatus(target);
                if (responseStatus.status === 200 || responseStatus.text === 'OK') {
                    resolve(responseStatus);
                }
                else {
                    reject(responseStatus);
                }
            });
            xhr.addEventListener('error', ({ target }) => {
                reject(new EmailJSResponseStatus(target));
            });
            xhr.open('POST', store._origin + url, true);
            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });
            xhr.send(data);
        });
    };

    /**
     * Send a template to the specific EmailJS service
     * @param {string} serviceID - the EmailJS service ID
     * @param {string} templateID - the EmailJS template ID
     * @param {object} templatePrams - the template params, what will be set to the EmailJS template
     * @param {string} publicKey - the EmailJS public key
     * @returns {Promise<EmailJSResponseStatus>}
     */
    const send = (serviceID, templateID, templatePrams, publicKey) => {
        const uID = publicKey || store._userID;
        validateParams(uID, serviceID, templateID);
        const params = {
            lib_version: '3.7.0',
            user_id: uID,
            service_id: serviceID,
            template_id: templateID,
            template_params: templatePrams,
        };
        return sendPost('/api/v1.0/email/send', JSON.stringify(params), {
            'Content-type': 'application/json',
        });
    };

    const findHTMLForm = (form) => {
        let currentForm;
        if (typeof form === 'string') {
            currentForm = document.querySelector(form);
        }
        else {
            currentForm = form;
        }
        if (!currentForm || currentForm.nodeName !== 'FORM') {
            throw 'The 3rd parameter is expected to be the HTML form element or the style selector of form';
        }
        return currentForm;
    };
    /**
     * Send a form the specific EmailJS service
     * @param {string} serviceID - the EmailJS service ID
     * @param {string} templateID - the EmailJS template ID
     * @param {string | HTMLFormElement} form - the form element or selector
     * @param {string} publicKey - the EmailJS public key
     * @returns {Promise<EmailJSResponseStatus>}
     */
    const sendForm = (serviceID, templateID, form, publicKey) => {
        const uID = publicKey || store._userID;
        const currentForm = findHTMLForm(form);
        validateParams(uID, serviceID, templateID);
        const formData = new FormData(currentForm);
        formData.append('lib_version', '3.7.0');
        formData.append('service_id', serviceID);
        formData.append('template_id', templateID);
        formData.append('user_id', uID);
        return sendPost('/api/v1.0/email/send-form', formData);
    };

    var emailjs = {
        init,
        send,
        sendForm,
    };

    /* src/components/Loading.svelte generated by Svelte v3.49.0 */

    const file$2 = "src/components/Loading.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "svelte-tfottk");
    			add_location(div0, file$2, 1, 4, 29);
    			attr_dev(div1, "class", "svelte-tfottk");
    			add_location(div1, file$2, 2, 4, 45);
    			attr_dev(div2, "class", "lds-ripple svelte-tfottk");
    			add_location(div2, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/page/Contact.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/page/Contact.svelte";

    // (52:12) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Send");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(52:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (50:12) {#if loading}
    function create_if_block(ctx) {
    	let loading_1;
    	let current;
    	loading_1 = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(50:12) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (49:8) <Button on:click={() => submit()} width="100%">
    function create_default_slot$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(49:8) <Button on:click={() => submit()} width=\\\"100%\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let input0;
    	let updating_value;
    	let t2;
    	let input1;
    	let updating_value_1;
    	let t3;
    	let textarea;
    	let updating_value_2;
    	let t4;
    	let button;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[4](value);
    	}

    	let input0_props = { placeholder: "Name" };

    	if (/*templateParams*/ ctx[2].name !== void 0) {
    		input0_props.value = /*templateParams*/ ctx[2].name;
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind$1(input0, 'value', input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[5](value);
    	}

    	let input1_props = { type: "email", placeholder: "E-Mail" };

    	if (/*templateParams*/ ctx[2].email !== void 0) {
    		input1_props.value = /*templateParams*/ ctx[2].email;
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind$1(input1, 'value', input1_value_binding));

    	function textarea_value_binding(value) {
    		/*textarea_value_binding*/ ctx[6](value);
    	}

    	let textarea_props = { placeholder: "Message" };

    	if (/*message*/ ctx[0] !== void 0) {
    		textarea_props.value = /*message*/ ctx[0];
    	}

    	textarea = new Textarea({ props: textarea_props, $$inline: true });
    	binding_callbacks.push(() => bind$1(textarea, 'value', textarea_value_binding));

    	button = new Button({
    			props: {
    				width: "100%",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[7]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Contact";
    			t1 = space();
    			create_component(input0.$$.fragment);
    			t2 = space();
    			create_component(input1.$$.fragment);
    			t3 = space();
    			create_component(textarea.$$.fragment);
    			t4 = space();
    			create_component(button.$$.fragment);
    			attr_dev(h1, "class", "svelte-lz2s0g");
    			add_location(h1, file$1, 44, 8, 1413);
    			attr_dev(div0, "id", "box");
    			attr_dev(div0, "class", "svelte-lz2s0g");
    			add_location(div0, file$1, 43, 4, 1389);
    			attr_dev(div1, "id", "contact");
    			attr_dev(div1, "class", "svelte-lz2s0g");
    			add_location(div1, file$1, 42, 0, 1365);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			mount_component(input0, div0, null);
    			append_dev(div0, t2);
    			mount_component(input1, div0, null);
    			append_dev(div0, t3);
    			mount_component(textarea, div0, null);
    			append_dev(div0, t4);
    			mount_component(button, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const input0_changes = {};

    			if (!updating_value && dirty & /*templateParams*/ 4) {
    				updating_value = true;
    				input0_changes.value = /*templateParams*/ ctx[2].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*templateParams*/ 4) {
    				updating_value_1 = true;
    				input1_changes.value = /*templateParams*/ ctx[2].email;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const textarea_changes = {};

    			if (!updating_value_2 && dirty & /*message*/ 1) {
    				updating_value_2 = true;
    				textarea_changes.value = /*message*/ ctx[0];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			textarea.$set(textarea_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope, loading*/ 514) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(textarea.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(textarea.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(textarea);
    			destroy_component(button);
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

    function isValidEmail(email) {
    	const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return regex.test(String(email).toLowerCase());
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	let message;
    	let loading = false;
    	let templateParams = { name: '', email: '', message: '' };

    	function validateParams() {
    		return isValidEmail(templateParams.email) && templateParams.name !== '' && message !== '';
    	}

    	function submit() {
    		if (loading) {
    			return;
    		}

    		if (!validateParams()) {
    			alert("Please fill all fields correctly!");
    			return;
    		}

    		$$invalidate(1, loading = true);
    		$$invalidate(2, templateParams.message = message.replace(/(\r\n|\n\r|\r|\n)/g, '<br>'), templateParams);

    		emailjs.send('service_bspbpq6', 'template_n8sc38c', templateParams, 'PiQJ1r4dJ988XUngb').then(
    			function (response) {
    				$$invalidate(1, loading = false);

    				if (response.status === 200) {
    					alert('Successfully sent!');
    				}
    			},
    			function (err) {
    				$$invalidate(1, loading = false);
    				console.log('FAILED...', err);
    			}
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		if ($$self.$$.not_equal(templateParams.name, value)) {
    			templateParams.name = value;
    			$$invalidate(2, templateParams);
    		}
    	}

    	function input1_value_binding(value) {
    		if ($$self.$$.not_equal(templateParams.email, value)) {
    			templateParams.email = value;
    			$$invalidate(2, templateParams);
    		}
    	}

    	function textarea_value_binding(value) {
    		message = value;
    		$$invalidate(0, message);
    	}

    	const click_handler = () => submit();

    	$$self.$capture_state = () => ({
    		Input,
    		Button,
    		Textarea,
    		emailjs,
    		Loading,
    		message,
    		loading,
    		templateParams,
    		isValidEmail,
    		validateParams,
    		submit
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('templateParams' in $$props) $$invalidate(2, templateParams = $$props.templateParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		message,
    		loading,
    		templateParams,
    		submit,
    		input0_value_binding,
    		input1_value_binding,
    		textarea_value_binding,
    		click_handler
    	];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.49.0 */
    const file = "src/App.svelte";

    // (25:12) <SplideSlide>
    function create_default_slot_5(ctx) {
    	let home;
    	let updating_splide;
    	let current;

    	function home_splide_binding(value) {
    		/*home_splide_binding*/ ctx[2](value);
    	}

    	let home_props = {};

    	if (/*splide*/ ctx[0] !== void 0) {
    		home_props.splide = /*splide*/ ctx[0];
    	}

    	home = new Home({ props: home_props, $$inline: true });
    	binding_callbacks.push(() => bind$1(home, 'splide', home_splide_binding));

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const home_changes = {};

    			if (!updating_splide && dirty & /*splide*/ 1) {
    				updating_splide = true;
    				home_changes.splide = /*splide*/ ctx[0];
    				add_flush_callback(() => updating_splide = false);
    			}

    			home.$set(home_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(25:12) <SplideSlide>",
    		ctx
    	});

    	return block;
    }

    // (29:12) <SplideSlide>
    function create_default_slot_4(ctx) {
    	let about;
    	let current;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(about.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(about, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(about, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(29:12) <SplideSlide>",
    		ctx
    	});

    	return block;
    }

    // (33:12) <SplideSlide>
    function create_default_slot_3(ctx) {
    	let projects;
    	let current;
    	projects = new Projects({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(projects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projects, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(33:12) <SplideSlide>",
    		ctx
    	});

    	return block;
    }

    // (37:12) <SplideSlide>
    function create_default_slot_2(ctx) {
    	let contact;
    	let current;
    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contact.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(37:12) <SplideSlide>",
    		ctx
    	});

    	return block;
    }

    // (15:8) <Splide on:active={(slide) => {index = slide.detail.Slide.index}} bind:this={splide} options={ {             start: 0,             wheel: true,             pagination: false,             arrows: false,             height: "100vh",             width: "100%",             direction: "ttb",         } }>
    function create_default_slot_1(ctx) {
    	let splideslide0;
    	let t0;
    	let splideslide1;
    	let t1;
    	let splideslide2;
    	let t2;
    	let splideslide3;
    	let current;

    	splideslide0 = new SplideSlide({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	splideslide1 = new SplideSlide({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	splideslide2 = new SplideSlide({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	splideslide3 = new SplideSlide({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(splideslide0.$$.fragment);
    			t0 = space();
    			create_component(splideslide1.$$.fragment);
    			t1 = space();
    			create_component(splideslide2.$$.fragment);
    			t2 = space();
    			create_component(splideslide3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(splideslide0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(splideslide1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(splideslide2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(splideslide3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const splideslide0_changes = {};

    			if (dirty & /*$$scope, splide*/ 129) {
    				splideslide0_changes.$$scope = { dirty, ctx };
    			}

    			splideslide0.$set(splideslide0_changes);
    			const splideslide1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				splideslide1_changes.$$scope = { dirty, ctx };
    			}

    			splideslide1.$set(splideslide1_changes);
    			const splideslide2_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				splideslide2_changes.$$scope = { dirty, ctx };
    			}

    			splideslide2.$set(splideslide2_changes);
    			const splideslide3_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				splideslide3_changes.$$scope = { dirty, ctx };
    			}

    			splideslide3.$set(splideslide3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(splideslide0.$$.fragment, local);
    			transition_in(splideslide1.$$.fragment, local);
    			transition_in(splideslide2.$$.fragment, local);
    			transition_in(splideslide3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(splideslide0.$$.fragment, local);
    			transition_out(splideslide1.$$.fragment, local);
    			transition_out(splideslide2.$$.fragment, local);
    			transition_out(splideslide3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(splideslide0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(splideslide1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(splideslide2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(splideslide3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(15:8) <Splide on:active={(slide) => {index = slide.detail.Slide.index}} bind:this={splide} options={ {             start: 0,             wheel: true,             pagination: false,             arrows: false,             height: \\\"100vh\\\",             width: \\\"100%\\\",             direction: \\\"ttb\\\",         } }>",
    		ctx
    	});

    	return block;
    }

    // (13:0) <Sidebar bind:splide={splide} bind:index={index}>
    function create_default_slot(ctx) {
    	let main;
    	let splide_1;
    	let current;

    	let splide_1_props = {
    		options: {
    			start: 0,
    			wheel: true,
    			pagination: false,
    			arrows: false,
    			height: "100vh",
    			width: "100%",
    			direction: "ttb"
    		},
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	splide_1 = new Splide_1({ props: splide_1_props, $$inline: true });
    	/*splide_1_binding*/ ctx[3](splide_1);
    	splide_1.$on("active", /*active_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(splide_1.$$.fragment);
    			attr_dev(main, "class", "svelte-4w5u2");
    			add_location(main, file, 13, 4, 456);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(splide_1, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const splide_1_changes = {};

    			if (dirty & /*$$scope, splide*/ 129) {
    				splide_1_changes.$$scope = { dirty, ctx };
    			}

    			splide_1.$set(splide_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(splide_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(splide_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*splide_1_binding*/ ctx[3](null);
    			destroy_component(splide_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(13:0) <Sidebar bind:splide={splide} bind:index={index}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let sidebar;
    	let updating_splide;
    	let updating_index;
    	let current;

    	function sidebar_splide_binding(value) {
    		/*sidebar_splide_binding*/ ctx[5](value);
    	}

    	function sidebar_index_binding(value) {
    		/*sidebar_index_binding*/ ctx[6](value);
    	}

    	let sidebar_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*splide*/ ctx[0] !== void 0) {
    		sidebar_props.splide = /*splide*/ ctx[0];
    	}

    	if (/*index*/ ctx[1] !== void 0) {
    		sidebar_props.index = /*index*/ ctx[1];
    	}

    	sidebar = new Sidebar({ props: sidebar_props, $$inline: true });
    	binding_callbacks.push(() => bind$1(sidebar, 'splide', sidebar_splide_binding));
    	binding_callbacks.push(() => bind$1(sidebar, 'index', sidebar_index_binding));

    	const block = {
    		c: function create() {
    			create_component(sidebar.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sidebar_changes = {};

    			if (dirty & /*$$scope, splide, index*/ 131) {
    				sidebar_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_splide && dirty & /*splide*/ 1) {
    				updating_splide = true;
    				sidebar_changes.splide = /*splide*/ ctx[0];
    				add_flush_callback(() => updating_splide = false);
    			}

    			if (!updating_index && dirty & /*index*/ 2) {
    				updating_index = true;
    				sidebar_changes.index = /*index*/ ctx[1];
    				add_flush_callback(() => updating_index = false);
    			}

    			sidebar.$set(sidebar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebar, detaching);
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
    	validate_slots('App', slots, []);
    	let splide;
    	let index = 0;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function home_splide_binding(value) {
    		splide = value;
    		$$invalidate(0, splide);
    	}

    	function splide_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			splide = $$value;
    			$$invalidate(0, splide);
    		});
    	}

    	const active_handler = slide => {
    		$$invalidate(1, index = slide.detail.Slide.index);
    	};

    	function sidebar_splide_binding(value) {
    		splide = value;
    		$$invalidate(0, splide);
    	}

    	function sidebar_index_binding(value) {
    		index = value;
    		$$invalidate(1, index);
    	}

    	$$self.$capture_state = () => ({
    		Sidebar,
    		Home,
    		About,
    		Projects,
    		Splide: Splide_1,
    		SplideSlide,
    		Contact,
    		splide,
    		index
    	});

    	$$self.$inject_state = $$props => {
    		if ('splide' in $$props) $$invalidate(0, splide = $$props.splide);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		splide,
    		index,
    		home_splide_binding,
    		splide_1_binding,
    		active_handler,
    		sidebar_splide_binding,
    		sidebar_index_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    /** @type {import(types').Sleep} */
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    var sleep$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sleep: sleep
    });

    /** @type {import(types').RandomNumberGenerator} */
    const rng = (min, max) => Math.floor(Math.random() * (max - min) + min);

    /** @type {import(types').TypingInterval} */
    const typingInterval = async interval =>
    	sleep(Array.isArray(interval) ? interval[rng(0, interval.length)] : interval);

    /** @type {import(types').TypewriterEffectFn} */
    const writeEffect = async ({ currentNode, text }, options) => {
    	runOnEveryParentUntil(currentNode, options.parentElement, element => {
    		const classToAdd = currentNode === element ? 'typing' : 'finished-typing';
    		element.classList.add(classToAdd);
    	});
    	for (let index = 0; index <= text.length; index++) {
    		const char = text[index];
    		char === '<' && (index = text.indexOf('>', index));
    		currentNode.innerHTML = text.slice(0, index);
    		await typingInterval(options.interval);
    	}
    };

    /** @type {import(types').UnwriteEffect} */
    const unwriteEffect = async (currentNode, options) => {
    	options.dispatch('done');
    	await typingInterval(typeof options.loop === 'number' ? options.loop : 1500);
    	const text = currentNode.innerHTML.replaceAll('&amp;', '&');
    	for (let index = text.length - 1; index >= 0; index--) {
    		const letter = text[index];
    		letter === '>' && (index = text.lastIndexOf('<', index));
    		currentNode.innerHTML = text.slice(0, index);
    		await typingInterval(options.unwriteInterval ? options.unwriteInterval : options.interval);
    	}
    };

    /** @type {any[]} */
    let alreadyChoosenTexts = [];

    /** @type {import(types').GetRandomText} */
    const getRandomElement = elements => {
    	while (true) {
    		const randomIndex = rng(0, elements.length);
    		// After each iteration, avoid repeating the last text from the last iteration
    		const isTextDifferentFromPrevious =
    			typeof alreadyChoosenTexts === 'number' && randomIndex !== alreadyChoosenTexts;
    		const isTextFirstTime =
    			Array.isArray(alreadyChoosenTexts) && !alreadyChoosenTexts.includes(randomIndex);
    		const hasSingleChildElement = elements.length === 1;
    		const shouldAnimate =
    			hasSingleChildElement || isTextFirstTime || isTextDifferentFromPrevious;
    		if (shouldAnimate) {
    			isTextDifferentFromPrevious && (alreadyChoosenTexts = []);
    			alreadyChoosenTexts.push(randomIndex);
    			const randomText = elements[randomIndex];
    			return randomText
    		}
    		const restartRandomizationCycle = alreadyChoosenTexts.length === elements.length;
    		restartRandomizationCycle && (alreadyChoosenTexts = alreadyChoosenTexts.pop());
    	}
    };

    /** @type {import('types').TypewriterEffectFn} */
    const loopTypewriter = async ({ currentNode, text }, options) => {
    	await writeEffect({ currentNode, text }, options);
    	const textWithUnescapedAmpersands = text.replaceAll('&', '&amp;');
    	const fullyWritten = currentNode.innerHTML === textWithUnescapedAmpersands;
    	fullyWritten && (await unwriteEffect(currentNode, options));
    	runOnEveryParentUntil(currentNode, options.parentElement, element => {
    		currentNode === element
    			? element.classList.remove('typing')
    			: element.classList.remove('finished-typing');
    	});
    };

    /** @type {import('types').TypewriterModeFn} */
    const mode$2 = async (elements, options) => {
    	while (true) {
    		if (options.loop) {
    			for (const element of elements) await loopTypewriter(element, options);
    		} else if (options.loopRandom) {
    			const element = getRandomElement(elements);
    			await loopTypewriter(element, options);
    		}
    	}
    };

    var loopTypewriter$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        mode: mode$2
    });

    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    const getRandomLetter = () => {
    	const possibleLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(
    		''
    	);
    	const letterIndexLimit = possibleLetters.length;
    	const randomLetterIndex = getRandomNumber(0, letterIndexLimit);
    	const randomLetter = possibleLetters[randomLetterIndex];
    	return randomLetter
    };

    // returns a array with a timeout (in ms) for each letter of the word
    const getLettersTimeout = (textLetters, timeout) => {
    	const minimumTimeoutPossible = timeout / 3;
    	// TODO: find a better way to deal with this instead of explicitly reducing the maximum timeout
    	// otherwise, at the end of the animation, one or two characters remain scrambled
    	const lettersTimeout = textLetters.map(() =>
    		getRandomNumber(minimumTimeoutPossible, timeout - 100)
    	);
    	return lettersTimeout
    };

    /** @type {TypewriterModeFn} */
    const mode$1 = async (elements, options) => {
    	const timeout = typeof options.scramble == 'number' ? options.scramble : 3000;
    	await new Promise(resolve => {
    		elements.forEach(async ({ currentNode, text }) => {
    			let wordLetters = text.split('');
    			const lettersTimeout = getLettersTimeout(wordLetters, timeout);
    			const startingTime = Date.now();

    			runOnEveryParentUntil(currentNode, options.parentElement, element => {
    				element.classList.add('finished-typing');
    			});

    			while (Date.now() - startingTime < timeout) {
    				const randomLetterIndex = getRandomNumber(0, wordLetters.length);
    				const randomLetterTimeout = lettersTimeout[randomLetterIndex];
    				const isRandomLetterWhitespace = wordLetters[randomLetterIndex] === ' ';
    				const timeEllapsed = () => Date.now() - startingTime;
    				const didRandomLetterReachTimeout = () => timeEllapsed() >= randomLetterTimeout;

    				if (didRandomLetterReachTimeout() || isRandomLetterWhitespace) {
    					const letterFinishedAnimation =
    						wordLetters[randomLetterIndex] === text[randomLetterIndex];

    					if (!letterFinishedAnimation)
    						wordLetters[randomLetterIndex] = text[randomLetterIndex];
    					else continue
    				} else {
    					wordLetters[randomLetterIndex] = getRandomLetter();
    				}

    				const scrambledText = wordLetters.join('');
    				currentNode.innerHTML = scrambledText;

    				const finishedScrambling = scrambledText === text;

    				const letterInterval = options.scrambleSlowdown
    					? Math.round(timeEllapsed() / 100)
    					: 1;

    				await sleep(letterInterval);

    				if (finishedScrambling) {
    					resolve();
    					break
    				}
    			}

    			currentNode.innerHTML = text;
    		});
    	});
    	options.dispatch('done');
    };

    var scramble = /*#__PURE__*/Object.freeze({
        __proto__: null,
        mode: mode$1
    });

    /** @type {import(types').OnAnimationEnd} */
    const onAnimationEnd = (element, callback) => {
    	const observer = new MutationObserver(mutations => {
    		mutations.forEach(mutation => {
    			const elementAttributeChanged = mutation.type === 'attributes';
    			const elementFinishedTyping = mutation.target.classList.contains('typing');
    			if (elementAttributeChanged && elementFinishedTyping) callback();
    		});
    	});

    	observer.observe(element, {
    		attributes: true,
    		childList: true,
    		subtree: true
    	});
    };

    const cleanChildText = elements =>
    	elements.forEach(element => (element.currentNode.textContent = ''));

    /** @type {import('types').TypewriterOptions} */
    const mode = async (elements, options) => {
    	if (options.cascade) {
    		cleanChildText(elements);
    	} else {
    		const { getLongestTextElement } = await Promise.resolve().then(function () { return getLongestTextElement$1; });
    		const lastElementToFinish = getLongestTextElement(elements);
    		onAnimationEnd(lastElementToFinish, () => options.dispatch('done'));
    	}
    	for (const element of elements) {
    		if (options.cascade) {
    			await writeEffect(element, options);
    			element.currentNode.classList.replace('typing', 'finished-typing');
    		} else {
    			writeEffect(element, options).then(() => {
    				element.currentNode.classList.replace('typing', 'finished-typing');
    			});
    		}
    	}

    	options.cascade && options.dispatch('done');
    };

    var typewriter = /*#__PURE__*/Object.freeze({
        __proto__: null,
        mode: mode
    });

    /** @type {import(types').DescendingSortFunction} */
    const descendingSortFunction = (firstElement, secondElement) =>
    	secondElement.text.length - firstElement.text.length;

    /** @type {import(types').GetLongestTextElement} */
    const getLongestTextElement = elements => {
    	const descendingTextLengthOrder = elements.sort(descendingSortFunction);
    	const longestTextElement = descendingTextLengthOrder[0].currentNode;
    	return longestTextElement
    };

    var getLongestTextElement$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getLongestTextElement: getLongestTextElement
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
