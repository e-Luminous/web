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
        $('#contents').css('opacity', 0)
        .slideDown('fast')
        .animate(
            { opacity: 1 },
            { queue: false, duration: 'slow' }
        );
    });
}

function blink(){
    $('#page-logo-icon').delay(500).fadeTo(500,0.5).delay(200).fadeTo(500,1, blink);
}

$.fn.riseUp = function()   { $(this).show("slide", { direction: "down" }, 1000); };
$.fn.riseDown = function() { $(this).hide("slide", { direction: "down" }, 1000); };