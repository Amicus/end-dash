##Documentation (and testing) for End-dash

  #READ THE FOLLOWING BEFORE CONTINUING

  Enddash is a library that compiles templates to html. The template files end in ".js.ed"

  These docs also use jsDom, a DOM simulator written in Node.js, that allow you to run tests without a browser. Notice that most of this documentation contains code blocks, which can actually be run as tests using mocha.js All code blocks are written in coffeescript, using mocha and expect.js, and jquery is imported by default.

  To run all the tests in the end-dash documentation, go to the docs directory and run 
  mocha docs --ui=exports 

  We have a custom plugin that enables this behavior, which can be installed by running "npm install" from the docs directory. Then run "mocha docs --ui=exports", and you should see some tests passing!

  If something in these docs looks incomplete or incorrect, it might be! Before changing anything, however, please write a test confirming it and check with someone else that there is in fact a mistake. 

  As a final note, documentation for .markdown files can be found at http://daringfireball.net/projects/markdown/