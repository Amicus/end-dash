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
  jqts: jqts
}
