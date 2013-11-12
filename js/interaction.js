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