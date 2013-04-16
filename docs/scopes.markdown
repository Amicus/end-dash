[](root)
```coffeescript
require("../test/helper")
Model = require("Backbone").Model
EndDash = require("../lib/end-dash").generateTemplate
```

[templates/blog_post.ed](./templates/blog_post.ed#L2-L7)

#Changing Scopes

  Often you need to access another model outside the current scope.

  An example would be where you're building a blog and you need to 
access a the post's title from within each comment. 

[](beforeEach)
```coffeescript
Template = Derp(markup, {
  blogPost: {
    title: "I'm a title.",
    comments: [{ body: "comment 1 body" }, { body: "comment 2 body" }]
  }
})
```

[](it "should do stuff")
```coffeescript
expect("herp").to.be("herp")
```
