var _ = require("underscore")
/**
 * Returns a unique selector from the root element
 * to el
 *
 * I tried memoizing selectors and it didn't give much
 * of a performance gain, so I got rid of it.
 **/
var getSelector =  function(el, root) {
  var id = el.attr("id")
    , classNames = (el.attr("class") || "")
        .replace(/(^\s+|\s+$)/g, "")
        .replace(/#{.*?}/g, "").split(" ")
    , name

  if(el.is(root))
    return ""

  if(id && !id.match(/#{/g)) {
    return "#" + id
  } else {
    classNames = _(classNames).reject(function(className) {
      return !className || className.match(/#{/g)
    })
    if(classNames.length) {
      name = "." + classNames.join(".")


      if($(el).parent().children(name).length !== 1) {
        name = el[0].tagName.toLowerCase()
      }
    } else {
      name = el[0].tagName.toLowerCase()
    }
  }

  var siblingsAndSelf = el.parent().children(name)
    , baseOneIndex = (el.parent().children().index(el) + 1)
    , selector = name
    , recur

  if(siblingsAndSelf.length > 1)
    selector += ":nth-child(" + baseOneIndex + ")"

  if(recur = getSelector(el.parent(), root))
    selector = recur + " > " + selector

  return selector
}

var trim = function(str) {
  return (str || "").replace(/^\s+|\s+$/g, "")
}

var jqts = function(element) {
  return $("<div>").append(element.clone()).html()
}

var findDescendantsAndSelf = function(element, selector) {
  if(!selector)
    return element

  var matches = element.find(selector)
  if(!matches.length) {
    matches = matches.filter(selector)
  }
  return matches
}

var get = function(obj, key) {
  var val
  if(!obj) return
  if(typeof obj.get === "function") {
    return obj.get(key)
  } else {
    return obj[key]
  }
}

module.exports = {
  findDescendantsAndSelf: findDescendantsAndSelf,
  getSelector: getSelector,
  get: get,
  trim: trim,
  jqts: jqts
}
