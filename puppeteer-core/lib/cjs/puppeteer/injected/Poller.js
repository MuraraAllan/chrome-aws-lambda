"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MutationPoller_fn, _MutationPoller_root, _MutationPoller_observer, _MutationPoller_promise, _RAFPoller_fn, _RAFPoller_promise, _IntervalPoller_fn, _IntervalPoller_ms, _IntervalPoller_interval, _IntervalPoller_promise;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervalPoller = exports.RAFPoller = exports.MutationPoller = void 0;
const DeferredPromise_js_1 = require("../util/DeferredPromise.js");
const assert_js_1 = require("../util/assert.js");
class MutationPoller {
    constructor(fn, root) {
        _MutationPoller_fn.set(this, void 0);
        _MutationPoller_root.set(this, void 0);
        _MutationPoller_observer.set(this, void 0);
        _MutationPoller_promise.set(this, void 0);
        __classPrivateFieldSet(this, _MutationPoller_fn, fn, "f");
        __classPrivateFieldSet(this, _MutationPoller_root, root, "f");
    }
    async start() {
        const promise = (__classPrivateFieldSet(this, _MutationPoller_promise, (0, DeferredPromise_js_1.createDeferredPromise)(), "f"));
        const result = await __classPrivateFieldGet(this, _MutationPoller_fn, "f").call(this);
        if (result) {
            promise.resolve(result);
            return result;
        }
        __classPrivateFieldSet(this, _MutationPoller_observer, new MutationObserver(async () => {
            const result = await __classPrivateFieldGet(this, _MutationPoller_fn, "f").call(this);
            if (!result) {
                return;
            }
            promise.resolve(result);
            await this.stop();
        }), "f");
        __classPrivateFieldGet(this, _MutationPoller_observer, "f").observe(__classPrivateFieldGet(this, _MutationPoller_root, "f"), {
            childList: true,
            subtree: true,
            attributes: true,
        });
        return __classPrivateFieldGet(this, _MutationPoller_promise, "f");
    }
    async stop() {
        (0, assert_js_1.assert)(__classPrivateFieldGet(this, _MutationPoller_promise, "f"), 'Polling never started.');
        if (!__classPrivateFieldGet(this, _MutationPoller_promise, "f").finished()) {
            __classPrivateFieldGet(this, _MutationPoller_promise, "f").reject(new Error('Polling stopped'));
        }
        if (__classPrivateFieldGet(this, _MutationPoller_observer, "f")) {
            __classPrivateFieldGet(this, _MutationPoller_observer, "f").disconnect();
        }
    }
    result() {
        (0, assert_js_1.assert)(__classPrivateFieldGet(this, _MutationPoller_promise, "f"), 'Polling never started.');
        return __classPrivateFieldGet(this, _MutationPoller_promise, "f");
    }
}
exports.MutationPoller = MutationPoller;
_MutationPoller_fn = new WeakMap(), _MutationPoller_root = new WeakMap(), _MutationPoller_observer = new WeakMap(), _MutationPoller_promise = new WeakMap();
class RAFPoller {
    constructor(fn) {
        _RAFPoller_fn.set(this, void 0);
        _RAFPoller_promise.set(this, void 0);
        __classPrivateFieldSet(this, _RAFPoller_fn, fn, "f");
    }
    async start() {
        const promise = (__classPrivateFieldSet(this, _RAFPoller_promise, (0, DeferredPromise_js_1.createDeferredPromise)(), "f"));
        const result = await __classPrivateFieldGet(this, _RAFPoller_fn, "f").call(this);
        if (result) {
            promise.resolve(result);
            return result;
        }
        const poll = async () => {
            if (promise.finished()) {
                return;
            }
            const result = await __classPrivateFieldGet(this, _RAFPoller_fn, "f").call(this);
            if (!result) {
                window.requestAnimationFrame(poll);
                return;
            }
            promise.resolve(result);
            await this.stop();
        };
        window.requestAnimationFrame(poll);
        return __classPrivateFieldGet(this, _RAFPoller_promise, "f");
    }
    async stop() {
        (0, assert_js_1.assert)(__classPrivateFieldGet(this, _RAFPoller_promise, "f"), 'Polling never started.');
        if (!__classPrivateFieldGet(this, _RAFPoller_promise, "f").finished()) {
            __classPrivateFieldGet(this, _RAFPoller_promise, "f").reject(new Error('Polling stopped'));
        }
    }
    result() {
        (0, assert_js_1.assert)(__classPrivateFieldGet(this, _RAFPoller_promise, "f"), 'Polling never started.');
        return __classPrivateFieldGet(this, _RAFPoller_promise, "f");
    }
}
exports.RAFPoller = RAFPoller;
_RAFPoller_fn = new WeakMap(), _RAFPoller_promise = new WeakMap();
class IntervalPoller {
    constructor(fn, ms) {
        _IntervalPoller_fn.set(this, void 0);
        _IntervalPoller_ms.set(this, void 0);
        _IntervalPoller_interval.set(this, void 0);
        _IntervalPoller_promise.set(this, void 0);
        __classPrivateFieldSet(this, _IntervalPoller_fn, fn, "f");
        __classPrivateFieldSet(this, _IntervalPoller_ms, ms, "f");
    }
    async start() {
        const promise = (__classPrivateFieldSet(this, _IntervalPoller_promise, (0, DeferredPromise_js_1.createDeferredPromise)(), "f"));
        const result = await __classPrivateFieldGet(this, _IntervalPoller_fn, "f").call(this);
        if (result) {
            promise.resolve(result);
            return result;
        }
        __classPrivateFieldSet(this, _IntervalPoller_interval, setInterval(async () => {
            const result = await __classPrivateFieldGet(this, _IntervalPoller_fn, "f").call(this);
            if (!result) {
                return;
            }
            promise.resolve(result);
            await this.stop();
        }, __classPrivateFieldGet(this, _IntervalPoller_ms, "f")), "f");
        return __classPrivateFieldGet(this, _IntervalPoller_promise, "f");
    }
    async stop() {
        (0, assert_js_1.assert)(__classPrivateFieldGet(this, _IntervalPoller_promise, "f"), 'Polling never started.');
        if (!__classPrivateFieldGet(this, _IntervalPoller_promise, "f").finished()) {
            __classPrivateFieldGet(this, _IntervalPoller_promise, "f").reject(new Error('Polling stopped'));
        }
        if (__classPrivateFieldGet(this, _IntervalPoller_interval, "f")) {
            clearInterval(__classPrivateFieldGet(this, _IntervalPoller_interval, "f"));
        }
    }
    result() {
        (0, assert_js_1.assert)(__classPrivateFieldGet(this, _IntervalPoller_promise, "f"), 'Polling never started.');
        return __classPrivateFieldGet(this, _IntervalPoller_promise, "f");
    }
}
exports.IntervalPoller = IntervalPoller;
_IntervalPoller_fn = new WeakMap(), _IntervalPoller_ms = new WeakMap(), _IntervalPoller_interval = new WeakMap(), _IntervalPoller_promise = new WeakMap();
//# sourceMappingURL=Poller.js.map