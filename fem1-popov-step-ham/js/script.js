/*
Функционал секции Our Services
*/

$('.services-menu').on('click', (event) => {
    $('.services-menu-btn-active').removeClass('services-menu-btn-active');
    $(event.target).addClass('services-menu-btn-active');
    const name = $(event.target).data('name');
    $(`[data-content="${name}"]`).show();
    $(`[data-content="${name}"]`).siblings().hide();
});

/*
Функционал секции Our Amazing Work
*/

let visibleItemsNumber = 12;
const $items = $('.works-content-item');
const $worksLoadMoreBtn = $('#worksLoadMoreBtn');
const $itemHoverContent = $('div.works-content-hover');
$itemHoverContent.remove();

const showItems = () => {
    $items.hide();
    $worksLoadMoreBtn.hide();
    const category = $('.works-filter-btn-active').data('name');
    if (!category) {
        $(`.works-content-item:lt(${visibleItemsNumber})`).show();
        if ($('.works-content-item').length > visibleItemsNumber) {
            $worksLoadMoreBtn.show();
        }
    } else {
        $(`[data-category='${category}']:lt(${visibleItemsNumber})`).show();
        if ($(`[data-category='${category}']`).length > visibleItemsNumber) {
            $worksLoadMoreBtn.show();
        }
    }
};

showItems();

$worksLoadMoreBtn.on('click', () => {
    visibleItemsNumber += 12;
    $('#worksPreloader').show();
    $worksLoadMoreBtn.hide();
    setTimeout(() => {
        $('#worksPreloader').hide();
        $worksLoadMoreBtn.show();
        showItems();
    }, 1500)
});

$('.works-filter').on('click', (event) => {
    if($(event.target).is('li')) {
        $('.works-filter-btn').removeClass('works-filter-btn-active');
        $(event.target).addClass('works-filter-btn-active');
        showItems();
    }
});

$items.on('mouseenter', function () {
    $(this).children().hide();
    let category = "";
    switch ($(this).data('category')) {
        case "graphic-design":
            category = "Graphic Design";
            break;
        case "web-design":
            category = "Web Design";
            break;
        case "landing-page":
            category = "Landing Page";
            break;
        case "wordpress":
            category = "Wordpress";
            break;
    }
    $(this).append($itemHoverContent);
    $('.works-content-hover-category').first().html(category);
});

$items.on('mouseleave', function () {
    $itemHoverContent.remove();
    $(this).children().show();
});

/*
Функционал секции What People Say
*/

const changePeopleContent = (selectedFace) => {
    $('.people-content-active').animate({opacity: 0, top: '200px'}, 500);
    setTimeout(() => {
        $('.people-content-active').removeClass('people-content-active');
        $('.people-content').closest(`[data-index=${selectedFace}]`)
            .addClass('people-content-active')
            .css({opacity: 0, top: '-200px'})
            .animate({opacity: 1, top: 0}, 500)
    }, 300);
    $('.people-nav-img').removeClass('people-nav-img-active')
                        .closest(`[data-index=${selectedFace}]`)
                        .addClass('people-nav-img-active');
};

$('.people-nav-img').on('click', function() {
    const selectedFace = $(this).data('index');
    changePeopleContent(selectedFace);
});

$('#arrowLeft').on('click', function() {
    let selectedFace = Number($('.people-nav-img-active').data('index')) - 1;
    if (selectedFace === 0) {
        selectedFace = 4;
    }
    changePeopleContent(selectedFace);
});

$('#arrowRight').on('click', function() {
    let selectedFace = Number($('.people-nav-img-active').data('index')) + 1;
    if (selectedFace === 5) {
        selectedFace = 1;
    }
    changePeopleContent(selectedFace);
});

/*
Функционал секции Gallery
*/
const galleyItemsNumber = 18;
let currentGalleryItem = 1;
const $galleryLoadMoreBtn = $('#galleryLoadMoreBtn');

for (let i = 0; i < 8; i++) {
    $('.grid').append(`<div class="grid-item"><img src='img/gallery/gallery-image-${currentGalleryItem}.jpg' alt=""></div> `);
    currentGalleryItem++;
}

$('img').on('load', () => {
    $('.grid').masonry({
        itemSelector: '.grid-item',
    });
});

const addGaleryItems = (itemsNumber) => {
    const elem = [];
    for (let i = 0; i < itemsNumber; i++) {
        const div = document.createElement('div');
        div.innerHTML = `<img src='img/gallery/gallery-image-${currentGalleryItem}.jpg' alt="">`;
        div.className = 'grid-item';
        elem.push(div);
        currentGalleryItem++;
        if (currentGalleryItem > galleyItemsNumber) {
            $galleryLoadMoreBtn.hide();
            break;
        }
    }
    const $elem = $(elem);
    $elem.hide();
    $('.grid').append($elem);
    $('#galleryPreloader').show();
    $galleryLoadMoreBtn.hide();
    setTimeout(() => {
        $('#galleryPreloader').hide();
        $elem.show();
        $('.grid').masonry('appended', $elem);
        if (currentGalleryItem <= galleyItemsNumber) {
            $galleryLoadMoreBtn.show();
        }
    }, 1000)
};

const addHover = () => {
    $('.grid-item').mouseenter(function () {
        const $div = $('' +
            '<div class="grid-item-hover">' +
            '<button class="grid-item-hover-btn"><i class="fas fa-search"></i></button>' +
            '<button class="grid-item-hover-btn"><i class="fas fa-arrows-alt"></i></button>' +
            '</div>');
        $(this).prepend($div);
    });

    $('.grid-item').mouseleave(function () {
        $('.grid-item-hover').remove();
    });
};

addHover();


$galleryLoadMoreBtn.on('click', () => {
    addGaleryItems(4);
    addHover();
});