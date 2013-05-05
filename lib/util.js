var _ = require("underscore")
  , pathRegex = new RegExp(
    "((?:\/[^\/]*)*|)" + //match the dirname
    "\/(" + //capture entire file name
      "(?:[^\/]*)" + //match filename w/o extension
      "(\\.[^\/.]*)" + //match the extension
      "|[^\/.]*" +  //otherwise take the entire filename if there are no dashes or dots
    ")" //end capture entire file name
  ) 
/**
 * Returns a unique selector from the root element
 * to el  
 *
 * I tried memoizing selectors and it didn't give much
 * of a performance gain, so I got rid of it.
 **/
function getSelector(el, root) {
  var id 
    , className
    , name

  if(el.is(root))
    return ""

  if(id = el.attr("id")) {
    name = "#" + id
  } else {
    className = (el.attr("class") || "")
      .replace(/#\{.*\}/g, "")
      .replace(/(^\s+|\s+$)/g, "")

    if(className) {
      name = "." + className.replace(/\s+/, ".")

      if($(el).parent().children(name).length !== 1)
        name = el[0].tagName.toLowerCase()
    } else {
      name = el[0].tagName.toLowerCase()
    }
  }

  var siblingsAndSelf = el.parent().children()
    , baseOneIndex = (el.parent().children().index(el) + 1)
    , selector = name
    , recur

  if(siblingsAndSelf.length > 1)
    selector += ":nth-child(" + baseOneIndex + ")"

  if(recur = getSelector(el.parent(), root))
    selector = recur + " > " + selector

  return selector
}

function trim(str) {
  return (str || "").replace(/^\s+|\s+$/g, "") 
}

function jqts(element) {
  return $("<div>").append(element.clone()).html()
}

function findDescendantsAndSelf(element, selector) {
  if(!selector)
    return element

  var matches = element.find(selector)
  if(!matches.length) {
    matches = matches.filter(selector)
  }
  return matches
}

function get(obj, key) {
  var val
  if(!obj) return
  if(typeof obj.get === "function") {
    return obj.get(key)
  } else {
    return obj[key]
  }
}

function pathParts(str) {
  var parts = str.match(pathRegex) || []
  return {
    dirname: parts[1] || "",
    basename: parts[2],
    extension: parts[3] || ""
  }
}

module.exports = {
  normalize: function(path) {
    var isAbsolute = path.charAt(0) === '/'
      , chunks = _(path.split('/')).filter(function(x) { return x }) //all non empty directory chunks
      , depth = 0
      , maxDepth = 0
      , normalized

    var normalizedArray = _(chunks).reduce(function(memo, chunk) {
      if(chunk == '..') {
        memo.pop()
        depth++
        if(depth > maxDepth) maxDepth = depth //if depth is already zero don't do any higher
      } else if(chunk != '.') {
        memo.push(chunk)
        depth--
      }
      return memo
    }, [])
    while(!isAbsolute && maxDepth-- > 0) {
      normalizedArray.unshift('..')
    }
    normalized = normalizedArray.join('/')

    if(!normalized && !isAbsolute) return '.'
    if(isAbsolute) normalized = '/' + normalized

    return normalized
  },

  resolve: function() {
    var args = [].slice.call(arguments)
    var from = args[0]
      , to = args[1]

    if(from.length !== 1 && from.charAt(from.length - 1) === "/") {
      from = from.slice(0, -1)
    }
    if(args.length === 1) {
      return from
    }

    if ('.' != to.charAt(0)) {
      args[1] = to
    } else {
      var path = from.split('/')
        , segments = to.split('/')

      _(segments).each(function(segment, i) {
        if ('..' == segment) {
          path.pop()
        } else if ('.' != segment) {
          path.push(segment)
        }
      })
      args[1] = path.join('/') || "/"
    }
    return this.resolve.apply(this, args.slice(1))
  },

  dirname: function(file) {
    return pathParts(file || "").dirname
  },

  basename: function(file) {
    return pathParts(file || "").basename
  },

  extname: function(file) {
    return pathParts(file || "").extension
  },

  findDescendantsAndSelf: findDescendantsAndSelf, 
  getSelector: getSelector,
  get: get,
  trim: trim,
  jqts: jqts
}
