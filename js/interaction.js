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

  var level = get_level(headers[0]), this_level, html = "<ol>";
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
      html += "</li></ol></li><li><a href='#" + header.id + "'>" + header.innerHTML + "</a>";
    else if (this_level > level) // lower level than before; expand the previous to contain a ol
      html += "<ol><li><a href='#" + header.id + "'>" + header.innerHTML + "</a>";
    level = this_level; // update for the next one
  });
  html += "</ol>";
  if (!no_back_to_top_links) {
    $(document).on('click', '.back-to-top', function() {
      $(window).scrollTop(0)
      window.location.hash = ''
    })
  }
  output.hide().html(html).show('slow');
  //$('.container').find('a').addClass('hidden');
  $("a:contains('dependency')").removeClass('hidden')
    .attr('href', $("a:contains('Dependencies')").attr('href'))
  $("p:contains('*')").addClass('hidden')
  $('ol').siblings().siblings().addClass('hidden');
  $("li:contains('Documentation')").addClass('documentation')
  $('li').on('click', function(evt) {
    if ($($(evt.target).parents()[2]).hasClass('toc') ||
        $($(evt.target).parents()[2]).hasClass('documentation')) {
      $('ol').siblings().siblings().addClass('hidden');
      $(evt.target).siblings().removeClass('hidden');
      $(evt.target).siblings().children().addClass('subNav');
    }
  });

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

  var you = new Backbone.Model({
    name: 'YourName',
  });

  var extremeCharacter = new Backbone.Model({
    name: 'Tony'
  });

  var template = EndDash.getTemplate('inputName', you),
      template2 = EndDash.getTemplate('whichCharacter', extremeCharacter);

  $('#inputs').html(template.el);
  $('#inputs2').html(template2.el);

});
