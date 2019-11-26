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
    let progress = {
        init: function(steps) {
            this.step = 100 / (steps);
            this.status = 0;
            this.advance();
        },
        advance: function() {
            this.status += this.step;
            $('#progressBar').css('width', this.status + '%');
            if (this.status > 99) {
                $('#load').addClass('hide');
            }
        }
    };

    // Use with total amount of steps, initialization included
    progress.init(3);

    setTimeout(function() {
        progress.advance();
    }, 800);

    setTimeout(function() {
        progress.advance();
    }, 400);

    setTimeout(function() {
        $('#contents').fadeIn(300);
    }, 1200);

}

function blink(){
    $('#page-logo-icon').delay(500).fadeTo(500,0.5).delay(200).fadeTo(500,1, blink);
}