/*
 TweenJS
 Visit http://createjs.com/ for documentation, updates and examples.

 Copyright (c) 2010 gskinner.com, inc.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 Platform.js <https://mths.be/platform>
 Copyright 2014-2018 Benjamin Tan <https://bnjmnt4n.now.sh/>
 Copyright 2011-2013 John-David Dalton
 Available under MIT license <https://mths.be/mit>
*/
this.createjs = this.createjs || {};
createjs.extend = function(f, d) {
    function e() {
        this.constructor = f
    }
    e.prototype = d.prototype;
    return f.prototype = new e
};
this.createjs = this.createjs || {};
createjs.promote = function(f, d) {
    var e = f.prototype,
        m = Object.getPrototypeOf && Object.getPrototypeOf(e) || e.__proto__;
    if (m) {
        e[(d += "_") + "constructor"] = m.constructor;
        for (var a in m) e.hasOwnProperty(a) && "function" == typeof m[a] && (e[d + a] = m[a])
    }
    return f
};
this.createjs = this.createjs || {};
createjs.deprecate = function(f, d) {
    return function() {
        var e = "Deprecated property or method '" + d + "'. See docs for info.";
        console && (console.warn ? console.warn(e) : console.log(e));
        return f && f.apply(this, arguments)
    }
};
this.createjs = this.createjs || {};
(function() {
    function f(e, m, a) {
        this.type = e;
        this.currentTarget = this.target = null;
        this.eventPhase = 0;
        this.bubbles = !!m;
        this.cancelable = !!a;
        this.timeStamp = (new Date).getTime();
        this.removed = this.immediatePropagationStopped = this.propagationStopped = this.defaultPrevented = !1
    }
    var d = f.prototype;
    d.preventDefault = function() {
        this.defaultPrevented = this.cancelable && !0
    };
    d.stopPropagation = function() {
        this.propagationStopped = !0
    };
    d.stopImmediatePropagation = function() {
        this.immediatePropagationStopped = this.propagationStopped = !0
    };
    d.remove = function() {
        this.removed = !0
    };
    d.clone = function() {
        return new f(this.type, this.bubbles, this.cancelable)
    };
    d.set = function(e) {
        for (var m in e) this[m] = e[m];
        return this
    };
    d.toString = function() {
        return "[Event (type=" + this.type + ")]"
    };
    createjs.Event = f
})();
this.createjs = this.createjs || {};
(function() {
    function f() {
        this._captureListeners = this._listeners = null
    }
    var d = f.prototype;
    f.initialize = function(e) {
        e.addEventListener = d.addEventListener;
        e.on = d.on;
        e.removeEventListener = e.off = d.removeEventListener;
        e.removeAllEventListeners = d.removeAllEventListeners;
        e.hasEventListener = d.hasEventListener;
        e.dispatchEvent = d.dispatchEvent;
        e._dispatchEvent = d._dispatchEvent;
        e.willTrigger = d.willTrigger
    };
    d.addEventListener = function(e, m, a) {
        var c = a ? this._captureListeners = this._captureListeners || {} : this._listeners =
            this._listeners || {};
        var b = c[e];
        b && this.removeEventListener(e, m, a);
        (b = c[e]) ? b.push(m): c[e] = [m];
        return m
    };
    d.on = function(e, m, a, c, b, k) {
        m.handleEvent && (a = a || m, m = m.handleEvent);
        a = a || this;
        return this.addEventListener(e, function(g) {
            m.call(a, g, b);
            c && g.remove()
        }, k)
    };
    d.removeEventListener = function(e, m, a) {
        if (a = a ? this._captureListeners : this._listeners) {
            var c = a[e];
            if (c)
                for (var b = 0, k = c.length; b < k; b++)
                    if (c[b] == m) {
                        1 == k ? delete a[e] : c.splice(b, 1);
                        break
                    }
        }
    };
    d.off = d.removeEventListener;
    d.removeAllEventListeners = function(e) {
        e ?
            (this._listeners && delete this._listeners[e], this._captureListeners && delete this._captureListeners[e]) : this._listeners = this._captureListeners = null
    };
    d.dispatchEvent = function(e, m, a) {
        if ("string" == typeof e) {
            var c = this._listeners;
            if (!(m || c && c[e])) return !0;
            e = new createjs.Event(e, m, a)
        } else e.target && e.clone && (e = e.clone());
        try {
            e.target = this
        } catch (b) {}
        if (e.bubbles && this.parent) {
            a = this;
            for (m = [a]; a.parent;) m.push(a = a.parent);
            c = m.length;
            for (a = c - 1; 0 <= a && !e.propagationStopped; a--) m[a]._dispatchEvent(e, 1 + (0 == a));
            for (a = 1; a < c && !e.propagationStopped; a++) m[a]._dispatchEvent(e, 3)
        } else this._dispatchEvent(e, 2);
        return !e.defaultPrevented
    };
    d.hasEventListener = function(e) {
        var m = this._listeners,
            a = this._captureListeners;
        return !!(m && m[e] || a && a[e])
    };
    d.willTrigger = function(e) {
        for (var m = this; m;) {
            if (m.hasEventListener(e)) return !0;
            m = m.parent
        }
        return !1
    };
    d.toString = function() {
        return "[EventDispatcher]"
    };
    d._dispatchEvent = function(e, m) {
        var a, c, b = 2 >= m ? this._captureListeners : this._listeners;
        if (e && b && (c = b[e.type]) && (a = c.length)) {
            try {
                e.currentTarget =
                    this
            } catch (g) {}
            try {
                e.eventPhase = m | 0
            } catch (g) {}
            e.removed = !1;
            c = c.slice();
            for (b = 0; b < a && !e.immediatePropagationStopped; b++) {
                var k = c[b];
                k.handleEvent ? k.handleEvent(e) : k(e);
                e.removed && (this.off(e.type, k, 1 == m), e.removed = !1)
            }
        }
        2 === m && this._dispatchEvent(e, 2.1)
    };
    createjs.EventDispatcher = f
})();
this.createjs = this.createjs || {};
(function() {
    function f() {
        throw "Ticker cannot be instantiated.";
    }
    f.RAF_SYNCHED = "synched";
    f.RAF = "raf";
    f.TIMEOUT = "timeout";
    f.timingMode = null;
    f.maxDelta = 0;
    f.paused = !1;
    f.removeEventListener = null;
    f.removeAllEventListeners = null;
    f.dispatchEvent = null;
    f.hasEventListener = null;
    f._listeners = null;
    createjs.EventDispatcher.initialize(f);
    f._addEventListener = f.addEventListener;
    f.addEventListener = function() {
        !f._inited && f.init();
        return f._addEventListener.apply(f, arguments)
    };
    f._inited = !1;
    f._startTime = 0;
    f._pausedTime =
        0;
    f._ticks = 0;
    f._pausedTicks = 0;
    f._interval = 50;
    f._lastTime = 0;
    f._times = null;
    f._tickTimes = null;
    f._timerId = null;
    f._raf = !0;
    f._setInterval = function(m) {
        f._interval = m;
        f._inited && f._setupTick()
    };
    f.setInterval = createjs.deprecate(f._setInterval, "Ticker.setInterval");
    f._getInterval = function() {
        return f._interval
    };
    f.getInterval = createjs.deprecate(f._getInterval, "Ticker.getInterval");
    f._setFPS = function(m) {
        f._setInterval(1E3 / m)
    };
    f.setFPS = createjs.deprecate(f._setFPS, "Ticker.setFPS");
    f._getFPS = function() {
        return 1E3 /
            f._interval
    };
    f.getFPS = createjs.deprecate(f._getFPS, "Ticker.getFPS");
    try {
        Object.defineProperties(f, {
            interval: {
                get: f._getInterval,
                set: f._setInterval
            },
            framerate: {
                get: f._getFPS,
                set: f._setFPS
            }
        })
    } catch (m) {
        console.log(m)
    }
    f.init = function() {
        f._inited || (f._inited = !0, f._times = [], f._tickTimes = [], f._startTime = f._getTime(), f._times.push(f._lastTime = 0), f.interval = f._interval)
    };
    f.reset = function() {
        if (f._raf) {
            var m = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame ||
                window.msCancelAnimationFrame;
            m && m(f._timerId)
        } else clearTimeout(f._timerId);
        f.removeAllEventListeners("tick");
        f._timerId = f._times = f._tickTimes = null;
        f._startTime = f._lastTime = f._ticks = f._pausedTime = 0;
        f._inited = !1
    };
    f.getMeasuredTickTime = function(m) {
        var a = 0,
            c = f._tickTimes;
        if (!c || 1 > c.length) return -1;
        m = Math.min(c.length, m || f._getFPS() | 0);
        for (var b = 0; b < m; b++) a += c[b];
        return a / m
    };
    f.getMeasuredFPS = function(m) {
        var a = f._times;
        if (!a || 2 > a.length) return -1;
        m = Math.min(a.length - 1, m || f._getFPS() | 0);
        return 1E3 / ((a[0] -
            a[m]) / m)
    };
    f.getTime = function(m) {
        return f._startTime ? f._getTime() - (m ? f._pausedTime : 0) : -1
    };
    f.getEventTime = function(m) {
        return f._startTime ? (f._lastTime || f._startTime) - (m ? f._pausedTime : 0) : -1
    };
    f.getTicks = function(m) {
        return f._ticks - (m ? f._pausedTicks : 0)
    };
    f._handleSynch = function() {
        f._timerId = null;
        f._setupTick();
        f._getTime() - f._lastTime >= .97 * (f._interval - 1) && f._tick()
    };
    f._handleRAF = function() {
        f._timerId = null;
        f._setupTick();
        f._tick()
    };
    f._handleTimeout = function() {
        f._timerId = null;
        f._setupTick();
        f._tick()
    };
    f._setupTick =
        function() {
            if (null == f._timerId) {
                var m = f.timingMode;
                if (m == f.RAF_SYNCHED || m == f.RAF) {
                    var a = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
                    if (a) {
                        f._timerId = a(m == f.RAF ? f._handleRAF : f._handleSynch);
                        f._raf = !0;
                        return
                    }
                }
                f._raf = !1;
                f._timerId = setTimeout(f._handleTimeout, f._interval)
            }
        };
    f._tick = function() {
        var m = f.paused,
            a = f._getTime(),
            c = a - f._lastTime;
        f._lastTime = a;
        f._ticks++;
        m && (f._pausedTicks++, f._pausedTime +=
            c);
        if (f.hasEventListener("tick")) {
            var b = new createjs.Event("tick"),
                k = f.maxDelta;
            b.delta = k && c > k ? k : c;
            b.paused = m;
            b.time = a;
            b.runTime = a - f._pausedTime;
            f.dispatchEvent(b)
        }
        for (f._tickTimes.unshift(f._getTime() - a); 100 < f._tickTimes.length;) f._tickTimes.pop();
        for (f._times.unshift(a); 100 < f._times.length;) f._times.pop()
    };
    var d = window,
        e = d.performance.now || d.performance.mozNow || d.performance.msNow || d.performance.oNow || d.performance.webkitNow;
    f._getTime = function() {
        return (e && e.call(d.performance) || (new Date).getTime()) -
            f._startTime
    };
    createjs.Ticker = f
})();
this.createjs = this.createjs || {};
(function() {
    function f(e) {
        this.EventDispatcher_constructor();
        this.ignoreGlobalPause = !1;
        this.loop = 0;
        this.bounce = this.reversed = this.useTicks = !1;
        this.timeScale = 1;
        this.position = this.duration = 0;
        this.rawPosition = -1;
        this._paused = !0;
        this._labelList = this._labels = this._parent = this._prev = this._next = null;
        e && (this.useTicks = !!e.useTicks, this.ignoreGlobalPause = !!e.ignoreGlobalPause, this.loop = !0 === e.loop ? -1 : e.loop || 0, this.reversed = !!e.reversed, this.bounce = !!e.bounce, this.timeScale = e.timeScale || 1, e.onChange && this.addEventListener("change",
            e.onChange), e.onComplete && this.addEventListener("complete", e.onComplete))
    }
    var d = createjs.extend(f, createjs.EventDispatcher);
    d._setPaused = function(e) {
        createjs.Tween._register(this, e);
        return this
    };
    d.setPaused = createjs.deprecate(d._setPaused, "AbstractTween.setPaused");
    d._getPaused = function() {
        return this._paused
    };
    d.getPaused = createjs.deprecate(d._getPaused, "AbstactTween.getPaused");
    d._getCurrentLabel = function(e) {
        var m = this.getLabels();
        null == e && (e = this.position);
        for (var a = 0, c = m.length; a < c && !(e < m[a].position); a++);
        return 0 === a ? null : m[a - 1].label
    };
    d.getCurrentLabel = createjs.deprecate(d._getCurrentLabel, "AbstractTween.getCurrentLabel");
    try {
        Object.defineProperties(d, {
            paused: {
                set: d._setPaused,
                get: d._getPaused
            },
            currentLabel: {
                get: d._getCurrentLabel
            }
        })
    } catch (e) {}
    d.advance = function(e, m) {
        this.setPosition(this.rawPosition + e * this.timeScale, m)
    };
    d.setPosition = function(e, m, a, c) {
        var b = this.duration,
            k = this.loop,
            g = this.rawPosition,
            h = 0;
        0 > e && (e = 0);
        if (0 === b) {
            var l = !0;
            if (-1 !== g) return l
        } else {
            var p = e / b | 0;
            h = e - p * b;
            (l = -1 !== k && e >= k *
                b + b) && (e = (h = b) * (p = k) + b);
            if (e === g) return l;
            !this.reversed !== !(this.bounce && p % 2) && (h = b - h)
        }
        this.position = h;
        this.rawPosition = e;
        this._updatePosition(a, l);
        l && (this.paused = !0);
        c && c(this);
        m || this._runActions(g, e, a, !a && -1 === g);
        this.dispatchEvent("change");
        l && this.dispatchEvent("complete")
    };
    d.calculatePosition = function(e) {
        var m = this.duration,
            a = this.loop,
            c = 0;
        if (0 === m) return 0; - 1 !== a && e >= a * m + m ? (e = m, c = a) : 0 > e ? e = 0 : (c = e / m | 0, e -= c * m);
        return !this.reversed !== !(this.bounce && c % 2) ? m - e : e
    };
    d.getLabels = function() {
        var e = this._labelList;
        if (!e) {
            e = this._labelList = [];
            var m = this._labels,
                a;
            for (a in m) e.push({
                label: a,
                position: m[a]
            });
            e.sort(function(c, b) {
                return c.position - b.position
            })
        }
        return e
    };
    d.setLabels = function(e) {
        this._labels = e;
        this._labelList = null
    };
    d.addLabel = function(e, m) {
        this._labels || (this._labels = {});
        this._labels[e] = m;
        var a = this._labelList;
        if (a) {
            for (var c = 0, b = a.length; c < b && !(m < a[c].position); c++);
            a.splice(c, 0, {
                label: e,
                position: m
            })
        }
    };
    d.gotoAndPlay = function(e) {
        this.paused = !1;
        this._goto(e)
    };
    d.gotoAndStop = function(e) {
        this.paused = !0;
        this._goto(e)
    };
    d.resolve = function(e) {
        var m = Number(e);
        isNaN(m) && (m = this._labels && this._labels[e]);
        return m
    };
    d.toString = function() {
        return "[AbstractTween]"
    };
    d.clone = function() {
        throw "AbstractTween can not be cloned.";
    };
    d._init = function(e) {
        e && e.paused || (this.paused = !1);
        e && null != e.position && this.setPosition(e.position)
    };
    d._updatePosition = function(e, m) {};
    d._goto = function(e) {
        e = this.resolve(e);
        null != e && this.setPosition(e, !1, !0)
    };
    d._runActions = function(e, m, a, c) {
        if (this._actionHead || this.tweens) {
            var b = this.duration,
                k = this.reversed,
                g = this.bounce,
                h = this.loop,
                l, p, n;
            if (0 === b) {
                var q = l = p = n = 0;
                k = g = !1
            } else q = e / b | 0, l = m / b | 0, p = e - q * b, n = m - l * b; - 1 !== h && (l > h && (n = b, l = h), q > h && (p = b, q = h));
            if (a) return this._runActionsRange(n, n, a, c);
            if (q !== l || p !== n || a || c) {
                -1 === q && (q = p = 0);
                e = e <= m;
                m = q;
                do {
                    h = m === q ? p : e ? 0 : b;
                    var t = m === l ? n : e ? b : 0;
                    !k !== !(g && m % 2) && (h = b - h, t = b - t);
                    if ((!g || m === q || h !== t) && this._runActionsRange(h, t, a, c || m !== q && !g)) return !0;
                    c = !1
                } while (e && ++m <= l || !e && --m >= l)
            }
        }
    };
    d._runActionsRange = function(e, m, a, c) {};
    createjs.AbstractTween = createjs.promote(f,
        "EventDispatcher")
})();
this.createjs = this.createjs || {};
(function() {
    function f(a, c) {
        this.AbstractTween_constructor(c);
        this.pluginData = null;
        this.target = a;
        this.passive = !1;
        this._stepTail = this._stepHead = new d(null, 0, 0, {}, null, !0);
        this._stepPosition = 0;
        this._injected = this._pluginIds = this._plugins = this._actionTail = this._actionHead = null;
        c && (this.pluginData = c.pluginData, c.override && f.removeTweens(a));
        this.pluginData || (this.pluginData = {});
        this._init(c)
    }

    function d(a, c, b, k, g, h) {
        this.next = null;
        this.prev = a;
        this.t = c;
        this.d = b;
        this.props = k;
        this.ease = g;
        this.passive = h;
        this.index =
            a ? a.index + 1 : 0
    }

    function e(a, c, b, k, g) {
        this.next = null;
        this.prev = a;
        this.t = c;
        this.d = 0;
        this.scope = b;
        this.funct = k;
        this.params = g
    }
    var m = createjs.extend(f, createjs.AbstractTween);
    f.IGNORE = {};
    f._tweens = [];
    f._plugins = null;
    f._tweenHead = null;
    f._tweenTail = null;
    f.get = function(a, c) {
        return new f(a, c)
    };
    f.tick = function(a, c) {
        for (var b = f._tweenHead; b;) {
            var k = b._next;
            c && !b.ignoreGlobalPause || b._paused || b.advance(b.useTicks ? 1 : a);
            b = k
        }
    };
    f.handleEvent = function(a) {
        "tick" === a.type && this.tick(a.delta, a.paused)
    };
    f.removeTweens =
        function(a) {
            if (a.tweenjs_count) {
                for (var c = f._tweenHead; c;) {
                    var b = c._next;
                    c.target === a && f._register(c, !0);
                    c = b
                }
                a.tweenjs_count = 0
            }
        };
    f.removeAllTweens = function() {
        for (var a = f._tweenHead; a;) {
            var c = a._next;
            a._paused = !0;
            a.target && (a.target.tweenjs_count = 0);
            a._next = a._prev = null;
            a = c
        }
        f._tweenHead = f._tweenTail = null
    };
    f.hasActiveTweens = function(a) {
        return a ? !!a.tweenjs_count : !!f._tweenHead
    };
    f._installPlugin = function(a) {
        for (var c = a.priority = a.priority || 0, b = f._plugins = f._plugins || [], k = 0, g = b.length; k < g && !(c < b[k].priority); k++);
        b.splice(k, 0, a)
    };
    f._register = function(a, c) {
        var b = a.target;
        if (!c && a._paused) b && (b.tweenjs_count = b.tweenjs_count ? b.tweenjs_count + 1 : 1), (b = f._tweenTail) ? (f._tweenTail = b._next = a, a._prev = b) : f._tweenHead = f._tweenTail = a, !f._inited && createjs.Ticker && (createjs.Ticker.addEventListener("tick", f), f._inited = !0);
        else if (c && !a._paused) {
            b && b.tweenjs_count--;
            b = a._next;
            var k = a._prev;
            b ? b._prev = k : f._tweenTail = k;
            k ? k._next = b : f._tweenHead = b;
            a._next = a._prev = null
        }
        a._paused = c
    };
    m.wait = function(a, c) {
        0 < a && this._addStep(+a, this._stepTail.props,
            null, c);
        return this
    };
    m.to = function(a, c, b) {
        if (null == c || 0 > c) c = 0;
        c = this._addStep(+c, null, b);
        this._appendProps(a, c);
        return this
    };
    m.label = function(a) {
        this.addLabel(a, this.duration);
        return this
    };
    m.call = function(a, c, b) {
        return this._addAction(b || this.target, a, c || [this])
    };
    m.set = function(a, c) {
        return this._addAction(c || this.target, this._set, [a])
    };
    m.play = function(a) {
        return this._addAction(a || this, this._set, [{
            paused: !1
        }])
    };
    m.pause = function(a) {
        return this._addAction(a || this, this._set, [{
            paused: !0
        }])
    };
    m.w = m.wait;
    m.t = m.to;
    m.c = m.call;
    m.s = m.set;
    m.toString = function() {
        return "[Tween]"
    };
    m.clone = function() {
        throw "Tween can not be cloned.";
    };
    m._addPlugin = function(a) {
        var c = this._pluginIds || (this._pluginIds = {}),
            b = a.ID;
        if (b && !c[b]) {
            c[b] = !0;
            c = this._plugins || (this._plugins = []);
            b = a.priority || 0;
            for (var k = 0, g = c.length; k < g; k++)
                if (b < c[k].priority) {
                    c.splice(k, 0, a);
                    return
                } c.push(a)
        }
    };
    m._updatePosition = function(a, c) {
        var b = this._stepHead.next,
            k = this.position,
            g = this.duration;
        if (this.target && b) {
            for (var h = b.next; h && h.t <= k;) b = b.next,
                h = b.next;
            this._updateTargetProps(b, c ? 0 === g ? 1 : k / g : (k - b.t) / b.d, c)
        }
        this._stepPosition = b ? k - b.t : 0
    };
    m._updateTargetProps = function(a, c, b) {
        if (!(this.passive = !!a.passive)) {
            var k, g = a.prev.props,
                h = a.props;
            if (k = a.ease) c = k(c, 0, 1, 1);
            k = this._plugins;
            var l;
            a: for (l in g) {
                var p = g[l];
                var n = h[l];
                p = p !== n && "number" === typeof p ? p + (n - p) * c : 1 <= c ? n : p;
                if (k) {
                    n = 0;
                    for (var q = k.length; n < q; n++) {
                        var t = k[n].change(this, a, l, p, c, b);
                        if (t === f.IGNORE) continue a;
                        void 0 !== t && (p = t)
                    }
                }
                this.target[l] = p
            }
        }
    };
    m._runActionsRange = function(a, c, b, k) {
        var g =
            (b = a > c) ? this._actionTail : this._actionHead,
            h = c,
            l = a;
        b && (h = a, l = c);
        for (var p = this.position; g;) {
            var n = g.t;
            if (n === c || n > l && n < h || k && n === a)
                if (g.funct.apply(g.scope, g.params), p !== this.position) return !0;
            g = b ? g.prev : g.next
        }
    };
    m._appendProps = function(a, c, b) {
        var k = this._stepHead.props,
            g = this.target,
            h = f._plugins,
            l, p, n = c.prev,
            q = n.props,
            t = c.props || (c.props = this._cloneProps(q)),
            r = {};
        for (l in a)
            if (a.hasOwnProperty(l) && (r[l] = t[l] = a[l], void 0 === k[l])) {
                var v = void 0;
                if (h)
                    for (p = h.length - 1; 0 <= p; p--) {
                        var x = h[p].init(this, l,
                            v);
                        void 0 !== x && (v = x);
                        if (v === f.IGNORE) {
                            delete t[l];
                            delete r[l];
                            break
                        }
                    }
                v !== f.IGNORE && (void 0 === v && (v = g[l]), q[l] = void 0 === v ? null : v)
            } for (l in r) {
            var y;
            for (a = n;
                (y = a) && (a = y.prev);)
                if (a.props !== y.props) {
                    if (void 0 !== a.props[l]) break;
                    a.props[l] = q[l]
                }
        }
        if (!1 !== b && (h = this._plugins))
            for (p = h.length - 1; 0 <= p; p--) h[p].step(this, c, r);
        if (b = this._injected) this._injected = null, this._appendProps(b, c, !1)
    };
    m._injectProp = function(a, c) {
        (this._injected || (this._injected = {}))[a] = c
    };
    m._addStep = function(a, c, b, k) {
        c = new d(this._stepTail,
            this.duration, a, c, b, k || !1);
        this.duration += a;
        return this._stepTail = this._stepTail.next = c
    };
    m._addAction = function(a, c, b) {
        a = new e(this._actionTail, this.duration, a, c, b);
        this._actionTail ? this._actionTail.next = a : this._actionHead = a;
        this._actionTail = a;
        return this
    };
    m._set = function(a) {
        for (var c in a) this[c] = a[c]
    };
    m._cloneProps = function(a) {
        var c = {},
            b;
        for (b in a) c[b] = a[b];
        return c
    };
    createjs.Tween = createjs.promote(f, "AbstractTween")
})();
this.createjs = this.createjs || {};
(function() {
    function f(e) {
        if (e instanceof Array || null == e && 1 < arguments.length) {
            var m = e;
            var a = arguments[1];
            e = arguments[2]
        } else e && (m = e.tweens, a = e.labels);
        this.AbstractTween_constructor(e);
        this.tweens = [];
        m && this.addTween.apply(this, m);
        this.setLabels(a);
        this._init(e)
    }
    var d = createjs.extend(f, createjs.AbstractTween);
    d.addTween = function(e) {
        e._parent && e._parent.removeTween(e);
        var m = arguments.length;
        if (1 < m) {
            for (var a = 0; a < m; a++) this.addTween(arguments[a]);
            return arguments[m - 1]
        }
        if (0 === m) return null;
        this.tweens.push(e);
        e._parent = this;
        e.paused = !0;
        m = e.duration;
        0 < e.loop && (m *= e.loop + 1);
        m > this.duration && (this.duration = m);
        0 <= this.rawPosition && e.setPosition(this.rawPosition);
        return e
    };
    d.removeTween = function(e) {
        var m = arguments.length;
        if (1 < m) {
            for (var a = !0, c = 0; c < m; c++) a = a && this.removeTween(arguments[c]);
            return a
        }
        if (0 === m) return !0;
        m = this.tweens;
        for (c = m.length; c--;)
            if (m[c] === e) return m.splice(c, 1), e._parent = null, e.duration >= this.duration && this.updateDuration(), !0;
        return !1
    };
    d.updateDuration = function() {
        for (var e = this.duration =
                0, m = this.tweens.length; e < m; e++) {
            var a = this.tweens[e],
                c = a.duration;
            0 < a.loop && (c *= a.loop + 1);
            c > this.duration && (this.duration = c)
        }
    };
    d.toString = function() {
        return "[Timeline]"
    };
    d.clone = function() {
        throw "Timeline can not be cloned.";
    };
    d._updatePosition = function(e, m) {
        for (var a = this.position, c = 0, b = this.tweens.length; c < b; c++) this.tweens[c].setPosition(a, !0, e)
    };
    d._runActionsRange = function(e, m, a, c) {
        for (var b = this.position, k = 0, g = this.tweens.length; k < g; k++)
            if (this.tweens[k]._runActions(e, m, a, c), b !== this.position) return !0
    };
    createjs.Timeline = createjs.promote(f, "AbstractTween")
})();
this.createjs = this.createjs || {};
(function() {
    function f() {
        throw "Ease cannot be instantiated.";
    }
    f.linear = function(d) {
        return d
    };
    f.none = f.linear;
    f.get = function(d) {
        -1 > d ? d = -1 : 1 < d && (d = 1);
        return function(e) {
            return 0 == d ? e : 0 > d ? e * (e * -d + 1 + d) : e * ((2 - e) * d + (1 - d))
        }
    };
    f.getPowIn = function(d) {
        return function(e) {
            return Math.pow(e, d)
        }
    };
    f.getPowOut = function(d) {
        return function(e) {
            return 1 - Math.pow(1 - e, d)
        }
    };
    f.getPowInOut = function(d) {
        return function(e) {
            return 1 > (e *= 2) ? .5 * Math.pow(e, d) : 1 - .5 * Math.abs(Math.pow(2 - e, d))
        }
    };
    f.quadIn = f.getPowIn(2);
    f.quadOut = f.getPowOut(2);
    f.quadInOut = f.getPowInOut(2);
    f.cubicIn = f.getPowIn(3);
    f.cubicOut = f.getPowOut(3);
    f.cubicInOut = f.getPowInOut(3);
    f.quartIn = f.getPowIn(4);
    f.quartOut = f.getPowOut(4);
    f.quartInOut = f.getPowInOut(4);
    f.quintIn = f.getPowIn(5);
    f.quintOut = f.getPowOut(5);
    f.quintInOut = f.getPowInOut(5);
    f.sineIn = function(d) {
        return 1 - Math.cos(d * Math.PI / 2)
    };
    f.sineOut = function(d) {
        return Math.sin(d * Math.PI / 2)
    };
    f.sineInOut = function(d) {
        return -.5 * (Math.cos(Math.PI * d) - 1)
    };
    f.getBackIn = function(d) {
        return function(e) {
            return e * e * ((d + 1) * e - d)
        }
    };
    f.backIn = f.getBackIn(1.7);
    f.getBackOut = function(d) {
        return function(e) {
            return --e * e * ((d + 1) * e + d) + 1
        }
    };
    f.backOut = f.getBackOut(1.7);
    f.getBackInOut = function(d) {
        d *= 1.525;
        return function(e) {
            return 1 > (e *= 2) ? .5 * e * e * ((d + 1) * e - d) : .5 * ((e -= 2) * e * ((d + 1) * e + d) + 2)
        }
    };
    f.backInOut = f.getBackInOut(1.7);
    f.circIn = function(d) {
        return -(Math.sqrt(1 - d * d) - 1)
    };
    f.circOut = function(d) {
        return Math.sqrt(1 - --d * d)
    };
    f.circInOut = function(d) {
        return 1 > (d *= 2) ? -.5 * (Math.sqrt(1 - d * d) - 1) : .5 * (Math.sqrt(1 - (d -= 2) * d) + 1)
    };
    f.bounceIn = function(d) {
        return 1 -
            f.bounceOut(1 - d)
    };
    f.bounceOut = function(d) {
        return d < 1 / 2.75 ? 7.5625 * d * d : d < 2 / 2.75 ? 7.5625 * (d -= 1.5 / 2.75) * d + .75 : d < 2.5 / 2.75 ? 7.5625 * (d -= 2.25 / 2.75) * d + .9375 : 7.5625 * (d -= 2.625 / 2.75) * d + .984375
    };
    f.bounceInOut = function(d) {
        return .5 > d ? .5 * f.bounceIn(2 * d) : .5 * f.bounceOut(2 * d - 1) + .5
    };
    f.getElasticIn = function(d, e) {
        var m = 2 * Math.PI;
        return function(a) {
            if (0 == a || 1 == a) return a;
            var c = e / m * Math.asin(1 / d);
            return -(d * Math.pow(2, 10 * --a) * Math.sin((a - c) * m / e))
        }
    };
    f.elasticIn = f.getElasticIn(1, .3);
    f.getElasticOut = function(d, e) {
        var m = 2 * Math.PI;
        return function(a) {
            return 0 == a || 1 == a ? a : d * Math.pow(2, -10 * a) * Math.sin((a - e / m * Math.asin(1 / d)) * m / e) + 1
        }
    };
    f.elasticOut = f.getElasticOut(1, .3);
    f.getElasticInOut = function(d, e) {
        var m = 2 * Math.PI;
        return function(a) {
            var c = e / m * Math.asin(1 / d);
            return 1 > (a *= 2) ? -.5 * d * Math.pow(2, 10 * --a) * Math.sin((a - c) * m / e) : d * Math.pow(2, -10 * --a) * Math.sin((a - c) * m / e) * .5 + 1
        }
    };
    f.elasticInOut = f.getElasticInOut(1, .3 * 1.5);
    createjs.Ease = f
})();
this.createjs = this.createjs || {};
(function() {
    function f() {
        throw "MotionGuidePlugin cannot be instantiated.";
    }
    f.priority = 0;
    f.ID = "MotionGuide";
    f.install = function() {
        createjs.Tween._installPlugin(f);
        return createjs.Tween.IGNORE
    };
    f.init = function(d, e, m) {
        "guide" == e && d._addPlugin(f)
    };
    f.step = function(d, e, m) {
        for (var a in m)
            if ("guide" === a) {
                var c = e.props.guide,
                    b = f._solveGuideData(m.guide, c);
                c.valid = !b;
                var k = c.endData;
                d._injectProp("x", k.x);
                d._injectProp("y", k.y);
                if (b || !c.orient) break;
                c.startOffsetRot = (void 0 === e.prev.props.rotation ? d.target.rotation ||
                    0 : e.prev.props.rotation) - c.startData.rotation;
                if ("fixed" == c.orient) c.endAbsRot = k.rotation + c.startOffsetRot, c.deltaRotation = 0;
                else {
                    b = void 0 === m.rotation ? d.target.rotation || 0 : m.rotation;
                    k = b - c.endData.rotation - c.startOffsetRot;
                    var g = k % 360;
                    c.endAbsRot = b;
                    switch (c.orient) {
                        case "auto":
                            c.deltaRotation = k;
                            break;
                        case "cw":
                            c.deltaRotation = (g + 360) % 360 + 360 * Math.abs(k / 360 | 0);
                            break;
                        case "ccw":
                            c.deltaRotation = (g - 360) % 360 + -360 * Math.abs(k / 360 | 0)
                    }
                }
                d._injectProp("rotation", c.endAbsRot)
            }
    };
    f.change = function(d, e, m, a, c, b) {
        if ((a =
                e.props.guide) && e.props !== e.prev.props && a !== e.prev.props.guide) {
            if ("guide" === m && !a.valid || "x" == m || "y" == m || "rotation" === m && a.orient) return createjs.Tween.IGNORE;
            f._ratioToPositionData(c, a, d.target)
        }
    };
    f.debug = function(d, e, m) {
        d = d.guide || d;
        var a = f._findPathProblems(d);
        a && console.error("MotionGuidePlugin Error found: \n" + a);
        if (!e) return a;
        var c, b = d.path,
            k = b.length;
        e.save();
        e.lineCap = "round";
        e.lineJoin = "miter";
        e.beginPath();
        e.moveTo(b[0], b[1]);
        for (c = 2; c < k; c += 4) e.quadraticCurveTo(b[c], b[c + 1], b[c + 2], b[c +
            3]);
        e.strokeStyle = "black";
        e.lineWidth = 4.5;
        e.stroke();
        e.strokeStyle = "white";
        e.lineWidth = 3;
        e.stroke();
        e.closePath();
        b = m.length;
        if (m && b) {
            k = {};
            var g = {};
            f._solveGuideData(d, k);
            for (c = 0; c < b; c++) k.orient = "fixed", f._ratioToPositionData(m[c], k, g), e.beginPath(), e.moveTo(g.x, g.y), e.lineTo(g.x + 9 * Math.cos(.0174533 * g.rotation), g.y + 9 * Math.sin(.0174533 * g.rotation)), e.strokeStyle = "black", e.lineWidth = 4.5, e.stroke(), e.strokeStyle = "red", e.lineWidth = 3, e.stroke(), e.closePath()
        }
        e.restore();
        return a
    };
    f._solveGuideData = function(d,
        e) {
        var m;
        if (m = f.debug(d)) return m;
        var a = e.path = d.path;
        e.orient = d.orient;
        e.subLines = [];
        e.totalLength = 0;
        e.startOffsetRot = 0;
        e.deltaRotation = 0;
        e.startData = {
            ratio: 0
        };
        e.endData = {
            ratio: 1
        };
        e.animSpan = 1;
        var c = a.length,
            b, k = {};
        var g = a[0];
        var h = a[1];
        for (m = 2; m < c; m += 4) {
            var l = a[m];
            var p = a[m + 1];
            var n = a[m + 2];
            var q = a[m + 3];
            var t = {
                    weightings: [],
                    estLength: 0,
                    portion: 0
                },
                r = g;
            var v = h;
            for (b = 1; 10 >= b; b++) f._getParamsForCurve(g, h, l, p, n, q, b / 10, !1, k), r = k.x - r, v = k.y - v, v = Math.sqrt(r * r + v * v), t.weightings.push(v), t.estLength += v, r = k.x,
                v = k.y;
            e.totalLength += t.estLength;
            for (b = 0; 10 > b; b++) v = t.estLength, t.weightings[b] /= v;
            e.subLines.push(t);
            g = n;
            h = q
        }
        v = e.totalLength;
        a = e.subLines.length;
        for (m = 0; m < a; m++) e.subLines[m].portion = e.subLines[m].estLength / v;
        m = isNaN(d.start) ? 0 : d.start;
        a = isNaN(d.end) ? 1 : d.end;
        f._ratioToPositionData(m, e, e.startData);
        f._ratioToPositionData(a, e, e.endData);
        e.startData.ratio = m;
        e.endData.ratio = a;
        e.animSpan = e.endData.ratio - e.startData.ratio
    };
    f._ratioToPositionData = function(d, e, m) {
        var a = e.subLines,
            c, b = 0,
            k = d * e.animSpan + e.startData.ratio;
        var g = a.length;
        for (c = 0; c < g; c++) {
            var h = a[c].portion;
            if (b + h >= k) {
                var l = c;
                break
            }
            b += h
        }
        void 0 === l && (l = g - 1, b -= h);
        a = a[l].weightings;
        var p = h;
        g = a.length;
        for (c = 0; c < g; c++) {
            h = a[c] * p;
            if (b + h >= k) break;
            b += h
        }
        l = 4 * l + 2;
        g = e.path;
        f._getParamsForCurve(g[l - 2], g[l - 1], g[l], g[l + 1], g[l + 2], g[l + 3], c / 10 + (k - b) / h * .1, e.orient, m);
        e.orient && (m.rotation = .99999 <= d && 1.00001 >= d && void 0 !== e.endAbsRot ? e.endAbsRot : m.rotation + (e.startOffsetRot + d * e.deltaRotation));
        return m
    };
    f._getParamsForCurve = function(d, e, m, a, c, b, k, g, h) {
        var l = 1 - k;
        h.x = l * l * d +
            2 * l * k * m + k * k * c;
        h.y = l * l * e + 2 * l * k * a + k * k * b;
        g && (h.rotation = 57.2957795 * Math.atan2((a - e) * l + (b - a) * k, (m - d) * l + (c - m) * k))
    };
    f._findPathProblems = function(d) {
        var e = d.path,
            m = e && e.length || 0;
        if (6 > m || (m - 2) % 4) return "\tCannot parse 'path' array due to invalid number of entries in path. There should be an odd number of points, at least 3 points, and 2 entries per point (x & y). See 'CanvasRenderingContext2D.quadraticCurveTo' for details as 'path' models a quadratic bezier.\n\nOnly [ " + (m + " ] values found. Expected: " + Math.max(4 *
            Math.ceil((m - 2) / 4) + 2, 6));
        for (var a = 0; a < m; a++)
            if (isNaN(e[a])) return "All data in path array must be numeric";
        e = d.start;
        if (isNaN(e) && void 0 !== e) return "'start' out of bounds. Expected 0 to 1, got: " + e;
        e = d.end;
        if (isNaN(e) && void 0 !== e) return "'end' out of bounds. Expected 0 to 1, got: " + e;
        if ((d = d.orient) && "fixed" != d && "auto" != d && "cw" != d && "ccw" != d) return 'Invalid orientation value. Expected ["fixed", "auto", "cw", "ccw", undefined], got: ' + d
    };
    createjs.MotionGuidePlugin = f
})();
this.createjs = this.createjs || {};
(function() {
    var f = createjs.TweenJS = createjs.TweenJS || {};
    f.version = "1.0.0";
    f.buildDate = "Thu, 14 Sep 2017 19:47:47 GMT"
})();
(function() {
    var f = "undefined" !== typeof window && "undefined" !== typeof window.document ? window.document : {},
        d = "undefined" !== typeof module && module.exports,
        e = function() {
            for (var c, b = ["requestFullscreen exitFullscreen fullscreenElement fullscreenEnabled fullscreenchange fullscreenerror".split(" "), "webkitRequestFullscreen webkitExitFullscreen webkitFullscreenElement webkitFullscreenEnabled webkitfullscreenchange webkitfullscreenerror".split(" "), "webkitRequestFullScreen webkitCancelFullScreen webkitCurrentFullScreenElement webkitCancelFullScreen webkitfullscreenchange webkitfullscreenerror".split(" "),
                    "mozRequestFullScreen mozCancelFullScreen mozFullScreenElement mozFullScreenEnabled mozfullscreenchange mozfullscreenerror".split(" "), "msRequestFullscreen msExitFullscreen msFullscreenElement msFullscreenEnabled MSFullscreenChange MSFullscreenError".split(" ")
                ], k = 0, g = b.length, h = {}; k < g; k++)
                if ((c = b[k]) && c[1] in f) {
                    for (k = 0; k < c.length; k++) h[b[0][k]] = c[k];
                    return h
                } return !1
        }(),
        m = {
            change: e.fullscreenchange,
            error: e.fullscreenerror
        },
        a = {
            request: function(c) {
                return new Promise(function(b, k) {
                    var g = function() {
                        this.off("change",
                            g);
                        b()
                    }.bind(this);
                    this.on("change", g);
                    c = c || f.documentElement;
                    Promise.resolve(c[e.requestFullscreen]())["catch"](k)
                }.bind(this))
            },
            exit: function() {
                return new Promise(function(c, b) {
                    if (this.isFullscreen) {
                        var k = function() {
                            this.off("change", k);
                            c()
                        }.bind(this);
                        this.on("change", k);
                        Promise.resolve(f[e.exitFullscreen]())["catch"](b)
                    } else c()
                }.bind(this))
            },
            toggle: function(c) {
                return this.isFullscreen ? this.exit() : this.request(c)
            },
            onchange: function(c) {
                this.on("change", c)
            },
            onerror: function(c) {
                this.on("error", c)
            },
            on: function(c, b) {
                var k = m[c];
                k && f.addEventListener(k, b, !1)
            },
            off: function(c, b) {
                var k = m[c];
                k && f.removeEventListener(k, b, !1)
            },
            raw: e
        };
    e ? (Object.defineProperties(a, {
        isFullscreen: {
            get: function() {
                return !!f[e.fullscreenElement]
            }
        },
        element: {
            enumerable: !0,
            get: function() {
                return f[e.fullscreenElement]
            }
        },
        isEnabled: {
            enumerable: !0,
            get: function() {
                return !!f[e.fullscreenEnabled]
            }
        }
    }), d ? module.exports = a : window.screenfull = a) : d ? module.exports = {
        isEnabled: !1
    } : window.screenfull = {
        isEnabled: !1
    }
})();
(function() {
    function f(y) {
        y = String(y);
        return y.charAt(0).toUpperCase() + y.slice(1)
    }

    function d(y, I) {
        var E = -1,
            N = y ? y.length : 0;
        if ("number" == typeof N && -1 < N && N <= q)
            for (; ++E < N;) I(y[E], E, y);
        else m(y, I)
    }

    function e(y) {
        y = String(y).replace(/^ +| +$/g, "");
        return /^(?:webOS|i(?:OS|P))/.test(y) ? y : f(y)
    }

    function m(y, I) {
        for (var E in y) r.call(y, E) && I(y[E], E, y)
    }

    function a(y) {
        return null == y ? f(y) : v.call(y).slice(8, -1)
    }

    function c(y, I) {
        var E = null != y ? typeof y[I] : "number";
        return !/^(?:boolean|number|string|undefined)$/.test(E) &&
            ("object" == E ? !!y[I] : !0)
    }

    function b(y) {
        return String(y).replace(/([ -])(?!$)/g, "$1?")
    }

    function k(y, I) {
        var E = null;
        d(y, function(N, R) {
            E = I(E, N, R, y)
        });
        return E
    }

    function g(y) {
        function I(ma) {
            return k(ma, function(ja, fa) {
                var U = fa.pattern || b(fa);
                !ja && (ja = RegExp("\\b" + U + " *\\d+[.\\w_]*", "i").exec(y) || RegExp("\\b" + U + " *\\w+-[\\w]*", "i").exec(y) || RegExp("\\b" + U + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(y)) && ((ja = String(fa.label && !RegExp(U, "i").test(fa.label) ? fa.label : ja).split("/"))[1] && !/[\d.]+/.test(ja[0]) &&
                    (ja[0] += " " + ja[1]), fa = fa.label || fa, ja = e(ja[0].replace(RegExp(U, "i"), fa).replace(RegExp("; *(?:" + fa + "[_-])?", "i"), " ").replace(RegExp("(" + fa + ")[-_.]?(\\w)", "i"), "$1 $2")));
                return ja
            })
        }

        function E(ma) {
            return k(ma, function(ja, fa) {
                return ja || (RegExp(fa + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(y) || 0)[1] || null
            })
        }
        var N = l,
            R = y && "object" == typeof y && "String" != a(y);
        R && (N = y, y = null);
        var T = N.navigator || {},
            M = T.userAgent || "";
        y || (y = M);
        var G = R ? !!T.likeChrome : /\bChrome\b/.test(y) && !/internal|\n/i.test(v.toString()),
            H = R ? "Object" : "ScriptBridgingProxyObject",
            S = R ? "Object" : "Environment",
            J = R && N.java ? "JavaPackage" : a(N.java),
            ca = R ? "Object" : "RuntimeObject";
        S = (J = /\bJava/.test(J) && N.java) && a(N.environment) == S;
        var O = J ? "a" : "\u03b1",
            Y = J ? "b" : "\u03b2",
            K = N.document || {},
            z = N.operamini || N.opera,
            C = t.test(C = R && z ? z["[[Class]]"] : a(z)) ? C : z = null,
            u, B = y;
        R = [];
        var w = null,
            A = y == M;
        M = A && z && "function" == typeof z.version && z.version();
        var F = function(ma) {
                return k(ma, function(ja, fa) {
                    return ja || RegExp("\\b" + (fa.pattern || b(fa)) + "\\b", "i").exec(y) && (fa.label ||
                        fa)
                })
            }([{
                label: "EdgeHTML",
                pattern: "Edge"
            }, "Trident", {
                label: "WebKit",
                pattern: "AppleWebKit"
            }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko"]),
            D = function(ma) {
                return k(ma, function(ja, fa) {
                    return ja || RegExp("\\b" + (fa.pattern || b(fa)) + "\\b", "i").exec(y) && (fa.label || fa)
                })
            }(["Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Electron", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", {
                    label: "Microsoft Edge",
                    pattern: "Edge"
                }, "Midori",
                "Nook Browser", "PaleMoon", "PhantomJS", "Raven", "Rekonq", "RockMelt", {
                    label: "Samsung Internet",
                    pattern: "SamsungBrowser"
                }, "SeaMonkey", {
                    label: "Silk",
                    pattern: "(?:Cloud9|Silk-Accelerated)"
                }, "Sleipnir", "SlimBrowser", {
                    label: "SRWare Iron",
                    pattern: "Iron"
                }, "Sunrise", "Swiftfox", "Waterfox", "WebPositive", "Opera Mini", {
                    label: "Opera Mini",
                    pattern: "OPiOS"
                }, "Opera", {
                    label: "Opera",
                    pattern: "OPR"
                }, "Chrome", {
                    label: "Chrome Mobile",
                    pattern: "(?:CriOS|CrMo)"
                }, {
                    label: "Firefox",
                    pattern: "(?:Firefox|Minefield)"
                }, {
                    label: "Firefox for iOS",
                    pattern: "FxiOS"
                }, {
                    label: "IE",
                    pattern: "IEMobile"
                }, {
                    label: "IE",
                    pattern: "MSIE"
                }, "Safari"
            ]),
            Q = I([{
                    label: "BlackBerry",
                    pattern: "BB10"
                }, "BlackBerry", {
                    label: "Galaxy S",
                    pattern: "GT-I9000"
                }, {
                    label: "Galaxy S2",
                    pattern: "GT-I9100"
                }, {
                    label: "Galaxy S3",
                    pattern: "GT-I9300"
                }, {
                    label: "Galaxy S4",
                    pattern: "GT-I9500"
                }, {
                    label: "Galaxy S5",
                    pattern: "SM-G900"
                }, {
                    label: "Galaxy S6",
                    pattern: "SM-G920"
                }, {
                    label: "Galaxy S6 Edge",
                    pattern: "SM-G925"
                }, {
                    label: "Galaxy S7",
                    pattern: "SM-G930"
                }, {
                    label: "Galaxy S7 Edge",
                    pattern: "SM-G935"
                }, "Google TV",
                "Lumia", "iPad", "iPod", "iPhone", "Kindle", {
                    label: "Kindle Fire",
                    pattern: "(?:Cloud9|Silk-Accelerated)"
                }, "Nexus", "Nook", "PlayBook", "PlayStation Vita", "PlayStation", "TouchPad", "Transformer", {
                    label: "Wii U",
                    pattern: "WiiU"
                }, "Wii", "Xbox One", {
                    label: "Xbox 360",
                    pattern: "Xbox"
                }, "Xoom"
            ]),
            X = function(ma) {
                return k(ma, function(ja, fa, U) {
                    return ja || (fa[Q] || fa[/^[a-z]+(?: +[a-z]+\b)*/i.exec(Q)] || RegExp("\\b" + b(U) + "(?:\\b|\\w*\\d)", "i").exec(y)) && U
                })
            }({
                Apple: {
                    iPad: 1,
                    iPhone: 1,
                    iPod: 1
                },
                Archos: {},
                Amazon: {
                    Kindle: 1,
                    "Kindle Fire": 1
                },
                Asus: {
                    Transformer: 1
                },
                "Barnes & Noble": {
                    Nook: 1
                },
                BlackBerry: {
                    PlayBook: 1
                },
                Google: {
                    "Google TV": 1,
                    Nexus: 1
                },
                HP: {
                    TouchPad: 1
                },
                HTC: {},
                LG: {},
                Microsoft: {
                    Xbox: 1,
                    "Xbox One": 1
                },
                Motorola: {
                    Xoom: 1
                },
                Nintendo: {
                    "Wii U": 1,
                    Wii: 1
                },
                Nokia: {
                    Lumia: 1
                },
                Samsung: {
                    "Galaxy S": 1,
                    "Galaxy S2": 1,
                    "Galaxy S3": 1,
                    "Galaxy S4": 1
                },
                Sony: {
                    PlayStation: 1,
                    "PlayStation Vita": 1
                }
            }),
            P = function(ma) {
                return k(ma, function(ja, fa) {
                    var U = fa.pattern || b(fa);
                    if (!ja && (ja = RegExp("\\b" + U + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(y))) {
                        var ba = ja,
                            da = fa.label || fa,
                            oa = {
                                "10.0": "10",
                                "6.4": "10 Technical Preview",
                                "6.3": "8.1",
                                "6.2": "8",
                                "6.1": "Server 2008 R2 / 7",
                                "6.0": "Server 2008 / Vista",
                                "5.2": "Server 2003 / XP 64-bit",
                                "5.1": "XP",
                                "5.01": "2000 SP1",
                                "5.0": "2000",
                                "4.0": "NT",
                                "4.90": "ME"
                            };
                        U && da && /^Win/i.test(ba) && !/^Windows Phone /i.test(ba) && (oa = oa[/[\d.]+$/.exec(ba)]) && (ba = "Windows " + oa);
                        ba = String(ba);
                        U && da && (ba = ba.replace(RegExp(U, "i"), da));
                        ja = ba = e(ba.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i,
                            "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0])
                    }
                    return ja
                })
            }(["Windows Phone", "Android", "CentOS", {
                    label: "Chrome OS",
                    pattern: "CrOS"
                }, "Debian", "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS",
                "Tizen", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows "
            ]);
        F && (F = [F]);
        X && !Q && (Q = I([X]));
        if (u = /\bGoogle TV\b/.exec(Q)) Q = u[0];
        /\bSimulator\b/i.test(y) && (Q = (Q ? Q + " " : "") + "Simulator");
        "Opera Mini" == D && /\bOPiOS\b/.test(y) && R.push("running in Turbo/Uncompressed mode");
        "IE" == D && /\blike iPhone OS\b/.test(y) ? (u = g(y.replace(/like iPhone OS/, "")), X = u.manufacturer, Q = u.product) : /^iP/.test(Q) ? (D || (D = "Safari"), P = "iOS" + ((u = / OS ([\d_]+)/i.exec(y)) ? " " + u[1].replace(/_/g, ".") : "")) : "Konqueror" != D || /buntu/i.test(P) ?
            X && "Google" != X && (/Chrome/.test(D) && !/\bMobile Safari\b/i.test(y) || /\bVita\b/.test(Q)) || /\bAndroid\b/.test(P) && /^Chrome/.test(D) && /\bVersion\//i.test(y) ? (D = "Android Browser", P = /\bAndroid\b/.test(P) ? P : "Android") : "Silk" == D ? (/\bMobi/i.test(y) || (P = "Android", R.unshift("desktop mode")), /Accelerated *= *true/i.test(y) && R.unshift("accelerated")) : "PaleMoon" == D && (u = /\bFirefox\/([\d.]+)\b/.exec(y)) ? R.push("identifying as Firefox " + u[1]) : "Firefox" == D && (u = /\b(Mobile|Tablet|TV)\b/i.exec(y)) ? (P || (P = "Firefox OS"),
                Q || (Q = u[1])) : !D || (u = !/\bMinefield\b/i.test(y) && /\b(?:Firefox|Safari)\b/.exec(D)) ? (D && !Q && /[\/,]|^[^(]+?\)/.test(y.slice(y.indexOf(u + "/") + 8)) && (D = null), (u = Q || X || P) && (Q || X || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(P)) && (D = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(P) ? P : u) + " Browser")) : "Electron" == D && (u = (/\bChrome\/([\d.]+)\b/.exec(y) || 0)[1]) && R.push("Chromium " + u) : P = "Kubuntu";
        M || (M = E(["(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))",
            "Version", b(D), "(?:Firefox|Minefield|NetFront)"
        ]));
        if (u = "iCab" == F && 3 < parseFloat(M) && "WebKit" || /\bOpera\b/.test(D) && (/\bOPR\b/.test(y) ? "Blink" : "Presto") || /\b(?:Midori|Nook|Safari)\b/i.test(y) && !/^(?:Trident|EdgeHTML)$/.test(F) && "WebKit" || !F && /\bMSIE\b/i.test(y) && ("Mac OS" == P ? "Tasman" : "Trident") || "WebKit" == F && /\bPlayStation\b(?! Vita\b)/i.test(D) && "NetFront") F = [u];
        "IE" == D && (u = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(y) || 0)[1]) ? (D += " Mobile", P = "Windows Phone " + (/\+$/.test(u) ? u : u + ".x"), R.unshift("desktop mode")) :
            /\bWPDesktop\b/i.test(y) ? (D = "IE Mobile", P = "Windows Phone 8.x", R.unshift("desktop mode"), M || (M = (/\brv:([\d.]+)/.exec(y) || 0)[1])) : "IE" != D && "Trident" == F && (u = /\brv:([\d.]+)/.exec(y)) && (D && R.push("identifying as " + D + (M ? " " + M : "")), D = "IE", M = u[1]);
        if (A) {
            if (c(N, "global"))
                if (J && (u = J.lang.System, B = u.getProperty("os.arch"), P = P || u.getProperty("os.name") + " " + u.getProperty("os.version")), S) {
                    try {
                        M = N.require("ringo/engine").version.join("."), D = "RingoJS"
                    } catch (ma) {
                        (u = N.system) && u.global.system == N.system && (D = "Narwhal",
                            P || (P = u[0].os || null))
                    }
                    D || (D = "Rhino")
                } else "object" == typeof N.process && !N.process.browser && (u = N.process) && ("object" == typeof u.versions && ("string" == typeof u.versions.electron ? (R.push("Node " + u.versions.node), D = "Electron", M = u.versions.electron) : "string" == typeof u.versions.nw && (R.push("Chromium " + M, "Node " + u.versions.node), D = "NW.js", M = u.versions.nw)), D || (D = "Node.js", B = u.arch, P = u.platform, M = (M = /[\d.]+/.exec(u.version)) ? M[0] : null));
            else a(u = N.runtime) == H ? (D = "Adobe AIR", P = u.flash.system.Capabilities.os) :
                a(u = N.phantom) == ca ? (D = "PhantomJS", M = (u = u.version || null) && u.major + "." + u.minor + "." + u.patch) : "number" == typeof K.documentMode && (u = /\bTrident\/(\d+)/i.exec(y)) ? (M = [M, K.documentMode], (u = +u[1] + 4) != M[1] && (R.push("IE " + M[1] + " mode"), F && (F[1] = ""), M[1] = u), M = "IE" == D ? String(M[1].toFixed(1)) : M[0]) : "number" == typeof K.documentMode && /^(?:Chrome|Firefox)\b/.test(D) && (R.push("masking as " + D + " " + M), D = "IE", M = "11.0", F = ["Trident"], P = "Windows");
            P = P && e(P)
        }
        M && (u = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(M) || /(?:alpha|beta)(?: ?\d)?/i.exec(y +
            ";" + (A && T.appMinorVersion)) || /\bMinefield\b/i.test(y) && "a") && (w = /b/i.test(u) ? "beta" : "alpha", M = M.replace(RegExp(u + "\\+?$"), "") + ("beta" == w ? Y : O) + (/\d+\+?/.exec(u) || ""));
        if ("Fennec" == D || "Firefox" == D && /\b(?:Android|Firefox OS)\b/.test(P)) D = "Firefox Mobile";
        else if ("Maxthon" == D && M) M = M.replace(/\.[\d.]+/, ".x");
        else if (/\bXbox\b/i.test(Q)) "Xbox 360" == Q && (P = null), "Xbox 360" == Q && /\bIEMobile\b/.test(y) && R.unshift("mobile mode");
        else if (!/^(?:Chrome|IE|Opera)$/.test(D) && (!D || Q || /Browser|Mobi/.test(D)) || "Windows CE" !=
            P && !/Mobi/i.test(y))
            if ("IE" == D && A) try {
                null === N.external && R.unshift("platform preview")
            } catch (ma) {
                R.unshift("embedded")
            } else(/\bBlackBerry\b/.test(Q) || /\bBB10\b/.test(y)) && (u = (RegExp(Q.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(y) || 0)[1] || M) ? (u = [u, /BB10/.test(y)], P = (u[1] ? (Q = null, X = "BlackBerry") : "Device Software") + " " + u[0], M = null) : this != m && "Wii" != Q && (A && z || /Opera/.test(D) && /\b(?:MSIE|Firefox)\b/i.test(y) || "Firefox" == D && /\bOS X (?:\d+\.){2,}/.test(P) || "IE" == D && (P && !/^Win/.test(P) && 5.5 < M || /\bWindows XP\b/.test(P) &&
                8 < M || 8 == M && !/\bTrident\b/.test(y))) && !t.test(u = g.call(m, y.replace(t, "") + ";")) && u.name && (u = "ing as " + u.name + ((u = u.version) ? " " + u : ""), t.test(D) ? (/\bIE\b/.test(u) && "Mac OS" == P && (P = null), u = "identify" + u) : (u = "mask" + u, D = C ? e(C.replace(/([a-z])([A-Z])/g, "$1 $2")) : "Opera", /\bIE\b/.test(u) && (P = null), A || (M = null)), F = ["Presto"], R.push(u));
            else D += " Mobile";
        if (u = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(y) || 0)[1]) {
            u = [parseFloat(u.replace(/\.(\d)$/, ".0$1")), u];
            if ("Safari" == D && "+" == u[1].slice(-1)) D = "WebKit Nightly", w = "alpha",
                M = u[1].slice(0, -1);
            else if (M == u[1] || M == (u[2] = (/\bSafari\/([\d.]+\+?)/i.exec(y) || 0)[1])) M = null;
            u[1] = (/\bChrome\/([\d.]+)/i.exec(y) || 0)[1];
            537.36 == u[0] && 537.36 == u[2] && 28 <= parseFloat(u[1]) && "WebKit" == F && (F = ["Blink"]);
            A && (G || u[1]) ? (F && (F[1] = "like Chrome"), u = u[1] || (u = u[0], 530 > u ? 1 : 532 > u ? 2 : 532.05 > u ? 3 : 533 > u ? 4 : 534.03 > u ? 5 : 534.07 > u ? 6 : 534.1 > u ? 7 : 534.13 > u ? 8 : 534.16 > u ? 9 : 534.24 > u ? 10 : 534.3 > u ? 11 : 535.01 > u ? 12 : 535.02 > u ? "13+" : 535.07 > u ? 15 : 535.11 > u ? 16 : 535.19 > u ? 17 : 536.05 > u ? 18 : 536.1 > u ? 19 : 537.01 > u ? 20 : 537.11 > u ? "21+" : 537.13 > u ?
                23 : 537.18 > u ? 24 : 537.24 > u ? 25 : 537.36 > u ? 26 : "Blink" != F ? "27" : "28")) : (F && (F[1] = "like Safari"), u = (u = u[0], 400 > u ? 1 : 500 > u ? 2 : 526 > u ? 3 : 533 > u ? 4 : 534 > u ? "4+" : 535 > u ? 5 : 537 > u ? 6 : 538 > u ? 7 : 601 > u ? 8 : "8"));
            F && (F[1] += " " + (u += "number" == typeof u ? ".x" : /[.+]/.test(u) ? "" : "+"));
            "Safari" == D && (!M || 45 < parseInt(M)) && (M = u)
        }
        "Opera" == D && (u = /\bzbov|zvav$/.exec(P)) ? (D += " ", R.unshift("desktop mode"), "zvav" == u ? (D += "Mini", M = null) : D += "Mobile", P = P.replace(RegExp(" *" + u + "$"), "")) : "Safari" == D && /\bChrome\b/.exec(F && F[1]) && (R.unshift("desktop mode"),
            D = "Chrome Mobile", M = null, /\bOS X\b/.test(P) ? (X = "Apple", P = "iOS 4.3+") : P = null);
        M && 0 == M.indexOf(u = /[\d.]+$/.exec(P)) && -1 < y.indexOf("/" + u + "-") && (P = String(P.replace(u, "")).replace(/^ +| +$/g, ""));
        F && !/\b(?:Avant|Nook)\b/.test(D) && (/Browser|Lunascape|Maxthon/.test(D) || "Safari" != D && /^iOS/.test(P) && /\bSafari\b/.test(F[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(D) && F[1]) && (u = F[F.length - 1]) && R.push(u);
        R.length && (R = ["(" + R.join("; ") + ")"]);
        X && Q && 0 > Q.indexOf(X) &&
            R.push("on " + X);
        Q && R.push((/^on /.test(R[R.length - 1]) ? "" : "on ") + Q);
        if (P) {
            var Z = (u = / ([\d.+]+)$/.exec(P)) && "/" == P.charAt(P.length - u[0].length - 1);
            P = {
                architecture: 32,
                family: u && !Z ? P.replace(u[0], "") : P,
                version: u ? u[1] : null,
                toString: function() {
                    var ma = this.version;
                    return this.family + (ma && !Z ? " " + ma : "") + (64 == this.architecture ? " 64-bit" : "")
                }
            }
        }(u = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(B)) && !/\bi686\b/i.test(B) ? (P && (P.architecture = 64, P.family = P.family.replace(RegExp(" *" + u), "")), D && (/\bWOW64\b/i.test(y) || A &&
            /\w(?:86|32)$/.test(T.cpuClass || T.platform) && !/\bWin64; x64\b/i.test(y)) && R.unshift("32-bit")) : P && /^OS X/.test(P.family) && "Chrome" == D && 39 <= parseFloat(M) && (P.architecture = 64);
        y || (y = null);
        N = {};
        N.description = y;
        N.layout = F && F[0];
        N.manufacturer = X;
        N.name = D;
        N.prerelease = w;
        N.product = Q;
        N.ua = y;
        N.version = D && M;
        N.os = P || {
            architecture: null,
            family: null,
            version: null,
            toString: function() {
                return "null"
            }
        };
        N.parse = g;
        N.toString = function() {
            return this.description || ""
        };
        N.version && R.unshift(M);
        N.name && R.unshift(D);
        P && D && (P !=
            String(P).split(" ")[0] || P != D.split(" ")[0] && !Q) && R.push(Q ? "(" + P + ")" : "on " + P);
        R.length && (N.description = R.join(" "));
        return N
    }
    var h = {
            "function": !0,
            object: !0
        },
        l = h[typeof window] && window || this,
        p = h[typeof exports] && exports;
    h = h[typeof module] && module && !module.nodeType && module;
    var n = p && h && "object" == typeof global && global;
    !n || n.global !== n && n.window !== n && n.self !== n || (l = n);
    var q = Math.pow(2, 53) - 1,
        t = /\bOpera/;
    n = Object.prototype;
    var r = n.hasOwnProperty,
        v = n.toString,
        x = g();
    "function" == typeof define && "object" == typeof define.amd &&
        define.amd ? (l.platform = x, define(function() {
            return x
        })) : p && h ? m(x, function(y, I) {
            p[I] = y
        }) : l.platform = x
}).call(this);

function buildIOSMeta() {
    for (var f = [{
            name: "viewport",
            content: "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        }, {
            name: "apple-mobile-web-app-capable",
            content: "yes"
        }, {
            name: "apple-mobile-web-app-status-bar-style",
            content: "black"
        }], d = 0; d < f.length; d++) {
        var e = document.createElement("meta");
        e.name = f[d].name;
        e.content = f[d].content;
        var m = window.document.head.querySelector('meta[name="' + e.name + '"]');
        m && m.parentNode.removeChild(m);
        window.document.head.appendChild(e)
    }
}

function hideIOSFullscreenPanel() {
    document.querySelector(".xxx-ios-fullscreen-message").style.display = "none";
    document.querySelector(".xxx-ios-fullscreen-scroll").style.display = "none";
    document.querySelector(".xxx-game-iframe-full").classList.remove("xxx-game-iframe-iphone-se")
}

function buildIOSFullscreenPanel() {
    document.body.insertAdjacentHTML("beforeend", '<div class="xxx-ios-fullscreen-message"><div class="xxx-ios-fullscreen-swipe"></div></div><div class="xxx-ios-fullscreen-scroll"></div>')
}

function showIOSFullscreenPanel() {
    document.querySelector(".xxx-ios-fullscreen-message").style.display = "none";
    document.querySelector(".xxx-ios-fullscreen-scroll").style.display = "none"
}

function __iosResize() {
    window.scrollTo(0, 0);
    console.log(window.devicePixelRatio);
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    if ("iPhone" === platform.product) switch (window.devicePixelRatio) {
        case 2:
            switch (window.innerWidth) {
                case 568:
                    320 !== window.innerHeight && document.querySelector(".xxx-game-iframe-full").classList.add("xxx-game-iframe-iphone-se");
                    break;
                case 667:
                    375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                case 808:
                    414 === window.innerHeight ? hideIOSFullscreenPanel() :
                        showIOSFullscreenPanel();
                    break;
                default:
                    hideIOSFullscreenPanel()
            }
            break;
        case 3:
            switch (window.innerWidth) {
                case 736:
                    414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                case 724:
                    375 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                case 808:
                    414 === window.innerHeight ? hideIOSFullscreenPanel() : showIOSFullscreenPanel();
                    break;
                default:
                    hideIOSFullscreenPanel()
            }
            break;
        default:
            hideIOSFullscreenPanel()
    }
}

function iosResize() {
    __iosResize();
    setTimeout(function() {
        __iosResize()
    }, 500)
}

function iosInIframe() {
    try {
        return window.self !== window.top
    } catch (f) {
        return !0
    }
}

function isIOSLessThen13() {
    var f = platform.os,
        d = f.family.toLowerCase();
    f = parseFloat(f.version);
    return "ios" === d && 13 > f ? !0 : !1
}
document.addEventListener("DOMContentLoaded", function() {
    platform && "iPhone" === platform.product && "safari" === platform.name.toLowerCase() && isIOSLessThen13() && !iosInIframe() && (buildIOSFullscreenPanel(), buildIOSMeta())
});
window.addEventListener("resize", function(f) {
    platform && "iPhone" === platform.product && "safari" === platform.name.toLowerCase() && isIOSLessThen13() && !iosInIframe() && iosResize()
});
var s_iOffsetX = 0,
    s_iOffsetY = 0,
    s_fInverseScaling = 0,
    s_bIsIphone, s_bFocus = !0;
(function(f) {
    (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(f) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(f.substr(0,
        4))
})(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function() {
    sizeHandler()
});

function trace(f) {
    console.log(f)
}

function isIpad() {
    var f = -1 !== navigator.userAgent.toLowerCase().indexOf("ipad");
    return !f && navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && 2 < navigator.maxTouchPoints ? !0 : f
}

function isMobile() {
    return isIpad() ? !0 : navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i) ? !0 : !1
}

function isIOS() {
    if (isIpad()) return !0;
    for (var f = "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";"); f.length;)
        if (navigator.platform === f.pop()) return s_bIsIphone = !0;
    return s_bIsIphone = !1
}
window.addEventListener("orientationchange", onOrientationChange);

function onOrientationChange() {
    window.matchMedia("(orientation: portrait)").matches && sizeHandler();
    window.matchMedia("(orientation: landscape)").matches && sizeHandler()
}

function getSize(f) {
    var d = f.toLowerCase(),
        e = window.document,
        m = e.documentElement;
    if (void 0 === window["inner" + f]) f = m["client" + f];
    else if (window["inner" + f] != m["client" + f]) {
        var a = e.createElement("body");
        a.id = "vpw-test-b";
        a.style.cssText = "overflow:scroll";
        var c = e.createElement("div");
        c.id = "vpw-test-d";
        c.style.cssText = "position:absolute;top:-1000px";
        c.innerHTML = "<style>@media(" + d + ":" + m["client" + f] + "px){body#vpw-test-b div#vpw-test-d{" + d + ":7px!important}}</style>";
        a.appendChild(c);
        m.insertBefore(a, e.head);
        f = 7 == c["offset" + f] ? m["client" + f] : window["inner" + f];
        m.removeChild(a)
    } else f = window["inner" + f];
    return f
}

function getIOSWindowHeight() {
    return document.documentElement.clientWidth / window.innerWidth * window.innerHeight
}

function getHeightOfIOSToolbars() {
    var f = (0 === window.orientation ? screen.height : screen.width) - getIOSWindowHeight();
    return 1 < f ? f : 0
}

function sizeHandler() {
    window.scrollTo(0, 1);
    if ($("#canvas")) {
        var f = null !== platform.name && "safari" === platform.name.toLowerCase() ? getIOSWindowHeight() : getSize("Height");
        var d = getSize("Width");
        s_bFocus && _checkOrientation(d, f);
        s_iScaleFactor = Math.min(f / CANVAS_HEIGHT, d / CANVAS_WIDTH);
        var e = Math.round(CANVAS_WIDTH * s_iScaleFactor),
            m = Math.round(CANVAS_HEIGHT * s_iScaleFactor);
        if (m < f) {
            var a = f - m;
            m += a;
            e += CANVAS_WIDTH / CANVAS_HEIGHT * a
        } else e < d && (a = d - e, e += a, m += CANVAS_HEIGHT / CANVAS_WIDTH * a);
        a = f / 2 - m / 2;
        var c = d / 2 - e / 2,
            b = CANVAS_WIDTH / e;
        if (c * b < -EDGEBOARD_X || a * b < -EDGEBOARD_Y) s_iScaleFactor = Math.min(f / (CANVAS_HEIGHT - 2 * EDGEBOARD_Y), d / (CANVAS_WIDTH - 2 * EDGEBOARD_X)), e = Math.round(CANVAS_WIDTH * s_iScaleFactor), m = Math.round(CANVAS_HEIGHT * s_iScaleFactor), a = (f - m) / 2, c = (d - e) / 2, b = CANVAS_WIDTH / e;
        s_fInverseScaling = b;
        s_iOffsetX = -1 * c * b;
        s_iOffsetY = -1 * a * b;
        0 <= a && (s_iOffsetY = 0);
        0 <= c && (s_iOffsetX = 0);
        null !== s_oInterface && s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY);
        null !== s_oMenu && s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
        $("#canvas").css("width", e + "px");
        $("#canvas").css("height", m + "px");
        s_iCanvasOffsetHeight = a;
        0 > a || (a = (f - m) / 2);
        $("#canvas").css("top", a + "px");
        $("#canvas").css("left", c + "px");
        resizeCanvas3D();
        s_iCanvasResizeWidth = e;
        s_iCanvasResizeHeight = m;
        s_iCanvasOffsetWidth = c;
        fullscreenHandler()
    }
}

function _checkOrientation(f, d) {
    s_bMobile && ENABLE_CHECK_ORIENTATION && (f > d ? "landscape" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"), s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"), s_oMain.stopUpdate()) : "portrait" === $(".orientation-msg-container").attr("data-orientation") ? ($(".orientation-msg-container").css("display", "none"), s_oMain.startUpdate()) : ($(".orientation-msg-container").css("display", "block"),
        s_oMain.stopUpdate()))
}

function createBitmap(f, d, e) {
    var m = new createjs.Bitmap(f),
        a = new createjs.Shape;
    d && e ? a.graphics.beginFill("#fff").drawRect(-d / 2, -e / 2, d, e) : a.graphics.beginFill("#ff0").drawRect(0, 0, f.width, f.height);
    m.hitArea = a;
    return m
}

function createSprite(f, d, e, m, a, c) {
    f = null !== d ? new createjs.Sprite(f, d) : new createjs.Sprite(f);
    d = new createjs.Shape;
    d.graphics.beginFill("#000000").drawRect(-e, -m, a, c);
    f.hitArea = d;
    return f
}

function randomFloatBetween(f, d, e) {
    "undefined" === typeof e && (e = 2);
    return parseFloat(Math.min(f + Math.random() * (d - f), d).toFixed(e))
}

function shuffle(f) {
    for (var d = f.length, e, m; 0 !== d;) m = Math.floor(Math.random() * d), --d, e = f[d], f[d] = f[m], f[m] = e;
    return f
}

function formatTime(f) {
    f /= 1E3;
    var d = Math.floor(f / 60);
    f = parseFloat(f - 60 * d).toFixed(1);
    var e = "";
    e = 10 > d ? e + ("0" + d + ":") : e + (d + ":");
    return 10 > f ? e + ("0" + f) : e + f
}

function degreesToRadians(f) {
    return f * Math.PI / 180
}

function checkRectCollision(f, d) {
    var e = getBounds(f, .9);
    var m = getBounds(d, .98);
    return calculateIntersection(e, m)
}

function calculateIntersection(f, d) {
    var e, m, a, c;
    var b = f.x + (e = f.width / 2);
    var k = f.y + (m = f.height / 2);
    var g = d.x + (a = d.width / 2);
    var h = d.y + (c = d.height / 2);
    b = Math.abs(b - g) - (e + a);
    k = Math.abs(k - h) - (m + c);
    return 0 > b && 0 > k ? (b = Math.min(Math.min(f.width, d.width), -b), k = Math.min(Math.min(f.height, d.height), -k), {
        x: Math.max(f.x, d.x),
        y: Math.max(f.y, d.y),
        width: b,
        height: k,
        rect1: f,
        rect2: d
    }) : null
}

function getBounds(f, d) {
    var e = {
        x: Infinity,
        y: Infinity,
        width: 0,
        height: 0
    };
    if (f instanceof createjs.Container) {
        e.x2 = -Infinity;
        e.y2 = -Infinity;
        var m = f.children,
            a = m.length,
            c;
        for (c = 0; c < a; c++) {
            var b = getBounds(m[c], 1);
            b.x < e.x && (e.x = b.x);
            b.y < e.y && (e.y = b.y);
            b.x + b.width > e.x2 && (e.x2 = b.x + b.width);
            b.y + b.height > e.y2 && (e.y2 = b.y + b.height)
        }
        Infinity == e.x && (e.x = 0);
        Infinity == e.y && (e.y = 0);
        Infinity == e.x2 && (e.x2 = 0);
        Infinity == e.y2 && (e.y2 = 0);
        e.width = e.x2 - e.x;
        e.height = e.y2 - e.y;
        delete e.x2;
        delete e.y2
    } else {
        if (f instanceof createjs.Bitmap) {
            a =
                f.sourceRect || f.image;
            c = a.width * d;
            var k = a.height * d
        } else if (f instanceof createjs.Sprite)
            if (f.spriteSheet._frames && f.spriteSheet._frames[f.currentFrame] && f.spriteSheet._frames[f.currentFrame].image) {
                a = f.spriteSheet.getFrame(f.currentFrame);
                c = a.rect.width;
                k = a.rect.height;
                m = a.regX;
                var g = a.regY
            } else e.x = f.x || 0, e.y = f.y || 0;
        else e.x = f.x || 0, e.y = f.y || 0;
        m = m || 0;
        c = c || 0;
        g = g || 0;
        k = k || 0;
        e.regX = m;
        e.regY = g;
        a = f.localToGlobal(0 - m, 0 - g);
        b = f.localToGlobal(c - m, k - g);
        c = f.localToGlobal(c - m, 0 - g);
        m = f.localToGlobal(0 - m, k - g);
        e.x =
            Math.min(Math.min(Math.min(a.x, b.x), c.x), m.x);
        e.y = Math.min(Math.min(Math.min(a.y, b.y), c.y), m.y);
        e.width = Math.max(Math.max(Math.max(a.x, b.x), c.x), m.x) - e.x;
        e.height = Math.max(Math.max(Math.max(a.y, b.y), c.y), m.y) - e.y
    }
    return e
}

function NoClickDelay(f) {
    this.element = f;
    window.Touch && this.element.addEventListener("touchstart", this, !1)
}
NoClickDelay.prototype = {
    handleEvent: function(f) {
        switch (f.type) {
            case "touchstart":
                this.onTouchStart(f);
                break;
            case "touchmove":
                this.onTouchMove(f);
                break;
            case "touchend":
                this.onTouchEnd(f)
        }
    },
    onTouchStart: function(f) {
        f.preventDefault();
        this.moved = !1;
        this.element.addEventListener("touchmove", this, !1);
        this.element.addEventListener("touchend", this, !1)
    },
    onTouchMove: function(f) {
        this.moved = !0
    },
    onTouchEnd: function(f) {
        this.element.removeEventListener("touchmove", this, !1);
        this.element.removeEventListener("touchend",
            this, !1);
        if (!this.moved) {
            f = document.elementFromPoint(f.changedTouches[0].clientX, f.changedTouches[0].clientY);
            3 == f.nodeType && (f = f.parentNode);
            var d = document.createEvent("MouseEvents");
            d.initEvent("click", !0, !0);
            f.dispatchEvent(d)
        }
    }
};
(function() {
    function f(e) {
        var m = {
            focus: "visible",
            focusin: "visible",
            pageshow: "visible",
            blur: "hidden",
            focusout: "hidden",
            pagehide: "hidden"
        };
        e = e || window.event;
        e.type in m ? document.body.className = m[e.type] : (document.body.className = this[d] ? "hidden" : "visible", "hidden" === document.body.className ? (s_oMain.stopUpdate(), s_bFocus = !1) : (s_oMain.startUpdate(), s_bFocus = !0))
    }
    var d = "hidden";
    d in document ? document.addEventListener("visibilitychange", f) : (d = "mozHidden") in document ? document.addEventListener("mozvisibilitychange",
        f) : (d = "webkitHidden") in document ? document.addEventListener("webkitvisibilitychange", f) : (d = "msHidden") in document ? document.addEventListener("msvisibilitychange", f) : "onfocusin" in document ? document.onfocusin = document.onfocusout = f : window.onpageshow = window.onpagehide = window.onfocus = window.onblur = f
})();

function playSound(f, d, e) {
    return !1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile ? (s_aSounds[f].play(), s_aSounds[f].volume(d), s_aSounds[f].loop(e), s_aSounds[f]) : null
}

function stopSound(f) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[f].stop()
}

function setVolume(f, d) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[f].volume(d)
}

function setMute(f, d) {
    !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || s_aSounds[f].mute(d)
}

function ctlArcadeResume() {
    null !== s_oMain && s_oMain.startUpdate()
}

function ctlArcadePause() {
    null !== s_oMain && s_oMain.stopUpdate()
}

function getParamValue(f) {
    for (var d = window.location.search.substring(1).split("&"), e = 0; e < d.length; e++) {
        var m = d[e].split("=");
        if (m[0] == f) return m[1]
    }
}

function rotateVector2D(f, d) {
    return {
        x: d.x * Math.cos(f) + d.y * Math.sin(f),
        y: d.x * -Math.sin(f) + d.y * Math.cos(f)
    }
}

function normalize(f, d) {
    0 < d && (f.x /= d, f.y /= d);
    return f
}

function findNearestIntersectingObject(f, d, e, m) {
    var a = CANVAS_RESIZE_WIDTH + 2 * OFFSET_WIDTH,
        c = CANVAS_RESIZE_HEIGHT + 2 * OFFSET_HEIGHT,
        b = new THREE.Raycaster,
        k = new THREE.Vector3;
    k.x = f / a * 2 - 1;
    k.y = 2 * -(d / c) + 1;
    k.z = .5;
    b.setFromCamera(k, e);
    f = b.intersectObjects(m, !0);
    d = !1;
    0 < f.length && (d = f[0]);
    return d
}

function distance(f, d, e, m) {
    f -= e;
    d -= m;
    return Math.sqrt(f * f + d * d)
}

function distance2(f, d, e, m) {
    f -= e;
    d -= m;
    return f * f + d * d
}

function resizeCanvas3D() {
    $("canvas").each(function() {
        "#canvas" != $(this).attr("id") && ($(this).css("width", $("#canvas").css("width")), $(this).css("height", $("#canvas").css("height")), $(this).css("position", $("#canvas").css("position")), $(this).css("left", $("#canvas").css("left")), $(this).css("top", $("#canvas").css("top")))
    })
}

function createOrthoGraphicCamera() {
    var f = new THREE.PerspectiveCamera(FOV, CANVAS_WIDTH / CANVAS_HEIGHT, NEAR, FAR);
    f.rotation.x = Math.PI / 180 * 88.6;
    f.rotation.y = Math.PI / 180 * .03;
    f.position.set(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
    f.updateProjectionMatrix();
    f.updateMatrixWorld();
    return f
}

function rotateVector2D(f, d) {
    return {
        x: d.x * Math.cos(f) + d.y * Math.sin(f),
        y: d.x * -Math.sin(f) + d.y * Math.cos(f),
        z: 0
    }
}
Math.radians = function(f) {
    return f * Math.PI / 180
};
Math.degrees = function(f) {
    return 180 * f / Math.PI
};

function distanceV3(f, d, e, m, a, c) {
    f -= m;
    d -= a;
    e -= c;
    return Math.sqrt(f * f + d * d + e * e)
}

function distanceV2(f, d) {
    var e = f.x - d.x,
        m = f.y - d.y;
    return Math.sqrt(e * e + m * m)
}

function saveItem(f, d) {
    s_bStorageAvailable && localStorage.setItem(f, d)
}

function getItem(f) {
    return s_bStorageAvailable ? localStorage.getItem(f) : 0
}

function clearAllItem() {
    s_bStorageAvailable && localStorage.clear()
}

function fullscreenHandler() {
    ENABLE_FULLSCREEN && !1 !== screenfull.isEnabled && (s_bFullscreen = screenfull.isFullscreen, null !== s_oInterface && s_oInterface.resetFullscreenBut(), null !== s_oMenu && s_oMenu.resetFullscreenBut())
}
if (screenfull.isEnabled) screenfull.on("change", function() {
    s_bFullscreen = screenfull.isFullscreen;
    null !== s_oInterface && s_oInterface.resetFullscreenBut();
    null !== s_oMenu && s_oMenu.resetFullscreenBut()
});

function linearFunction(f, d, e, m, a) {
    return (f - d) * (a - m) / (e - d) + m
}

function CSpriteLibrary() {
    var f, d, e, m, a, c;
    this.init = function(b, k, g) {
        e = d = 0;
        m = b;
        a = k;
        c = g;
        f = {}
    };
    this.addSprite = function(b, k) {
        f.hasOwnProperty(b) || (f[b] = {
            szPath: k,
            oSprite: new Image
        }, d++)
    };
    this.getSprite = function(b) {
        return f.hasOwnProperty(b) ? f[b].oSprite : null
    };
    this._onSpritesLoaded = function() {
        a.call(c)
    };
    this._onSpriteLoaded = function() {
        m.call(c);
        ++e == d && this._onSpritesLoaded()
    };
    this.loadSprites = function() {
        for (var b in f) f[b].oSprite.oSpriteLibrary = this, f[b].oSprite.onload = function() {
                this.oSpriteLibrary._onSpriteLoaded()
            },
            f[b].oSprite.onerror = function(k) {
                var g = k.currentTarget;
                setTimeout(function() {
                    f[g.szKey].oSprite.src = f[g.szKey].szPath
                }, 500)
            }, f[b].oSprite.src = f[b].szPath
    };
    this.getNumSprites = function() {
        return d
    };
    this.loadSpriteGroup = function(b, k, g, h) {
        for (var l = 0; l < b.length; l++) f[b[l].key] = {
            szPath: b[l].path,
            oSprite: new Image
        }, d++;
        this._loadInStreamingSprite(b, k, g, h)
    };
    this._loadInStreamingSprite = function(b, k, g, h) {
        var l = b.splice(0, 1)[0].key;
        f[l].oSprite.oSpriteLibrary = this;
        f[l].oSprite.onload = function() {
            this.oSpriteLibrary._onElementOfSpriteGroupLoaded(b,
                k, g, h)
        };
        f[l].oSprite.onerror = function(p) {
            setTimeout(function() {
                f[l].oSprite.src = f[l].szPath
            }, 500)
        };
        f[l].oSprite.src = f[l].szPath
    };
    this._onElementOfSpriteGroupLoaded = function(b, k, g, h) {
        0 === b.length ? g && g.call(k, h) : s_oSpriteLibrary._loadInStreamingSprite(b, k, g, h)
    }
}
var CANVAS_WIDTH = 1360,
    CANVAS_HEIGHT = 640,
    CANVAS_WIDTH_HALF = .5 * CANVAS_WIDTH,
    CANVAS_HEIGHT_HALF = .5 * CANVAS_HEIGHT,
    EDGEBOARD_X = 250,
    EDGEBOARD_Y = 20,
    DISABLE_SOUND_MOBILE = !1,
    FONT_GAME = "TradeGothic",
    FPS = 30,
    FPS_DESKTOP = 60,
    FPS_TIME = 1 / FPS,
    ROLL_BALL_RATE = 60 / FPS,
    STATE_LOADING = 0,
    STATE_MENU = 1,
    STATE_HELP = 1,
    STATE_GAME = 3,
    ON_MOUSE_DOWN = 0,
    ON_MOUSE_UP = 1,
    ON_MOUSE_OVER = 2,
    ON_MOUSE_OUT = 3,
    ON_DRAG_START = 4,
    ON_DRAG_END = 5,
    ON_TWEEN_ENDED = 6,
    ON_BUT_NO_DOWN = 7,
    ON_BUT_YES_DOWN = 8,
    STEP_RATE = 1.5,
    TEXT_SIZE = [80, 100, 130],
    LOCAL_BEST_SCORE = 0,
    START_HAND_SWIPE_POS = {
        x: CANVAS_WIDTH_HALF,
        y: CANVAS_HEIGHT_HALF + 200
    },
    END_HAND_SWIPE_POS = [{
        x: CANVAS_WIDTH_HALF - 250,
        y: CANVAS_HEIGHT_HALF - 200
    }, {
        x: CANVAS_WIDTH_HALF,
        y: CANVAS_HEIGHT_HALF - 200
    }, {
        x: CANVAS_WIDTH_HALF + 250,
        y: CANVAS_HEIGHT_HALF - 200
    }],
    MS_TIME_SWIPE_END = 1E3,
    MS_TIME_SWIPE_START = 3E3,
    MS_TIME_FADE_HELP_TEXT = 500,
    LOCALSTORAGE_STRING = ["penalty_best_score"],
    TEXT_EXCELLENT_COLOR = ["#fff", "#5d96fe"],
    TEXT_COLOR = "#ffffff",
    TEXT_COLOR_1 = "#ff2222",
    TEXT_COLOR_STROKE = "#002a59",
    OUTLINE_WIDTH = 1.5,
    TIME_INTERVAL_STROBE =
    .2,
    PHYSICS_ACCURACY = 3,
    MOBILE_OFFSET_GLOVES_X = -100,
    BALL_VELOCITY_MULTIPLIER = 1,
    PHYSICS_STEP = 1 / (FPS * STEP_RATE),
    MS_WAIT_SHOW_GAME_OVER_PANEL = 250,
    STATE_INIT = 0,
    STATE_PLAY = 1,
    STATE_FINISH = 2,
    STATE_PAUSE = 3,
    STRIKER_GOAL_SHOOTAREA = {
        lx: -.2,
        rx: .195,
        zmin: .07,
        zmax: .1865
    },
    IDLE = 0,
    RIGHT = 1,
    LEFT = 2,
    CENTER_DOWN = 3,
    CENTER_UP = 4,
    LEFT_DOWN = 5,
    RIGHT_DOWN = 6,
    CENTER = 7,
    SIDE_LEFT = 8,
    SIDE_RIGHT = 9,
    SIDE_LEFT_UP = 10,
    SIDE_RIGHT_UP = 11,
    SIDE_LEFT_DOWN = 12,
    SIDE_RIGHT_DOWN = 13,
    LEFT_UP = 14,
    RIGHT_UP = 15,
    ANIM_GOAL_KEEPER_FAIL_EXCLUSION_LIST = [
        [LEFT_UP,
            LEFT, SIDE_LEFT_UP, SIDE_LEFT
        ],
        [LEFT_UP, LEFT, SIDE_LEFT_UP, SIDE_LEFT, CENTER_UP],
        [CENTER_UP, CENTER, SIDE_LEFT_UP, SIDE_RIGHT_UP, SIDE_LEFT, SIDE_RIGHT],
        [RIGHT_UP, RIGHT, SIDE_RIGHT_UP, SIDE_RIGHT, CENTER_UP],
        [RIGHT_UP, RIGHT, SIDE_RIGHT_UP, SIDE_RIGHT],
        [LEFT_UP, LEFT, SIDE_LEFT_UP, SIDE_LEFT, SIDE_LEFT_DOWN, LEFT_DOWN],
        [LEFT_UP, LEFT, SIDE_LEFT_UP, SIDE_LEFT, SIDE_LEFT_DOWN],
        [CENTER_UP, CENTER, SIDE_LEFT_UP, SIDE_RIGHT_UP, CENTER_DOWN, SIDE_RIGHT, SIDE_LEFT],
        [RIGHT_UP, RIGHT, SIDE_RIGHT_UP, SIDE_RIGHT, SIDE_RIGHT_DOWN],
        [RIGHT_UP,
            RIGHT, SIDE_RIGHT_UP, SIDE_RIGHT, SIDE_RIGHT_DOWN, RIGHT_DOWN
        ],
        [LEFT_DOWN, LEFT, SIDE_LEFT_DOWN],
        [LEFT_DOWN, LEFT, SIDE_LEFT_DOWN, SIDE_LEFT, SIDE_LEFT_UP],
        [CENTER_DOWN, CENTER, CENTER_UP, SIDE_RIGHT, SIDE_LEFT, SIDE_RIGHT_DOWN, SIDE_LEFT_DOWN],
        [RIGHT_DOWN, RIGHT, SIDE_RIGHT_DOWN, SIDE_RIGHT, SIDE_RIGHT_UP],
        [RIGHT_DOWN, RIGHT, SIDE_RIGHT_DOWN]
    ],
    NUM_SPRITE_PLAYER = 31,
    SPRITE_NAME_GOALKEEPER = "gk_idle gk_save_right gk_save_left gk_save_center_down gk_save_center_up gk_save_down_left gk_save_down_right gk_save_center gk_save_side_left gk_save_side_right gk_save_side_up_left gk_save_side_up_right gk_save_side_low_left gk_save_side_low_right gk_save_up_left gk_save_up_right".split(" "),
    NUM_SPRITE_GOALKEEPER = [24, 34, 34, 51, 25, 34, 34, 25, 30, 30, 30, 30, 51, 51, 36, 36],
    OFFSET_CONTAINER_GOALKEEPER = [{
        x: 0,
        y: 0
    }, {
        x: 15,
        y: -29
    }, {
        x: -360,
        y: -29
    }, {
        x: -15,
        y: -15
    }, {
        x: -20,
        y: -85
    }, {
        x: -355,
        y: 20
    }, {
        x: 21,
        y: 20
    }, {
        x: 10,
        y: -10
    }, {
        x: -140,
        y: -30
    }, {
        x: 10,
        y: -30
    }, {
        x: -120,
        y: -75
    }, {
        x: 14,
        y: -75
    }, {
        x: -140,
        y: -10
    }, {
        x: 30,
        y: -10
    }, {
        x: -430,
        y: -56
    }, {
        x: -8,
        y: -56
    }],
    ORIGIN_POINT_IMPACT_ANIMATION = [{
        x: null,
        y: null
    }, {
        x: 295.74,
        y: 3.76
    }, {
        x: -324.82,
        y: 3.76
    }, {
        x: 4.8,
        y: null
    }, {
        x: 5,
        y: null
    }, {
        x: -354,
        y: null
    }, {
        x: 334.5,
        y: null
    }, {
        x: 4.8,
        y: null
    }, {
        x: -198.77,
        y: null
    }, {
        x: 189,
        y: null
    }, {
        x: -208.4,
        y: null
    }, {
        x: 189,
        y: null
    }, {
        x: -150,
        y: null
    }, {
        x: 101.8,
        y: null
    }, {
        x: -344,
        y: -88
    }, {
        x: 315,
        y: -88
    }],
    BALL_MASS = .5,
    BALL_RADIUS = .64,
    BALL_LINEAR_DAMPING = .2,
    OBJECT, TIME_TRY_TO_SHOT_BALL_OPPONENT = .7,
    START_POS_FLAG = {
        x: 277,
        y: 268
    },
    FLAG_ADDED_POS = {
        x: 61,
        y: 69
    },
    FLAG_LIMIT_POS_X = 690,
    TOT_TEAM = 32,
    MIN_BALL_VEL_ROTATION = .1,
    TIME_RESET_AFTER_GOAL = 1E3,
    SHOOT_FRAME = 7,
    HAND_KEEPER_ANGLE_RATE = .15,
    TIME_POLE_COLLISION_RESET = 1E3,
    LIMIT_HAND_RANGE_POS = {
        x: 16.8,
        zMax: 3.1,
        zMin: -8.5
    },
    BACK_WALL_GOAL_SIZE = {
        width: 20.5,
        depth: 1,
        height: 7.5
    },
    LEFT_RIGHT_WALL_GOAL_SIZE = {
        width: .1,
        depth: 25,
        height: 7.5
    },
    UP_WALL_GOAL_SIZE = {
        width: 20.5,
        depth: 25,
        height: .1
    },
    BACK_WALL_GOAL_POSITION = {
        x: 0,
        y: 155,
        z: -2.7
    },
    GOAL_LINE_POS = {
        x: 0,
        y: BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth + 2,
        z: BACK_WALL_GOAL_POSITION.z
    },
    POSITION_BALL = {
        x: .05,
        y: 15.4,
        z: -9 + BALL_RADIUS
    },
    NUM_AREA_GOAL = {
        h: 3,
        w: 5
    },
    AREA_GOALS_ANIM = [LEFT_UP, SIDE_LEFT_UP, CENTER_UP, SIDE_RIGHT_UP, RIGHT_UP, LEFT, SIDE_LEFT, CENTER, SIDE_RIGHT, RIGHT, LEFT_DOWN, SIDE_LEFT_DOWN, CENTER_DOWN, SIDE_RIGHT_DOWN, RIGHT_DOWN],
    GOAL_SPRITE_SWAP_Y =
    GOAL_LINE_POS.y,
    GOAL_SPRITE_SWAP_Z = BACK_WALL_GOAL_POSITION.z + LEFT_RIGHT_WALL_GOAL_SIZE.height,
    BALL_OUT_Y = BACK_WALL_GOAL_POSITION.y + 3,
    BUFFER_ANIM_PLAYER = FPS,
    MS_EFFECT_ADD = 1500,
    MS_ROLLING_SCORE = 500,
    MAX_PERCENT_PROBABILITY = 100,
    GOAL_KEEPER_TOLLERANCE_LEFT = -4,
    GOAL_KEEPER_TOLLERANCE_RIGHT = 4,
    TIME_RESET_AFTER_BALL_OUT = 250,
    TIME_RESET_AFTER_SAVE = 500,
    AREA_GOAL_PROPERTIES = {
        width: 4,
        depth: 1,
        height: 2.4
    },
    FIRST_AREA_GOAL_POS = {
        x: -14 - .5 * AREA_GOAL_PROPERTIES.width,
        y: BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth +
            1.1,
        z: 3.1 - .5 * AREA_GOAL_PROPERTIES.height
    },
    GOAL_KEEPER_DEPTH_Y = BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth,
    POLE_UP_SIZE = {
        radius_top: .5,
        radius_bottom: .5,
        height: 40.5,
        segments: 10
    },
    POLE_RIGHT_LEFT_SIZE = {
        radius_top: .5,
        radius_bottom: .5,
        height: 15,
        segments: 10
    },
    COLOR_AREA_GOAL = [16711680, 65280, 255, 16776960, 16711935, 65535, 15790320, 986895, 16759705, 16777215, 5675280, 10083618, 1056896, 8392736, 9017449],
    OFFSET_FIELD_Y = 35,
    OFFSET_FIELD_X = 35,
    HIT_BALL_MAX_FORCE = 130,
    HIT_BALL_MIN_FORCE = 5,
    FORCE_RATE = .0014,
    SHOW_AREAS_GOAL = !1,
    FORCE_MULTIPLIER_AXIS = {
        x: .12,
        y: .4,
        z: .08
    },
    FORCE_MAX = .5,
    FIELD_POSITION, MAX_FORCE_Y = 66,
    MIN_FORCE_Y = 50,
    CALCULATE_PROBABILITY = [{
        xMax: -7,
        xMin: -11,
        zMax: 11,
        zMin: 8
    }, {
        xMax: -3.6,
        xMin: -7,
        zMax: 11,
        zMin: 8
    }, {
        xMax: 3.6,
        xMin: -3.6,
        zMax: 11,
        zMin: 8
    }, {
        xMax: 7,
        xMin: 3.6,
        zMax: 11,
        zMin: 8
    }, {
        xMax: 11,
        xMin: 7,
        zMax: 11,
        zMin: 8
    }, {
        xMax: -7,
        xMin: -7,
        zMax: 8,
        zMin: 5
    }, {
        xMax: -3.6,
        xMin: -7,
        zMax: 8,
        zMin: 5
    }, {
        xMax: 3.6,
        xMin: -3.6,
        zMax: 8,
        zMin: 5
    }, {
        xMax: 7,
        xMin: 3.6,
        zMax: 8,
        zMin: 5
    }, {
        xMax: 11,
        xMin: 7,
        zMax: 8,
        zMin: 5
    }, {
        xMax: -7,
        xMin: -11,
        zMax: 5,
        zMin: 0
    }, {
        xMax: -3.6,
        xMin: -7,
        zMax: 5,
        zMin: 0
    }, {
        xMax: 3.6,
        xMin: -3.6,
        zMax: 5,
        zMin: 0
    }, {
        xMax: 7,
        xMin: 3.6,
        zMax: 5,
        zMin: 0
    }, {
        xMax: 11,
        xMin: 7,
        zMax: 5,
        zMin: 0
    }],
    SHOW_3D_RENDER = !1,
    CAMERA_TEST_TRACKBALL = !1,
    CAMERA_TEST_TRANSFORM = !1,
    CANVAS_3D_OPACITY = .5,
    MOUSE_SENSIBILTY = .03,
    CAMERA_TEST_LOOK_AT = {
        x: 0,
        y: -500,
        z: -100
    },
    BALL_SCALE_FACTOR = .07,
    SHADOWN_FACTOR = 1.1,
    INTENSITY_DISPLAY_SHOCK = [{
        x: 10,
        y: 7.5,
        time: 50
    }, {
        x: 20,
        y: 9,
        time: 50
    }, {
        x: 30,
        y: 12,
        time: 50
    }, {
        x: 33,
        y: 15,
        time: 50
    }],
    FORCE_BALL_DISPLAY_SHOCK = [{
            max: 55,
            min: MIN_FORCE_Y - 1
        }, {
            max: 58,
            min: 55
        }, {
            max: 62,
            min: 58
        },
        {
            max: MAX_FORCE_Y,
            min: 62
        }
    ],
    CAMERA_POSITION = {
        x: 0,
        y: 0,
        z: -7
    },
    FOV = 15,
    NEAR = 1,
    FAR = 2E3,
    ENABLE_FULLSCREEN, ENABLE_CHECK_ORIENTATION, TIME_SWIPE, SOUNDTRACK_VOLUME_IN_GAME = .2;

function CPreloader() {
    var f, d, e, m, a, c, b, k, g;
    this._init = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
        s_oSpriteLibrary.addSprite("200x200", "./sprites/200x200.jpg");
        s_oSpriteLibrary.loadSprites();
        g = new createjs.Container;
        s_oStage.addChild(g)
    };
    this.unload = function() {
        g.removeAllChildren()
    };
    this._onImagesLoaded = function() {};
    this._onAllImagesLoaded = function() {
        this.attachSprites();
        s_oMain.preloaderReady()
    };
    this.attachSprites = function() {
        var h = new createjs.Shape;
        h.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        g.addChild(h);
        h = s_oSpriteLibrary.getSprite("200x200");
        b = createBitmap(h);
        b.regX = .5 * h.width;
        b.regY = .5 * h.height;
        b.x = CANVAS_WIDTH / 2;
        b.y = CANVAS_HEIGHT / 2 - 180;
        g.addChild(b);
        k = new createjs.Shape;
        k.graphics.beginFill("rgba(0,0,0,0.01)").drawRoundRect(b.x - 100, b.y - 100, 200, 200, 10);
        g.addChild(k);
        b.mask = k;
        h = s_oSpriteLibrary.getSprite("progress_bar");
        m = createBitmap(h);
        m.x = CANVAS_WIDTH / 2 -
            h.width / 2;
        m.y = CANVAS_HEIGHT / 2 + 50;
        g.addChild(m);
        f = h.width;
        d = h.height;
        a = new createjs.Shape;
        a.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(m.x, m.y, 1, d);
        g.addChild(a);
        m.mask = a;
        e = new createjs.Text("", "40px " + FONT_GAME, "#fff");
        e.x = CANVAS_WIDTH / 2;
        e.y = CANVAS_HEIGHT / 2 + 110;
        e.textBaseline = "alphabetic";
        e.textAlign = "center";
        g.addChild(e);
        c = new createjs.Shape;
        c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        g.addChild(c);
        createjs.Tween.get(c).to({
            alpha: 0
        }, 500).call(function() {
            createjs.Tween.removeTweens(c);
            g.removeChild(c)
        })
    };
    this.refreshLoader = function(h) {
        e.text = h + "%";
        100 === h && (s_oMain._onRemovePreloader(), e.visible = !1, m.visible = !1);
        a.graphics.clear();
        h = Math.floor(h * f / 100);
        a.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(m.x, m.y, h, d)
    };
    this._init()
}

function CMain(f) {
    var d, e = 0,
        m = 0,
        a = STATE_LOADING,
        c, b;
    this.initContainer = function() {
        var g = document.getElementById("canvas");
        s_oStage = new createjs.Stage(g);
        createjs.Touch.enable(s_oStage, !0);
        s_oStage.preventSelection = !1;
        s_bMobile = isMobile();
        !1 === s_bMobile ? (s_oStage.enableMouseOver(20), FPS = FPS_DESKTOP, FPS_TIME = 1 / FPS, PHYSICS_STEP = 1 / (FPS * STEP_RATE), ROLL_BALL_RATE = 60 / FPS) : BALL_VELOCITY_MULTIPLIER = .8;
        s_iPrevTime = (new Date).getTime();
        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate =
            FPS;
        navigator.userAgent.match(/Windows Phone/i) && (DISABLE_SOUND_MOBILE = !0);
        s_oSpriteLibrary = new CSpriteLibrary;
        seekAndDestroy() ? c = new CPreloader : window.location.href = "https://www.codethislab.com/contact-us.html";
        d = !0
    };
    this.soundLoaded = function() {
        e++;
        c.refreshLoader(Math.floor(e / m * 100))
    };
    this._initSounds = function() {
        Howler.mute(!s_bAudioActive);
        s_aSoundsInfo = [];
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "drop_bounce_grass",
            loop: !1,
            volume: 1,
            ingamename: "drop_bounce_grass"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "click",
            loop: !1,
            volume: 1,
            ingamename: "click"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "goal",
            loop: !1,
            volume: 1,
            ingamename: "goal"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "ball_saved",
            loop: !1,
            volume: 1,
            ingamename: "ball_saved"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "kick",
            loop: !1,
            volume: 1,
            ingamename: "kick"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "pole",
            loop: !1,
            volume: 1,
            ingamename: "pole"
        });
        s_aSoundsInfo.push({
            path: "./sounds/",
            filename: "soundtrack",
            loop: !0,
            volume: 1,
            ingamename: "soundtrack"
        });
        m += s_aSoundsInfo.length;
        s_aSounds = [];
        for (var g = 0; g < s_aSoundsInfo.length; g++) this.tryToLoadSound(s_aSoundsInfo[g], !1)
    };
    this.tryToLoadSound = function(g, h) {
        setTimeout(function() {
            s_aSounds[g.ingamename] = new Howl({
                src: [g.path + g.filename + ".mp3"],
                autoplay: !1,
                preload: !0,
                loop: g.loop,
                volume: g.volume,
                onload: s_oMain.soundLoaded,
                onloaderror: function(l, p) {
                    for (var n = 0; n < s_aSoundsInfo.length; n++)
                        if (0 < s_aSounds[s_aSoundsInfo[n].ingamename]._sounds.length && l === s_aSounds[s_aSoundsInfo[n].ingamename]._sounds[0]._id) {
                            s_oMain.tryToLoadSound(s_aSoundsInfo[n],
                                !0);
                            break
                        } else document.querySelector("#block_game").style.display = "none"
                },
                onplayerror: function(l) {
                    for (var p = 0; p < s_aSoundsInfo.length; p++)
                        if (l === s_aSounds[s_aSoundsInfo[p].ingamename]._sounds[0]._id) {
                            s_aSounds[s_aSoundsInfo[p].ingamename].once("unlock", function() {
                                s_aSounds[s_aSoundsInfo[p].ingamename].play();
                                "soundtrack" === s_aSoundsInfo[p].ingamename && null !== s_oGame && setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME)
                            });
                            break
                        }
                }
            })
        }, h ? 200 : 0)
    };
    this._loadImages = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded,
            this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_restart",
            "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("ball", "./sprites/ball.png");
        s_oSpriteLibrary.addSprite("but_level", "./sprites/but_level.png");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_continue", "./sprites/but_continue.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_info",
            "./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_pause", "./sprites/but_pause.png");
        s_oSpriteLibrary.addSprite("arrow_right", "./sprites/arrow_right.png");
        s_oSpriteLibrary.addSprite("arrow_left", "./sprites/arrow_left.png");
        s_oSpriteLibrary.addSprite("ball_shadow", "./sprites/ball_shadow.png");
        s_oSpriteLibrary.addSprite("start_ball", "./sprites/start_ball.png");
        s_oSpriteLibrary.addSprite("hand_touch", "./sprites/hand_touch.png");
        s_oSpriteLibrary.addSprite("cursor",
            "./sprites/cursor.png");
        s_oSpriteLibrary.addSprite("shot_left", "./sprites/shot_left.png");
        s_oSpriteLibrary.addSprite("goal", "./sprites/goal.png");
        for (var g = 0; g < NUM_SPRITE_PLAYER; g++) s_oSpriteLibrary.addSprite("player_" + g, "./sprites/player/player_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[IDLE]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[IDLE] + g, "./sprites/gk_idle/gk_idle_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[RIGHT]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[RIGHT] + g, "./sprites/gk_save_right/gk_save_right_" +
            g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[LEFT]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[LEFT] + g, "./sprites/gk_save_left/gk_save_left_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[CENTER_DOWN]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[CENTER_DOWN] + g, "./sprites/gk_save_center_down/gk_save_center_down_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[CENTER_UP]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[CENTER_UP] + g, "./sprites/gk_save_center_up/gk_save_center_up_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[LEFT_DOWN]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[LEFT_DOWN] + g, "./sprites/gk_save_down_left/gk_save_down_left_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[RIGHT_DOWN]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[RIGHT_DOWN] + g, "./sprites/gk_save_down_right/gk_save_down_right_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[CENTER]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[CENTER] + g, "./sprites/gk_save_center/gk_save_center_" + g + ".png");
        for (g =
            0; g < NUM_SPRITE_GOALKEEPER[SIDE_LEFT]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[SIDE_LEFT] + g, "./sprites/gk_save_side_left/gk_save_side_left_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[SIDE_RIGHT]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[SIDE_RIGHT] + g, "./sprites/gk_save_side_right/gk_save_side_right_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[SIDE_LEFT_UP]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[SIDE_LEFT_UP] + g, "./sprites/gk_save_side_up_left/gk_save_side_up_left_" +
            g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[SIDE_RIGHT_UP]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[SIDE_RIGHT_UP] + g, "./sprites/gk_save_side_up_right/gk_save_side_up_right_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[SIDE_LEFT_DOWN]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[SIDE_LEFT_DOWN] + g, "./sprites/gk_save_side_low_left/gk_save_side_low_left_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[SIDE_RIGHT_DOWN]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[SIDE_RIGHT_DOWN] +
            g, "./sprites/gk_save_side_low_right/gk_save_side_low_right_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[LEFT_UP]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[LEFT_UP] + g, "./sprites/gk_save_up_left/gk_save_up_left_" + g + ".png");
        for (g = 0; g < NUM_SPRITE_GOALKEEPER[RIGHT_UP]; g++) s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[RIGHT_UP] + g, "./sprites/gk_save_up_right/gk_save_up_right_" + g + ".png");
        m += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites()
    };
    this._onImagesLoaded = function() {
        e++;
        c.refreshLoader(Math.floor(e / m * 100))
    };
    this._onAllImagesLoaded = function() {};
    this.preloaderReady = function() {
        this._loadImages();
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || this._initSounds();
        d = !0
    };
    this._onRemovePreloader = function() {
        c.unload();
        try {
            saveItem("ls_available", "ok"), s_iLastLevel = this.getSavedLevel()
        } catch (g) {
            s_bStorageAvailable = !1
        }
        s_oSoundTrack = playSound("soundtrack", 1, !0);
        this.gotoMenu()
    };
    this.gotoMenu = function() {
        new CMenu;
        a = STATE_MENU
    };
    this.gotoGame = function() {
        b = new CGame(k);
        a = STATE_GAME
    };
    this.gotoHelp = function() {
        new CHelp;
        a = STATE_HELP
    };
    this.stopUpdate = function() {
        d = !1;
        createjs.Ticker.paused = !0;
        $("#block_game").css("display", "block");
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || Howler.mute(!0)
    };
    this.startUpdate = function() {
        s_iPrevTime = (new Date).getTime();
        d = !0;
        createjs.Ticker.paused = !1;
        $("#block_game").css("display", "none");
        (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) && s_bAudioActive && Howler.mute(!1)
    };
    this._update = function(g) {
        if (!1 !== d) {
            var h = (new Date).getTime();
            s_iTimeElaps = h - s_iPrevTime;
            s_iCntTime += s_iTimeElaps;
            s_iCntFps++;
            s_iPrevTime = h;
            1E3 <= s_iCntTime && (s_iCurFps = s_iCntFps, s_iCntTime -= 1E3, s_iCntFps = 0);
            a === STATE_GAME && b.update();
            s_oStage.update(g)
        }
    };
    s_oMain = this;
    var k = f;
    ENABLE_CHECK_ORIENTATION = f.check_orientation;
    ENABLE_FULLSCREEN = f.fullscreen;
    s_bAudioActive = f.audio_enable_on_startup;
    this.initContainer()
}
var s_bMobile, s_bAudioActive = !1,
    s_bFullscreen = !1,
    s_iCntTime = 0,
    s_iTimeElaps = 0,
    s_iPrevTime = 0,
    s_iCntFps = 0,
    s_iCurFps = 0,
    s_oPhysicsController, s_iCanvasResizeHeight, s_iCanvasResizeWidth, s_iCanvasOffsetHeight, s_iCanvasOffsetWidth, s_iAdsLevel = 1,
    s_iBestScore = 0,
    s_oDrawLayer, s_oStage, s_oMain, s_oSpriteLibrary, s_oSoundTrack = null,
    s_bStorageAvailable = !0,
    s_aSounds;

function CTextButton(f, d, e, m, a, c, b, k) {
    var g, h, l, p, n, q, t, r, v, x, y, I;
    this._init = function(E, N, R, T, M, G, H, S) {
        g = !1;
        p = [];
        n = [];
        I = createBitmap(R);
        h = R.width;
        l = R.height;
        var J = Math.ceil(H / 20);
        x = new createjs.Text(T, H + "px " + M, "#000000");
        var ca = x.getBounds();
        x.textAlign = "center";
        x.lineWidth = .9 * h;
        x.textBaseline = "alphabetic";
        x.x = R.width / 2 + J;
        x.y = Math.floor(R.height / 2) + ca.height / 3 + J;
        y = new createjs.Text(T, H + "px " + M, G);
        y.textAlign = "center";
        y.textBaseline = "alphabetic";
        y.lineWidth = .9 * h;
        y.x = R.width / 2;
        y.y = Math.floor(R.height /
            2) + ca.height / 3;
        v = new createjs.Container;
        v.x = E;
        v.y = N;
        v.regX = R.width / 2;
        v.regY = R.height / 2;
        s_bMobile || (v.cursor = "pointer");
        v.addChild(I, x, y);
        !1 !== S && s_oStage.addChild(v);
        this._initListener()
    };
    this.unload = function() {
        v.off("mousedown", q);
        v.off("pressup", t);
        s_oStage.removeChild(v)
    };
    this.setVisible = function(E) {
        v.visible = E
    };
    this.setAlign = function(E) {
        y.textAlign = E;
        x.textAlign = E
    };
    this.enable = function() {
        g = !1;
        I.filters = [];
        I.cache(0, 0, h, l)
    };
    this.disable = function() {
        g = !0;
        var E = (new createjs.ColorMatrix).adjustSaturation(-100).adjustBrightness(40);
        I.filters = [new createjs.ColorMatrixFilter(E)];
        I.cache(0, 0, h, l)
    };
    this._initListener = function() {
        q = v.on("mousedown", this.buttonDown);
        t = v.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function(E, N, R) {
        p[E] = N;
        n[E] = R
    };
    this.addEventListenerWithParams = function(E, N, R, T) {
        p[E] = N;
        n[E] = R;
        r = T
    };
    this.buttonRelease = function() {
        g || (playSound("click", 1, !1), v.scaleX = 1, v.scaleY = 1, p[ON_MOUSE_UP] && p[ON_MOUSE_UP].call(n[ON_MOUSE_UP], r))
    };
    this.buttonDown = function() {
        g || (v.scaleX = .9, v.scaleY = .9, p[ON_MOUSE_DOWN] && p[ON_MOUSE_DOWN].call(n[ON_MOUSE_DOWN]))
    };
    this.setPosition = function(E, N) {
        v.x = E;
        v.y = N
    };
    this.changeText = function(E) {
        y.text = E;
        x.text = E
    };
    this.setX = function(E) {
        v.x = E
    };
    this.setY = function(E) {
        v.y = E
    };
    this.getButtonImage = function() {
        return v
    };
    this.getX = function() {
        return v.x
    };
    this.getY = function() {
        return v.y
    };
    this.getSprite = function() {
        return v
    };
    this._init(f, d, e, m, a, c, b, k);
    return this
}

function CToggle(f, d, e, m, a) {
    var c, b, k, g, h, l, p;
    this._init = function(n, q, t, r, v) {
        p = void 0 !== v ? v : s_oStage;
        b = [];
        k = [];
        v = new createjs.SpriteSheet({
            images: [t],
            frames: {
                width: t.width / 2,
                height: t.height,
                regX: t.width / 2 / 2,
                regY: t.height / 2
            },
            animations: {
                state_true: [0],
                state_false: [1]
            }
        });
        c = r;
        l = createSprite(v, "state_" + c, t.width / 2 / 2, t.height / 2, t.width / 2, t.height);
        l.x = n;
        l.y = q;
        l.stop();
        s_bMobile || (l.cursor = "pointer");
        p.addChild(l);
        this._initListener()
    };
    this.unload = function() {
        l.off("mousedown", g);
        l.off("pressup", h);
        p.removeChild(l)
    };
    this._initListener = function() {
        g = l.on("mousedown", this.buttonDown);
        h = l.on("pressup", this.buttonRelease)
    };
    this.addEventListener = function(n, q, t) {
        b[n] = q;
        k[n] = t
    };
    this.setCursorType = function(n) {
        l.cursor = n
    };
    this.setActive = function(n) {
        c = n;
        l.gotoAndStop("state_" + c)
    };
    this.buttonRelease = function() {
        l.scaleX = 1;
        l.scaleY = 1;
        playSound("click", 1, !1);
        c = !c;
        l.gotoAndStop("state_" + c);
        b[ON_MOUSE_UP] && b[ON_MOUSE_UP].call(k[ON_MOUSE_UP], c)
    };
    this.buttonDown = function() {
        l.scaleX = .9;
        l.scaleY = .9;
        b[ON_MOUSE_DOWN] && b[ON_MOUSE_DOWN].call(k[ON_MOUSE_DOWN])
    };
    this.setPosition = function(n, q) {
        l.x = n;
        l.y = q
    };
    this._init(f, d, e, m, a)
}

function CGfxButton(f, d, e, m) {
    var a, c, b, k, g, h, l, p, n = !1;
    this._init = function(r, v, x) {
        a = [];
        c = [];
        k = [];
        b = createBitmap(x);
        b.x = r;
        b.y = v;
        h = g = 1;
        b.regX = x.width / 2;
        b.regY = x.height / 2;
        s_bMobile || (b.cursor = "pointer");
        q.addChild(b);
        this._initListener()
    };
    this.unload = function() {
        createjs.Tween.removeTweens(b);
        b.off("mousedown", l);
        b.off("pressup", p);
        q.removeChild(b)
    };
    this.setVisible = function(r) {
        b.visible = r
    };
    this.setCursorType = function(r) {
        b.cursor = r
    };
    this._initListener = function() {
        l = b.on("mousedown", this.buttonDown);
        p = b.on("pressup",
            this.buttonRelease)
    };
    this.addEventListener = function(r, v, x) {
        a[r] = v;
        c[r] = x
    };
    this.addEventListenerWithParams = function(r, v, x, y) {
        a[r] = v;
        c[r] = x;
        k[r] = y
    };
    this.buttonRelease = function() {
        n || (b.scaleX = 0 < g ? 1 : -1, b.scaleY = 1, playSound("click", 1, !1), a[ON_MOUSE_UP] && a[ON_MOUSE_UP].call(c[ON_MOUSE_UP], k[ON_MOUSE_UP]))
    };
    this.buttonDown = function() {
        n || (b.scaleX = 0 < g ? .9 : -.9, b.scaleY = .9, a[ON_MOUSE_DOWN] && a[ON_MOUSE_DOWN].call(c[ON_MOUSE_DOWN], k[ON_MOUSE_DOWN]))
    };
    this.rotation = function(r) {
        b.rotation = r
    };
    this.getButton = function() {
        return b
    };
    this.setPosition = function(r, v) {
        b.x = r;
        b.y = v
    };
    this.setX = function(r) {
        b.x = r
    };
    this.setY = function(r) {
        b.y = r
    };
    this.getButtonImage = function() {
        return b
    };
    this.block = function(r) {
        n = r;
        b.scaleX = g;
        b.scaleY = h
    };
    this.setScaleX = function(r) {
        g = b.scaleX = r
    };
    this.getX = function() {
        return b.x
    };
    this.getY = function() {
        return b.y
    };
    this.pulseAnimation = function() {
        createjs.Tween.get(b, {
            loop: -1
        }).to({
            scaleX: .9 * g,
            scaleY: .9 * h
        }, 850, createjs.Ease.quadOut).to({
            scaleX: g,
            scaleY: h
        }, 650, createjs.Ease.quadIn)
    };
    this.trebleAnimation = function() {
        createjs.Tween.get(b).to({
                rotation: 5
            },
            75, createjs.Ease.quadOut).to({
            rotation: -5
        }, 140, createjs.Ease.quadIn).to({
            rotation: 0
        }, 75, createjs.Ease.quadIn).wait(750).call(function() {
            t.trebleAnimation()
        })
    };
    this.removeAllTweens = function() {
        createjs.Tween.removeTweens(b)
    };
    var q = void 0 !== m ? m : s_oStage;
    this._init(f, d, e);
    var t = this;
    return this
}

function CMenu() {
    var f, d, e, m, a, c, b, k, g, h, l, p, n, q, t = null,
        r = null;
    this._init = function() {
        g = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
        s_oStage.addChild(g);
        var v = s_oSpriteLibrary.getSprite("but_play");
        a = CANVAS_WIDTH / 2 + 110;
        c = CANVAS_HEIGHT - 130;
        h = new CGfxButton(a, c, v);
        h.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        h.pulseAnimation();
        s_iBestScore = getItem(LOCALSTORAGE_STRING[LOCAL_BEST_SCORE]);
        null === s_iBestScore && (s_iBestScore = 0);
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) v = s_oSpriteLibrary.getSprite("audio_icon"),
            b = CANVAS_WIDTH - v.height / 2 - 10, k = v.height / 2 + 10, n = new CToggle(b, k, v, s_bAudioActive), n.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        v = window.document;
        var x = v.documentElement;
        t = x.requestFullscreen || x.mozRequestFullScreen || x.webkitRequestFullScreen || x.msRequestFullscreen;
        r = v.exitFullscreen || v.mozCancelFullScreen || v.webkitExitFullscreen || v.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (t = !1);
        v = s_oSpriteLibrary.getSprite("but_info");
        e = v.height / 2 + 10;
        m = v.height / 2 + 10;
        l = new CGfxButton(e, m, v, s_oStage);
        l.addEventListener(ON_MOUSE_UP,
            this._onButInfoRelease, this);
        t && screenfull.isEnabled && (v = s_oSpriteLibrary.getSprite("but_fullscreen"), f = e + v.width / 2 + 10, d = v.height / 2 + 10, q = new CToggle(f, d, v, s_bFullscreen, s_oStage), q.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this));
        p = new createjs.Shape;
        p.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(p);
        createjs.Tween.get(p).to({
            alpha: 0
        }, 1E3).call(function() {
            p.visible = !1
        });
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
    };
    this.refreshButtonPos = function(v,
        x) {
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || n.setPosition(b - v, x + k);
        t && screenfull.isEnabled && q.setPosition(f + v, d + x);
        l.setPosition(e + v, m + x)
    };
    this.unload = function() {
        h.unload();
        h = null;
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) n.unload(), n = null;
        t && screenfull.isEnabled && q.unload();
        s_oStage.removeAllChildren();
        s_oMenu = null
    };
    this._onButPlayRelease = function() {
        this.unload();
        s_oMain.gotoGame()
        console.log("PLAY")
        s_bFullscreen ? r.call(window.document) : t.call(window.document.documentElement);
        sizeHandler()

    };
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this._onButInfoRelease =
        function() {
            new CCreditsPanel
        };
    this.resetFullscreenBut = function() {
        t && screenfull.isEnabled && q.setActive(s_bFullscreen)
    };
    this._onFullscreenRelease = function() {
        s_bFullscreen ? r.call(window.document) : t.call(window.document.documentElement);
        sizeHandler()
    };
    s_oMenu = this;
    this._init()
}
var s_oMenu = null;

function CGame(f) {
    var d, e, m, a, c, b = null,
        k, g, h, l, p, n = null,
        q, t, r = !1,
        v = !1,
        x = !1,
        y = !1,
        I = !1,
        E = !1,
        N = !1,
        R = !1,
        T = !1,
        M, G, H = 0,
        S = 0,
        J = 0,
        ca, O, Y, K, z, C;
    this._pGoalSize;
    var u = STATE_INIT,
        B = null;
    this._init = function() {
        $(s_oMain).trigger("start_session");
        this.pause(!0);
        $(s_oMain).trigger("start_level", 1);
        M = 0;
        K = 1;
        z = [];
        k = new createjs.Container;
        s_oStage.addChild(k);
        e = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        e.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        k.addChild(e);
        m = new CScenario(1);
        B = SHOW_3D_RENDER ? camera : createOrthoGraphicCamera();
        var w = s_oSpriteLibrary.getSprite("goal");
        _pGoalSize = {
            w: w.width - 15,
            h: w.height - 7.5
        };
        t = new CGoal(291, 28, w, k);
        b = new CGoalKeeper(CANVAS_WIDTH_HALF - 100, CANVAS_HEIGHT_HALF - 225, k);
        z.push(b);
        w = s_oSpriteLibrary.getSprite("ball");
        a = new CBall(0, 0, w, m.ballBody(), k);
        z.push(a);
        this.ballPosition();
        a.setVisible(!1);
        Y = MS_TIME_SWIPE_START;
        c = new CStartBall(CANVAS_WIDTH_HALF + 55, CANVAS_HEIGHT_HALF + 168, k);
        p = new CPlayer(CANVAS_WIDTH_HALF - 150, CANVAS_HEIGHT_HALF - 320, k);
        p.setVisible(!1);
        w = "cursor";
        s_bMobile ? (w = "hand_touch",
            TIME_SWIPE = 650) : TIME_SWIPE = 500;
        q = new CHandSwipeAnim(START_HAND_SWIPE_POS, END_HAND_SWIPE_POS, s_oSpriteLibrary.getSprite(w), s_oStage);
        q.animAllSwipe();
        resizeCanvas3D();
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
        d = new CInterface;
        d.refreshTextScoreBoard(0, 0, 0, !1);
        d.refreshLaunchBoard(H, NUM_OF_PENALTY);
        C = new CANNON.Vec3(0, 0, 0);
        this.onExitHelp()
    };
    this.createControl = function() {
        SHOW_3D_RENDER ? (window.addEventListener("mousedown", this.onMouseDown), window.addEventListener("mousemove", this.onPressMove),
            window.addEventListener("mouseup", this.onPressUp)) : (l = new createjs.Shape, l.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT), k.addChild(l), l.on("mousedown", this.onMouseDown), l.on("pressmove", this.onPressMove), l.on("pressup", this.onPressUp))
    };
    this.sortDepth = function(w, A) {
        w.getDepthPos() > A.getDepthPos() ? k.getChildIndex(w.getObject()) > k.getChildIndex(A.getObject()) && k.swapChildren(w.getObject(), A.getObject()) : w.getDepthPos() < A.getDepthPos() && k.getChildIndex(A.getObject()) >
            k.getChildIndex(w.getObject()) && k.swapChildren(A.getObject(), w.getObject())
    };
    this.onExitHelp = function() {
        this.createControl();
        this.pause(!1)
    };
    this.poleCollide = function() {
        O = TIME_POLE_COLLISION_RESET;
        T = !0;
        playSound("pole", .4, !1)
    };
    this.fieldCollision = function() {
        if (null === n && v && (n = playSound("drop_bounce_grass", .3, !1), null !== n)) n.on("end", function() {
            n = null
        })
    };
    this.ballPosition = function() {
        var w = m.ballBody(),
            A = this.convert3dPosTo2dScreen(w.position, B),
            F = A.z * (BALL_SCALE_FACTOR - a.getStartScale()) + a.getStartScale();
        a.setPosition(A.x, A.y);
        a.scale(F);
        this.refreshShadowCast(a, w, F)
    };
    this.onMouseDown = function(w) {
        if (!v) {
            Y = MS_TIME_SWIPE_START;
            q.removeTweens();
            q.setVisible(!1);
            var A = w.stageX,
                F = w.stageY;
            SHOW_3D_RENDER && (A = w.x, F = w.y);
            g = {
                x: A / s_fInverseScaling,
                y: F / s_fInverseScaling
            };
            h = {
                x: A / s_fInverseScaling,
                y: F / s_fInverseScaling
            };
            console.log(g)
        }
    };
    this.onPressMove = function(w) {
        var A = w.stageX,
            F = w.stageY;
        SHOW_3D_RENDER && (A = w.x, F = w.y);
        h = {
            x: A / s_fInverseScaling,
            y: F / s_fInverseScaling
        };
        J += s_iTimeElaps
    };
    this.onPressUp = function() {
        //HERE
        if (!(v ||
                null === h || g.y < h.y || 0 === h.x && 0 === h.y)) {
            var w = Math.ceil(distanceV2(g, h)) * FORCE_RATE;
            w > FORCE_MAX && (w = FORCE_MAX);
            if (J > TIME_SWIPE) J = 0;
            else {
                var A = new CVector2(g.x - h.x, g.y - h.y);
                A.scalarProduct(w);
                w = A.length();
                w > HIT_BALL_MIN_FORCE && (w > HIT_BALL_MAX_FORCE && (A.normalize(), A.scalarProduct(HIT_BALL_MAX_FORCE)), I = !0, p.setVisible(!0), w = J / 10, w > MAX_FORCE_Y ? w = MAX_FORCE_Y : w < MIN_FORCE_Y && (w = MIN_FORCE_Y), C.set(-A.getX() * FORCE_MULTIPLIER_AXIS.x, w, A.getY() * FORCE_MULTIPLIER_AXIS.z), R = s_oGame.goalProbability());
                h.x = 0;
                h.y =
                    0
            }
        }
    };
    this.refreshShadowCast = function(w, A, F) {
        var D = m.getFieldBody();
        if (A.position.z < D.position.z) w.scaleShadow(0);
        else {
            var Q = this.convert3dPosTo2dScreen({
                x: A.position.x,
                y: A.position.y,
                z: D.position.z
            }, B);
            A = (A.position.z - BALL_RADIUS) * (D.position.z - SHADOWN_FACTOR - D.position.z) + D.position.z;
            F *= A;
            w.scaleShadow(F);
            0 > F || (w.setAlphaByHeight(A), w.setPositionShadow(Q.x, Q.y))
        }
    };
    this.addScore = function(w, A) {
        M += w;
        d.refreshTextScoreBoard(M, K.toFixed(1), A, !0)
    };
    this.getLevel = function() {
        return 1
    };
    this.unload = function() {
        s_oStage.removeAllChildren();
        d.unload();
        l.removeAllEventListeners();
        m.destroyWorld();
        m = null
    };
    this.resetValues = function() {
        M = 0;
        d.refreshTextScoreBoard(0, 0, 0, !1);
        H = 0;
        K = 1;
        d.refreshLaunchBoard(H, NUM_OF_PENALTY)
    };
    this.wallSoundCollision = function() {
        playSound("ball_collision", 1, !1)
    };
    this.areaGoal = function() {
        r || N || (R ? (r = !0, ca = TIME_RESET_AFTER_GOAL, this.textGoal(), this.calculateScore(), playSound("goal", 1, !1)) : this.goalKeeperSave())
    };
    this.goalKeeperSave = function() {
        N = !0;
        ca = TIME_RESET_AFTER_SAVE;
        d.createAnimText(TEXT_SAVED, 80, !1, TEXT_COLOR_1,
            TEXT_COLOR_STROKE);
        playSound("ball_saved", 1, !1);
        this.rejectBall();
        K = 1;
        S = 0
    };
    this.rejectBall = function() {
        a.getPhysics().velocity.negate(a.getPhysics().velocity);
        switch (G) {
            case 12:
                a.getPhysics().velocity = a.getPhysics().velocity.vadd(new CANNON.Vec3(.4 * a.getPhysics().velocity.x, .4 * a.getPhysics().velocity.y, .4 * a.getPhysics().velocity.z));
                break;
            default:
                a.getPhysics().velocity.vsub(new CANNON.Vec3(0, 50, 0))
        }
    };
    this.calculateScore = function() {
        var w = MAX_PERCENT_PROBABILITY - (MAX_PERCENT_PROBABILITY - AREAS_INFO[G].probability);
        this.addScore(w * K, w);
        K += MULTIPLIER_STEP
    };
    this.goalProbability = function() {
        G = -1;
        this.calculateAreaGoal(C);
        if (-1 === G) return !1;
        for (var w = [], A = 0; A < MAX_PERCENT_PROBABILITY; A++) w.push(!1);
        for (A = 0; A < AREAS_INFO[G].probability; A++) w[A] = !0;
        return w[Math.floor(Math.random() * w.length)]
    };
    this.addImpulseToBall = function(w) {
        if (!v && u === STATE_PLAY) {
            var A = m.ballBody();
            m.addImpulse(A, w);
            m.setElementAngularVelocity(A, {
                x: 0,
                y: 0,
                z: 0
            });
            v = !0;
            a.setVisible(!0);
            c.setVisible(!1);
            this.chooseDirectionGoalKeeper(w);
            playSound("kick",
                1, !1)
        }
    };
    this.chooseDirectionGoalKeeper = function() {
        var w = this.predictBallGoalPos(C);
        if (R) this.chooseWrongDirGK();
        else {
            var A = G;
            75 > w.y && (14 === G && (A = 9), 10 === G && (A = 5));
            console.log("iAnimIndex " + A);
            b.runAnimAndShift(AREA_GOALS_ANIM[A], w)
        }
        E = !0
    };
    this.chooseWrongDirGK = function() {
        for (var w = ANIM_GOAL_KEEPER_FAIL_EXCLUSION_LIST[G], A = [], F = 1; F <= AREA_GOALS_ANIM.length; F++) - 1 === w.indexOf(F) && A.push(F);
        b.runAnim(A[Math.floor(Math.random() * A.length)])
    };
    this.predictBallGoalPos = function(w) {
        var A = w.z / w.y;
        return {
            x: linearFunction(w.x /
                w.y, STRIKER_GOAL_SHOOTAREA.lx, STRIKER_GOAL_SHOOTAREA.rx, -_pGoalSize.w / 2, _pGoalSize.w / 2),
            y: -_pGoalSize.h / Math.pow(STRIKER_GOAL_SHOOTAREA.zmax, 2) * A * A + _pGoalSize.h / 2
        }
    };
    this.calculateAreaGoal = function(w) {
        G = -1;
        w = this.predictBallGoalPos(w);
        var A = -_pGoalSize.w / 2,
            F = -_pGoalSize.h / 2;
        A = linearFunction(w.x, A, A + _pGoalSize.w, 0, NUM_AREA_GOAL.w);
        A = Math.floor(A);
        A > NUM_AREA_GOAL.w - 1 ? A = NUM_AREA_GOAL.w - 1 : 0 > A && (A = 0);
        w = linearFunction(w.y, F, F + _pGoalSize.h, 0, NUM_AREA_GOAL.h);
        w = Math.floor(w);
        w > NUM_AREA_GOAL.h - 1 ? w = NUM_AREA_GOAL.h -
            1 : 0 > w && (w = 0);
        return G = w * NUM_AREA_GOAL.w + A
    };
    this.pause = function(w) {
        u = w ? STATE_PAUSE : STATE_PLAY;
        createjs.Ticker.paused = w
    };
    this.onExit = function() {
        this.unload();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        setVolume("soundtrack", 1);
        s_oMain.gotoMenu()
    };
    this.restartLevel = function() {
        ;
        this.resetValues();
        this.resetScene();
        u = STATE_PLAY;
        this.startOpponentShot();
        $(s_oMain).trigger("restart_level", 1)
    };
    this.resetBallPosition = function() {
        var w = m.ballBody();
        w.position.set(POSITION_BALL.x,
            POSITION_BALL.y, POSITION_BALL.z);
        m.setElementVelocity(w, {
            x: 0,
            y: 0,
            z: 0
        });
        m.setElementAngularVelocity(w, {
            x: 0,
            y: 0,
            z: 0
        });
        a.fadeAnimation(1, 500, 0);
        a.setVisible(!1);
        c.setVisible(!0);
        c.setAlpha(0);
        c.fadeAnim(1, 500, 0)
    };
    this.ballFadeForReset = function() {
        N && r && x && !y && (a.fadeAnimation(0, 300, 10), y = !0)
    };
    this._updateInit = function() {
        m.update();
        this._updateBall2DPosition();
        u = STATE_PLAY
    };
    this.convert2dScreenPosTo3d = function(w) {
        w = new THREE.Vector3(w.x / s_iCanvasResizeWidth * 2 - 1, 2 * -(w.y / s_iCanvasResizeHeight) + 1, -1);
        w.unproject(B);
        w.sub(B.position);
        w.normalize();
        w.multiply(new THREE.Vector3(0, 1, 0));
        return w
    };
    this.convert3dPosTo2dScreen = function(w, A) {
        var F = (new THREE.Vector3(w.x, w.y, w.z)).project(A),
            D = .5 * Math.floor(s_iCanvasResizeWidth),
            Q = .5 * Math.floor(s_iCanvasResizeHeight);
        F.x = (F.x * D + D) * s_fInverseScaling;
        F.y = (-(F.y * Q) + Q) * s_fInverseScaling;
        return F
    };
    this.timeReset = function() {
        0 < ca ? ca -= s_iTimeElaps : this.endTurn()
    };
    this.restartGame = function() {
        this.resetValues();
        this.resetScene();
        u = STATE_PLAY;
        v = !1
    };
    this.endTurn = function() {
        H++;
        d.refreshLaunchBoard(H, NUM_OF_PENALTY);
        H < NUM_OF_PENALTY ? (this.resetScene(), v = !1, Y = MS_TIME_SWIPE_START) : (u = STATE_FINISH, M > s_iBestScore && (s_iBestScore = Math.floor(M), saveItem(LOCALSTORAGE_STRING[LOCAL_BEST_SCORE], Math.floor(M))), d.createWinPanel(Math.floor(M)), $(s_oMain).trigger("end_level", 1))
    };
    this.textGoal = function() {
        if (S < TEXT_CONGRATULATION.length) {
            var w = !1;
            S >= TEXT_CONGRATULATION.length - 1 && (w = !0);
            d.createAnimText(TEXT_CONGRATULATION[S], TEXT_SIZE[S], w, TEXT_COLOR, TEXT_COLOR_STROKE);
            S++
        } else {
            w = !1;
            var A =
                Math.floor(Math.random() * (TEXT_CONGRATULATION.length - 1)) + 1;
            A >= TEXT_CONGRATULATION.length - 1 && (w = !0);
            d.createAnimText(TEXT_CONGRATULATION[A], TEXT_SIZE[A], w, TEXT_COLOR, TEXT_COLOR_STROKE)
        }
    };
    this.goalAnimation = function(w) {
        w > FORCE_BALL_DISPLAY_SHOCK[0].min && w < FORCE_BALL_DISPLAY_SHOCK[0].max ? this.displayShock(INTENSITY_DISPLAY_SHOCK[0].time, INTENSITY_DISPLAY_SHOCK[0].x, INTENSITY_DISPLAY_SHOCK[0].y) : w > FORCE_BALL_DISPLAY_SHOCK[1].min && w < FORCE_BALL_DISPLAY_SHOCK[1].max ? this.displayShock(INTENSITY_DISPLAY_SHOCK[1].time,
            INTENSITY_DISPLAY_SHOCK[1].x, INTENSITY_DISPLAY_SHOCK[1].y) : w > FORCE_BALL_DISPLAY_SHOCK[2].min && w < FORCE_BALL_DISPLAY_SHOCK[2].max ? this.displayShock(INTENSITY_DISPLAY_SHOCK[2].time, INTENSITY_DISPLAY_SHOCK[2].x, INTENSITY_DISPLAY_SHOCK[2].y) : w > FORCE_BALL_DISPLAY_SHOCK[3].min && this.displayShock(INTENSITY_DISPLAY_SHOCK[3].time, INTENSITY_DISPLAY_SHOCK[3].x, INTENSITY_DISPLAY_SHOCK[3].y)
    };
    this.displayShock = function(w, A, F) {
        createjs.Tween.get(k).to({
                x: Math.round(Math.random() * A),
                y: Math.round(Math.random() * F)
            },
            w).call(function() {
            createjs.Tween.get(k).to({
                x: Math.round(Math.random() * A * .8),
                y: -Math.round(Math.random() * F * .8)
            }, w).call(function() {
                createjs.Tween.get(k).to({
                    x: Math.round(Math.random() * A * .6),
                    y: Math.round(Math.random() * F * .6)
                }, w).call(function() {
                    createjs.Tween.get(k).to({
                        x: Math.round(Math.random() * A * .4),
                        y: -Math.round(Math.random() * F * .4)
                    }, w).call(function() {
                        createjs.Tween.get(k).to({
                            x: Math.round(Math.random() * A * .2),
                            y: Math.round(Math.random() * F * .2)
                        }, w).call(function() {
                            createjs.Tween.get(k).to({
                                    y: 0,
                                    x: 0
                                },
                                w)
                        })
                    })
                })
            })
        })
    };
    this.resetScene = function() {
        y = T = R = N = x = r = !1;
        b.setAlpha(0);
        b.fadeAnimation(1);
        b.runAnim(IDLE);
        this.resetBallPosition();
        this.sortDepth(a, t)
    };
    this._onEnd = function() {
        this.onExit()
    };
    this.swapChildrenIndex = function() {
        for (var w = 0; w < z.length - 1; w++)
            for (var A = w + 1; A < z.length; A++) z[w].getObject().visible && z[A].getObject().visible && this.sortDepth(z[w], z[A])
    };
    this.ballOut = function() {
        if (!x && !r && !N) {
            var w = a.getPhysics().position;
            if (w.y > BALL_OUT_Y || w.x > BACK_WALL_GOAL_SIZE.width || w.x < -BACK_WALL_GOAL_SIZE.width) x = !0, ca = TIME_RESET_AFTER_BALL_OUT, d.createAnimText(TEXT_BALL_OUT, 90, !1, TEXT_COLOR_1, TEXT_COLOR_STROKE), playSound("ball_saved", 1, !1), K = 1, S = 0
        }
    };
    this.animPlayer = function() {
        I ? (I = p.animPlayer(), p.getFrame() === SHOOT_FRAME && (this.addImpulseToBall({
            x: C.x,
            y: C.y,
            z: C.z
        }), J = 0, this.goalAnimation(C.y), d.unloadHelpText())) : p.setVisible(!1)
    };
    this.animGoalKeeper = function() {
        v ? E && (E = b.update(), E || (b.viewFrame(b.getAnimArray(), b.getAnimArray().length - 1), b.hideFrame(b.getAnimArray(), 0), b.fadeAnimation(0))) : b.update()
    };
    this.resetPoleCollision = function() {
        0 < O ? O -= s_iTimeElaps : r && N || (d.createAnimText(TEXT_BALL_OUT, 80, !1, TEXT_COLOR_1, TEXT_COLOR_STROKE), K = 1, S = 0, playSound("ball_saved", 1, !1), this.endTurn(), O = TIME_POLE_COLLISION_RESET)
    };
    this.handSwipeAnim = function() {
        q.isAnimate() || v || (0 < Y ? Y -= s_iTimeElaps : (q.animAllSwipe(), q.setVisible(!0), Y = MS_TIME_SWIPE_START))
    };
    this.swapGoal = function() {
        a.getPhysics().position.z > GOAL_SPRITE_SWAP_Z && this.sortDepth(a, t)
    };
    this._updatePlay = function() {
        for (var w = 0; w < PHYSICS_ACCURACY; w++) m.update();
        this.ballOut();
        r || x || N ? this.timeReset() : T && this.resetPoleCollision();
        this.animGoalKeeper();
        this.animPlayer();
        this._updateBall2DPosition();
        this.handSwipeAnim();
        this.swapChildrenIndex();
        this.swapGoal()
    };
    this.update = function() {
        switch (u) {
            case STATE_INIT:
                this._updateInit();
                break;
            case STATE_PLAY:
                this._updatePlay()
        }
    };
    this._updateBall2DPosition = function() {
        this.ballPosition();
        a.rolls();
        B.updateProjectionMatrix();
        B.updateMatrixWorld()
    };
    s_oGame = this;
    AREAS_INFO = f.area_goal;
    NUM_OF_PENALTY = f.num_of_penalty;
    MULTIPLIER_STEP =
        f.multiplier_step;
    NUM_LEVEL_FOR_ADS = f.num_levels_for_ads;
    this._init()
}
var s_oGame;

function CInterface() {
    var f, d, e, m, a, c, b, k, g, h, l, p, n = null,
        q, t, r, v, x, y = null,
        I = null;
    this._init = function() {
        var E = s_oSpriteLibrary.getSprite("but_exit");
        e = CANVAS_WIDTH - E.height / 2 - 10;
        m = E.height / 2 + 10;
        g = new CGfxButton(e, m, E);
        g.addEventListener(ON_MOUSE_UP, this._onExit, this);
        E = s_oSpriteLibrary.getSprite("but_pause");
        f = e - E.height - 10;
        d = m;
        h = new CGfxButton(f, d, E);
        h.addEventListener(ON_MOUSE_UP, this.onButPauseRelease, this);
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) E = s_oSpriteLibrary.getSprite("audio_icon"),
            b = f - E.height - 10, k = m, p = new CToggle(b, k, E, s_bAudioActive), p.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        E = window.document;
        var N = E.documentElement;
        y = N.requestFullscreen || N.mozRequestFullScreen || N.webkitRequestFullScreen || N.msRequestFullscreen;
        I = E.exitFullscreen || E.mozCancelFullScreen || E.webkitExitFullscreen || E.msExitFullscreen;
        !1 === ENABLE_FULLSCREEN && (y = !1);
        y && screenfull.isEnabled && (E = s_oSpriteLibrary.getSprite("but_fullscreen"), a = E.width / 4 + 10, c = E.height / 2 + 10, l = new CToggle(a, c, E, s_bFullscreen,
            s_oStage), l.addEventListener(ON_MOUSE_UP, this._onFullscreen, this));
        t = new CScoreBoard(s_oStage);
        r = new CLaunchBoard(s_oStage);
        v = new CHelpText(s_oStage);
        v.fadeAnim(1, null);
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY)
    };
    this.refreshButtonPos = function(E, N) {
        g.setPosition(e - E, N + m);
        h.setPosition(f - E, N + d);
        !1 !== DISABLE_SOUND_MOBILE && !1 !== s_bMobile || p.setPosition(b - E, N + k);
        var R = t.getStartPosScore();
        t.setPosScore(R.x + E, R.y - N);
        R = r.getStartPos();
        r.setPos(R.x - E, R.y - N);
        y && screenfull.isEnabled && l.setPosition(a + E, c +
            N)
    };
    this.unloadHelpText = function() {
        null !== v && (v.fadeAnim(0, v.unload), v = null)
    };
    this.unload = function() {
        g.unload();
        g = null;
        if (!1 === DISABLE_SOUND_MOBILE || !1 === s_bMobile) p.unload(), p = null;
        y && screenfull.isEnabled && (l.unload(), l = null);
        s_oInterface = null
    };
    this.createWinPanel = function(E) {
        n = new CWinPanel(s_oSpriteLibrary.getSprite("msg_box"));
        n.show(E)
    };
    this.refreshTextScoreBoard = function(E, N, R, T) {
        console.log("REFRESHED");
        t.refreshTextScore(E);
        T && t.effectAddScore(R, N)
    };
    this.resetFullscreenBut = function() {
        y && screenfull.isEnabled && l.setActive(s_bFullscreen)
    };
    this._onFullscreen = function() {
        s_bFullscreen ? I.call(window.document) : y.call(window.document.documentElement);
        sizeHandler()
    };
    this.createAnimText = function(E, N, R, T, M) {
        var G = new createjs.Container,
            H = new createjs.Text(E, N + "px " + FONT_GAME, M);
        H.x = 0;
        H.y = 0;
        H.textAlign = "center";
        H.outline = 4;
        G.addChild(H);
        var S = new createjs.Text(H.text, N + "px " + FONT_GAME, T);
        S.x = 0;
        S.y = 0;
        S.textAlign = "center";
        G.addChild(S);
        G.x = CANVAS_WIDTH_HALF;
        G.y = -H.getBounds().height;
        R && s_oInterface.strobeText(S);
        s_oStage.addChild(G);
        createjs.Tween.get(G).to({
                y: CANVAS_HEIGHT_HALF
            },
            500, createjs.Ease.cubicOut).call(function() {
            createjs.Tween.get(G).wait(250).to({
                y: CANVAS_HEIGHT + H.getBounds().height
            }, 500, createjs.Ease.cubicIn).call(function() {
                R && createjs.Tween.removeTweens(S);
                s_oStage.removeChild(G)
            })
        })
    };
    this.strobeText = function(E) {
        createjs.Tween.get(E).wait(30).call(function() {
            x < TEXT_EXCELLENT_COLOR.length - 1 ? x++ : x = 0;
            E.color = TEXT_EXCELLENT_COLOR[x];
            s_oInterface.strobeText(E)
        })
    };
    this.refreshLaunchBoard = function(E, N) {
        r.refreshTextLaunch(E, N)
    };
    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive
    };
    this._onExit = function() {
        (new CAreYouSurePanel(s_oStage)).show()
    };
    this.unloadPause = function() {
        q.unload();
        q = null
    };
    this.onButPauseRelease = function() {
        playSound("click", 1, !1);
        q = new CPause
    };
    s_oInterface = this;
    this._init();
    return this
}
var s_oInterface = null;
! function(f) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = f();
    else {
        var d;
        "undefined" != typeof window ? d = window : "undefined" != typeof global ? d = global : "undefined" != typeof self && (d = self);
        d.CANNON = f()
    }
}(function() {
    return function a(d, e, m) {
        function c(g, h) {
            if (!e[g]) {
                if (!d[g]) {
                    var l = "function" == typeof require && require;
                    if (!h && l) return l(g, !0);
                    if (b) return b(g, !0);
                    throw Error("Cannot find module '" + g + "'");
                }
                l = e[g] = {
                    exports: {}
                };
                d[g][0].call(l.exports, function(p) {
                    var n = d[g][1][p];
                    return c(n ?
                        n : p)
                }, l, l.exports, a, d, e, m)
            }
            return e[g].exports
        }
        for (var b = "function" == typeof require && require, k = 0; k < m.length; k++) c(m[k]);
        return c
    }({
        1: [function(d, e, m) {
            e.exports = {
                name: "cannon",
                version: "0.6.2",
                description: "A lightweight 3D physics engine written in JavaScript.",
                homepage: "https://github.com/schteppe/cannon.js",
                author: "Stefan Hedman <schteppe@gmail.com> (http://steffe.se)",
                keywords: ["cannon.js", "cannon", "physics", "engine", "3d"],
                main: "./build/cannon.js",
                engines: {
                    node: "*"
                },
                repository: {
                    type: "git",
                    url: "https://github.com/schteppe/cannon.js.git"
                },
                bugs: {
                    url: "https://github.com/schteppe/cannon.js/issues"
                },
                licenses: [{
                    type: "MIT"
                }],
                devDependencies: {
                    jshint: "latest",
                    "uglify-js": "latest",
                    nodeunit: "^0.9.0",
                    grunt: "~0.4.0",
                    "grunt-contrib-jshint": "~0.1.1",
                    "grunt-contrib-nodeunit": "^0.4.1",
                    "grunt-contrib-concat": "~0.1.3",
                    "grunt-contrib-uglify": "^0.5.1",
                    "grunt-browserify": "^2.1.4",
                    "grunt-contrib-yuidoc": "^0.5.2",
                    browserify: "*"
                },
                dependencies: {}
            }
        }, {}],
        2: [function(d, e, m) {
            e.exports = {
                version: d("../package.json").version,
                AABB: d("./collision/AABB"),
                ArrayCollisionMatrix: d("./collision/ArrayCollisionMatrix"),
                Body: d("./objects/Body"),
                Box: d("./shapes/Box"),
                Broadphase: d("./collision/Broadphase"),
                Constraint: d("./constraints/Constraint"),
                ContactEquation: d("./equations/ContactEquation"),
                Narrowphase: d("./world/Narrowphase"),
                ConeTwistConstraint: d("./constraints/ConeTwistConstraint"),
                ContactMaterial: d("./material/ContactMaterial"),
                ConvexPolyhedron: d("./shapes/ConvexPolyhedron"),
                Cylinder: d("./shapes/Cylinder"),
                DistanceConstraint: d("./constraints/DistanceConstraint"),
                Equation: d("./equations/Equation"),
                EventTarget: d("./utils/EventTarget"),
                FrictionEquation: d("./equations/FrictionEquation"),
                GSSolver: d("./solver/GSSolver"),
                GridBroadphase: d("./collision/GridBroadphase"),
                Heightfield: d("./shapes/Heightfield"),
                HingeConstraint: d("./constraints/HingeConstraint"),
                LockConstraint: d("./constraints/LockConstraint"),
                Mat3: d("./math/Mat3"),
                Material: d("./material/Material"),
                NaiveBroadphase: d("./collision/NaiveBroadphase"),
                ObjectCollisionMatrix: d("./collision/ObjectCollisionMatrix"),
                Pool: d("./utils/Pool"),
                Particle: d("./shapes/Particle"),
                Plane: d("./shapes/Plane"),
                PointToPointConstraint: d("./constraints/PointToPointConstraint"),
                Quaternion: d("./math/Quaternion"),
                Ray: d("./collision/Ray"),
                RaycastVehicle: d("./objects/RaycastVehicle"),
                RaycastResult: d("./collision/RaycastResult"),
                RigidVehicle: d("./objects/RigidVehicle"),
                RotationalEquation: d("./equations/RotationalEquation"),
                RotationalMotorEquation: d("./equations/RotationalMotorEquation"),
                SAPBroadphase: d("./collision/SAPBroadphase"),
                SPHSystem: d("./objects/SPHSystem"),
                Shape: d("./shapes/Shape"),
                Solver: d("./solver/Solver"),
                Sphere: d("./shapes/Sphere"),
                SplitSolver: d("./solver/SplitSolver"),
                Spring: d("./objects/Spring"),
                Trimesh: d("./shapes/Trimesh"),
                Vec3: d("./math/Vec3"),
                Vec3Pool: d("./utils/Vec3Pool"),
                World: d("./world/World")
            }
        }, {
            "../package.json": 1,
            "./collision/AABB": 3,
            "./collision/ArrayCollisionMatrix": 4,
            "./collision/Broadphase": 5,
            "./collision/GridBroadphase": 6,
            "./collision/NaiveBroadphase": 7,
            "./collision/ObjectCollisionMatrix": 8,
            "./collision/Ray": 9,
            "./collision/RaycastResult": 10,
            "./collision/SAPBroadphase": 11,
            "./constraints/ConeTwistConstraint": 12,
            "./constraints/Constraint": 13,
            "./constraints/DistanceConstraint": 14,
            "./constraints/HingeConstraint": 15,
            "./constraints/LockConstraint": 16,
            "./constraints/PointToPointConstraint": 17,
            "./equations/ContactEquation": 19,
            "./equations/Equation": 20,
            "./equations/FrictionEquation": 21,
            "./equations/RotationalEquation": 22,
            "./equations/RotationalMotorEquation": 23,
            "./material/ContactMaterial": 24,
            "./material/Material": 25,
            "./math/Mat3": 27,
            "./math/Quaternion": 28,
            "./math/Vec3": 30,
            "./objects/Body": 31,
            "./objects/RaycastVehicle": 32,
            "./objects/RigidVehicle": 33,
            "./objects/SPHSystem": 34,
            "./objects/Spring": 35,
            "./shapes/Box": 37,
            "./shapes/ConvexPolyhedron": 38,
            "./shapes/Cylinder": 39,
            "./shapes/Heightfield": 40,
            "./shapes/Particle": 41,
            "./shapes/Plane": 42,
            "./shapes/Shape": 43,
            "./shapes/Sphere": 44,
            "./shapes/Trimesh": 45,
            "./solver/GSSolver": 46,
            "./solver/Solver": 47,
            "./solver/SplitSolver": 48,
            "./utils/EventTarget": 49,
            "./utils/Pool": 51,
            "./utils/Vec3Pool": 54,
            "./world/Narrowphase": 55,
            "./world/World": 56
        }],
        3: [function(d, e, m) {
            function a(g) {
                g = g || {};
                this.lowerBound = new c;
                g.lowerBound && this.lowerBound.copy(g.lowerBound);
                this.upperBound = new c;
                g.upperBound && this.upperBound.copy(g.upperBound)
            }
            var c = d("../math/Vec3");
            d("../utils/Utils");
            e.exports = a;
            var b = new c;
            a.prototype.setFromPoints = function(g, h, l, p) {
                var n = this.lowerBound,
                    q = this.upperBound;
                n.copy(g[0]);
                l && l.vmult(n, n);
                q.copy(n);
                for (var t = 1; t < g.length; t++) {
                    var r = g[t];
                    l && (l.vmult(r, b), r = b);
                    r.x > q.x && (q.x = r.x);
                    r.x < n.x && (n.x = r.x);
                    r.y > q.y && (q.y = r.y);
                    r.y < n.y && (n.y = r.y);
                    r.z > q.z && (q.z = r.z);
                    r.z < n.z && (n.z =
                        r.z)
                }
                h && (h.vadd(n, n), h.vadd(q, q));
                p && (n.x -= p, n.y -= p, n.z -= p, q.x += p, q.y += p, q.z += p);
                return this
            };
            a.prototype.copy = function(g) {
                this.lowerBound.copy(g.lowerBound);
                this.upperBound.copy(g.upperBound);
                return this
            };
            a.prototype.clone = function() {
                return (new a).copy(this)
            };
            a.prototype.extend = function(g) {
                var h = g.lowerBound.x;
                this.lowerBound.x > h && (this.lowerBound.x = h);
                h = g.upperBound.x;
                this.upperBound.x < h && (this.upperBound.x = h);
                h = g.lowerBound.y;
                this.lowerBound.y > h && (this.lowerBound.y = h);
                h = g.upperBound.y;
                this.upperBound.y <
                    h && (this.upperBound.y = h);
                h = g.lowerBound.z;
                this.lowerBound.z > h && (this.lowerBound.z = h);
                h = g.upperBound.z;
                this.upperBound.z < h && (this.upperBound.z = h)
            };
            a.prototype.overlaps = function(g) {
                var h = this.lowerBound,
                    l = this.upperBound,
                    p = g.lowerBound;
                g = g.upperBound;
                return (p.x <= l.x && l.x <= g.x || h.x <= g.x && g.x <= l.x) && (p.y <= l.y && l.y <= g.y || h.y <= g.y && g.y <= l.y) && (p.z <= l.z && l.z <= g.z || h.z <= g.z && g.z <= l.z)
            };
            a.prototype.contains = function(g) {
                var h = this.lowerBound,
                    l = this.upperBound,
                    p = g.lowerBound;
                g = g.upperBound;
                return h.x <= p.x &&
                    l.x >= g.x && h.y <= p.y && l.y >= g.y && h.z <= p.z && l.z >= g.z
            };
            a.prototype.getCorners = function(g, h, l, p, n, q, t, r) {
                var v = this.lowerBound,
                    x = this.upperBound;
                g.copy(v);
                h.set(x.x, v.y, v.z);
                l.set(x.x, x.y, v.z);
                p.set(v.x, x.y, x.z);
                n.set(x.x, v.y, v.z);
                q.set(v.x, x.y, v.z);
                t.set(v.x, v.y, x.z);
                r.copy(x)
            };
            var k = [new c, new c, new c, new c, new c, new c, new c, new c];
            a.prototype.toLocalFrame = function(g, h) {
                this.getCorners(k[0], k[1], k[2], k[3], k[4], k[5], k[6], k[7]);
                for (var l = 0; 8 !== l; l++) {
                    var p = k[l];
                    g.pointToLocal(p, p)
                }
                return h.setFromPoints(k)
            };
            a.prototype.toWorldFrame = function(g, h) {
                this.getCorners(k[0], k[1], k[2], k[3], k[4], k[5], k[6], k[7]);
                for (var l = 0; 8 !== l; l++) {
                    var p = k[l];
                    g.pointToWorld(p, p)
                }
                return h.setFromPoints(k)
            }
        }, {
            "../math/Vec3": 30,
            "../utils/Utils": 53
        }],
        4: [function(d, e, m) {
            function a() {
                this.matrix = []
            }
            e.exports = a;
            a.prototype.get = function(c, b) {
                c = c.index;
                b = b.index;
                if (b > c) {
                    var k = b;
                    b = c;
                    c = k
                }
                return this.matrix[(c * (c + 1) >> 1) + b - 1]
            };
            a.prototype.set = function(c, b, k) {
                c = c.index;
                b = b.index;
                if (b > c) {
                    var g = b;
                    b = c;
                    c = g
                }
                this.matrix[(c * (c + 1) >> 1) + b - 1] = k ? 1 : 0
            };
            a.prototype.reset = function() {
                for (var c = 0, b = this.matrix.length; c !== b; c++) this.matrix[c] = 0
            };
            a.prototype.setNumObjects = function(c) {
                this.matrix.length = c * (c - 1) >> 1
            }
        }, {}],
        5: [function(d, e, m) {
            function a() {
                this.world = null;
                this.useBoundingBoxes = !1;
                this.dirty = !0
            }
            var c = d("../objects/Body");
            m = d("../math/Vec3");
            var b = d("../math/Quaternion");
            d("../shapes/Shape");
            d("../shapes/Plane");
            e.exports = a;
            a.prototype.collisionPairs = function(q, t, r) {
                throw Error("collisionPairs not implemented for this BroadPhase class!");
            };
            var k =
                c.STATIC | c.KINEMATIC;
            a.prototype.needBroadphaseCollision = function(q, t) {
                return 0 !== (q.collisionFilterGroup & t.collisionFilterMask) && 0 !== (t.collisionFilterGroup & q.collisionFilterMask) && (0 === (q.type & k) && q.sleepState !== c.SLEEPING || 0 === (t.type & k) && t.sleepState !== c.SLEEPING) ? !0 : !1
            };
            a.prototype.intersectionTest = function(q, t, r, v) {
                this.useBoundingBoxes ? this.doBoundingBoxBroadphase(q, t, r, v) : this.doBoundingSphereBroadphase(q, t, r, v)
            };
            var g = new m;
            new m;
            new b;
            new m;
            a.prototype.doBoundingSphereBroadphase = function(q,
                t, r, v) {
                t.position.vsub(q.position, g);
                var x = Math.pow(q.boundingRadius + t.boundingRadius, 2);
                g.norm2() < x && (r.push(q), v.push(t))
            };
            a.prototype.doBoundingBoxBroadphase = function(q, t, r, v) {
                q.aabbNeedsUpdate && q.computeAABB();
                t.aabbNeedsUpdate && t.computeAABB();
                q.aabb.overlaps(t.aabb) && (r.push(q), v.push(t))
            };
            var h = {
                    keys: []
                },
                l = [],
                p = [];
            a.prototype.makePairsUnique = function(q, t) {
                for (var r = q.length, v = 0; v !== r; v++) l[v] = q[v], p[v] = t[v];
                q.length = 0;
                for (v = t.length = 0; v !== r; v++) {
                    var x = l[v].id,
                        y = p[v].id;
                    x = x < y ? x + "," + y : y + "," +
                        x;
                    h[x] = v;
                    h.keys.push(x)
                }
                for (v = 0; v !== h.keys.length; v++) x = h.keys.pop(), r = h[x], q.push(l[r]), t.push(p[r]), delete h[x]
            };
            a.prototype.setWorld = function(q) {};
            var n = new m;
            a.boundingSphereCheck = function(q, t) {
                q.position.vsub(t.position, n);
                return Math.pow(q.shape.boundingSphereRadius + t.shape.boundingSphereRadius, 2) > n.norm2()
            };
            a.prototype.aabbQuery = function(q, t, r) {
                console.warn(".aabbQuery is not implemented in this Broadphase subclass.");
                return []
            }
        }, {
            "../math/Quaternion": 28,
            "../math/Vec3": 30,
            "../objects/Body": 31,
            "../shapes/Plane": 42,
            "../shapes/Shape": 43
        }],
        6: [function(d, e, m) {
            function a(h, l, p, n, q) {
                c.apply(this);
                this.nx = p || 10;
                this.ny = n || 10;
                this.nz = q || 10;
                this.aabbMin = h || new b(100, 100, 100);
                this.aabbMax = l || new b(-100, -100, -100);
                h = this.nx * this.ny * this.nz;
                if (0 >= h) throw "GridBroadphase: Each dimension's n must be >0";
                this.bins = [];
                this.binLengths = [];
                this.bins.length = h;
                this.binLengths.length = h;
                for (l = 0; l < h; l++) this.bins[l] = [], this.binLengths[l] = 0
            }
            e.exports = a;
            var c = d("./Broadphase"),
                b = d("../math/Vec3"),
                k = d("../shapes/Shape");
            a.prototype = new c;
            a.prototype.constructor = a;
            var g = new b;
            new b;
            a.prototype.collisionPairs = function(h, l, p) {
                function n(U, ba, da, oa, ua, ra, Da) {
                    U = (U - M) * S | 0;
                    ba = (ba - G) * J | 0;
                    da = (da - H) * ca | 0;
                    oa = B((oa - M) * S);
                    ua = B((ua - G) * J);
                    ra = B((ra - H) * ca);
                    0 > U ? U = 0 : U >= v && (U = v - 1);
                    0 > ba ? ba = 0 : ba >= x && (ba = x - 1);
                    0 > da ? da = 0 : da >= y && (da = y - 1);
                    0 > oa ? oa = 0 : oa >= v && (oa = v - 1);
                    0 > ua ? ua = 0 : ua >= x && (ua = x - 1);
                    0 > ra ? ra = 0 : ra >= y && (ra = y - 1);
                    U *= I;
                    ba *= E;
                    da *= 1;
                    oa *= I;
                    ua *= E;
                    for (ra *= 1; U <= oa; U += I)
                        for (var Ra = ba; Ra <= ua; Ra += E)
                            for (var Sa = da; Sa <= ra; Sa += 1) {
                                var Ua = U + Ra + Sa;
                                C[Ua][u[Ua]++] =
                                    Da
                            }
                }
                var q = h.numObjects();
                h = h.bodies;
                var t = this.aabbMax,
                    r = this.aabbMin,
                    v = this.nx,
                    x = this.ny,
                    y = this.nz,
                    I = x * y,
                    E = y,
                    N = t.x,
                    R = t.y,
                    T = t.z,
                    M = r.x,
                    G = r.y,
                    H = r.z,
                    S = v / (N - M),
                    J = x / (R - G),
                    ca = y / (T - H);
                N = (N - M) / v;
                var O = (R - G) / x;
                T = (T - H) / y;
                var Y = .5 * Math.sqrt(N * N + O * O + T * T);
                R = k.types;
                var K = R.SPHERE,
                    z = R.PLANE,
                    C = this.bins,
                    u = this.binLengths;
                R = this.bins.length;
                for (r = 0; r !== R; r++) u[r] = 0;
                var B = Math.ceil;
                r = Math.min;
                t = Math.max;
                for (r = 0; r !== q; r++) {
                    t = h[r];
                    var w = t.shape;
                    switch (w.type) {
                        case K:
                            var A = t.position.x,
                                F = t.position.y,
                                D = t.position.z;
                            w = w.radius;
                            n(A - w, F - w, D - w, A + w, F + w, D + w, t);
                            break;
                        case z:
                            w.worldNormalNeedsUpdate && w.computeWorldNormal(t.quaternion);
                            D = w.worldNormal;
                            w = G + .5 * O - t.position.y;
                            var Q = H + .5 * T - t.position.z,
                                X = g;
                            X.set(M + .5 * N - t.position.x, w, Q);
                            for (var P = A = 0; A !== v; A++, P += I, X.y = w, X.x += N)
                                for (var Z = F = 0; F !== x; F++, Z += E, X.z = Q, X.y += O)
                                    for (var ma = 0, ja = 0; ma !== y; ma++, ja += 1, X.z += T)
                                        if (X.dot(D) < Y) {
                                            var fa = P + Z + ja;
                                            C[fa][u[fa]++] = t
                                        } break;
                        default:
                            t.aabbNeedsUpdate && t.computeAABB(), n(t.aabb.lowerBound.x, t.aabb.lowerBound.y, t.aabb.lowerBound.z, t.aabb.upperBound.x,
                                t.aabb.upperBound.y, t.aabb.upperBound.z, t)
                    }
                }
                for (r = 0; r !== R; r++)
                    if (q = u[r], 1 < q)
                        for (h = C[r], A = 0; A !== q; A++)
                            for (t = h[A], F = 0; F !== A; F++) N = h[F], this.needBroadphaseCollision(t, N) && this.intersectionTest(t, N, l, p);
                this.makePairsUnique(l, p)
            }
        }, {
            "../math/Vec3": 30,
            "../shapes/Shape": 43,
            "./Broadphase": 5
        }],
        7: [function(d, e, m) {
            function a() {
                c.apply(this)
            }
            e.exports = a;
            var c = d("./Broadphase");
            d = d("./AABB");
            a.prototype = new c;
            a.prototype.constructor = a;
            a.prototype.collisionPairs = function(b, k, g) {
                b = b.bodies;
                var h = b.length,
                    l, p;
                for (l =
                    0; l !== h; l++)
                    for (p = 0; p !== l; p++) {
                        var n = b[l];
                        var q = b[p];
                        this.needBroadphaseCollision(n, q) && this.intersectionTest(n, q, k, g)
                    }
            };
            new d;
            a.prototype.aabbQuery = function(b, k, g) {
                g = g || [];
                for (var h = 0; h < b.bodies.length; h++) {
                    var l = b.bodies[h];
                    l.aabbNeedsUpdate && l.computeAABB();
                    l.aabb.overlaps(k) && g.push(l)
                }
                return g
            }
        }, {
            "./AABB": 3,
            "./Broadphase": 5
        }],
        8: [function(d, e, m) {
            function a() {
                this.matrix = {}
            }
            e.exports = a;
            a.prototype.get = function(c, b) {
                c = c.id;
                b = b.id;
                if (b > c) {
                    var k = b;
                    b = c;
                    c = k
                }
                return c + "-" + b in this.matrix
            };
            a.prototype.set =
                function(c, b, k) {
                    c = c.id;
                    b = b.id;
                    if (b > c) {
                        var g = b;
                        b = c;
                        c = g
                    }
                    k ? this.matrix[c + "-" + b] = !0 : delete this.matrix[c + "-" + b]
                };
            a.prototype.reset = function() {
                this.matrix = {}
            };
            a.prototype.setNumObjects = function(c) {}
        }, {}],
        9: [function(d, e, m) {
            function a(C, u) {
                this.from = C ? C.clone() : new b;
                this.to = u ? u.clone() : new b;
                this._direction = new b;
                this.precision = 1E-4;
                this.checkCollisionResponse = !0;
                this.skipBackfaces = !1;
                this.collisionFilterGroup = this.collisionFilterMask = -1;
                this.mode = a.ANY;
                this.result = new g;
                this.hasHit = !1;
                this.callback = function(B) {}
            }

            function c(C, u, B, w) {
                w.vsub(u, K);
                B.vsub(u, p);
                C.vsub(u, n);
                C = K.dot(K);
                u = K.dot(p);
                B = K.dot(n);
                w = p.dot(p);
                var A = p.dot(n),
                    F, D;
                return 0 <= (F = w * B - u * A) && 0 <= (D = C * A - u * B) && F + D < C * w - u * u
            }
            e.exports = a;
            var b = d("../math/Vec3");
            e = d("../math/Quaternion");
            var k = d("../math/Transform");
            d("../shapes/ConvexPolyhedron");
            d("../shapes/Box");
            var g = d("../collision/RaycastResult");
            m = d("../shapes/Shape");
            d = d("../collision/AABB");
            a.prototype.constructor = a;
            a.CLOSEST = 1;
            a.ANY = 2;
            a.ALL = 4;
            var h = new d,
                l = [];
            a.prototype.intersectWorld = function(C,
                u) {
                this.mode = u.mode || a.ANY;
                this.result = u.result || new g;
                this.skipBackfaces = !!u.skipBackfaces;
                this.collisionFilterMask = "undefined" !== typeof u.collisionFilterMask ? u.collisionFilterMask : -1;
                this.collisionFilterGroup = "undefined" !== typeof u.collisionFilterGroup ? u.collisionFilterGroup : -1;
                u.from && this.from.copy(u.from);
                u.to && this.to.copy(u.to);
                this.callback = u.callback || function() {};
                this.hasHit = !1;
                this.result.reset();
                this._updateDirection();
                this.getAABB(h);
                l.length = 0;
                C.broadphase.aabbQuery(C, h, l);
                this.intersectBodies(l);
                return this.hasHit
            };
            var p = new b,
                n = new b;
            a.pointInTriangle = c;
            var q = new b,
                t = new e;
            a.prototype.intersectBody = function(C, u) {
                u && (this.result = u, this._updateDirection());
                var B = this.checkCollisionResponse;
                if ((!B || C.collisionResponse) && 0 !== (this.collisionFilterGroup & C.collisionFilterMask) && 0 !== (C.collisionFilterGroup & this.collisionFilterMask))
                    for (var w = 0, A = C.shapes.length; w < A; w++) {
                        var F = C.shapes[w];
                        if (!B || F.collisionResponse)
                            if (C.quaternion.mult(C.shapeOrientations[w], t), C.quaternion.vmult(C.shapeOffsets[w],
                                    q), q.vadd(C.position, q), this.intersectShape(F, t, q, C), this.result._shouldStop) break
                    }
            };
            a.prototype.intersectBodies = function(C, u) {
                u && (this.result = u, this._updateDirection());
                for (var B = 0, w = C.length; !this.result._shouldStop && B < w; B++) this.intersectBody(C[B])
            };
            a.prototype._updateDirection = function() {
                this.to.vsub(this.from, this._direction);
                this._direction.normalize()
            };
            a.prototype.intersectShape = function(C, u, B, w) {
                var A = this.from,
                    F = this._direction;
                B.vsub(A, K);
                var D = K.dot(F);
                F.mult(D, z);
                z.vadd(A, z);
                B.distanceTo(z) >
                    C.boundingSphereRadius || (A = this[C.type]) && A.call(this, C, u, B, w)
            };
            new b;
            new b;
            var r = new b,
                v = new b,
                x = new b,
                y = new b;
            new b;
            new g;
            a.prototype.intersectBox = function(C, u, B, w) {
                return this.intersectConvex(C.convexPolyhedronRepresentation, u, B, w)
            };
            a.prototype[m.types.BOX] = a.prototype.intersectBox;
            a.prototype.intersectPlane = function(C, u, B, w) {
                var A = this.from,
                    F = this.to,
                    D = this._direction,
                    Q = new b(0, 0, 1);
                u.vmult(Q, Q);
                var X = new b;
                A.vsub(B, X);
                u = X.dot(Q);
                F.vsub(B, X);
                X = X.dot(Q);
                if (!(0 < u * X || A.distanceTo(F) < u || (X = Q.dot(D),
                        Math.abs(X) < this.precision))) {
                    var P = new b;
                    F = new b;
                    u = new b;
                    A.vsub(B, P);
                    B = -Q.dot(P) / X;
                    D.scale(B, F);
                    A.vadd(F, u);
                    this.reportIntersection(Q, u, C, w, -1)
                }
            };
            a.prototype[m.types.PLANE] = a.prototype.intersectPlane;
            a.prototype.getAABB = function(C) {
                var u = this.to,
                    B = this.from;
                C.lowerBound.x = Math.min(u.x, B.x);
                C.lowerBound.y = Math.min(u.y, B.y);
                C.lowerBound.z = Math.min(u.z, B.z);
                C.upperBound.x = Math.max(u.x, B.x);
                C.upperBound.y = Math.max(u.y, B.y);
                C.upperBound.z = Math.max(u.z, B.z)
            };
            var I = {
                faceList: [0]
            };
            a.prototype.intersectHeightfield =
                function(C, u, B, w) {
                    var A = new b,
                        F = new a(this.from, this.to);
                    k.pointToLocalFrame(B, u, F.from, F.from);
                    k.pointToLocalFrame(B, u, F.to, F.to);
                    var D = [],
                        Q = null,
                        X = null,
                        P = null,
                        Z = null,
                        ma = C.getIndexOfPosition(F.from.x, F.from.y, D, !1);
                    ma && (Q = D[0], X = D[1], P = D[0], Z = D[1]);
                    if (ma = C.getIndexOfPosition(F.to.x, F.to.y, D, !1)) {
                        if (null === Q || D[0] < Q) Q = D[0];
                        if (null === P || D[0] > P) P = D[0];
                        if (null === X || D[1] < X) X = D[1];
                        if (null === Z || D[1] > Z) Z = D[1]
                    }
                    if (null !== Q)
                        for (C.getRectMinMax(Q, X, P, Z, []), F = Q; F <= P; F++)
                            for (D = X; D <= Z; D++) {
                                if (this.result._shouldStop) return;
                                C.getConvexTrianglePillar(F, D, !1);
                                k.pointToWorldFrame(B, u, C.pillarOffset, A);
                                this.intersectConvex(C.pillarConvex, u, A, w, I);
                                if (this.result._shouldStop) return;
                                C.getConvexTrianglePillar(F, D, !0);
                                k.pointToWorldFrame(B, u, C.pillarOffset, A);
                                this.intersectConvex(C.pillarConvex, u, A, w, I)
                            }
                };
            a.prototype[m.types.HEIGHTFIELD] = a.prototype.intersectHeightfield;
            var E = new b,
                N = new b;
            a.prototype.intersectSphere = function(C, u, B, w) {
                u = this.from;
                var A = this.to,
                    F = Math.pow(A.x - u.x, 2) + Math.pow(A.y - u.y, 2) + Math.pow(A.z - u.z, 2),
                    D = 2 *
                    ((A.x - u.x) * (u.x - B.x) + (A.y - u.y) * (u.y - B.y) + (A.z - u.z) * (u.z - B.z)),
                    Q = Math.pow(D, 2) - 4 * F * (Math.pow(u.x - B.x, 2) + Math.pow(u.y - B.y, 2) + Math.pow(u.z - B.z, 2) - Math.pow(C.radius, 2));
                if (!(0 > Q))
                    if (0 === Q) u.lerp(A, Q, E), E.vsub(B, N), N.normalize(), this.reportIntersection(N, E, C, w, -1);
                    else {
                        var X = (-D - Math.sqrt(Q)) / (2 * F);
                        F = (-D + Math.sqrt(Q)) / (2 * F);
                        0 <= X && 1 >= X && (u.lerp(A, X, E), E.vsub(B, N), N.normalize(), this.reportIntersection(N, E, C, w, -1));
                        !this.result._shouldStop && 0 <= F && 1 >= F && (u.lerp(A, F, E), E.vsub(B, N), N.normalize(), this.reportIntersection(N,
                            E, C, w, -1))
                    }
            };
            a.prototype[m.types.SPHERE] = a.prototype.intersectSphere;
            var R = new b;
            new b;
            new b;
            var T = new b;
            a.prototype.intersectConvex = function(C, u, B, w, A) {
                A = A && A.faceList || null;
                for (var F = C.faces, D = C.vertices, Q = C.faceNormals, X = this._direction, P = this.from, Z = P.distanceTo(this.to), ma = A ? A.length : F.length, ja = this.result, fa = 0; !ja._shouldStop && fa < ma; fa++) {
                    var U = A ? A[fa] : fa,
                        ba = F[U],
                        da = Q[U],
                        oa = u,
                        ua = B;
                    T.copy(D[ba[0]]);
                    oa.vmult(T, T);
                    T.vadd(ua, T);
                    T.vsub(P, T);
                    oa.vmult(da, R);
                    da = X.dot(R);
                    if (!(Math.abs(da) < this.precision ||
                            (da = R.dot(T) / da, 0 > da)))
                        for (X.mult(da, r), r.vadd(P, r), v.copy(D[ba[0]]), oa.vmult(v, v), ua.vadd(v, v), da = 1; !ja._shouldStop && da < ba.length - 1; da++) {
                            x.copy(D[ba[da]]);
                            y.copy(D[ba[da + 1]]);
                            oa.vmult(x, x);
                            oa.vmult(y, y);
                            ua.vadd(x, x);
                            ua.vadd(y, y);
                            var ra = r.distanceTo(P);
                            !c(r, v, x, y) && !c(r, x, v, y) || ra > Z || this.reportIntersection(R, r, C, w, U)
                        }
                }
            };
            a.prototype[m.types.CONVEXPOLYHEDRON] = a.prototype.intersectConvex;
            var M = new b,
                G = new b,
                H = new b,
                S = new b,
                J = new b,
                ca = new b;
            new d;
            var O = [],
                Y = new k;
            a.prototype.intersectTrimesh = function(C,
                u, B, w, A) {
                A = C.indices;
                var F = this.from,
                    D = this.to,
                    Q = this._direction;
                Y.position.copy(B);
                Y.quaternion.copy(u);
                k.vectorToLocalFrame(B, u, Q, G);
                k.pointToLocalFrame(B, u, F, H);
                k.pointToLocalFrame(B, u, D, S);
                F = H.distanceSquared(S);
                C.tree.rayQuery(this, Y, O);
                D = 0;
                for (Q = O.length; !this.result._shouldStop && D !== Q; D++) {
                    var X = O[D];
                    C.getNormal(X, M);
                    C.getVertex(A[3 * X], v);
                    v.vsub(H, T);
                    var P = G.dot(M);
                    P = M.dot(T) / P;
                    0 > P || (G.scale(P, r), r.vadd(H, r), C.getVertex(A[3 * X + 1], x), C.getVertex(A[3 * X + 2], y), P = r.distanceSquared(H), !c(r, x, v, y) &&
                        !c(r, v, x, y) || P > F || (k.vectorToWorldFrame(u, M, J), k.pointToWorldFrame(B, u, r, ca), this.reportIntersection(J, ca, C, w, X)))
                }
                O.length = 0
            };
            a.prototype[m.types.TRIMESH] = a.prototype.intersectTrimesh;
            a.prototype.reportIntersection = function(C, u, B, w, A) {
                var F = this.from,
                    D = this.to,
                    Q = F.distanceTo(u),
                    X = this.result;
                if (!(this.skipBackfaces && 0 < C.dot(this._direction))) switch (X.hitFaceIndex = "undefined" !== typeof A ? A : -1, this.mode) {
                    case a.ALL:
                        this.hasHit = !0;
                        X.set(F, D, C, u, B, w, Q);
                        X.hasHit = !0;
                        this.callback(X);
                        break;
                    case a.CLOSEST:
                        if (Q <
                            X.distance || !X.hasHit) this.hasHit = !0, X.hasHit = !0, X.set(F, D, C, u, B, w, Q);
                        break;
                    case a.ANY:
                        this.hasHit = !0, X.hasHit = !0, X.set(F, D, C, u, B, w, Q), X._shouldStop = !0
                }
            };
            var K = new b,
                z = new b
        }, {
            "../collision/AABB": 3,
            "../collision/RaycastResult": 10,
            "../math/Quaternion": 28,
            "../math/Transform": 29,
            "../math/Vec3": 30,
            "../shapes/Box": 37,
            "../shapes/ConvexPolyhedron": 38,
            "../shapes/Shape": 43
        }],
        10: [function(d, e, m) {
            function a() {
                this.rayFromWorld = new c;
                this.rayToWorld = new c;
                this.hitNormalWorld = new c;
                this.hitPointWorld = new c;
                this.hasHit = !1;
                this.body = this.shape = null;
                this.distance = this.hitFaceIndex = -1;
                this._shouldStop = !1
            }
            var c = d("../math/Vec3");
            e.exports = a;
            a.prototype.reset = function() {
                this.rayFromWorld.setZero();
                this.rayToWorld.setZero();
                this.hitNormalWorld.setZero();
                this.hitPointWorld.setZero();
                this.hasHit = !1;
                this.body = this.shape = null;
                this.distance = this.hitFaceIndex = -1;
                this._shouldStop = !1
            };
            a.prototype.abort = function() {
                this._shouldStop = !0
            };
            a.prototype.set = function(b, k, g, h, l, p, n) {
                this.rayFromWorld.copy(b);
                this.rayToWorld.copy(k);
                this.hitNormalWorld.copy(g);
                this.hitPointWorld.copy(h);
                this.shape = l;
                this.body = p;
                this.distance = n
            }
        }, {
            "../math/Vec3": 30
        }],
        11: [function(d, e, m) {
            function a(b) {
                c.apply(this);
                this.axisList = [];
                this.world = null;
                this.axisIndex = 0;
                var k = this.axisList;
                this._addBodyHandler = function(g) {
                    k.push(g.body)
                };
                this._removeBodyHandler = function(g) {
                    g = k.indexOf(g.body); - 1 !== g && k.splice(g, 1)
                };
                b && this.setWorld(b)
            }
            d("../shapes/Shape");
            var c = d("../collision/Broadphase");
            e.exports = a;
            a.prototype = new c;
            a.prototype.setWorld = function(b) {
                for (var k = this.axisList.length =
                        0; k < b.bodies.length; k++) this.axisList.push(b.bodies[k]);
                b.removeEventListener("addBody", this._addBodyHandler);
                b.removeEventListener("removeBody", this._removeBodyHandler);
                b.addEventListener("addBody", this._addBodyHandler);
                b.addEventListener("removeBody", this._removeBodyHandler);
                this.world = b;
                this.dirty = !0
            };
            a.insertionSortX = function(b) {
                for (var k = 1, g = b.length; k < g; k++) {
                    for (var h = b[k], l = k - 1; 0 <= l && !(b[l].aabb.lowerBound.x <= h.aabb.lowerBound.x); l--) b[l + 1] = b[l];
                    b[l + 1] = h
                }
                return b
            };
            a.insertionSortY = function(b) {
                for (var k =
                        1, g = b.length; k < g; k++) {
                    for (var h = b[k], l = k - 1; 0 <= l && !(b[l].aabb.lowerBound.y <= h.aabb.lowerBound.y); l--) b[l + 1] = b[l];
                    b[l + 1] = h
                }
                return b
            };
            a.insertionSortZ = function(b) {
                for (var k = 1, g = b.length; k < g; k++) {
                    for (var h = b[k], l = k - 1; 0 <= l && !(b[l].aabb.lowerBound.z <= h.aabb.lowerBound.z); l--) b[l + 1] = b[l];
                    b[l + 1] = h
                }
                return b
            };
            a.prototype.collisionPairs = function(b, k, g) {
                b = this.axisList;
                var h = b.length,
                    l = this.axisIndex,
                    p, n;
                this.dirty && (this.sortList(), this.dirty = !1);
                for (p = 0; p !== h; p++) {
                    var q = b[p];
                    for (n = p + 1; n < h; n++) {
                        var t = b[n];
                        if (this.needBroadphaseCollision(q,
                                t)) {
                            if (!a.checkBounds(q, t, l)) break;
                            this.intersectionTest(q, t, k, g)
                        }
                    }
                }
            };
            a.prototype.sortList = function() {
                for (var b = this.axisList, k = this.axisIndex, g = b.length, h = 0; h !== g; h++) {
                    var l = b[h];
                    l.aabbNeedsUpdate && l.computeAABB()
                }
                0 === k ? a.insertionSortX(b) : 1 === k ? a.insertionSortY(b) : 2 === k && a.insertionSortZ(b)
            };
            a.checkBounds = function(b, k, g) {
                if (0 === g) {
                    var h = b.position.x;
                    var l = k.position.x
                } else 1 === g ? (h = b.position.y, l = k.position.y) : 2 === g && (h = b.position.z, l = k.position.z);
                return l - k.boundingRadius < h + b.boundingRadius
            };
            a.prototype.autoDetectAxis = function() {
                for (var b = 0, k = 0, g = 0, h = 0, l = 0, p = 0, n = this.axisList, q = n.length, t = 1 / q, r = 0; r !== q; r++) {
                    var v = n[r],
                        x = v.position.x;
                    b += x;
                    k += x * x;
                    x = v.position.y;
                    g += x;
                    h += x * x;
                    v = v.position.z;
                    l += v;
                    p += v * v
                }
                b = k - b * b * t;
                g = h - g * g * t;
                l = p - l * l * t;
                this.axisIndex = b > g ? b > l ? 0 : 2 : g > l ? 1 : 2
            };
            a.prototype.aabbQuery = function(b, k, g) {
                g = g || [];
                this.dirty && (this.sortList(), this.dirty = !1);
                b = this.axisList;
                for (var h = 0; h < b.length; h++) {
                    var l = b[h];
                    l.aabbNeedsUpdate && l.computeAABB();
                    l.aabb.overlaps(k) && g.push(l)
                }
                return g
            }
        }, {
            "../collision/Broadphase": 5,
            "../shapes/Shape": 43
        }],
        12: [function(d, e, m) {
            function a(h, l, p) {
                p = p || {};
                var n = "undefined" !== typeof p.maxForce ? p.maxForce : 1E6,
                    q = p.pivotA ? p.pivotA.clone() : new g,
                    t = p.pivotB ? p.pivotB.clone() : new g;
                this.axisA = p.axisA ? p.axisA.clone() : new g;
                this.axisB = p.axisB ? p.axisB.clone() : new g;
                c.call(this, h, q, l, t, n);
                this.collideConnected = !!p.collideConnected;
                this.angle = "undefined" !== typeof p.angle ? p.angle : 0;
                q = this.coneEquation = new b(h, l, p);
                h = this.twistEquation = new k(h, l, p);
                this.twistAngle = "undefined" !== typeof p.twistAngle ?
                    p.twistAngle : 0;
                q.maxForce = 0;
                q.minForce = -n;
                h.maxForce = 0;
                h.minForce = -n;
                this.equations.push(q, h)
            }
            e.exports = a;
            d("./Constraint");
            var c = d("./PointToPointConstraint"),
                b = d("../equations/ConeEquation"),
                k = d("../equations/RotationalEquation");
            d("../equations/ContactEquation");
            var g = d("../math/Vec3");
            a.prototype = new c;
            a.constructor = a;
            new g;
            new g;
            a.prototype.update = function() {
                var h = this.bodyA,
                    l = this.bodyB,
                    p = this.coneEquation,
                    n = this.twistEquation;
                c.prototype.update.call(this);
                h.vectorToWorldFrame(this.axisA, p.axisA);
                l.vectorToWorldFrame(this.axisB, p.axisB);
                this.axisA.tangents(n.axisA, n.axisA);
                h.vectorToWorldFrame(n.axisA, n.axisA);
                this.axisB.tangents(n.axisB, n.axisB);
                l.vectorToWorldFrame(n.axisB, n.axisB);
                p.angle = this.angle;
                n.maxAngle = this.twistAngle
            }
        }, {
            "../equations/ConeEquation": 18,
            "../equations/ContactEquation": 19,
            "../equations/RotationalEquation": 22,
            "../math/Vec3": 30,
            "./Constraint": 13,
            "./PointToPointConstraint": 17
        }],
        13: [function(d, e, m) {
            function a(b, k, g) {
                g = c.defaults(g, {
                    collideConnected: !0,
                    wakeUpBodies: !0
                });
                this.equations = [];
                this.bodyA = b;
                this.bodyB = k;
                this.id = a.idCounter++;
                this.collideConnected = g.collideConnected;
                g.wakeUpBodies && (b && b.wakeUp(), k && k.wakeUp())
            }
            e.exports = a;
            var c = d("../utils/Utils");
            a.prototype.update = function() {
                throw Error("method update() not implmemented in this Constraint subclass!");
            };
            a.prototype.enable = function() {
                for (var b = this.equations, k = 0; k < b.length; k++) b[k].enabled = !0
            };
            a.prototype.disable = function() {
                for (var b = this.equations, k = 0; k < b.length; k++) b[k].enabled = !1
            };
            a.idCounter = 0
        }, {
            "../utils/Utils": 53
        }],
        14: [function(d, e, m) {
            function a(k, g, h, l) {
                c.call(this, k, g);
                "undefined" === typeof h && (h = k.position.distanceTo(g.position));
                "undefined" === typeof l && (l = 1E6);
                this.distance = h;
                k = this.distanceEquation = new b(k, g);
                this.equations.push(k);
                k.minForce = -l;
                k.maxForce = l
            }
            e.exports = a;
            var c = d("./Constraint"),
                b = d("../equations/ContactEquation");
            a.prototype = new c;
            a.prototype.update = function() {
                var k = this.distanceEquation,
                    g = .5 * this.distance,
                    h = k.ni;
                this.bodyB.position.vsub(this.bodyA.position, h);
                h.normalize();
                h.mult(g, k.ri);
                h.mult(-g, k.rj)
            }
        }, {
            "../equations/ContactEquation": 19,
            "./Constraint": 13
        }],
        15: [function(d, e, m) {
                function a(p, n, q) {
                    q = q || {};
                    var t = "undefined" !== typeof q.maxForce ? q.maxForce : 1E6,
                        r = q.pivotA ? q.pivotA.clone() : new g,
                        v = q.pivotB ? q.pivotB.clone() : new g;
                    c.call(this, p, r, n, v, t);
                    (this.axisA = q.axisA ? q.axisA.clone() : new g(1, 0, 0)).normalize();
                    (this.axisB = q.axisB ? q.axisB.clone() : new g(1, 0, 0)).normalize();
                    r = this.rotationalEquation1 = new b(p, n, q);
                    q = this.rotationalEquation2 = new b(p, n, q);
                    p = this.motorEquation = new k(p, n, t);
                    p.enabled = !1;
                    this.equations.push(r, q, p)
                }
                e.exports = a;
                d("./Constraint");
                var c = d("./PointToPointConstraint"),
                    b = d("../equations/RotationalEquation"),
                    k = d("../equations/RotationalMotorEquation");
                d("../equations/ContactEquation");
                var g = d("../math/Vec3");
                a.prototype = new c;
                a.constructor = a;
                a.prototype.enableMotor = function() {
                    this.motorEquation.enabled = !0
                };
                a.prototype.disableMotor = function() {
                    this.motorEquation.enabled = !1
                };
                a.prototype.setMotorSpeed = function(p) {
                    this.motorEquation.targetVelocity = p
                };
                a.prototype.setMotorMaxForce =
                    function(p) {
                        this.motorEquation.maxForce = p;
                        this.motorEquation.minForce = -p
                    };
                var h = new g,
                    l = new g;
                a.prototype.update = function() {
                    var p = this.bodyA,
                        n = this.bodyB,
                        q = this.motorEquation,
                        t = this.rotationalEquation1,
                        r = this.rotationalEquation2,
                        v = this.axisA,
                        x = this.axisB;
                    c.prototype.update.call(this);
                    p.quaternion.vmult(v, h);
                    n.quaternion.vmult(x, l);
                    h.tangents(t.axisA, r.axisA);
                    t.axisB.copy(l);
                    r.axisB.copy(l);
                    this.motorEquation.enabled && (p.quaternion.vmult(this.axisA, q.axisA), n.quaternion.vmult(this.axisB, q.axisB))
                }
            },
            {
                "../equations/ContactEquation": 19,
                "../equations/RotationalEquation": 22,
                "../equations/RotationalMotorEquation": 23,
                "../math/Vec3": 30,
                "./Constraint": 13,
                "./PointToPointConstraint": 17
            }
        ],
        16: [function(d, e, m) {
            function a(g, h, l) {
                l = l || {};
                var p = "undefined" !== typeof l.maxForce ? l.maxForce : 1E6,
                    n = new k,
                    q = new k,
                    t = new k;
                g.position.vadd(h.position, t);
                t.scale(.5, t);
                h.pointToLocalFrame(t, q);
                g.pointToLocalFrame(t, n);
                c.call(this, g, n, h, q, p);
                p = this.rotationalEquation1 = new b(g, h, l);
                n = this.rotationalEquation2 = new b(g, h, l);
                g = this.rotationalEquation3 = new b(g, h, l);
                this.equations.push(p, n, g)
            }
            e.exports = a;
            d("./Constraint");
            var c = d("./PointToPointConstraint"),
                b = d("../equations/RotationalEquation");
            d("../equations/RotationalMotorEquation");
            d("../equations/ContactEquation");
            var k = d("../math/Vec3");
            a.prototype = new c;
            a.constructor = a;
            new k;
            new k;
            a.prototype.update = function() {
                var g = this.bodyA,
                    h = this.bodyB,
                    l = this.rotationalEquation1,
                    p = this.rotationalEquation2,
                    n = this.rotationalEquation3;
                c.prototype.update.call(this);
                g.vectorToWorldFrame(k.UNIT_X,
                    l.axisA);
                h.vectorToWorldFrame(k.UNIT_Y, l.axisB);
                g.vectorToWorldFrame(k.UNIT_Y, p.axisA);
                h.vectorToWorldFrame(k.UNIT_Z, p.axisB);
                g.vectorToWorldFrame(k.UNIT_Z, n.axisA);
                h.vectorToWorldFrame(k.UNIT_X, n.axisB)
            }
        }, {
            "../equations/ContactEquation": 19,
            "../equations/RotationalEquation": 22,
            "../equations/RotationalMotorEquation": 23,
            "../math/Vec3": 30,
            "./Constraint": 13,
            "./PointToPointConstraint": 17
        }],
        17: [function(d, e, m) {
            function a(g, h, l, p, n) {
                c.call(this, g, l);
                n = "undefined" !== typeof n ? n : 1E6;
                this.pivotA = h ? h.clone() :
                    new k;
                this.pivotB = p ? p.clone() : new k;
                h = this.equationX = new b(g, l);
                p = this.equationY = new b(g, l);
                g = this.equationZ = new b(g, l);
                this.equations.push(h, p, g);
                h.minForce = p.minForce = g.minForce = -n;
                h.maxForce = p.maxForce = g.maxForce = n;
                h.ni.set(1, 0, 0);
                p.ni.set(0, 1, 0);
                g.ni.set(0, 0, 1)
            }
            e.exports = a;
            var c = d("./Constraint"),
                b = d("../equations/ContactEquation"),
                k = d("../math/Vec3");
            a.prototype = new c;
            a.prototype.update = function() {
                var g = this.bodyB,
                    h = this.equationX,
                    l = this.equationY,
                    p = this.equationZ;
                this.bodyA.quaternion.vmult(this.pivotA,
                    h.ri);
                g.quaternion.vmult(this.pivotB, h.rj);
                l.ri.copy(h.ri);
                l.rj.copy(h.rj);
                p.ri.copy(h.ri);
                p.rj.copy(h.rj)
            }
        }, {
            "../equations/ContactEquation": 19,
            "../math/Vec3": 30,
            "./Constraint": 13
        }],
        18: [function(d, e, m) {
            function a(h, l, p) {
                p = p || {};
                var n = "undefined" !== typeof p.maxForce ? p.maxForce : 1E6;
                b.call(this, h, l, -n, n);
                this.axisA = p.axisA ? p.axisA.clone() : new c(1, 0, 0);
                this.axisB = p.axisB ? p.axisB.clone() : new c(0, 1, 0);
                this.angle = "undefined" !== typeof p.angle ? p.angle : 0
            }
            e.exports = a;
            var c = d("../math/Vec3");
            d("../math/Mat3");
            var b = d("./Equation");
            a.prototype = new b;
            a.prototype.constructor = a;
            var k = new c,
                g = new c;
            a.prototype.computeB = function(h) {
                var l = this.a,
                    p = this.b,
                    n = this.axisA,
                    q = this.axisB,
                    t = this.jacobianElementA,
                    r = this.jacobianElementB;
                n.cross(q, k);
                q.cross(n, g);
                t.rotational.copy(g);
                r.rotational.copy(k);
                n = Math.cos(this.angle) - n.dot(q);
                q = this.computeGW();
                t = this.computeGiMf();
                return -n * l - q * p - h * t
            }
        }, {
            "../math/Mat3": 27,
            "../math/Vec3": 30,
            "./Equation": 20
        }],
        19: [function(d, e, m) {
            function a(r, v, x) {
                c.call(this, r, v, 0, "undefined" !==
                    typeof x ? x : 1E6);
                this.restitution = 0;
                this.ri = new b;
                this.rj = new b;
                this.ni = new b
            }
            e.exports = a;
            var c = d("./Equation"),
                b = d("../math/Vec3");
            d("../math/Mat3");
            a.prototype = new c;
            a.prototype.constructor = a;
            var k = new b,
                g = new b,
                h = new b;
            a.prototype.computeB = function(r) {
                var v = this.a,
                    x = this.b,
                    y = this.bi,
                    I = this.bj,
                    E = this.ri,
                    N = this.rj,
                    R = y.velocity,
                    T = y.angularVelocity,
                    M = I.velocity,
                    G = I.angularVelocity,
                    H = this.jacobianElementA,
                    S = this.jacobianElementB,
                    J = this.ni;
                E.cross(J, k);
                N.cross(J, g);
                J.negate(H.spatial);
                k.negate(H.rotational);
                S.spatial.copy(J);
                S.rotational.copy(g);
                h.copy(I.position);
                h.vadd(N, h);
                h.vsub(y.position, h);
                h.vsub(E, h);
                y = J.dot(h);
                I = this.restitution + 1;
                R = I * M.dot(J) - I * R.dot(J) + G.dot(g) - T.dot(k);
                T = this.computeGiMf();
                return -y * v - R * x - r * T
            };
            var l = new b,
                p = new b,
                n = new b,
                q = new b,
                t = new b;
            a.prototype.getImpactVelocityAlongNormal = function() {
                this.bi.position.vadd(this.ri, n);
                this.bj.position.vadd(this.rj, q);
                this.bi.getVelocityAtWorldPoint(n, l);
                this.bj.getVelocityAtWorldPoint(q, p);
                l.vsub(p, t);
                return this.ni.dot(t)
            }
        }, {
            "../math/Mat3": 27,
            "../math/Vec3": 30,
            "./Equation": 20
        }],
        20: [function(d, e, m) {
            function a(q, t, r, v) {
                this.id = a.id++;
                this.minForce = "undefined" === typeof r ? -1E6 : r;
                this.maxForce = "undefined" === typeof v ? 1E6 : v;
                this.bi = q;
                this.bj = t;
                this.eps = this.b = this.a = 0;
                this.jacobianElementA = new c;
                this.jacobianElementB = new c;
                this.enabled = !0;
                this.setSpookParams(1E7, 4, 1 / 60)
            }
            e.exports = a;
            var c = d("../math/JacobianElement");
            d = d("../math/Vec3");
            a.prototype.constructor = a;
            a.id = 0;
            a.prototype.setSpookParams = function(q, t, r) {
                this.a = 4 / (r * (1 + 4 * t));
                this.b = 4 * t /
                    (1 + 4 * t);
                this.eps = 4 / (r * r * q * (1 + 4 * t))
            };
            a.prototype.computeB = function(q, t, r) {
                var v = this.computeGW(),
                    x = this.computeGq(),
                    y = this.computeGiMf();
                return -x * q - v * t - y * r
            };
            a.prototype.computeGq = function() {
                var q = this.jacobianElementB,
                    t = this.bj.position;
                return this.jacobianElementA.spatial.dot(this.bi.position) + q.spatial.dot(t)
            };
            var b = new d;
            a.prototype.computeGW = function() {
                var q = this.jacobianElementB,
                    t = this.bi,
                    r = this.bj,
                    v = r.velocity;
                r = r.angularVelocity || b;
                return this.jacobianElementA.multiplyVectors(t.velocity, t.angularVelocity ||
                    b) + q.multiplyVectors(v, r)
            };
            a.prototype.computeGWlambda = function() {
                var q = this.jacobianElementB,
                    t = this.bi,
                    r = this.bj,
                    v = r.vlambda;
                r = r.wlambda || b;
                return this.jacobianElementA.multiplyVectors(t.vlambda, t.wlambda || b) + q.multiplyVectors(v, r)
            };
            var k = new d,
                g = new d,
                h = new d,
                l = new d;
            a.prototype.computeGiMf = function() {
                var q = this.jacobianElementA,
                    t = this.jacobianElementB,
                    r = this.bi,
                    v = this.bj,
                    x = r.force,
                    y = r.torque,
                    I = v.force,
                    E = v.torque,
                    N = r.invMassSolve,
                    R = v.invMassSolve;
                r.invInertiaWorldSolve ? r.invInertiaWorldSolve.vmult(y,
                    h) : h.set(0, 0, 0);
                v.invInertiaWorldSolve ? v.invInertiaWorldSolve.vmult(E, l) : l.set(0, 0, 0);
                x.mult(N, k);
                I.mult(R, g);
                return q.multiplyVectors(k, h) + t.multiplyVectors(g, l)
            };
            var p = new d;
            a.prototype.computeGiMGt = function() {
                var q = this.jacobianElementA,
                    t = this.jacobianElementB,
                    r = this.bi,
                    v = this.bj,
                    x = r.invInertiaWorldSolve,
                    y = v.invInertiaWorldSolve;
                r = r.invMassSolve + v.invMassSolve;
                x && (x.vmult(q.rotational, p), r += p.dot(q.rotational));
                y && (y.vmult(t.rotational, p), r += p.dot(t.rotational));
                return r
            };
            var n = new d;
            new d;
            new d;
            new d;
            new d;
            new d;
            a.prototype.addToWlambda = function(q) {
                var t = this.jacobianElementA,
                    r = this.jacobianElementB,
                    v = this.bi,
                    x = this.bj;
                t.spatial.mult(v.invMassSolve * q, n);
                v.vlambda.vadd(n, v.vlambda);
                r.spatial.mult(x.invMassSolve * q, n);
                x.vlambda.vadd(n, x.vlambda);
                v.invInertiaWorldSolve && (v.invInertiaWorldSolve.vmult(t.rotational, n), n.mult(q, n), v.wlambda.vadd(n, v.wlambda));
                x.invInertiaWorldSolve && (x.invInertiaWorldSolve.vmult(r.rotational, n), n.mult(q, n), x.wlambda.vadd(n, x.wlambda))
            };
            a.prototype.computeC = function() {
                return this.computeGiMGt() +
                    this.eps
            }
        }, {
            "../math/JacobianElement": 26,
            "../math/Vec3": 30
        }],
        21: [function(d, e, m) {
            function a(h, l, p) {
                c.call(this, h, l, -p, p);
                this.ri = new b;
                this.rj = new b;
                this.t = new b
            }
            e.exports = a;
            var c = d("./Equation"),
                b = d("../math/Vec3");
            d("../math/Mat3");
            a.prototype = new c;
            a.prototype.constructor = a;
            var k = new b,
                g = new b;
            a.prototype.computeB = function(h) {
                var l = this.b,
                    p = this.rj,
                    n = this.t;
                this.ri.cross(n, k);
                p.cross(n, g);
                p = this.jacobianElementA;
                var q = this.jacobianElementB;
                n.negate(p.spatial);
                k.negate(p.rotational);
                q.spatial.copy(n);
                q.rotational.copy(g);
                n = this.computeGW();
                p = this.computeGiMf();
                return -n * l - h * p
            }
        }, {
            "../math/Mat3": 27,
            "../math/Vec3": 30,
            "./Equation": 20
        }],
        22: [function(d, e, m) {
            function a(h, l, p) {
                p = p || {};
                var n = "undefined" !== typeof p.maxForce ? p.maxForce : 1E6;
                b.call(this, h, l, -n, n);
                this.axisA = p.axisA ? p.axisA.clone() : new c(1, 0, 0);
                this.axisB = p.axisB ? p.axisB.clone() : new c(0, 1, 0);
                this.maxAngle = Math.PI / 2
            }
            e.exports = a;
            var c = d("../math/Vec3");
            d("../math/Mat3");
            var b = d("./Equation");
            a.prototype = new b;
            a.prototype.constructor = a;
            var k = new c,
                g = new c;
            a.prototype.computeB = function(h) {
                var l = this.a,
                    p = this.b,
                    n = this.axisA,
                    q = this.axisB,
                    t = this.jacobianElementA,
                    r = this.jacobianElementB;
                n.cross(q, k);
                q.cross(n, g);
                t.rotational.copy(g);
                r.rotational.copy(k);
                n = Math.cos(this.maxAngle) - n.dot(q);
                q = this.computeGW();
                t = this.computeGiMf();
                return -n * l - q * p - h * t
            }
        }, {
            "../math/Mat3": 27,
            "../math/Vec3": 30,
            "./Equation": 20
        }],
        23: [function(d, e, m) {
            function a(k, g, h) {
                h = "undefined" !== typeof h ? h : 1E6;
                b.call(this, k, g, -h, h);
                this.axisA = new c;
                this.axisB = new c;
                this.targetVelocity =
                    0
            }
            e.exports = a;
            var c = d("../math/Vec3");
            d("../math/Mat3");
            var b = d("./Equation");
            a.prototype = new b;
            a.prototype.constructor = a;
            a.prototype.computeB = function(k) {
                var g = this.b,
                    h = this.axisB,
                    l = this.jacobianElementB;
                this.jacobianElementA.rotational.copy(this.axisA);
                h.negate(l.rotational);
                h = this.computeGW() - this.targetVelocity;
                l = this.computeGiMf();
                return -h * g - k * l
            }
        }, {
            "../math/Mat3": 27,
            "../math/Vec3": 30,
            "./Equation": 20
        }],
        24: [function(d, e, m) {
            function a(b, k, g) {
                g = c.defaults(g, {
                    friction: .3,
                    restitution: .3,
                    contactEquationStiffness: 1E7,
                    contactEquationRelaxation: 3,
                    frictionEquationStiffness: 1E7,
                    frictionEquationRelaxation: 3
                });
                this.id = a.idCounter++;
                this.materials = [b, k];
                this.friction = g.friction;
                this.restitution = g.restitution;
                this.contactEquationStiffness = g.contactEquationStiffness;
                this.contactEquationRelaxation = g.contactEquationRelaxation;
                this.frictionEquationStiffness = g.frictionEquationStiffness;
                this.frictionEquationRelaxation = g.frictionEquationRelaxation
            }
            var c = d("../utils/Utils");
            e.exports = a;
            a.idCounter = 0
        }, {
            "../utils/Utils": 53
        }],
        25: [function(d,
            e, m) {
            function a(c) {
                var b = "";
                c = c || {};
                "string" === typeof c ? (b = c, c = {}) : "object" === typeof c && (b = "");
                this.name = b;
                this.id = a.idCounter++;
                this.friction = "undefined" !== typeof c.friction ? c.friction : -1;
                this.restitution = "undefined" !== typeof c.restitution ? c.restitution : -1
            }
            e.exports = a;
            a.idCounter = 0
        }, {}],
        26: [function(d, e, m) {
            function a() {
                this.spatial = new c;
                this.rotational = new c
            }
            e.exports = a;
            var c = d("./Vec3");
            a.prototype.multiplyElement = function(b) {
                return b.spatial.dot(this.spatial) + b.rotational.dot(this.rotational)
            };
            a.prototype.multiplyVectors = function(b, k) {
                return b.dot(this.spatial) + k.dot(this.rotational)
            }
        }, {
            "./Vec3": 30
        }],
        27: [function(d, e, m) {
            function a(b) {
                this.elements = b ? b : [0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
            e.exports = a;
            var c = d("./Vec3");
            a.prototype.identity = function() {
                var b = this.elements;
                b[0] = 1;
                b[1] = 0;
                b[2] = 0;
                b[3] = 0;
                b[4] = 1;
                b[5] = 0;
                b[6] = 0;
                b[7] = 0;
                b[8] = 1
            };
            a.prototype.setZero = function() {
                var b = this.elements;
                b[0] = 0;
                b[1] = 0;
                b[2] = 0;
                b[3] = 0;
                b[4] = 0;
                b[5] = 0;
                b[6] = 0;
                b[7] = 0;
                b[8] = 0
            };
            a.prototype.setTrace = function(b) {
                var k = this.elements;
                k[0] = b.x;
                k[4] = b.y;
                k[8] = b.z
            };
            a.prototype.getTrace = function(b) {
                b = b || new c;
                var k = this.elements;
                b.x = k[0];
                b.y = k[4];
                b.z = k[8]
            };
            a.prototype.vmult = function(b, k) {
                k = k || new c;
                var g = this.elements,
                    h = b.x,
                    l = b.y,
                    p = b.z;
                k.x = g[0] * h + g[1] * l + g[2] * p;
                k.y = g[3] * h + g[4] * l + g[5] * p;
                k.z = g[6] * h + g[7] * l + g[8] * p;
                return k
            };
            a.prototype.smult = function(b) {
                for (var k = 0; k < this.elements.length; k++) this.elements[k] *= b
            };
            a.prototype.mmult = function(b, k) {
                for (var g = k || new a, h = 0; 3 > h; h++)
                    for (var l = 0; 3 > l; l++) {
                        for (var p = 0, n = 0; 3 > n; n++) p += b.elements[h + 3 * n] * this.elements[n +
                            3 * l];
                        g.elements[h + 3 * l] = p
                    }
                return g
            };
            a.prototype.scale = function(b, k) {
                k = k || new a;
                for (var g = this.elements, h = k.elements, l = 0; 3 !== l; l++) h[3 * l] = b.x * g[3 * l], h[3 * l + 1] = b.y * g[3 * l + 1], h[3 * l + 2] = b.z * g[3 * l + 2];
                return k
            };
            a.prototype.solve = function(b, k) {
                k = k || new c;
                for (var g = [], h = 0; 12 > h; h++) g.push(0);
                var l;
                for (h = 0; 3 > h; h++)
                    for (l = 0; 3 > l; l++) g[h + 4 * l] = this.elements[h + 3 * l];
                g[3] = b.x;
                g[7] = b.y;
                g[11] = b.z;
                var p = 3,
                    n = p;
                do {
                    h = n - p;
                    if (0 === g[h + 4 * h])
                        for (l = h + 1; l < n; l++)
                            if (0 !== g[h + 4 * l]) {
                                var q = 4;
                                do {
                                    var t = 4 - q;
                                    g[t + 4 * h] += g[t + 4 * l]
                                } while (--q);
                                break
                            } if (0 !==
                        g[h + 4 * h])
                        for (l = h + 1; l < n; l++) {
                            var r = g[h + 4 * l] / g[h + 4 * h];
                            q = 4;
                            do t = 4 - q, g[t + 4 * l] = t <= h ? 0 : g[t + 4 * l] - g[t + 4 * h] * r; while (--q)
                        }
                } while (--p);
                k.z = g[11] / g[10];
                k.y = (g[7] - g[6] * k.z) / g[5];
                k.x = (g[3] - g[2] * k.z - g[1] * k.y) / g[0];
                if (isNaN(k.x) || isNaN(k.y) || isNaN(k.z) || Infinity === k.x || Infinity === k.y || Infinity === k.z) throw "Could not solve equation! Got x=[" + k.toString() + "], b=[" + b.toString() + "], A=[" + this.toString() + "]";
                return k
            };
            a.prototype.e = function(b, k, g) {
                if (void 0 === g) return this.elements[k + 3 * b];
                this.elements[k + 3 * b] = g
            };
            a.prototype.copy =
                function(b) {
                    for (var k = 0; k < b.elements.length; k++) this.elements[k] = b.elements[k];
                    return this
                };
            a.prototype.toString = function() {
                for (var b = "", k = 0; 9 > k; k++) b += this.elements[k] + ",";
                return b
            };
            a.prototype.reverse = function(b) {
                b = b || new a;
                for (var k = [], g = 0; 18 > g; g++) k.push(0);
                var h;
                for (g = 0; 3 > g; g++)
                    for (h = 0; 3 > h; h++) k[g + 6 * h] = this.elements[g + 3 * h];
                k[3] = 1;
                k[9] = 0;
                k[15] = 0;
                k[4] = 0;
                k[10] = 1;
                k[16] = 0;
                k[5] = 0;
                k[11] = 0;
                k[17] = 1;
                var l = 3,
                    p = l;
                do {
                    g = p - l;
                    if (0 === k[g + 6 * g])
                        for (h = g + 1; h < p; h++)
                            if (0 !== k[g + 6 * h]) {
                                var n = 6;
                                do {
                                    var q = 6 - n;
                                    k[q + 6 * g] +=
                                        k[q + 6 * h]
                                } while (--n);
                                break
                            } if (0 !== k[g + 6 * g])
                        for (h = g + 1; h < p; h++) {
                            var t = k[g + 6 * h] / k[g + 6 * g];
                            n = 6;
                            do q = 6 - n, k[q + 6 * h] = q <= g ? 0 : k[q + 6 * h] - k[q + 6 * g] * t; while (--n)
                        }
                } while (--l);
                g = 2;
                do {
                    h = g - 1;
                    do {
                        t = k[g + 6 * h] / k[g + 6 * g];
                        n = 6;
                        do q = 6 - n, k[q + 6 * h] -= k[q + 6 * g] * t; while (--n)
                    } while (h--)
                } while (--g);
                g = 2;
                do {
                    t = 1 / k[g + 6 * g];
                    n = 6;
                    do q = 6 - n, k[q + 6 * g] *= t; while (--n)
                } while (g--);
                g = 2;
                do {
                    h = 2;
                    do {
                        q = k[3 + h + 6 * g];
                        if (isNaN(q) || Infinity === q) throw "Could not reverse! A=[" + this.toString() + "]";
                        b.e(g, h, q)
                    } while (h--)
                } while (g--);
                return b
            };
            a.prototype.setRotationFromQuaternion =
                function(b) {
                    var k = b.x,
                        g = b.y,
                        h = b.z,
                        l = b.w,
                        p = k + k,
                        n = g + g,
                        q = h + h;
                    b = k * p;
                    var t = k * n;
                    k *= q;
                    var r = g * n;
                    g *= q;
                    h *= q;
                    p *= l;
                    n *= l;
                    l *= q;
                    q = this.elements;
                    q[0] = 1 - (r + h);
                    q[1] = t - l;
                    q[2] = k + n;
                    q[3] = t + l;
                    q[4] = 1 - (b + h);
                    q[5] = g - p;
                    q[6] = k - n;
                    q[7] = g + p;
                    q[8] = 1 - (b + r);
                    return this
                };
            a.prototype.transpose = function(b) {
                b = b || new a;
                for (var k = b.elements, g = this.elements, h = 0; 3 !== h; h++)
                    for (var l = 0; 3 !== l; l++) k[3 * h + l] = g[3 * l + h];
                return b
            }
        }, {
            "./Vec3": 30
        }],
        28: [function(d, e, m) {
            function a(p, n, q, t) {
                this.x = void 0 !== p ? p : 0;
                this.y = void 0 !== n ? n : 0;
                this.z = void 0 !== q ? q :
                    0;
                this.w = void 0 !== t ? t : 1
            }
            e.exports = a;
            var c = d("./Vec3");
            a.prototype.set = function(p, n, q, t) {
                this.x = p;
                this.y = n;
                this.z = q;
                this.w = t
            };
            a.prototype.toString = function() {
                return this.x + "," + this.y + "," + this.z + "," + this.w
            };
            a.prototype.toArray = function() {
                return [this.x, this.y, this.z, this.w]
            };
            a.prototype.setFromAxisAngle = function(p, n) {
                var q = Math.sin(.5 * n);
                this.x = p.x * q;
                this.y = p.y * q;
                this.z = p.z * q;
                this.w = Math.cos(.5 * n)
            };
            a.prototype.toAxisAngle = function(p) {
                p = p || new c;
                this.normalize();
                var n = 2 * Math.acos(this.w),
                    q = Math.sqrt(1 -
                        this.w * this.w);
                .001 > q ? (p.x = this.x, p.y = this.y, p.z = this.z) : (p.x = this.x / q, p.y = this.y / q, p.z = this.z / q);
                return [p, n]
            };
            var b = new c,
                k = new c;
            a.prototype.setFromVectors = function(p, n) {
                if (p.isAntiparallelTo(n)) p.tangents(b, k), this.setFromAxisAngle(b, Math.PI);
                else {
                    var q = p.cross(n);
                    this.x = q.x;
                    this.y = q.y;
                    this.z = q.z;
                    this.w = Math.sqrt(Math.pow(p.norm(), 2) * Math.pow(n.norm(), 2)) + p.dot(n);
                    this.normalize()
                }
            };
            var g = new c,
                h = new c,
                l = new c;
            a.prototype.mult = function(p, n) {
                n = n || new a;
                var q = this.w;
                g.set(this.x, this.y, this.z);
                h.set(p.x,
                    p.y, p.z);
                n.w = q * p.w - g.dot(h);
                g.cross(h, l);
                n.x = q * h.x + p.w * g.x + l.x;
                n.y = q * h.y + p.w * g.y + l.y;
                n.z = q * h.z + p.w * g.z + l.z;
                return n
            };
            a.prototype.inverse = function(p) {
                var n = this.x,
                    q = this.y,
                    t = this.z,
                    r = this.w;
                p = p || new a;
                this.conjugate(p);
                n = 1 / (n * n + q * q + t * t + r * r);
                p.x *= n;
                p.y *= n;
                p.z *= n;
                p.w *= n;
                return p
            };
            a.prototype.conjugate = function(p) {
                p = p || new a;
                p.x = -this.x;
                p.y = -this.y;
                p.z = -this.z;
                p.w = this.w;
                return p
            };
            a.prototype.normalize = function() {
                var p = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
                0 === p ? this.w = this.z =
                    this.y = this.x = 0 : (p = 1 / p, this.x *= p, this.y *= p, this.z *= p, this.w *= p)
            };
            a.prototype.normalizeFast = function() {
                var p = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
                0 === p ? this.w = this.z = this.y = this.x = 0 : (this.x *= p, this.y *= p, this.z *= p, this.w *= p)
            };
            a.prototype.vmult = function(p, n) {
                n = n || new c;
                var q = p.x,
                    t = p.y,
                    r = p.z,
                    v = this.x,
                    x = this.y,
                    y = this.z,
                    I = this.w,
                    E = I * q + x * r - y * t,
                    N = I * t + y * q - v * r,
                    R = I * r + v * t - x * q;
                q = -v * q - x * t - y * r;
                n.x = E * I + q * -v + N * -y - R * -x;
                n.y = N * I + q * -x + R * -v - E * -y;
                n.z = R * I + q * -y + E * -x - N * -v;
                return n
            };
            a.prototype.copy =
                function(p) {
                    this.x = p.x;
                    this.y = p.y;
                    this.z = p.z;
                    this.w = p.w;
                    return this
                };
            a.prototype.toEuler = function(p, n) {
                n = n || "YZX";
                var q = this.x,
                    t = this.y,
                    r = this.z,
                    v = this.w;
                switch (n) {
                    case "YZX":
                        var x = q * t + r * v;
                        if (.499 < x) {
                            var y = 2 * Math.atan2(q, v);
                            var I = Math.PI / 2;
                            var E = 0
                        } - .499 > x && (y = -2 * Math.atan2(q, v), I = -Math.PI / 2, E = 0);
                        isNaN(y) && (E = r * r, y = Math.atan2(2 * t * v - 2 * q * r, 1 - 2 * t * t - 2 * E), I = Math.asin(2 * x), E = Math.atan2(2 * q * v - 2 * t * r, 1 - 2 * q * q - 2 * E));
                        break;
                    default:
                        throw Error("Euler order " + n + " not supported yet.");
                }
                p.y = y;
                p.z = I;
                p.x = E
            };
            a.prototype.setFromEuler =
                function(p, n, q, t) {
                    t = t || "XYZ";
                    var r = Math.cos(p / 2),
                        v = Math.cos(n / 2),
                        x = Math.cos(q / 2);
                    p = Math.sin(p / 2);
                    n = Math.sin(n / 2);
                    q = Math.sin(q / 2);
                    "XYZ" === t ? (this.x = p * v * x + r * n * q, this.y = r * n * x - p * v * q, this.z = r * v * q + p * n * x, this.w = r * v * x - p * n * q) : "YXZ" === t ? (this.x = p * v * x + r * n * q, this.y = r * n * x - p * v * q, this.z = r * v * q - p * n * x, this.w = r * v * x + p * n * q) : "ZXY" === t ? (this.x = p * v * x - r * n * q, this.y = r * n * x + p * v * q, this.z = r * v * q + p * n * x, this.w = r * v * x - p * n * q) : "ZYX" === t ? (this.x = p * v * x - r * n * q, this.y = r * n * x + p * v * q, this.z = r * v * q - p * n * x, this.w = r * v * x + p * n * q) : "YZX" === t ? (this.x = p *
                        v * x + r * n * q, this.y = r * n * x + p * v * q, this.z = r * v * q - p * n * x, this.w = r * v * x - p * n * q) : "XZY" === t && (this.x = p * v * x - r * n * q, this.y = r * n * x - p * v * q, this.z = r * v * q + p * n * x, this.w = r * v * x + p * n * q);
                    return this
                };
            a.prototype.clone = function() {
                return new a(this.x, this.y, this.z, this.w)
            }
        }, {
            "./Vec3": 30
        }],
        29: [function(d, e, m) {
            function a(g) {
                g = g || {};
                this.position = new c;
                g.position && this.position.copy(g.position);
                this.quaternion = new b;
                g.quaternion && this.quaternion.copy(g.quaternion)
            }
            var c = d("./Vec3"),
                b = d("./Quaternion");
            e.exports = a;
            var k = new b;
            a.pointToLocalFrame =
                function(g, h, l, p) {
                    p = p || new c;
                    l.vsub(g, p);
                    h.conjugate(k);
                    k.vmult(p, p);
                    return p
                };
            a.prototype.pointToLocal = function(g, h) {
                return a.pointToLocalFrame(this.position, this.quaternion, g, h)
            };
            a.pointToWorldFrame = function(g, h, l, p) {
                p = p || new c;
                h.vmult(l, p);
                p.vadd(g, p);
                return p
            };
            a.prototype.pointToWorld = function(g, h) {
                return a.pointToWorldFrame(this.position, this.quaternion, g, h)
            };
            a.prototype.vectorToWorldFrame = function(g, h) {
                h = h || new c;
                this.quaternion.vmult(g, h);
                return h
            };
            a.vectorToWorldFrame = function(g, h, l) {
                g.vmult(h,
                    l);
                return l
            };
            a.vectorToLocalFrame = function(g, h, l, p) {
                p = p || new c;
                h.w *= -1;
                h.vmult(l, p);
                h.w *= -1;
                return p
            }
        }, {
            "./Quaternion": 28,
            "./Vec3": 30
        }],
        30: [function(d, e, m) {
            function a(h, l, p) {
                this.x = h || 0;
                this.y = l || 0;
                this.z = p || 0
            }
            e.exports = a;
            var c = d("./Mat3");
            a.ZERO = new a(0, 0, 0);
            a.UNIT_X = new a(1, 0, 0);
            a.UNIT_Y = new a(0, 1, 0);
            a.UNIT_Z = new a(0, 0, 1);
            a.prototype.cross = function(h, l) {
                var p = h.x,
                    n = h.y,
                    q = h.z,
                    t = this.x,
                    r = this.y,
                    v = this.z;
                l = l || new a;
                l.x = r * q - v * n;
                l.y = v * p - t * q;
                l.z = t * n - r * p;
                return l
            };
            a.prototype.set = function(h, l, p) {
                this.x =
                    h;
                this.y = l;
                this.z = p;
                return this
            };
            a.prototype.setZero = function() {
                this.x = this.y = this.z = 0
            };
            a.prototype.vadd = function(h, l) {
                if (l) l.x = h.x + this.x, l.y = h.y + this.y, l.z = h.z + this.z;
                else return new a(this.x + h.x, this.y + h.y, this.z + h.z)
            };
            a.prototype.vsub = function(h, l) {
                if (l) l.x = this.x - h.x, l.y = this.y - h.y, l.z = this.z - h.z;
                else return new a(this.x - h.x, this.y - h.y, this.z - h.z)
            };
            a.prototype.crossmat = function() {
                return new c([0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0])
            };
            a.prototype.normalize = function() {
                var h = this.x,
                    l = this.y,
                    p = this.z;
                h = Math.sqrt(h * h + l * l + p * p);
                0 < h ? (l = 1 / h, this.x *= l, this.y *= l, this.z *= l) : this.z = this.y = this.x = 0;
                return h
            };
            a.prototype.unit = function(h) {
                h = h || new a;
                var l = this.x,
                    p = this.y,
                    n = this.z,
                    q = Math.sqrt(l * l + p * p + n * n);
                0 < q ? (q = 1 / q, h.x = l * q, h.y = p * q, h.z = n * q) : (h.x = 1, h.y = 0, h.z = 0);
                return h
            };
            a.prototype.norm = function() {
                var h = this.x,
                    l = this.y,
                    p = this.z;
                return Math.sqrt(h * h + l * l + p * p)
            };
            a.prototype.length = a.prototype.norm;
            a.prototype.norm2 = function() {
                return this.dot(this)
            };
            a.prototype.lengthSquared = a.prototype.norm2;
            a.prototype.distanceTo = function(h) {
                var l = this.x,
                    p = this.y,
                    n = this.z,
                    q = h.x,
                    t = h.y;
                h = h.z;
                return Math.sqrt((q - l) * (q - l) + (t - p) * (t - p) + (h - n) * (h - n))
            };
            a.prototype.distanceSquared = function(h) {
                var l = this.x,
                    p = this.y,
                    n = this.z,
                    q = h.x,
                    t = h.y;
                h = h.z;
                return (q - l) * (q - l) + (t - p) * (t - p) + (h - n) * (h - n)
            };
            a.prototype.mult = function(h, l) {
                l = l || new a;
                var p = this.y,
                    n = this.z;
                l.x = h * this.x;
                l.y = h * p;
                l.z = h * n;
                return l
            };
            a.prototype.scale = a.prototype.mult;
            a.prototype.dot = function(h) {
                return this.x * h.x + this.y * h.y + this.z * h.z
            };
            a.prototype.isZero = function() {
                return 0 ===
                    this.x && 0 === this.y && 0 === this.z
            };
            a.prototype.negate = function(h) {
                h = h || new a;
                h.x = -this.x;
                h.y = -this.y;
                h.z = -this.z;
                return h
            };
            var b = new a,
                k = new a;
            a.prototype.tangents = function(h, l) {
                var p = this.norm();
                0 < p ? (p = 1 / p, b.set(this.x * p, this.y * p, this.z * p), .9 > Math.abs(b.x) ? k.set(1, 0, 0) : k.set(0, 1, 0), b.cross(k, h), b.cross(h, l)) : (h.set(1, 0, 0), l.set(0, 1, 0))
            };
            a.prototype.toString = function() {
                return this.x + "," + this.y + "," + this.z
            };
            a.prototype.toArray = function() {
                return [this.x, this.y, this.z]
            };
            a.prototype.copy = function(h) {
                this.x =
                    h.x;
                this.y = h.y;
                this.z = h.z;
                return this
            };
            a.prototype.lerp = function(h, l, p) {
                var n = this.x,
                    q = this.y,
                    t = this.z;
                p.x = n + (h.x - n) * l;
                p.y = q + (h.y - q) * l;
                p.z = t + (h.z - t) * l
            };
            a.prototype.almostEquals = function(h, l) {
                void 0 === l && (l = 1E-6);
                return Math.abs(this.x - h.x) > l || Math.abs(this.y - h.y) > l || Math.abs(this.z - h.z) > l ? !1 : !0
            };
            a.prototype.almostZero = function(h) {
                void 0 === h && (h = 1E-6);
                return Math.abs(this.x) > h || Math.abs(this.y) > h || Math.abs(this.z) > h ? !1 : !0
            };
            var g = new a;
            a.prototype.isAntiparallelTo = function(h, l) {
                this.negate(g);
                return g.almostEquals(h,
                    l)
            };
            a.prototype.clone = function() {
                return new a(this.x, this.y, this.z)
            }
        }, {
            "./Mat3": 27
        }],
        31: [function(d, e, m) {
            function a(H) {
                H = H || {};
                c.apply(this);
                this.id = a.idCounter++;
                this.postStep = this.preStep = this.world = null;
                this.vlambda = new b;
                this.collisionFilterGroup = "number" === typeof H.collisionFilterGroup ? H.collisionFilterGroup : 1;
                this.collisionFilterMask = "number" === typeof H.collisionFilterMask ? H.collisionFilterMask : 1;
                this.collisionResponse = !0;
                this.position = new b;
                H.position && this.position.copy(H.position);
                this.previousPosition =
                    new b;
                this.initPosition = new b;
                this.velocity = new b;
                H.velocity && this.velocity.copy(H.velocity);
                this.initVelocity = new b;
                this.force = new b;
                var S = "number" === typeof H.mass ? H.mass : 0;
                this.mass = S;
                this.invMass = 0 < S ? 1 / S : 0;
                this.material = H.material || null;
                this.linearDamping = "number" === typeof H.linearDamping ? H.linearDamping : .01;
                this.type = 0 >= S ? a.STATIC : a.DYNAMIC;
                typeof H.type === typeof a.STATIC && (this.type = H.type);
                this.allowSleep = "undefined" !== typeof H.allowSleep ? H.allowSleep : !0;
                this.sleepState = 0;
                this.sleepSpeedLimit =
                    "undefined" !== typeof H.sleepSpeedLimit ? H.sleepSpeedLimit : .1;
                this.sleepTimeLimit = "undefined" !== typeof H.sleepTimeLimit ? H.sleepTimeLimit : 1;
                this.timeLastSleepy = 0;
                this._wakeUpAfterNarrowphase = !1;
                this.torque = new b;
                this.quaternion = new g;
                H.quaternion && this.quaternion.copy(H.quaternion);
                this.initQuaternion = new g;
                this.angularVelocity = new b;
                H.angularVelocity && this.angularVelocity.copy(H.angularVelocity);
                this.initAngularVelocity = new b;
                this.interpolatedPosition = new b;
                this.interpolatedQuaternion = new g;
                this.shapes = [];
                this.shapeOffsets = [];
                this.shapeOrientations = [];
                this.inertia = new b;
                this.invInertia = new b;
                this.invInertiaWorld = new k;
                this.invMassSolve = 0;
                this.invInertiaSolve = new b;
                this.invInertiaWorldSolve = new k;
                this.fixedRotation = "undefined" !== typeof H.fixedRotation ? H.fixedRotation : !1;
                this.angularDamping = "undefined" !== typeof H.angularDamping ? H.angularDamping : .01;
                this.userData = "undefined" !== typeof H.userData ? H.userData : null;
                this.aabb = new h;
                this.aabbNeedsUpdate = !0;
                this.wlambda = new b;
                H.shape && this.addShape(H.shape);
                this.updateMassProperties()
            }
            e.exports = a;
            var c = d("../utils/EventTarget");
            d("../shapes/Shape");
            var b = d("../math/Vec3"),
                k = d("../math/Mat3"),
                g = d("../math/Quaternion");
            d("../material/Material");
            var h = d("../collision/AABB"),
                l = d("../shapes/Box");
            a.prototype = new c;
            a.prototype.constructor = a;
            a.DYNAMIC = 1;
            a.STATIC = 2;
            a.KINEMATIC = 4;
            a.AWAKE = 0;
            a.SLEEPY = 1;
            a.SLEEPING = 2;
            a.idCounter = 0;
            a.prototype.wakeUp = function() {
                var H = this.sleepState;
                this.sleepState = 0;
                H === a.SLEEPING && this.dispatchEvent({
                    type: "wakeup"
                })
            };
            a.prototype.sleep =
                function() {
                    this.sleepState = a.SLEEPING;
                    this.velocity.set(0, 0, 0);
                    this.angularVelocity.set(0, 0, 0)
                };
            a.sleepyEvent = {
                type: "sleepy"
            };
            a.sleepEvent = {
                type: "sleep"
            };
            a.prototype.sleepTick = function(H) {
                if (this.allowSleep) {
                    var S = this.sleepState,
                        J = this.velocity.norm2() + this.angularVelocity.norm2(),
                        ca = Math.pow(this.sleepSpeedLimit, 2);
                    S === a.AWAKE && J < ca ? (this.sleepState = a.SLEEPY, this.timeLastSleepy = H, this.dispatchEvent(a.sleepyEvent)) : S === a.SLEEPY && J > ca ? this.wakeUp() : S === a.SLEEPY && H - this.timeLastSleepy > this.sleepTimeLimit &&
                        (this.sleep(), this.dispatchEvent(a.sleepEvent))
                }
            };
            a.prototype.updateSolveMassProperties = function() {
                this.sleepState === a.SLEEPING || this.type === a.KINEMATIC ? (this.invMassSolve = 0, this.invInertiaSolve.setZero(), this.invInertiaWorldSolve.setZero()) : (this.invMassSolve = this.invMass, this.invInertiaSolve.copy(this.invInertia), this.invInertiaWorldSolve.copy(this.invInertiaWorld))
            };
            a.prototype.pointToLocalFrame = function(H, S) {
                S = S || new b;
                H.vsub(this.position, S);
                this.quaternion.conjugate().vmult(S, S);
                return S
            };
            a.prototype.vectorToLocalFrame =
                function(H, S) {
                    S = S || new b;
                    this.quaternion.conjugate().vmult(H, S);
                    return S
                };
            a.prototype.pointToWorldFrame = function(H, S) {
                S = S || new b;
                this.quaternion.vmult(H, S);
                S.vadd(this.position, S);
                return S
            };
            a.prototype.vectorToWorldFrame = function(H, S) {
                S = S || new b;
                this.quaternion.vmult(H, S);
                return S
            };
            var p = new b,
                n = new g;
            a.prototype.addShape = function(H, S, J) {
                var ca = new b,
                    O = new g;
                S && ca.copy(S);
                J && O.copy(J);
                this.shapes.push(H);
                this.shapeOffsets.push(ca);
                this.shapeOrientations.push(O);
                this.updateMassProperties();
                this.updateBoundingRadius();
                this.aabbNeedsUpdate = !0;
                return this
            };
            a.prototype.updateBoundingRadius = function() {
                for (var H = this.shapes, S = this.shapeOffsets, J = H.length, ca = 0, O = 0; O !== J; O++) {
                    var Y = H[O];
                    Y.updateBoundingSphereRadius();
                    var K = S[O].norm();
                    Y = Y.boundingSphereRadius;
                    K + Y > ca && (ca = K + Y)
                }
                this.boundingRadius = ca
            };
            var q = new h;
            a.prototype.computeAABB = function() {
                for (var H = this.shapes, S = this.shapeOffsets, J = this.shapeOrientations, ca = H.length, O = this.quaternion, Y = this.aabb, K = 0; K !== ca; K++) {
                    var z = H[K];
                    J[K].mult(O, n);
                    n.vmult(S[K], p);
                    p.vadd(this.position,
                        p);
                    z.calculateWorldAABB(p, n, q.lowerBound, q.upperBound);
                    0 === K ? Y.copy(q) : Y.extend(q)
                }
                this.aabbNeedsUpdate = !1
            };
            var t = new k,
                r = new k;
            new k;
            a.prototype.updateInertiaWorld = function(H) {
                var S = this.invInertia;
                if (S.x !== S.y || S.y !== S.z || H) t.setRotationFromQuaternion(this.quaternion), t.transpose(r), t.scale(S, t), t.mmult(r, this.invInertiaWorld)
            };
            var v = new b,
                x = new b;
            a.prototype.applyForce = function(H, S) {
                this.type === a.DYNAMIC && (S.vsub(this.position, v), v.cross(H, x), this.force.vadd(H, this.force), this.torque.vadd(x, this.torque))
            };
            var y = new b,
                I = new b;
            a.prototype.applyLocalForce = function(H, S) {
                this.type === a.DYNAMIC && (this.vectorToWorldFrame(H, y), this.pointToWorldFrame(S, I), this.applyForce(y, I))
            };
            var E = new b,
                N = new b,
                R = new b;
            a.prototype.applyImpulse = function(H, S) {
                this.type === a.DYNAMIC && (S.vsub(this.position, E), N.copy(H), N.mult(this.invMass, N), this.velocity.vadd(N, this.velocity), E.cross(H, R), this.invInertiaWorld.vmult(R, R), this.angularVelocity.vadd(R, this.angularVelocity))
            };
            var T = new b,
                M = new b;
            a.prototype.applyLocalImpulse = function(H,
                S) {
                this.type === a.DYNAMIC && (this.vectorToWorldFrame(H, T), this.pointToWorldFrame(S, M), this.applyImpulse(T, M))
            };
            var G = new b;
            a.prototype.updateMassProperties = function() {
                this.invMass = 0 < this.mass ? 1 / this.mass : 0;
                var H = this.inertia,
                    S = this.fixedRotation;
                this.computeAABB();
                G.set((this.aabb.upperBound.x - this.aabb.lowerBound.x) / 2, (this.aabb.upperBound.y - this.aabb.lowerBound.y) / 2, (this.aabb.upperBound.z - this.aabb.lowerBound.z) / 2);
                l.calculateInertia(G, this.mass, H);
                this.invInertia.set(0 < H.x && !S ? 1 / H.x : 0, 0 < H.y && !S ?
                    1 / H.y : 0, 0 < H.z && !S ? 1 / H.z : 0);
                this.updateInertiaWorld(!0)
            };
            a.prototype.getVelocityAtWorldPoint = function(H, S) {
                var J = new b;
                H.vsub(this.position, J);
                this.angularVelocity.cross(J, S);
                this.velocity.vadd(S, S);
                return S
            }
        }, {
            "../collision/AABB": 3,
            "../material/Material": 25,
            "../math/Mat3": 27,
            "../math/Quaternion": 28,
            "../math/Vec3": 30,
            "../shapes/Box": 37,
            "../shapes/Shape": 43,
            "../utils/EventTarget": 49
        }],
        32: [function(d, e, m) {
            function a(J) {
                this.chassisBody = J.chassisBody;
                this.wheelInfos = [];
                this.sliding = !1;
                this.world = null;
                this.indexRightAxis = "undefined" !== typeof J.indexRightAxis ? J.indexRightAxis : 1;
                this.indexForwardAxis = "undefined" !== typeof J.indexForwardAxis ? J.indexForwardAxis : 0;
                this.indexUpAxis = "undefined" !== typeof J.indexUpAxis ? J.indexUpAxis : 2
            }

            function c(J, ca, O) {
                var Y = N,
                    K = R,
                    z = T,
                    C = M;
                ca.vsub(J.position, Y);
                Y.cross(O, K);
                J.invInertiaWorld.vmult(K, C);
                C.cross(Y, z);
                return J.invMass + O.dot(z)
            }
            d("./Body");
            var b = d("../math/Vec3"),
                k = d("../math/Quaternion");
            d("../collision/RaycastResult");
            m = d("../collision/Ray");
            var g = d("../objects/WheelInfo");
            e.exports = a;
            new b;
            new b;
            new b;
            var h = new b,
                l = new b,
                p = new b;
            new m;
            a.prototype.addWheel = function(J) {
                J = J || {};
                J = new g(J);
                var ca = this.wheelInfos.length;
                this.wheelInfos.push(J);
                return ca
            };
            a.prototype.setSteeringValue = function(J, ca) {
                this.wheelInfos[ca].steering = J
            };
            new b;
            a.prototype.applyEngineForce = function(J, ca) {
                this.wheelInfos[ca].engineForce = J
            };
            a.prototype.setBrake = function(J, ca) {
                this.wheelInfos[ca].brake = J
            };
            a.prototype.addToWorld = function(J) {
                J.add(this.chassisBody);
                var ca = this;
                this.preStepCallback = function() {
                    ca.updateVehicle(J.dt)
                };
                J.addEventListener("preStep", this.preStepCallback);
                this.world = J
            };
            a.prototype.getVehicleAxisWorld = function(J, ca) {
                ca.set(0 === J ? 1 : 0, 1 === J ? 1 : 0, 2 === J ? 1 : 0);
                this.chassisBody.vectorToWorldFrame(ca, ca)
            };
            a.prototype.updateVehicle = function(J) {
                for (var ca = this.wheelInfos, O = ca.length, Y = this.chassisBody, K = 0; K < O; K++) this.updateWheelTransform(K);
                this.currentVehicleSpeedKmHour = 3.6 * Y.velocity.norm();
                K = new b;
                this.getVehicleAxisWorld(this.indexForwardAxis, K);
                0 > K.dot(Y.velocity) && (this.currentVehicleSpeedKmHour *= -1);
                for (K =
                    0; K < O; K++) this.castRay(ca[K]);
                this.updateSuspension(J);
                var z = new b,
                    C = new b;
                for (K = 0; K < O; K++) {
                    var u = ca[K],
                        B = u.suspensionForce;
                    B > u.maxSuspensionForce && (B = u.maxSuspensionForce);
                    u.raycastResult.hitNormalWorld.scale(B * J, z);
                    u.raycastResult.hitPointWorld.vsub(Y.position, C);
                    Y.applyImpulse(z, u.raycastResult.hitPointWorld)
                }
                this.updateFriction(J);
                z = new b;
                C = new b;
                B = new b;
                for (K = 0; K < O; K++) {
                    u = ca[K];
                    Y.getVelocityAtWorldPoint(u.chassisConnectionPointWorld, B);
                    var w = 1;
                    switch (this.indexUpAxis) {
                        case 1:
                            w = -1
                    }
                    if (u.isInContact) {
                        this.getVehicleAxisWorld(this.indexForwardAxis,
                            C);
                        var A = C.dot(u.raycastResult.hitNormalWorld);
                        u.raycastResult.hitNormalWorld.scale(A, z);
                        C.vsub(z, C);
                        A = C.dot(B);
                        u.deltaRotation = w * A * J / u.radius
                    }!u.sliding && u.isInContact || 0 === u.engineForce || !u.useCustomSlidingRotationalSpeed || (u.deltaRotation = (0 < u.engineForce ? 1 : -1) * u.customSlidingRotationalSpeed * J);
                    Math.abs(u.brake) > Math.abs(u.engineForce) && (u.deltaRotation = 0);
                    u.rotation += u.deltaRotation;
                    u.deltaRotation *= .99
                }
            };
            a.prototype.updateSuspension = function(J) {
                J = this.chassisBody.mass;
                for (var ca = this.wheelInfos,
                        O = ca.length, Y = 0; Y < O; Y++) {
                    var K = ca[Y];
                    if (K.isInContact) {
                        var z = K.suspensionStiffness * (K.suspensionRestLength - K.suspensionLength) * K.clippedInvContactDotSuspension;
                        var C = K.suspensionRelativeVelocity;
                        z -= (0 > C ? K.dampingCompression : K.dampingRelaxation) * C;
                        K.suspensionForce = z * J;
                        0 > K.suspensionForce && (K.suspensionForce = 0)
                    } else K.suspensionForce = 0
                }
            };
            a.prototype.removeFromWorld = function(J) {
                J.remove(this.chassisBody);
                J.removeEventListener("preStep", this.preStepCallback);
                this.world = null
            };
            var n = new b,
                q = new b;
            a.prototype.castRay =
                function(J) {
                    this.updateWheelTransformWorld(J);
                    var ca = this.chassisBody,
                        O = -1;
                    J.directionWorld.scale(J.suspensionRestLength + J.radius, n);
                    var Y = J.chassisConnectionPointWorld;
                    Y.vadd(n, q);
                    var K = J.raycastResult;
                    K.reset();
                    var z = ca.collisionResponse;
                    ca.collisionResponse = !1;
                    this.world.rayTest(Y, q, K);
                    ca.collisionResponse = z;
                    Y = K.body;
                    J.raycastResult.groundObject = 0;
                    Y ? (O = K.distance, J.raycastResult.hitNormalWorld = K.hitNormalWorld, J.isInContact = !0, J.suspensionLength = K.distance - J.radius, K = J.suspensionRestLength - J.maxSuspensionTravel,
                        Y = J.suspensionRestLength + J.maxSuspensionTravel, J.suspensionLength < K && (J.suspensionLength = K), J.suspensionLength > Y && (J.suspensionLength = Y, J.raycastResult.reset()), K = J.raycastResult.hitNormalWorld.dot(J.directionWorld), Y = new b, ca.getVelocityAtWorldPoint(J.raycastResult.hitPointWorld, Y), ca = J.raycastResult.hitNormalWorld.dot(Y), -.1 <= K ? (J.suspensionRelativeVelocity = 0, J.clippedInvContactDotSuspension = 10) : (K = -1 / K, J.suspensionRelativeVelocity = ca * K, J.clippedInvContactDotSuspension = K)) : (J.suspensionLength = J.suspensionRestLength +
                        0 * J.maxSuspensionTravel, J.suspensionRelativeVelocity = 0, J.directionWorld.scale(-1, J.raycastResult.hitNormalWorld), J.clippedInvContactDotSuspension = 1);
                    return O
                };
            a.prototype.updateWheelTransformWorld = function(J) {
                J.isInContact = !1;
                var ca = this.chassisBody;
                ca.pointToWorldFrame(J.chassisConnectionPointLocal, J.chassisConnectionPointWorld);
                ca.vectorToWorldFrame(J.directionLocal, J.directionWorld);
                ca.vectorToWorldFrame(J.axleLocal, J.axleWorld)
            };
            a.prototype.updateWheelTransform = function(J) {
                J = this.wheelInfos[J];
                this.updateWheelTransformWorld(J);
                J.directionLocal.scale(-1, h);
                l.copy(J.axleLocal);
                h.cross(l, p);
                p.normalize();
                l.normalize();
                var ca = J.steering,
                    O = new k;
                O.setFromAxisAngle(h, ca);
                ca = new k;
                ca.setFromAxisAngle(l, J.rotation);
                var Y = J.worldTransform.quaternion;
                this.chassisBody.quaternion.mult(O, Y);
                Y.mult(ca, Y);
                Y.normalize();
                O = J.worldTransform.position;
                O.copy(J.directionWorld);
                O.scale(J.suspensionLength, O);
                O.vadd(J.chassisConnectionPointWorld, O)
            };
            var t = [new b(1, 0, 0), new b(0, 1, 0), new b(0, 0, 1)];
            a.prototype.getWheelTransformWorld =
                function(J) {
                    return this.wheelInfos[J].worldTransform
                };
            var r = new b,
                v = [],
                x = [];
            a.prototype.updateFriction = function(J) {
                for (var ca = this.wheelInfos, O = ca.length, Y = this.chassisBody, K = 0, z = 0; z < O; z++) {
                    var C = ca[z],
                        u = C.raycastResult.body;
                    u && K++;
                    C.sideImpulse = 0;
                    C.forwardImpulse = 0;
                    x[z] || (x[z] = new b);
                    v[z] || (v[z] = new b)
                }
                for (z = 0; z < O; z++)
                    if (C = ca[z], u = C.raycastResult.body) {
                        var B = v[z];
                        this.getWheelTransformWorld(z).vectorToWorldFrame(t[this.indexRightAxis], B);
                        K = C.raycastResult.hitNormalWorld;
                        var w = B.dot(K);
                        K.scale(w,
                            r);
                        B.vsub(r, B);
                        B.normalize();
                        K.cross(B, x[z]);
                        x[z].normalize();
                        K = C;
                        w = Y;
                        var A = C.raycastResult.hitPointWorld,
                            F = C.raycastResult.hitPointWorld;
                        if (1.1 < B.norm2()) u = 0;
                        else {
                            var D = G,
                                Q = H,
                                X = S;
                            w.getVelocityAtWorldPoint(A, D);
                            u.getVelocityAtWorldPoint(F, Q);
                            D.vsub(Q, X);
                            u = -.2 * B.dot(X) * (1 / (w.invMass + u.invMass))
                        }
                        K.sideImpulse = u;
                        C.sideImpulse *= 1
                    } this.sliding = !1;
                for (z = 0; z < O; z++) {
                    C = ca[z];
                    u = C.raycastResult.body;
                    w = 0;
                    C.slipInfo = 1;
                    if (u) {
                        K = C.brake ? C.brake : 0;
                        D = Y;
                        A = u;
                        F = C.raycastResult.hitPointWorld;
                        B = x[z];
                        w = K;
                        Q = F;
                        X = y;
                        var P = I,
                            Z = E;
                        D.getVelocityAtWorldPoint(Q, X);
                        A.getVelocityAtWorldPoint(Q, P);
                        X.vsub(P, Z);
                        Q = B.dot(Z);
                        D = c(D, F, B);
                        A = c(A, F, B);
                        A = 1 / (D + A) * -Q;
                        w < A && (A = w);
                        A < -w && (A = -w);
                        w = A;
                        w += C.engineForce * J;
                        K /= w;
                        C.slipInfo *= K
                    }
                    C.forwardImpulse = 0;
                    C.skidInfo = 1;
                    u && (C.skidInfo = 1, u = C.suspensionForce * J * C.frictionSlip, K = u * u, C.forwardImpulse = w, w = .5 * C.forwardImpulse, A = 1 * C.sideImpulse, w = w * w + A * A, C.sliding = !1, w > K && (this.sliding = !0, C.sliding = !0, K = u / Math.sqrt(w), C.skidInfo *= K))
                }
                if (this.sliding)
                    for (z = 0; z < O; z++) C = ca[z], 0 !== C.sideImpulse && 1 > C.skidInfo &&
                        (C.forwardImpulse *= C.skidInfo, C.sideImpulse *= C.skidInfo);
                for (z = 0; z < O; z++) C = ca[z], J = new b, J.copy(C.raycastResult.hitPointWorld), 0 !== C.forwardImpulse && (u = new b, x[z].scale(C.forwardImpulse, u), Y.applyImpulse(u, J)), 0 !== C.sideImpulse && (u = C.raycastResult.body, K = new b, K.copy(C.raycastResult.hitPointWorld), w = new b, v[z].scale(C.sideImpulse, w), Y.pointToLocalFrame(J, J), J["xyz" [this.indexUpAxis]] *= C.rollInfluence, Y.pointToWorldFrame(J, J), Y.applyImpulse(w, J), w.scale(-1, w), u.applyImpulse(w, K))
            };
            var y = new b,
                I = new b,
                E = new b,
                N = new b,
                R = new b,
                T = new b,
                M = new b,
                G = new b,
                H = new b,
                S = new b
        }, {
            "../collision/Ray": 9,
            "../collision/RaycastResult": 10,
            "../math/Quaternion": 28,
            "../math/Vec3": 30,
            "../objects/WheelInfo": 36,
            "./Body": 31
        }],
        33: [function(d, e, m) {
            function a(n) {
                this.wheelBodies = [];
                this.coordinateSystem = "undefined" === typeof n.coordinateSystem ? new g(1, 2, 3) : n.coordinateSystem.clone();
                this.chassisBody = n.chassisBody;
                this.chassisBody || (n = new k(new g(5, 2, .5)), this.chassisBody = new c(1, n));
                this.constraints = [];
                this.wheelAxes = [];
                this.wheelForces = []
            }
            var c = d("./Body"),
                b = d("../shapes/Sphere"),
                k = d("../shapes/Box"),
                g = d("../math/Vec3"),
                h = d("../constraints/HingeConstraint");
            e.exports = a;
            a.prototype.addWheel = function(n) {
                n = n || {};
                var q = n.body;
                q || (q = new c(1, new b(1.2)));
                this.wheelBodies.push(q);
                this.wheelForces.push(0);
                new g;
                var t = "undefined" !== typeof n.position ? n.position.clone() : new g,
                    r = new g;
                this.chassisBody.pointToWorldFrame(t, r);
                q.position.set(r.x, r.y, r.z);
                n = "undefined" !== typeof n.axis ? n.axis.clone() : new g(0, 1, 0);
                this.wheelAxes.push(n);
                q = new h(this.chassisBody,
                    q, {
                        pivotA: t,
                        axisA: n,
                        pivotB: g.ZERO,
                        axisB: n,
                        collideConnected: !1
                    });
                this.constraints.push(q);
                return this.wheelBodies.length - 1
            };
            a.prototype.setSteeringValue = function(n, q) {
                var t = this.wheelAxes[q],
                    r = Math.cos(n),
                    v = Math.sin(n),
                    x = t.x;
                t = t.y;
                this.constraints[q].axisA.set(r * x - v * t, v * x + r * t, 0)
            };
            a.prototype.setMotorSpeed = function(n, q) {
                var t = this.constraints[q];
                t.enableMotor();
                t.motorTargetVelocity = n
            };
            a.prototype.disableMotor = function(n) {
                this.constraints[n].disableMotor()
            };
            var l = new g;
            a.prototype.setWheelForce = function(n,
                q) {
                this.wheelForces[q] = n
            };
            a.prototype.applyWheelForce = function(n, q) {
                var t = this.wheelBodies[q],
                    r = t.torque;
                this.wheelAxes[q].scale(n, l);
                t.vectorToWorldFrame(l, l);
                r.vadd(l, r)
            };
            a.prototype.addToWorld = function(n) {
                for (var q = this.constraints, t = this.wheelBodies.concat([this.chassisBody]), r = 0; r < t.length; r++) n.add(t[r]);
                for (r = 0; r < q.length; r++) n.addConstraint(q[r]);
                n.addEventListener("preStep", this._update.bind(this))
            };
            a.prototype._update = function() {
                for (var n = this.wheelForces, q = 0; q < n.length; q++) this.applyWheelForce(n[q],
                    q)
            };
            a.prototype.removeFromWorld = function(n) {
                for (var q = this.constraints, t = this.wheelBodies.concat([this.chassisBody]), r = 0; r < t.length; r++) n.remove(t[r]);
                for (r = 0; r < q.length; r++) n.removeConstraint(q[r])
            };
            var p = new g;
            a.prototype.getWheelSpeed = function(n) {
                var q = this.wheelBodies[n].angularVelocity;
                this.chassisBody.vectorToWorldFrame(this.wheelAxes[n], p);
                return q.dot(p)
            }
        }, {
            "../constraints/HingeConstraint": 15,
            "../math/Vec3": 30,
            "../shapes/Box": 37,
            "../shapes/Sphere": 44,
            "./Body": 31
        }],
        34: [function(d, e, m) {
            function a() {
                this.particles = [];
                this.speedOfSound = this.smoothingRadius = this.density = 1;
                this.viscosity = .01;
                this.eps = 1E-6;
                this.pressures = [];
                this.densities = [];
                this.neighbors = []
            }
            e.exports = a;
            d("../shapes/Shape");
            e = d("../math/Vec3");
            d("../math/Quaternion");
            d("../shapes/Particle");
            d("../objects/Body");
            d("../material/Material");
            a.prototype.add = function(n) {
                this.particles.push(n);
                this.neighbors.length < this.particles.length && this.neighbors.push([])
            };
            a.prototype.remove = function(n) {
                n = this.particles.indexOf(n); - 1 !== n && (this.particles.splice(n,
                    1), this.neighbors.length > this.particles.length && this.neighbors.pop())
            };
            var c = new e;
            a.prototype.getNeighbors = function(n, q) {
                for (var t = this.particles.length, r = n.id, v = this.smoothingRadius * this.smoothingRadius, x = 0; x !== t; x++) {
                    var y = this.particles[x];
                    y.position.vsub(n.position, c);
                    r !== y.id && c.norm2() < v && q.push(y)
                }
            };
            var b = new e,
                k = new e,
                g = new e,
                h = new e,
                l = new e,
                p = new e;
            a.prototype.update = function() {
                for (var n = this.particles.length, q = this.speedOfSound, t = this.eps, r = 0; r !== n; r++) {
                    var v = this.particles[r],
                        x = this.neighbors[r];
                    x.length = 0;
                    this.getNeighbors(v, x);
                    x.push(this.particles[r]);
                    for (var y = x.length, I = 0, E = 0; E !== y; E++) {
                        v.position.vsub(x[E].position, b);
                        var N = b.norm();
                        N = this.w(N);
                        I += x[E].mass * N
                    }
                    this.densities[r] = I;
                    this.pressures[r] = q * q * (this.densities[r] - this.density)
                }
                for (r = 0; r !== n; r++) {
                    q = this.particles[r];
                    k.set(0, 0, 0);
                    g.set(0, 0, 0);
                    x = this.neighbors[r];
                    y = x.length;
                    for (E = 0; E !== y; E++) I = x[E], q.position.vsub(I.position, l), N = l.norm(), v = -I.mass * (this.pressures[r] / (this.densities[r] * this.densities[r] + t) + this.pressures[E] / (this.densities[E] *
                        this.densities[E] + t)), this.gradw(l, h), h.mult(v, h), k.vadd(h, k), I.velocity.vsub(q.velocity, p), p.mult(1 / (1E-4 + this.densities[r] * this.densities[E]) * this.viscosity * I.mass, p), v = this.nablaw(N), p.mult(v, p), g.vadd(p, g);
                    g.mult(q.mass, g);
                    k.mult(q.mass, k);
                    q.force.vadd(g, q.force);
                    q.force.vadd(k, q.force)
                }
            };
            a.prototype.w = function(n) {
                var q = this.smoothingRadius;
                return 315 / (64 * Math.PI * Math.pow(q, 9)) * Math.pow(q * q - n * n, 3)
            };
            a.prototype.gradw = function(n, q) {
                var t = n.norm(),
                    r = this.smoothingRadius;
                n.mult(945 / (32 * Math.PI * Math.pow(r,
                    9)) * Math.pow(r * r - t * t, 2), q)
            };
            a.prototype.nablaw = function(n) {
                var q = this.smoothingRadius;
                return 945 / (32 * Math.PI * Math.pow(q, 9)) * (q * q - n * n) * (7 * n * n - 3 * q * q)
            }
        }, {
            "../material/Material": 25,
            "../math/Quaternion": 28,
            "../math/Vec3": 30,
            "../objects/Body": 31,
            "../shapes/Particle": 41,
            "../shapes/Shape": 43
        }],
        35: [function(d, e, m) {
            function a(x, y, I) {
                I = I || {};
                this.restLength = "number" === typeof I.restLength ? I.restLength : 1;
                this.stiffness = I.stiffness || 100;
                this.damping = I.damping || 1;
                this.bodyA = x;
                this.bodyB = y;
                this.localAnchorA = new c;
                this.localAnchorB = new c;
                I.localAnchorA && this.localAnchorA.copy(I.localAnchorA);
                I.localAnchorB && this.localAnchorB.copy(I.localAnchorB);
                I.worldAnchorA && this.setWorldAnchorA(I.worldAnchorA);
                I.worldAnchorB && this.setWorldAnchorB(I.worldAnchorB)
            }
            var c = d("../math/Vec3");
            e.exports = a;
            a.prototype.setWorldAnchorA = function(x) {
                this.bodyA.pointToLocalFrame(x, this.localAnchorA)
            };
            a.prototype.setWorldAnchorB = function(x) {
                this.bodyB.pointToLocalFrame(x, this.localAnchorB)
            };
            a.prototype.getWorldAnchorA = function(x) {
                this.bodyA.pointToWorldFrame(this.localAnchorA,
                    x)
            };
            a.prototype.getWorldAnchorB = function(x) {
                this.bodyB.pointToWorldFrame(this.localAnchorB, x)
            };
            var b = new c,
                k = new c,
                g = new c,
                h = new c,
                l = new c,
                p = new c,
                n = new c,
                q = new c,
                t = new c,
                r = new c,
                v = new c;
            a.prototype.applyForce = function() {
                var x = this.stiffness,
                    y = this.damping,
                    I = this.restLength,
                    E = this.bodyA,
                    N = this.bodyB;
                this.getWorldAnchorA(l);
                this.getWorldAnchorB(p);
                l.vsub(E.position, n);
                p.vsub(N.position, q);
                p.vsub(l, b);
                var R = b.norm();
                k.copy(b);
                k.normalize();
                N.velocity.vsub(E.velocity, g);
                N.angularVelocity.cross(q, v);
                g.vadd(v, g);
                E.angularVelocity.cross(n, v);
                g.vsub(v, g);
                k.mult(-x * (R - I) - y * g.dot(k), h);
                E.force.vsub(h, E.force);
                N.force.vadd(h, N.force);
                n.cross(h, t);
                q.cross(h, r);
                E.torque.vsub(t, E.torque);
                N.torque.vadd(r, N.torque)
            }
        }, {
            "../math/Vec3": 30
        }],
        36: [function(d, e, m) {
            function a(p) {
                p = g.defaults(p, {
                    chassisConnectionPointLocal: new c,
                    chassisConnectionPointWorld: new c,
                    directionLocal: new c,
                    directionWorld: new c,
                    axleLocal: new c,
                    axleWorld: new c,
                    suspensionRestLength: 1,
                    suspensionMaxLength: 2,
                    radius: 1,
                    suspensionStiffness: 100,
                    dampingCompression: 10,
                    dampingRelaxation: 10,
                    frictionSlip: 1E4,
                    steering: 0,
                    rotation: 0,
                    deltaRotation: 0,
                    rollInfluence: .01,
                    maxSuspensionForce: Number.MAX_VALUE,
                    isFrontWheel: !0,
                    clippedInvContactDotSuspension: 1,
                    suspensionRelativeVelocity: 0,
                    suspensionForce: 0,
                    skidInfo: 0,
                    suspensionLength: 0,
                    maxSuspensionTravel: 1,
                    useCustomSlidingRotationalSpeed: !1,
                    customSlidingRotationalSpeed: -.1
                });
                this.maxSuspensionTravel = p.maxSuspensionTravel;
                this.customSlidingRotationalSpeed = p.customSlidingRotationalSpeed;
                this.useCustomSlidingRotationalSpeed =
                    p.useCustomSlidingRotationalSpeed;
                this.sliding = !1;
                this.chassisConnectionPointLocal = p.chassisConnectionPointLocal.clone();
                this.chassisConnectionPointWorld = p.chassisConnectionPointWorld.clone();
                this.directionLocal = p.directionLocal.clone();
                this.directionWorld = p.directionWorld.clone();
                this.axleLocal = p.axleLocal.clone();
                this.axleWorld = p.axleWorld.clone();
                this.suspensionRestLength = p.suspensionRestLength;
                this.suspensionMaxLength = p.suspensionMaxLength;
                this.radius = p.radius;
                this.suspensionStiffness = p.suspensionStiffness;
                this.dampingCompression = p.dampingCompression;
                this.dampingRelaxation = p.dampingRelaxation;
                this.frictionSlip = p.frictionSlip;
                this.deltaRotation = this.rotation = this.steering = 0;
                this.rollInfluence = p.rollInfluence;
                this.maxSuspensionForce = p.maxSuspensionForce;
                this.brake = this.engineForce = 0;
                this.isFrontWheel = p.isFrontWheel;
                this.clippedInvContactDotSuspension = 1;
                this.forwardImpulse = this.sideImpulse = this.suspensionLength = this.skidInfo = this.suspensionForce = this.suspensionRelativeVelocity = 0;
                this.raycastResult = new k;
                this.worldTransform = new b;
                this.isInContact = !1
            }
            var c = d("../math/Vec3"),
                b = d("../math/Transform"),
                k = d("../collision/RaycastResult"),
                g = d("../utils/Utils");
            e.exports = a;
            var h = new c,
                l = new c;
            h = new c;
            a.prototype.updateWheel = function(p) {
                var n = this.raycastResult;
                if (this.isInContact) {
                    var q = n.hitNormalWorld.dot(n.directionWorld);
                    n.hitPointWorld.vsub(p.position, l);
                    p.getVelocityAtWorldPoint(l, h);
                    p = n.hitNormalWorld.dot(h); - .1 <= q ? (this.suspensionRelativeVelocity = 0, this.clippedInvContactDotSuspension = 10) : (q = -1 / q, this.suspensionRelativeVelocity =
                        p * q, this.clippedInvContactDotSuspension = q)
                } else n.suspensionLength = this.suspensionRestLength, this.suspensionRelativeVelocity = 0, n.directionWorld.scale(-1, n.hitNormalWorld), this.clippedInvContactDotSuspension = 1
            }
        }, {
            "../collision/RaycastResult": 10,
            "../math/Transform": 29,
            "../math/Vec3": 30,
            "../utils/Utils": 53
        }],
        37: [function(d, e, m) {
            function a(l) {
                c.call(this);
                this.type = c.types.BOX;
                this.halfExtents = l;
                this.convexPolyhedronRepresentation = null;
                this.updateConvexPolyhedronRepresentation();
                this.updateBoundingSphereRadius()
            }
            e.exports = a;
            var c = d("./Shape"),
                b = d("../math/Vec3"),
                k = d("./ConvexPolyhedron");
            a.prototype = new c;
            a.prototype.constructor = a;
            a.prototype.updateConvexPolyhedronRepresentation = function() {
                var l = this.halfExtents.x,
                    p = this.halfExtents.y,
                    n = this.halfExtents.z;
                l = [new b(-l, -p, -n), new b(l, -p, -n), new b(l, p, -n), new b(-l, p, -n), new b(-l, -p, n), new b(l, -p, n), new b(l, p, n), new b(-l, p, n)];
                new b(0, 0, 1);
                new b(0, 1, 0);
                new b(1, 0, 0);
                this.convexPolyhedronRepresentation = l = new k(l, [
                    [3, 2, 1, 0],
                    [4, 5, 6, 7],
                    [5, 4, 0, 1],
                    [2, 3, 7, 6],
                    [0, 4, 7,
                        3
                    ],
                    [1, 2, 6, 5]
                ]);
                l.material = this.material
            };
            a.prototype.calculateLocalInertia = function(l, p) {
                p = p || new b;
                a.calculateInertia(this.halfExtents, l, p);
                return p
            };
            a.calculateInertia = function(l, p, n) {
                n.x = 1 / 12 * p * (4 * l.y * l.y + 4 * l.z * l.z);
                n.y = 1 / 12 * p * (4 * l.x * l.x + 4 * l.z * l.z);
                n.z = 1 / 12 * p * (4 * l.y * l.y + 4 * l.x * l.x)
            };
            a.prototype.getSideNormals = function(l, p) {
                var n = this.halfExtents;
                l[0].set(n.x, 0, 0);
                l[1].set(0, n.y, 0);
                l[2].set(0, 0, n.z);
                l[3].set(-n.x, 0, 0);
                l[4].set(0, -n.y, 0);
                l[5].set(0, 0, -n.z);
                if (void 0 !== p)
                    for (n = 0; n !== l.length; n++) p.vmult(l[n],
                        l[n]);
                return l
            };
            a.prototype.volume = function() {
                return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z
            };
            a.prototype.updateBoundingSphereRadius = function() {
                this.boundingSphereRadius = this.halfExtents.norm()
            };
            var g = new b;
            new b;
            a.prototype.forEachWorldCorner = function(l, p, n) {
                var q = this.halfExtents;
                q = [
                    [q.x, q.y, q.z],
                    [-q.x, q.y, q.z],
                    [-q.x, -q.y, q.z],
                    [-q.x, -q.y, -q.z],
                    [q.x, -q.y, -q.z],
                    [q.x, q.y, -q.z],
                    [-q.x, q.y, -q.z],
                    [q.x, -q.y, q.z]
                ];
                for (var t = 0; t < q.length; t++) g.set(q[t][0], q[t][1], q[t][2]), p.vmult(g, g),
                    l.vadd(g, g), n(g.x, g.y, g.z)
            };
            var h = [new b, new b, new b, new b, new b, new b, new b, new b];
            a.prototype.calculateWorldAABB = function(l, p, n, q) {
                var t = this.halfExtents;
                h[0].set(t.x, t.y, t.z);
                h[1].set(-t.x, t.y, t.z);
                h[2].set(-t.x, -t.y, t.z);
                h[3].set(-t.x, -t.y, -t.z);
                h[4].set(t.x, -t.y, -t.z);
                h[5].set(t.x, t.y, -t.z);
                h[6].set(-t.x, t.y, -t.z);
                h[7].set(t.x, -t.y, t.z);
                var r = h[0];
                p.vmult(r, r);
                l.vadd(r, r);
                q.copy(r);
                n.copy(r);
                for (t = 1; 8 > t; t++) {
                    r = h[t];
                    p.vmult(r, r);
                    l.vadd(r, r);
                    var v = r.x,
                        x = r.y;
                    r = r.z;
                    v > q.x && (q.x = v);
                    x > q.y && (q.y = x);
                    r > q.z && (q.z = r);
                    v < n.x && (n.x = v);
                    x < n.y && (n.y = x);
                    r < n.z && (n.z = r)
                }
            }
        }, {
            "../math/Vec3": 30,
            "./ConvexPolyhedron": 38,
            "./Shape": 43
        }],
        38: [function(d, e, m) {
            function a(B, w, A) {
                c.call(this);
                this.type = c.types.CONVEXPOLYHEDRON;
                this.vertices = B || [];
                this.worldVertices = [];
                this.worldVerticesNeedsUpdate = !0;
                this.faces = w || [];
                this.faceNormals = [];
                this.computeNormals();
                this.worldFaceNormalsNeedsUpdate = !0;
                this.worldFaceNormals = [];
                this.uniqueEdges = [];
                this.uniqueAxes = A ? A.slice() : null;
                this.computeEdges();
                this.updateBoundingSphereRadius()
            }
            e.exports = a;
            var c = d("./Shape"),
                b = d("../math/Vec3");
            d("../math/Quaternion");
            var k = d("../math/Transform");
            a.prototype = new c;
            a.prototype.constructor = a;
            var g = new b;
            a.prototype.computeEdges = function() {
                for (var B = this.faces, w = this.vertices, A = this.uniqueEdges, F = A.length = 0; F !== B.length; F++)
                    for (var D = B[F], Q = D.length, X = 0; X !== Q; X++) {
                        w[D[X]].vsub(w[D[(X + 1) % Q]], g);
                        g.normalize();
                        for (var P = !1, Z = 0; Z !== A.length; Z++)
                            if (A[Z].almostEquals(g) || A[Z].almostEquals(g)) {
                                P = !0;
                                break
                            } P || A.push(g.clone())
                    }
            };
            a.prototype.computeNormals =
                function() {
                    this.faceNormals.length = this.faces.length;
                    for (var B = 0; B < this.faces.length; B++) {
                        for (var w = 0; w < this.faces[B].length; w++)
                            if (!this.vertices[this.faces[B][w]]) throw Error("Vertex " + this.faces[B][w] + " not found!");
                        w = this.faceNormals[B] || new b;
                        this.getFaceNormal(B, w);
                        w.negate(w);
                        this.faceNormals[B] = w;
                        if (0 > w.dot(this.vertices[this.faces[B][0]]))
                            for (console.error(".faceNormals[" + B + "] = Vec3(" + w.toString() + ") looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule."),
                                w = 0; w < this.faces[B].length; w++) console.warn(".vertices[" + this.faces[B][w] + "] = Vec3(" + this.vertices[this.faces[B][w]].toString() + ")")
                    }
                };
            var h = new b,
                l = new b;
            a.computeNormal = function(B, w, A, F) {
                w.vsub(B, l);
                A.vsub(w, h);
                h.cross(l, F);
                F.isZero() || F.normalize()
            };
            a.prototype.getFaceNormal = function(B, w) {
                var A = this.faces[B];
                return a.computeNormal(this.vertices[A[0]], this.vertices[A[1]], this.vertices[A[2]], w)
            };
            var p = new b;
            a.prototype.clipAgainstHull = function(B, w, A, F, D, Q, X, P, Z) {
                for (var ma = -1, ja = -Number.MAX_VALUE,
                        fa = 0; fa < A.faces.length; fa++) {
                    p.copy(A.faceNormals[fa]);
                    D.vmult(p, p);
                    var U = p.dot(Q);
                    U > ja && (ja = U, ma = fa)
                }
                ja = [];
                fa = A.faces[ma];
                U = fa.length;
                for (var ba = 0; ba < U; ba++) {
                    var da = A.vertices[fa[ba]],
                        oa = new b;
                    oa.copy(da);
                    D.vmult(oa, oa);
                    F.vadd(oa, oa);
                    ja.push(oa)
                }
                0 <= ma && this.clipFaceAgainstHull(Q, B, w, ja, X, P, Z)
            };
            var n = new b,
                q = new b,
                t = new b,
                r = new b,
                v = new b,
                x = new b;
            a.prototype.findSeparatingAxis = function(B, w, A, F, D, Q, X, P) {
                var Z = Number.MAX_VALUE,
                    ma = 0;
                if (this.uniqueAxes)
                    for (fa = 0; fa !== this.uniqueAxes.length; fa++) {
                        A.vmult(this.uniqueAxes[fa],
                            n);
                        U = this.testSepAxis(n, B, w, A, F, D);
                        if (!1 === U) return !1;
                        U < Z && (Z = U, Q.copy(n))
                    } else
                        for (var ja = X ? X.length : this.faces.length, fa = 0; fa < ja; fa++) {
                            U = X ? X[fa] : fa;
                            n.copy(this.faceNormals[U]);
                            A.vmult(n, n);
                            var U = this.testSepAxis(n, B, w, A, F, D);
                            if (!1 === U) return !1;
                            U < Z && (Z = U, Q.copy(n))
                        }
                if (B.uniqueAxes)
                    for (fa = 0; fa !== B.uniqueAxes.length; fa++) {
                        D.vmult(B.uniqueAxes[fa], q);
                        ma++;
                        U = this.testSepAxis(q, B, w, A, F, D);
                        if (!1 === U) return !1;
                        U < Z && (Z = U, Q.copy(q))
                    } else
                        for (X = P ? P.length : B.faces.length, fa = 0; fa < X; fa++) {
                            U = P ? P[fa] : fa;
                            q.copy(B.faceNormals[U]);
                            D.vmult(q, q);
                            ma++;
                            U = this.testSepAxis(q, B, w, A, F, D);
                            if (!1 === U) return !1;
                            U < Z && (Z = U, Q.copy(q))
                        }
                for (P = 0; P !== this.uniqueEdges.length; P++)
                    for (A.vmult(this.uniqueEdges[P], r), ma = 0; ma !== B.uniqueEdges.length; ma++)
                        if (D.vmult(B.uniqueEdges[ma], v), r.cross(v, x), !x.almostZero()) {
                            x.normalize();
                            fa = this.testSepAxis(x, B, w, A, F, D);
                            if (!1 === fa) return !1;
                            fa < Z && (Z = fa, Q.copy(x))
                        } F.vsub(w, t);
                0 < t.dot(Q) && Q.negate(Q);
                return !0
            };
            var y = [],
                I = [];
            a.prototype.testSepAxis = function(B, w, A, F, D, Q) {
                a.project(this, B, A, F, y);
                a.project(w, B, D, Q,
                    I);
                A = y[0];
                B = y[1];
                w = I[0];
                F = I[1];
                if (A < F || w < B) return !1;
                A -= F;
                B = w - B;
                return A < B ? A : B
            };
            var E = new b,
                N = new b;
            a.prototype.calculateLocalInertia = function(B, w) {
                this.computeLocalAABB(E, N);
                var A = N.x - E.x,
                    F = N.y - E.y,
                    D = N.z - E.z;
                w.x = 1 / 12 * B * (4 * F * F + 4 * D * D);
                w.y = 1 / 12 * B * (4 * A * A + 4 * D * D);
                w.z = 1 / 12 * B * (4 * F * F + 4 * A * A)
            };
            a.prototype.getPlaneConstantOfFace = function(B) {
                return -this.faceNormals[B].dot(this.vertices[this.faces[B][0]])
            };
            var R = new b,
                T = new b,
                M = new b,
                G = new b,
                H = new b,
                S = new b,
                J = new b,
                ca = new b;
            a.prototype.clipFaceAgainstHull = function(B,
                w, A, F, D, Q, X) {
                for (var P = [], Z = -1, ma = Number.MAX_VALUE, ja = 0; ja < this.faces.length; ja++) {
                    R.copy(this.faceNormals[ja]);
                    A.vmult(R, R);
                    var fa = R.dot(B);
                    fa < ma && (ma = fa, Z = ja)
                }
                if (!(0 > Z)) {
                    B = this.faces[Z];
                    B.connectedFaces = [];
                    for (ma = 0; ma < this.faces.length; ma++)
                        for (ja = 0; ja < this.faces[ma].length; ja++) - 1 !== B.indexOf(this.faces[ma][ja]) && ma !== Z && -1 === B.connectedFaces.indexOf(ma) && B.connectedFaces.push(ma);
                    ma = B.length;
                    for (ja = 0; ja < ma; ja++) {
                        fa = this.vertices[B[ja]];
                        fa.vsub(this.vertices[B[(ja + 1) % ma]], T);
                        M.copy(T);
                        A.vmult(M,
                            M);
                        w.vadd(M, M);
                        G.copy(this.faceNormals[Z]);
                        A.vmult(G, G);
                        w.vadd(G, G);
                        M.cross(G, H);
                        H.negate(H);
                        S.copy(fa);
                        A.vmult(S, S);
                        w.vadd(S, S);
                        S.dot(H);
                        fa = B.connectedFaces[ja];
                        J.copy(this.faceNormals[fa]);
                        fa = this.getPlaneConstantOfFace(fa);
                        ca.copy(J);
                        A.vmult(ca, ca);
                        fa -= ca.dot(w);
                        for (this.clipFaceAgainstPlane(F, P, ca, fa); F.length;) F.shift();
                        for (; P.length;) F.push(P.shift())
                    }
                    J.copy(this.faceNormals[Z]);
                    fa = this.getPlaneConstantOfFace(Z);
                    ca.copy(J);
                    A.vmult(ca, ca);
                    fa -= ca.dot(w);
                    for (ma = 0; ma < F.length; ma++) w = ca.dot(F[ma]) +
                        fa, w <= D && (console.log("clamped: depth=" + w + " to minDist=" + (D + "")), w = D), w <= Q && (A = F[ma], 0 >= w && X.push({
                            point: A,
                            normal: ca,
                            depth: w
                        }))
                }
            };
            a.prototype.clipFaceAgainstPlane = function(B, w, A, F) {
                var D = B.length;
                if (2 > D) return w;
                var Q = B[B.length - 1];
                var X = A.dot(Q) + F;
                for (var P = 0; P < D; P++) {
                    var Z = B[P];
                    var ma = A.dot(Z) + F;
                    if (0 > X) {
                        if (0 > ma) {
                            var ja = new b;
                            ja.copy(Z)
                        } else ja = new b, Q.lerp(Z, X / (X - ma), ja);
                        w.push(ja)
                    } else 0 > ma && (ja = new b, Q.lerp(Z, X / (X - ma), ja), w.push(ja), w.push(Z));
                    Q = Z;
                    X = ma
                }
                return w
            };
            a.prototype.computeWorldVertices =
                function(B, w) {
                    for (var A = this.vertices.length; this.worldVertices.length < A;) this.worldVertices.push(new b);
                    for (var F = this.vertices, D = this.worldVertices, Q = 0; Q !== A; Q++) w.vmult(F[Q], D[Q]), B.vadd(D[Q], D[Q]);
                    this.worldVerticesNeedsUpdate = !1
                };
            new b;
            a.prototype.computeLocalAABB = function(B, w) {
                var A = this.vertices.length,
                    F = this.vertices;
                B.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                w.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                for (var D = 0; D < A; D++) {
                    var Q = F[D];
                    Q.x < B.x ? B.x = Q.x : Q.x > w.x &&
                        (w.x = Q.x);
                    Q.y < B.y ? B.y = Q.y : Q.y > w.y && (w.y = Q.y);
                    Q.z < B.z ? B.z = Q.z : Q.z > w.z && (w.z = Q.z)
                }
            };
            a.prototype.computeWorldFaceNormals = function(B) {
                for (var w = this.faceNormals.length; this.worldFaceNormals.length < w;) this.worldFaceNormals.push(new b);
                for (var A = this.faceNormals, F = this.worldFaceNormals, D = 0; D !== w; D++) B.vmult(A[D], F[D]);
                this.worldFaceNormalsNeedsUpdate = !1
            };
            a.prototype.updateBoundingSphereRadius = function() {
                for (var B = 0, w = this.vertices, A = 0, F = w.length; A !== F; A++) {
                    var D = w[A].norm2();
                    D > B && (B = D)
                }
                this.boundingSphereRadius =
                    Math.sqrt(B)
            };
            var O = new b;
            a.prototype.calculateWorldAABB = function(B, w, A, F) {
                for (var D = this.vertices.length, Q = this.vertices, X, P, Z, ma, ja, fa, U = 0; U < D; U++) {
                    O.copy(Q[U]);
                    w.vmult(O, O);
                    B.vadd(O, O);
                    var ba = O;
                    if (ba.x < X || void 0 === X) X = ba.x;
                    else if (ba.x > ma || void 0 === ma) ma = ba.x;
                    if (ba.y < P || void 0 === P) P = ba.y;
                    else if (ba.y > ja || void 0 === ja) ja = ba.y;
                    if (ba.z < Z || void 0 === Z) Z = ba.z;
                    else if (ba.z > fa || void 0 === fa) fa = ba.z
                }
                A.set(X, P, Z);
                F.set(ma, ja, fa)
            };
            a.prototype.volume = function() {
                return 4 * Math.PI * this.boundingSphereRadius / 3
            };
            a.prototype.getAveragePointLocal = function(B) {
                B = B || new b;
                for (var w = this.vertices.length, A = this.vertices, F = 0; F < w; F++) B.vadd(A[F], B);
                B.mult(1 / w, B);
                return B
            };
            a.prototype.transformAllPoints = function(B, w) {
                var A = this.vertices.length,
                    F = this.vertices;
                if (w) {
                    for (var D = 0; D < A; D++) {
                        var Q = F[D];
                        w.vmult(Q, Q)
                    }
                    for (D = 0; D < this.faceNormals.length; D++) Q = this.faceNormals[D], w.vmult(Q, Q)
                }
                if (B)
                    for (D = 0; D < A; D++) Q = F[D], Q.vadd(B, Q)
            };
            var Y = new b,
                K = new b,
                z = new b;
            a.prototype.pointIsInside = function(B) {
                var w = this.vertices,
                    A = this.faces,
                    F = this.faceNormals,
                    D = this.faces.length;
                this.getAveragePointLocal(Y);
                for (var Q = 0; Q < D; Q++) {
                    var X = F[Q];
                    var P = w[A[Q][0]],
                        Z = K;
                    B.vsub(P, Z);
                    Z = X.dot(Z);
                    var ma = z;
                    Y.vsub(P, ma);
                    X = X.dot(ma);
                    if (0 > Z && 0 < X || 0 < Z && 0 > X) return !1
                }
                return -1
            };
            new b;
            var C = new b,
                u = new b;
            a.project = function(B, w, A, F, D) {
                var Q = B.vertices.length;
                B = B.vertices;
                u.setZero();
                k.vectorToLocalFrame(A, F, w, C);
                k.pointToLocalFrame(A, F, u, u);
                F = u.dot(C);
                A = w = B[0].dot(C);
                for (var X = 1; X < Q; X++) {
                    var P = B[X].dot(C);
                    P > w && (w = P);
                    P < A && (A = P)
                }
                A -= F;
                w -= F;
                A > w && (Q = A, A = w, w = Q);
                D[0] =
                    w;
                D[1] = A
            }
        }, {
            "../math/Quaternion": 28,
            "../math/Transform": 29,
            "../math/Vec3": 30,
            "./Shape": 43
        }],
        39: [function(d, e, m) {
            function a(g, h, l, p) {
                var n = [],
                    q = [],
                    t = [],
                    r = [],
                    v = [],
                    x = Math.cos,
                    y = Math.sin;
                n.push(new b(h * x(0), h * y(0), .5 * -l));
                r.push(0);
                n.push(new b(g * x(0), g * y(0), .5 * l));
                v.push(1);
                for (var I = 0; I < p; I++) {
                    var E = 2 * Math.PI / p * (I + 1),
                        N = 2 * Math.PI / p * (I + .5);
                    I < p - 1 ? (n.push(new b(h * x(E), h * y(E), .5 * -l)), r.push(2 * I + 2), n.push(new b(g * x(E), g * y(E), .5 * l)), v.push(2 * I + 3), t.push([2 * I + 2, 2 * I + 3, 2 * I + 1, 2 * I])) : t.push([0, 1, 2 * I + 1, 2 * I]);
                    (1 ===
                        p % 2 || I < p / 2) && q.push(new b(x(N), y(N), 0))
                }
                t.push(v);
                q.push(new b(0, 0, 1));
                g = [];
                for (I = 0; I < r.length; I++) g.push(r[r.length - I - 1]);
                t.push(g);
                this.type = c.types.CONVEXPOLYHEDRON;
                k.call(this, n, t, q)
            }
            e.exports = a;
            var c = d("./Shape"),
                b = d("../math/Vec3");
            d("../math/Quaternion");
            var k = d("./ConvexPolyhedron");
            a.prototype = new k
        }, {
            "../math/Quaternion": 28,
            "../math/Vec3": 30,
            "./ConvexPolyhedron": 38,
            "./Shape": 43
        }],
        40: [function(d, e, m) {
            function a(h, l) {
                l = g.defaults(l, {
                    maxValue: null,
                    minValue: null,
                    elementSize: 1
                });
                this.data = h;
                this.maxValue = l.maxValue;
                this.minValue = l.minValue;
                this.elementSize = l.elementSize;
                null === l.minValue && this.updateMinValue();
                null === l.maxValue && this.updateMaxValue();
                this.cacheEnabled = !0;
                c.call(this);
                this.pillarConvex = new b;
                this.pillarOffset = new k;
                this.type = c.types.HEIGHTFIELD;
                this.updateBoundingSphereRadius();
                this._cachedPillars = {}
            }
            var c = d("./Shape"),
                b = d("./ConvexPolyhedron"),
                k = d("../math/Vec3"),
                g = d("../utils/Utils");
            e.exports = a;
            a.prototype = new c;
            a.prototype.update = function() {
                this._cachedPillars = {}
            };
            a.prototype.updateMinValue = function() {
                for (var h = this.data, l = h[0][0], p = 0; p !== h.length; p++)
                    for (var n = 0; n !== h[p].length; n++) {
                        var q = h[p][n];
                        q < l && (l = q)
                    }
                this.minValue = l
            };
            a.prototype.updateMaxValue = function() {
                for (var h = this.data, l = h[0][0], p = 0; p !== h.length; p++)
                    for (var n = 0; n !== h[p].length; n++) {
                        var q = h[p][n];
                        q > l && (l = q)
                    }
                this.maxValue = l
            };
            a.prototype.setHeightValueAtIndex = function(h, l, p) {
                this.data[h][l] = p;
                this.clearCachedConvexTrianglePillar(h, l, !1);
                0 < h && (this.clearCachedConvexTrianglePillar(h - 1, l, !0), this.clearCachedConvexTrianglePillar(h -
                    1, l, !1));
                0 < l && (this.clearCachedConvexTrianglePillar(h, l - 1, !0), this.clearCachedConvexTrianglePillar(h, l - 1, !1));
                0 < l && 0 < h && this.clearCachedConvexTrianglePillar(h - 1, l - 1, !0)
            };
            a.prototype.getRectMinMax = function(h, l, p, n, q) {
                q = q || [];
                for (var t = this.data, r = this.minValue; h <= p; h++)
                    for (var v = l; v <= n; v++) {
                        var x = t[h][v];
                        x > r && (r = x)
                    }
                q[0] = this.minValue;
                q[1] = r
            };
            a.prototype.getIndexOfPosition = function(h, l, p, n) {
                var q = this.elementSize,
                    t = this.data;
                h = Math.floor(h / q);
                l = Math.floor(l / q);
                p[0] = h;
                p[1] = l;
                n && (0 > h && (h = 0), 0 > l && (l = 0),
                    h >= t.length - 1 && (h = t.length - 1), l >= t[0].length - 1 && (l = t[0].length - 1));
                return 0 > h || 0 > l || h >= t.length - 1 || l >= t[0].length - 1 ? !1 : !0
            };
            a.prototype.getHeightAt = function(h, l, p) {
                var n = [];
                this.getIndexOfPosition(h, l, n, p);
                h = [];
                this.getRectMinMax(n[0], n[1] + 1, n[0], n[1] + 1, h);
                return (h[0] + h[1]) / 2
            };
            a.prototype.getCacheConvexTrianglePillarKey = function(h, l, p) {
                return h + "_" + l + "_" + (p ? 1 : 0)
            };
            a.prototype.getCachedConvexTrianglePillar = function(h, l, p) {
                return this._cachedPillars[this.getCacheConvexTrianglePillarKey(h, l, p)]
            };
            a.prototype.setCachedConvexTrianglePillar =
                function(h, l, p, n, q) {
                    this._cachedPillars[this.getCacheConvexTrianglePillarKey(h, l, p)] = {
                        convex: n,
                        offset: q
                    }
                };
            a.prototype.clearCachedConvexTrianglePillar = function(h, l, p) {
                delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(h, l, p)]
            };
            a.prototype.getConvexTrianglePillar = function(h, l, p) {
                var n = this.pillarConvex,
                    q = this.pillarOffset;
                if (this.cacheEnabled) {
                    var t = this.getCachedConvexTrianglePillar(h, l, p);
                    if (t) {
                        this.pillarConvex = t.convex;
                        this.pillarOffset = t.offset;
                        return
                    }
                    n = new b;
                    q = new k;
                    this.pillarConvex =
                        n;
                    this.pillarOffset = q
                }
                t = this.data;
                var r = this.elementSize,
                    v = n.faces;
                n.vertices.length = 6;
                for (var x = 0; 6 > x; x++) n.vertices[x] || (n.vertices[x] = new k);
                v.length = 5;
                for (x = 0; 5 > x; x++) v[x] || (v[x] = []);
                x = n.vertices;
                var y = (Math.min(t[h][l], t[h + 1][l], t[h][l + 1], t[h + 1][l + 1]) - this.minValue) / 2 + this.minValue;
                p ? (q.set((h + .75) * r, (l + .75) * r, y), x[0].set(.25 * r, .25 * r, t[h + 1][l + 1] - y), x[1].set(-.75 * r, .25 * r, t[h][l + 1] - y), x[2].set(.25 * r, -.75 * r, t[h + 1][l] - y), x[3].set(.25 * r, .25 * r, -y - 1), x[4].set(-.75 * r, .25 * r, -y - 1), x[5].set(.25 * r, -.75 *
                    r, -y - 1), v[0][0] = 0, v[0][1] = 1, v[0][2] = 2, v[1][0] = 5, v[1][1] = 4, v[1][2] = 3, v[2][0] = 2, v[2][1] = 5, v[2][2] = 3, v[2][3] = 0, v[3][0] = 3, v[3][1] = 4, v[3][2] = 1, v[3][3] = 0, v[4][0] = 1, v[4][1] = 4, v[4][2] = 5, v[4][3] = 2) : (q.set((h + .25) * r, (l + .25) * r, y), x[0].set(-.25 * r, -.25 * r, t[h][l] - y), x[1].set(.75 * r, -.25 * r, t[h + 1][l] - y), x[2].set(-.25 * r, .75 * r, t[h][l + 1] - y), x[3].set(-.25 * r, -.25 * r, -y - 1), x[4].set(.75 * r, -.25 * r, -y - 1), x[5].set(-.25 * r, .75 * r, -y - 1), v[0][0] = 0, v[0][1] = 1, v[0][2] = 2, v[1][0] = 5, v[1][1] = 4, v[1][2] = 3, v[2][0] = 0, v[2][1] = 2, v[2][2] = 5, v[2][3] =
                    3, v[3][0] = 1, v[3][1] = 0, v[3][2] = 3, v[3][3] = 4, v[4][0] = 4, v[4][1] = 5, v[4][2] = 2, v[4][3] = 1);
                n.computeNormals();
                n.computeEdges();
                n.updateBoundingSphereRadius();
                this.setCachedConvexTrianglePillar(h, l, p, n, q)
            };
            a.prototype.calculateLocalInertia = function(h, l) {
                l = l || new k;
                l.set(0, 0, 0);
                return l
            };
            a.prototype.volume = function() {
                return Number.MAX_VALUE
            };
            a.prototype.calculateWorldAABB = function(h, l, p, n) {
                p.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                n.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
            };
            a.prototype.updateBoundingSphereRadius = function() {
                var h = this.data,
                    l = this.elementSize;
                this.boundingSphereRadius = (new k(h.length * l, h[0].length * l, Math.max(Math.abs(this.maxValue), Math.abs(this.minValue)))).norm()
            }
        }, {
            "../math/Vec3": 30,
            "../utils/Utils": 53,
            "./ConvexPolyhedron": 38,
            "./Shape": 43
        }],
        41: [function(d, e, m) {
            function a() {
                c.call(this);
                this.type = c.types.PARTICLE
            }
            e.exports = a;
            var c = d("./Shape"),
                b = d("../math/Vec3");
            a.prototype = new c;
            a.prototype.constructor = a;
            a.prototype.calculateLocalInertia = function(k,
                g) {
                g = g || new b;
                g.set(0, 0, 0);
                return g
            };
            a.prototype.volume = function() {
                return 0
            };
            a.prototype.updateBoundingSphereRadius = function() {
                this.boundingSphereRadius = 0
            };
            a.prototype.calculateWorldAABB = function(k, g, h, l) {
                h.copy(k);
                l.copy(k)
            }
        }, {
            "../math/Vec3": 30,
            "./Shape": 43
        }],
        42: [function(d, e, m) {
            function a() {
                c.call(this);
                this.type = c.types.PLANE;
                this.worldNormal = new b;
                this.worldNormalNeedsUpdate = !0;
                this.boundingSphereRadius = Number.MAX_VALUE
            }
            e.exports = a;
            var c = d("./Shape"),
                b = d("../math/Vec3");
            a.prototype = new c;
            a.prototype.constructor =
                a;
            a.prototype.computeWorldNormal = function(g) {
                var h = this.worldNormal;
                h.set(0, 0, 1);
                g.vmult(h, h);
                this.worldNormalNeedsUpdate = !1
            };
            a.prototype.calculateLocalInertia = function(g, h) {
                return h = h || new b
            };
            a.prototype.volume = function() {
                return Number.MAX_VALUE
            };
            var k = new b;
            a.prototype.calculateWorldAABB = function(g, h, l, p) {
                k.set(0, 0, 1);
                h.vmult(k, k);
                h = Number.MAX_VALUE;
                l.set(-h, -h, -h);
                p.set(h, h, h);
                1 === k.x && (p.x = g.x);
                1 === k.y && (p.y = g.y);
                1 === k.z && (p.z = g.z); - 1 === k.x && (l.x = g.x); - 1 === k.y && (l.y = g.y); - 1 === k.z && (l.z = g.z)
            };
            a.prototype.updateBoundingSphereRadius = function() {
                this.boundingSphereRadius = Number.MAX_VALUE
            }
        }, {
            "../math/Vec3": 30,
            "./Shape": 43
        }],
        43: [function(d, e, m) {
            function a() {
                this.id = a.idCounter++;
                this.boundingSphereRadius = this.type = 0;
                this.collisionResponse = !0;
                this.material = null
            }
            e.exports = a;
            a = d("./Shape");
            d("../math/Vec3");
            d("../math/Quaternion");
            d("../material/Material");
            a.prototype.constructor = a;
            a.prototype.updateBoundingSphereRadius = function() {
                throw "computeBoundingSphereRadius() not implemented for shape type " +
                    this.type;
            };
            a.prototype.volume = function() {
                throw "volume() not implemented for shape type " + this.type;
            };
            a.prototype.calculateLocalInertia = function(c, b) {
                throw "calculateLocalInertia() not implemented for shape type " + this.type;
            };
            a.idCounter = 0;
            a.types = {
                SPHERE: 1,
                PLANE: 2,
                BOX: 4,
                COMPOUND: 8,
                CONVEXPOLYHEDRON: 16,
                HEIGHTFIELD: 32,
                PARTICLE: 64,
                CYLINDER: 128,
                TRIMESH: 256
            }
        }, {
            "../material/Material": 25,
            "../math/Quaternion": 28,
            "../math/Vec3": 30,
            "./Shape": 43
        }],
        44: [function(d, e, m) {
            function a(k) {
                c.call(this);
                this.radius = void 0 !==
                    k ? Number(k) : 1;
                this.type = c.types.SPHERE;
                if (0 > this.radius) throw Error("The sphere radius cannot be negative.");
                this.updateBoundingSphereRadius()
            }
            e.exports = a;
            var c = d("./Shape"),
                b = d("../math/Vec3");
            a.prototype = new c;
            a.prototype.constructor = a;
            a.prototype.calculateLocalInertia = function(k, g) {
                g = g || new b;
                var h = 2 * k * this.radius * this.radius / 5;
                g.x = h;
                g.y = h;
                g.z = h;
                return g
            };
            a.prototype.volume = function() {
                return 4 * Math.PI * this.radius / 3
            };
            a.prototype.updateBoundingSphereRadius = function() {
                this.boundingSphereRadius = this.radius
            };
            a.prototype.calculateWorldAABB = function(k, g, h, l) {
                g = this.radius;
                for (var p = ["x", "y", "z"], n = 0; n < p.length; n++) {
                    var q = p[n];
                    h[q] = k[q] - g;
                    l[q] = k[q] + g
                }
            }
        }, {
            "../math/Vec3": 30,
            "./Shape": 43
        }],
        45: [function(d, e, m) {
            function a(T, M) {
                c.call(this);
                this.type = c.types.TRIMESH;
                this.vertices = new Float32Array(T);
                this.indices = new Int16Array(M);
                this.normals = new Float32Array(M.length);
                this.aabb = new g;
                this.edges = null;
                this.scale = new b(1, 1, 1);
                this.tree = new h;
                this.updateEdges();
                this.updateNormals();
                this.updateAABB();
                this.updateBoundingSphereRadius();
                this.updateTree()
            }
            e.exports = a;
            var c = d("./Shape"),
                b = d("../math/Vec3");
            d("../math/Quaternion");
            var k = d("../math/Transform"),
                g = d("../collision/AABB"),
                h = d("../utils/Octree");
            a.prototype = new c;
            a.prototype.constructor = a;
            var l = new b;
            a.prototype.updateTree = function() {
                var T = this.tree;
                T.reset();
                T.aabb.copy(this.aabb);
                var M = this.scale;
                T.aabb.lowerBound.x *= 1 / M.x;
                T.aabb.lowerBound.y *= 1 / M.y;
                T.aabb.lowerBound.z *= 1 / M.z;
                T.aabb.upperBound.x *= 1 / M.x;
                T.aabb.upperBound.y *= 1 / M.y;
                T.aabb.upperBound.z *= 1 / M.z;
                M = new g;
                for (var G =
                        new b, H = new b, S = new b, J = [G, H, S], ca = 0; ca < this.indices.length / 3; ca++) {
                    var O = 3 * ca;
                    this._getUnscaledVertex(this.indices[O], G);
                    this._getUnscaledVertex(this.indices[O + 1], H);
                    this._getUnscaledVertex(this.indices[O + 2], S);
                    M.setFromPoints(J);
                    T.insert(M, ca)
                }
                T.removeEmptyNodes()
            };
            var p = new g;
            a.prototype.getTrianglesInAABB = function(T, M) {
                p.copy(T);
                var G = this.scale,
                    H = G.x,
                    S = G.y;
                G = G.z;
                var J = p.lowerBound,
                    ca = p.upperBound;
                J.x /= H;
                J.y /= S;
                J.z /= G;
                ca.x /= H;
                ca.y /= S;
                ca.z /= G;
                return this.tree.aabbQuery(p, M)
            };
            a.prototype.setScale =
                function(T) {
                    var M = T.x === T.y === T.z;
                    this.scale.x === this.scale.y === this.scale.z && M || this.updateNormals();
                    this.scale.copy(T);
                    this.updateAABB();
                    this.updateBoundingSphereRadius()
                };
            a.prototype.updateNormals = function() {
                for (var T = this.normals, M = 0; M < this.indices.length / 3; M++) {
                    var G = 3 * M,
                        H = this.indices[G + 1],
                        S = this.indices[G + 2];
                    this.getVertex(this.indices[G], v);
                    this.getVertex(H, x);
                    this.getVertex(S, y);
                    a.computeNormal(x, v, y, l);
                    T[G] = l.x;
                    T[G + 1] = l.y;
                    T[G + 2] = l.z
                }
            };
            a.prototype.updateEdges = function() {
                for (var T = {}, M = function(ca,
                        O) {
                        T[S < J ? S + "_" + J : J + "_" + S] = !0
                    }, G = 0; G < this.indices.length / 3; G++) {
                    var H = 3 * G,
                        S = this.indices[H],
                        J = this.indices[H + 1];
                    H = this.indices[H + 2];
                    M(S, J);
                    M(J, H);
                    M(H, S)
                }
                M = Object.keys(T);
                this.edges = new Int16Array(2 * M.length);
                for (G = 0; G < M.length; G++) H = M[G].split("_"), this.edges[2 * G] = parseInt(H[0], 10), this.edges[2 * G + 1] = parseInt(H[1], 10)
            };
            a.prototype.getEdgeVertex = function(T, M, G) {
                this.getVertex(this.edges[2 * T + (M ? 1 : 0)], G)
            };
            var n = new b,
                q = new b;
            a.prototype.getEdgeVector = function(T, M) {
                this.getEdgeVertex(T, 0, n);
                this.getEdgeVertex(T,
                    1, q);
                q.vsub(n, M)
            };
            var t = new b,
                r = new b;
            a.computeNormal = function(T, M, G, H) {
                M.vsub(T, r);
                G.vsub(M, t);
                t.cross(r, H);
                H.isZero() || H.normalize()
            };
            var v = new b,
                x = new b,
                y = new b;
            a.prototype.getVertex = function(T, M) {
                var G = this.scale;
                this._getUnscaledVertex(T, M);
                M.x *= G.x;
                M.y *= G.y;
                M.z *= G.z;
                return M
            };
            a.prototype._getUnscaledVertex = function(T, M) {
                var G = 3 * T,
                    H = this.vertices;
                return M.set(H[G], H[G + 1], H[G + 2])
            };
            a.prototype.getWorldVertex = function(T, M, G, H) {
                this.getVertex(T, H);
                k.pointToWorldFrame(M, G, H, H);
                return H
            };
            a.prototype.getTriangleVertices =
                function(T, M, G, H) {
                    T *= 3;
                    this.getVertex(this.indices[T], M);
                    this.getVertex(this.indices[T + 1], G);
                    this.getVertex(this.indices[T + 2], H)
                };
            a.prototype.getNormal = function(T, M) {
                var G = 3 * T;
                return M.set(this.normals[G], this.normals[G + 1], this.normals[G + 2])
            };
            var I = new g;
            a.prototype.calculateLocalInertia = function(T, M) {
                this.computeLocalAABB(I);
                var G = I.upperBound.x - I.lowerBound.x,
                    H = I.upperBound.y - I.lowerBound.y,
                    S = I.upperBound.z - I.lowerBound.z;
                return M.set(1 / 12 * T * (4 * H * H + 4 * S * S), 1 / 12 * T * (4 * G * G + 4 * S * S), 1 / 12 * T * (4 * H * H + 4 * G *
                    G))
            };
            var E = new b;
            a.prototype.computeLocalAABB = function(T) {
                var M = T.lowerBound;
                T = T.upperBound;
                var G = this.vertices.length;
                this.getVertex(0, E);
                M.copy(E);
                T.copy(E);
                for (var H = 0; H !== G; H++) this.getVertex(H, E), E.x < M.x ? M.x = E.x : E.x > T.x && (T.x = E.x), E.y < M.y ? M.y = E.y : E.y > T.y && (T.y = E.y), E.z < M.z ? M.z = E.z : E.z > T.z && (T.z = E.z)
            };
            a.prototype.updateAABB = function() {
                this.computeLocalAABB(this.aabb)
            };
            a.prototype.updateBoundingSphereRadius = function() {
                var T = 0,
                    M = this.vertices,
                    G = new b,
                    H = 0;
                for (M = M.length / 3; H !== M; H++) {
                    this.getVertex(H,
                        G);
                    var S = G.norm2();
                    S > T && (T = S)
                }
                this.boundingSphereRadius = Math.sqrt(T)
            };
            new b;
            var N = new k,
                R = new g;
            a.prototype.calculateWorldAABB = function(T, M, G, H) {
                N.position = T;
                N.quaternion = M;
                this.aabb.toWorldFrame(N, R);
                G.copy(R.lowerBound);
                H.copy(R.upperBound)
            };
            a.prototype.volume = function() {
                return 4 * Math.PI * this.boundingSphereRadius / 3
            };
            a.createTorus = function(T, M, G, H, S) {
                T = T || 1;
                M = M || .5;
                G = G || 8;
                H = H || 6;
                S = S || 2 * Math.PI;
                for (var J = [], ca = [], O = 0; O <= G; O++)
                    for (var Y = 0; Y <= H; Y++) {
                        var K = Y / H * S,
                            z = O / G * Math.PI * 2;
                        J.push((T + M * Math.cos(z)) *
                            Math.cos(K), (T + M * Math.cos(z)) * Math.sin(K), M * Math.sin(z))
                    }
                for (O = 1; O <= G; O++)
                    for (Y = 1; Y <= H; Y++) T = (H + 1) * (O - 1) + Y - 1, M = (H + 1) * (O - 1) + Y, S = (H + 1) * O + Y, ca.push((H + 1) * O + Y - 1, T, S), ca.push(T, M, S);
                return new a(J, ca)
            }
        }, {
            "../collision/AABB": 3,
            "../math/Quaternion": 28,
            "../math/Transform": 29,
            "../math/Vec3": 30,
            "../utils/Octree": 50,
            "./Shape": 43
        }],
        46: [function(d, e, m) {
            function a() {
                c.call(this);
                this.iterations = 10;
                this.tolerance = 1E-7
            }
            e.exports = a;
            d("../math/Vec3");
            d("../math/Quaternion");
            var c = d("./Solver");
            a.prototype = new c;
            var b = [],
                k = [],
                g = [];
            a.prototype.solve = function(h, l) {
                var p = 0,
                    n = this.iterations,
                    q = this.tolerance * this.tolerance,
                    t = this.equations,
                    r = t.length,
                    v = l.bodies,
                    x = v.length,
                    y;
                if (0 !== r)
                    for (y = 0; y !== x; y++) v[y].updateSolveMassProperties();
                k.length = r;
                g.length = r;
                b.length = r;
                for (y = 0; y !== r; y++) {
                    var I = t[y];
                    b[y] = 0;
                    g[y] = I.computeB(h);
                    k[y] = 1 / I.computeC()
                }
                if (0 !== r) {
                    for (y = 0; y !== x; y++) I = v[y], p = I.wlambda, I.vlambda.set(0, 0, 0), p && p.set(0, 0, 0);
                    for (p = 0; p !== n; p++) {
                        for (var E = y = 0; E !== r; E++) {
                            I = t[E];
                            var N = g[E];
                            var R = k[E];
                            var T = b[E];
                            var M = I.computeGWlambda();
                            N = R * (N - M - I.eps * T);
                            T + N < I.minForce ? N = I.minForce - T : T + N > I.maxForce && (N = I.maxForce - T);
                            b[E] += N;
                            y += 0 < N ? N : -N;
                            I.addToWlambda(N)
                        }
                        if (y * y < q) break
                    }
                    for (y = 0; y !== x; y++) I = v[y], n = I.velocity, q = I.angularVelocity, n.vadd(I.vlambda, n), q && q.vadd(I.wlambda, q)
                }
                return p
            }
        }, {
            "../math/Quaternion": 28,
            "../math/Vec3": 30,
            "./Solver": 47
        }],
        47: [function(d, e, m) {
            function a() {
                this.equations = []
            }
            e.exports = a;
            a.prototype.solve = function(c, b) {
                return 0
            };
            a.prototype.addEquation = function(c) {
                c.enabled && this.equations.push(c)
            };
            a.prototype.removeEquation =
                function(c) {
                    var b = this.equations;
                    c = b.indexOf(c); - 1 !== c && b.splice(c, 1)
                };
            a.prototype.removeAllEquations = function() {
                this.equations.length = 0
            }
        }, {}],
        48: [function(d, e, m) {
            function a(t, r, v) {
                g.call(this);
                this.iterations = r;
                this.tolerance = v;
                this.subsolver = t;
                this.nodes = [];
                for (this.nodePool = []; 128 > this.nodePool.length;) this.nodePool.push(this.createNode())
            }

            function c(t) {
                for (var r = t.length, v = 0; v !== r; v++) {
                    var x = t[v];
                    if (!(x.visited || x.body.type & n)) return x
                }
                return !1
            }

            function b(t, r, v) {
                r.push(t.body);
                r = t.eqs.length;
                for (var x = 0; x !== r; x++) {
                    var y = t.eqs[x]; - 1 === v.indexOf(y) && v.push(y)
                }
            }

            function k(t, r) {
                return r.id - t.id
            }
            e.exports = a;
            d("../math/Vec3");
            d("../math/Quaternion");
            var g = d("./Solver");
            d = d("../objects/Body");
            a.prototype = new g;
            var h = [],
                l = [],
                p = {
                    bodies: []
                },
                n = d.STATIC,
                q = [];
            a.prototype.createNode = function() {
                return {
                    body: null,
                    children: [],
                    eqs: [],
                    visited: !1
                }
            };
            a.prototype.solve = function(t, r) {
                for (var v = this.nodePool, x = r.bodies, y = this.equations, I = y.length, E = x.length, N = this.subsolver; v.length < E;) v.push(this.createNode());
                h.length = E;
                for (var R = 0; R < E; R++) h[R] = v[R];
                for (R = 0; R !== E; R++) v = h[R], v.body = x[R], v.children.length = 0, v.eqs.length = 0, v.visited = !1;
                for (E = 0; E !== I; E++) {
                    v = y[E];
                    R = x.indexOf(v.bi);
                    var T = x.indexOf(v.bj);
                    R = h[R];
                    T = h[T];
                    R.children.push(T);
                    R.eqs.push(v);
                    T.children.push(R);
                    T.eqs.push(v)
                }
                x = 0;
                y = l;
                N.tolerance = this.tolerance;
                for (N.iterations = this.iterations; R = c(h);) {
                    y.length = 0;
                    p.bodies.length = 0;
                    v = R;
                    R = b;
                    I = p.bodies;
                    E = y;
                    q.push(v);
                    v.visited = !0;
                    for (R(v, I, E); q.length;)
                        for (v = q.pop(); T = c(v.children);) T.visited = !0, R(T, I, E), q.push(T);
                    I = y.length;
                    y = y.sort(k);
                    for (R = 0; R !== I; R++) N.addEquation(y[R]);
                    N.solve(t, p);
                    N.removeAllEquations();
                    x++
                }
                return x
            }
        }, {
            "../math/Quaternion": 28,
            "../math/Vec3": 30,
            "../objects/Body": 31,
            "./Solver": 47
        }],
        49: [function(d, e, m) {
            d = function() {};
            e.exports = d;
            d.prototype = {
                constructor: d,
                addEventListener: function(a, c) {
                    void 0 === this._listeners && (this._listeners = {});
                    var b = this._listeners;
                    void 0 === b[a] && (b[a] = []); - 1 === b[a].indexOf(c) && b[a].push(c);
                    return this
                },
                hasEventListener: function(a, c) {
                    if (void 0 === this._listeners) return !1;
                    var b = this._listeners;
                    return void 0 !== b[a] && -1 !== b[a].indexOf(c) ? !0 : !1
                },
                removeEventListener: function(a, c) {
                    if (void 0 === this._listeners) return this;
                    var b = this._listeners;
                    if (void 0 === b[a]) return this;
                    var k = b[a].indexOf(c); - 1 !== k && b[a].splice(k, 1);
                    return this
                },
                dispatchEvent: function(a) {
                    if (void 0 === this._listeners) return this;
                    var c = this._listeners[a.type];
                    if (void 0 !== c) {
                        a.target = this;
                        for (var b = 0, k = c.length; b < k; b++) c[b].call(this, a)
                    }
                    return this
                }
            }
        }, {}],
        50: [function(d, e, m) {
            function a(l) {
                l = l || {};
                this.root =
                    l.root || null;
                this.aabb = l.aabb ? l.aabb.clone() : new b;
                this.data = [];
                this.children = []
            }

            function c(l, p) {
                p = p || {};
                p.root = null;
                p.aabb = l;
                a.call(this, p);
                this.maxDepth = "undefined" !== typeof p.maxDepth ? p.maxDepth : 8
            }
            var b = d("../collision/AABB"),
                k = d("../math/Vec3");
            e.exports = c;
            c.prototype = new a;
            a.prototype.reset = function(l, p) {
                this.children.length = this.data.length = 0
            };
            a.prototype.insert = function(l, p, n) {
                var q = this.data;
                n = n || 0;
                if (!this.aabb.contains(l)) return !1;
                var t = this.children;
                if (n < (this.maxDepth || this.root.maxDepth)) {
                    var r = !1;
                    t.length || (this.subdivide(), r = !0);
                    for (var v = 0; 8 !== v; v++)
                        if (t[v].insert(l, p, n + 1)) return !0;
                    r && (t.length = 0)
                }
                q.push(p);
                return !0
            };
            var g = new k;
            a.prototype.subdivide = function() {
                var l = this.aabb,
                    p = l.lowerBound,
                    n = l.upperBound;
                l = this.children;
                l.push(new a({
                    aabb: new b({
                        lowerBound: new k(0, 0, 0)
                    })
                }), new a({
                    aabb: new b({
                        lowerBound: new k(1, 0, 0)
                    })
                }), new a({
                    aabb: new b({
                        lowerBound: new k(1, 1, 0)
                    })
                }), new a({
                    aabb: new b({
                        lowerBound: new k(1, 1, 1)
                    })
                }), new a({
                    aabb: new b({
                        lowerBound: new k(0, 1, 1)
                    })
                }), new a({
                    aabb: new b({
                        lowerBound: new k(0,
                            0, 1)
                    })
                }), new a({
                    aabb: new b({
                        lowerBound: new k(1, 0, 1)
                    })
                }), new a({
                    aabb: new b({
                        lowerBound: new k(0, 1, 0)
                    })
                }));
                n.vsub(p, g);
                g.scale(.5, g);
                n = this.root || this;
                for (var q = 0; 8 !== q; q++) {
                    var t = l[q];
                    t.root = n;
                    var r = t.aabb.lowerBound;
                    r.x *= g.x;
                    r.y *= g.y;
                    r.z *= g.z;
                    r.vadd(p, r);
                    r.vadd(g, t.aabb.upperBound)
                }
            };
            a.prototype.aabbQuery = function(l, p) {
                for (var n = [this]; n.length;) {
                    var q = n.pop();
                    q.aabb.overlaps(l) && Array.prototype.push.apply(p, q.data);
                    Array.prototype.push.apply(n, q.children)
                }
                return p
            };
            var h = new b;
            a.prototype.rayQuery =
                function(l, p, n) {
                    l.getAABB(h);
                    h.toLocalFrame(p, h);
                    this.aabbQuery(h, n);
                    return n
                };
            a.prototype.removeEmptyNodes = function() {
                for (var l = [this]; l.length;) {
                    for (var p = l.pop(), n = p.children.length - 1; 0 <= n; n--) p.children[n].data.length || p.children.splice(n, 1);
                    Array.prototype.push.apply(l, p.children)
                }
            }
        }, {
            "../collision/AABB": 3,
            "../math/Vec3": 30
        }],
        51: [function(d, e, m) {
            function a() {
                this.objects = [];
                this.type = Object
            }
            e.exports = a;
            a.prototype.release = function() {
                for (var c = arguments.length, b = 0; b !== c; b++) this.objects.push(arguments[b])
            };
            a.prototype.get = function() {
                return 0 === this.objects.length ? this.constructObject() : this.objects.pop()
            };
            a.prototype.constructObject = function() {
                throw Error("constructObject() not implemented in this Pool subclass yet!");
            }
        }, {}],
        52: [function(d, e, m) {
            function a() {
                this.data = {
                    keys: []
                }
            }
            e.exports = a;
            a.prototype.get = function(c, b) {
                if (c > b) {
                    var k = b;
                    b = c;
                    c = k
                }
                return this.data[c + "-" + b]
            };
            a.prototype.set = function(c, b, k) {
                if (c > b) {
                    var g = b;
                    b = c;
                    c = g
                }
                g = c + "-" + b;
                this.get(c, b) || this.data.keys.push(g);
                this.data[g] = k
            };
            a.prototype.reset =
                function() {
                    for (var c = this.data, b = c.keys; 0 < b.length;) {
                        var k = b.pop();
                        delete c[k]
                    }
                }
        }, {}],
        53: [function(d, e, m) {
            function a() {}
            e.exports = a;
            a.defaults = function(c, b) {
                c = c || {};
                for (var k in b) k in c || (c[k] = b[k]);
                return c
            }
        }, {}],
        54: [function(d, e, m) {
            function a() {
                b.call(this);
                this.type = c
            }
            e.exports = a;
            var c = d("../math/Vec3"),
                b = d("./Pool");
            a.prototype = new b;
            a.prototype.constructObject = function() {
                return new c
            }
        }, {
            "../math/Vec3": 30,
            "./Pool": 51
        }],
        55: [function(d, e, m) {
            function a(L) {
                this.contactPointPool = [];
                this.frictionEquationPool = [];
                this.result = [];
                this.frictionResult = [];
                this.v3pool = new h;
                this.world = L;
                this.currentContactMaterial = null;
                this.enableFrictionReduction = !1
            }
            e.exports = a;
            e = d("../collision/AABB");
            m = d("../shapes/Shape");
            var c = d("../collision/Ray"),
                b = d("../math/Vec3"),
                k = d("../math/Transform");
            d("../shapes/ConvexPolyhedron");
            var g = d("../math/Quaternion");
            d("../solver/Solver");
            var h = d("../utils/Vec3Pool"),
                l = d("../equations/ContactEquation"),
                p = d("../equations/FrictionEquation");
            a.prototype.createContactEquation = function(L,
                V, ha, ka, aa, ea) {
                if (this.contactPointPool.length) {
                    var la = this.contactPointPool.pop();
                    la.bi = L;
                    la.bj = V
                } else la = new l(L, V);
                la.enabled = L.collisionResponse && V.collisionResponse && ha.collisionResponse && ka.collisionResponse;
                var qa = this.currentContactMaterial;
                la.restitution = qa.restitution;
                la.setSpookParams(qa.contactEquationStiffness, qa.contactEquationRelaxation, this.world.dt);
                L = ha.material || L.material;
                V = ka.material || V.material;
                L && V && 0 <= L.restitution && 0 <= V.restitution && (la.restitution = L.restitution * V.restitution);
                la.si = aa || ha;
                la.sj = ea || ka;
                return la
            };
            a.prototype.createFrictionEquationsFromContact = function(L, V) {
                var ha = L.bi,
                    ka = L.bj,
                    aa = this.world,
                    ea = this.currentContactMaterial,
                    la = ea.friction,
                    qa = L.si.material || ha.material,
                    na = L.sj.material || ka.material;
                qa && na && 0 <= qa.friction && 0 <= na.friction && (la = qa.friction * na.friction);
                if (0 < la) {
                    la *= aa.gravity.length();
                    qa = ha.invMass + ka.invMass;
                    0 < qa && (qa = 1 / qa);
                    var ia = this.frictionEquationPool;
                    na = ia.length ? ia.pop() : new p(ha, ka, la * qa);
                    ia = ia.length ? ia.pop() : new p(ha, ka, la * qa);
                    na.bi =
                        ia.bi = ha;
                    na.bj = ia.bj = ka;
                    na.minForce = ia.minForce = -la * qa;
                    na.maxForce = ia.maxForce = la * qa;
                    na.ri.copy(L.ri);
                    na.rj.copy(L.rj);
                    ia.ri.copy(L.ri);
                    ia.rj.copy(L.rj);
                    L.ni.tangents(na.t, ia.t);
                    na.setSpookParams(ea.frictionEquationStiffness, ea.frictionEquationRelaxation, aa.dt);
                    ia.setSpookParams(ea.frictionEquationStiffness, ea.frictionEquationRelaxation, aa.dt);
                    na.enabled = ia.enabled = L.enabled;
                    V.push(na, ia);
                    return !0
                }
                return !1
            };
            var n = new b,
                q = new b,
                t = new b;
            a.prototype.createFrictionFromAverage = function(L) {
                var V = this.result[this.result.length -
                    1];
                if (this.createFrictionEquationsFromContact(V, this.frictionResult) && 1 !== L) {
                    var ha = this.frictionResult[this.frictionResult.length - 2],
                        ka = this.frictionResult[this.frictionResult.length - 1];
                    n.setZero();
                    q.setZero();
                    t.setZero();
                    for (var aa = V.bi, ea = 0; ea !== L; ea++) V = this.result[this.result.length - 1 - ea], V.bodyA !== aa ? (n.vadd(V.ni, n), q.vadd(V.ri, q), t.vadd(V.rj, t)) : (n.vsub(V.ni, n), q.vadd(V.rj, q), t.vadd(V.ri, t));
                    L = 1 / L;
                    q.scale(L, ha.ri);
                    t.scale(L, ha.rj);
                    ka.ri.copy(ha.ri);
                    ka.rj.copy(ha.rj);
                    n.normalize();
                    n.tangents(ha.t,
                        ka.t)
                }
            };
            var r = new b,
                v = new b,
                x = new g,
                y = new g;
            a.prototype.getContacts = function(L, V, ha, ka, aa, ea, la) {
                this.contactPointPool = aa;
                this.frictionEquationPool = la;
                this.result = ka;
                this.frictionResult = ea;
                ka = 0;
                for (aa = L.length; ka !== aa; ka++) {
                    ea = L[ka];
                    la = V[ka];
                    var qa = null;
                    ea.material && la.material && (qa = ha.getContactMaterial(ea.material, la.material) || null);
                    for (var na = 0; na < ea.shapes.length; na++) {
                        ea.quaternion.mult(ea.shapeOrientations[na], x);
                        ea.quaternion.vmult(ea.shapeOffsets[na], r);
                        r.vadd(ea.position, r);
                        for (var ia = ea.shapes[na],
                                W = 0; W < la.shapes.length; W++) {
                            la.quaternion.mult(la.shapeOrientations[W], y);
                            la.quaternion.vmult(la.shapeOffsets[W], v);
                            v.vadd(la.position, v);
                            var sa = la.shapes[W];
                            if (!(r.distanceTo(v) > ia.boundingSphereRadius + sa.boundingSphereRadius)) {
                                var pa = null;
                                ia.material && sa.material && (pa = ha.getContactMaterial(ia.material, sa.material) || null);
                                this.currentContactMaterial = pa || qa || ha.defaultContactMaterial;
                                (pa = this[ia.type | sa.type]) && (ia.type < sa.type ? pa.call(this, ia, sa, r, v, x, y, ea, la, ia, sa) : pa.call(this, sa, ia, v, r, y, x, la,
                                    ea, ia, sa))
                            }
                        }
                    }
                }
            };
            a.prototype[m.types.BOX | m.types.BOX] = a.prototype.boxBox = function(L, V, ha, ka, aa, ea, la, qa) {
                L.convexPolyhedronRepresentation.material = L.material;
                V.convexPolyhedronRepresentation.material = V.material;
                L.convexPolyhedronRepresentation.collisionResponse = L.collisionResponse;
                V.convexPolyhedronRepresentation.collisionResponse = V.collisionResponse;
                this.convexConvex(L.convexPolyhedronRepresentation, V.convexPolyhedronRepresentation, ha, ka, aa, ea, la, qa, L, V)
            };
            a.prototype[m.types.BOX | m.types.CONVEXPOLYHEDRON] =
                a.prototype.boxConvex = function(L, V, ha, ka, aa, ea, la, qa) {
                    L.convexPolyhedronRepresentation.material = L.material;
                    L.convexPolyhedronRepresentation.collisionResponse = L.collisionResponse;
                    this.convexConvex(L.convexPolyhedronRepresentation, V, ha, ka, aa, ea, la, qa, L, V)
                };
            a.prototype[m.types.BOX | m.types.PARTICLE] = a.prototype.boxParticle = function(L, V, ha, ka, aa, ea, la, qa) {
                L.convexPolyhedronRepresentation.material = L.material;
                L.convexPolyhedronRepresentation.collisionResponse = L.collisionResponse;
                this.convexParticle(L.convexPolyhedronRepresentation,
                    V, ha, ka, aa, ea, la, qa, L, V)
            };
            a.prototype[m.types.SPHERE] = a.prototype.sphereSphere = function(L, V, ha, ka, aa, ea, la, qa) {
                aa = this.createContactEquation(la, qa, L, V);
                ka.vsub(ha, aa.ni);
                aa.ni.normalize();
                aa.ri.copy(aa.ni);
                aa.rj.copy(aa.ni);
                aa.ri.mult(L.radius, aa.ri);
                aa.rj.mult(-V.radius, aa.rj);
                aa.ri.vadd(ha, aa.ri);
                aa.ri.vsub(la.position, aa.ri);
                aa.rj.vadd(ka, aa.rj);
                aa.rj.vsub(qa.position, aa.rj);
                this.result.push(aa);
                this.createFrictionEquationsFromContact(aa, this.frictionResult)
            };
            var I = new b,
                E = new b,
                N = new b;
            a.prototype[m.types.PLANE |
                m.types.TRIMESH] = a.prototype.planeTrimesh = function(L, V, ha, ka, aa, ea, la, qa) {
                var na = new b;
                I.set(0, 0, 1);
                aa.vmult(I, I);
                for (aa = 0; aa < V.vertices.length / 3; aa++) {
                    V.getVertex(aa, na);
                    var ia = new b;
                    ia.copy(na);
                    k.pointToWorldFrame(ka, ea, ia, na);
                    ia = E;
                    na.vsub(ha, ia);
                    if (0 >= I.dot(ia)) {
                        var W = this.createContactEquation(la, qa, L, V);
                        W.ni.copy(I);
                        var sa = N;
                        I.scale(ia.dot(I), sa);
                        na.vsub(sa, sa);
                        W.ri.copy(sa);
                        W.ri.vsub(la.position, W.ri);
                        W.rj.copy(na);
                        W.rj.vsub(qa.position, W.rj);
                        this.result.push(W);
                        this.createFrictionEquationsFromContact(W,
                            this.frictionResult)
                    }
                }
            };
            var R = new b,
                T = new b;
            new b;
            var M = new b,
                G = new b,
                H = new b,
                S = new b,
                J = new b,
                ca = new b,
                O = new b,
                Y = new b,
                K = new b,
                z = new b,
                C = new b,
                u = new e,
                B = [];
            a.prototype[m.types.SPHERE | m.types.TRIMESH] = a.prototype.sphereTrimesh = function(L, V, ha, ka, aa, ea, la, qa) {
                k.pointToLocalFrame(ka, ea, ha, O);
                aa = L.radius;
                u.lowerBound.set(O.x - aa, O.y - aa, O.z - aa);
                u.upperBound.set(O.x + aa, O.y + aa, O.z + aa);
                V.getTrianglesInAABB(u, B);
                var na = L.radius * L.radius;
                for (aa = 0; aa < B.length; aa++)
                    for (var ia = 0; 3 > ia; ia++)
                        if (V.getVertex(V.indices[3 *
                                B[aa] + ia], M), M.vsub(O, T), T.norm2() <= na) {
                            G.copy(M);
                            k.pointToWorldFrame(ka, ea, G, M);
                            M.vsub(ha, T);
                            var W = this.createContactEquation(la, qa, L, V);
                            W.ni.copy(T);
                            W.ni.normalize();
                            W.ri.copy(W.ni);
                            W.ri.scale(L.radius, W.ri);
                            W.ri.vadd(ha, W.ri);
                            W.ri.vsub(la.position, W.ri);
                            W.rj.copy(M);
                            W.rj.vsub(qa.position, W.rj);
                            this.result.push(W);
                            this.createFrictionEquationsFromContact(W, this.frictionResult)
                        } for (aa = 0; aa < B.length; aa++)
                    for (ia = 0; 3 > ia; ia++) V.getVertex(V.indices[3 * B[aa] + ia], H), V.getVertex(V.indices[3 * B[aa] + (ia + 1) % 3],
                        S), S.vsub(H, J), O.vsub(S, Y), ha = Y.dot(J), O.vsub(H, Y), W = Y.dot(J), 0 < W && 0 > ha && (O.vsub(H, Y), ca.copy(J), ca.normalize(), W = Y.dot(ca), ca.scale(W, Y), Y.vadd(H, Y), ha = Y.distanceTo(O), ha < L.radius && (W = this.createContactEquation(la, qa, L, V), Y.vsub(O, W.ni), W.ni.normalize(), W.ni.scale(L.radius, W.ri), k.pointToWorldFrame(ka, ea, Y, Y), Y.vsub(qa.position, W.rj), k.vectorToWorldFrame(ea, W.ni, W.ni), k.vectorToWorldFrame(ea, W.ri, W.ri), this.result.push(W), this.createFrictionEquationsFromContact(W, this.frictionResult)));
                aa = 0;
                for (ia =
                    B.length; aa !== ia; aa++) V.getTriangleVertices(B[aa], K, z, C), V.getNormal(B[aa], R), O.vsub(K, Y), ha = Y.dot(R), R.scale(ha, Y), O.vsub(Y, Y), ha = Y.distanceTo(O), c.pointInTriangle(Y, K, z, C) && ha < L.radius && (W = this.createContactEquation(la, qa, L, V), Y.vsub(O, W.ni), W.ni.normalize(), W.ni.scale(L.radius, W.ri), k.pointToWorldFrame(ka, ea, Y, Y), Y.vsub(qa.position, W.rj), k.vectorToWorldFrame(ea, W.ni, W.ni), k.vectorToWorldFrame(ea, W.ri, W.ri), this.result.push(W), this.createFrictionEquationsFromContact(W, this.frictionResult));
                B.length =
                    0
            };
            var w = new b,
                A = new b;
            a.prototype[m.types.SPHERE | m.types.PLANE] = a.prototype.spherePlane = function(L, V, ha, ka, aa, ea, la, qa) {
                V = this.createContactEquation(la, qa, L, V);
                V.ni.set(0, 0, 1);
                ea.vmult(V.ni, V.ni);
                V.ni.negate(V.ni);
                V.ni.normalize();
                V.ni.mult(L.radius, V.ri);
                ha.vsub(ka, w);
                V.ni.mult(V.ni.dot(w), A);
                w.vsub(A, V.rj); - w.dot(V.ni) <= L.radius && (L = V.ri, ea = V.rj, L.vadd(ha, L), L.vsub(la.position, L), ea.vadd(ka, ea), ea.vsub(qa.position, ea), this.result.push(V), this.createFrictionEquationsFromContact(V, this.frictionResult))
            };
            var F = new b,
                D = new b,
                Q = new b,
                X = new b,
                P = new b,
                Z = new b,
                ma = new b,
                ja = [new b, new b, new b, new b, new b, new b],
                fa = new b,
                U = new b,
                ba = new b,
                da = new b;
            a.prototype[m.types.SPHERE | m.types.BOX] = a.prototype.sphereBox = function(L, V, ha, ka, aa, ea, la, qa) {
                aa = this.v3pool;
                ha.vsub(ka, X);
                V.getSideNormals(ja, ea);
                ea = L.radius;
                for (var na = !1, ia = null, W = 0, sa = 0, pa = 0, va = null, wa = 0, xa = ja.length; wa !== xa && !1 === na; wa++) {
                    var ya = P;
                    ya.copy(ja[wa]);
                    var za = ya.norm();
                    ya.normalize();
                    var ta = X.dot(ya);
                    if (ta < za + ea && 0 < ta) {
                        var Aa = Z,
                            Ba = ma;
                        Aa.copy(ja[(wa +
                            1) % 3]);
                        Ba.copy(ja[(wa + 2) % 3]);
                        var Ca = Aa.norm(),
                            Ga = Ba.norm();
                        Aa.normalize();
                        Ba.normalize();
                        var Ea = X.dot(Aa),
                            Fa = X.dot(Ba);
                        Ea < Ca && Ea > -Ca && Fa < Ga && Fa > -Ga && (ta = Math.abs(ta - za - ea), null === va || ta < va) && (va = ta, sa = Ea, pa = Fa, ia = za, U.copy(ya), ba.copy(Aa), da.copy(Ba), W++)
                    }
                }
                W && (na = !0, W = this.createContactEquation(la, qa, L, V), U.mult(-ea, W.ri), W.ni.copy(U), W.ni.negate(W.ni), U.mult(ia, U), ba.mult(sa, ba), U.vadd(ba, U), da.mult(pa, da), U.vadd(da, W.rj), W.ri.vadd(ha, W.ri), W.ri.vsub(la.position, W.ri), W.rj.vadd(ka, W.rj), W.rj.vsub(qa.position,
                    W.rj), this.result.push(W), this.createFrictionEquationsFromContact(W, this.frictionResult));
                ta = aa.get();
                for (ia = 0; 2 !== ia && !na; ia++)
                    for (sa = 0; 2 !== sa && !na; sa++)
                        for (pa = 0; 2 !== pa && !na; pa++) ta.set(0, 0, 0), ia ? ta.vadd(ja[0], ta) : ta.vsub(ja[0], ta), sa ? ta.vadd(ja[1], ta) : ta.vsub(ja[1], ta), pa ? ta.vadd(ja[2], ta) : ta.vsub(ja[2], ta), ka.vadd(ta, fa), fa.vsub(ha, fa), fa.norm2() < ea * ea && (na = !0, W = this.createContactEquation(la, qa, L, V), W.ri.copy(fa), W.ri.normalize(), W.ni.copy(W.ri), W.ri.mult(ea, W.ri), W.rj.copy(ta), W.ri.vadd(ha, W.ri),
                            W.ri.vsub(la.position, W.ri), W.rj.vadd(ka, W.rj), W.rj.vsub(qa.position, W.rj), this.result.push(W), this.createFrictionEquationsFromContact(W, this.frictionResult));
                aa.release(ta);
                va = aa.get();
                wa = aa.get();
                W = aa.get();
                xa = aa.get();
                ta = aa.get();
                ya = ja.length;
                for (ia = 0; ia !== ya && !na; ia++)
                    for (sa = 0; sa !== ya && !na; sa++)
                        if (ia % 3 !== sa % 3) {
                            ja[sa].cross(ja[ia], va);
                            va.normalize();
                            ja[ia].vadd(ja[sa], wa);
                            W.copy(ha);
                            W.vsub(wa, W);
                            W.vsub(ka, W);
                            za = W.dot(va);
                            va.mult(za, xa);
                            for (pa = 0; pa === ia % 3 || pa === sa % 3;) pa++;
                            ta.copy(ha);
                            ta.vsub(xa,
                                ta);
                            ta.vsub(wa, ta);
                            ta.vsub(ka, ta);
                            za = Math.abs(za);
                            Aa = ta.norm();
                            za < ja[pa].norm() && Aa < ea && (na = !0, pa = this.createContactEquation(la, qa, L, V), wa.vadd(xa, pa.rj), pa.rj.copy(pa.rj), ta.negate(pa.ni), pa.ni.normalize(), pa.ri.copy(pa.rj), pa.ri.vadd(ka, pa.ri), pa.ri.vsub(ha, pa.ri), pa.ri.normalize(), pa.ri.mult(ea, pa.ri), pa.ri.vadd(ha, pa.ri), pa.ri.vsub(la.position, pa.ri), pa.rj.vadd(ka, pa.rj), pa.rj.vsub(qa.position, pa.rj), this.result.push(pa), this.createFrictionEquationsFromContact(pa, this.frictionResult))
                        } aa.release(va,
                    wa, W, xa, ta)
            };
            var oa = new b,
                ua = new b,
                ra = new b,
                Da = new b,
                Ra = new b,
                Sa = new b,
                Ua = new b,
                eb = new b,
                fb = new b,
                gb = new b;
            a.prototype[m.types.SPHERE | m.types.CONVEXPOLYHEDRON] = a.prototype.sphereConvex = function(L, V, ha, ka, aa, ea, la, qa) {
                aa = this.v3pool;
                ha.vsub(ka, oa);
                for (var na = V.faceNormals, ia = V.faces, W = V.vertices, sa = L.radius, pa = 0; pa !== W.length; pa++) {
                    var va = Ra;
                    ea.vmult(W[pa], va);
                    ka.vadd(va, va);
                    var wa = Da;
                    va.vsub(ha, wa);
                    if (wa.norm2() < sa * sa) {
                        L = this.createContactEquation(la, qa, L, V);
                        L.ri.copy(wa);
                        L.ri.normalize();
                        L.ni.copy(L.ri);
                        L.ri.mult(sa, L.ri);
                        va.vsub(ka, L.rj);
                        L.ri.vadd(ha, L.ri);
                        L.ri.vsub(la.position, L.ri);
                        L.rj.vadd(ka, L.rj);
                        L.rj.vsub(qa.position, L.rj);
                        this.result.push(L);
                        this.createFrictionEquationsFromContact(L, this.frictionResult);
                        return
                    }
                }
                pa = 0;
                for (va = ia.length; pa !== va; pa++) {
                    wa = ia[pa];
                    var xa = Sa;
                    ea.vmult(na[pa], xa);
                    var ya = Ua;
                    ea.vmult(W[wa[0]], ya);
                    ya.vadd(ka, ya);
                    var za = eb;
                    xa.mult(-sa, za);
                    ha.vadd(za, za);
                    var ta = fb;
                    za.vsub(ya, ta);
                    za = ta.dot(xa);
                    ta = gb;
                    ha.vsub(ya, ta);
                    if (0 > za && 0 < ta.dot(xa)) {
                        ya = [];
                        ta = 0;
                        for (var Aa = wa.length; ta !==
                            Aa; ta++) {
                            var Ba = aa.get();
                            ea.vmult(W[wa[ta]], Ba);
                            ka.vadd(Ba, Ba);
                            ya.push(Ba)
                        }
                        a: {
                            ta = ya;Aa = xa;Ba = ha;
                            for (var Ca = null, Ga = ta.length, Ea = 0; Ea !== Ga; Ea++) {
                                var Fa = ta[Ea],
                                    Ta = F;
                                ta[(Ea + 1) % Ga].vsub(Fa, Ta);
                                var $a = D;
                                Ta.cross(Aa, $a);
                                Ta = Q;
                                Ba.vsub(Fa, Ta);
                                Fa = $a.dot(Ta);
                                if (null === Ca || 0 < Fa && !0 === Ca || 0 >= Fa && !1 === Ca) null === Ca && (Ca = 0 < Fa);
                                else {
                                    ta = !1;
                                    break a
                                }
                            }
                            ta = !0
                        }
                        if (ta) {
                            L = this.createContactEquation(la, qa, L, V);
                            xa.mult(-sa, L.ri);
                            xa.negate(L.ni);
                            V = aa.get();
                            xa.mult(-za, V);
                            ea = aa.get();
                            xa.mult(-sa, ea);
                            ha.vsub(ka, L.rj);
                            L.rj.vadd(ea,
                                L.rj);
                            L.rj.vadd(V, L.rj);
                            L.rj.vadd(ka, L.rj);
                            L.rj.vsub(qa.position, L.rj);
                            L.ri.vadd(ha, L.ri);
                            L.ri.vsub(la.position, L.ri);
                            aa.release(V);
                            aa.release(ea);
                            this.result.push(L);
                            this.createFrictionEquationsFromContact(L, this.frictionResult);
                            ta = 0;
                            for (wa = ya.length; ta !== wa; ta++) aa.release(ya[ta]);
                            break
                        } else
                            for (ta = 0; ta !== wa.length; ta++) {
                                xa = aa.get();
                                za = aa.get();
                                ea.vmult(W[wa[(ta + 1) % wa.length]], xa);
                                ea.vmult(W[wa[(ta + 2) % wa.length]], za);
                                ka.vadd(xa, xa);
                                ka.vadd(za, za);
                                Ga = ua;
                                za.vsub(xa, Ga);
                                Ca = ra;
                                Ga.unit(Ca);
                                Aa = aa.get();
                                Ba = aa.get();
                                ha.vsub(xa, Ba);
                                Ea = Ba.dot(Ca);
                                Ca.mult(Ea, Aa);
                                Aa.vadd(xa, Aa);
                                Ca = aa.get();
                                Aa.vsub(ha, Ca);
                                if (0 < Ea && Ea * Ea < Ga.norm2() && Ca.norm2() < sa * sa) {
                                    L = this.createContactEquation(la, qa, L, V);
                                    Aa.vsub(ka, L.rj);
                                    Aa.vsub(ha, L.ni);
                                    L.ni.normalize();
                                    L.ni.mult(sa, L.ri);
                                    L.rj.vadd(ka, L.rj);
                                    L.rj.vsub(qa.position, L.rj);
                                    L.ri.vadd(ha, L.ri);
                                    L.ri.vsub(la.position, L.ri);
                                    this.result.push(L);
                                    this.createFrictionEquationsFromContact(L, this.frictionResult);
                                    ta = 0;
                                    for (wa = ya.length; ta !== wa; ta++) aa.release(ya[ta]);
                                    aa.release(xa);
                                    aa.release(za);
                                    aa.release(Aa);
                                    aa.release(Ca);
                                    aa.release(Ba);
                                    return
                                }
                                aa.release(xa);
                                aa.release(za);
                                aa.release(Aa);
                                aa.release(Ca);
                                aa.release(Ba)
                            }
                        ta = 0;
                        for (wa = ya.length; ta !== wa; ta++) aa.release(ya[ta])
                    }
                }
            };
            new b;
            new b;
            a.prototype[m.types.PLANE | m.types.BOX] = a.prototype.planeBox = function(L, V, ha, ka, aa, ea, la, qa) {
                V.convexPolyhedronRepresentation.material = V.material;
                V.convexPolyhedronRepresentation.collisionResponse = V.collisionResponse;
                this.planeConvex(L, V.convexPolyhedronRepresentation, ha, ka, aa, ea, la, qa)
            };
            var Ha = new b,
                Ia = new b,
                Xa = new b,
                hb = new b;
            a.prototype[m.types.PLANE | m.types.CONVEXPOLYHEDRON] = a.prototype.planeConvex = function(L, V, ha, ka, aa, ea, la, qa) {
                Ia.set(0, 0, 1);
                aa.vmult(Ia, Ia);
                for (var na = aa = 0; na !== V.vertices.length; na++)
                    if (Ha.copy(V.vertices[na]), ea.vmult(Ha, Ha), ka.vadd(Ha, Ha), Ha.vsub(ha, Xa), 0 >= Ia.dot(Xa)) {
                        var ia = this.createContactEquation(la, qa, L, V),
                            W = hb;
                        Ia.mult(Ia.dot(Xa), W);
                        Ha.vsub(W, W);
                        W.vsub(ha, ia.ri);
                        ia.ni.copy(Ia);
                        Ha.vsub(ka, ia.rj);
                        ia.ri.vadd(ha, ia.ri);
                        ia.ri.vsub(la.position, ia.ri);
                        ia.rj.vadd(ka, ia.rj);
                        ia.rj.vsub(qa.position,
                            ia.rj);
                        this.result.push(ia);
                        aa++;
                        this.enableFrictionReduction || this.createFrictionEquationsFromContact(ia, this.frictionResult)
                    } this.enableFrictionReduction && aa && this.createFrictionFromAverage(aa)
            };
            var Ya = new b,
                Va = new b;
            a.prototype[m.types.CONVEXPOLYHEDRON] = a.prototype.convexConvex = function(L, V, ha, ka, aa, ea, la, qa, na, ia, W, sa) {
                if (!(ha.distanceTo(ka) > L.boundingSphereRadius + V.boundingSphereRadius) && L.findSeparatingAxis(V, ha, aa, ka, ea, Ya, W, sa)) {
                    W = [];
                    L.clipAgainstHull(ha, aa, V, ka, ea, Ya, -100, 100, W);
                    for (ea = aa =
                        0; ea !== W.length; ea++) {
                        sa = this.createContactEquation(la, qa, L, V, na, ia);
                        var pa = sa.ri,
                            va = sa.rj;
                        Ya.negate(sa.ni);
                        W[ea].normal.negate(Va);
                        Va.mult(W[ea].depth, Va);
                        W[ea].point.vadd(Va, pa);
                        va.copy(W[ea].point);
                        pa.vsub(ha, pa);
                        va.vsub(ka, va);
                        pa.vadd(ha, pa);
                        pa.vsub(la.position, pa);
                        va.vadd(ka, va);
                        va.vsub(qa.position, va);
                        this.result.push(sa);
                        aa++;
                        this.enableFrictionReduction || this.createFrictionEquationsFromContact(sa, this.frictionResult)
                    }
                    this.enableFrictionReduction && aa && this.createFrictionFromAverage(aa)
                }
            };
            var Ja =
                new b,
                ab = new b,
                Wa = new b;
            a.prototype[m.types.PLANE | m.types.PARTICLE] = a.prototype.planeParticle = function(L, V, ha, ka, aa, ea, la, qa) {
                Ja.set(0, 0, 1);
                la.quaternion.vmult(Ja, Ja);
                ka.vsub(la.position, ab);
                0 >= Ja.dot(ab) && (L = this.createContactEquation(qa, la, V, L), L.ni.copy(Ja), L.ni.negate(L.ni), L.ri.set(0, 0, 0), Ja.mult(Ja.dot(ka), Wa), ka.vsub(Wa, Wa), L.rj.copy(Wa), this.result.push(L), this.createFrictionEquationsFromContact(L, this.frictionResult))
            };
            var Ma = new b;
            a.prototype[m.types.PARTICLE | m.types.SPHERE] = a.prototype.sphereParticle =
                function(L, V, ha, ka, aa, ea, la, qa) {
                    Ma.set(0, 0, 1);
                    ka.vsub(ha, Ma);
                    Ma.norm2() <= L.radius * L.radius && (V = this.createContactEquation(qa, la, V, L), Ma.normalize(), V.rj.copy(Ma), V.rj.mult(L.radius, V.rj), V.ni.copy(Ma), V.ni.negate(V.ni), V.ri.set(0, 0, 0), this.result.push(V), this.createFrictionEquationsFromContact(V, this.frictionResult))
                };
            var bb = new g,
                Na = new b;
            new b;
            var Za = new b,
                cb = new b,
                Oa = new b;
            a.prototype[m.types.PARTICLE | m.types.CONVEXPOLYHEDRON] = a.prototype.convexParticle = function(L, V, ha, ka, aa, ea, la, qa) {
                var na = -1;
                ea = null;
                var ia = 0;
                Na.copy(ka);
                Na.vsub(ha, Na);
                aa.conjugate(bb);
                bb.vmult(Na, Na);
                if (L.pointIsInside(Na)) {
                    L.worldVerticesNeedsUpdate && L.computeWorldVertices(ha, aa);
                    L.worldFaceNormalsNeedsUpdate && L.computeWorldFaceNormals(aa);
                    aa = 0;
                    for (var W = L.faces.length; aa !== W; aa++) {
                        var sa = L.worldFaceNormals[aa];
                        ka.vsub(L.worldVertices[L.faces[aa][0]], cb);
                        var pa = -sa.dot(cb);
                        if (null === ea || Math.abs(pa) < Math.abs(ea)) ea = pa, na = aa, Za.copy(sa), ia++
                    } - 1 !== na ? (L = this.createContactEquation(qa, la, V, L), Za.mult(ea, Oa), Oa.vadd(ka, Oa),
                        Oa.vsub(ha, Oa), L.rj.copy(Oa), Za.negate(L.ni), L.ri.set(0, 0, 0), V = L.ri, ea = L.rj, V.vadd(ka, V), V.vsub(qa.position, V), ea.vadd(ha, ea), ea.vsub(la.position, ea), this.result.push(L), this.createFrictionEquationsFromContact(L, this.frictionResult)) : console.warn("Point found inside convex, but did not find penetrating face!")
                }
            };
            a.prototype[m.types.BOX | m.types.HEIGHTFIELD] = a.prototype.boxHeightfield = function(L, V, ha, ka, aa, ea, la, qa) {
                L.convexPolyhedronRepresentation.material = L.material;
                L.convexPolyhedronRepresentation.collisionResponse =
                    L.collisionResponse;
                this.convexHeightfield(L.convexPolyhedronRepresentation, V, ha, ka, aa, ea, la, qa)
            };
            var Ka = new b,
                Pa = new b,
                db = [0];
            a.prototype[m.types.CONVEXPOLYHEDRON | m.types.HEIGHTFIELD] = a.prototype.convexHeightfield = function(L, V, ha, ka, aa, ea, la, qa) {
                var na = V.data,
                    ia = V.elementSize,
                    W = L.boundingSphereRadius;
                k.pointToLocalFrame(ka, ea, ha, Ka);
                var sa = Math.floor((Ka.x - W) / ia) - 1,
                    pa = Math.ceil((Ka.x + W) / ia) + 1,
                    va = Math.floor((Ka.y - W) / ia) - 1;
                ia = Math.ceil((Ka.y + W) / ia) + 1;
                if (!(0 > pa || 0 > ia || sa > na.length || va > na[0].length)) {
                    0 >
                        sa && (sa = 0);
                    0 > pa && (pa = 0);
                    0 > va && (va = 0);
                    0 > ia && (ia = 0);
                    sa >= na.length && (sa = na.length - 1);
                    pa >= na.length && (pa = na.length - 1);
                    ia >= na[0].length && (ia = na[0].length - 1);
                    va >= na[0].length && (va = na[0].length - 1);
                    na = [];
                    V.getRectMinMax(sa, va, pa, ia, na);
                    var wa = na[0];
                    if (!(Ka.z - W > na[1] || Ka.z + W < wa))
                        for (W = sa; W < pa; W++)
                            for (sa = va; sa < ia; sa++) V.getConvexTrianglePillar(W, sa, !1), k.pointToWorldFrame(ka, ea, V.pillarOffset, Pa), ha.distanceTo(Pa) < V.pillarConvex.boundingSphereRadius + L.boundingSphereRadius && this.convexConvex(L, V.pillarConvex,
                                ha, Pa, aa, ea, la, qa, null, null, db, null), V.getConvexTrianglePillar(W, sa, !0), k.pointToWorldFrame(ka, ea, V.pillarOffset, Pa), ha.distanceTo(Pa) < V.pillarConvex.boundingSphereRadius + L.boundingSphereRadius && this.convexConvex(L, V.pillarConvex, ha, Pa, aa, ea, la, qa, null, null, db, null)
                }
            };
            var La = new b,
                Qa = new b;
            a.prototype[m.types.SPHERE | m.types.HEIGHTFIELD] = a.prototype.sphereHeightfield = function(L, V, ha, ka, aa, ea, la, qa) {
                var na = V.data,
                    ia = L.radius,
                    W = V.elementSize;
                k.pointToLocalFrame(ka, ea, ha, La);
                var sa = Math.floor((La.x - ia) /
                        W) - 1,
                    pa = Math.ceil((La.x + ia) / W) + 1,
                    va = Math.floor((La.y - ia) / W) - 1;
                W = Math.ceil((La.y + ia) / W) + 1;
                if (!(0 > pa || 0 > W || sa > na.length || W > na[0].length)) {
                    0 > sa && (sa = 0);
                    0 > pa && (pa = 0);
                    0 > va && (va = 0);
                    0 > W && (W = 0);
                    sa >= na.length && (sa = na.length - 1);
                    pa >= na.length && (pa = na.length - 1);
                    W >= na[0].length && (W = na[0].length - 1);
                    va >= na[0].length && (va = na[0].length - 1);
                    na = [];
                    V.getRectMinMax(sa, va, pa, W, na);
                    var wa = na[0];
                    if (!(La.z - ia > na[1] || La.z + ia < wa))
                        for (ia = this.result; sa < pa; sa++)
                            for (na = va; na < W; na++)
                                if (wa = ia.length, V.getConvexTrianglePillar(sa,
                                        na, !1), k.pointToWorldFrame(ka, ea, V.pillarOffset, Qa), ha.distanceTo(Qa) < V.pillarConvex.boundingSphereRadius + L.boundingSphereRadius && this.sphereConvex(L, V.pillarConvex, ha, Qa, aa, ea, la, qa), V.getConvexTrianglePillar(sa, na, !0), k.pointToWorldFrame(ka, ea, V.pillarOffset, Qa), ha.distanceTo(Qa) < V.pillarConvex.boundingSphereRadius + L.boundingSphereRadius && this.sphereConvex(L, V.pillarConvex, ha, Qa, aa, ea, la, qa), 2 < ia.length - wa) return
                }
            }
        }, {
            "../collision/AABB": 3,
            "../collision/Ray": 9,
            "../equations/ContactEquation": 19,
            "../equations/FrictionEquation": 21,
            "../math/Quaternion": 28,
            "../math/Transform": 29,
            "../math/Vec3": 30,
            "../shapes/ConvexPolyhedron": 38,
            "../shapes/Shape": 43,
            "../solver/Solver": 47,
            "../utils/Vec3Pool": 54
        }],
        56: [function(d, e, m) {
            function a() {
                g.apply(this);
                this.dt = -1;
                this.allowSleep = !1;
                this.contacts = [];
                this.frictionEquations = [];
                this.quatNormalizeSkip = 0;
                this.quatNormalizeFast = !1;
                this.stepnumber = this.time = 0;
                this.default_dt = 1 / 60;
                this.nextId = 0;
                this.gravity = new c;
                this.broadphase = new v;
                this.bodies = [];
                this.solver = new b;
                this.constraints = [];
                this.narrowphase =
                    new k(this);
                this.collisionMatrix = new h;
                this.collisionMatrixPrevious = new h;
                this.materials = [];
                this.contactmaterials = [];
                this.contactMaterialTable = new q;
                this.defaultMaterial = new l("default");
                this.defaultContactMaterial = new p(this.defaultMaterial, this.defaultMaterial, {
                    friction: .3,
                    restitution: 0
                });
                this.doProfiling = !1;
                this.profile = {
                    solve: 0,
                    makeContactConstraints: 0,
                    broadphase: 0,
                    integrate: 0,
                    narrowphase: 0
                };
                this.subsystems = [];
                this.addBodyEvent = {
                    type: "addBody",
                    body: null
                };
                this.removeBodyEvent = {
                    type: "removeBody",
                    body: null
                }
            }
            e.exports = a;
            d("../shapes/Shape");
            var c = d("../math/Vec3");
            e = d("../math/Quaternion");
            var b = d("../solver/GSSolver");
            d("../utils/Vec3Pool");
            d("../equations/ContactEquation");
            d("../equations/FrictionEquation");
            var k = d("./Narrowphase"),
                g = d("../utils/EventTarget"),
                h = d("../collision/ArrayCollisionMatrix"),
                l = d("../material/Material"),
                p = d("../material/ContactMaterial"),
                n = d("../objects/Body"),
                q = d("../utils/TupleDictionary"),
                t = d("../collision/RaycastResult");
            m = d("../collision/AABB");
            var r = d("../collision/Ray"),
                v = d("../collision/NaiveBroadphase");
            a.prototype = new g;
            new m;
            var x = new r;
            a.prototype.getContactMaterial = function(O, Y) {
                return this.contactMaterialTable.get(O.id, Y.id)
            };
            a.prototype.numObjects = function() {
                return this.bodies.length
            };
            a.prototype.collisionMatrixTick = function() {
                var O = this.collisionMatrixPrevious;
                this.collisionMatrixPrevious = this.collisionMatrix;
                this.collisionMatrix = O;
                this.collisionMatrix.reset()
            };
            a.prototype.add = a.prototype.addBody = function(O) {
                -1 === this.bodies.indexOf(O) && (O.index = this.bodies.length,
                    this.bodies.push(O), O.world = this, O.initPosition.copy(O.position), O.initVelocity.copy(O.velocity), O.timeLastSleepy = this.time, O instanceof n && (O.initAngularVelocity.copy(O.angularVelocity), O.initQuaternion.copy(O.quaternion)), this.collisionMatrix.setNumObjects(this.bodies.length), this.addBodyEvent.body = O, this.dispatchEvent(this.addBodyEvent))
            };
            a.prototype.addConstraint = function(O) {
                this.constraints.push(O)
            };
            a.prototype.removeConstraint = function(O) {
                O = this.constraints.indexOf(O); - 1 !== O && this.constraints.splice(O,
                    1)
            };
            a.prototype.rayTest = function(O, Y, K) {
                K instanceof t ? this.raycastClosest(O, Y, {
                    skipBackfaces: !0
                }, K) : this.raycastAll(O, Y, {
                    skipBackfaces: !0
                }, K)
            };
            a.prototype.raycastAll = function(O, Y, K, z) {
                K.mode = r.ALL;
                K.from = O;
                K.to = Y;
                K.callback = z;
                return x.intersectWorld(this, K)
            };
            a.prototype.raycastAny = function(O, Y, K, z) {
                K.mode = r.ANY;
                K.from = O;
                K.to = Y;
                K.result = z;
                return x.intersectWorld(this, K)
            };
            a.prototype.raycastClosest = function(O, Y, K, z) {
                K.mode = r.CLOSEST;
                K.from = O;
                K.to = Y;
                K.result = z;
                return x.intersectWorld(this, K)
            };
            a.prototype.remove =
                function(O) {
                    O.world = null;
                    var Y = this.bodies.length - 1,
                        K = this.bodies,
                        z = K.indexOf(O);
                    if (-1 !== z) {
                        K.splice(z, 1);
                        for (z = 0; z !== K.length; z++) K[z].index = z;
                        this.collisionMatrix.setNumObjects(Y);
                        this.removeBodyEvent.body = O;
                        this.dispatchEvent(this.removeBodyEvent)
                    }
                };
            a.prototype.removeBody = a.prototype.remove;
            a.prototype.addMaterial = function(O) {
                this.materials.push(O)
            };
            a.prototype.addContactMaterial = function(O) {
                this.contactmaterials.push(O);
                this.contactMaterialTable.set(O.materials[0].id, O.materials[1].id, O)
            };
            "undefined" ===
            typeof performance && (performance = {});
            if (!performance.now) {
                var y = Date.now();
                performance.timing && performance.timing.navigationStart && (y = performance.timing.navigationStart);
                performance.now = function() {
                    return Date.now() - y
                }
            }
            var I = new c;
            a.prototype.step = function(O, Y, K) {
                K = K || 10;
                Y = Y || 0;
                if (0 === Y) this.internalStep(O), this.time += O;
                else {
                    var z = Math.floor((this.time + Y) / O) - Math.floor(this.time / O);
                    z = Math.min(z, K);
                    K = performance.now();
                    for (var C = 0; C !== z && !(this.internalStep(O), performance.now() - K > 1E3 * O); C++);
                    this.time +=
                        Y;
                    O = this.time % O / O;
                    Y = this.bodies;
                    for (z = 0; z !== Y.length; z++) K = Y[z], K.type !== n.STATIC && K.sleepState !== n.SLEEPING ? (K.position.vsub(K.previousPosition, I), I.scale(O, I), K.position.vadd(I, K.interpolatedPosition)) : (K.interpolatedPosition.copy(K.position), K.interpolatedQuaternion.copy(K.quaternion))
                }
            };
            var E = {
                    type: "postStep"
                },
                N = {
                    type: "preStep"
                },
                R = {
                    type: "collide",
                    body: null,
                    contact: null
                },
                T = [],
                M = [],
                G = [],
                H = [];
            new c;
            new c;
            new c;
            new c;
            new c;
            new c;
            new c;
            new c;
            new c;
            new e;
            var S = new e,
                J = new e,
                ca = new c;
            a.prototype.internalStep =
                function(O) {
                    this.dt = O;
                    var Y = this.contacts,
                        K = this.numObjects(),
                        z = this.bodies,
                        C = this.solver,
                        u = this.gravity,
                        B = this.doProfiling,
                        w = this.profile,
                        A = n.DYNAMIC,
                        F, D = this.constraints;
                    u.norm();
                    var Q = u.x,
                        X = u.y,
                        P = u.z;
                    B && (F = performance.now());
                    for (u = 0; u !== K; u++) {
                        var Z = z[u];
                        if (Z.type & A) {
                            var ma = Z.force;
                            Z = Z.mass;
                            ma.x += Z * Q;
                            ma.y += Z * X;
                            ma.z += Z * P
                        }
                    }
                    u = 0;
                    for (Z = this.subsystems.length; u !== Z; u++) this.subsystems[u].update();
                    B && (F = performance.now());
                    G.length = 0;
                    H.length = 0;
                    this.broadphase.collisionPairs(this, G, H);
                    B && (w.broadphase =
                        performance.now() - F);
                    Z = D.length;
                    for (u = 0; u !== Z; u++)
                        if (Q = D[u], !Q.collideConnected)
                            for (X = G.length - 1; 0 <= X; --X)
                                if (Q.bodyA === G[X] && Q.bodyB === H[X] || Q.bodyB === G[X] && Q.bodyA === H[X]) G.splice(X, 1), H.splice(X, 1);
                    this.collisionMatrixTick();
                    B && (F = performance.now());
                    Z = Y.length;
                    for (u = 0; u !== Z; u++) T.push(Y[u]);
                    Y.length = 0;
                    Z = this.frictionEquations.length;
                    for (u = 0; u !== Z; u++) M.push(this.frictionEquations[u]);
                    this.frictionEquations.length = 0;
                    this.narrowphase.getContacts(G, H, this, Y, T, this.frictionEquations, M);
                    B && (w.narrowphase =
                        performance.now() - F);
                    B && (F = performance.now());
                    for (u = 0; u < this.frictionEquations.length; u++) C.addEquation(this.frictionEquations[u]);
                    u = Y.length;
                    for (X = 0; X !== u; X++) Q = Y[X], Z = Q.bi, P = Q.bj, Z.material && P.material && this.getContactMaterial(Z.material, P.material), Z.material && P.material && 0 <= Z.material.restitution && 0 <= P.material.restitution && (Q.restitution = Z.material.restitution * P.material.restitution), C.addEquation(Q), Z.allowSleep && Z.type === n.DYNAMIC && Z.sleepState === n.SLEEPING && P.sleepState === n.AWAKE && P.type !==
                        n.STATIC && P.velocity.norm2() + P.angularVelocity.norm2() >= 2 * Math.pow(P.sleepSpeedLimit, 2) && (Z._wakeUpAfterNarrowphase = !0), P.allowSleep && P.type === n.DYNAMIC && P.sleepState === n.SLEEPING && Z.sleepState === n.AWAKE && Z.type !== n.STATIC && Z.velocity.norm2() + Z.angularVelocity.norm2() >= 2 * Math.pow(Z.sleepSpeedLimit, 2) && (P._wakeUpAfterNarrowphase = !0), this.collisionMatrix.set(Z, P, !0), this.collisionMatrixPrevious.get(Z, P) || (R.body = P, R.contact = Q, Z.dispatchEvent(R), R.body = Z, P.dispatchEvent(R));
                    B && (w.makeContactConstraints =
                        performance.now() - F, F = performance.now());
                    for (u = 0; u !== K; u++) Z = z[u], Z._wakeUpAfterNarrowphase && (Z.wakeUp(), Z._wakeUpAfterNarrowphase = !1);
                    Z = D.length;
                    for (u = 0; u !== Z; u++)
                        for (Q = D[u], Q.update(), X = 0, Y = Q.equations.length; X !== Y; X++) C.addEquation(Q.equations[X]);
                    C.solve(O, this);
                    B && (w.solve = performance.now() - F);
                    C.removeAllEquations();
                    C = Math.pow;
                    for (u = 0; u !== K; u++)
                        if (Z = z[u], Z.type & A && (D = C(1 - Z.linearDamping, O), Y = Z.velocity, Y.mult(D, Y), D = Z.angularVelocity)) Y = C(1 - Z.angularDamping, O), D.mult(Y, D);
                    this.dispatchEvent(N);
                    for (u = 0; u !== K; u++) Z = z[u], Z.preStep && Z.preStep.call(Z);
                    B && (F = performance.now());
                    A = n.DYNAMIC | n.KINEMATIC;
                    C = 0 === this.stepnumber % (this.quatNormalizeSkip + 1);
                    D = this.quatNormalizeFast;
                    Y = .5 * O;
                    for (u = 0; u !== K; u++)
                        if (Z = z[u], Q = Z.force, X = Z.torque, Z.type & A && Z.sleepState !== n.SLEEPING) {
                            P = Z.velocity;
                            ma = Z.angularVelocity;
                            var ja = Z.position,
                                fa = Z.quaternion,
                                U = Z.invMass,
                                ba = Z.invInertiaWorld;
                            P.x += Q.x * U * O;
                            P.y += Q.y * U * O;
                            P.z += Q.z * U * O;
                            Z.angularVelocity && (ba.vmult(X, ca), ca.mult(O, ca), ca.vadd(ma, ma));
                            ja.x += P.x * O;
                            ja.y += P.y * O;
                            ja.z +=
                                P.z * O;
                            Z.angularVelocity && (S.set(ma.x, ma.y, ma.z, 0), S.mult(fa, J), fa.x += Y * J.x, fa.y += Y * J.y, fa.z += Y * J.z, fa.w += Y * J.w, C && (D ? fa.normalizeFast() : fa.normalize()));
                            Z.aabb && (Z.aabbNeedsUpdate = !0);
                            Z.updateInertiaWorld && Z.updateInertiaWorld()
                        } this.clearForces();
                    this.broadphase.dirty = !0;
                    B && (w.integrate = performance.now() - F);
                    this.time += O;
                    this.stepnumber += 1;
                    this.dispatchEvent(E);
                    for (u = 0; u !== K; u++) Z = z[u], (O = Z.postStep) && O.call(Z);
                    if (this.allowSleep)
                        for (u = 0; u !== K; u++) z[u].sleepTick(this.time)
                };
            a.prototype.clearForces =
                function() {
                    for (var O = this.bodies, Y = O.length, K = 0; K !== Y; K++) {
                        var z = O[K];
                        z.force.set(0, 0, 0);
                        z.torque.set(0, 0, 0)
                    }
                }
        }, {
            "../collision/AABB": 3,
            "../collision/ArrayCollisionMatrix": 4,
            "../collision/NaiveBroadphase": 7,
            "../collision/Ray": 9,
            "../collision/RaycastResult": 10,
            "../equations/ContactEquation": 19,
            "../equations/FrictionEquation": 21,
            "../material/ContactMaterial": 24,
            "../material/Material": 25,
            "../math/Quaternion": 28,
            "../math/Vec3": 30,
            "../objects/Body": 31,
            "../shapes/Shape": 43,
            "../solver/GSSolver": 46,
            "../utils/EventTarget": 49,
            "../utils/TupleDictionary": 52,
            "../utils/Vec3Pool": 54,
            "./Narrowphase": 55
        }]
    }, {}, [2])(2)
});
CANNON = CANNON || {};
var camera, scene, renderer, controls = null,
    s_oRender;
CANNON.Demo = function(f) {
    function d() {
        if (E) {
            for (var U in E.__controllers) E.__controllers[U].updateDisplay();
            for (var ba in E.__folders)
                for (U in E.__folders[ba].__controllers) E.__folders[ba].__controllers[U].updateDisplay()
        }
    }

    function e(U) {
        function ba(oa, ua) {
            oa.material && (oa.material = ua);
            for (var ra = 0; ra < oa.children.length; ra++) ba(oa.children[ra], ua)
        }
        if (-1 === A.indexOf(U)) throw Error("Render mode " + U + " not found!");
        switch (U) {
            case "solid":
                q.currentMaterial = G;
                F.intensity = 1;
                D.color.setHex(2236962);
                break;
            case "wireframe":
                q.currentMaterial =
                    H, F.intensity = 0, D.color.setHex(16777215)
        }
        for (var da = 0; da < y.length; da++) ba(y[da], q.currentMaterial);
        r.rendermode = U
    }

    function m() {
        for (var U = x.length, ba = 0; ba < U; ba++) {
            var da = x[ba];
            da.position.copy(da.initPosition);
            da.velocity.copy(da.initVelocity);
            da.initAngularVelocity && (da.angularVelocity.copy(da.initAngularVelocity), da.quaternion.copy(da.initQuaternion))
        }
    }

    function a(U) {
        0 === U.x && (U.x = 1E-6);
        0 === U.y && (U.y = 1E-6);
        0 === U.z && (U.z = 1E-6)
    }

    function c() {
        for (var U = x.length, ba = 0; ba < U; ba++) {
            var da = x[ba],
                oa = y[ba];
            oa.position.copy(da.position);
            da.quaternion && oa.quaternion.copy(da.quaternion)
        }
        J.restart();
        if (r.contacts)
            for (ba = 0; ba < w.contacts.length; ba++)
                for (U = 0; 2 > U; U++) {
                    oa = J.request();
                    var ua = w.contacts[ba];
                    da = 0 === U ? ua.bi : ua.bj;
                    var ra = 0 === U ? ua.ri : ua.rj;
                    oa.position.set(da.position.x + ra.x, da.position.y + ra.y, da.position.z + ra.z)
                }
        J.hideCached();
        ca.restart();
        if (r.cm2contact)
            for (ba = 0; ba < w.contacts.length; ba++)
                for (U = 0; 2 > U; U++) oa = ca.request(), ua = w.contacts[ba], da = 0 === U ? ua.bi : ua.bj, ra = 0 === U ? ua.ri : ua.rj, oa.scale.set(ra.x, ra.y, ra.z), a(oa.scale), oa.position.copy(da.position);
        ca.hideCached();
        z.restart();
        C.restart();
        if (r.constraints) {
            for (ba = 0; ba < w.constraints.length; ba++) ua = w.constraints[ba], ua instanceof CANNON.DistanceConstraint && (da = ua.equations.normal, U = da.bi, da = da.bj, oa = z.request(), da = da.position ? da.position : da, oa.scale.set(da.x - U.position.x, da.y - U.position.y, da.z - U.position.z), a(oa.scale), oa.position.copy(U.position));
            for (ba = 0; ba < w.constraints.length; ba++)
                if (ua = w.constraints[ba], ua instanceof CANNON.PointToPointConstraint) {
                    ra = ua.equations.normal;
                    U = ra.bi;
                    da = ra.bj;
                    oa = C.request();
                    ua = C.request();
                    var Da = C.request();
                    oa.scale.set(ra.ri.x, ra.ri.y, ra.ri.z);
                    ua.scale.set(ra.rj.x, ra.rj.y, ra.rj.z);
                    Da.scale.set(-ra.penetrationVec.x, -ra.penetrationVec.y, -ra.penetrationVec.z);
                    a(oa.scale);
                    a(ua.scale);
                    a(Da.scale);
                    oa.position.copy(U.position);
                    ua.position.copy(da.position);
                    ra.bj.position.vadd(ra.rj, Da.position)
                }
        }
        C.hideCached();
        z.hideCached();
        u.restart();
        if (r.normals)
            for (ba = 0; ba < w.contacts.length; ba++) ua = w.contacts[ba], U = ua.bi, oa = u.request(), ra = ua.ni, da = U, oa.scale.set(ra.x, ra.y,
                ra.z), a(oa.scale), oa.position.copy(da.position), ua.ri.vadd(oa.position, oa.position);
        u.hideCached();
        B.restart();
        if (r.axes)
            for (U = 0; U < x.length; U++) da = x[U], oa = B.request(), oa.position.copy(da.position), da.quaternion && oa.quaternion.copy(da.quaternion);
        B.hideCached();
        K.restart();
        if (r.aabbs)
            for (ba = 0; ba < x.length; ba++) da = x[ba], da.computeAABB && (da.aabbNeedsUpdate && da.computeAABB(), isFinite(da.aabb.lowerBound.x) && isFinite(da.aabb.lowerBound.y) && isFinite(da.aabb.lowerBound.z) && isFinite(da.aabb.upperBound.x) &&
                isFinite(da.aabb.upperBound.y) && isFinite(da.aabb.upperBound.z) && 0 != da.aabb.lowerBound.x - da.aabb.upperBound.x && 0 != da.aabb.lowerBound.y - da.aabb.upperBound.y && 0 != da.aabb.lowerBound.z - da.aabb.upperBound.z && (oa = K.request(), oa.scale.set(da.aabb.lowerBound.x - da.aabb.upperBound.x, da.aabb.lowerBound.y - da.aabb.upperBound.y, da.aabb.lowerBound.z - da.aabb.upperBound.z), oa.position.set(.5 * (da.aabb.lowerBound.x + da.aabb.upperBound.x), .5 * (da.aabb.lowerBound.y + da.aabb.upperBound.y), .5 * (da.aabb.lowerBound.z + da.aabb.upperBound.z))));
        K.hideCached()
    }

    function b() {
        requestAnimationFrame(b);
        r.paused || c();
        h();
        Q.update()
    }

    function k(U) {
        mouseX = U.clientX - ja;
        mouseY = U.clientY - fa
    }

    function g(U) {
        P = s_iCanvasResizeWidth + 2 * s_iCanvasOffsetWidth;
        Z = s_iCanvasResizeHeight + 2 * s_iCanvasOffsetHeight;
        CAMERA_TEST_TRACKBALL && (controls.screen.width = P, controls.screen.height = Z)
    }

    function h() {
        (CAMERA_TEST_TRACKBALL || CAMERA_TEST_TRANSFORM && null !== controls) && controls.update();
        renderer.clear();
        renderer.render(q.scene, camera)
    }

    function l(U) {
        q.dispatchEvent({
            type: "destroy"
        });
        r.paused = !1;
        d();
        p(U)
    }

    function p(U) {
        for (var ba = y.length, da = 0; da < ba; da++) {
            w.remove(x.pop());
            var oa = y.pop();
            q.scene.remove(oa)
        }
        for (; w.constraints.length;) w.removeConstraint(w.constraints[0]);
        I[U]();
        r.iterations = w.solver.iterations;
        r.gx = w.gravity.x + 0;
        r.gy = w.gravity.y + 0;
        r.gz = w.gravity.z + 0;
        r.quatNormalizeSkip = w.quatNormalizeSkip;
        r.quatNormalizeFast = w.quatNormalizeFast;
        d();
        J.restart();
        J.hideCached();
        ca.restart();
        ca.hideCached();
        z.restart();
        z.hideCached();
        u.restart();
        u.hideCached()
    }

    function n(U) {
        var ba = [],
            da = [];
        this.request = function() {
            geo = ba.length ? ba.pop() : U();
            scene.add(geo);
            da.push(geo);
            return geo
        };
        this.restart = function() {
            for (; da.length;) ba.push(da.pop())
        };
        this.hideCached = function() {
            for (var oa = 0; oa < ba.length; oa++) scene.remove(ba[oa])
        }
    }
    var q = this;
    this.addScene = function(U, ba) {
        if ("string" !== typeof U) throw Error("1st argument of Demo.addScene(title,initfunc) must be a string!");
        if ("function" !== typeof ba) throw Error("2nd argument of Demo.addScene(title,initfunc) must be a function!");
        I.push(ba);
        var da =
            I.length - 1;
        T[U] = function() {
            l(da)
        };
        t.add(T, U)
    };
    this.restartCurrentScene = m;
    this.changeScene = l;
    this.start = function() {
        p(0)
    };
    var t, r = this.settings = {
        stepFrequency: 60,
        quatNormalizeSkip: 2,
        quatNormalizeFast: !0,
        gx: 0,
        gy: 0,
        gz: 0,
        iterations: 3,
        tolerance: 1E-4,
        k: 1E6,
        d: 3,
        scene: 0,
        paused: !1,
        rendermode: "solid",
        constraints: !1,
        contacts: !1,
        cm2contact: !1,
        normals: !1,
        axes: !1,
        particleSize: .1,
        shadows: !1,
        aabbs: !1,
        profiling: !1,
        maxSubSteps: 3
    };
    f = f || {};
    for (var v in f) v in r && (r[v] = f[v]);
    if (0 !== r.stepFrequency % 60) throw Error("stepFrequency must be a multiple of 60.");
    var x = this.bodies = [],
        y = this.visuals = [],
        I = [],
        E = null,
        N = null,
        R = null,
        T = {},
        M = new THREE.SphereGeometry(.1, 6, 6);
    this.particleGeo = new THREE.SphereGeometry(1, 16, 8);
    var G = new THREE.MeshPhongMaterial({
            color: 11184810,
            specular: 1118481,
            shininess: 50
        }),
        H = new THREE.MeshLambertMaterial({
            color: 16777215,
            wireframe: !0
        });
    this.currentMaterial = G;
    var S = new THREE.MeshPhongMaterial({
        color: 16711680
    });
    this.particleMaterial = new THREE.MeshLambertMaterial({
        color: 16711680
    });
    var J = new n(function() {
            return new THREE.Mesh(M, S)
        }),
        ca = new n(function() {
            var U =
                new THREE.Geometry;
            U.vertices.push(new THREE.Vector3(0, 0, 0));
            U.vertices.push(new THREE.Vector3(1, 1, 1));
            return new THREE.Line(U, new THREE.LineBasicMaterial({
                color: 16711680
            }))
        }),
        O = new THREE.BoxGeometry(1, 1, 1),
        Y = new THREE.MeshBasicMaterial({
            color: 11184810,
            wireframe: !0
        }),
        K = new n(function() {
            return new THREE.Mesh(O, Y)
        }),
        z = new n(function() {
            var U = new THREE.Geometry;
            U.vertices.push(new THREE.Vector3(0, 0, 0));
            U.vertices.push(new THREE.Vector3(1, 1, 1));
            return new THREE.Line(U, new THREE.LineBasicMaterial({
                color: 16711680
            }))
        }),
        C = new n(function() {
            var U = new THREE.Geometry;
            U.vertices.push(new THREE.Vector3(0, 0, 0));
            U.vertices.push(new THREE.Vector3(1, 1, 1));
            return new THREE.Line(U, new THREE.LineBasicMaterial({
                color: 16711680
            }))
        }),
        u = new n(function() {
            var U = new THREE.Geometry;
            U.vertices.push(new THREE.Vector3(0, 0, 0));
            U.vertices.push(new THREE.Vector3(1, 1, 1));
            return new THREE.Line(U, new THREE.LineBasicMaterial({
                color: 65280
            }))
        }),
        B = new n(function() {
            var U = new THREE.Object3D,
                ba = new THREE.Vector3(0, 0, 0),
                da = new THREE.Geometry,
                oa = new THREE.Geometry,
                ua = new THREE.Geometry;
            da.vertices.push(ba);
            oa.vertices.push(ba);
            ua.vertices.push(ba);
            da.vertices.push(new THREE.Vector3(1, 0, 0));
            oa.vertices.push(new THREE.Vector3(0, 1, 0));
            ua.vertices.push(new THREE.Vector3(0, 0, 1));
            ba = new THREE.Line(da, new THREE.LineBasicMaterial({
                color: 16711680
            }));
            oa = new THREE.Line(oa, new THREE.LineBasicMaterial({
                color: 65280
            }));
            ua = new THREE.Line(ua, new THREE.LineBasicMaterial({
                color: 255
            }));
            U.add(ba);
            U.add(oa);
            U.add(ua);
            return U
        }),
        w = this.world = new CANNON.World;
    w.broadphase = new CANNON.NaiveBroadphase;
    var A = ["solid", "wireframe"],
        F, D, Q, X;
    Detector.webgl || Detector.addGetWebGLMessage();
    var P = s_iCanvasResizeWidth + s_iCanvasOffsetWidth,
        Z = s_iCanvasResizeHeight + s_iCanvasOffsetHeight,
        ma, ja = P / 2,
        fa = Z / 2;
    (function() {
        ma = document.createElement("div");
        document.body.appendChild(ma);
        CAMERA_TEST_TRACKBALL ? (NEAR = 1, camera = new THREE.PerspectiveCamera(45, P / Z, NEAR, FAR), camera.lookAt(new THREE.Vector3(CAMERA_TEST_LOOK_AT.x, CAMERA_TEST_LOOK_AT.y, CAMERA_TEST_LOOK_AT.z)), camera.position.set(0, 500, 500), camera.up.set(0, 0, 1)) :
            camera = createOrthoGraphicCamera();
        scene = q.scene = new THREE.Scene;
        scene.fog = new THREE.Fog(8306926, .5 * FAR, FAR);
        D = new THREE.AmbientLight(4473924);
        scene.add(D);
        F = new THREE.DirectionalLight(16777181, 1);
        F.position.set(180, 0, 180);
        F.target.position.set(0, 0, 0);
        F.castShadow = !0;
        F.shadow.camera.near = 10;
        F.shadow.camera.far = 100;
        F.shadow.camera.fov = FOV;
        F.shadowMapBias = .0139;
        F.shadowMapDarkness = .1;
        F.shadow.mapSize.width = 1024;
        F.shadow.mapSize.height = 1024;
        new THREE.CameraHelper(F.shadow.camera);
        scene.add(F);
        scene.add(camera);
        renderer = SHOW_3D_RENDER ? new THREE.WebGLRenderer({
            clearColor: 0,
            clearAlpha: .5,
            antialias: !0,
            alpha: !0
        }) : new THREE.CanvasRenderer({
            clearColor: 0,
            clearAlpha: .5,
            antialias: !1,
            alpha: !0
        });
        renderer.setSize(P, Z);
        renderer.domElement.style.position = "relative";
        renderer.domElement.style.top = "0px";
        renderer.domElement.style.opacity = CANVAS_3D_OPACITY;
        ma.appendChild(renderer.domElement);
        X = document.createElement("div");
        X.style.position = "absolute";
        X.style.top = "10px";
        X.style.width = "100%";
        X.style.textAlign = "center";
        X.innerHTML =
            '<a href="http://github.com/schteppe/cannon.js">cannon.js</a> - javascript 3d physics';
        ma.appendChild(X);
        document.addEventListener("mousemove", k);
        window.addEventListener("resize", g);
        renderer.setClearColor(scene.fog.color, 1);
        renderer.autoClear = !1;
        R = document.createElement("canvas");
        R.width = P;
        R.height = Z;
        R.style.opacity = .5;
        R.style.position = "absolute";
        R.style.top = "0px";
        R.style.zIndex = 90;
        ma.appendChild(R);
        N = new SmoothieChart({
            labelOffsetY: 50,
            maxDataSetLength: 100,
            millisPerPixel: 2,
            grid: {
                strokeStyle: "none",
                fillStyle: "none",
                lineWidth: 1,
                millisPerLine: 250,
                verticalSections: 6
            },
            labels: {
                fillStyle: "rgb(180, 180, 180)"
            }
        });
        N.streamTo(R);
        var U = {},
            ba = [
                [255, 0, 0],
                [0, 255, 0],
                [0, 0, 255],
                [255, 255, 0],
                [255, 0, 255],
                [0, 255, 255]
            ],
            da = 0,
            oa;
        for (oa in w.profile) {
            var ua = ba[da % ba.length];
            U[oa] = new TimeSeries({
                label: oa,
                fillStyle: "rgb(" + ua[0] + "," + ua[1] + "," + ua[2] + ")",
                maxDataLength: 500
            });
            da++
        }
        w.addEventListener("postStep", function(ra) {
            for (var Da in w.profile) U[Da].append(1E3 * w.time, w.profile[Da])
        });
        da = 0;
        for (oa in w.profile) ua = ba[da %
            ba.length], N.addTimeSeries(U[oa], {
            strokeStyle: "rgb(" + ua[0] + "," + ua[1] + "," + ua[2] + ")",
            lineWidth: 2
        }), da++;
        w.doProfiling = !1;
        N.stop();
        R.style.display = "none";
        Q = new Stats;
        Q.domElement.style.position = "absolute";
        Q.domElement.style.top = "0px";
        Q.domElement.style.zIndex = 100;
        ma.appendChild(Q.domElement);
        void 0 != window.dat && (E = new dat.GUI, E.domElement.parentNode.style.zIndex = 120, ba = E.addFolder("Rendering"), ba.add(r, "rendermode", {
                Solid: "solid",
                Wireframe: "wireframe"
            }).onChange(function(ra) {
                e(ra)
            }), ba.add(r, "contacts"),
            ba.add(r, "cm2contact"), ba.add(r, "normals"), ba.add(r, "constraints"), ba.add(r, "axes"), ba.add(r, "particleSize").min(0).max(1).onChange(function(ra) {
                for (var Da = 0; Da < y.length; Da++) x[Da] instanceof CANNON.Particle && y[Da].scale.set(ra, ra, ra)
            }), ba.add(r, "shadows").onChange(function(ra) {
                ra ? renderer.shadowMapAutoUpdate = !0 : (renderer.shadowMapAutoUpdate = !1, renderer.clearTarget(F.shadowMap))
            }), ba.add(r, "aabbs"), ba.add(r, "profiling").onChange(function(ra) {
                ra ? (w.doProfiling = !0, N.start(), R.style.display = "block") :
                    (w.doProfiling = !1, N.stop(), R.style.display = "none")
            }), ba = E.addFolder("World"), ba.add(r, "paused").onChange(function(ra) {}), ba.add(r, "stepFrequency", 60, 600).step(60), ba.add(r, "gx", -100, 100).onChange(function(ra) {
                isNaN(ra) || w.gravity.set(ra, r.gy, r.gz)
            }), ba.add(r, "gy", -100, 100).onChange(function(ra) {
                isNaN(ra) || w.gravity.set(r.gx, ra, r.gz)
            }), ba.add(r, "gz", -100, 100).onChange(function(ra) {
                isNaN(ra) || w.gravity.set(r.gx, r.gy, ra)
            }), ba.add(r, "quatNormalizeSkip", 0, 50).step(1).onChange(function(ra) {
                isNaN(ra) || (w.quatNormalizeSkip =
                    ra)
            }), ba.add(r, "quatNormalizeFast").onChange(function(ra) {
                w.quatNormalizeFast = !!ra
            }), ba = E.addFolder("Solver"), ba.add(r, "iterations", 1, 50).step(1).onChange(function(ra) {
                w.solver.iterations = ra
            }), ba.add(r, "k", 10, 1E7).onChange(function(ra) {
                q.setGlobalSpookParams(r.k, r.d, 1 / r.stepFrequency)
            }), ba.add(r, "d", 0, 20).step(.1).onChange(function(ra) {
                q.setGlobalSpookParams(r.k, r.d, 1 / r.stepFrequency)
            }), ba.add(r, "tolerance", 0, 10).step(.01).onChange(function(ra) {
                w.solver.tolerance = ra
            }), t = E.addFolder("Scenes"), t.open());
        CAMERA_TEST_TRACKBALL && (controls = new THREE.TrackballControls(camera, renderer.domElement), controls.rotateSpeed = 1, controls.zoomSpeed = 1.2, controls.panSpeed = .2, controls.noZoom = !1, controls.noPan = !1, controls.staticMoving = !1, controls.dynamicDampingFactor = .3, controls.minDistance = 0, controls.maxDistance = 1E5, controls.keys = [65, 83, 68], controls.screen.width = P, controls.screen.height = Z)
    })();
    b();
    s_oRender = h;
    document.addEventListener("keypress", function(U) {
        if (U.keyCode) switch (U.keyCode) {
            case 32:
                m();
                break;
            case 104:
                "none" ==
                Q.domElement.style.display ? (Q.domElement.style.display = "block", X.style.display = "block") : (Q.domElement.style.display = "none", X.style.display = "none");
                break;
            case 97:
                r.aabbs = !r.aabbs;
                d();
                break;
            case 99:
                r.constraints = !r.constraints;
                d();
                break;
            case 112:
                r.paused = !r.paused;
                d();
                break;
            case 115:
                w.step(1 / r.stepFrequency);
                c();
                break;
            case 109:
                U = A.indexOf(r.rendermode);
                U++;
                U %= A.length;
                e(A[U]);
                d();
                break;
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                I.length > U.keyCode - 49 && !document.activeElement.localName.match(/input/) &&
                    l(U.keyCode - 49)
        }
    })
};
CANNON.Demo.prototype = new CANNON.EventTarget;
CANNON.Demo.constructor = CANNON.Demo;
CANNON.Demo.prototype.setGlobalSpookParams = function(f, d, e) {
    for (var m = this.world, a = 0; a < m.constraints.length; a++)
        for (var c = m.constraints[a], b = 0; b < c.equations.length; b++) c.equations[b].setSpookParams(f, d, e);
    for (a = 0; a < m.contactmaterials.length; a++) e = m.contactmaterials[a], e.contactEquationStiffness = f, e.frictionEquationStiffness = f, e.contactEquationRelaxation = d, e.frictionEquationRelaxation = d;
    m.defaultContactMaterial.contactEquationStiffness = f;
    m.defaultContactMaterial.frictionEquationStiffness = f;
    m.defaultContactMaterial.contactEquationRelaxation =
        d;
    m.defaultContactMaterial.frictionEquationRelaxation = d
};
CANNON.Demo.prototype.createTransformControl = function(f, d) {
    controls = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(f);
    controls.attach(f, d);
    scene.add(controls);
    console.log("CREATE");
    window.addEventListener("keydown", function(e) {
        switch (e.keyCode) {
            case 81:
                controls.setSpace("local" === controls.space ? "world" : "local");
                break;
            case 17:
                controls.setTranslationSnap(100);
                controls.setRotationSnap(THREE.Math.degToRad(15));
                break;
            case 87:
                controls.setMode("translate");
                break;
            case 69:
                controls.setMode("rotate");
                break;
            case 82:
                controls.setMode("scale");
                break;
            case 187:
            case 107:
                controls.setSize(controls.size + .1);
                break;
            case 189:
            case 109:
                controls.setSize(Math.max(controls.size - .1, .1))
        }
    });
    window.addEventListener("keyup", function(e) {
        switch (e.keyCode) {
            case 17:
                controls.setTranslationSnap(null), controls.setRotationSnap(null)
        }
    })
};
CANNON.Demo.prototype.getWorld = function() {
    return this.world
};
CANNON.Demo.prototype.addVisual = function(f, d) {
    var e;
    f instanceof CANNON.Body && (e = this.shape2mesh(f, d));
    e && (this.bodies.push(f), this.visuals.push(e), f.visualref = e, f.visualref.visualId = this.bodies.length - 1, this.scene.add(e));
    return e
};
CANNON.Demo.prototype.addVisuals = function(f) {
    for (var d = 0; d < f.length; d++) this.addVisual(f[d])
};
CANNON.Demo.prototype.removeVisual = function(f) {
    if (f.visualref) {
        for (var d = this.bodies, e = this.visuals, m = [], a = [], c = d.length, b = 0; b < c; b++) m.unshift(d.pop()), a.unshift(e.pop());
        c = f.visualref.visualId;
        for (var k = 0; k < m.length; k++) k !== c && (b = k > c ? k - 1 : k, d[b] = m[k], e[b] = a[k], d[b].visualref = m[k].visualref, d[b].visualref.visualId = b);
        f.visualref.visualId = null;
        this.scene.remove(f.visualref);
        f.visualref = null
    }
};
CANNON.Demo.prototype.removeAllVisuals = function() {
    for (; this.bodies.length;) this.removeVisual(this.bodies[0])
};
CANNON.Demo.prototype.shape2mesh = function(f, d) {
    for (var e = new THREE.Object3D, m = 0; m < f.shapes.length; m++) {
        var a = f.shapes[m];
        switch (a.type) {
            case CANNON.Shape.types.SPHERE:
                var c = new THREE.SphereGeometry(a.radius, 8, 8);
                a = void 0 === d ? new THREE.Mesh(c, this.currentMaterial) : new THREE.Mesh(c, d);
                a.castShadow = !0;
                break;
            case CANNON.Shape.types.PARTICLE:
                a = new THREE.Mesh(this.particleGeo, this.particleMaterial);
                c = this.settings;
                a.scale.set(c.particleSize, c.particleSize, c.particleSize);
                break;
            case CANNON.Shape.types.PLANE:
                var b =
                    new THREE.PlaneGeometry(10, 10, 4, 4);
                a = new THREE.Object3D;
                c = new THREE.Object3D;
                b = void 0 === d ? new THREE.Mesh(b, this.currentMaterial) : new THREE.Mesh(b, d);
                b.scale.set(100, 100, 100);
                c.add(b);
                b.castShadow = !1;
                b.receiveShadow = !0;
                a.add(c);
                break;
            case CANNON.Shape.types.BOX:
                c = new THREE.BoxGeometry(2 * a.halfExtents.x, 2 * a.halfExtents.y, 2 * a.halfExtents.z);
                a = void 0 === d ? new THREE.Mesh(c, this.currentMaterial) : new THREE.Mesh(c, d);
                break;
            case CANNON.Shape.types.CONVEXPOLYHEDRON:
                b = new THREE.Geometry;
                for (c = 0; c < a.vertices.length; c++) {
                    var k =
                        a.vertices[c];
                    b.vertices.push(new THREE.Vector3(k.x, k.y, k.z))
                }
                for (c = 0; c < a.faces.length; c++) {
                    var g = a.faces[c],
                        h = g[0];
                    for (k = 1; k < g.length - 1; k++) b.faces.push(new THREE.Face3(h, g[k], g[k + 1]))
                }
                b.computeBoundingSphere();
                b.computeFaceNormals();
                a = void 0 === d ? new THREE.Mesh(b, this.currentMaterial) : new THREE.Mesh(b, d);
                break;
            case CANNON.Shape.types.HEIGHTFIELD:
                b = new THREE.Geometry;
                g = new CANNON.Vec3;
                h = new CANNON.Vec3;
                var l = new CANNON.Vec3;
                for (k = 0; k < a.data.length - 1; k++)
                    for (var p = 0; p < a.data[k].length - 1; p++)
                        for (var n =
                                0; 2 > n; n++) a.getConvexTrianglePillar(k, p, 0 === n), g.copy(a.pillarConvex.vertices[0]), h.copy(a.pillarConvex.vertices[1]), l.copy(a.pillarConvex.vertices[2]), g.vadd(a.pillarOffset, g), h.vadd(a.pillarOffset, h), l.vadd(a.pillarOffset, l), b.vertices.push(new THREE.Vector3(g.x, g.y, g.z), new THREE.Vector3(h.x, h.y, h.z), new THREE.Vector3(l.x, l.y, l.z)), c = b.vertices.length - 3, b.faces.push(new THREE.Face3(c, c + 1, c + 2));
                b.computeBoundingSphere();
                b.computeFaceNormals();
                a = void 0 === d ? new THREE.Mesh(b, this.currentMaterial) :
                    new THREE.Mesh(b, d);
                break;
            case CANNON.Shape.types.TRIMESH:
                b = new THREE.Geometry;
                g = new CANNON.Vec3;
                h = new CANNON.Vec3;
                l = new CANNON.Vec3;
                for (c = 0; c < a.indices.length / 3; c++) a.getTriangleVertices(c, g, h, l), b.vertices.push(new THREE.Vector3(g.x, g.y, g.z), new THREE.Vector3(h.x, h.y, h.z), new THREE.Vector3(l.x, l.y, l.z)), k = b.vertices.length - 3, b.faces.push(new THREE.Face3(k, k + 1, k + 2));
                b.computeBoundingSphere();
                b.computeFaceNormals();
                a = void 0 === d ? new THREE.Mesh(b, this.currentMaterial) : new THREE.Mesh(b, d);
                break;
            default:
                throw "Visual type not recognized: " +
                    a.type;
        }
        a.receiveShadow = !0;
        a.castShadow = !0;
        if (a.children)
            for (c = 0; c < a.children.length; c++)
                if (a.children[c].castShadow = !0, a.children[c].receiveShadow = !0, a.children[c])
                    for (k = 0; k < a.children[c].length; k++) a.children[c].children[k].castShadow = !0, a.children[c].children[k].receiveShadow = !0;
        c = f.shapeOffsets[m];
        b = f.shapeOrientations[m];
        a.position.set(c.x, c.y, c.z);
        a.quaternion.set(b.x, b.y, b.z, b.w);
        e.add(a)
    }
    this.camera = function() {
        return camera
    };
    this.getScene = function() {
        return scene
    };
    return e
};

function CBall(f, d, e, m, a) {
    var c, b, k, g = null,
        h = FOV * BALL_RADIUS,
        l = 0,
        p = 0;
    this._init = function(t, r, v) {
        k = new createjs.Container;
        q.addChild(k);
        var x = new createjs.SpriteSheet({
            images: [v],
            frames: {
                width: v.width / 7,
                height: v.height,
                regX: v.width / 2 / 7,
                regY: v.height / 2
            }
        });
        c = createSprite(x, 0, v.width / 2 / 7, v.height / 2, v.width / 7, v.height / 2);
        c.stop();
        this.scale(h);
        v = s_oSpriteLibrary.getSprite("ball_shadow");
        b = createBitmap(v);
        b.x = t;
        b.y = r;
        b.regX = .5 * v.width;
        b.regY = .5 * v.height;
        this.scaleShadow(h);
        k.addChild(b, c)
    };
    this.rolls = function() {
        c.rotation =
            180 / Math.PI * Math.sin(-(.15 * n.velocity.x));
        var t = Math.abs(n.angularVelocity.x),
            r = this._goToPrevFrame;
        0 > n.angularVelocity.x && (r = this._goToNextFrame);
        7 < t ? r() : 3 < t ? (l++, l > 2 / ROLL_BALL_RATE && (r(), l = 0)) : 1 < t ? (l++, l > 3 / ROLL_BALL_RATE && (r(), l = 0)) : t > MIN_BALL_VEL_ROTATION && (l++, l > 4 / ROLL_BALL_RATE && (r(), l = 0))
    };
    this._goToPrevFrame = function() {
        0 === p ? p = 6 : p--;
        c.gotoAndStop(p)
    };
    this._goToNextFrame = function() {
        7 === p ? p = 1 : p++;
        c.gotoAndStop(p)
    };
    this.unload = function() {
        c.removeAllEventListeners();
        q.removeChild(c)
    };
    this.setVisible =
        function(t) {
            k.visible = t
        };
    this.getStartScale = function() {
        return h
    };
    this.startPosShadowY = function(t) {
        g = t
    };
    this.getStartShadowYPos = function() {
        return g
    };
    this.fadeAnimation = function(t, r, v) {
        this.tweenFade(t, r, v)
    };
    this.tweenFade = function(t, r, v) {
        createjs.Tween.get(k, {
            override: !0
        }).wait(v).to({
            alpha: t
        }, r).call(function() {})
    };
    this.setPositionShadow = function(t, r) {
        b.x = t;
        b.y = r
    };
    this.setPosition = function(t, r) {
        c.x = t;
        c.y = r
    };
    this.getPhysics = function() {
        return n
    };
    this.setAngle = function(t) {
        c.rotation = t
    };
    this.getX = function() {
        return c.x
    };
    this.getY = function() {
        return c.y
    };
    this.getStartScale = function() {
        return h
    };
    this.scale = function(t) {
        c.scaleX = t;
        c.scaleY = t
    };
    this.scaleShadow = function(t) {
        .08 < t ? (b.scaleX = t, b.scaleY = t) : (b.scaleX = .08, b.scaleY = .08)
    };
    this.setAlphaByHeight = function(t) {
        b.alpha = t
    };
    this.getScale = function() {
        return c.scaleX
    };
    this.getObject = function() {
        return k
    };
    this.getDepthPos = function() {
        return n.position.y
    };
    var n = m;
    var q = a;
    this._init(f, d, e);
    return this
}

function CScenario() {
    var f, d, e, m, a, c, b, k, g, h, l, p, n, q, t, r;
    if (SHOW_3D_RENDER) var v = new CANNON.Demo;
    this.getDemo = function() {
        return v
    };
    this._init = function() {
        f = SHOW_3D_RENDER ? v.getWorld() : new CANNON.World;
        f.gravity.set(0, 0, -9.81);
        f.broadphase = new CANNON.NaiveBroadphase;
        f.solver.iterations = 50;
        f.solver.tolerance = 1E-5;
        d = new CANNON.Material;
        e = new CANNON.Material;
        m = new CANNON.Material;
        var x = new CANNON.ContactMaterial(e, m, {
                friction: .1,
                restitution: .01
            }),
            y = new CANNON.ContactMaterial(e, d, {
                friction: .2,
                restitution: .3
            });
        f.addContactMaterial(x);
        f.addContactMaterial(y);
        s_oScenario._createBallBody();
        s_oScenario._createFieldBody();
        s_oScenario._createGoal();
        s_oScenario.createBackGoalWall();
        SHOW_AREAS_GOAL ? s_oScenario.createAreasGoal() : s_oScenario.createAreaGoal(GOAL_LINE_POS, BACK_WALL_GOAL_SIZE, COLOR_AREA_GOAL[0], null)
    };
    this.createAreasGoal = function() {
        for (var x = 0, y = FIRST_AREA_GOAL_POS.x, I = FIRST_AREA_GOAL_POS.z, E = 0; E < NUM_AREA_GOAL.h; E++) {
            for (var N = 0; N < NUM_AREA_GOAL.w; N++) s_oScenario.createAreaGoal({
                x: y,
                y: FIRST_AREA_GOAL_POS.y,
                z: I
            }, AREA_GOAL_PROPERTIES, COLOR_AREA_GOAL[x], AREAS_INFO[x]), y += 2 * AREA_GOAL_PROPERTIES.width, x++;
            y = FIRST_AREA_GOAL_POS.x;
            I -= 2 * AREA_GOAL_PROPERTIES.height
        }
    };
    this._createFieldBody = function() {
        k = new CANNON.Plane;
        g = new CANNON.Body({
            mass: 0,
            material: d
        });
        g.addShape(k);
        g.position.z = -9;
        g.addEventListener("collide", function(y) {
            s_oScenario.fieldCollision()
        });
        f.addBody(g);
        if (SHOW_3D_RENDER) {
            var x = new THREE.MeshPhongMaterial({
                color: 5803568,
                specular: 1118481,
                shininess: 10
            });
            v.addVisual(g, x)
        }
    };
    this._createGoal = function() {
        h =
            new CANNON.Cylinder(POLE_RIGHT_LEFT_SIZE.radius_top, POLE_RIGHT_LEFT_SIZE.radius_bottom, POLE_RIGHT_LEFT_SIZE.height, POLE_RIGHT_LEFT_SIZE.segments);
        p = new CANNON.Body({
            mass: 0
        });
        l = new CANNON.Cylinder(POLE_UP_SIZE.radius_top, POLE_UP_SIZE.radius_bottom, POLE_UP_SIZE.height, POLE_UP_SIZE.segments);
        var x = new CANNON.Quaternion;
        x.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
        l.transformAllPoints(new CANNON.Vec3, x);
        p.addShape(h, new CANNON.Vec3(.5 * POLE_UP_SIZE.height, 0, 0));
        p.addShape(h, new CANNON.Vec3(.5 *
            -POLE_UP_SIZE.height, 0, 0));
        p.addShape(l, new CANNON.Vec3(0, 0, .5 * POLE_RIGHT_LEFT_SIZE.height));
        p.position.set(BACK_WALL_GOAL_POSITION.x, BACK_WALL_GOAL_POSITION.y - UP_WALL_GOAL_SIZE.depth, BACK_WALL_GOAL_POSITION.z);
        p.addEventListener("collide", function(y) {
            s_oScenario.poleCollision()
        });
        f.addBody(p);
        SHOW_3D_RENDER && (x = new THREE.MeshPhongMaterial({
            color: 16777215,
            specular: 1118481,
            shininess: 50
        }), v.addVisual(p, x))
    };
    this.createBackGoalWall = function() {
        n = new CANNON.Box(new CANNON.Vec3(BACK_WALL_GOAL_SIZE.width,
            BACK_WALL_GOAL_SIZE.depth, BACK_WALL_GOAL_SIZE.height));
        q = new CANNON.Box(new CANNON.Vec3(LEFT_RIGHT_WALL_GOAL_SIZE.width, LEFT_RIGHT_WALL_GOAL_SIZE.depth, LEFT_RIGHT_WALL_GOAL_SIZE.height));
        t = new CANNON.Box(new CANNON.Vec3(UP_WALL_GOAL_SIZE.width, UP_WALL_GOAL_SIZE.depth, UP_WALL_GOAL_SIZE.height));
        r = new CANNON.Body({
            mass: 0,
            material: m
        });
        r.addShape(n);
        r.addShape(q, new CANNON.Vec3(BACK_WALL_GOAL_SIZE.width, 0, 0));
        r.addShape(q, new CANNON.Vec3(-BACK_WALL_GOAL_SIZE.width, 0, 0));
        r.addShape(t, new CANNON.Vec3(0,
            0, BACK_WALL_GOAL_SIZE.height));
        r.position.set(BACK_WALL_GOAL_POSITION.x, BACK_WALL_GOAL_POSITION.y, BACK_WALL_GOAL_POSITION.z);
        f.addBody(r);
        SHOW_3D_RENDER && v.addVisual(r)
    };
    this.createAreaGoal = function(x, y, I, E) {
        y = new CANNON.Box(new CANNON.Vec3(y.width, y.depth, y.height));
        E = new CANNON.Body({
            mass: 0,
            userData: E
        });
        E.addShape(y);
        E.position.set(x.x, x.y, x.z);
        E.collisionResponse = 0;
        E.addEventListener("collide", function(N) {
            s_oScenario.lineGoalCollision(N)
        });
        f.addBody(E);
        SHOW_3D_RENDER && (x = new THREE.MeshPhongMaterial({
            color: I,
            specular: 1118481,
            shininess: 70
        }), v.addVisual(E, x));
        return E
    };
    this._createBallBody = function() {
        a = new CANNON.Sphere(BALL_RADIUS);
        c = new CANNON.Body({
            mass: BALL_MASS,
            material: e,
            linearDamping: BALL_LINEAR_DAMPING,
            angularDamping: 2 * BALL_LINEAR_DAMPING
        });
        var x = new CANNON.Vec3(POSITION_BALL.x, POSITION_BALL.y, POSITION_BALL.z);
        c.position.copy(x);
        c.addShape(a);
        f.add(c);
        SHOW_3D_RENDER && (x = new THREE.MeshPhongMaterial({
            color: 16777215,
            specular: 1118481,
            shininess: 70
        }), b = v.addVisual(c, x))
    };
    this.addImpulse = function(x, y) {
        var I =
            new CANNON.Vec3(0, 0, BALL_RADIUS),
            E = new CANNON.Vec3(y.x, y.y, y.z);
        x.applyImpulse(E, I)
    };
    this.addForce = function(x, y) {
        var I = new CANNON.Vec3(0, 0, 0),
            E = new CANNON.Vec3(y.x, y.y, y.z);
        x.applyForce(E, I)
    };
    this.getBodyVelocity = function(x) {
        return x.velocity
    };
    this.ballBody = function() {
        return c
    };
    this.ballMesh = function() {
        return b
    };
    this.getCamera = function() {
        return v.camera()
    };
    this.fieldCollision = function() {
        s_oGame.fieldCollision();
        s_oGame.ballFadeForReset()
    };
    this.setElementAngularVelocity = function(x, y) {
        x.angularVelocity.set(y.x,
            y.y, y.z)
    };
    this.setElementVelocity = function(x, y) {
        var I = new CANNON.Vec3(y.x, y.y, y.z);
        x.velocity = I
    };
    this.setElementLinearDamping = function(x, y) {
        x.linearDamping = y
    };
    this.getFieldBody = function() {
        return g
    };
    this.lineGoalCollision = function(x) {
        s_oGame.areaGoal(x.contact.bj.userData)
    };
    this.update = function() {
        f.step(PHYSICS_STEP)
    };
    this.getGoalBody = function() {
        return p
    };
    this.poleCollision = function() {
        s_oGame.poleCollide()
    };
    this.destroyWorld = function() {
        for (var x = f.bodies, y = 0; y < x.length; y++) f.remove(x[y]);
        f = null
    };
    s_oScenario =
        this;
    SHOW_3D_RENDER ? (v.addScene("Test", this._init), v.start()) : this._init()
}
var s_oScenario;
Detector = {
    canvas: !!window.CanvasRenderingContext2D,
    webgl: function() {
        try {
            return !!window.WebGLRenderingContext && !!document.createElement("canvas").getContext("experimental-webgl")
        } catch (f) {
            return !1
        }
    }(),
    workers: !!window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,
    getWebGLErrorMessage: function() {
        var f = document.createElement("div");
        f.id = "webgl-error-message";
        f.style.fontFamily = "monospace";
        f.style.fontSize = "13px";
        f.style.fontWeight = "normal";
        f.style.textAlign = "center";
        f.style.background =
            "#fff";
        f.style.color = "#000";
        f.style.padding = "1.5em";
        f.style.width = "400px";
        f.style.margin = "5em auto 0";
        this.webgl || (f.innerHTML = window.WebGLRenderingContext ? 'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />\nFind out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.' : 'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>\nFind out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.');
        return f
    },
    addGetWebGLMessage: function(f) {
        f = f || {};
        var d = void 0 !== f.parent ? f.parent : document.body;
        f = void 0 !== f.id ? f.id : "oldie";
        var e = Detector.getWebGLErrorMessage();
        e.id = f;
        d.appendChild(e)
    }
};

function TimeSeries(f) {
    f = f || {};
    f.resetBoundsInterval = f.resetBoundsInterval || 3E3;
    f.resetBounds = void 0 === f.resetBounds ? !0 : f.resetBounds;
    this.options = f;
    this.data = [];
    this.label = f.label || "";
    this.maxDataLength = f.maxDataLength || 1E3;
    this.dataPool = [];
    this.minValue = this.maxValue = Number.NaN;
    f.resetBounds && (this.boundsTimer = setInterval(function(d) {
        return function() {
            d.resetBounds()
        }
    }(this), f.resetBoundsInterval))
}
TimeSeries.prototype.resetBounds = function() {
    this.minValue = this.maxValue = Number.NaN;
    for (var f = 0; f < this.data.length; f++) this.maxValue = isNaN(this.maxValue) ? this.data[f][1] : Math.max(this.maxValue, this.data[f][1]), this.minValue = isNaN(this.minValue) ? this.data[f][1] : Math.min(this.minValue, this.data[f][1])
};
TimeSeries.prototype.append = function(f, d) {
    this.lastTimeStamp = f;
    var e = this.dataPool.length ? this.dataPool.pop() : [f, d];
    e[0] = f;
    e[1] = d;
    this.data.push(e);
    this.maxValue = isNaN(this.maxValue) ? d : Math.max(this.maxValue, d);
    for (this.minValue = isNaN(this.minValue) ? d : Math.min(this.minValue, d); this.data.length > this.maxDataLength;) this.dataPool.push(this.data.shift())
};

function SmoothieChart(f) {
    f = f || {};
    f.grid = f.grid || {
        fillStyle: "#000000",
        strokeStyle: "#777777",
        lineWidth: 1,
        millisPerLine: 1E3,
        verticalSections: 2
    };
    f.millisPerPixel = f.millisPerPixel || 20;
    f.fps = f.fps || 50;
    f.maxValueScale = f.maxValueScale || 1;
    f.minValue = f.minValue;
    f.maxValue = f.maxValue;
    f.labels = f.labels || {
        fillStyle: "#ffffff"
    };
    f.interpolation = f.interpolation || "bezier";
    f.scaleSmoothing = f.scaleSmoothing || .125;
    f.maxDataSetLength = f.maxDataSetLength || 2;
    f.timestampFormatter = f.timestampFormatter || null;
    this.options = f;
    this.seriesSet = [];
    this.currentValueRange = 1;
    this.currentVisMinValue = 0
}
SmoothieChart.prototype.addTimeSeries = function(f, d) {
    this.seriesSet.push({
        timeSeries: f,
        options: d || {}
    })
};
SmoothieChart.prototype.removeTimeSeries = function(f) {
    this.seriesSet.splice(this.seriesSet.indexOf(f), 1)
};
SmoothieChart.prototype.streamTo = function(f, d) {
    var e = this;
    this.render_on_tick = function() {
        e.render(f, e.seriesSet[0].timeSeries.lastTimeStamp)
    };
    this.start()
};
SmoothieChart.prototype.start = function() {
    this.timer || (this.timer = setInterval(this.render_on_tick, 1E3 / this.options.fps))
};
SmoothieChart.prototype.stop = function() {
    this.timer && (clearInterval(this.timer), this.timer = void 0)
};
SmoothieChart.timeFormatter = function(f) {
    function d(e) {
        return (10 > e ? "0" : "") + e
    }
    return d(f.getHours()) + ":" + d(f.getMinutes()) + ":" + d(f.getSeconds())
};
SmoothieChart.prototype.render = function(f, d) {
    var e = f.getContext("2d"),
        m = this.options,
        a = f.clientWidth,
        c = f.clientHeight;
    e.save();
    d -= d % m.millisPerPixel;
    e.translate(0, 0);
    e.beginPath();
    e.rect(0, 0, a, c);
    e.clip();
    e.save();
    e.fillStyle = m.grid.fillStyle;
    e.clearRect(0, 0, a, c);
    e.fillRect(0, 0, a, c);
    e.restore();
    e.save();
    e.lineWidth = m.grid.lineWidth || 1;
    e.strokeStyle = m.grid.strokeStyle || "#ffffff";
    if (0 < m.grid.millisPerLine)
        for (var b = d - d % m.grid.millisPerLine; b >= d - a * m.millisPerPixel; b -= m.grid.millisPerLine) {
            e.beginPath();
            var k = Math.round(a - (d - b) / m.millisPerPixel);
            e.moveTo(k, 0);
            e.lineTo(k, c);
            e.stroke();
            if (m.timestampFormatter) {
                var g = m.timestampFormatter(new Date(b)),
                    h = e.measureText(g).width / 2 + e.measureText(y).width + 4;
                k < a - h && (e.fillStyle = m.labels.fillStyle, e.fillText(g, k - e.measureText(g).width / 2, c - 2))
            }
            e.closePath()
        }
    for (y = 1; y < m.grid.verticalSections; y++) b = Math.round(y * c / m.grid.verticalSections), e.beginPath(), e.moveTo(0, b), e.lineTo(a, b), e.stroke(), e.closePath();
    e.beginPath();
    e.strokeRect(0, 0, a, c);
    e.closePath();
    e.restore();
    y = k = Number.NaN;
    for (g = 0; g < this.seriesSet.length; g++) {
        var l = this.seriesSet[g].timeSeries;
        isNaN(l.maxValue) || (k = isNaN(k) ? l.maxValue : Math.max(k, l.maxValue));
        isNaN(l.minValue) || (y = isNaN(y) ? l.minValue : Math.min(y, l.minValue))
    }
    if (!isNaN(k) || !isNaN(y)) {
        k = null != m.maxValue ? m.maxValue : k * m.maxValueScale;
        null != m.minValue && (y = m.minValue);
        this.currentValueRange += m.scaleSmoothing * (k - y - this.currentValueRange);
        this.currentVisMinValue += m.scaleSmoothing * (y - this.currentVisMinValue);
        h = this.currentValueRange;
        var p = this.currentVisMinValue;
        for (g = 0; g < this.seriesSet.length; g++) {
            e.save();
            l = this.seriesSet[g].timeSeries;
            l = l.data;
            for (var n = this.seriesSet[g].options; l.length >= m.maxDataSetLength && l[1][0] < d - a * m.millisPerPixel;) l.splice(0, 1);
            e.lineWidth = n.lineWidth || 1;
            e.fillStyle = n.fillStyle;
            e.strokeStyle = n.strokeStyle || "#ffffff";
            e.beginPath();
            var q = 0,
                t = 0,
                r = 0;
            for (b = 0; b < l.length; b++) {
                var v = Math.round(a - (d - l[b][0]) / m.millisPerPixel),
                    x = l[b][1] - p;
                x = Math.max(Math.min(c - (h ? Math.round(x / h * c) : 0), c - 1), 1);
                if (0 == b) q = v, e.moveTo(v, x);
                else switch (m.interpolation) {
                    case "line":
                        e.lineTo(v,
                            x);
                        break;
                    default:
                        e.bezierCurveTo(Math.round((t + v) / 2), r, Math.round(t + v) / 2, x, v, x)
                }
                t = v;
                r = x
            }
            0 < l.length && n.fillStyle && (e.lineTo(a + n.lineWidth + 1, r), e.lineTo(a + n.lineWidth + 1, c + n.lineWidth + 1), e.lineTo(q, c + n.lineWidth), e.fill());
            e.stroke();
            e.closePath();
            e.restore()
        }
        if (!m.labels.disabled) {
            m.labelOffsetY || (m.labelOffsetY = 0);
            e.fillStyle = m.labels.fillStyle;
            b = parseFloat(k).toFixed(2);
            var y = parseFloat(y).toFixed(2);
            e.fillText(b, a - e.measureText(b).width - 2, 10);
            e.fillText(y, a - e.measureText(y).width - 2, c - 2);
            for (b = 0; b <
                this.seriesSet.length; b++) l = this.seriesSet[b].timeSeries, a = l.label, e.fillStyle = l.options.fillStyle || "rgb(255,255,255)", a && e.fillText(a, 2, 10 * (b + 1) + m.labelOffsetY)
        }
    }
    e.restore()
};
var Stats = function() {
    var f = 0,
        d = 0,
        e = Date.now(),
        m = e,
        a = e,
        c = 0,
        b = 1E3,
        k = 0,
        g = [
            [16, 16, 48],
            [0, 255, 255]
        ],
        h = 0,
        l = 1E3,
        p = 0,
        n = [
            [16, 48, 16],
            [0, 255, 0]
        ];
    var q = document.createElement("div");
    q.style.cursor = "pointer";
    q.style.width = "80px";
    q.style.opacity = "0.9";
    q.style.zIndex = "10001";
    q.addEventListener("mousedown", function(N) {
        N.preventDefault();
        f = (f + 1) % 2;
        0 == f ? (t.style.display = "block", y.style.display = "none") : (t.style.display = "none", y.style.display = "block")
    }, !1);
    var t = document.createElement("div");
    t.style.textAlign = "left";
    t.style.lineHeight = "1.2em";
    t.style.backgroundColor = "rgb(" + Math.floor(g[0][0] / 2) + "," + Math.floor(g[0][1] / 2) + "," + Math.floor(g[0][2] / 2) + ")";
    t.style.padding = "0 0 3px 3px";
    q.appendChild(t);
    var r = document.createElement("div");
    r.style.fontFamily = "Helvetica, Arial, sans-serif";
    r.style.fontSize = "9px";
    r.style.color = "rgb(" + g[1][0] + "," + g[1][1] + "," + g[1][2] + ")";
    r.style.fontWeight = "bold";
    r.innerHTML = "FPS";
    t.appendChild(r);
    var v = document.createElement("div");
    v.style.position = "relative";
    v.style.width = "74px";
    v.style.height =
        "30px";
    v.style.backgroundColor = "rgb(" + g[1][0] + "," + g[1][1] + "," + g[1][2] + ")";
    for (t.appendChild(v); 74 > v.children.length;) {
        var x = document.createElement("span");
        x.style.width = "1px";
        x.style.height = "30px";
        x.style.cssFloat = "left";
        x.style.backgroundColor = "rgb(" + g[0][0] + "," + g[0][1] + "," + g[0][2] + ")";
        v.appendChild(x)
    }
    var y = document.createElement("div");
    y.style.textAlign = "left";
    y.style.lineHeight = "1.2em";
    y.style.backgroundColor = "rgb(" + Math.floor(n[0][0] / 2) + "," + Math.floor(n[0][1] / 2) + "," + Math.floor(n[0][2] / 2) + ")";
    y.style.padding = "0 0 3px 3px";
    y.style.display = "none";
    q.appendChild(y);
    var I = document.createElement("div");
    I.style.fontFamily = "Helvetica, Arial, sans-serif";
    I.style.fontSize = "9px";
    I.style.color = "rgb(" + n[1][0] + "," + n[1][1] + "," + n[1][2] + ")";
    I.style.fontWeight = "bold";
    I.innerHTML = "MS";
    y.appendChild(I);
    var E = document.createElement("div");
    E.style.position = "relative";
    E.style.width = "74px";
    E.style.height = "30px";
    E.style.backgroundColor = "rgb(" + n[1][0] + "," + n[1][1] + "," + n[1][2] + ")";
    for (y.appendChild(E); 74 > E.children.length;) x =
        document.createElement("span"), x.style.width = "1px", x.style.height = 30 * Math.random() + "px", x.style.cssFloat = "left", x.style.backgroundColor = "rgb(" + n[0][0] + "," + n[0][1] + "," + n[0][2] + ")", E.appendChild(x);
    return {
        domElement: q,
        update: function() {
            e = Date.now();
            h = e - m;
            l = Math.min(l, h);
            p = Math.max(p, h);
            I.textContent = h + " MS (" + l + "-" + p + ")";
            var N = Math.min(30, 30 - h / 200 * 30);
            E.appendChild(E.firstChild).style.height = N + "px";
            m = e;
            d++;
            e > a + 1E3 && (c = Math.round(1E3 * d / (e - a)), b = Math.min(b, c), k = Math.max(k, c), r.textContent = c + " FPS (" +
                b + "-" + k + ")", N = Math.min(30, 30 - c / 100 * 30), v.appendChild(v.firstChild).style.height = N + "px", a = e, d = 0)
        }
    }
};
THREE.TrackballControls = function(f, d) {
    function e(G) {
        !1 !== b.enabled && (window.removeEventListener("keydown", e), l = h, h === k.NONE) && (G.keyCode !== b.keys[k.ROTATE] || b.noRotate ? G.keyCode !== b.keys[k.ZOOM] || b.noZoom ? G.keyCode !== b.keys[k.PAN] || b.noPan || (h = k.PAN) : h = k.ZOOM : h = k.ROTATE)
    }

    function m(G) {
        !1 !== b.enabled && (G.preventDefault(), G.stopPropagation(), h !== k.ROTATE || b.noRotate ? h !== k.ZOOM || b.noZoom ? h !== k.PAN || b.noPan || I.copy(T(G.pageX, G.pageY)) : r.copy(T(G.pageX, G.pageY)) : q.copy(M(G.pageX, G.pageY)))
    }

    function a(G) {
        !1 !==
            b.enabled && (G.preventDefault(), G.stopPropagation(), h = k.NONE, document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", a), b.dispatchEvent(R))
    }

    function c(G) {
        if (!1 !== b.enabled) {
            G.preventDefault();
            G.stopPropagation();
            var H = 0;
            G.wheelDelta ? H = G.wheelDelta / 40 : G.detail && (H = -G.detail / 3);
            t.y += .01 * H;
            b.dispatchEvent(N);
            b.dispatchEvent(R)
        }
    }
    var b = this,
        k = {
            NONE: -1,
            ROTATE: 0,
            ZOOM: 1,
            PAN: 2,
            TOUCH_ROTATE: 3,
            TOUCH_ZOOM_PAN: 4
        };
    this.object = f;
    this.domElement = void 0 !== d ? d : document;
    this.enabled = !0;
    this.screen = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };
    this.rotateSpeed = 1;
    this.zoomSpeed = 1.2;
    this.panSpeed = .3;
    this.staticMoving = this.noRoll = this.noPan = this.noZoom = this.noRotate = !1;
    this.dynamicDampingFactor = .2;
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.keys = [65, 83, 68];
    this.target = new THREE.Vector3;
    var g = new THREE.Vector3,
        h = k.NONE,
        l = k.NONE,
        p = new THREE.Vector3,
        n = new THREE.Vector3,
        q = new THREE.Vector3,
        t = new THREE.Vector2,
        r = new THREE.Vector2,
        v = 0,
        x = 0,
        y = new THREE.Vector2,
        I = new THREE.Vector2;
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();
    var E = {
            type: "change"
        },
        N = {
            type: "start"
        },
        R = {
            type: "end"
        };
    this.handleResize = function() {
        if (this.domElement === document) this.screen.left = 0, this.screen.top = 0, this.screen.width = window.innerWidth, this.screen.height = window.innerHeight;
        else {
            var G = this.domElement.getBoundingClientRect(),
                H = this.domElement.ownerDocument.documentElement;
            this.screen.left = G.left + window.pageXOffset - H.clientLeft;
            this.screen.top = G.top + window.pageYOffset - H.clientTop;
            this.screen.width = G.width;
            this.screen.height = G.height
        }
    };
    this.handleEvent = function(G) {
        if ("function" == typeof this[G.type]) this[G.type](G)
    };
    var T = function() {
            var G = new THREE.Vector2;
            return function(H, S) {
                G.set((H - b.screen.left) / b.screen.width, (S - b.screen.top) / b.screen.height);
                return G
            }
        }(),
        M = function() {
            var G = new THREE.Vector3,
                H = new THREE.Vector3,
                S = new THREE.Vector3;
            return function(J, ca) {
                S.set((J - .5 * b.screen.width - b.screen.left) / (.5 * b.screen.width), (.5 * b.screen.height + b.screen.top - ca) / (.5 * b.screen.height),
                    0);
                var O = S.length();
                b.noRoll ? S.z = O < Math.SQRT1_2 ? Math.sqrt(1 - O * O) : .5 / O : 1 < O ? S.normalize() : S.z = Math.sqrt(1 - O * O);
                p.copy(b.object.position).sub(b.target);
                G.copy(b.object.up).setLength(S.y);
                G.add(H.copy(b.object.up).cross(p).setLength(S.x));
                G.add(p.setLength(S.z));
                return G
            }
        }();
    this.rotateCamera = function() {
        var G = new THREE.Vector3,
            H = new THREE.Quaternion;
        return function() {
            var S = Math.acos(n.dot(q) / n.length() / q.length());
            S && (G.crossVectors(n, q).normalize(), S *= b.rotateSpeed, H.setFromAxisAngle(G, -S), p.applyQuaternion(H),
                b.object.up.applyQuaternion(H), q.applyQuaternion(H), b.staticMoving ? n.copy(q) : (H.setFromAxisAngle(G, S * (b.dynamicDampingFactor - 1)), n.applyQuaternion(H)))
        }
    }();
    this.zoomCamera = function() {
        if (h === k.TOUCH_ZOOM_PAN) {
            var G = v / x;
            v = x;
            p.multiplyScalar(G)
        } else G = 1 + (r.y - t.y) * b.zoomSpeed, 1 !== G && 0 < G && (p.multiplyScalar(G), b.staticMoving ? t.copy(r) : t.y += (r.y - t.y) * this.dynamicDampingFactor)
    };
    this.panCamera = function() {
        var G = new THREE.Vector2,
            H = new THREE.Vector3,
            S = new THREE.Vector3;
        return function() {
            G.copy(I).sub(y);
            G.lengthSq() &&
                (G.multiplyScalar(p.length() * b.panSpeed), S.copy(p).cross(b.object.up).setLength(G.x), S.add(H.copy(b.object.up).setLength(G.y)), b.object.position.add(S), b.target.add(S), b.staticMoving ? y.copy(I) : y.add(G.subVectors(I, y).multiplyScalar(b.dynamicDampingFactor)))
        }
    }();
    this.checkDistances = function() {
        b.noZoom && b.noPan || (p.lengthSq() > b.maxDistance * b.maxDistance && b.object.position.addVectors(b.target, p.setLength(b.maxDistance)), p.lengthSq() < b.minDistance * b.minDistance && b.object.position.addVectors(b.target,
            p.setLength(b.minDistance)))
    };
    this.update = function() {
        p.subVectors(b.object.position, b.target);
        b.noRotate || b.rotateCamera();
        b.noZoom || b.zoomCamera();
        b.noPan || b.panCamera();
        b.object.position.addVectors(b.target, p);
        b.checkDistances();
        b.object.lookAt(b.target);
        1E-6 < g.distanceToSquared(b.object.position) && (b.dispatchEvent(E), g.copy(b.object.position))
    };
    this.reset = function() {
        l = h = k.NONE;
        b.target.copy(b.target0);
        b.object.position.copy(b.position0);
        b.object.up.copy(b.up0);
        p.subVectors(b.object.position, b.target);
        b.object.lookAt(b.target);
        b.dispatchEvent(E);
        g.copy(b.object.position)
    };
    this.domElement.addEventListener("contextmenu", function(G) {
        G.preventDefault()
    }, !1);
    this.domElement.addEventListener("mousedown", function(G) {
        !1 !== b.enabled && (G.preventDefault(), G.stopPropagation(), h === k.NONE && (h = G.button), h !== k.ROTATE || b.noRotate ? h !== k.ZOOM || b.noZoom ? h !== k.PAN || b.noPan || (y.copy(T(G.pageX, G.pageY)), I.copy(y)) : (t.copy(T(G.pageX, G.pageY)), r.copy(t)) : (n.copy(M(G.pageX, G.pageY)), q.copy(n)), document.addEventListener("mousemove",
            m, !1), document.addEventListener("mouseup", a, !1), b.dispatchEvent(N))
    }, !1);
    this.domElement.addEventListener("mousewheel", c, !1);
    this.domElement.addEventListener("DOMMouseScroll", c, !1);
    this.domElement.addEventListener("touchstart", function(G) {
        if (!1 !== b.enabled) {
            switch (G.touches.length) {
                case 1:
                    h = k.TOUCH_ROTATE;
                    n.copy(M(G.touches[0].pageX, G.touches[0].pageY));
                    q.copy(n);
                    break;
                case 2:
                    h = k.TOUCH_ZOOM_PAN;
                    var H = G.touches[0].pageX - G.touches[1].pageX,
                        S = G.touches[0].pageY - G.touches[1].pageY;
                    x = v = Math.sqrt(H * H + S *
                        S);
                    y.copy(T((G.touches[0].pageX + G.touches[1].pageX) / 2, (G.touches[0].pageY + G.touches[1].pageY) / 2));
                    I.copy(y);
                    break;
                default:
                    h = k.NONE
            }
            b.dispatchEvent(N)
        }
    }, !1);
    this.domElement.addEventListener("touchend", function(G) {
        if (!1 !== b.enabled) {
            switch (G.touches.length) {
                case 1:
                    q.copy(M(G.touches[0].pageX, G.touches[0].pageY));
                    n.copy(q);
                    break;
                case 2:
                    v = x = 0, I.copy(T((G.touches[0].pageX + G.touches[1].pageX) / 2, (G.touches[0].pageY + G.touches[1].pageY) / 2)), y.copy(I)
            }
            h = k.NONE;
            b.dispatchEvent(R)
        }
    }, !1);
    this.domElement.addEventListener("touchmove",
        function(G) {
            if (!1 !== b.enabled) switch (G.preventDefault(), G.stopPropagation(), G.touches.length) {
                case 1:
                    q.copy(M(G.touches[0].pageX, G.touches[0].pageY));
                    break;
                case 2:
                    var H = G.touches[0].pageX - G.touches[1].pageX,
                        S = G.touches[0].pageY - G.touches[1].pageY;
                    x = Math.sqrt(H * H + S * S);
                    I.copy(T((G.touches[0].pageX + G.touches[1].pageX) / 2, (G.touches[0].pageY + G.touches[1].pageY) / 2));
                    break;
                default:
                    h = k.NONE
            }
        }, !1);
    window.addEventListener("keydown", e, !1);
    window.addEventListener("keyup", function(G) {
        !1 !== b.enabled && (h = l, window.addEventListener("keydown",
            e, !1))
    }, !1);
    this.handleResize();
    this.update()
};
THREE.TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);
var dat = dat || {};
dat.gui = dat.gui || {};
dat.utils = dat.utils || {};
dat.controllers = dat.controllers || {};
dat.dom = dat.dom || {};
dat.color = dat.color || {};
dat.utils.css = function() {
    return {
        load: function(f, d) {
            d = d || document;
            var e = d.createElement("link");
            e.type = "text/css";
            e.rel = "stylesheet";
            e.href = f;
            d.getElementsByTagName("head")[0].appendChild(e)
        },
        inject: function(f, d) {
            d = d || document;
            var e = document.createElement("style");
            e.type = "text/css";
            e.innerHTML = f;
            d.getElementsByTagName("head")[0].appendChild(e)
        }
    }
}();
dat.utils.common = function() {
    var f = Array.prototype.forEach,
        d = Array.prototype.slice;
    return {
        BREAK: {},
        extend: function(e) {
            this.each(d.call(arguments, 1), function(m) {
                for (var a in m) this.isUndefined(m[a]) || (e[a] = m[a])
            }, this);
            return e
        },
        defaults: function(e) {
            this.each(d.call(arguments, 1), function(m) {
                for (var a in m) this.isUndefined(e[a]) && (e[a] = m[a])
            }, this);
            return e
        },
        compose: function() {
            var e = d.call(arguments);
            return function() {
                for (var m = d.call(arguments), a = e.length - 1; 0 <= a; a--) m = [e[a].apply(this, m)];
                return m[0]
            }
        },
        each: function(e, m, a) {
            if (f && e.forEach === f) e.forEach(m, a);
            else if (e.length === e.length + 0)
                for (var c = 0, b = e.length; c < b && !(c in e && m.call(a, e[c], c) === this.BREAK); c++);
            else
                for (c in e)
                    if (m.call(a, e[c], c) === this.BREAK) break
        },
        defer: function(e) {
            setTimeout(e, 0)
        },
        toArray: function(e) {
            return e.toArray ? e.toArray() : d.call(e)
        },
        isUndefined: function(e) {
            return void 0 === e
        },
        isNull: function(e) {
            return null === e
        },
        isNaN: function(e) {
            return e !== e
        },
        isArray: Array.isArray || function(e) {
            return e.constructor === Array
        },
        isObject: function(e) {
            return e ===
                Object(e)
        },
        isNumber: function(e) {
            return e === e + 0
        },
        isString: function(e) {
            return e === e + ""
        },
        isBoolean: function(e) {
            return !1 === e || !0 === e
        },
        isFunction: function(e) {
            return "[object Function]" === Object.prototype.toString.call(e)
        }
    }
}();
dat.controllers.Controller = function(f) {
    var d = function(e, m) {
        this.initialValue = e[m];
        this.domElement = document.createElement("div");
        this.object = e;
        this.property = m;
        this.__onFinishChange = this.__onChange = void 0
    };
    f.extend(d.prototype, {
        onChange: function(e) {
            this.__onChange = e;
            return this
        },
        onFinishChange: function(e) {
            this.__onFinishChange = e;
            return this
        },
        setValue: function(e) {
            this.object[this.property] = e;
            this.__onChange && this.__onChange.call(this, e);
            this.updateDisplay();
            return this
        },
        getValue: function() {
            return this.object[this.property]
        },
        updateDisplay: function() {
            return this
        },
        isModified: function() {
            return this.initialValue !== this.getValue()
        }
    });
    return d
}(dat.utils.common);
dat.dom.dom = function(f) {
    function d(c) {
        if ("0" === c || f.isUndefined(c)) return 0;
        c = c.match(m);
        return f.isNull(c) ? 0 : parseFloat(c[1])
    }
    var e = {};
    f.each({
        HTMLEvents: ["change"],
        MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
        KeyboardEvents: ["keydown"]
    }, function(c, b) {
        f.each(c, function(k) {
            e[k] = b
        })
    });
    var m = /(\d+(\.\d+)?)px/,
        a = {
            makeSelectable: function(c, b) {
                void 0 !== c && void 0 !== c.style && (c.onselectstart = b ? function() {
                        return !1
                    } : function() {}, c.style.MozUserSelect = b ? "auto" : "none", c.style.KhtmlUserSelect =
                    b ? "auto" : "none", c.unselectable = b ? "on" : "off")
            },
            makeFullscreen: function(c, b, k) {
                f.isUndefined(b) && (b = !0);
                f.isUndefined(k) && (k = !0);
                c.style.position = "absolute";
                b && (c.style.left = 0, c.style.right = 0);
                k && (c.style.top = 0, c.style.bottom = 0)
            },
            fakeEvent: function(c, b, k, g) {
                k = k || {};
                var h = e[b];
                if (!h) throw Error("Event type " + b + " not supported.");
                var l = document.createEvent(h);
                switch (h) {
                    case "MouseEvents":
                        l.initMouseEvent(b, k.bubbles || !1, k.cancelable || !0, window, k.clickCount || 1, 0, 0, k.x || k.clientX || 0, k.y || k.clientY || 0, !1,
                            !1, !1, !1, 0, null);
                        break;
                    case "KeyboardEvents":
                        h = l.initKeyboardEvent || l.initKeyEvent;
                        f.defaults(k, {
                            cancelable: !0,
                            ctrlKey: !1,
                            altKey: !1,
                            shiftKey: !1,
                            metaKey: !1,
                            keyCode: void 0,
                            charCode: void 0
                        });
                        h(b, k.bubbles || !1, k.cancelable, window, k.ctrlKey, k.altKey, k.shiftKey, k.metaKey, k.keyCode, k.charCode);
                        break;
                    default:
                        l.initEvent(b, k.bubbles || !1, k.cancelable || !0)
                }
                f.defaults(l, g);
                c.dispatchEvent(l)
            },
            bind: function(c, b, k, g) {
                c.addEventListener ? c.addEventListener(b, k, g || !1) : c.attachEvent && c.attachEvent("on" + b, k);
                return a
            },
            unbind: function(c, b, k, g) {
                c.removeEventListener ? c.removeEventListener(b, k, g || !1) : c.detachEvent && c.detachEvent("on" + b, k);
                return a
            },
            addClass: function(c, b) {
                if (void 0 === c.className) c.className = b;
                else if (c.className !== b) {
                    var k = c.className.split(/ +/); - 1 == k.indexOf(b) && (k.push(b), c.className = k.join(" ").replace(/^\s+/, "").replace(/\s+$/, ""))
                }
                return a
            },
            removeClass: function(c, b) {
                if (b) {
                    if (void 0 !== c.className)
                        if (c.className === b) c.removeAttribute("class");
                        else {
                            var k = c.className.split(/ +/),
                                g = k.indexOf(b); - 1 !=
                                g && (k.splice(g, 1), c.className = k.join(" "))
                        }
                } else c.className = void 0;
                return a
            },
            hasClass: function(c, b) {
                return (new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)")).test(c.className) || !1
            },
            getWidth: function(c) {
                c = getComputedStyle(c);
                return d(c["border-left-width"]) + d(c["border-right-width"]) + d(c["padding-left"]) + d(c["padding-right"]) + d(c.width)
            },
            getHeight: function(c) {
                c = getComputedStyle(c);
                return d(c["border-top-width"]) + d(c["border-bottom-width"]) + d(c["padding-top"]) + d(c["padding-bottom"]) + d(c.height)
            },
            getOffset: function(c) {
                var b = {
                    left: 0,
                    top: 0
                };
                if (c.offsetParent) {
                    do b.left += c.offsetLeft, b.top += c.offsetTop; while (c = c.offsetParent)
                }
                return b
            },
            isActive: function(c) {
                return c === document.activeElement && (c.type || c.href)
            }
        };
    return a
}(dat.utils.common);
dat.controllers.OptionController = function(f, d, e) {
    var m = function(a, c, b) {
        m.superclass.call(this, a, c);
        var k = this;
        this.__select = document.createElement("select");
        if (e.isArray(b)) {
            var g = {};
            e.each(b, function(h) {
                g[h] = h
            });
            b = g
        }
        e.each(b, function(h, l) {
            var p = document.createElement("option");
            p.innerHTML = l;
            p.setAttribute("value", h);
            k.__select.appendChild(p)
        });
        this.updateDisplay();
        d.bind(this.__select, "change", function() {
            k.setValue(this.options[this.selectedIndex].value)
        });
        this.domElement.appendChild(this.__select)
    };
    m.superclass = f;
    e.extend(m.prototype, f.prototype, {
        setValue: function(a) {
            a = m.superclass.prototype.setValue.call(this, a);
            this.__onFinishChange && this.__onFinishChange.call(this, this.getValue());
            return a
        },
        updateDisplay: function() {
            this.__select.value = this.getValue();
            return m.superclass.prototype.updateDisplay.call(this)
        }
    });
    return m
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.controllers.NumberController = function(f, d) {
    var e = function(m, a, c) {
        e.superclass.call(this, m, a);
        c = c || {};
        this.__min = c.min;
        this.__max = c.max;
        this.__step = c.step;
        d.isUndefined(this.__step) ? this.__impliedStep = 0 == this.initialValue ? 1 : Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10 : this.__impliedStep = this.__step;
        m = this.__impliedStep;
        m = m.toString();
        m = -1 < m.indexOf(".") ? m.length - m.indexOf(".") - 1 : 0;
        this.__precision = m
    };
    e.superclass = f;
    d.extend(e.prototype, f.prototype, {
        setValue: function(m) {
            void 0 !==
                this.__min && m < this.__min ? m = this.__min : void 0 !== this.__max && m > this.__max && (m = this.__max);
            void 0 !== this.__step && 0 != m % this.__step && (m = Math.round(m / this.__step) * this.__step);
            return e.superclass.prototype.setValue.call(this, m)
        },
        min: function(m) {
            this.__min = m;
            return this
        },
        max: function(m) {
            this.__max = m;
            return this
        },
        step: function(m) {
            this.__step = m;
            return this
        }
    });
    return e
}(dat.controllers.Controller, dat.utils.common);
dat.controllers.NumberControllerBox = function(f, d, e) {
    var m = function(a, c, b) {
        function k() {
            var n = parseFloat(l.__input.value);
            e.isNaN(n) || l.setValue(n)
        }

        function g(n) {
            var q = p - n.clientY;
            l.setValue(l.getValue() + q * l.__impliedStep);
            p = n.clientY
        }

        function h() {
            d.unbind(window, "mousemove", g);
            d.unbind(window, "mouseup", h)
        }
        this.__truncationSuspended = !1;
        m.superclass.call(this, a, c, b);
        var l = this,
            p;
        this.__input = document.createElement("input");
        this.__input.setAttribute("type", "text");
        d.bind(this.__input, "change", k);
        d.bind(this.__input,
            "blur",
            function() {
                k();
                l.__onFinishChange && l.__onFinishChange.call(l, l.getValue())
            });
        d.bind(this.__input, "mousedown", function(n) {
            d.bind(window, "mousemove", g);
            d.bind(window, "mouseup", h);
            p = n.clientY
        });
        d.bind(this.__input, "keydown", function(n) {
            13 === n.keyCode && (l.__truncationSuspended = !0, this.blur(), l.__truncationSuspended = !1)
        });
        this.updateDisplay();
        this.domElement.appendChild(this.__input)
    };
    m.superclass = f;
    e.extend(m.prototype, f.prototype, {
        updateDisplay: function() {
            var a = this.__input;
            if (this.__truncationSuspended) var c =
                this.getValue();
            else {
                c = this.getValue();
                var b = Math.pow(10, this.__precision);
                c = Math.round(c * b) / b
            }
            a.value = c;
            return m.superclass.prototype.updateDisplay.call(this)
        }
    });
    return m
}(dat.controllers.NumberController, dat.dom.dom, dat.utils.common);
dat.controllers.NumberControllerSlider = function(f, d, e, m, a) {
    var c = function(b, k, g, h, l) {
        function p(t) {
            t.preventDefault();
            var r = d.getOffset(q.__background),
                v = d.getWidth(q.__background),
                x = q,
                y = r.left,
                I = q.__min;
            x.setValue.call(x, I + (t.clientX - y) / (r.left + v - y) * (q.__max - I));
            return !1
        }

        function n() {
            d.unbind(window, "mousemove", p);
            d.unbind(window, "mouseup", n);
            q.__onFinishChange && q.__onFinishChange.call(q, q.getValue())
        }
        c.superclass.call(this, b, k, {
            min: g,
            max: h,
            step: l
        });
        var q = this;
        this.__background = document.createElement("div");
        this.__foreground = document.createElement("div");
        d.bind(this.__background, "mousedown", function(t) {
            d.bind(window, "mousemove", p);
            d.bind(window, "mouseup", n);
            p(t)
        });
        d.addClass(this.__background, "slider");
        d.addClass(this.__foreground, "slider-fg");
        this.updateDisplay();
        this.__background.appendChild(this.__foreground);
        this.domElement.appendChild(this.__background)
    };
    c.superclass = f;
    c.useDefaultStyles = function() {
        e.inject(a)
    };
    m.extend(c.prototype, f.prototype, {
        updateDisplay: function() {
            var b = (this.getValue() - this.__min) /
                (this.__max - this.__min);
            this.__foreground.style.width = 100 * b + "%";
            return c.superclass.prototype.updateDisplay.call(this)
        }
    });
    return c
}(dat.controllers.NumberController, dat.dom.dom, dat.utils.css, dat.utils.common, ".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");
dat.controllers.FunctionController = function(f, d, e) {
    var m = function(a, c, b) {
        m.superclass.call(this, a, c);
        var k = this;
        this.__button = document.createElement("div");
        this.__button.innerHTML = void 0 === b ? "Fire" : b;
        d.bind(this.__button, "click", function(g) {
            g.preventDefault();
            k.fire();
            return !1
        });
        d.addClass(this.__button, "button");
        this.domElement.appendChild(this.__button)
    };
    m.superclass = f;
    e.extend(m.prototype, f.prototype, {
        fire: function() {
            this.__onChange && this.__onChange.call(this);
            this.__onFinishChange && this.__onFinishChange.call(this,
                this.getValue());
            this.getValue().call(this.object)
        }
    });
    return m
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.controllers.BooleanController = function(f, d, e) {
    var m = function(a, c) {
        m.superclass.call(this, a, c);
        var b = this;
        this.__prev = this.getValue();
        this.__checkbox = document.createElement("input");
        this.__checkbox.setAttribute("type", "checkbox");
        d.bind(this.__checkbox, "change", function() {
            b.setValue(!b.__prev)
        }, !1);
        this.domElement.appendChild(this.__checkbox);
        this.updateDisplay()
    };
    m.superclass = f;
    e.extend(m.prototype, f.prototype, {
        setValue: function(a) {
            a = m.superclass.prototype.setValue.call(this, a);
            this.__onFinishChange &&
                this.__onFinishChange.call(this, this.getValue());
            this.__prev = this.getValue();
            return a
        },
        updateDisplay: function() {
            !0 === this.getValue() ? (this.__checkbox.setAttribute("checked", "checked"), this.__checkbox.checked = !0) : this.__checkbox.checked = !1;
            return m.superclass.prototype.updateDisplay.call(this)
        }
    });
    return m
}(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.color.toString = function(f) {
    return function(d) {
        if (1 == d.a || f.isUndefined(d.a)) {
            for (d = d.hex.toString(16); 6 > d.length;) d = "0" + d;
            return "#" + d
        }
        return "rgba(" + Math.round(d.r) + "," + Math.round(d.g) + "," + Math.round(d.b) + "," + d.a + ")"
    }
}(dat.utils.common);
dat.color.interpret = function(f, d) {
    var e, m, a = [{
        litmus: d.isString,
        conversions: {
            THREE_CHAR_HEX: {
                read: function(c) {
                    c = c.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                    return null === c ? !1 : {
                        space: "HEX",
                        hex: parseInt("0x" + c[1].toString() + c[1].toString() + c[2].toString() + c[2].toString() + c[3].toString() + c[3].toString())
                    }
                },
                write: f
            },
            SIX_CHAR_HEX: {
                read: function(c) {
                    c = c.match(/^#([A-F0-9]{6})$/i);
                    return null === c ? !1 : {
                        space: "HEX",
                        hex: parseInt("0x" + c[1].toString())
                    }
                },
                write: f
            },
            CSS_RGB: {
                read: function(c) {
                    c = c.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                    return null === c ? !1 : {
                        space: "RGB",
                        r: parseFloat(c[1]),
                        g: parseFloat(c[2]),
                        b: parseFloat(c[3])
                    }
                },
                write: f
            },
            CSS_RGBA: {
                read: function(c) {
                    c = c.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                    return null === c ? !1 : {
                        space: "RGB",
                        r: parseFloat(c[1]),
                        g: parseFloat(c[2]),
                        b: parseFloat(c[3]),
                        a: parseFloat(c[4])
                    }
                },
                write: f
            }
        }
    }, {
        litmus: d.isNumber,
        conversions: {
            HEX: {
                read: function(c) {
                    return {
                        space: "HEX",
                        hex: c,
                        conversionName: "HEX"
                    }
                },
                write: function(c) {
                    return c.hex
                }
            }
        }
    }, {
        litmus: d.isArray,
        conversions: {
            RGB_ARRAY: {
                read: function(c) {
                    return 3 !=
                        c.length ? !1 : {
                            space: "RGB",
                            r: c[0],
                            g: c[1],
                            b: c[2]
                        }
                },
                write: function(c) {
                    return [c.r, c.g, c.b]
                }
            },
            RGBA_ARRAY: {
                read: function(c) {
                    return 4 != c.length ? !1 : {
                        space: "RGB",
                        r: c[0],
                        g: c[1],
                        b: c[2],
                        a: c[3]
                    }
                },
                write: function(c) {
                    return [c.r, c.g, c.b, c.a]
                }
            }
        }
    }, {
        litmus: d.isObject,
        conversions: {
            RGBA_OBJ: {
                read: function(c) {
                    return d.isNumber(c.r) && d.isNumber(c.g) && d.isNumber(c.b) && d.isNumber(c.a) ? {
                        space: "RGB",
                        r: c.r,
                        g: c.g,
                        b: c.b,
                        a: c.a
                    } : !1
                },
                write: function(c) {
                    return {
                        r: c.r,
                        g: c.g,
                        b: c.b,
                        a: c.a
                    }
                }
            },
            RGB_OBJ: {
                read: function(c) {
                    return d.isNumber(c.r) &&
                        d.isNumber(c.g) && d.isNumber(c.b) ? {
                            space: "RGB",
                            r: c.r,
                            g: c.g,
                            b: c.b
                        } : !1
                },
                write: function(c) {
                    return {
                        r: c.r,
                        g: c.g,
                        b: c.b
                    }
                }
            },
            HSVA_OBJ: {
                read: function(c) {
                    return d.isNumber(c.h) && d.isNumber(c.s) && d.isNumber(c.v) && d.isNumber(c.a) ? {
                        space: "HSV",
                        h: c.h,
                        s: c.s,
                        v: c.v,
                        a: c.a
                    } : !1
                },
                write: function(c) {
                    return {
                        h: c.h,
                        s: c.s,
                        v: c.v,
                        a: c.a
                    }
                }
            },
            HSV_OBJ: {
                read: function(c) {
                    return d.isNumber(c.h) && d.isNumber(c.s) && d.isNumber(c.v) ? {
                        space: "HSV",
                        h: c.h,
                        s: c.s,
                        v: c.v
                    } : !1
                },
                write: function(c) {
                    return {
                        h: c.h,
                        s: c.s,
                        v: c.v
                    }
                }
            }
        }
    }];
    return function() {
        m = !1;
        var c = 1 < arguments.length ? d.toArray(arguments) : arguments[0];
        d.each(a, function(b) {
            if (b.litmus(c)) return d.each(b.conversions, function(k, g) {
                e = k.read(c);
                if (!1 === m && !1 !== e) return m = e, e.conversionName = g, e.conversion = k, d.BREAK
            }), d.BREAK
        });
        return m
    }
}(dat.color.toString, dat.utils.common);
dat.GUI = dat.gui.GUI = function(f, d, e, m, a, c, b, k, g, h, l, p, n, q, t) {
    function r(z, C, u, B) {
        if (void 0 === C[u]) throw Error("Object " + C + ' has no property "' + u + '"');
        B.color ? C = new l(C, u) : (C = [C, u].concat(B.factoryArgs), C = m.apply(z, C));
        B.before instanceof a && (B.before = B.before.__li);
        y(z, C);
        q.addClass(C.domElement, "c");
        u = document.createElement("span");
        q.addClass(u, "property-name");
        u.innerHTML = C.property;
        var w = document.createElement("div");
        w.appendChild(u);
        w.appendChild(C.domElement);
        B = v(z, w, B.before);
        q.addClass(B, K.CLASS_CONTROLLER_ROW);
        q.addClass(B, typeof C.getValue());
        x(z, B, C);
        z.__controllers.push(C);
        return C
    }

    function v(z, C, u) {
        var B = document.createElement("li");
        C && B.appendChild(C);
        u ? z.__ul.insertBefore(B, params.before) : z.__ul.appendChild(B);
        z.onResize();
        return B
    }

    function x(z, C, u) {
        u.__li = C;
        u.__gui = z;
        t.extend(u, {
            options: function(A) {
                if (1 < arguments.length) return u.remove(), r(z, u.object, u.property, {
                    before: u.__li.nextElementSibling,
                    factoryArgs: [t.toArray(arguments)]
                });
                if (t.isArray(A) || t.isObject(A)) return u.remove(), r(z, u.object, u.property, {
                    before: u.__li.nextElementSibling,
                    factoryArgs: [A]
                })
            },
            name: function(A) {
                u.__li.firstElementChild.firstElementChild.innerHTML = A;
                return u
            },
            listen: function() {
                u.__gui.listen(u);
                return u
            },
            remove: function() {
                u.__gui.remove(u);
                return u
            }
        });
        if (u instanceof g) {
            var B = new k(u.object, u.property, {
                min: u.__min,
                max: u.__max,
                step: u.__step
            });
            t.each(["updateDisplay", "onChange", "onFinishChange"], function(A) {
                var F = u[A],
                    D = B[A];
                u[A] = B[A] = function() {
                    var Q = Array.prototype.slice.call(arguments);
                    F.apply(u, Q);
                    return D.apply(B, Q)
                }
            });
            q.addClass(C, "has-slider");
            u.domElement.insertBefore(B.domElement, u.domElement.firstElementChild)
        } else if (u instanceof k) {
            var w = function(A) {
                return t.isNumber(u.__min) && t.isNumber(u.__max) ? (u.remove(), r(z, u.object, u.property, {
                    before: u.__li.nextElementSibling,
                    factoryArgs: [u.__min, u.__max, u.__step]
                })) : A
            };
            u.min = t.compose(w, u.min);
            u.max = t.compose(w, u.max)
        } else u instanceof c ? (q.bind(C, "click", function() {
                q.fakeEvent(u.__checkbox, "click")
            }), q.bind(u.__checkbox, "click", function(A) {
                A.stopPropagation()
            })) :
            u instanceof b ? (q.bind(C, "click", function() {
                q.fakeEvent(u.__button, "click")
            }), q.bind(C, "mouseover", function() {
                q.addClass(u.__button, "hover")
            }), q.bind(C, "mouseout", function() {
                q.removeClass(u.__button, "hover")
            })) : u instanceof l && (q.addClass(C, "color"), u.updateDisplay = t.compose(function(A) {
                C.style.borderLeftColor = u.__color.toString();
                return A
            }, u.updateDisplay), u.updateDisplay());
        u.setValue = t.compose(function(A) {
            z.getRoot().__preset_select && u.isModified() && M(z.getRoot(), !0);
            return A
        }, u.setValue)
    }

    function y(z,
        C) {
        var u = z.getRoot(),
            B = u.__rememberedObjects.indexOf(C.object);
        if (-1 != B) {
            var w = u.__rememberedObjectIndecesToControllers[B];
            void 0 === w && (w = {}, u.__rememberedObjectIndecesToControllers[B] = w);
            w[C.property] = C;
            if (u.load && u.load.remembered) {
                u = u.load.remembered;
                if (u[z.preset]) u = u[z.preset];
                else if (u.Default) u = u.Default;
                else return;
                u[B] && void 0 !== u[B][C.property] && (B = u[B][C.property], C.initialValue = B, C.setValue(B))
            }
        }
    }

    function I(z) {
        var C = z.__save_row = document.createElement("li");
        q.addClass(z.domElement, "has-save");
        z.__ul.insertBefore(C, z.__ul.firstChild);
        q.addClass(C, "save-row");
        var u = document.createElement("span");
        u.innerHTML = "&nbsp;";
        q.addClass(u, "button gears");
        var B = document.createElement("span");
        B.innerHTML = "Save";
        q.addClass(B, "button");
        q.addClass(B, "save");
        var w = document.createElement("span");
        w.innerHTML = "New";
        q.addClass(w, "button");
        q.addClass(w, "save-as");
        var A = document.createElement("span");
        A.innerHTML = "Revert";
        q.addClass(A, "button");
        q.addClass(A, "revert");
        var F = z.__preset_select = document.createElement("select");
        z.load && z.load.remembered ? t.each(z.load.remembered, function(P, Z) {
            T(z, Z, Z == z.preset)
        }) : T(z, "Default", !1);
        q.bind(F, "change", function() {
            for (var P = 0; P < z.__preset_select.length; P++) z.__preset_select[P].innerHTML = z.__preset_select[P].value;
            z.preset = this.value
        });
        C.appendChild(F);
        C.appendChild(u);
        C.appendChild(B);
        C.appendChild(w);
        C.appendChild(A);
        if (H) {
            var D = function() {
                Q.style.display = z.useLocalStorage ? "block" : "none"
            };
            C = document.getElementById("dg-save-locally");
            var Q = document.getElementById("dg-local-explain");
            C.style.display = "block";
            C = document.getElementById("dg-local-storage");
            "true" === localStorage.getItem(document.location.href + ".isLocal") && C.setAttribute("checked", "checked");
            D();
            q.bind(C, "change", function() {
                z.useLocalStorage = !z.useLocalStorage;
                D()
            })
        }
        var X = document.getElementById("dg-new-constructor");
        q.bind(X, "keydown", function(P) {
            !P.metaKey || 67 !== P.which && 67 != P.keyCode || S.hide()
        });
        q.bind(u, "click", function() {
            X.innerHTML = JSON.stringify(z.getSaveObject(), void 0, 2);
            S.show();
            X.focus();
            X.select()
        });
        q.bind(B,
            "click",
            function() {
                z.save()
            });
        q.bind(w, "click", function() {
            var P = prompt("Enter a new preset name.");
            P && z.saveAs(P)
        });
        q.bind(A, "click", function() {
            z.revert()
        })
    }

    function E(z) {
        function C(A) {
            A.preventDefault();
            w = A.clientX;
            q.addClass(z.__closeButton, K.CLASS_DRAG);
            q.bind(window, "mousemove", u);
            q.bind(window, "mouseup", B);
            return !1
        }

        function u(A) {
            A.preventDefault();
            z.width += w - A.clientX;
            z.onResize();
            w = A.clientX;
            return !1
        }

        function B() {
            q.removeClass(z.__closeButton, K.CLASS_DRAG);
            q.unbind(window, "mousemove", u);
            q.unbind(window,
                "mouseup", B)
        }
        z.__resize_handle = document.createElement("div");
        t.extend(z.__resize_handle.style, {
            width: "6px",
            marginLeft: "-3px",
            height: "200px",
            cursor: "ew-resize",
            position: "absolute"
        });
        var w;
        q.bind(z.__resize_handle, "mousedown", C);
        q.bind(z.__closeButton, "mousedown", C);
        z.domElement.insertBefore(z.__resize_handle, z.domElement.firstElementChild)
    }

    function N(z, C) {
        z.domElement.style.width = C + "px";
        z.__save_row && z.autoPlace && (z.__save_row.style.width = C + "px");
        z.__closeButton && (z.__closeButton.style.width = C + "px")
    }

    function R(z, C) {
        var u = {};
        t.each(z.__rememberedObjects, function(B, w) {
            var A = {};
            t.each(z.__rememberedObjectIndecesToControllers[w], function(F, D) {
                A[D] = C ? F.initialValue : F.getValue()
            });
            u[w] = A
        });
        return u
    }

    function T(z, C, u) {
        var B = document.createElement("option");
        B.innerHTML = C;
        B.value = C;
        z.__preset_select.appendChild(B);
        u && (z.__preset_select.selectedIndex = z.__preset_select.length - 1)
    }

    function M(z, C) {
        var u = z.__preset_select[z.__preset_select.selectedIndex];
        u.innerHTML = C ? u.value + "*" : u.value
    }

    function G(z) {
        0 != z.length &&
            p(function() {
                G(z)
            });
        t.each(z, function(C) {
            C.updateDisplay()
        })
    }
    f.inject(e);
    try {
        var H = "localStorage" in window && null !== window.localStorage
    } catch (z) {
        H = !1
    }
    var S, J = !0,
        ca, O = !1,
        Y = [],
        K = function(z) {
            function C() {
                localStorage.setItem(document.location.href + ".gui", JSON.stringify(B.getSaveObject()))
            }

            function u() {
                var D = B.getRoot();
                D.width += 1;
                t.defer(function() {
                    --D.width
                })
            }
            var B = this;
            this.domElement = document.createElement("div");
            this.__ul = document.createElement("ul");
            this.domElement.appendChild(this.__ul);
            q.addClass(this.domElement,
                "dg");
            this.__folders = {};
            this.__controllers = [];
            this.__rememberedObjects = [];
            this.__rememberedObjectIndecesToControllers = [];
            this.__listening = [];
            z = z || {};
            z = t.defaults(z, {
                autoPlace: !0,
                width: K.DEFAULT_WIDTH
            });
            z = t.defaults(z, {
                resizable: z.autoPlace,
                hideable: z.autoPlace
            });
            t.isUndefined(z.load) ? z.load = {
                preset: "Default"
            } : z.preset && (z.load.preset = z.preset);
            t.isUndefined(z.parent) && z.hideable && Y.push(this);
            z.resizable = t.isUndefined(z.parent) && z.resizable;
            z.autoPlace && t.isUndefined(z.scrollable) && (z.scrollable = !0);
            var w = H && "true" === localStorage.getItem(document.location.href + ".isLocal");
            Object.defineProperties(this, {
                parent: {
                    get: function() {
                        return z.parent
                    }
                },
                scrollable: {
                    get: function() {
                        return z.scrollable
                    }
                },
                autoPlace: {
                    get: function() {
                        return z.autoPlace
                    }
                },
                preset: {
                    get: function() {
                        return B.parent ? B.getRoot().preset : z.load.preset
                    },
                    set: function(D) {
                        B.parent ? B.getRoot().preset = D : z.load.preset = D;
                        for (D = 0; D < this.__preset_select.length; D++) this.__preset_select[D].value == this.preset && (this.__preset_select.selectedIndex =
                            D);
                        B.revert()
                    }
                },
                width: {
                    get: function() {
                        return z.width
                    },
                    set: function(D) {
                        z.width = D;
                        N(B, D)
                    }
                },
                name: {
                    get: function() {
                        return z.name
                    },
                    set: function(D) {
                        z.name = D;
                        F && (F.innerHTML = z.name)
                    }
                },
                closed: {
                    get: function() {
                        return z.closed
                    },
                    set: function(D) {
                        z.closed = D;
                        z.closed ? q.addClass(B.__ul, K.CLASS_CLOSED) : q.removeClass(B.__ul, K.CLASS_CLOSED);
                        this.onResize();
                        B.__closeButton && (B.__closeButton.innerHTML = D ? K.TEXT_OPEN : K.TEXT_CLOSED)
                    }
                },
                load: {
                    get: function() {
                        return z.load
                    }
                },
                useLocalStorage: {
                    get: function() {
                        return w
                    },
                    set: function(D) {
                        H &&
                            ((w = D) ? q.bind(window, "unload", C) : q.unbind(window, "unload", C), localStorage.setItem(document.location.href + ".isLocal", D))
                    }
                }
            });
            if (t.isUndefined(z.parent)) {
                z.closed = !1;
                q.addClass(this.domElement, K.CLASS_MAIN);
                q.makeSelectable(this.domElement, !1);
                if (H && w) {
                    B.useLocalStorage = !0;
                    var A = localStorage.getItem(document.location.href + ".gui");
                    A && (z.load = JSON.parse(A))
                }
                this.__closeButton = document.createElement("div");
                this.__closeButton.innerHTML = K.TEXT_CLOSED;
                q.addClass(this.__closeButton, K.CLASS_CLOSE_BUTTON);
                this.domElement.appendChild(this.__closeButton);
                q.bind(this.__closeButton, "click", function() {
                    B.closed = !B.closed
                })
            } else {
                void 0 === z.closed && (z.closed = !0);
                var F = document.createTextNode(z.name);
                q.addClass(F, "controller-name");
                A = v(B, F);
                q.addClass(this.__ul, K.CLASS_CLOSED);
                q.addClass(A, "title");
                q.bind(A, "click", function(D) {
                    D.preventDefault();
                    B.closed = !B.closed;
                    return !1
                });
                z.closed || (this.closed = !1)
            }
            z.autoPlace && (t.isUndefined(z.parent) && (J && (ca = document.createElement("div"), q.addClass(ca, "dg"), q.addClass(ca, K.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(ca),
                J = !1), ca.appendChild(this.domElement), q.addClass(this.domElement, K.CLASS_AUTO_PLACE)), this.parent || N(B, z.width));
            q.bind(window, "resize", function() {
                B.onResize()
            });
            q.bind(this.__ul, "webkitTransitionEnd", function() {
                B.onResize()
            });
            q.bind(this.__ul, "transitionend", function() {
                B.onResize()
            });
            q.bind(this.__ul, "oTransitionEnd", function() {
                B.onResize()
            });
            this.onResize();
            z.resizable && E(this);
            B.getRoot();
            z.parent || u()
        };
    K.toggleHide = function() {
        O = !O;
        t.each(Y, function(z) {
            z.domElement.style.zIndex = O ? -999 : 999;
            z.domElement.style.opacity =
                O ? 0 : 1
        })
    };
    K.CLASS_AUTO_PLACE = "a";
    K.CLASS_AUTO_PLACE_CONTAINER = "ac";
    K.CLASS_MAIN = "main";
    K.CLASS_CONTROLLER_ROW = "cr";
    K.CLASS_TOO_TALL = "taller-than-window";
    K.CLASS_CLOSED = "closed";
    K.CLASS_CLOSE_BUTTON = "close-button";
    K.CLASS_DRAG = "drag";
    K.DEFAULT_WIDTH = 245;
    K.TEXT_CLOSED = "Close Controls";
    K.TEXT_OPEN = "Open Controls";
    q.bind(window, "keydown", function(z) {
        "text" === document.activeElement.type || 72 !== z.which && 72 != z.keyCode || K.toggleHide()
    }, !1);
    t.extend(K.prototype, {
        add: function(z, C) {
            return r(this, z, C, {
                factoryArgs: Array.prototype.slice.call(arguments,
                    2)
            })
        },
        addColor: function(z, C) {
            return r(this, z, C, {
                color: !0
            })
        },
        remove: function(z) {
            this.__ul.removeChild(z.__li);
            this.__controllers.slice(this.__controllers.indexOf(z), 1);
            var C = this;
            t.defer(function() {
                C.onResize()
            })
        },
        destroy: function() {
            this.autoPlace && ca.removeChild(this.domElement)
        },
        addFolder: function(z) {
            if (void 0 !== this.__folders[z]) throw Error('You already have a folder in this GUI by the name "' + z + '"');
            var C = {
                name: z,
                parent: this
            };
            C.autoPlace = this.autoPlace;
            this.load && this.load.folders && this.load.folders[z] &&
                (C.closed = this.load.folders[z].closed, C.load = this.load.folders[z]);
            C = new K(C);
            this.__folders[z] = C;
            z = v(this, C.domElement);
            q.addClass(z, "folder");
            return C
        },
        open: function() {
            this.closed = !1
        },
        close: function() {
            this.closed = !0
        },
        onResize: function() {
            var z = this.getRoot();
            if (z.scrollable) {
                var C = q.getOffset(z.__ul).top,
                    u = 0;
                t.each(z.__ul.childNodes, function(B) {
                    z.autoPlace && B === z.__save_row || (u += q.getHeight(B))
                });
                window.innerHeight - C - 20 < u ? (q.addClass(z.domElement, K.CLASS_TOO_TALL), z.__ul.style.height = window.innerHeight -
                    C - 20 + "px") : (q.removeClass(z.domElement, K.CLASS_TOO_TALL), z.__ul.style.height = "auto")
            }
            z.__resize_handle && t.defer(function() {
                z.__resize_handle.style.height = z.__ul.offsetHeight + "px"
            });
            z.__closeButton && (z.__closeButton.style.width = z.width + "px")
        },
        remember: function() {
            t.isUndefined(S) && (S = new n, S.domElement.innerHTML = d);
            if (this.parent) throw Error("You can only call remember on a top level GUI.");
            var z = this;
            t.each(Array.prototype.slice.call(arguments), function(C) {
                0 == z.__rememberedObjects.length && I(z); - 1 ==
                    z.__rememberedObjects.indexOf(C) && z.__rememberedObjects.push(C)
            });
            this.autoPlace && N(this, this.width)
        },
        getRoot: function() {
            for (var z = this; z.parent;) z = z.parent;
            return z
        },
        getSaveObject: function() {
            var z = this.load;
            z.closed = this.closed;
            0 < this.__rememberedObjects.length && (z.preset = this.preset, z.remembered || (z.remembered = {}), z.remembered[this.preset] = R(this));
            z.folders = {};
            t.each(this.__folders, function(C, u) {
                z.folders[u] = C.getSaveObject()
            });
            return z
        },
        save: function() {
            this.load.remembered || (this.load.remembered = {});
            this.load.remembered[this.preset] = R(this);
            M(this, !1)
        },
        saveAs: function(z) {
            this.load.remembered || (this.load.remembered = {}, this.load.remembered.Default = R(this, !0));
            this.load.remembered[z] = R(this);
            this.preset = z;
            T(this, z, !0)
        },
        revert: function(z) {
            t.each(this.__controllers, function(C) {
                this.getRoot().load.remembered ? y(z || this.getRoot(), C) : C.setValue(C.initialValue)
            }, this);
            t.each(this.__folders, function(C) {
                C.revert(C)
            });
            z || M(this.getRoot(), !1)
        },
        listen: function(z) {
            var C = 0 == this.__listening.length;
            this.__listening.push(z);
            C && G(this.__listening)
        }
    });
    return K
}(dat.utils.css, '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>',
    ".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n",
    dat.controllers.factory = function(f, d, e, m, a, c, b) {
        return function(k, g, h, l) {
            var p = k[g];
            if (b.isArray(h) || b.isObject(h)) return new f(k, g, h);
            if (b.isNumber(p)) return b.isNumber(h) && b.isNumber(l) ? new e(k, g, h, l) : new d(k, g, {
                min: h,
                max: l
            });
            if (b.isString(p)) return new m(k, g);
            if (b.isFunction(p)) return new a(k, g, "");
            if (b.isBoolean(p)) return new c(k, g)
        }
    }(dat.controllers.OptionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.StringController = function(f, d, e) {
        var m =
            function(a, c) {
                function b() {
                    k.setValue(k.__input.value)
                }
                m.superclass.call(this, a, c);
                var k = this;
                this.__input = document.createElement("input");
                this.__input.setAttribute("type", "text");
                d.bind(this.__input, "keyup", b);
                d.bind(this.__input, "change", b);
                d.bind(this.__input, "blur", function() {
                    k.__onFinishChange && k.__onFinishChange.call(k, k.getValue())
                });
                d.bind(this.__input, "keydown", function(g) {
                    13 === g.keyCode && this.blur()
                });
                this.updateDisplay();
                this.domElement.appendChild(this.__input)
            };
        m.superclass = f;
        e.extend(m.prototype,
            f.prototype, {
                updateDisplay: function() {
                    d.isActive(this.__input) || (this.__input.value = this.getValue());
                    return m.superclass.prototype.updateDisplay.call(this)
                }
            });
        return m
    }(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.FunctionController, dat.controllers.BooleanController, dat.utils.common), dat.controllers.Controller, dat.controllers.BooleanController, dat.controllers.FunctionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.OptionController,
    dat.controllers.ColorController = function(f, d, e, m, a) {
        function c(h, l, p, n) {
            h.style.background = "";
            a.each(g, function(q) {
                h.style.cssText += "background: " + q + "linear-gradient(" + l + ", " + p + " 0%, " + n + " 100%); "
            })
        }

        function b(h) {
            h.style.background = "";
            h.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);";
            h.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
            h.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
            h.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
            h.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"
        }
        var k = function(h, l) {
            function p(I) {
                r(I);
                d.bind(window, "mousemove", r);
                d.bind(window,
                    "mouseup", n)
            }

            function n() {
                d.unbind(window, "mousemove", r);
                d.unbind(window, "mouseup", n)
            }

            function q() {
                var I = m(this.value);
                !1 !== I ? (x.__color.__state = I, x.setValue(x.__color.toOriginal())) : this.value = x.__color.toString()
            }

            function t() {
                d.unbind(window, "mousemove", v);
                d.unbind(window, "mouseup", t)
            }

            function r(I) {
                I.preventDefault();
                var E = d.getWidth(x.__saturation_field),
                    N = d.getOffset(x.__saturation_field),
                    R = (I.clientX - N.left + document.body.scrollLeft) / E;
                I = 1 - (I.clientY - N.top + document.body.scrollTop) / E;
                1 < I ? I = 1 : 0 >
                    I && (I = 0);
                1 < R ? R = 1 : 0 > R && (R = 0);
                x.__color.v = I;
                x.__color.s = R;
                x.setValue(x.__color.toOriginal());
                return !1
            }

            function v(I) {
                I.preventDefault();
                var E = d.getHeight(x.__hue_field),
                    N = d.getOffset(x.__hue_field);
                I = 1 - (I.clientY - N.top + document.body.scrollTop) / E;
                1 < I ? I = 1 : 0 > I && (I = 0);
                x.__color.h = 360 * I;
                x.setValue(x.__color.toOriginal());
                return !1
            }
            k.superclass.call(this, h, l);
            this.__color = new e(this.getValue());
            this.__temp = new e(0);
            var x = this;
            this.domElement = document.createElement("div");
            d.makeSelectable(this.domElement, !1);
            this.__selector = document.createElement("div");
            this.__selector.className = "selector";
            this.__saturation_field = document.createElement("div");
            this.__saturation_field.className = "saturation-field";
            this.__field_knob = document.createElement("div");
            this.__field_knob.className = "field-knob";
            this.__field_knob_border = "2px solid ";
            this.__hue_knob = document.createElement("div");
            this.__hue_knob.className = "hue-knob";
            this.__hue_field = document.createElement("div");
            this.__hue_field.className = "hue-field";
            this.__input = document.createElement("input");
            this.__input.type = "text";
            this.__input_textShadow = "0 1px 1px ";
            d.bind(this.__input, "keydown", function(I) {
                13 === I.keyCode && q.call(this)
            });
            d.bind(this.__input, "blur", q);
            d.bind(this.__selector, "mousedown", function(I) {
                d.addClass(this, "drag").bind(window, "mouseup", function(E) {
                    d.removeClass(x.__selector, "drag")
                })
            });
            var y = document.createElement("div");
            a.extend(this.__selector.style, {
                width: "122px",
                height: "102px",
                padding: "3px",
                backgroundColor: "#222",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
            });
            a.extend(this.__field_knob.style, {
                position: "absolute",
                width: "12px",
                height: "12px",
                border: this.__field_knob_border + (.5 > this.__color.v ? "#fff" : "#000"),
                boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
                borderRadius: "12px",
                zIndex: 1
            });
            a.extend(this.__hue_knob.style, {
                position: "absolute",
                width: "15px",
                height: "2px",
                borderRight: "4px solid #fff",
                zIndex: 1
            });
            a.extend(this.__saturation_field.style, {
                width: "100px",
                height: "100px",
                border: "1px solid #555",
                marginRight: "3px",
                display: "inline-block",
                cursor: "pointer"
            });
            a.extend(y.style, {
                width: "100%",
                height: "100%",
                background: "none"
            });
            c(y, "top", "rgba(0,0,0,0)", "#000");
            a.extend(this.__hue_field.style, {
                width: "15px",
                height: "100px",
                display: "inline-block",
                border: "1px solid #555",
                cursor: "ns-resize"
            });
            b(this.__hue_field);
            a.extend(this.__input.style, {
                outline: "none",
                textAlign: "center",
                color: "#fff",
                border: 0,
                fontWeight: "bold",
                textShadow: this.__input_textShadow + "rgba(0,0,0,0.7)"
            });
            d.bind(this.__saturation_field, "mousedown", p);
            d.bind(this.__field_knob, "mousedown", p);
            d.bind(this.__hue_field, "mousedown", function(I) {
                v(I);
                d.bind(window,
                    "mousemove", v);
                d.bind(window, "mouseup", t)
            });
            this.__saturation_field.appendChild(y);
            this.__selector.appendChild(this.__field_knob);
            this.__selector.appendChild(this.__saturation_field);
            this.__selector.appendChild(this.__hue_field);
            this.__hue_field.appendChild(this.__hue_knob);
            this.domElement.appendChild(this.__input);
            this.domElement.appendChild(this.__selector);
            this.updateDisplay()
        };
        k.superclass = f;
        a.extend(k.prototype, f.prototype, {
            updateDisplay: function() {
                var h = m(this.getValue());
                if (!1 !== h) {
                    var l = !1;
                    a.each(e.COMPONENTS, function(q) {
                        if (!a.isUndefined(h[q]) && !a.isUndefined(this.__color.__state[q]) && h[q] !== this.__color.__state[q]) return l = !0, {}
                    }, this);
                    l && a.extend(this.__color.__state, h)
                }
                a.extend(this.__temp.__state, this.__color.__state);
                this.__temp.a = 1;
                var p = .5 > this.__color.v || .5 < this.__color.s ? 255 : 0,
                    n = 255 - p;
                a.extend(this.__field_knob.style, {
                    marginLeft: 100 * this.__color.s - 7 + "px",
                    marginTop: 100 * (1 - this.__color.v) - 7 + "px",
                    backgroundColor: this.__temp.toString(),
                    border: this.__field_knob_border + "rgb(" + p +
                        "," + p + "," + p + ")"
                });
                this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px";
                this.__temp.s = 1;
                this.__temp.v = 1;
                c(this.__saturation_field, "left", "#fff", this.__temp.toString());
                a.extend(this.__input.style, {
                    backgroundColor: this.__input.value = this.__color.toString(),
                    color: "rgb(" + p + "," + p + "," + p + ")",
                    textShadow: this.__input_textShadow + "rgba(" + n + "," + n + "," + n + ",.7)"
                })
            }
        });
        var g = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
        return k
    }(dat.controllers.Controller, dat.dom.dom, dat.color.Color = function(f, d, e, m) {
        function a(h,
            l, p) {
            Object.defineProperty(h, l, {
                get: function() {
                    if ("RGB" === this.__state.space) return this.__state[l];
                    b(this, l, p);
                    return this.__state[l]
                },
                set: function(n) {
                    "RGB" !== this.__state.space && (b(this, l, p), this.__state.space = "RGB");
                    this.__state[l] = n
                }
            })
        }

        function c(h, l) {
            Object.defineProperty(h, l, {
                get: function() {
                    if ("HSV" === this.__state.space) return this.__state[l];
                    k(this);
                    return this.__state[l]
                },
                set: function(p) {
                    "HSV" !== this.__state.space && (k(this), this.__state.space = "HSV");
                    this.__state[l] = p
                }
            })
        }

        function b(h, l, p) {
            if ("HEX" ===
                h.__state.space) h.__state[l] = d.component_from_hex(h.__state.hex, p);
            else if ("HSV" === h.__state.space) m.extend(h.__state, d.hsv_to_rgb(h.__state.h, h.__state.s, h.__state.v));
            else throw "Corrupted color state";
        }

        function k(h) {
            var l = d.rgb_to_hsv(h.r, h.g, h.b);
            m.extend(h.__state, {
                s: l.s,
                v: l.v
            });
            m.isNaN(l.h) ? m.isUndefined(h.__state.h) && (h.__state.h = 0) : h.__state.h = l.h
        }
        var g = function() {
            this.__state = f.apply(this, arguments);
            if (!1 === this.__state) throw "Failed to interpret color arguments";
            this.__state.a = this.__state.a ||
                1
        };
        g.COMPONENTS = "r g b h s v hex a".split(" ");
        m.extend(g.prototype, {
            toString: function() {
                return e(this)
            },
            toOriginal: function() {
                return this.__state.conversion.write(this)
            }
        });
        a(g.prototype, "r", 2);
        a(g.prototype, "g", 1);
        a(g.prototype, "b", 0);
        c(g.prototype, "h");
        c(g.prototype, "s");
        c(g.prototype, "v");
        Object.defineProperty(g.prototype, "a", {
            get: function() {
                return this.__state.a
            },
            set: function(h) {
                this.__state.a = h
            }
        });
        Object.defineProperty(g.prototype, "hex", {
            get: function() {
                this.__state.hex = d.rgb_to_hex(this.r, this.g,
                    this.b);
                return this.__state.hex
            },
            set: function(h) {
                this.__state.space = "HEX";
                this.__state.hex = h
            }
        });
        return g
    }(dat.color.interpret, dat.color.math = function() {
        var f;
        return {
            hsv_to_rgb: function(d, e, m) {
                var a = d / 60 - Math.floor(d / 60),
                    c = m * (1 - e),
                    b = m * (1 - a * e);
                e = m * (1 - (1 - a) * e);
                d = [
                    [m, e, c],
                    [b, m, c],
                    [c, m, e],
                    [c, b, m],
                    [e, c, m],
                    [m, c, b]
                ][Math.floor(d / 60) % 6];
                return {
                    r: 255 * d[0],
                    g: 255 * d[1],
                    b: 255 * d[2]
                }
            },
            rgb_to_hsv: function(d, e, m) {
                var a = Math.max(d, e, m),
                    c = a - Math.min(d, e, m);
                if (0 == a) return {
                    h: NaN,
                    s: 0,
                    v: 0
                };
                d = (d == a ? (e - m) / c : e == a ? 2 + (m - d) / c :
                    4 + (d - e) / c) / 6;
                0 > d && (d += 1);
                return {
                    h: 360 * d,
                    s: c / a,
                    v: a / 255
                }
            },
            rgb_to_hex: function(d, e, m) {
                d = this.hex_with_component(0, 2, d);
                d = this.hex_with_component(d, 1, e);
                return d = this.hex_with_component(d, 0, m)
            },
            component_from_hex: function(d, e) {
                return d >> 8 * e & 255
            },
            hex_with_component: function(d, e, m) {
                return m << (f = 8 * e) | d & ~(255 << f)
            }
        }
    }(), dat.color.toString, dat.utils.common), dat.color.interpret, dat.utils.common), dat.utils.requestAnimationFrame = function() {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(f, d) {
                window.setTimeout(f, 1E3 / 60)
            }
    }(), dat.dom.CenteredDiv = function(f, d) {
        var e = function() {
            this.backgroundElement = document.createElement("div");
            d.extend(this.backgroundElement.style, {
                backgroundColor: "rgba(0,0,0,0.8)",
                top: 0,
                left: 0,
                display: "none",
                zIndex: "1000",
                opacity: 0,
                WebkitTransition: "opacity 0.2s linear"
            });
            f.makeFullscreen(this.backgroundElement);
            this.backgroundElement.style.position = "fixed";
            this.domElement = document.createElement("div");
            d.extend(this.domElement.style, {
                position: "fixed",
                display: "none",
                zIndex: "1001",
                opacity: 0,
                WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear"
            });
            document.body.appendChild(this.backgroundElement);
            document.body.appendChild(this.domElement);
            var m = this;
            f.bind(this.backgroundElement, "click", function() {
                m.hide()
            })
        };
        e.prototype.show = function() {
            var m = this;
            this.backgroundElement.style.display = "block";
            this.domElement.style.display = "block";
            this.domElement.style.opacity = 0;
            this.domElement.style.webkitTransform =
                "scale(1.1)";
            this.layout();
            d.defer(function() {
                m.backgroundElement.style.opacity = 1;
                m.domElement.style.opacity = 1;
                m.domElement.style.webkitTransform = "scale(1)"
            })
        };
        e.prototype.hide = function() {
            var m = this,
                a = function() {
                    m.domElement.style.display = "none";
                    m.backgroundElement.style.display = "none";
                    f.unbind(m.domElement, "webkitTransitionEnd", a);
                    f.unbind(m.domElement, "transitionend", a);
                    f.unbind(m.domElement, "oTransitionEnd", a)
                };
            f.bind(this.domElement, "webkitTransitionEnd", a);
            f.bind(this.domElement, "transitionend",
                a);
            f.bind(this.domElement, "oTransitionEnd", a);
            this.backgroundElement.style.opacity = 0;
            this.domElement.style.opacity = 0;
            this.domElement.style.webkitTransform = "scale(1.1)"
        };
        e.prototype.layout = function() {
            this.domElement.style.left = window.innerWidth / 2 - f.getWidth(this.domElement) / 2 + "px";
            this.domElement.style.top = window.innerHeight / 2 - f.getHeight(this.domElement) / 2 + "px"
        };
        return e
    }(dat.dom.dom, dat.utils.common), dat.dom.dom, dat.utils.common);

function CWinPanel(f) {
    console.log("GANADOR!")
    var d, e, m, a, c, b, k, g, h, l, p;
    this._init = function(n) {
        g = new createjs.Container;
        g.alpha = 0;
        g.visible = !1;
        var q = new createjs.Shape;
        q.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        q.alpha = .5;
        g.addChild(q);
        d = createBitmap(n);
        d.x = CANVAS_WIDTH_HALF;
        d.y = CANVAS_HEIGHT_HALF;
        d.regX = .5 * n.width;
        d.regY = .5 * n.height;
        g.addChild(d);
        e = new CTLText(g, CANVAS_WIDTH / 2 - n.width / 2, CANVAS_HEIGHT_HALF - 180, n.width, 90, 80, "center", TEXT_COLOR_STROKE, FONT_GAME, 1.1, 50, 0, TEXT_GAMEOVER, !0, !0, !1,
            !1);
        e.setOutline(6);
        m = new CTLText(g, CANVAS_WIDTH / 2 - n.width / 2, CANVAS_HEIGHT_HALF - 180, n.width, 90, 80, "center", TEXT_COLOR, FONT_GAME, 1.1, 50, 0, TEXT_GAMEOVER, !0, !0, !1, !1);
        a = new CTLText(g, CANVAS_WIDTH / 2 - n.width / 2, CANVAS_HEIGHT_HALF - 70, n.width, 50, 50, "center", TEXT_COLOR_STROKE, FONT_GAME, 1.1, 50, 0, "", !0, !0, !1, !1);
        a.setOutline(5);
        c = new CTLText(g, CANVAS_WIDTH / 2 - n.width / 2, CANVAS_HEIGHT_HALF - 70, n.width, 50, 50, "center", TEXT_COLOR, FONT_GAME, 1.1, 50, 0, "", !0, !0, !1, !1);
        b = new CTLText(g, CANVAS_WIDTH / 2 - n.width / 2 + 120, CANVAS_HEIGHT_HALF -
            10, n.width - 240, 50, 50, "center", TEXT_COLOR_STROKE, FONT_GAME, 1.1, 0, 0, "", !0, !0, !1, !1);
        b.setOutline(5);
        k = new CTLText(g, CANVAS_WIDTH / 2 - n.width / 2 + 120, CANVAS_HEIGHT_HALF - 10, n.width - 240, 50, 50, "center", TEXT_COLOR, FONT_GAME, 1.1, 0, 0, "", !0, !0, !1, !1);
        n = s_oSpriteLibrary.getSprite("but_restart");
        l = new CGfxButton(.5 * CANVAS_WIDTH + 250, .5 * CANVAS_HEIGHT + 120, n, g);
        l.pulseAnimation();
        l.addEventListener(ON_MOUSE_DOWN, this._onRestart, this);
        n = s_oSpriteLibrary.getSprite("but_home");
        h = new CGfxButton(.5 * CANVAS_WIDTH - 250, .5 * CANVAS_HEIGHT +
            120, n, g);
        h.addEventListener(ON_MOUSE_DOWN, this._onExit, this);
        p = new createjs.Container;
        g.addChild(p);
        g.on("click", function() {});
        s_oStage.addChild(g)
    };
    this.unload = function() {
        g.removeAllEventListeners();
        s_oStage.removeChild(g);
        h && (h.unload(), h = null);
        l && (l.unload(), l = null)
    };
    this.show = function(n) {
        e.refreshText(TEXT_GAMEOVER);
        m.refreshText(TEXT_GAMEOVER);
        a.refreshText(TEXT_SCORE + ": " + n);
        c.refreshText(TEXT_SCORE + ": " + n);
        b.refreshText(TEXT_BEST_SCORE + ": " + s_iBestScore);
        k.refreshText(TEXT_BEST_SCORE + ": " +
            s_iBestScore);
        g.visible = !0;
        createjs.Tween.get(g).wait(MS_WAIT_SHOW_GAME_OVER_PANEL).to({
            alpha: 1
        }, 1250, createjs.Ease.cubicOut).call(function() {
            s_iAdsLevel === NUM_LEVEL_FOR_ADS ? ($(s_oMain).trigger("show_interlevel_ad"), s_iAdsLevel = 1) : s_iAdsLevel++
        });
        $(s_oMain).trigger("save_score", n);
        $(s_oMain).trigger("share_event", n)
    };
    this._onContinue = function() {
        var n = this;
        createjs.Tween.get(g, {
            override: !0
        }).to({
            alpha: 0
        }, 750, createjs.Ease.cubicOut).call(function() {
            n.unload()
        });
        _oButContinue.block(!0);
        h.block(!0);
        s_oGame.onContinue()
    };
    this._onRestart = function() {
        console.log("RESTARTED");
         gameConfig = {
                        area_goal: [{id: 0, probability: 5}, {id: 1, probability: 4}, {id: 2, probability: 3},
                            {id: 3, probability: 4}, {id: 4, probability: 5}, {id: 5, probability: 4},
                            {id: 6, probability: 3}, {id: 7, probability: 3}, {id: 8, probability: 3},
                            {id: 9, probability: 2}, {id: 10, probability: 4}, {id: 11, probability: 2},
                            {id: 12, probability: 2}, {id: 13, probability: 2}, {id: 14, probability: 4}], 
                        num_of_penalty: 5,
                        multiplier_step: 0.1,
                        audio_enable_on_startup: false,
                        fullscreen: false,
                        check_orientation: true,
                        num_levels_for_ads: 2
                    };
                    localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
                    localStorage.setItem('gamesPlayed', JSON.stringify({times:1}));
        l.block(!0);
        this.unload();
        location.reload();
        s_oGame.restartGame()
    };
    this._onExit = function() {
        this.unload();
        s_oGame.onExit()
    };
    this._init(f);
    return this
}

function CAreYouSurePanel(f) {
    var d, e, m, a, c;
    this._init = function() {
        a = new createjs.Container;
        a.alpha = 0;
        b.addChild(a);
        c = new createjs.Shape;
        c.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        c.alpha = .5;
        c.on("click", function() {});
        a.addChild(c);
        var k = s_oSpriteLibrary.getSprite("msg_box");
        d = createBitmap(k);
        d.x = CANVAS_WIDTH_HALF;
        d.y = CANVAS_HEIGHT_HALF;
        d.regX = .5 * k.width;
        d.regY = .5 * k.height;
        a.addChild(d);
        new CTLText(a, CANVAS_WIDTH / 2 - k.width / 2, CANVAS_HEIGHT_HALF - 150, k.width, 200, 80, "center",
            "#ffffff", FONT_GAME, 1, 100, 30, TEXT_ARE_SURE, !0, !0, !0, !1);
        e = new CGfxButton(CANVAS_WIDTH / 2 + 250, .5 * CANVAS_HEIGHT + 120, s_oSpriteLibrary.getSprite("but_yes"), a);
        e.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        m = new CGfxButton(CANVAS_WIDTH / 2 - 250, .5 * CANVAS_HEIGHT + 120, s_oSpriteLibrary.getSprite("but_no"), a);
        m.addEventListener(ON_MOUSE_UP, this._onButNo, this)
    };
    this.show = function() {
        createjs.Tween.get(a).to({
            alpha: 1
        }, 150, createjs.Ease.quartOut).call(function() {
            s_oGame.pause(!0)
        })
    };
    this.unload = function() {
        createjs.Tween.get(a).to({
                alpha: 0
            },
            150, createjs.Ease.quartOut).call(function() {
            b.removeChild(a, c)
        })
    };
    this._onButYes = function() {
        createjs.Ticker.paused = !1;
        this.unload();
        s_oGame.onExit();
        c.removeAllEventListeners()
        console.log("RESTAREDDDD")
    };
    this._onButNo = function() {
        s_oGame.pause(!1);
        this.unload();
        a.visible = !1;
        c.removeAllEventListeners()
    };
    var b = f;
    this._init()
}

function CCreditsPanel() {
    var f, d, e, m, a, c, b, k;
    this._init = function() {
        k = new createjs.Container;
        s_oStage.addChild(k);
        e = new createjs.Shape;
        d = e.on("click", function() {});
        e.alpha = 0;
        e.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        k.addChild(e);
        m = new createjs.Container;
        m.visible = !1;
        k.addChild(m);
        var g = s_oSpriteLibrary.getSprite("msg_box");
        b = createBitmap(g);
        b.regX = g.width / 2;
        b.regY = g.height / 2;
        m.addChild(b);
        f = b.on("click", this._onLogoButRelease);
        m.x = CANVAS_WIDTH / 2;
        m.y = CANVAS_HEIGHT / 2;
        g =
            new createjs.Text(TEXT_DEVELOPED, " 40px " + FONT_GAME, "#fff");
        g.y = -70;
        g.textAlign = "center";
        g.textBaseline = "alphabetic";
        m.addChild(g);
        g = new createjs.Text("globant.com", " 36px " + FONT_GAME, "#fff");
        g.y = 170;
        g.textAlign = "center";
        g.textBaseline = "alphabetic";
        g.lineWidth = 300;
        m.addChild(g);
        g = s_oSpriteLibrary.getSprite("logo_ctl");
        c = createBitmap(g);
        c.regX = g.width / 2;
        c.regY = g.height / 2;
        m.addChild(c);
        g = s_oSpriteLibrary.getSprite("but_exit");
        a = new CGfxButton(270, -140, g, m);
        a.addEventListener(ON_MOUSE_UP, this.unload,
            this);
        e.alpha = 0;
        createjs.Tween.get(e).to({
            alpha: .7
        }, 500).call(function() {
            m.alpha = 0;
            m.visible = !0;
            createjs.Tween.get(m).to({
                alpha: 1
            }, 300)
        })
    };
    this.unload = function() {
        createjs.Tween.get(k).to({
            alpha: 0
        }, 500).call(function() {
            s_oStage.removeChild(k);
            a.unload()
        });
        e.off("click", d);
        b.off("click", f)
    };
    this._onLogoButRelease = function() {
        window.open("#", "_blank")
    };
    this._init()
}

function CPause() {
    var f, d;
    this._init = function() {
        f = new createjs.Container;
        f.alpha = 0;
        d = new createjs.Shape;
        d.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        d.alpha = .5;
        d.on("click", function() {});
        f.addChild(d);
        var e = new createjs.Text(TEXT_PAUSE, "70px " + FONT_GAME, TEXT_COLOR);
        e.x = .5 * CANVAS_WIDTH;
        e.y = .5 * CANVAS_HEIGHT - 100;
        e.textAlign = "center";
        f.addChild(e);
        e = new createjs.Text(TEXT_PAUSE, "70px " + FONT_GAME, TEXT_COLOR_STROKE);
        e.x = .5 * CANVAS_WIDTH;
        e.y = .5 * CANVAS_HEIGHT - 100;
        e.outline = OUTLINE_WIDTH;
        e.textAlign = "center";
        f.addChild(e);
        e = s_oSpriteLibrary.getSprite("but_continue");
        (new CGfxButton(.5 * CANVAS_WIDTH, .5 * CANVAS_HEIGHT + 70, e, f)).addEventListener(ON_MOUSE_UP, this._onLeavePause, this);
        s_oStage.addChild(f);
        var m = this;
        createjs.Tween.get(f).to({
            alpha: 1
        }, 150, createjs.Ease.quartOut).call(function() {
            m.onPause(!0)
        })
    };
    this.onPause = function(e) {
        s_oGame.pause(e)
    };
    this.unload = function() {
        d.off("click", function() {});
        s_oStage.removeChild(f)
    };
    this._onLeavePause = function() {
        playSound("click", 1, !1);
        createjs.Ticker.paused = !1;
        createjs.Tween.removeTweens(f);
        var e = this;
        createjs.Tween.get(f).to({
            alpha: 0
        }, 150, createjs.Ease.quartIn).call(function() {
            e.onPause(!1);
            s_oInterface.unloadPause()
        })
    };
    this._init();
    return this
}

function CGoalKeeper(f, d, e) {
    var m, a, c, b, k, g, h = 0,
        l = 0,
        p = IDLE;
    this._init = function(n, q, t) {
        k = t;
        m = n;
        a = q;
        c = new createjs.Container;
        c.x = m;
        c.y = a;
        k.addChild(c);
        c.tickChildren = !1;
        g = [];
        b = [];
        for (t = q = n = 0; t < NUM_SPRITE_GOALKEEPER.length; t++) {
            b[t] = new createjs.Container;
            b[t].regX = -OFFSET_CONTAINER_GOALKEEPER[t].x;
            b[t].regY = -OFFSET_CONTAINER_GOALKEEPER[t].y;
            g.push(this.loadAnim(SPRITE_NAME_GOALKEEPER[t], NUM_SPRITE_GOALKEEPER[t], b[t]));
            c.addChild(b[t]);
            var r = s_oSpriteLibrary.getSprite(SPRITE_NAME_GOALKEEPER[t] + 0);
            r.width >
                n && (n = r.width);
            r.height > q && (q = r.height)
        }
        c.cache(-n, -q, 2 * n, 2 * q);
        g[IDLE][0].visible = !0
    };
    this.getAnimType = function() {
        return p
    };
    this.getAnimArray = function() {
        return g[p]
    };
    this.loadAnim = function(n, q, t) {
        for (var r = [], v = 0; v < q; v++) r.push(createBitmap(s_oSpriteLibrary.getSprite(n + v))), r[v].visible = !1, t.addChild(r[v]);
        return r
    };
    this.getX = function() {
        return c.x
    };
    this.getY = function() {
        return c.y
    };
    this.disableAllAnim = function() {
        for (var n = 0; n < b.length; n++) b[n].visible = !1
    };
    this.setPosition = function(n, q) {
        c.x = n;
        c.y = q
    };
    this.setVisible = function(n) {
        c.visible = n
    };
    this.fadeAnimation = function(n) {
        createjs.Tween.get(c, {
            override: !0
        }).to({
            alpha: n
        }, 500)
    };
    this.setAlpha = function(n) {
        c.alpha = n
    };
    this.getObject = function() {
        return c
    };
    this.getFrame = function() {
        return l
    };
    this.viewFrame = function(n, q) {
        n[q].visible = !0
    };
    this.hideFrame = function(n, q) {
        n[q].visible = !1
    };
    this.getDepthPos = function() {
        return GOAL_KEEPER_DEPTH_Y
    };
    this.animGoalKeeper = function(n, q) {
        h += s_iTimeElaps;
        if (h > BUFFER_ANIM_PLAYER) {
            this.hideFrame(n, l);
            if (l + 1 < q) this.viewFrame(n,
                l + 1), l++;
            else return h = l = 0, this.viewFrame(n, l), !1;
            h = 0;
            c.updateCache()
        }
        return !0
    };
    this.resetAnimation = function(n) {
        this.resetAnimFrame(g[n], NUM_SPRITE_GOALKEEPER[n])
    };
    this.resetAnimFrame = function(n, q) {
        for (var t = 1; t < q; t++) n[t].visible = !1;
        n[0].visible = !0
    };
    this.setVisibleContainer = function(n, q) {
        b[n].visible = q
    };
    this.runAnim = function(n) {
        this.disableAllAnim();
        this.resetAnimation(n);
        this.setVisibleContainer(n, !0);
        p = n;
        l = 0
    };
    this.runAnimAndShift = function(n, q) {
        this.disableAllAnim();
        this.resetAnimation(n);
        this.setVisibleContainer(n,
            !0);
        p = n;
        l = 0;
        var t = ORIGIN_POINT_IMPACT_ANIMATION[n],
            r = q.x - t.x;
        null === t.x && (r = 0);
        var v = q.y - t.y;
        null === t.y && (v = 0);
        t = r;
        r = v;
        createjs.Tween.get(c).to({
            x: m + t,
            y: a + r
        }, 600).call(function() {
            console.log("iY " + v);
            createjs.Tween.get(c).to({
                x: m,
                y: a
            }, 300)
        })
    };
    this.update = function() {
        return this.animGoalKeeper(g[p], NUM_SPRITE_GOALKEEPER[p])
    };
    this._init(f, d, e);
    return this
}

function CStartBall(f, d, e) {
    var m;
    this._init = function() {
        var a = s_oSpriteLibrary.getSprite("start_ball");
        m = createBitmap(a);
        m.regX = .5 * a.width;
        m.regY = .5 * a.height;
        this.setPosition(f, d);
        e.addChild(m)
    };
    this.setPosition = function(a, c) {
        m.x = a;
        m.y = c
    };
    this.fadeAnim = function(a, c, b) {
        createjs.Tween.get(m, {
            override: !0
        }).wait(b).to({
            alpha: a
        }, c)
    };
    this.setAlpha = function(a) {
        m.alpha = a
    };
    this.setVisible = function(a) {
        m.visible = a
    };
    this._init();
    return this
}

function CVector2(f, d) {
    var e, m;
    this._init = function(a, c) {
        e = a;
        m = c
    };
    this.add = function(a, c) {
        e += a;
        m += c
    };
    this.addV = function(a) {
        e += a.getX();
        m += a.getY()
    };
    this.scalarDivision = function(a) {
        e /= a;
        m /= a
    };
    this.subtract = function(a) {
        e -= a.getX();
        m -= a.getY()
    };
    this.scalarProduct = function(a) {
        e *= a;
        m *= a
    };
    this.invert = function() {
        e *= -1;
        m *= -1
    };
    this.dotProduct = function(a) {
        return e * a.getX() + m * a.getY()
    };
    this.set = function(a, c) {
        e = a;
        m = c
    };
    this.setV = function(a) {
        e = a.getX();
        m = a.getY()
    };
    this.length = function() {
        return Math.sqrt(e * e + m * m)
    };
    this.length2 = function() {
        return e * e + m * m
    };
    this.normalize = function() {
        var a = this.length();
        0 < a && (e /= a, m /= a)
    };
    this.angleBetweenVectors = function(a) {
        a = Math.acos(this.dotProduct(a) / (this.length() * a.length()));
        return !0 === isNaN(a) ? 0 : a
    };
    this.getNormalize = function(a) {
        this.length();
        a.set(e, m);
        a.normalize()
    };
    this.rot90CCW = function() {
        var a = e;
        e = -m;
        m = a
    };
    this.rot90CW = function() {
        var a = e;
        e = m;
        m = -a
    };
    this.getRotCCW = function(a) {
        a.set(e, m);
        a.rot90CCW()
    };
    this.getRotCW = function(a) {
        a.set(e, m);
        a.rot90CW()
    };
    this.ceil = function() {
        e =
            Math.ceil(e);
        m = Math.ceil(m)
    };
    this.round = function() {
        e = Math.round(e);
        m = Math.round(m)
    };
    this.toString = function() {
        return "Vector2: " + e + ", " + m
    };
    this.print = function() {
        trace("Vector2: " + e + ", " + m)
    };
    this.getX = function() {
        return e
    };
    this.getY = function() {
        return m
    };
    this.rotate = function(a) {
        var c = e,
            b = m;
        e = c * Math.cos(a) - b * Math.sin(a);
        m = c * Math.sin(a) + b * Math.cos(a)
    };
    this._init(f, d)
}

function CPlayer(f, d, e) {
    var m, a = [],
        c, b = 0,
        k = 0;
    this._init = function(g, h) {
        m = {
            x: g,
            y: h
        };
        c = new createjs.Container;
        c.x = m.x;
        c.y = m.y;
        e.addChild(c);
        for (var l = 0; l < NUM_SPRITE_PLAYER; l++) a.push(createBitmap(s_oSpriteLibrary.getSprite("player_" + l))), a[l].visible = !1, c.addChild(a[l]);
        l = s_oSpriteLibrary.getSprite("player_0");
        c.cache(0, 0, l.width, l.height);
        a[0].visible = !0
    };
    this.setPosition = function(g, h) {
        c.x = g;
        c.y = h
    };
    this.getX = function() {
        return c.x
    };
    this.getY = function() {
        return c.y
    };
    this.getStartPos = function() {
        return m
    };
    this.setVisible = function(g) {
        c.visible = g
    };
    this.animFade = function(g) {
        var h = this;
        createjs.Tween.get(c).to({
            alpha: g
        }, 250).call(function() {
            0 === g && (c.visible = !1, h.hideCharacter(NUM_SPRITE_PLAYER - 1), h.viewCharacter(b))
        })
    };
    this.viewCharacter = function(g) {
        a[g].visible = !0
    };
    this.hideCharacter = function(g) {
        a[g].visible = !1
    };
    this.getFrame = function() {
        return b
    };
    this.animPlayer = function() {
        k += s_iTimeElaps;
        if (k > BUFFER_ANIM_PLAYER) {
            this.hideCharacter(b);
            if (b + 1 < NUM_SPRITE_PLAYER) this.viewCharacter(b + 1), b++;
            else return this.viewCharacter(b),
                k = b = 0, !1;
            c.updateCache();
            k = 0
        }
        return !0
    };
    this._init(f, d);
    return this
}

function CScoreBoard(f) {
    var d, e, m, a, c, b, k, g, h, l, p;
    this._init = function() {
        d = {
            x: CANVAS_WIDTH_HALF - 660,
            y: CANVAS_HEIGHT - 64
        };
        l = new createjs.Container;
        l.x = d.x;
        l.y = d.y;
        f.addChild(l);
        m = new createjs.Text(TEXT_SCORE, "50px " + FONT_GAME, TEXT_COLOR);
        m.textAlign = "left";
        l.addChild(m);
        a = new createjs.Text(TEXT_SCORE, "50px " + FONT_GAME, TEXT_COLOR_STROKE);
        a.textAlign = "left";
        a.outline = OUTLINE_WIDTH;
        l.addChild(a);
        c = new createjs.Text(999999, "50px " + FONT_GAME, TEXT_COLOR);
        c.textAlign = "left";
        c.x = 150;
        l.addChild(c);
        b = new createjs.Text(999999,
            "50px " + FONT_GAME, TEXT_COLOR_STROKE);
        b.textAlign = "left";
        b.x = c.x;
        b.outline = OUTLINE_WIDTH;
        l.addChild(b);
        p = new createjs.Container;
        p.x = 50;
        k = new createjs.Text("+5555 " + TEXT_MULTIPLIER + 1, "36px " + FONT_GAME, TEXT_COLOR);
        k.textAlign = "left";
        p.addChild(k);
        g = new createjs.Text("+5555 " + TEXT_MULTIPLIER + 1, "36px " + FONT_GAME, TEXT_COLOR_STROKE);
        g.textAlign = "left";
        g.outline = OUTLINE_WIDTH;
        p.addChild(g);
        p.y = e = -g.getBounds().height;
        p.visible = !1;
        l.addChild(p);
        h = new CRollingScore
    };
    this.getStartPosScore = function() {
        return d
    };
    this.setPosScore = function(n, q) {
        l.x = n;
        l.y = q
    };
    this.refreshTextScore = function(n) {
        console.log("aumenta");
        h.rolling(c, b, n)
    };
    this.effectAddScore = function(n, q) {
        p.visible = !0;
        k.text = "+" + n + " " + TEXT_MULTIPLIER + q;
        g.text = k.text;
        createjs.Tween.get(p).to({
            y: e - 50,
            alpha: 0
        }, MS_EFFECT_ADD, createjs.Ease.cubicOut).call(function() {
            p.visible = !1;
            p.alpha = 1;
            p.y = e
        })
    };
    this._init();
    return this
}
MS_ROLLING_SCORE = 750;

function CRollingScore() {
    var f = null,
        d = null;
    this.rolling = function(e, m, a) {
        f = createjs.Tween.get(e, {
            override: !0
        }).to({
            text: a
        }, MS_ROLLING_SCORE, createjs.Ease.cubicOut).addEventListener("change", function() {
            e.text = Math.floor(e.text)
        }).call(function() {
            createjs.Tween.removeTweens(f)
        });
        null !== m && (d = createjs.Tween.get(m, {
            override: !0
        }).to({
            text: a
        }, MS_ROLLING_SCORE, createjs.Ease.cubicOut).addEventListener("change", function() {
            m.text = Math.floor(m.text)
        }).call(function() {
            createjs.Tween.removeTweens(d)
        }))
    };
    return this
}

function CLaunchBoard(f) {
    var d, e, m, a, c, b;
    this._init = function() {
        d = {
            x: CANVAS_WIDTH_HALF + 660,
            y: CANVAS_HEIGHT - 60
        };
        c = new createjs.Container;
        c.x = d.x;
        c.y = d.y;
        f.addChild(c);
        e = new createjs.Text("99" + TEXT_OF + NUM_OF_PENALTY, "50px " + FONT_GAME, TEXT_COLOR);
        e.textAlign = "right";
        e.y = -4;
        c.addChild(e);
        c.y = d.y;
        f.addChild(c);
        m = new createjs.Text("99" + TEXT_OF + NUM_OF_PENALTY, "50px " + FONT_GAME, TEXT_COLOR_STROKE);
        m.textAlign = "right";
        m.y = e.y;
        m.outline = OUTLINE_WIDTH;
        c.addChild(m);
        var k = s_oSpriteLibrary.getSprite("shot_left");
        a = createBitmap(k);
        a.x = 1.4 * -e.getBounds().width;
        a.regX = .5 * k.width;
        a.regY = 10;
        c.addChild(a);
        b = c.getBounds();
        this.updateCache()
    };
    this.updateCache = function() {
        c.cache(-b.width, -b.height, 2 * b.width, 2 * b.height)
    };
    this.getStartPos = function() {
        return d
    };
    this.setPos = function(k, g) {
        c.x = k;
        c.y = g
    };
    this.refreshTextLaunch = function(k, g) {
        e.text = k + TEXT_OF + g;
        m.text = e.text;
        a.x = 1.4 * -e.getBounds().width;
        this.updateCache()
    };
    this._init();
    return this
}

function CHandSwipeAnim(f, d, e, m) {
    var a, c, b = !1;
    this._init = function(k) {
        c = new createjs.Container;
        a = createBitmap(k);
        a.x = f.x;
        a.y = f.y;
        a.regX = .5 * k.width;
        a.regY = .5 * k.height;
        a.alpha = 0;
        m.addChild(c);
        c.addChild(a)
    };
    this.animAllSwipe = function() {
        b = !0;
        createjs.Tween.get(a, {
            loop: -1
        }).to({
            x: d[0].x,
            y: d[0].y
        }, MS_TIME_SWIPE_END, createjs.Ease.quartOut).to({
            x: f.x,
            y: f.y
        }, 0).to({
            x: d[1].x,
            y: d[1].y
        }, MS_TIME_SWIPE_END, createjs.Ease.quartOut).to({
            x: f.x,
            y: f.y
        }, 0).to({
            x: d[2].x,
            y: d[2].y
        }, MS_TIME_SWIPE_END, createjs.Ease.quartOut).to({
            x: f.x,
            y: f.y
        }, 0);
        createjs.Tween.get(a).to({
            alpha: 1
        }, .1 * MS_TIME_SWIPE_END).wait(.3 * MS_TIME_SWIPE_END)
    };
    this.fadeAnim = function(k) {
        createjs.Tween.get(c, {
            override: !0
        }).to({
            alpha: k
        }, 250)
    };
    this.isAnimate = function() {
        return b
    };
    this.setVisible = function(k) {
        a.visible = k
    };
    this.removeTweens = function() {
        createjs.Tween.removeTweens(a);
        b = !1
    };
    this._init(e);
    return this
}

function CGoal(f, d, e, m) {
    var a;
    this._init = function(b, k, g) {
        a = createBitmap(g);
        this.setPosition(b, k);
        a.cache(0, 0, g.width, g.height);
        c.addChild(a)
    };
    this.unload = function() {
        c.removeChild(a)
    };
    this.setPosition = function(b, k) {
        a.x = b;
        a.y = k
    };
    this.getDepthPos = function() {
        return GOAL_SPRITE_SWAP_Y
    };
    this.getObject = function() {
        return a
    };
    var c = m;
    this._init(f, d, e);
    return this
}
CTLText.prototype = {
    constructor: CTLText,
    __autofit: function() {
        if (this._bFitText) {
            for (var f = this._iFontSize;
                (this._oText.getBounds().height > this._iHeight - 2 * this._iPaddingV || this._oText.getBounds().width > this._iWidth - 2 * this._iPaddingH) && !(f--, this._oText.font = f + "px " + this._szFont, this._oText.lineHeight = Math.round(f * this._fLineHeightFactor), this.__updateY(), this.__verticalAlign(), 8 > f););
            this._iFontSize = f
        }
    },
    __verticalAlign: function() {
        if (this._bVerticalAlign) {
            var f = this._oText.getBounds().height;
            this._oText.y -=
                (f - this._iHeight) / 2 + this._iPaddingV
        }
    },
    __updateY: function() {
        this._oText.y = this._y + this._iPaddingV;
        switch (this._oText.textBaseline) {
            case "middle":
                this._oText.y += this._oText.lineHeight / 2 + (this._iFontSize * this._fLineHeightFactor - this._iFontSize)
        }
    },
    __createText: function(f) {
        this._bDebug && (this._oDebugShape = new createjs.Shape, this._oDebugShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(this._x, this._y, this._iWidth, this._iHeight), this._oContainer.addChild(this._oDebugShape));
        this._oText = new createjs.Text(f,
            this._iFontSize + "px " + this._szFont, this._szColor);
        this._oText.textBaseline = "middle";
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this._oText.textAlign = this._szAlign;
        this._oText.lineWidth = this._bMultiline ? this._iWidth - 2 * this._iPaddingH : null;
        switch (this._szAlign) {
            case "center":
                this._oText.x = this._x + this._iWidth / 2;
                break;
            case "left":
                this._oText.x = this._x + this._iPaddingH;
                break;
            case "right":
                this._oText.x = this._x + this._iWidth - this._iPaddingH
        }
        this._oContainer.addChild(this._oText);
        this.refreshText(f)
    },
    setVerticalAlign: function(f) {
        this._bVerticalAlign = f
    },
    setOutline: function(f) {
        null !== this._oText && (this._oText.outline = f)
    },
    setShadow: function(f, d, e, m) {
        null !== this._oText && (this._oText.shadow = new createjs.Shadow(f, d, e, m))
    },
    setColor: function(f) {
        this._oText.color = f
    },
    setAlpha: function(f) {
        this._oText.alpha = f
    },
    removeTweens: function() {
        createjs.Tween.removeTweens(this._oText)
    },
    getText: function() {
        return this._oText
    },
    getY: function() {
        return this._y
    },
    getFontSize: function() {
        return this._iFontSize
    },
    refreshText: function(f) {
        "" === f && (f = " ");
        null === this._oText && this.__createText(f);
        this._oText.text = f;
        this._oText.font = this._iFontSize + "px " + this._szFont;
        this._oText.lineHeight = Math.round(this._iFontSize * this._fLineHeightFactor);
        this.__autofit();
        this.__updateY();
        this.__verticalAlign()
    }
};

function CTLText(f, d, e, m, a, c, b, k, g, h, l, p, n, q, t, r, v) {
    this._oContainer = f;
    this._x = d;
    this._y = e;
    this._iWidth = m;
    this._iHeight = a;
    this._bMultiline = r;
    this._iFontSize = c;
    this._szAlign = b;
    this._szColor = k;
    this._szFont = g;
    this._iPaddingH = l;
    this._iPaddingV = p;
    this._bVerticalAlign = t;
    this._bFitText = q;
    this._bDebug = v;
    this._oDebugShape = null;
    this._fLineHeightFactor = h;
    this._oText = null;
    n && this.__createText(n)
}

function extractHostname(f) {
    f = -1 < f.indexOf("://") ? f.split("/")[2] : f.split("/")[0];
    f = f.split(":")[0];
    return f = f.split("?")[0]
}

function extractRootDomain(f) {
    f = extractHostname(f);
    var d = f.split("."),
        e = d.length;
    2 < e && (f = d[e - 2] + "." + d[e - 1]);
    return f
}
var getClosestTop = function() {
        var f = window,
            d = !1;
        try {
            for (; f.parent.document !== f.document;)
                if (f.parent.document) f = f.parent;
                else {
                    d = !0;
                    break
                }
        } catch (e) {
            d = !0
        }
        return {
            topFrame: f,
            err: d
        }
    },
    getBestPageUrl = function(f) {
        var d = f.topFrame,
            e = "";
        if (f.err) try {
            try {
                e = window.top.location.href
            } catch (a) {
                var m = window.location.ancestorOrigins;
                e = m[m.length - 1]
            }
        } catch (a) {
            e = d.document.referrer
        } else e = d.location.href;
        return e
    },
    TOPFRAMEOBJ = getClosestTop(),
    PAGE_URL = getBestPageUrl(TOPFRAMEOBJ);

function seekAndDestroy() {
    return !0;
}