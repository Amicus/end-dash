// https://github.com/ghiculescu/jekyll-table-of-contents
$(document).ready(function() {
  var no_back_to_top_links = false

  var headers = $('h1, h2, h3, h4, h5, h6').filter(function() {return this.id}), // get all headers with an ID
      output = $('.toc');
  if (!headers.length || headers.length < 3 || !output.length)
    return;

  var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10) }
  var highest_level = headers.map(function(_, ele) { return get_level(ele) }).get().sort()[0]
  var return_to_top = '<i class="icon-arrow-up back-to-top"> </i>'

  var level = get_level(headers[0]), this_level, html = "<ul class='nav'>";
  headers.on('click', function() {
    if (!no_back_to_top_links) window.location.hash = this.id
  }).addClass('clickable-header').each(function(_, header) {
    this_level = get_level(header);
    if (!no_back_to_top_links && this_level === highest_level) {
      $(header).addClass('top-level-header').after(return_to_top)
    }
    if (this_level === level) // same level as before; same indenting
      html += "<li><a href='#" + header.id + "'>" + header.innerHTML + "</a>";
    else if (this_level < level) // higher level than before; end parent ol
      html += "</li></ul></li><li><a href='#" + header.id + "'>" + header.innerHTML + "</a>";
    else if (this_level > level) // lower level than before; expand the previous to contain a ol
      html += "<ul class='nav'><li><a href='#" + header.id + "'>" + header.innerHTML + "</a>";
    level = this_level; // update for the next one
  });
  html += "</ul>";
  if (!no_back_to_top_links) {
    $(document).on('click', '.back-to-top', function() {
      $(window).scrollTop(0)
      window.location.hash = ''
    })
  }
  output.hide().html(html).show('slow');
  $('.container').find('a').addClass('hidden');
  $("a:contains('dependency')").removeClass('hidden')
    .attr('href', $("a:contains('Dependencies')").attr('href'))
  $("a:contains('Documentation')").removeClass('hidden')
  .attr('href', $("a:contains('Documentation')").attr('href'))
  $("p:contains('*')").addClass('hidden')



  //interactive template example
  EndDash.bootstrap();
  var render = function(){
    try {
      var modelText = $('#model-edit').text(),
          templateText = $('#template-edit').text();
      EndDash.registerTemplate('custom', templateText);

      var template = EndDash.getTemplate('custom', eval(modelText));
      $('#user-edit').html(template.el);
    }
    catch(error) {
       console.log("Error occurred:", error)
    }
  };
  render();
  $('#model-edit').on('change keyup keydown', render);
  $('#template-edit').on('change keyup keydown', render);

  //interactive inputs example
  // Load all the templates on the page.

  var user = new Backbone.Model({
    fullName: '',
  });

  var extremeCharacter = new Backbone.Model({
    name: 'Tony'
  });

  var template = EndDash.getTemplate('inputName', user),
      template2 = EndDash.getTemplate('whichCharacter', extremeCharacter);

  $('#inputs').html(template.el);
  $('#inputs2').html(template2.el);

});

// Freddie's happy castle

var w = $(window)

w.scroll(

    function(){

        var footer = $("footer").offset().top,
            inner = $(window).innerHeight(),
            scrollTop = $(window).scrollTop(),
            navSwap  = footer - inner,
            cssBottom = scrollTop - navSwap

        if (navSwap <= scrollTop) {
            $("nav").css({
                "bottom": cssBottom,
                "transition": "all 0s linear"
            })

        } else {
            $("nav").css({
                "bottom": 0
            })
        }
})


$(window).ready(function() {

    $('body').scrollspy({ target: '#scrollSpyTarget' })

    $(".endDashFold").css({
        "min-height": $(window).innerHeight()
    })
})

w.ready(
    function landingPageInputFocus () {
    console.log("1")
     $(".endDashFold #inputs div p input").focus();
     console.log("2")
})



