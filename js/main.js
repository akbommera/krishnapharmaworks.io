
(function ($) {

    "use strict";
    /* ===================================
     Change variables value as per your need 
     ====================================== */

    var menuBreakPoint = 991;
    var sliderBreakPoint = 991; // It will effect when you have used attribute "data-thumb-slider-md-direction" OR "data-slider-md-direction"
    var animeBreakPoint = 1199;
    var headerTransition = 300;  // Header transition effect time

    /* ===================================
     Touch device
     ====================================== */

    var isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    if (isTouchDevice) {
        $('body').addClass('is-touchable');
    }

    /* ===================================
     Don't change variables value
     ====================================== */

    var lastScroll = 0,
            simpleDropdown = 0,
            linkDropdown = 0,
            isotopeObjs = [],
            swiperObjs = [];
    var windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    /* ===================================
     Check for browser OS
     ====================================== */

    var isMobile = false,
            isiPhoneiPad = false,
            isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
    }

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        isiPhoneiPad = true;
    }

    /* ===================================
     jQuery appear
     ====================================== */

    $('.vertical-counter, .counter, .progress-bar, .pie-chart-style-01, .attractive-hover, .splitting-animation, .section-dark, footer, [data-anime], [data-fancy-text]').each(function () {
        $(this).appear().trigger('resize');
    });

    initScrollNavigate();
    slideboxstyle();
    animateCounters();
    setSpaceInTeamStyle();
    setSpaceInInteractiveBannerStyle();
    setOverLayerPosition();
    setBottomOverLayerPosition(2000);
    setupSwiper();

    /* ===================================
     Header
     ====================================== */

    // Mobile menu - modern style
    var mobileStyle = $('body').attr('data-mobile-nav-style');
    if ((mobileStyle == 'modern' || mobileStyle == 'full-screen-menu') && !$('.navbar-' + mobileStyle + '-inner').length) {
        if (!$('.box-layout').length && mobileStyle == 'modern') {
            $('section, footer').wrapAll('<div class="page-layout"></div>');
        } else {
            $('section').wrapAll('<div class="page-layout"></div>');
        }

        $('.navbar .navbar-toggler').clone(true).addClass('navbar-toggler-clone').insertAfter('.page-layout');
        $('.navbar .navbar-collapse').clone(true).addClass('navbar-collapse-clone').attr('id', 'navbarNav-clone').insertAfter('.page-layout');

        $('.navbar-toggler-clone, .navbar-collapse-clone').wrapAll('<div class="navbar-' + mobileStyle + '-inner"></div>');
        $('.navbar-toggler').attr('data-target', '#navbarNav-clone').attr('aria-controls', '#navbarNav-clone');
        $('.navbar-' + mobileStyle + '-inner').find('.dropdown-toggle').addClass('dropdown-toggle-clone');
        if (typeof $.fn.mCustomScrollbar === 'function') {
            if ($('.navbar-collapse-clone').length) {
                var scrollOptions = $('.navbar-collapse-clone').attr('data-scroll-options') || '{ "theme": "light" }';
                if (typeof (scrollOptions) !== 'undefined' && scrollOptions !== null) {
                    scrollOptions = $.parseJSON(scrollOptions);
                    $('.navbar-collapse-clone').mCustomScrollbar(scrollOptions);
                }
            }
        }
        if (mobileStyle == 'modern') {
            $('<div class="navbar-show-modern-bg"></div>').insertAfter('.page-layout');
        }
    }

    // Navbar collapse - classic menu
    $('.navbar-collapse.collapse').on('click', function(e) {
        if ($('body').hasClass('navbar-collapse-show')) {
            $('body').removeClass('navbar-collapse-show');
            $('html').removeClass('overflow-hidden');
            $('#navbarNav').click();
            // $('button.navbar-toggler.float-start').addClass('collapsed');
        }
    })
    $('.navbar-collapse.collapse').on('show.bs.collapse', function (e) {
        $('.navbar-modern-inner').on('click', function(e) {
            
        })
        if (!$('body').hasClass('navbar-collapse-show')) {
            $('body').addClass('navbar-collapse-show');
            $('html').addClass('overflow-hidden');
            if ($('body').attr('data-mobile-nav-bg-color') && $('.navbar-modern-inner').length) {
                var bgColor = $('body').attr('data-mobile-nav-bg-color');
                $('.navbar-show-modern-bg').css('background', bgColor);
            }
            if ($('body').attr('data-mobile-nav-bg-color') && $('.navbar-full-screen-menu-inner').length) {
                var bgColor = $('body').attr('data-mobile-nav-bg-color');
                $('.navbar-full-screen-menu-inner').css('background', bgColor);
            }
            // Set submenu height after opened toggle menu
            if (getWindowWidth() <= menuBreakPoint) {
                var windowHeight = getWindowHeight(),
                        headerHeight = getHeaderHeight();
                $('header .navbar-collapse').css('max-height', windowHeight - headerHeight);
            }
        } else {
            if ($('.navbar-modern-inner').length) {
                setTimeout(function () {
                    $('.navbar-show-modern-bg').css('background', '');
                }, 600);
            }
            if ($('.navbar-full-screen-menu-inner').length) {
                setTimeout(function () {
                    $('.navbar-full-screen-menu-inner').css('background', '');
                }, 600);
            }
        }
        var headerHeight = getHeaderHeight();
        var windowHeight = getWindowHeight();
        if ($('.navbar-modern-inner').length > 0 || $('.navbar-full-screen-menu-inner').length > 0) {
            $('.navbar-collapse-clone').css('max-height', windowHeight);
        } else {
            $('.navbar-collapse-clone').css('max-height', (windowHeight - headerHeight));
        }
    }).on('hide.bs.collapse', function (e) {
        if ($('body').hasClass('navbar-collapse-show')) {
            $('body').removeClass('navbar-collapse-show');
            $('html').removeClass('overflow-hidden');
        }
    });

    // Sub menu collapse event
    $('.sub-menu.collapse').on('show.bs.collapse', function (e) {
        var activeMenuId = $(e.target).attr('id');
        $('[data-bs-target="#' + activeMenuId + '"]').addClass('show');
        $(this).parents('.menu-item').siblings().each(function () {
            $('.sub-menu.show', this).collapse('hide');
        });
        stickyKitRecalc();
    }).on('hide.bs.collapse', function (e) {
        var activeMenuId = $(e.target).attr('id');
        $('[data-bs-target="#' + activeMenuId + '"]').removeClass('show');
        $(e.target).find('.sub-menu.show').collapse('hide');
        stickyKitRecalc();
    });

    

    // Header push menu open
    $(document).on('click', '.header-push-button .push-button', function () {
        $('html, body').toggleClass('show-menu');
    });

    // Header push menu close
    $(document).on('click', '.close-menu', function () {
        $('html, body').removeClass('show-menu');
        // Close left menu
        $('.sub-menu.show').collapse('hide');
    });

    // Close all left menu submenu
    $(document).on('click', '#navbar-menu .navbar-toggler', function () {
        // Close left menu
        $('.sub-menu.show').collapse('hide');
    });

    // Close on outside area
    $(document).on('click', 'body', function (e) {
        // Close all menu
        if (!($(e.target).closest('.navbar-nav').length || $(e.target).closest('.navbar-full-screen-menu-inner').length)) {
            setTimeout(function () {
                $('.navbar-collapse.collapse').collapse('hide');
            }, 100);
        }
        // Close push menu
        if (!($(e.target).hasClass('push-button') || $(e.target).closest('.push-button').length || $(e.target).closest('.push-menu').length || $(e.target).closest('.hamburger-menu').length)) {
            $('html, body').removeClass('show-menu');
        }
        // Close search
        if (!($(e.target).hasClass('search-form') || $(e.target).closest('.search-form-icon').length || $(e.target).closest('.search-form-box').length)) {
            $('body').removeClass('show-search-popup');
        }
        // Close dropdown menu, language and cart
        if (!$(e.target).closest('.navbar-nav').length) {
            if (!$(e.target).closest('.header-language').length) {
                // Close language menu
                $('.header-language').trigger('mouseleave');
                $('.header-language').removeClass('show');
                $('.header-language').children('.dropdown-menu').removeClass('show');
            }
            if (!$(e.target).closest('.header-cart').length) {
                // Close cart
                $('.header-cart').trigger('mouseleave');
                $('.header-cart').removeClass('show');
                $('.header-cart').children('.dropdown-menu').removeClass('show');
            }
            // Close all dropdown
            $('.navbar-nav .dropdown').each(function () {
                var _this = $(this);
                _this.trigger('mouseleave');
                _this.removeClass('show');
                _this.children('.dropdown-menu').removeClass('show');
            });
        } else if ($(e.target).parents('body').find('.header-language.open').length) {
            // Close language menu
            $('.header-language').trigger('mouseleave');
            $('.header-language').removeClass('show');
            $('.header-language').children('.dropdown-menu').removeClass('show');
        } else if ($(e.target).parents('body').find('.header-cart.open').length) {
            // Close cart
            $('.header-cart').trigger('mouseleave');
            $('.header-cart').removeClass('show');
            $('.header-cart').children('.dropdown-menu').removeClass('show');
        }
        // Close left-modern-header menu
        if (!$(e.target).closest('.left-modern-header').length) {
            $(".left-modern-header").collapse('hide');
        }
    });

    // Close on escape key
    $(document).on('keydown', function (e) {
        if (e.keyCode === 27) {
            // Close all menu
            $('.navbar-collapse.collapse').collapse('hide');
            // Close left menu
            $('#navbar-menu').collapse('hide');
            // Close push menu
            $('html, body').removeClass('show-menu');
            // Close search
            $('body').removeClass('show-search-popup');
            // Close left-modern-header menu
            $(".left-modern-header").collapse('hide');
        }
    });

    // Header submenu on hover
    $('.nav-item.submenu').on('mouseenter touchstart', function (e) {
        var _this = $(this),
                colorAttr = $('header nav').attr('data-header-hover');
        if (getWindowWidth() > menuBreakPoint) {
            if ($(e.target).siblings('.dropdown-menu').length) {
                e.preventDefault();
            }
            if (colorAttr == 'light') {
                $('header nav').addClass('submenu-light').removeClass('submenu-dark');
            } else if (colorAttr == 'dark') {
                $('header nav').addClass('submenu-dark').removeClass('submenu-light');
            }
        }
    }).on('mouseleave', function (e) {
        var _this = $(this);
        $('header nav').removeClass('submenu-light').removeClass('submenu-dark');
    });

    // Open menu on hover
    $('.dropdown').on('mouseenter touchstart', function (e) {
        var _this = $(this);
        _this.siblings('.dropdown').removeClass('open');
        _this.parents('.navbar-nav').siblings('.navbar-nav').find('.dropdown').removeClass('open');
        if (getWindowWidth() >= menuBreakPoint) {
            if (_this.hasClass('open') && _this[0] == $(e.target).parent()[0]) {
                let href = $(_this).find('.nav-link').attr('href');
                if (href != 'undefined' && href.indexOf('javascript') === -1 && typeof undefined !== typeof href && href != '#') {
                    window.location.href = href;
                }
            }
        }
        _this.addClass('open');
        menuPosition(_this);
        if (getWindowWidth() > menuBreakPoint) {
            if ($(e.target).siblings('.dropdown-menu').length) {
                e.preventDefault();
            }
            // Header color remove click on simple dropdown menu
            if ($(e.target).hasClass('simple-dropdown') || $(e.target).closest('.simple-dropdown').length) {
                $('header nav').removeClass('submenu-light').removeClass('submenu-dark');
            }
        }
    }).on('mouseleave', function (e) {
        var _this = $(this);
        _this.removeClass('menu-left');
        _this.removeClass('open');
    });

    // Add active class to current menu
    var pgurl = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    var $hash = window.location.hash.substring(1);
    if ($hash) {
        $hash = '#' + $hash;
        pgurl = pgurl.replace($hash, '');
    } else {
        pgurl = pgurl.replace('#', '');
    }
    $('.navbar-nav li a, .menu-item-list a').each(function () {
        var _this = $(this),
                aHref = _this.attr('href');
        if (aHref === pgurl || aHref === pgurl + '.html') {
            _this.parent().addClass('active');
            _this.parents('li.dropdown').addClass('active');
            _this.parents('li.menu-item').addClass('active');
        }
    });

    // Sticky left menu
    if ($.fn.stick_in_parent !== undefined && $.fn.stick_in_parent !== null) {
        if ($('.left-sidebar-wrapper').length) {
            $('.left-sidebar-wrapper .left-sidebar-nav').stick_in_parent({
                recalc: 1
            });
        }
    }
    if (typeof $.fn.smoothScroll === 'function') {
        if ($('.header-reverse').length > 0) {
            $('.inner-link').smoothScroll({
                speed: 800,
                offset: -59,
                beforeScroll: function () {
                    if ($('body').hasClass('left-menu-onepage')) {
                        $('.left-modern-header').collapse('hide');
                    }
                    $('.navbar-collapse.collapse').collapse('hide');
                }
            });
        } else {
            if ($('.inner-link').length > 0) {
                var offset = 0
                if ($('nav.navbar').hasClass('disable-fixed')) {
                    offset = 1;
                }

                if ($('.left-modern-menu').hasClass('left-menu-onepage')) {
                    if (getWindowWidth() <= menuBreakPoint) {
                        offset = -59;
                    }
                }

                $('.inner-link').smoothScroll({
                    speed: 800,
                    offset: offset,
                    beforeScroll: function () {
                        if ($('body').hasClass('left-menu-onepage')) {
                            $('.left-modern-header').collapse('hide');
                        }

                        if ($('body').hasClass('show-menu')) {
                            $('html, body').removeClass('show-menu');
                        }
                        $('.navbar-collapse.collapse').collapse('hide');
                    }
                });
            }
        }

        // Section link
        if ($('.section-link').length > 0) {
            $('.section-link').smoothScroll({
                speed: 900,
                offset: 1,
                beforeScroll: function () {
                    $('.navbar-collapse.collapse').collapse('hide');
                }
            });
        }
    }

    $('.modern-side-menu .menu-item').on('click', function () {
        $('.modern-side-menu .menu-item').removeClass('active');
        $(this).addClass('active');
    });

    // Get top space header height
    function getHeaderHeight() {
        var headerHeight = 0;
        if ($('.header-top-bar').length) {
            headerHeight = headerHeight + $('.header-top-bar').outerHeight();
        }
        if ($('header nav.navbar').length) {
            headerHeight = headerHeight + $('header nav.navbar').outerHeight();
        }
        if ($('.left-modern-header .left-modern-sidebar').length) {
            headerHeight = headerHeight + $('.left-modern-header .left-modern-sidebar').outerHeight();
        }
        return headerHeight;
    }

    // Get top space height
    function setTopSpaceHeight() {

        if (!$('header').hasClass('sticky') && ($('.top-space-margin').length || $('.top-space-padding').length) || $('.ipad-top-space-margin').length) {
            var headerHeight = getHeaderHeight();
            if ($('.top-space-margin').length) {
                $('.top-space-margin').css('margin-top', headerHeight);
            }
            if ($('.top-space-padding').length) {
                $('.top-space-padding').css('padding-top', headerHeight);
            }
            if ($('.ipad-top-space-margin').length) {
                if (getWindowWidth() <= menuBreakPoint) {
                    $('.ipad-top-space-margin').css('margin-top', headerHeight);
                } else {
                    $('.ipad-top-space-margin').css('margin-top', 'inherit');
                }
            }
        }
    }

    // Menu position
    function menuPosition(element) {
        var windowWidth = getWindowWidth();
        if (element.hasClass('simple-dropdown')) {
            simpleDropdown = element;
            linkDropdown = element.find('a.nav-link');
            var menuSpacing = 30,
                    menuLeftPosition = element.offset().left,
                    menuWidth = element.children('.dropdown-menu').outerWidth(),
                    menuDropdownCSS = (windowWidth - menuSpacing) - (menuLeftPosition + menuWidth);
            if (menuDropdownCSS < 0) {
                element.children('.dropdown-menu').css('left', menuDropdownCSS);
            }
        }
        if (element.parent().hasClass('dropdown-menu') && element.parents('.simple-dropdown')) {
            var dropdownWidth = 0,
                    maxValueInArray = 0,
                    lastValue = 0,
                    multiDepth = 0;
            dropdownWidth = element.outerWidth() - linkDropdown.outerWidth();
            element.children('.dropdown-menu').each(function () {
                var arr = [];
                if (element.find('li').hasClass('dropdown')) {
                    dropdownWidth = dropdownWidth + element.outerWidth();
                    element.find('li.dropdown').each(function () {
                        var dropdownMenu = element.closest('.dropdown-menu');
                        arr.push(dropdownMenu.outerWidth());
                    });
                    maxValueInArray = lastValue + Math.max.apply(Math, arr);
                    lastValue = maxValueInArray;
                    dropdownWidth = dropdownWidth + maxValueInArray;
                    multiDepth = multiDepth + 1;
                } else if (multiDepth < 1) {
                    dropdownWidth = dropdownWidth + element.outerWidth();
                }
            });
            var menuRightPosition = windowWidth - (simpleDropdown.offset().left + simpleDropdown.outerWidth());
            if (dropdownWidth > menuRightPosition) {
                if (element.find('.dropdown-menu').length > 0) {
                    var menuTopPosition = element.position().top,
                            submenuObj = element.find('.dropdown-menu'),
                            submenuHeight = submenuObj.outerHeight(),
                            totalHeight = menuTopPosition + submenuHeight + getHeaderHeight(),
                            windowHeight = getWindowHeight();
                    if (totalHeight > windowHeight) {
                        submenuObj.css('top', '-' + (totalHeight - windowHeight) + 'px');
                    }
                }
                element.addClass('menu-left');
            }
        }
    }

    // Recalculate sticky kit
    function stickyKitRecalc() {
        if ($('.left-sidebar-wrapper').length) {
            setTimeout(function () {
                $('.left-sidebar-wrapper').trigger('sticky_kit:recalc');
            }, 500);
        }
    }
    
    // Without link
    $('.nav-item  .nav-link').on('click',function(e) {
    var submenuLenth = $(this).closest('.dropdown').find('.dropdown').length;

    if ( $( window ).width() < 992 && $(this).closest('.dropdown').length > 0 ) {
        var HasClass = $(this).closest('.nav-item').find( '.dropdown-menu' ).hasClass ('show');
        if ($(this).closest('.nav-item').find( '.dropdown-menu' ).hasClass ('show')) {
            $(this).closest('.nav-item').find( '.dropdown-menu' ).removeClass('show')
            $(this).closest('.nav-item').find( '.dropdown-toggle' ).removeClass('show')
        }
        else{
            $( '.navbar-nav' ).find( '.dropdown-menu' ).removeClass('show');
            $( '.navbar-nav' ).find( '.dropdown-toggle' ).removeClass('show');
             $(this).closest('.nav-item').find( '.dropdown-menu' ).addClass('show')
             $(this).closest('.nav-item').find( '.dropdown-toggle' ).addClass('show')
        }
        }
    });

    $(window).resize( function () {
        if ( $( window ).width() > 991 ) {
            $( '.navbar-nav' ).find( '.dropdown-menu' ).removeClass('show');
            $( '.navbar-nav' ).find( '.dropdown-toggle' ).removeClass('show');
        }
    });

    /* ===================================
     Custom scrollbar
     ====================================== */

    if (typeof $.fn.mCustomScrollbar === 'function') {
        $('[data-scroll-options]').each(function () {
            var _this = $(this);
            var scrollOptions = _this.data('scroll-options') || '{"theme": "dark"}';

            try {
                _this.mCustomScrollbar(scrollOptions);
            } catch (error) {
                console.error('Error parsing scroll options:', error);
            }
        });
    }

    /* ===================================
     Portfolio
     ====================================== */

    // Portfolio isotope filter
    if (typeof imagesLoaded === 'function') {
        $('.portfolio-wrapper, .shop-wrapper').each(function () {
            var _this = $(this);
            _this.imagesLoaded(function () {
                _this.removeClass('grid-loading');
                if (typeof $.fn.isotope === 'function') {
                    var _thisIsotop = _this.isotope({
                        layoutMode: 'masonry',
                        itemSelector: '.grid-item',
                        percentPosition: true,
                        stagger: 0,
                        masonry: {
                            columnWidth: '.grid-sizer',
                        }
                    });
                }
                isotopeObjs.push(_this);

                // Filter default on load
                if (typeof $.fn.isotope === 'function') {
                    var currentPortfolioActive = $('.portfolio-filter > li.active > a').attr('data-filter');
                    if (currentPortfolioActive != '' && currentPortfolioActive != undefined) {
                        _this.isotope({filter: currentPortfolioActive});
                    }
                }
            });

            _this.on('arrangeComplete', function () {
                reInitSkrollr();
            });

            $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                _this.isotope({transitionDuration: 0});
            });
        });
    }

    $(document).on('click', '.portfolio-filter > li > a', function () {
        var _this = $(this),
                parentSectionObj = _this.parents('section');
        parentSectionObj.find('.portfolio-filter > li').removeClass('active');
        _this.parent().addClass('active');
        var selector = _this.attr('data-filter'),
                portfolioFilter = parentSectionObj.find('.portfolio-wrapper');

        portfolioFilter.find('.grid-item[data-anime]').addClass('appear');
        if (typeof portfolioFilter.isotope === 'function') {
            portfolioFilter.isotope({filter: selector});
        }

        if (parentSectionObj.length && $(parentSectionObj).hasClass('overlap-height')) {
            setOverLayerPosition();
        }

        return false;
    });

    // Reset isotope loop
    function resetIsotopeLayoutLoop(isotopeObjs, removeAnimation) {
        for (var i = 0; i < isotopeObjs.length; i++) {
            if (isotopeObjs[i].data('isotope')) {
                isotopeObjs[i].isotope('layout');
            }
        }
        ;
    }

    // Horizontal portfolio 
    const ThreeDLetterMenuEffect = () => {
        $(".threeD-letter-menu .menu-item").each(function () {
            let _self = this,
                    MenuLink = _self.querySelector(".menu-item-text"),
                    MenuText = MenuLink.querySelector("span"),
                    imgHeight = _self.querySelector(".hover-reveal").clientHeight,
                    imgWidth = _self.querySelector(".hover-reveal").clientWidth,
                    windowHeight = window.innerHeight,
                    windowWidth = window.innerWidth;

            MenuLink.innerHTML = `<span>${MenuText.innerHTML}</span><span class="clone">${MenuText.innerHTML}</span>`

            MenuLink.querySelectorAll("span").forEach(function (item) {
                item.setAttribute("data-splitting", true);
                Splitting();
            });

            _self.addEventListener("mouseenter", function () {
                anime({
                    targets: _self.querySelector(".hover-reveal"),
                    opacity: [0, 1],
                    duration: 1000,
                    easing: "easeOutQuad"
                })

                anime({
                    targets: _self.querySelector(".hover-reveal__inner"),
                    scale: [0.5, 1],
                    easing: "easeOutQuad"
                })

                anime({
                    targets: _self.querySelector(".hover-reveal__img"),
                    scale: [2, 1],
                    easing: "easeOutQuad"
                })
            })

            _self.addEventListener("mouseleave", function () {
                anime({
                    targets: _self.querySelector(".hover-reveal"),
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutQuad"
                })

                anime({
                    targets: _self.querySelector(".hover-reveal__inner"),
                    scale: [1, 0.5],
                    easing: "easeOutQuad"
                })

                anime({
                    targets: _self.querySelector(".hover-reveal__img"),
                    scale: [1, 2],
                    easing: "easeOutQuad"
                })
            })

            if (typeof TweenLite !== "undefined") {
                document.addEventListener("mousemove", function (e) {
                    let posX = e.clientX + 20,
                            posY = e.clientY + 20;

                    TweenLite.to(_self.querySelector(".hover-reveal"), .6, {
                        x: posX + imgWidth > windowWidth ? e.clientX - imgWidth : posX,
                        y: posY + imgHeight > windowHeight ? e.clientY - imgHeight : posY,
                    })
                })
            }
        });
    }
    ThreeDLetterMenuEffect();

    // Minimal portfolio 
    const sticky_container = document.querySelector(".sticky-image-distortion-wrapper");
    if (typeof (sticky_container) != 'undefined' && sticky_container != null) {
        let winsize;
        const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
        calcWinsize();
        window.addEventListener('resize', calcWinsize);

        class Menu {
            constructor() {
                this.DOM = {
                    menu: document.querySelector('.sticky-image-distortion-wrapper nav.menu')
                };
                this.DOM.menuLinks = [...this.DOM.menu.querySelectorAll('.menu__link')];
                this.mousePos = {x: winsize.width / 2, y: winsize.height / 2};
                this.lastMousePos = {
                    translation: {x: winsize.width / 2, y: winsize.height / 2},
                    displacement: {x: 0, y: 0}
                };
                this.dmScale = 0;
                this.current = -1;
                this.initEvents();
                requestAnimationFrame(() => this.render());
            }

            initEvents() {
                document.body.style.setProperty('--body-bgcolor', this.DOM.menuLinks[0].getAttribute("data-bg"))
                let active_item;
                this.DOM.menuLinks.forEach((item, i) => {
                    let imgPath = item.getAttribute('data-img');
                    let bgColor = item.getAttribute('data-bg');
                    item.querySelector(".svg-wrapper").innerHTML = `
                         <svg class="distort" width="960" height="980" viewBox="0 0 960 980">
                             <filter id="distortionFilter${i}">
                                 <feTurbulence type="fractalNoise" baseFrequency="0.01 0.003" numOctaves="5" seed="2" stitchTiles="noStitch" x="0%" y="0%" width="100%" height="100%" result="noise"/>
                                 <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" filterUnits="userSpaceOnUse"/>
                             </filter>
                             <g filter="url(#distortionFilter${i})">
                                 <image class="distort__img" x="80" y="0" xlink:href="${imgPath}" height="980" width="960" />
                             </g>
                         </svg>
                     `
                    const displaceMentEl = [...item.querySelectorAll('feDisplacementMap')]
                    item.addEventListener('mouseenter', (e) => {
                        item.closest(".menu").childNodes.forEach(item => item.classList && item.classList.remove("active"))
                        item.classList.add("active");
                        if (typeof TweenMax !== 'undefined' && typeof TweenMax !== null) {
                            if (item !== active_item) {
                                TweenMax.fromTo(displaceMentEl, 1.2, {attr: {scale: 50}}, {attr: {scale: 0.3}});
                            }
                        }
                        document.body.style.setProperty('--body-bgcolor', bgColor)
                        active_item = item;
                    });

                    item.addEventListener('mouseleave', (e) => {
                        active_item = item;
                    })
                });
            }
            render() {
                requestAnimationFrame(() => this.render());
            }
        }

        new Menu();
    }

    /* ===================================
     Image gallery 
     ====================================== */

    // Image gallery isotope filter 
    if (typeof imagesLoaded === 'function') {
        $('.gallery-wrapper').each(function () {
            var _this = $(this);
            _this.imagesLoaded(function () {
                _this.removeClass('grid-loading');
                if (typeof $.fn.isotope === 'function') {
                    _this.isotope({
                        layoutMode: 'masonry',
                        itemSelector: '.grid-item',
                        percentPosition: true,
                        stagger: 0,
                        masonry: {
                            columnWidth: '.grid-sizer',
                        }
                    });
                }
                isotopeObjs.push(_this);
            });
        });
    }

    // Group gallery light box
    if (typeof $.fn.magnificPopup === 'function') {
        var lightboxgallerygroups = {};
        $('.portfolio-box [data-group], .gallery-box [data-group]').each(function () {
            var id = $(this).attr('data-group');
            if (!lightboxgallerygroups[id]) {
                lightboxgallerygroups[id] = [];
            }
            lightboxgallerygroups[id].push(this);
        });
        $.each(lightboxgallerygroups, function () {
            $(this).magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                closeBtnInside: false,
                gallery: {enabled: true}
            });
        });
    }

    /* ===================================
     Justified gallery
     ====================================== */
    if (typeof imagesLoaded === 'function') {
        if ($('.justified-gallery').length) {
            $('.justified-gallery').each(function () {
                var _this = $(this),
                        justifiedOptions = _this.attr('data-justified-options') || '{ "rowHeight": 400, "maxRowHeight": false, "captions": true, "margins": 10, "waitThumbnailsLoad": true }';
                if (typeof $.fn.justifiedGallery !== 'undefined') {
                    if (typeof (justifiedOptions) !== 'undefined' && justifiedOptions !== null) {
                        _this.imagesLoaded(function () {
                            justifiedOptions = $.parseJSON(justifiedOptions);
                            _this.justifiedGallery(justifiedOptions);
                        });
                    }
                }
            });
        }
    }

    /* ===================================
     Accordion
     ====================================== */

    $('.accordion').each(function () {
        var _this = $(this),
                activeIconClass = _this.attr('data-active-icon') || '',
                inactiveIconClass = _this.attr('data-inactive-icon') || '';
        $('.collapse', this).on('show.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[data-bs-target="#' + id + '"]').closest('.accordion-header').parent('.accordion-item').addClass('active-accordion');
            $('a[data-bs-target="#' + id + '"] i').addClass(activeIconClass).removeClass(inactiveIconClass);
        }).on('hide.bs.collapse', function () {
            var id = $(this).attr('id');
            $('a[data-bs-target="#' + id + '"]').closest('.accordion-header').parent('.accordion-item').removeClass('active-accordion');
            $('a[data-bs-target="#' + id + '"] i').addClass(inactiveIconClass).removeClass(activeIconClass);
        });
    });

    // Accordion on checkout page
    $('.checkout-accordion label input').on('click', function (e) {
        var collapseId = $(this).parent().find('a').attr('href');
        if ($(this).prop("checked")) {
            $(collapseId).collapse('show');
        } else {
            $(collapseId).collapse('hide');
        }
    });

    /* ===================================
     Progress bar
     ====================================== */

    if ($('.progress-bar').length) {
        $(document).on('appear', '.progress-bar', function (e) {
            if (!$(this).hasClass('appear')) {
                $(this).addClass('appear');
                var total = $(this).attr('aria-valuenow'), delay = 300;
                $(this).animate({'width': total + '%'}, {
                    duration: delay,
                    easing: "swing",
                    progress: function (animation, progress, msRemaining) {
                        var counter = parseInt(total * progress);
                        $(this).find('span').html(counter + '%');
                    }
                });
            }
        });
    }

    $('[data-tab="review-tab"]').on('shown.bs.tab', function (e) {
        $('.progress-bar').each(function () {
            $(this).appear().trigger('resize');
        });
    });

  

    /* ===================================
     Counter
     ====================================== */

    // Vertical counter
    $('.vertical-counter').each(function () {
        var _this = $(this),
                counterValue = _this.attr('data-to'),
                individualValue = counterValue.toString().split(''),
                valueLength = counterValue.length;

        // Adding the div.vertical-counter-number in div.counter multiple(valueLength) times
        for (var i = 0; i < valueLength; i++) {
            _this.append('<span class="vertical-counter-number"><ul><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li></ul></span>');
        }

        // Adding the individual data-to in each div.vertical-counter-number
        _this.find('.vertical-counter-number').each(function (index) {
            $(this).attr('data-to', individualValue[index]);
        });
    });

    // Vertical counter on jQuery appear
    if ($('.vertical-counter').length) {

        function calculateHeight() {
            $('.vertical-counter').each(function () {
                var _this = $(this),
                        divHeight = _this.find('.vertical-counter-number').find('li').height();

                $(this).height(divHeight);
            });
        }

        calculateHeight();

        $(window).resize(function () {
            calculateHeight();
        })

        $(document).on('appear', '.vertical-counter', function (e) {
            if (!$(this).hasClass('appear')) {
                $(this).addClass('appear');

                if ($(window).scrollTop() + getWindowHeight() >= $('.vertical-counter').offset().top) {
                    $(this).find('.vertical-counter-number').each(function () {
                        var _this = $(this),
                                value = _this.attr('data-to');
                        if (value <= 9) {
                            anime({
                                targets: this.querySelector('ul'),
                                translateY: [0, `${-value * 10}%`],
                                duration: 2000,
                                easing: 'easeOutCubic'
                            });
                        }
                    });
                }
            }
        });
        $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            let activeTabPane = $(`${$(this).attr('href')}`);

            activeTabPane.find('.vertical-counter').each(function () {
                var _this = $(this),
                        value = _this.attr('data-to'),
                        divHeight = _this.find('li').height();
                _this.height(divHeight);

                if (value <= 9) {
                    _this.find('ul').css({'transform': 'translateY(-' + value * 10 + '%)'});
                }
            });
        });
    }

    $('[data-tab="counter"]').on('shown.bs.tab', function (e) {
        $('.vertical-counter').each(function () {
            $(this).appear().trigger('resize');
        });
    });

    // Counter number reset on jQuery appear
    if (typeof $.fn.countTo === 'function' && $('.counter').length) {
        $(document).on('appear', '.counter', function (e) {
            var _this = $(this);
            if (!_this.hasClass('appear')) {
                var options = _this.data('countToOptions') || {};
                _this.countTo(options);
                _this.addClass('appear');
            }
        });
    }

    // Counter
    function animateCounters() {
        $('.counter').each(function (options) {
            var _this = $(this);
            options = $.extend({}, options || {}, _this.data('countToOptions') || {});
            if (typeof $.fn.countTo === 'function') {
                _this.countTo(options);
            }
        });
    }

    /* ===================================
     Sliding box
     ====================================== */

    function slideboxstyle() {
        $('.sliding-box').each(function (index, value) {
            var valueObj = $(value),
                    totalWidth = valueObj.outerWidth(),
                    slidingLength = valueObj.find('.sliding-box-item').length,
                    devideRightPadding = parseInt(valueObj.css('padding-right')) / slidingLength,
                    devideLeftPadding = parseInt(valueObj.css('padding-left')) / slidingLength,
                    usageWidth = (slidingLength * 30) + 30 + devideRightPadding + devideLeftPadding,
                    useWidth = totalWidth - usageWidth,
                    devideLength = slidingLength + 1,
                    devideWidth = (useWidth / devideLength),
                    activeWidth = devideWidth * 2;

            valueObj.find('.sliding-box-item, .sliding-box-img, .sliding-box-item .sliding-box-content').css('width', devideWidth);
            valueObj.find('.sliding-box-item .sliding-box-content').css('left', devideWidth);
            valueObj.find('.sliding-box-item.active').css('width', activeWidth);

            $(document).on('mouseenter', '.sliding-box .sliding-box-item', function () {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                valueObj.find('.sliding-box-item, .sliding-box-img, .sliding-box-item .sliding-box-content').css('width', devideWidth);
                valueObj.find('.sliding-box-item .sliding-box-content').css('left', devideWidth);
                valueObj.find('.sliding-box-item.active').css('width', activeWidth);
            });
        });
    }

    /* ===================================
     Team
     ====================================== */

    // Team style 01
    function setSpaceInTeamStyle() {
        $('.team-style-01').each(function () {
            let _this = $(this),
                    figure = _this.find('figure'),
                    figcaption = _this.find('figcaption');

            setTimeout(function () {
                figure.css({'padding-bottom': figcaption.outerHeight()});
            }, 200);
        });
    }

    /* ===================================
     Interactive banner
     ====================================== */

    // Interactive banner style 02
    function setSpaceInInteractiveBannerStyle() {
        $('.interactive-banner-style-02').each(function () {
            let _this = $(this),
                    figure = _this.find('figure'),
                    figcaption = _this.find('figcaption');

            setTimeout(function () {
                figure.css({'padding-bottom': figcaption.outerHeight()});
            }, 500);
        });
    }


    /* ===================================
     Anime - animation library
     ====================================== */

    // Anime animation
    function animeAnimation(target, options) {
        let child = target;
        let staggerValue = options.staggervalue || 0;
        let delay = options.delay || 0;
        let anime_animation = anime.timeline();

        function applyTransitionStyles(elements) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                element.style.transition = 'none';
                if (options.willchange) {
                    element.style.willChange = 'transform';
                }
            }
        }

        if (options.el === "childs") {
            child = target.children;
            applyTransitionStyles(target.children);
        }

        if (options.el === "lines") {
            function lineSplitting() {
                const lines = Splitting({target: target, by: 'lines'});
                const line = lines[0].lines.map(item => item.map(i => i.innerHTML).join(" "));
                target.innerHTML = line.map(item => `<span class="d-inline-flex">${item}</span>`).join(' ');
            }
            lineSplitting();
            applyTransitionStyles(target.children);
            child = target.children;
        }

        if (options.el === "words") {
            function lineSplitting() {
                const words = Splitting({target: target, by: 'words'});
                const word = words[0].words.join(" ");
            }
            lineSplitting();
            applyTransitionStyles(target.children);
            child = target.children;
        }

        if (options.perspective) {
            target.style.perspective = `${options.perspective}px`;
        }

        if (options.willchange) {
            target.style.willChange = options.willchange;
        }

        anime_animation.add({
            targets: child,
            ...options,
            delay: anime.stagger(staggerValue, {start: delay}),
            complete: function () {
                if (options.el) {
                    target.classList.add('anime-child');
                    target.classList.add('anime-complete');

                    for (let i = 0; i < target.children.length; i++) {
                        const element = target.children[i];
                        element.style.removeProperty('opacity');
                        element.style.removeProperty('transform');
                        element.style.removeProperty('transition');

                        if (target.classList.contains('grid')) {
                            element.style.transition = 'none';
                        }
                    }

                    if (options.el === "lines") {
                        for (let i = 0; i < target.children.length; i++) {
                            const element = target.children[i];
                            element.classList.remove('d-inline-flex');
                            element.classList.add('d-inline');
                            element.style.willChange = "inherit";
                        }
                    }
                } else {
                    target.classList.add('anime-complete');
                    target.style.removeProperty('opacity');
                    target.style.removeProperty('transform');
                    target.style.removeProperty('transition');
                }
            }
        });
    }

    const $dataAnimeElements = $('[data-anime]:not(.swiper [data-anime])');
    $dataAnimeElements.each(function () {
        const $self = $(this);
        const animeOptions = $self.data('anime');

        if (animeOptions && getWindowWidth() > animeBreakPoint) {
            try {
                const effect = animeOptions.effect && animeOptions.effect.toLowerCase();

                $self.on('appear', function () {
                    if (!$self.hasClass('appear')) {
                        $self.addClass('appear');

                        if (effect === 'slide') {
                            slideAnimation(this, animeOptions);
                        } else {
                            animeAnimation(this, animeOptions);
                        }
                    }

                    if ($self.hasClass('grid')) {
                        $self.find('.grid-sizer').removeAttr('style');
                    }
                });
            } catch (error) {
                console.error('Error parsing anime options:', error);
            }
        } else {
            $self.removeAttr('data-anime');
            $("body").addClass("no-animation");
        }
    });

    // Anime text revealer js
    const slideAnimation = (target, options) => {
        let duration = options.speed ? options.speed : 100,
                direction = options.direction ? options.direction : "lr",
                delay = options.delay ? options.delay : 0;

        target.style.position = 'relative';

        // Create slide panel div
        let tmp = document.createElement('div');
        tmp.style.width = tmp.style.height = '100%';
        tmp.style.top = tmp.style.left = 0;
        tmp.style.background = options.color ? options.color : '#fff';
        tmp.style.position = 'absolute';

        if (direction === 'lr') {
            tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 50%';
            tmp.style.WebkitTransform = tmp.style.transform = 'scaleX(0)';
        } else if (direction === 'tb') {
            tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '50% 0%';
            tmp.style.WebkitTransform = tmp.style.transform = 'scaleY(0)';
        } else if (direction === 'bt') {
            tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 100%';
            tmp.style.WebkitTransform = tmp.style.transform = 'scaleY(0)';
        } else {
            tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 50%';
            tmp.style.WebkitTransform = tmp.style.transform = 'scaleX(0)';
        }
        target.appendChild(tmp);

        // init Anime js.
        let slide_anime = anime.timeline();
        slide_anime.add({
            targets: tmp,
            scaleX: (direction === 'lr' || direction === 'rl') ? [0, 1] : [1, 1],
            scaleY: (direction === 'tb' || direction === 'bt') ? [0, 1] : [1, 1],
            duration: duration + 500,
            easing: 'easeInOutCubic',
            delay: delay,
            complete: function () {
                if (direction === 'lr') {
                    tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 50%';
                } else if (direction === 'tb') {
                    tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '50% 100%';
                } else if (direction === 'bt') {
                    tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 0%';
                } else {
                    tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 50%';
                }

                anime({
                    targets: tmp,
                    duration: duration + 500,
                    easing: 'easeInOutCubic',
                    scaleX: (direction === 'lr' || direction === 'rl') ? [1, 0] : [1, 1],
                    scaleY: (direction === 'tb' || direction === 'bt') ? [1, 0] : [1, 1],
                    complete: function () {
                        target.removeChild(tmp);
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                });
            }
        }).add({
            targets: target.querySelector('*'),
            easing: 'easeOutQuint',
            delay: direction === 'lr' ? anime.stagger(duration, {start: 1000}) : anime.stagger(-duration, {start: 1000}),
            opacity: [0, 1]
        }, "-=900");
    }

    /* ===================================
     Fancy text animation
     ====================================== */

    // Curved text effect
    const curvedTextAnimation = (target, options) => {
        let duration = options.duration ? (options.duration <= 2000 ? 2000 : options.duration) : 2000,
                content = options.string,
                curveText = anime.timeline();

        const lineEq = (y2, y1, x2, x1, currentVal) => {
            var m = (y2 - y1) / (x2 - x1),
                    b = y1 - m * x1;
            return m * currentVal + b;
        }

        curveText.add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            duration: 800,
            easing: 'easeOutElastic',
            opacity: 1,
            translateY: function (el, index) {
                var p = el.parentNode,
                        lastElOffW = p.lastElementChild.offsetWidth,
                        firstElOffL = p.firstElementChild.offsetLeft,
                        w = p.offsetWidth - lastElOffW - firstElOffL - (p.offsetWidth - lastElOffW - p.lastElementChild.offsetLeft),
                        tyVal = lineEq(0, 100, firstElOffL + w / 2, firstElOffL, el.offsetLeft);
                return [Math.abs(tyVal) + '%', '0%'];
            },
            rotateZ: function (el, index) {
                var p = el.parentNode,
                        lastElOffW = p.lastElementChild.offsetWidth,
                        firstElOffL = p.firstElementChild.offsetLeft,
                        w = p.offsetWidth - lastElOffW - p.firstElementChild.offsetLeft - (p.offsetWidth - lastElOffW - p.lastElementChild.offsetLeft),
                        rz = lineEq(90, -90, firstElOffL + w, firstElOffL, el.offsetLeft);
                return [rz, 0];
            }
        }).add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            duration: 1000,
            easing: 'easeInExpo',
            opacity: content.length > 1 ? 0 : 1,
            translateY: function (el, index) {
                var p = el.parentNode,
                        lastElOffW = p.lastElementChild.offsetWidth,
                        firstElOffL = p.firstElementChild.offsetLeft,
                        w = p.offsetWidth - lastElOffW - firstElOffL - (p.offsetWidth - lastElOffW - p.lastElementChild.offsetLeft),
                        tyVal = lineEq(0, 100, firstElOffL + w / 2, firstElOffL, el.offsetLeft);
                return content.length > 1 ? [-Math.abs(tyVal) + '%'] : [Math.abs(tyVal) + '%', '0%'];
            },
            rotateZ: function (el, index) {
                var p = el.parentNode,
                        lastElOffW = p.lastElementChild.offsetWidth,
                        firstElOffL = p.firstElementChild.offsetLeft,
                        w = p.offsetWidth - lastElOffW - p.firstElementChild.offsetLeft - (p.offsetWidth - lastElOffW - p.lastElementChild.offsetLeft),
                        rz = lineEq(-90, 90, firstElOffL + w, firstElOffL, el.offsetLeft);
                return content.length > 1 ? [rz] : [rz, 0];
            }
        }, duration - 1500);
    }

    // Slide text effect
    const slideTextAnimation = (target, options) => {
        let current_anime_text = target.querySelectorAll('.anime-text')[0],
                speed = options.speed ? options.speed : 100;

        current_anime_text.style.position = 'relative';

        // Create slide panel div
        let tmp = document.createElement('div');
        tmp.style.width = tmp.style.height = '100%';
        tmp.style.top = tmp.style.left = 0;
        tmp.style.background = options.color ? options.color : '#fff';
        tmp.style.position = 'absolute';
        tmp.style.WebkitTransform = tmp.style.transform = 'scaleX(0)';
        tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 50%';

        if (options.direction === 'left') {
            tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 50%';
        }
        current_anime_text.appendChild(tmp);

        // init Anime js.
        let slide_anime = anime.timeline();
        slide_anime.add({
            targets: current_anime_text.querySelectorAll('div'),
            scaleX: [0, 1],
            duration: speed + 500,
            easing: 'easeInOutCubic',
            complete: function () {
                if (options.direction === 'left') {
                    tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 50%';
                } else {
                    tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 50%';
                }

                anime({
                    targets: tmp,
                    duration: speed + 500,
                    easing: 'easeInOutCubic',
                    scaleX: [1, 0],
                    complete: function () {
                        current_anime_text.removeChild(tmp);
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                });
            }
        }).add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            easing: 'easeOutQuint',
            delay: options.direction === 'left' ? anime.stagger(speed, {start: 1000}) : anime.stagger(-speed, {start: 1000}),
            opacity: [0, 1],
            translateX: options.direction === 'left' ? [100, 0] : [-100, 0]
        }, "-=600");
    }

    // Wave text effect
    const waveTextAnimation = (target, options) => {
        let duration = options.duration ? options.duration : 3000,
                direction = options.direction,
                content = options.string,
                speed = options.speed,
                waveText = anime.timeline();

        waveText.add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            opacity: [0, 1],
            translateY: direction === 'down' ? [-20, 0] : [20, 0],
            delay: anime.stagger(speed ? speed : 50)
        }).add({
            targets: target.querySelectorAll('.anime-text .word .char'),
            opacity: content.length > 1 ? [1, 0] : [1, 1],
            translateY: content.length > 1 ? (direction === 'down' ? [0, 20] : [0, -20]) : [0, 0],
            delay: anime.stagger(speed ? speed : 50, {start: duration - 1500})
        });
    }

    // Smooth wave text effect
    const smoothWaveTextAnimation = (target, options) => {
        let duration = options.duration ? options.duration : 3000,
                direction = options.direction,
                content = options.string,
                speed = options.speed,
                smoothWaveText = anime.timeline();

        smoothWaveText.add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            opacity: [0, 1],
            translateY: direction === 'down' ? [-50, 0] : [50, 0],
            duration: 500,
            easing: 'easeOutQuad',
            delay: anime.stagger(speed ? speed : 40, {direction: 'reverse'}),
        }).add({
            targets: target.querySelectorAll('.anime-text .word .char'),
            opacity: content.length > 1 ? [1, 0] : [1, 1],
            translateY: content.length > 1 ? (direction === 'down' ? 50 : -50) : 0,
            duration: 500,
            easing: 'easeOutQuad',
            delay: anime.stagger(speed ? speed : 40, {start: duration - 1000, direction: 'reverse'})
        });
    }

    // Rotate text effect
    const rotateTextAnimation = (target, options) => {
        let duration = options.duration ? options.duration : 3000,
                content = options.string,
                speed = options.speed,
                rotateText = anime.timeline();

        rotateText.add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            opacity: [0, 1],
            rotateX: [-70, 0],
            duration: 150,
            delay: anime.stagger(speed ? speed : 50),
            easing: "linear"
        }).add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            opacity: content.length > 1 ? 0 : 1,
            rotateX: content.length > 1 ? [0, 70] : [0, 0],
            duration: 150,
            delay: anime.stagger(speed ? speed : 50, {start: duration - 1500}),
            easing: "linear"
        });
    }

    // Jump text effect
    const jumpTextAnimation = (target, options) => {
        let duration = options.duration ? options.duration : 3000,
                content = options.string,
                speed = options.speed,
                delay = options.delay,
                movingLetter9 = anime.timeline();

        movingLetter9.add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            scale: [0, 1],
            duration: 1500,
            elasticity: 600,
            transformOrigin: '50% 100%',
            delay: anime.stagger(speed ? speed : 45, {start: delay})
        }).add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            opacity: content.length > 1 ? 0 : 1,
            scale: content.length > 1 ? 0 : 1,
            duration: 500,
            easing: "easeOutExpo",
            delay: anime.stagger(speed ? speed : 45)
        }, `+=${duration - 2300}`);
    }

    // Zoom text effect
    const zoomTextAnimation = (target, options) => {
        let duration = options.duration ? options.duration : 3000,
                content = options.string,
                speed = options.speed,
                movingLetter2 = anime.timeline();

        movingLetter2.add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            scale: [4, 1],
            opacity: [0, 1],
            translateZ: 0,
            easing: "easeOutExpo",
            duration: 950,
            delay: anime.stagger(speed ? speed : 70)
        }).add({
            targets: target.querySelectorAll('.anime-text > .word'),
            opacity: content.length > 1 ? 0 : 1,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        }, `+=${duration - 2500}`);
    }

    // Rubber band text effect
    const rubberbandTextAnimation = (target, options) => {
        let duration = options.duration ? options.duration : 3000,
                content = options.string,
                speed = options.speed,
                direction = options.direction,
                rubberband = anime.timeline();

        rubberband.add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            translateX: direction === "right" ? [-40, 0] : [40, 0],
            translateZ: 0,
            opacity: [0, 1],
            easing: "easeOutExpo",
            duration: 1200,
            delay: anime.stagger(speed ? speed : 75, {direction: direction === "right" ? 'reverse' : 'normal'})
        }).add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            translateX: content.length > 1 ? (direction === "left" ? -40 : 40) : 0,
            opacity: content.length > 1 ? 0 : 1,
            easing: "easeInExpo",
            duration: 500,
            delay: anime.stagger(speed ? speed : 75, {start: duration - 2500, direction: direction === "right" ? 'reverse' : 'normal'})
        });
    }

    // Fade text effect
    const fadeTextAnimation = (target, options) => {
        let duration = options.duration ? options.duration : 3000,
                content = options.string,
                speed = options.speed,
                fade = anime.timeline();

        fade.add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            translateY: [100, 0],
            translateZ: 0,
            opacity: [0, 1],
            easing: "easeOutExpo",
            delay: anime.stagger(speed ? speed : 30)
        }).add({
            targets: target.querySelectorAll('.anime-text > .word > .char'),
            translateY: content.length > 1 ? [0, -100] : [0, 0],
            opacity: content.length > 1 ? [1, 0] : [1, 1],
            easing: "easeInExpo",
            delay: anime.stagger(speed ? speed : 40, {start: duration - 3000})
        });
    }

    // Fancy text 
    function FancyTextDefault(item, ftOptions) {
        let text_effect = ftOptions.effect,
                duration = ftOptions.duration ? ftOptions.duration : 3000,
                content = ftOptions.string,
                speed = ftOptions.speed,
                delay = ftOptions.delay;

        if (content) {
            item.innerHTML = `<span class="anime-text">${content[0]}</span>`;
            item.querySelector('.anime-text').setAttribute('data-splitting', true);
            Splitting();

            if (getWindowWidth() > animeBreakPoint) {
                switch (text_effect) {
                    case 'wave':
                        waveTextAnimation(item, ftOptions);
                        break;

                    case 'smooth-wave':
                        smoothWaveTextAnimation(item, ftOptions);
                        break;

                    case 'curve':
                        curvedTextAnimation(item, ftOptions);
                        break;

                    case 'rotate':
                        rotateTextAnimation(item, ftOptions);
                        break;

                    case 'slide':
                        slideTextAnimation(item, ftOptions);
                        break;

                    case 'jump':
                        jumpTextAnimation(item, ftOptions);
                        break;

                    case 'zoom':
                        zoomTextAnimation(item, ftOptions);
                        break;

                    case 'rubber-band':
                        rubberbandTextAnimation(item, ftOptions);
                        break;

                    case 'fade':
                        fadeTextAnimation(item, ftOptions);
                        break;

                    default:
                }

                if (text_effect === undefined) {
                    anime({
                        targets: item.querySelectorAll('.anime-text > .word > .char'),
                        ...ftOptions,
                        delay: anime.stagger(speed ? speed : 0, {start: delay ? delay : 0})
                    })
                }
            }

            if (content.length > 1) {
                let counter = 1;
                setInterval(function () {
                    let new_el = document.createElement('span');
                    new_el.classList.add('anime-text');
                    new_el.innerHTML = content[counter];
                    new_el.setAttribute('data-splitting', true);

                    item.querySelector('.anime-text').replaceWith(new_el);
                    Splitting();
                    counter++;

                    if (counter === content.length) {
                        counter = 0;
                    }

                    switch (text_effect) {
                        case 'wave':
                            waveTextAnimation(item, ftOptions);
                            break;

                        case 'smooth-wave':
                            smoothWaveTextAnimation(item, ftOptions);
                            break;

                        case 'curve':
                            curvedTextAnimation(item, ftOptions);
                            break;

                        case 'rotate':
                            rotateTextAnimation(item, ftOptions);
                            break;

                        case 'slide':
                            slideTextAnimation(item, ftOptions);
                            break;

                        case 'jump':
                            jumpTextAnimation(item, ftOptions);
                            break;

                        case 'zoom':
                            zoomTextAnimation(item, ftOptions);
                            break;

                        case 'rubber-band':
                            rubberbandTextAnimation(item, ftOptions);
                            break;

                        case 'fade':
                            fadeTextAnimation(item, ftOptions);
                            break;

                        default:
                    }

                    if (text_effect === undefined) {
                        anime({
                            targets: item.querySelectorAll('.anime-text > .word > .char'),
                            ...ftOptions,
                            delay: anime.stagger(speed ? speed : 0, {start: delay ? delay : 0})
                        });
                    }
                }, duration);
            }
        }
    }

    $('[data-fancy-text]').each(function () {
        const _this = $(this);
        const ftOptions = _this.data('fancy-text');
        if (ftOptions) {
            if (_this.hasClass('swiper-parallax-fancy-text')) {
                FancyTextDefault(this, ftOptions);
            } else {
                _this.on('appear', function () {
                    if (!_this.hasClass('appear')) {
                        _this.addClass('appear');
                        FancyTextDefault(this, ftOptions);
                    }
                });
            }
        }
    });


    /* ===================================
     Magnific popup
     ====================================== */
    if (typeof $.fn.magnificPopup === 'function') {
        // Modal popup
        $('.modal-popup').magnificPopup({
            type: 'inline',
            preloader: false,
            blackbg: true
        });

        // Modal popup close
        $(document).on('click', '.popup-modal-dismiss', function (e) {
            e.preventDefault();
            $.magnificPopup.close();
        });

        // Modal popup - zoom animation
        $('.popup-with-zoom-anim').magnificPopup({
            type: 'inline',
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 300,
            blackbg: true,
            mainClass: 'my-mfp-zoom-in'
        });

        // Modal popup - move animation
        $('.popup-with-move-anim').magnificPopup({
            type: 'inline',
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 300,
            blackbg: true,
            mainClass: 'my-mfp-slide-bottom'
        });

        // Modal popup - slide up animation
        $('.slide-up-animation').magnificPopup({
            type: 'inline',
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 300,
            blackbg: true,
            mainClass: 'my-mfp-slide-up'
        });

        // Popup with form
        $('.popup-with-form').magnificPopup({
            type: 'inline',
            preloader: false,
            fixedContentPos: true,
            focus: '#name',
            callbacks: {
                beforeOpen: function () {
                    if ($(window).width() < 700) {
                        this.st.focus = false;
                    } else {
                        this.st.focus = '#name';
                    }
                }
            }
        });

        // Video magnific popup
        $('.popup-youtube, .popup-vimeo, .popup-googlemap').magnificPopup({
            disableOn: 320,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: true,
            closeBtnInside: false
        });

        // Ajax magnific popup
        $('.ajax-popup').magnificPopup({
            type: 'ajax',
            alignTop: true,
            fixedContentPos: true,
            closeBtnInside: false,
            overflowY: 'scroll', // as we know that popup content is tall we set scroll overflow by default to avoid jump
            callbacks: {
                open: function () {
                    $('.navbar .collapse').removeClass('show');
                    $('.navbar a.dropdown-toggle').addClass('collapsed');
                }
            }
        });
    }

    /* ===================================
     Contact form validation
     ====================================== */

    // Contact form validation on submit
    $(document).on('click', '.submit', function () {
        var error = false,
                _this = $(this),
                formObj = _this.parents('form'),
                emailFormat = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
                urlformat = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
                telFormat = /[0-9 -()+]+$/,
                actionURL = formObj.attr('action'),
                resultsObj = formObj.find('.form-results'),
                grecaptchav3= _this.attr( 'data-sitekey' ) || '',
                redirectVal = formObj.find('[name="redirect"]').val();
        formObj.find('.required').removeClass('is-invalid');
        formObj.find('.required').each(function () {
            var __this = $(this),
                    fieldVal = __this.val();
            if (fieldVal == '' || fieldVal == undefined) {
                error = true;
                __this.addClass('is-invalid');
            } else if (__this.attr('type') == 'email' && !emailFormat.test(fieldVal)) {
                error = true;
                __this.addClass('is-invalid');
            } else if (__this.attr('type') == 'url' && !urlformat.test(fieldVal)) {
                error = true;
                __this.addClass('is-invalid');
            } else if (__this.attr('type') == 'tel' && !telFormat.test(fieldVal)) {
                error = true;
                __this.addClass('is-invalid');
            }
        });
        var termsObj = formObj.find('.terms-condition');
        if (termsObj.length) {
            if (!termsObj.is(':checked')) {
                error = true;
                termsObj.addClass('is-invalid');
            }
        }

        // Google reCaptcha verify
        if ( typeof ( grecaptcha ) !== 'undefined' && grecaptcha !== null ) {
            if (formObj.find('.g-recaptcha').length) {
                var gResponse = grecaptcha.getResponse();
                if (!(gResponse.length)) {
                    error = true;
                    formObj.find('.g-recaptcha').addClass('is-invalid');
                }
            } else if( grecaptchav3 != '' && grecaptchav3 != undefined ) { // For Version 3
                grecaptcha.ready(function() {
                  grecaptcha.execute(grecaptchav3, {action: 'submit'}).then(function(token) {
                  });
                });
            }
        }

        if (!error && actionURL != '' && actionURL != undefined) {
            _this.addClass('loading');
            $.ajax({
                type: 'POST',
                url: actionURL,
                data: formObj.serialize(),
                success: function (result) {
                    _this.removeClass('loading');
                    if (redirectVal != '' && redirectVal != undefined) {
                        window.location.href = redirectVal;
                    } else {
                        if (typeof (result) !== 'undefined' && result !== null) {
                            result = $.parseJSON(result);
                        }
                        formObj.find('input[type=text],input[type=url],input[type=email],input[type=tel],input[type=password],textarea').each(function () {
                            $(this).val('');
                            $(this).removeClass('is-invalid');
                        });
                        formObj.find('.g-recaptcha').removeClass('is-invalid');
                        formObj.find('input[type=checkbox],input[type=radio]').prop('checked', false);
                        if (formObj.find('.g-recaptcha').length) {
                            grecaptcha.reset();
                        }
                        resultsObj.removeClass('alert-success').removeClass('alert-danger').hide();
                        resultsObj.addClass(result.alert).html(result.message);
                        resultsObj.removeClass('d-none').fadeIn('slow').delay(4000).fadeOut('slow');
                    }
                }
            });
        }
        return false;
    });

    // Contact form validation on blur
    $(document).on('blur', '.required', function () {
        var emailFormat = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
                telFormat = /[0-9 -()+]+$/,
                urlformat = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
                fieldVal = $(this).val();
        if (fieldVal == '' || fieldVal == undefined) {
            $(this).addClass('is-invalid');
        } else if ($(this).attr('type') == 'email' && !emailFormat.test(fieldVal)) {
            $(this).addClass('is-invalid');
        } else if ($(this).attr('type') == 'url' && !urlformat.test(fieldVal)) {
            $(this).addClass('is-invalid');
        } else if ($(this).attr('type') == 'tel' && !telFormat.test(fieldVal)) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });

    // Validate terms and conditions in form
    $(document).on('click', '.terms-condition', function () {
        var termsObj = $(this);
        if (!termsObj.is(':checked')) {
            termsObj.addClass('is-invalid');
        } else {
            termsObj.removeClass('is-invalid').addClass('is-valid');
        }
    });

    /* ===================================
     Revolution slider
     ====================================== */

    // Reinit skroller after revolution slider loaded
    if ($('.rev_slider').length) {
        $('.rev_slider').each(function () {
            $(this).one('revolution.slide.onloaded', function () {
                reInitSkrollr();
            });
        });
    }

 

    /* ===================================
     Page loader
     ====================================== */

    $(window).on("load", function () {
        $('.page-loader').show();
        setTimeout(function () {
            $('.page-loader').hide();
        }, 1000);
    });

    /* ===================================
     Window resize
     ====================================== */

    $(window).resize(function () {
        slideboxstyle();
        setParallax();
        initScrollNavigate();
        setOverLayerPosition();
        setBottomOverLayerPosition(100);
        setSpaceInInteractiveBannerStyle();

        // Update custom scrollbar for full screen & modern menu
        if ($('.navbar-collapse-clone').length && typeof $.fn.mCustomScrollbar === 'function') {
            $('.navbar-collapse-clone').mCustomScrollbar('update');
        }

        // Reset isotope
        if (!isMobile) {
            setTimeout(function () {
                resetIsotopeLayoutLoop(isotopeObjs, true);
            }, 300);
        }

        if ($(window).width() <= 1199) {
            destroyAtropos();
            destroySkrollr();
        } else {
            if (typeof Atropos !== 'undefined' && typeof Atropos !== null) {
                initAtropos();
            }
            initSkrollr();
        }
    });

    /* ===================================
     Window orientation change
     ====================================== */

    $(window).on('orientationchange', function (e) {

        // Top overlap section position
        setOverLayerPosition();

        // Bottom overlap section position
        setBottomOverLayerPosition();

        // Set full screen height & top space
        setTimeout(function () {
            fullScreenHeight();
            setTopSpaceHeight();
        }, headerTransition); // Header transition effect time

        // Close all menu
        $('.navbar-collapse.collapse').collapse('hide');
        // Close push menu
        $('html, body').removeClass('show-menu');
        // Close search
        $('body').removeClass('show-search-popup');
        // Header color remove
        $('header nav').removeClass('submenu-light').removeClass('submenu-dark');
        // Close all dropdown menu
        $('.dropdown').trigger('mouseleave');
        // Close left submenu
        $('.sub-menu.show').collapse('hide');
        // Close left simple menu
        $('.left-sidebar-header').collapse('hide');
        stickyKitRecalc();
        // Close left modern menu
        $('.left-modern-header').collapse('hide');
    });

    /* ===================================
     Window scroll
     ====================================== */

    $(window).on('scroll', initScrollNavigate);

    // Window scroll Function
    function initScrollNavigate() {

        var scrollPos = $(window).scrollTop();

        // One page navigation
        var menuLinks = $('.navbar-nav li a');
        menuLinks.each(function () {
            var _this = $(this);
            var hasPos = _this.attr('href').indexOf('#');
            if (hasPos > -1) {
                var res = _this.attr('href').substring(hasPos);
                if (res != '' && res != '#' && $(res).length) {
                    var refElement = $(_this.attr('href'));
                    if (refElement.position().top <= (scrollPos + 60) && refElement.position().top + refElement.height() > (scrollPos + 60)) {
                        menuLinks.removeClass('active');
                        _this.addClass('active');
                    }
                    if (scrollPos < 1) {
                        _this.removeClass('active');
                    }
                }
            }
        });

        // Sticky nav Start
        var navHeight = 0,
                miniHeaderHeight = 0;
        if ($('header nav.navbar').length) {
            navHeight = $('header nav.navbar').outerHeight();
        }
        if ($('.header-top-bar').length) {
            miniHeaderHeight = $('.header-top-bar').outerHeight();
        }
        var headerHeight = navHeight + miniHeaderHeight;
        if (!$('header').hasClass('no-sticky')) {
            if (scrollPos >= headerHeight) {
                $('header').addClass('sticky');
                if (!$('.header-top-bar').is(':hidden')) {
                    $('.header-top-bar').css({'top': '-' + (miniHeaderHeight) + 'px'});
                    $('.header-top-bar + .navbar').css({'top': '0px'});
                } else {
                    $('.header-top-bar, .header-top-bar + .navbar').css({'top': ''});
                }
            } else if (scrollPos <= headerHeight) {
                $('header').removeClass('sticky');
                if (!$('.header-top-bar').is(':hidden')) {
                    $('.header-top-bar').css({'top': '0px'});
                    $('.header-top-bar + .navbar').css({'top': (miniHeaderHeight) + 'px'});
                } else {
                    $('.header-top-bar, .header-top-bar + .navbar').css({'top': ''});
                }
            }
        }

        // Header sticky
        if (scrollPos > (headerHeight + 150)) {
            setTimeout(function () {
                $('header').addClass('sticky-active');
            }, headerTransition); // Header transition effect time
        }
        if (scrollPos < headerHeight) {
            setTimeout(function () {
                $('header').removeClass('sticky-active');
            }, headerTransition); // Header transition effect time
        }

        // Hide side menu on scroll
        if (scrollPos >= 200 && getWindowWidth() > menuBreakPoint) {

            // Close all dropdown menu
            $('.dropdown').trigger('mouseleave');
        }

        // Scroll to top
        if (scrollPos > 150) {
            $('.scroll-top-arrow').fadeIn('300');
        } else {
            $('.scroll-top-arrow').fadeOut('300');
        }
        
        if ( $( 'nav.header-reverse-back-scroll' ).length > 0 ) {
            var st = scrollPos;
            if ( st > lastScroll ) {
                st = st - 1;
                $( 'header' ).removeClass( 'sticky-appear' );
            } else {
                $('header').addClass('sticky-appear');
            }
            lastScroll = st;
            if ( lastScroll <= headerHeight ) {
                $( 'header' ).removeClass( 'sticky-appear' );
            }
        }

        // Set full screen height & top space
        if (scrollPos <= 0) {
            setTimeout(function () {
                fullScreenHeight();
                setTopSpaceHeight();
            }, headerTransition); // Header transition effect time
        }

        lastScroll = scrollPos;
    }

    /* ===================================
     Utility functions start
     ====================================== */

    // Check formatted number
    function pad(d) {
        return (d < 10) ? '0' + d.toString() : d.toString();
    }

    // Check IE browser
    function isIE() {
        var ua = window.navigator.userAgent,
                msie = ua.indexOf('MSIE ');
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        } else {
            return false;
        }
        return false;
    }

    // Get window height
    function getWindowHeight() {
        return $(window).height();
    }

    // Get window width
    function getWindowWidth() {
        return $(window).width();
    }

    // Full screen
    function fullScreenHeight() {
        var fullScreenObj = $('.full-screen'),
                minHeight = getWindowHeight(),
                headerHeight = getHeaderHeight();
        if (!$('header').hasClass('sticky')) {
            fullScreenObj.parents('section').imagesLoaded(function () {
                if ($('section:first.full-screen, section:first .full-screen').length && ($('.top-space-margin').length || $('.mobile-top-space').length) || $('.ipad-top-space-margin').length) {
                    if ($('.ipad-top-space-margin').length) {
                        if (getWindowWidth() <= menuBreakPoint) {
                            $('section:first.full-screen, section:first .full-screen').css('height', minHeight - headerHeight);
                        } else {
                            $('section:first.full-screen, section:first .full-screen').css('height', minHeight);
                        }
                    } else {
                        $('section:first.full-screen, section:first .full-screen').css('height', minHeight - headerHeight);
                    }
                } else if ($('header nav.navbar').hasClass('top-space-margin') || $('header nav.navbar').hasClass('mobile-top-space')) {
                    if ($('header nav.navbar').hasClass('ipad-top-space-margin')) {
                        if (getWindowWidth() <= menuBreakPoint) {
                            minHeight = minHeight - $('header nav.navbar').outerHeight();
                        }
                    } else {
                        minHeight = minHeight - $('header nav.navbar').outerHeight();
                    }
                    fullScreenObj.css('height', minHeight);
                } else {
                    fullScreenObj.css('height', minHeight);
                }
            });
        }
    }

    // Get cookie
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // Set cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = (exdays != 0 && exdays != '') ? d.toUTCString() : 0;
        document.cookie = cname + "=" + cvalue + ";expires=" + expires + ";path=/";
    }

    /* ===================================
     Swiper slider
     ====================================== */

    // Setup swiper slider
    function setupSwiper() {

        // Swiper slider using params
        var swipers = document.querySelectorAll('[data-slider-options]:not(.instafeed-wrapper)');
        swipers.forEach(function (swiperItem) {
            var _this = $(swiperItem),
                    sliderOptions = _this.attr('data-slider-options');
            if (typeof (sliderOptions) !== 'undefined' && sliderOptions !== null) {

                sliderOptions = $.parseJSON(sliderOptions);

                // If user have provided "data-slide-change-on-click" attribute then below code will execute
                var changeOnClick = _this.attr('data-slide-change-on-click');
                if (changeOnClick != '' && changeOnClick != undefined && changeOnClick == '1') {

                    sliderOptions['on'] = {
                        click: function () {
                            if (this.activeIndex > this.clickedIndex) {
                                this.slidePrev();
                            } else if (this.activeIndex < this.clickedIndex) {
                                this.slideNext();
                            }
                        }
                    };
                }

                /* If user have provided "data-thumb-slider-md-direction" attribute then below code will execute */
                if (sliderOptions['thumbs'] != '' && sliderOptions['thumbs'] != undefined) {

                    var mdThumbDirection = _this.attr('data-thumb-slider-md-direction');
                    if (mdThumbDirection != '' && mdThumbDirection != undefined) {

                        var thumbDirection = (sliderOptions['thumbs']['swiper']['direction'] != '' && sliderOptions['thumbs']['swiper']['direction'] != undefined) ? sliderOptions['thumbs']['swiper']['direction'] : mdThumbDirection;
                        sliderOptions['thumbs']['swiper']['on'] = {
                            init: function () {
                                if (getWindowWidth() <= sliderBreakPoint) {
                                    this.changeDirection(mdThumbDirection);
                                } else {
                                    this.changeDirection(thumbDirection);
                                }
                                this.update();
                            },
                            resize: function () {
                                if (getWindowWidth() <= sliderBreakPoint) {
                                    this.changeDirection(mdThumbDirection);
                                } else {
                                    this.changeDirection(thumbDirection);
                                }
                                this.update();
                            },
                            click: function () {
                                /* Product thumbs automatic next / previous on click slide */
                                if (this.activeIndex == this.clickedIndex) {
                                    this.slidePrev();
                                } else {
                                    this.slideNext();
                                }
                            }
                        };
                    }
                }

                // If user have provided "data-number-pagination" attribute then below code will execute
                var numberPagination = _this.attr('data-number-pagination');
                if (numberPagination != '' && numberPagination != undefined && numberPagination == '1' && sliderOptions['pagination'] != '' && sliderOptions['pagination'] != undefined) {
                    sliderOptions['pagination']['renderBullet'] = function (index, className) {
                        return '<span class="' + className + '">' + pad(index + 1) + '</span>';
                    }
                }

                // If user have provided "data-thumbs" attribute then below code will execute
                var dataThumbs = _this.attr('data-thumbs');
                if (dataThumbs != '' && dataThumbs != undefined && sliderOptions['pagination'] != '' && sliderOptions['pagination'] != undefined) {
                    dataThumbs = $.parseJSON(dataThumbs);
                    if (typeof (dataThumbs) !== 'undefined' && dataThumbs !== null) {
                        sliderOptions['pagination']['renderBullet'] = function (index, className) {
                            return '<span class="' + className + '" style="background-image: url( ' + dataThumbs[index] + ' )"></span>';
                        }
                    }
                }

                sliderOptions['on'] = {
                    init: function () {
                        let slides = this.slides;
                        let activeIndex = this.activeIndex,
                                current_slide = this.slides[activeIndex],
                                anime_el = current_slide.querySelectorAll('[data-anime]'),
                                fancy_el = current_slide.querySelectorAll('[data-fancy-text]');

                        if (getWindowWidth() > animeBreakPoint) {
                            if (anime_el) {
                                anime_el.forEach(element => {
                                    let options = element.getAttribute('data-anime');

                                    if (typeof (options) !== 'undefined' && options !== null) {
                                        options = $.parseJSON(options);

                                        element.classList.add('appear');
                                        element.style.transition = "none";

                                        if (options.el) {
                                            for (let i = 0; i < element.children.length; i++) {
                                                element.children[i].style.transition = "none";
                                                element.children[i].classList.add('appear');
                                            }
                                        }
                                        animeAnimation(element, options);
                                        element.classList.remove('appear');
                                    }
                                });
                            }
                        }
                    },
                    slideChange: function () {
                        // Get active slide
                        let slides = this.slides;
                        let activeIndex = this.activeIndex,
                                current_slide = this.slides[activeIndex],
                                anime_el = current_slide.querySelectorAll('[data-anime]'),
                                fancy_el = current_slide.querySelectorAll('[data-fancy-text]');

                        if (getWindowWidth() > animeBreakPoint) {
                            if (fancy_el) {
                                fancy_el.forEach(element => {
                                    element.classList.add('appear');
                                    let fancy_options = element.getAttribute('data-fancy-text');
                                    if (typeof (fancy_options) !== 'undefined' && fancy_options !== null) {
                                        fancy_options = $.parseJSON(fancy_options);
                                        let child = element;

                                        FancyTextDefault(child, fancy_options);
                                        element.classList.remove('appear');
                                    }
                                });
                            }

                            if (anime_el) {
                                anime_el.forEach(element => {
                                    let options = element.getAttribute('data-anime');

                                    if (typeof (options) !== 'undefined' && options !== null) {
                                        options = $.parseJSON(options);

                                        element.classList.add('appear');
                                        element.style.transition = "none";

                                        if (options.el) {
                                            for (let i = 0; i < element.children.length; i++) {
                                                element.children[i].style.transition = "none";
                                                element.children[i].classList.add('appear');
                                            }
                                        }
                                        animeAnimation(element, options);
                                        element.classList.remove('appear');
                                    }
                                });
                            }
                        }
                    }
                };

                // If swiper has number navigation
                var isNumberPagination = _this.attr('data-swiper-number-line-pagination') || false;
                var isNumberNavigation = _this.attr('data-swiper-number-navigation') || false;
                var isNumberPaginationProgress = _this.attr('data-swiper-number-pagination-progress') || false;
                var showProgress = _this.attr('data-swiper-show-progress') || false;
                var hasGalleryBox = _this.attr('data-gallery-box') || false;
                if (isNumberPagination || isNumberNavigation || isNumberPaginationProgress || hasGalleryBox) {
                    sliderOptions['on'] = {
                        init: function () {
                            if (isNumberPagination || isNumberNavigation || isNumberPaginationProgress) {
                                if (sliderOptions.hasOwnProperty('loop') && sliderOptions['loop']) {
                                    var slideLength = this.slides.length;
                                }
                                var length = slideLength;
                                if (isNumberPaginationProgress) {
                                    _this.parent().find('.number-next').text('0' + length);
                                    _this.parent().find('.number-prev').text('01');
                                    _this.parent().find('.swiper-pagination-progress')[0].style.setProperty('--swiper-progress', (100 / length).toFixed(2) + '%');
                                } else {
                                    _this.parent().find('.number-next').text('02');
                                    _this.parent().find('.number-prev').text('0' + length);
                                    if (showProgress)
                                        _this.parent().find('.swiper-pagination-progress')[0].style.setProperty('--swiper-progress', (100 / length).toFixed(2) + '%');
                                }
                            }
                            if (typeof $.fn.magnificPopup === 'function') {
                                if (hasGalleryBox) {
                                    _this.magnificPopup({
                                        delegate: 'a',
                                        type: 'image',
                                        closeOnContentClick: true,
                                        closeBtnInside: false,
                                        gallery: {enabled: true}
                                    });
                                }
                            }
                        },
                        slideChange: function () {
                            if (isNumberPagination || isNumberNavigation || isNumberPaginationProgress) {
                                if (sliderOptions.hasOwnProperty('loop') && sliderOptions['loop']) {
                                    var slideLength = this.slides.length;
                                }
                                var length = this.slides.length,
                                        active = (this.realIndex) + 1,
                                        next = active + 1,
                                        prev = active - 1;
                                if (active == 1) {
                                    prev = length;
                                }
                                if (active == length) {
                                    next = 1;
                                }
                                if (isNumberPaginationProgress) {
                                    _this.parent().find('.number-prev').each(function () {
                                        $(this).text(active < 10 ? '0' + active : active);
                                    });
                                    _this.parent().find('.swiper-pagination-progress')[0].style.setProperty('--swiper-progress', ((100 / length) * active).toFixed(2) + '%');
                                } else {
                                    _this.parent().find('.number-next').each(function () {
                                        $(this).text(next < 10 ? '0' + next : next);
                                    });
                                    _this.parent().find('.number-prev').each(function () {
                                        $(this).text(prev < 10 ? '0' + prev : prev);
                                    });
                                    if (showProgress)
                                        _this.parent().find('.swiper-pagination-progress')[0].style.setProperty('--swiper-progress', ((100 / length) * active).toFixed(2) + '%');
                                }
                            }
                        }
                    }
                }

                // Move thumb slide on click in product page.
                var thumbClick = _this.attr('data-swiper-thumb-click') || false;
                if (thumbClick && sliderOptions.hasOwnProperty('thumbs')) {
                    sliderOptions['thumbs']['swiper']['on'] = {
                        click: function (swiper) {
                            if (swiper.activeIndex >= swiper.clickedIndex) {
                                swiper.slidePrev();
                            } else if (swiper.activeIndex < swiper.clickedIndex) {
                                swiper.slideNext();
                            }
                        }
                    }
                }

                if (typeof Swiper === 'function') {
                    _this.imagesLoaded(function () {
                        var swiperObj = new Swiper(swiperItem, sliderOptions);
                        swiperObjs.push(swiperObj);
                    });
                }
            }
        });
    }

    /* ===================================
     Parallax background
     ====================================== */

    function setParallax() {
        if (!isIE()) {
            if (typeof $.fn.parallax !== 'undefined' && typeof $.fn.parallax !== null) {
                $('[data-parallax-background-ratio]').each(function () {
                    var ratio = $(this).attr('data-parallax-background-ratio') || 0.5;
                    $(this).parallax('50%', ratio);
                });
                $('[data-parallax-layout-ratio]').each(function () {
                    var ratio = $(this).attr('data-parallax-layout-ratio') || 1;
                    $(this).parallaxImg(ratio);
                });
            }

            $('[data-parallax-liquid]').each(function () {
                var scale = $(this).attr('data-parallax-scale') || 0;
                var scaleFraction = parseFloat($(this).attr('data-parallax-scale-fraction'));
                var reverse = $(this).attr('data-parallax-reverse') ? $(this).attr('data-parallax-reverse') : false;
                var parallaxTransition = parseFloat($(this).attr('data-parallax-transition')) ? parseFloat($(this).attr('data-parallax-transition')) : 1.5;
                if (typeof $.fn.parallaxLiquidImg !== 'undefined' && typeof $.fn.parallaxLiquidImg !== null) {
                    $(this).parallaxLiquidImg(parallaxTransition, parseFloat(scale), scaleFraction, reverse);
                }
            });
        }
    }

    /* ===================================
     Overlap section
     ====================================== */

    // Top overlap section position
    function setOverLayerPosition() {
        if (($('.overlap-section').length > 0 || $('.overlap-section-one-fourth').length > 0 || $('.overlap-section-three-fourth').length > 0)) {
            $('.overlap-section, .overlap-section-one-fourth, .overlap-section-three-fourth').each(function () {
                let _this = $(this),
                        overlayBreakpoint = 767;

                if (_this.hasClass('md-overlap-disable')) {
                    overlayBreakpoint = 991;
                } else if (_this.hasClass('sm-overlap-disable')) {
                    overlayBreakpoint = 767;
                }

                if (getWindowWidth() > overlayBreakpoint) {
                    setTimeout(function () {
                        _this.imagesLoaded(function () {
                            var closestSectionObj = _this.closest('section');
                            if (_this.closest('footer').length) {
                                closestSectionObj = _this.closest('footer');
                            }
                            var sectionPaddingTop = parseInt(closestSectionObj.css('padding-top')),
                                    areaHeight = _this.find('*').outerHeight(),
                                    overlayTop = areaHeight + sectionPaddingTop;
                            if (_this.hasClass('overlap-section-one-fourth')) {
                                overlayTop = (areaHeight / 4) - overlayTop;
                            } else if (_this.hasClass('overlap-section-three-fourth')) {
                                overlayTop = ((areaHeight * 3) / 4) - overlayTop;
                            } else {
                                overlayTop = (areaHeight / 2) - overlayTop;
                            }
                            _this.css('margin-top', overlayTop);
                            var parentSectionObj = closestSectionObj.prev('.overlap-height'),
                                    overlapGap = parentSectionObj.find('.overlap-gap-section');
                            parentSectionObj.imagesLoaded(function () {
                                if (overlapGap.length > 0) {
                                    var gapSectionHeight = overlapGap.outerHeight() + (Math.abs(overlayTop) - sectionPaddingTop);
                                    overlapGap.parents('.overlap-height').height(gapSectionHeight);
                                }
                            });
                        });
                    }, 500);
                } else {
                    setTimeout(function () {
                        $('.overlap-height').height('inherit');
                        $('.overlap-section, .overlap-section-one-fourth, .overlap-section-three-fourth').css('margin-top', 'inherit');
                    }, 500);
                }
            });
        }
    }

    // Bottom overlap section position
    function setBottomOverLayerPosition(delay) {
        if (($('.overlap-section-bottom').length > 0) && getWindowWidth() >= 768) {
            $('.overlap-section-bottom').each(function () {
                var _this = $(this),
                        timeOut = (_this.find('.instafeed-wrapper').length > 0) ? delay : 10;
                setTimeout(function () {
                    _this.imagesLoaded(function () {
                        var areaHeight = _this.outerHeight(),
                                overlayerMargin = ((areaHeight / 2) - areaHeight);
                        _this.parents('section').next('.overlap-gap-section-bottom').css('margin-top', overlayerMargin);
                        _this.parents('section').next('.overlap-gap-section-bottom').css('padding-top', areaHeight);
                    });
                }, timeOut);
            });
        } else {
            $('.overlap-gap-section-bottom').css('margin-top', '');
            $('.overlap-gap-section-bottom').css('padding-top', '');
        }
    }

  

    /* ===================================
     Box shadow animation
     ====================================== */

    $(window).scroll(function (event) {
        $('[data-shadow-animation="true"]').each(function () {
            addBoxAnimationClass($(this))
        });
    });
    $('[data-shadow-animation="true"]').removeClass('shadow-in');
    $('[data-shadow-animation="true"]').each(function () {
        addBoxAnimationClass($(this))
    });
    function addBoxAnimationClass(boxObj) {
        if (boxObj.length) {
            var w = boxObj.width();
            var h = boxObj.height();
            var offset = boxObj.offset();
            var right = offset.left + parseInt(boxObj.width());
            var bottom = offset.top + parseInt(boxObj.height());
            var visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - offset.left, right - window.pageXOffset));
            var visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - offset.top, bottom - window.pageYOffset));
            var visible = visibleX * visibleY / (w * h);
            if (visible >= 0.5) {
                if (typeof boxObj.attr('data-animation-delay') !== 'undefined' && boxObj.attr('data-animation-delay') > 10) {
                    setTimeout(function () {
                        boxObj.addClass('shadow-in');
                    }, boxObj.attr('data-animation-delay'));
                } else {
                    boxObj.addClass('shadow-in');
                }
            }
        }
    }

    /* ===================================
     Skrollr animation
     ====================================== */

    var skroller;
    function initSkrollr() {
        if (typeof skrollr !== 'undefined' && typeof skrollr !== null) {
            skroller = skrollr.init({
                'forceHeight': false,
                'smoothScrollingDuration': 1000,
                'mobileCheck': function () {
                    return false;
                }
            });
        }
    }

    function reInitSkrollr() {
        destroySkrollr();
        if ($(window).width() >= 1200) {
            setTimeout(function () {
                initSkrollr();
            }, 1000);
        }
    }

    function destroySkrollr() {
        if (typeof skroller !== typeof undefined && skroller != 'undefined') {
            skroller.destroy();
        }
    }

    if ($(window).width() >= 1200) {
        initSkrollr();
    }

    /* ===================================
     Particles
     ====================================== */

    var particleDefaultOptions = {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: !1,
                    value_area: 800
                }
            },
            color: {
                value: ["#fdc14c", "#fd5c4c", "#48bb0f"]
            },
            shape: {
                type: "circle"
            },
            size: {
                value: 10,
                random: !0,
                anim: {
                    enable: !0,
                    speed: 1
                }
            },
            opacity: {
                value: 0.5,
                random: false
            },
            move: {
                direction: "right",
                attract: {
                    enable: !0
                }
            },
            line_linked: {
                enable: !1
            }
        },
        interactivity: {
            events: {
                onhover: {
                    enable: !1
                },
                onclick: {
                    enable: !1
                }
            }
        },
        "retina_detect": true
    };
    var particleItems = $('[data-particle="true"]');
    if (typeof particlesJS === 'function' && particleItems.length) {
        $.each(particleItems, function (index, particleItem) {
            var particleId = $(particleItem).attr('id');
            var particleItemOptions = $(particleItem).attr('data-particle-options');
            if (particleItemOptions != 'undefined' && typeof particleItemOptions !== typeof undefined) {
                particleItemOptions = JSON.parse(particleItemOptions);
            } else {
                particleItemOptions = particleDefaultOptions;
            }
            particlesJS(particleId, particleItemOptions);
        });
    }

    /* ===================================
     SVG animated image mask
     ====================================== */

    $('.animatedSvgPath').each(function () {
        var animePath = $(this);
        var paths = animePath.attr('pathdata:id').split(';');
        paths.splice(paths.length, 0, animePath.attr('d'));
        anime({
            targets: animePath[0],
            duration: 10000,
            easing: 'cubicBezier(0.5, 0, 0.5, 1)',
            d: paths,
            loop: true
        });
    });

   

    /* ===================================
     Stack animataion
     ====================================== */

    stackAnimation();
    var stackLastScroll = 0;
    function stackAnimation() {
        windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        $('.stack-box').each(function () {
            if ($(window).width() > 1199) {
                var _this = $(this);
                var stackItems = _this.find('.stack-item');
                if (stackItems.length) {
                    if (windowScrollTop > stackLastScroll) {
                        _this.addClass('forward');
                        _this.removeClass('reverse');
                    } else {
                        _this.removeClass('forward');
                        _this.addClass('reverse');
                    }

                    for (let i = 0; i < stackItems.length - 1; i++) {
                        var stackBoxHeight = (_this.height() / (_this.find('.stack-item').length)) * i;
                        var stackTopPosition = _this.offset().top;
                        if ((windowScrollTop - stackTopPosition) > stackBoxHeight) {
                            var yMove = windowScrollTop - stackTopPosition - stackBoxHeight;
                            if (yMove > _this.outerHeight()) {
                                yMove = _this.outerHeight();
                            }
                            $(stackItems[i]).css({'height': 'calc(100vh - ' + yMove + 'px)'});
                            $(stackItems[i]).addClass('active');
                        } else {
                            $(stackItems[i]).css({'height': 'calc(100vh - 0px)'});
                            $(stackItems[i]).removeClass('active');
                        }
                    }
                }
            } else {
                $('.stack-box .stack-item').css({'height': 'inherit'});
            }
        });

        stackLastScroll = windowScrollTop;
    }
    $(window).scroll(function () {
        stackAnimation();
    });

    /* ===================================
     Image tilt 3d effect using atropos
     ====================================== */

    var atroposItems = document.querySelectorAll('[data-atropos]')
    function initAtropos() {
        if (atroposItems.length && $(window).width() > 1199) {
            atroposItems.forEach(function (atroposItem) {
                var myAtropos = Atropos({
                    el: atroposItem
                });
            });
        }
    }
    if (typeof Atropos !== 'undefined' && Atropos !== null) {
        initAtropos();
    }
    function destroyAtropos() {
        if (atroposItems.length && $(window).width() > 1199) {
            atroposItems.forEach(function (atroposItem) {
                if (atroposItem.__atropos__) {
                    atroposItem.__atropos__.destroy();
                }
            });
        }
    }

    /* ===================================
     Sticky vertical strip - add dark section class
     ====================================== */

    var getElementsInArea = (function (docElm) {
        var viewportHeight = docElm.clientHeight;
        return function (e, opts) {
            var found = [], i;
            if (e && e.type == 'resize') {
                viewportHeight = docElm.clientHeight;
            }
            for (i = opts.elements.length; i--; ) {
                var elm = opts.elements[i],
                        pos = elm.getBoundingClientRect(),
                        topPerc = pos.top / viewportHeight * 100,
                        bottomPerc = pos.bottom / viewportHeight * 100,
                        middle = (topPerc + bottomPerc) / 2,
                        inViewport = middle > opts.zone[1] && middle < (100 - opts.zone[1]);

                elm.classList.toggle(opts.markedClass, inViewport);

                if (inViewport) {
                    found.push(elm);
                }
            }
        };
    })(document.documentElement);

    $(window).on('scroll resize load', function (e) {
        getElementsInArea(e, {
            elements: document.querySelectorAll('.section-dark'),
            markedClass: 'section-dark-highlight',
            zone: [10, 10]
        });
        if ($('.section-dark-highlight').length > 0) {
            $('.sticky-wrap').addClass('sticky-highlight');
        } else {
            $('.sticky-wrap').removeClass('sticky-highlight');
        }
    });

    $(document).on('appear', 'footer', function (e) {
        $('.sticky-wrap').addClass('sticky-hidden');
    }).on('disappear', 'footer', function (e) {
        $('.sticky-wrap').removeClass('sticky-hidden');
    });


    /* ===================================
     Infinite looping animation
     ====================================== */

    const wrapperEl = document.querySelector('.looping-wrapper') || false;
    const numberOfEls = 100;
    const duration = 6000;
    const delay = duration / numberOfEls;

    let tl = anime.timeline({
        duration: delay,
        complete: function () {
            tl.restart();
        }
    });

    function createEl(i) {
        let el = document.createElement('div');
        const rotate = (360 / numberOfEls) * i;
        const translateY = -50;
        el.classList.add('el');
        el.style.transform = 'rotate(' + rotate + 'deg) translateY(' + translateY + '%)';
        tl.add({
            begin: function () {
                anime({
                    targets: el,
                    rotate: [rotate + 'deg', rotate + 10 + 'deg'],
                    translateY: [translateY + '%', translateY + 10 + '%'],
                    scale: [1, 1.25],
                    easing: 'easeInOutSine',
                    direction: 'alternate',
                    duration: duration * .1
                });
            }
        });
        if (wrapperEl)
            wrapperEl.appendChild(el);
    }

    for (let i = 0; i < numberOfEls; i++)
        createEl(i);

    /* ===================================
     Background color change on scroll - Adaptive Backgrounds
     ====================================== */
    window.sections = [...document.querySelectorAll('[data-background]')];
    window.lastScrollTop = window.pageYOffset;
    let activeSection;

    onScroll();
    window.addEventListener('scroll', onScroll);

    function onScroll() {
        if (window.sections.length > 0) {
            const section = window.sections
                    .map(section => {
                        const el = section;
                        const rect = el.getBoundingClientRect();
                        return {el, rect};
                    })
                    .find(section => section.rect.bottom >= (window.innerHeight * 0.5));
            if (section && section.el !== activeSection) {
                activeSection = section.el;
                const sectionBg = activeSection.getAttribute('data-background');
                activeSection.closest(".page-content").querySelectorAll("[data-background]").forEach(item => item.classList.remove("active"))
                activeSection.classList.add("active")
                if (typeof gsap !== "undefined") {
                    gsap.to(activeSection.closest(".page-content"), {backgroundColor: sectionBg})
                }
            }
        }
    }



    /* ===================================
     Back to top scroll
     ====================================== */
    $(document).on('click', '.scroll-top', function () {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });

    function scrollIndicator() {
        var scrollTop = document.documentElement.scrollTop;
        if (scrollTop > 200) {
            $('.scroll-progress').addClass('visible');
        } else {
            $('.scroll-progress').removeClass('visible');
        }

        var scrollHeight = document.documentElement.scrollHeight;
        var windowHeight = document.documentElement.clientHeight;
        var maxScrollTop = scrollHeight - windowHeight;
        var scrollTop = document.documentElement.scrollTop;
        var scrollPercentage = (scrollTop / (maxScrollTop - 200)) * 100;

        $('.scroll-point').css('height', Math.min(scrollPercentage, 100) + '%');

        /***** Theme demos button scroll to show *****/
        var scrollPos = $(window).scrollTop();
        if (scrollPos > 150) {
            $('.theme-demos').fadeIn(600);
        }
    }
    $(window).scroll(function () {
        scrollIndicator();
    });

    /* ===================================
     Trusted customers
     ====================================== */

    $('.bg-more-trusted .btn').click(function (e) {
        e.preventDefault();
        $(this).parent().parent().addClass('show-trusted-customers');
    });




})(jQuery);

