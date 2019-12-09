$(document).ready(function(){
    blink();
    $(".dropdown-trigger").dropdown({
        inDuration : 800
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
        $('#contents').hide();
    }).delay(1500).fadeOut(function(ex) {
        $('#contents').fadeIn();
    });
}

function blink(){
    $('#page-logo-icon').delay(500).fadeTo(500,0.5).delay(200).fadeTo(500,1, blink);
}