[](root)
```coffeescript
require("../test/helper")
Model = require("Backbone").Model
EndDash = require("../lib/end-dash").generateTemplate
```

#Changing the Scope of a variable

  Often you need to access another model outside the current scope.

  An example would be where you're building a blog and you need to 
access a the post's title from within each comment. 

[templates/blog_post.ed](./templates/blog_post.ed)

[](beforeEach)
```coffeescript
BlogPostTemplate = require("./templates/blog_post")

blogPost = new BlogPostTemplate({
  blogPost: {
    title: "post title",
    comments: [
      { title: "comment 1 title", body: "comment 1 body" },
      { title: "comment 2 title", body: "comment 2 body" }
    ]
  }
})
$("body").html(blogPost.template)
```

  This will cause the title element with `data-scope="../.."` to be the blog
post's title instead of the comment's title.

[](it "should do stuff")
```coffeescript
  expect($(".blogPost- > .title-").html()).to.be("post title")

  expect($(".comment-:nth-child(1) .comment.title-").html()).to.be("comment 1 title")
  expect($(".comment-:nth-child(2) .comment.title-").html()).to.be("comment 2 title")

  expect($(".comment-:nth-child(1) .post.title-").html()).to.be("post title")
  expect($(".comment-:nth-child(2) .post.title-").html()).to.be("post title")
```
