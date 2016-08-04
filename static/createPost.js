/*global $*/
$( document ).ready(function() {

    $('.urlForm').on('submit', function(event){
        event.preventDefault();
        var currentUrl = $('.urlSubmit').val();
        
        $.get('/suggestTitle', {url: currentUrl}, function(title) {
            //console.log(title);
            
            $('.titleSubmit').val(title);
        });
       
    });
});