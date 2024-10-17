var $sidebar = $('#sidebar'),
    $content = $('#content'),
    $body = $('#body'),
    $window = $(window);

if($window.width() < 768){
  if($sidebar.hasClass('opened')){
    $sidebar.animate({
      left: -266
    }, 250).removeClass('opened');
    $body.animate({
      'padding-left' : 0
    }, 250);
  }
} 
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

// Sets the default for each page/tab to non-visable so I can set active page 
$('.content-panel').css({
  'display' : 'none'
});


// Set primary tab/page////////////////////////////////
$('#c-item-list').fadeIn().addClass('active');





function togglePage(targetPanel) {
  console.log("inside toggle " + targetPanel)

  $('.content-panel.active').fadeOut().removeClass('active');
  $(targetPanel).fadeIn().addClass('active');

}



$('[data-toggle=content-panel]').on('click', function(){
  var $this = $(this),
      $target = $($this.data('target'));

  if(!$target.hasClass('active')){

    $('.content-panel.active').fadeOut().removeClass('active');
    $target.fadeIn().addClass('active');
  }
});




  // Function to trigger the panel switch using the data-toggle behavior
  function triggerPanelSwitch(targetPanel) {
    // Find the link that triggers the target panel
    const link = document.querySelector(`a[data-target='${targetPanel}']`);
    
    if (link) {
      // Simulate the click event to trigger the data-toggle
      console.log(link)
      link.click();
    } else {
      console.error('Target panel link not found.');
    }
  }




$('.dt-field').datetimepicker({
  format: 'YYYY/MM/DD',
  defaultDate: moment(),
  useCurrent: true,
});

$('.combobox').combobox({

});