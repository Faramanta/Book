$(document).ready(function() {

  // slider
    $('.owl-carousel').owlCarousel({
        nav: true,
        items: 1,
        slideBy: 1,
        autoplay: false,
        touchDrag: true,
        mouseDrag: true,
        responsive: {
            768: {
                nav: true,
                items: 3,
            },
        }
    });
  // slider-end
});
