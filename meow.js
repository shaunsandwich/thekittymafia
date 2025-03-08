// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"confetti.js":[function(require,module,exports) {
'use strict';

function ConfettiGenerator(params) {
  //////////////
  // Defaults
  var appstate = {
    target: 'confetti-holder',
    // Id of the canvas
    max: 80,
    // Max itens to render
    size: 1,
    // prop size
    animate: true,
    // Should aniamte?
    props: ['circle', 'square', 'triangle', 'line'],
    // Types of confetti
    colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
    // Colors to render confetti
    clock: 25,
    // Speed of confetti fall
    interval: null,
    // Draw interval holder
    rotate: false,
    // Whenever to rotate a prop
    width: window.innerWidth,
    // canvas width (as int, in px)
    height: window.innerHeight // canvas height (as int, in px)

  }; //////////////
  // Setting parameters if received

  if (params) {
    if (params.target) appstate.target = params.target;
    if (params.max) appstate.max = params.max;
    if (params.size) appstate.size = params.size;
    if (params.animate !== undefined && params.animate !== null) appstate.animate = params.animate;
    if (params.props) appstate.props = params.props;
    if (params.colors) appstate.colors = params.colors;
    if (params.clock) appstate.clock = params.clock;
    if (params.width) appstate.width = params.width;
    if (params.height) appstate.height = params.height;
    if (params.rotate !== undefined && params.rotate !== null) appstate.rotate = params.rotate;
  } //////////////
  // Properties


  var cv = document.getElementById(appstate.target);
  var ctx = cv.getContext("2d");
  var particles = []; //////////////
  // Random helper (to minimize typing)

  function rand(limit, floor) {
    if (!limit) limit = 1;
    var rand = Math.random() * limit;
    return !floor ? rand : Math.floor(rand);
  }

  var totalWeight = appstate.props.reduce(function (weight, prop) {
    return weight + (prop.weight || 1);
  }, 0);

  function selectProp() {
    var rand = Math.random() * totalWeight;

    for (var i = 0; i < appstate.props.length; ++i) {
      var weight = appstate.props[i].weight || 1;
      if (rand < weight) return i;
      rand -= weight;
    }
  } //////////////
  // Confetti particle generator


  function particleFactory() {
    var prop = appstate.props[selectProp()];
    var p = {
      prop: prop.type ? prop.type : prop,
      //prop type
      x: rand(appstate.width),
      //x-coordinate
      y: rand(appstate.height),
      //y-coordinate
      src: prop.src,
      radius: rand(4) + 1,
      //radius
      size: prop.size,
      rotate: appstate.rotate,
      line: Math.floor(rand(65) - 30),
      // line angle
      angles: [rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2],
      // triangle drawing angles
      color: appstate.colors[rand(appstate.colors.length, true)],
      // color
      rotation: rand(360, true) * Math.PI / 180,
      speed: rand(appstate.clock / 7) + appstate.clock / 30
    };
    return p;
  } //////////////
  // Confetti drawing on canvas


  function particleDraw(p) {
    var op = p.radius <= 3 ? 0.4 : 0.8;
    ctx.fillStyle = ctx.strokeStyle = "rgba(" + p.color + ", " + op + ")";
    ctx.beginPath();

    switch (p.prop) {
      case 'circle':
        {
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.radius * appstate.size, 0, Math.PI * 2, true);
          ctx.fill();
          break;
        }

      case 'triangle':
        {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.angles[0] * appstate.size, p.y + p.angles[1] * appstate.size);
          ctx.lineTo(p.x + p.angles[2] * appstate.size, p.y + p.angles[3] * appstate.size);
          ctx.closePath();
          ctx.fill();
          break;
        }

      case 'line':
        {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.line * appstate.size, p.y + p.radius * 5);
          ctx.lineWidth = 2 * appstate.size;
          ctx.stroke();
          break;
        }

      case 'square':
        {
          ctx.save();
          ctx.translate(p.x + 15, p.y + 5);
          ctx.rotate(p.rotation);
          ctx.fillRect(-15 * appstate.size, -5 * appstate.size, 15 * appstate.size, 5 * appstate.size);
          ctx.restore();
          break;
        }

      case 'svg':
        {
          ctx.save();
          var image = new Image();
          image.src = p.src;
          var size = p.size || 15;
          ctx.translate(p.x + size / 2, p.y + size / 2);
          if (p.rotate) ctx.rotate(p.rotation);
          ctx.drawImage(image, -(size / 2) * appstate.size, -(size / 2) * appstate.size, size * appstate.size, size * appstate.size);
          ctx.restore();
          break;
        }
    }
  } //////////////
  // Public itens
  //////////////
  //////////////
  // Clean actual state


  var _clear = function _clear() {
    appstate.animate = false;
    clearInterval(appstate.interval);
    requestAnimationFrame(function () {
      ctx.clearRect(0, 0, cv.width, cv.height);
      var w = cv.width;
      cv.width = 1;
      cv.width = w;
    });
  }; //////////////
  // Render confetti on canvas


  var _render = function _render() {
    //canvas dimensions
    cv.width = appstate.width;
    cv.height = appstate.height;
    particles = [];

    for (var i = 0; i < appstate.max; i++) {
      particles.push(particleFactory());
    }

    function draw() {
      ctx.clearRect(0, 0, appstate.width, appstate.height);

      for (var i in particles) {
        particleDraw(particles[i]);
      }

      update(); //animation loop

      if (appstate.animate) requestAnimationFrame(draw);
    }

    function update() {
      for (var i = 0; i < appstate.max; i++) {
        var p = particles[i];
        if (appstate.animate) p.y += p.speed;
        if (p.rotate) p.rotation += p.speed / 35;

        if (p.speed >= 0 && p.y > appstate.height || p.speed < 0 && p.y < 0) {
          particles[i] = p;
          particles[i].x = rand(appstate.width, true);
          particles[i].y = p.speed >= 0 ? -10 : parseFloat(appstate.height);
        }
      }
    }

    return requestAnimationFrame(draw);
  };

  return {
    render: _render,
    clear: _clear
  };
}

window.ConfettiGenerator = ConfettiGenerator;
},{}],"../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53537" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js","confetti.js"], null)
//# sourceMappingURL=/confetti.93607243.js.map