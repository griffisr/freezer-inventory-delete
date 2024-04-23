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

$('#c-item-table').DataTable( {
  "ajax": 'https://api.myjson.com/bins/2ztvf',
  "columns": [
    { "data": "id", "searchable": false, "orderable": false },
    { "data": "item_code"},
    { "data": "item_name" },
    { 
      "data": null,
      "defaultContent": "EN FR ID",
      targets: 4, 
      visible: document.getElementById('role').value == 'sales' 
    },
    { "data": "supplier_name" },
    { 
      "data": "item_type",
      targets: [5],
      orderData: [ 5, 2 ]
    },    
    { "data": "uom" },
    { "data": "qty", "searchable": false },
    { 
      "data": null,
      "searchable": false,
      "orderable": false,
      "defaultContent": "<button class='btn-unstyled'><i class='fa fa-pencil'></i></button> | <button class='btn-unstyled'><i class='fa fa-trash'></i></button>"
    },    
  ],
  "paging":   true,
  "ordering": true,
  "order": [[1, "asc"], [2, "asc"]],
  "info":     true,
  "responsive": {
    details: {
      type: 'column',
      target: 'tr'
    }
  },
} );

$('.content-panel').css({
  'display' : 'none'
});

$('#c-item-form').fadeIn().addClass('active');

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