
$('.nav-btn').on('click', () => {
    if ($('.fas').hasClass('fa-bars')) {
        $('.fas').removeClass('fa-bars')
                       .addClass('fa-times');
        $('.nav-menu').removeClass('nav-menu-hide')
                            .addClass('nav-menu-show')
    } else  {
        $('.fas').removeClass('fa-times')
                       .addClass('fa-bars');
        $('.nav-menu').removeClass('nav-menu-show')
                            .addClass('nav-menu-hide')
    }
});

