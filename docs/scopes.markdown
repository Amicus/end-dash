[](root)
```coffeescript
require("../test/helper")
Model = require("Backbone").Model
EndDash = require("../lib/end-dash").generateTemplate
```

#Modifying the Scope

  Often you need to access the properties of another model outside the current
scope.

##Accessing a Variable from a Parent

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

  Using `data-scope="../.."` goes up two scopes, the scope chain in this 
instance looks like:

  * BlogPost
  * CommentsCollection
  * Comment

  So the first `..` would allow us to access properties on the collection, and the
second allows us to access properties on the BlogPost.

[](it "should populate correctly")
```coffeescript
  expect($(".blogPost- > .title-").html()).to.be("post title")

  expect($(".comment-:nth-child(1) .comment.title-").html()).to.be("comment 1 title")
  expect($(".comment-:nth-child(2) .comment.title-").html()).to.be("comment 2 title")

  expect($(".comment-:nth-child(1) .post.title-").html()).to.be("post title")
  expect($(".comment-:nth-child(2) .post.title-").html()).to.be("post title")
```

##Changing the scope of an element and it's children

  We can use data-scope on any element to change the scope for that element
and all of it's children.

  For example if we have a page listing transactions for a person, and we want
to use that user's name in each transaction.

[](beforeEach)
```coffeescript
AccountTemplate = require("./templates/account")

account = new AccountTemplate({
  account: {
    name: "Zach",
    accountType: "checking"
    transactions: [
      { amount: 100 },
      { amount: 200 }
    ]
  }
})
$("body").html(account.template)
```

[](it "should populate correctly")
```coffeescript
  expect($(".account- > .name-").html()).to.be("Zach")
  expect($(".account- > .accountType-").html()).to.be("checking")

  expect($(".transaction-:nth-child(1) .name-").html()).to.be("Zach")
  expect($(".transaction-:nth-child(2) .name-").html()).to.be("Zach")

  expect($(".transaction-:nth-child(1) .accountType-").html()).to.be("checking")
  expect($(".transaction-:nth-child(2) .accountType-").html()).to.be("checking")

  expect($(".transaction-:nth-child(1) .amount-").html()).to.be("100")
  expect($(".transaction-:nth-child(2) .amount-").html()).to.be("200")
```
<<<<<<< Updated upstream
=======

##Absolute Scope Paths

>>>>>>> Stashed changes
