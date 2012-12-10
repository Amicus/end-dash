function getSelector(el, root) {
  var id 
    , className
    , name

  if(el.is(root))
    return ""

  if(id = el.attr("id")) {
    return "#" + id + " "
  } else {
    if(className = el.attr("class")) {
      name = "." + className.replace(/\s+/, ".")
    } else {
      name = el[0].tagName.toLowerCase()
    }
  }

  var siblingsAndSelf = el.parent().children(name)
    , baseOneIndex = (el.parent().children(name).index(el) + 1)
    , recur = getSelector(el.parent(), root)
    , selector = recur

  if(recur)
    selector += "> "

  selector += name

  if(siblingsAndSelf.length > 1)
    selector += ":nth-child(" + baseOneIndex + ")"

  return selector
}

exports.getSelector = getSelector
