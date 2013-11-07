Presenters
===============

If you wish to follow the Model-View-Presenter pattern, EndDash supports a hook
to specify what presenter to use for a given model.  By default, this function
simple returns the model itself, a simple identity function, but by passing in
your own lookup function to `EndDash.setGetPresenter` EndDash will run your code
instead to load a presenter if one is found.  Here's an example getPresenter
function that looks for a custom presenter in config.presenterDirectory and uses
a default base presenter or base collection presenter when no presenter specific
to the model's name attribute is defined:

```js
  function getPresenter(model) {
    var modelName = inflection.underscore(model.name || "")
      , id = model.cid
      , Presenter
      , basePresenter

    if(!(model instanceof Backbone.Model) && !(model instanceof Backbone.Collection))
      return model
    //give collections a unique id
    if(model instanceof Backbone.Collection) {
      if(!model.cid) id = model.cid = _.uniqueId("collection")
      basePresenter = "/base_collection_presenter"
    } else {
      basePresenter = "/base_presenter"
    }
    if(presenters[id]) {
      return presenters[id]
    } else {
      try {
        Presenter = require(config.presenterDirectory + "/" + modelName + "_presenter")
      } catch(e) {
        if(e.code !== "MODULE_NOT_FOUND") {
          throw e

        }
        Presenter = require(config.presenterDirectory + basePresenter)
      }
      return presenters[id] = new Presenter(model)
    }
  }
```