/* jshint browser:true, node:true, unused:true */
'use strict';

var loading = false;
var listeners = [];
var debug;

function enableDebugging() {
  loading = true;
  require.ensure(['debug'], function(require) {
    debug = require('debug');
    listeners.forEach(function(listener) {
      listener();
    });
    listeners = null;
  });
}

window.__enableDebugging = function() {
  try {
    window.localStorage.debug_logging = true;
  } catch(e) { }

  enableDebugging();
};

window.__disableDebugging = function() {
  try {
    delete window.localStorage.debug_logging;
  } catch(e) { }
};

try {
  if(window.localStorage.debug_logging) {
    enableDebugging();
  }
} catch(e) { }

function debugProxy(namespace) {
  var backend;

  var fn = function() {
    if (backend) {
      // Backend is loaded, just use it
      backend.apply(backend, arguments);
    } else if(loading) {
      // Backend is loading, defer the debug call until it is loaded
      var args = Array.prototype.slice.apply(arguments);
      listeners.push(function() {
        backend.apply(backend, args);
      });
    }
  };

  listeners.push(function() {
    // Backend has been loaded, switch to it
    backend = debug(namespace);
    fn.enabled = backend.enabled;
  });

  fn.enabled = loading; // Technically this isn't totally correct as debug may filter
                        // this level out once the backend has started

  return fn;
}

module.exports = function(namespace) {
  if (debug) {
    return debug(namespace);
  }

  return debugProxy(namespace);
};
