$(document).ready(function(){
    blink();
    $(".dropdown-trigger").dropdown({
        hover : true,
        inDuration : 500
    });
    $('.tooltipped').tooltip();
    $('.sidenav').sidenav();
    $('.tabs').tabs();
    $('select').formSelect();
    $('.collapsible').collapsible();
    $('.modal').modal();
    lazyLoad();
});

function lazyLoad() {
    $('.progress').show(function(e) {
        $('#contents').fadeOut(500);
    }).delay(2000).fadeOut(function(ex) {
        $('#contents').fadeIn(1500);
    });
}

function blink(){
    $('#page-logo-icon').delay(500).fadeTo(500,0.5).delay(200).fadeTo(500,1, blink);
}