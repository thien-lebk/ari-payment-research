$(document).ready(function () {

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

  });
});


 

$(document).ready(function () {
  $(".same-carousel-items").owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      items: 1,
      autoHeight: true,
      loop: true,
      autoplay: true,
      autoplayTimeout: 4000,
      dots: true,
      lazyLoad: false
  });
});

// $(document).ready(function () {
//   $(".owl-carousel1").owlCarousel({
//       animateOut: 'fadeOut',
//       animateIn: 'fadeIn',
//       items: 3,
//       autoHeight: true,
//       loop: true,
//       autoplay: true,
//       autoplayTimeout: 6000,
//       dots: true,
//       lazyLoad: false,
//       stagePadding: 50
//   });
// });

$(document).ready(function(){
  $("#last-contents-items").owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      responsive : {
        // breakpoint from 0 up
        0 : {
          items:2,
        },      
        // breakpoint from 768 up
        768 : {
          items:4,     
        }
      },
      autoHeight:false,
      loop:true,
      autoplay:true,
      autoplayTimeout:5000,
      dots:false,
      lazyLoad:false,
      slideBy:1,
  });
});

$(document).ready(function(){
  $('#brand-items').owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      responsive : {
        // breakpoint from 0 up
        0 : {
          items:3,
            
        },
        // breakpoint from 480 up
        480 : {
          items:4,
            
        },
        // breakpoint from 768 up
        768 : {
          items:6,
            
        }
      },
      autoHeight:true,
      loop:true,
      autoplay:true,
      autoplayTimeout:3000,
      dots:false,
      lazyLoad:false,
      slideBy:1,
  });
});

$(document).ready(function(){
  $("#key-items").owlCarousel({
      margin:10,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      autoHeight:true,
      autoWidth:true,
      loop:false,
      autoplay:false,
      autoplayTimeout:4000,
      dots:false,
      lazyLoad:false,
      slideBy:2,
  });
});

$(document).ready(function(){
  $(".product-items").owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      responsive : {
        // breakpoint from 0 up
        0 : {
          items:1,
            
        },
        // breakpoint from 480 up
        500 : {
          items:2,
            
        },
        // breakpoint from 768 up
        950 : {
          items:4,
            
        }
      },
      autoHeight:false,
      loop:true,
      autoplay:true,
      autoplayTimeout:4000,
      dots:false,
      lazyLoad:false,
      slideBy:1,
  });
});



$(document).ready(function(){
  $(".product-items-2").owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      responsive : {
        // breakpoint from 0 up
        0 : {
          items:1,
            
        },
        // breakpoint from 480 up
        500 : {
          items:2,
            
        },
        // breakpoint from 768 up
        950 : {
          items:4,
            
        }
      },
      autoHeight:false,
      loop:false,
      autoplay:true,
      autoplayTimeout:4000,
      dots:false,
      lazyLoad:false,
      slideBy:1,
  });
});

// demo chuyen hinh=============================================================================
var slideIndex = 1;
showSlides(slideIndex);

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < slides.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}