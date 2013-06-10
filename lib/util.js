var _ = require("underscore")
/**
 * Returns a unique selector from the root element
 * to el
 *
 * I tried memoizing selectors and it didn't give much
 * of a performance gain, so I got rid of it.
 **/
function getSelector(el, root) {
  var id = el.attr("id")
    , classNames = (el.attr("class") || "").replace(/(^\s+|\s+$)/g, "").split(" ")
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

module.exports = {
  findDescendantsAndSelf: findDescendantsAndSelf,
  getSelector: getSelector,
  get: get,
  trim: trim,
  jqts: jqts
}
