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
  if(!selector) {
    return element
  }
  var parts = selector.split(">")
  if(parts.length == 1) { 
    var matches = element.filter(selector)
  } else {
    //slice off the first part of the selector, since it
    //matches the container(element) that we're finding in
    descendantSelector = parts.slice(1).join("")
    var matches = element.find(" >" + descendantSelector)
  }
  return matches
}

module.exports = { 
  findDescendantsAndSelf: findDescendantsAndSelf, 
  getSelector: getSelector,
  jqts: jqts
}
