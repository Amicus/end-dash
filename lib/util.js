var _ = require("underscore")
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

function execPathOnStack(stack, path) {
  //if it's an absolute path start from the "root" of the stack
  if(path.charAt(0) === '/') {
    stack.splice(1, stack.length - 1)
  }

  _(path.split("/")).each(function(segment) {
    if(!segment || segment === ".") return
    if(segment === "..") return stack.pop()
    var val = get(_(stack).last(), segment)
    if(typeof val === "undefined") {
      throw new Error("could not find " + segment + " on model " + JSON.stringify(_(stack).last()))
    }
    stack.push(val)
  })
}

module.exports = {
  findDescendantsAndSelf: findDescendantsAndSelf, 
  execPathOnStack: execPathOnStack,
  getSelector: getSelector,
  get: get,
  trim: trim,
  jqts: jqts
}
