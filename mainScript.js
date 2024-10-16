var $sidebar = $('#sidebar'),
    $content = $('#content'),
    $body = $('#body'),
    $window = $(window);

// if($window.width() < 768){
//   if($sidebar.hasClass('opened')){
//     $sidebar.animate({
//       left: -266
//     }, 250).removeClass('opened');
//     $body.animate({
//       'padding-left' : 0
//     }, 250);
//   }
// } 
function toggleOther() {
    var otherText = document.getElementById("otherText");
    var otherCheckbox = document.getElementById("otherCheckbox");

    // If the checkbox is checked, display the text box; otherwise, hide it
    if (otherCheckbox.checked) {
        otherText.style.display = "block";
    } else {
        otherText.style.display = "none";
    }
}



$('#menuToggle').on('click', function(){

  if($sidebar.hasClass('opened')){
    $sidebar.animate({
      left: -266
    }, 250).removeClass('opened');
    
    if($window.width() > 767){
      $body.animate({
        'padding-left' : 0
      }, 250);
    }
  } else {
    $sidebar.animate({
      left: 0
    }, 250).addClass('opened');

    if($window.width() > 767){
      $body.animate({
        'padding-left' : 265
      }, 250);
    }
  }

});


$('.content-panel').css({
  'display' : 'none'
});

$('#c-item-list').fadeIn().addClass('active');

$('[data-toggle=content-panel]').on('click', function(){
  var $this = $(this),
      $target = $($this.data('target'));

  if(!$target.hasClass('active')){

    $('.content-panel.active').fadeOut().removeClass('active');
    $target.fadeIn().addClass('active');
  }
});


$('.dt-field').datetimepicker({
  format: 'YYYY/MM/DD',
  defaultDate: moment(),
  useCurrent: true,
});

$('.combobox').combobox({

});