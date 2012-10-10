window.require = function() {
  var global = window
  /*!
   * Require functions by TJ Holowaychuk <tj@learnboost.com>
   */

  // addition of node_modules support and better 
  // exceptions by Zach Smith
  var getNodeModule = function(parent, path) {
    var dirs = parent.split('/')
      , module
      , i;

    //remove the filename
    dirs.pop();

    while(dirs.length) {
      module = require.resolve(dirs.join("/") + "/node_modules/" + path);
      if(require.modules[module]) {
        return module;
      } 
      dirs.pop();
    }
    //not a node module
    return false;
  }
   
  /**
   * Require the given path.
   *
   * @param {String} path
   * @return {Object} exports
   * @api public
   */

  function require(p) {
    var path = require.resolve(p)
      , mod = require.modules[path];
    if (!mod) {
      //try once more HACK for if we're requireing from the main scope
      //we only need to look for node_modules in the root dir, since
      //thats the only kind we can require from the main scope
      path = getNodeModule("/", path)
      if(path) {
        mod = require.modules[path];
      } else {
        var error = new Error('failed to require "' + p + '"');
        error.requireError = true;
        throw error;
      }
    }
    if (!mod.exports) {
      mod.exports = {};
      mod.call(mod.exports, mod, mod.exports, require.relative(path), global);
    }
    return mod.exports;
  }

  /**
   * Registered modules.
   */

  require.modules = {};

  /**
   * Resolve `path`.
   *
   * @param {String} path
   * @return {Object} module
   * @api public
   */

  require.resolve = function(path){
    var orig = path
      , reg = path + '.js'
      , index = path + '/index.js';
    return require.modules[reg] && reg
      || require.modules[index] && index
      || orig;
  };

  /**
   * Register module at `path` with callback `fn`.
   *
   * @param {String} path
   * @param {Function} fn
   * @api public
   */

  require.register = function(path, fn){
    require.modules[path] = fn;
  };



  /**
   * Return a require function relative to the `parent` path.
   *
   * @param {String} parent
   * @return {Function}
   * @api private
   */

  require.relative = function(parent) {
    return function(p) {
      try {
        if ('.' != p.charAt(0) && '/' != p.charAt(0)) {
          var nodeModule = getNodeModule(parent, p)
          if(nodeModule) {
            return require(nodeModule)
          }
        }
        if ('.' != p.charAt(0)) return require(p);

        var path = parent.split('/')
          , segs = p.split('/');
        path.pop();

        for (var i = 0; i < segs.length; i++) {
          var seg = segs[i];
          if ('..' == seg) path.pop();
          else if ('.' != seg) path.push(seg);
        }

        return require(path.join('/'));
      } catch (e) {
        //add the file from which this is being required
        //parentRequire neccesary, otherwise w add a message for
        //what module required it's parent and so on all the way up
        if(e.requireError && !e.parentRequire) {
          e.parentRequire = parent;
          e.message = e.message + " from module \"" + parent + "\"";
        }
        throw e;
      }
    };
  }; 

  return require;
}()

var process = {}
process.nextTick = function(cb) {
  setTimeout(cb, 0)
}
process.platform = "browser"
