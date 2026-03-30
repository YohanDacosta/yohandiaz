// get anchor name from url and scroll to target
// if anchor exist on the page and is bootstrap collapse widget open corresponding tab
(function ($) {
    $(document).ready(function(){
        var targetId = window.location.hash.split('?')[0];
        if ( targetId.length > 1 ) {
            if ( $('a[href*="' + targetId + '"]').filter('[data-toggle="collapse"]').length > 0 && !$(targetId).hasClass('in') ) {
                $('a[href*="' + targetId + '"]').click();
            }
            if ($(targetId).closest('.panel').length > 0) {
                // instead of using setTimeout bind listener on event hidden.bs.collapse
                setTimeout(function() {
                    $("html, body").animate({scrollTop: $(targetId).closest('.panel').offset().top }, 1000);
                }, 200);
            } else if ($(targetId).length > 0) {
                $("html, body").animate({scrollTop: $(targetId).offset().top }, 1000);
            }
        }
    });

    // toggle class for navbar toggle
    $('.navbar-toggle').click(function() {
        $( this ).toggleClass('open');
    });

    // toggle class for dropdown menu, remove bootstrap functionality
    $('.dropdown-topmenu > a').click(function() {
        $( this ).parent().toggleClass('open');
    });

    $('.dropdown-submenu > a').click(function() {
        $( this ).parent().toggleClass('open');
    });

    // Toggle Collapse Widget Icon
    $('.accordion > .panel').on('show.bs.collapse', function ()  {
        $(this).find('.collapse-icon').addClass('open');
    });
    $('.accordion > .panel').on('hide.bs.collapse', function () {
        $(this).find('.collapse-icon.open').removeClass('open');
    });


    // remove class if mouse/touch is outside of dropdown or dropdown-submenu.open div
    $(document).bind( "mouseup touchend", function(e) {
        if(!$(".dropdown.open").has(e.target).length){
            $('.dropdown').removeClass('open');
        }
        if(!$(".dropdown-submenu.open").has(e.target).length){
            $('.dropdown-submenu').removeClass('open');
        }
    });

    /*
    // add coronavirus popup
    var dialogShown = sessionStorage.getItem('dialogShown');

    if (!dialogShown) {
        $("#coronavirus").modal('show');
        sessionStorage.setItem('dialogShown', 1);
    }
    */
}(jQuery));
