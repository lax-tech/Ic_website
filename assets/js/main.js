let quantityHandler = null; //custom: pour permettre d'accéder à cette variable dans d'autres fichers

$(window).scroll(function () {
    if ($(this).width() >= 1024) {
        if ($(this).scrollTop() > 100) {
            $('.department-nav-menu').fadeOut(200);
        }
        else {
            $('.department-nav-menu').fadeIn(200);
        }
    }
});
(function (window, document, $, undefined) {
    'use strict';

    var axilInit = {
        i: function (e) {
            axilInit.s();
            axilInit.methods();
        },

        s: function (e) {
            this._window = $(window),
                this._document = $(document),
                this._body = $('body'),
                this._html = $('html')
        },

        methods: function (e) {
            axilInit.w();
            axilInit.contactForm();
            axilInit.shopFilterWidget();
            axilInit.mobileMenuActivation();
            axilInit.menuLinkActive();
            axilInit.headerIconToggle();
            axilInit.priceRangeSlider();
            axilInit.quantityRanger();
            quantityHandler = axilInit.quantityRanger;
            axilInit.axilSlickActivation();
            axilInit.countdownInit('.coming-countdown', '2023/06/01');
            axilInit.campaignCountdown('.campaign-countdown', '2022/10/01');
            axilInit.countdownInit('.poster-countdown', '2022/10/01');
            axilInit.countdownInit('.sale-countdown', '2022/10/31');
            axilInit.sideOffcanvasToggle('.cart-dropdown-btn', '#cart-dropdown');
            axilInit.stickyHeaderMenu('.lax-mainmenu');
            axilInit.sideOffcanvasToggle('.mobile-nav-toggler', '.header-main-nav');
            axilInit.sideOffcanvasToggle('.department-side-menu', '.department-nav-menu');
            axilInit.sideOffcanvasToggle('.filter-toggle', '.lax-shop-sidebar');
            axilInit.sideOffcanvasToggle('.lax-search', '#header-search-modal');
            axilInit.sideOffcanvasToggle('.checkout-btnp', '#paiementpopup');
            axilInit.sideOffcanvasToggle('.popup-close, .closeMask', "#offer-popup-modal");
            axilInit.stickyHeaderMenu();
            axilInit.salActivation();
            axilInit.magnificPopupActivation();
            axilInit.colorVariantActive();
            axilInit.headerCampaignRemove();
            // axilInit.offerPopupActivation();
            axilInit.axilMasonary();
            axilInit.counterUpActivation();
            axilInit.scrollSmoth();
            axilInit.Chargeur();



        },

        w: function (e) {
            this._window.on('load', axilInit.l).on('scroll', axilInit.res)
        },

        contactForm: function () {
            $('.lax-contact-form').on('submit', function (e) {
                e.preventDefault();
                var _self = $(this);
                var _selector = _self.closest('input,textarea');
                _self.closest('div').find('input,textarea').removeAttr('style');
                _self.find('.error-msg').remove();
                _self.closest('div').find('button[type="submit"]').attr('disabled', 'disabled');
                var data = $(this).serialize();
                $.ajax({
                    url: 'mail.php',
                    type: "post",
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        _self.closest('div').find('button[type="submit"]').removeAttr('disabled');
                        if (data.code == false) {
                            _self.closest('div').find('[name="' + data.field + '"]');
                            _self.find('.lax-btn').after('<div class="error-msg"><p>*' + data.err + '</p></div>');
                        } else {
                            $('.error-msg').hide();
                            $('.form-group').removeClass('focused');
                            _self.find('.lax-btn').after('<div class="success-msg"><p>' + data.success + '</p></div>');
                            _self.closest('div').find('input,textarea').val('');

                            setTimeout(function () {
                                $('.success-msg').fadeOut('slow');
                            }, 5000);
                        }
                    }
                });
            });
        },
        Chargeur: function () {
            var btnPaiement = document.getElementById('btn-payment');
            const paimentForm = document.getElementById('payment-form');
            var chargement = document.getElementById('chargement');
            if (chargement) {

                let phoneIsValid = false;
                let phoneNumber = null
                
                const input = document.getElementById('phone');

                const checkPrefix = (prefix, value) =>{
                    let index = 0
                    for(let char of value){
                        if(char != prefix[index]){
                            return false; 
                        }
                        index++;
                        if(index == prefix.length) break
                    }
                    return true;
                }

                const formatValue = (prefix, value) => {
                    if(value.length-prefix.length > 9){
                        console.error('Valuer incorrecte')
                        input.value = value.slice(0, 9+prefix.length)
                    }
                    else if(value.length - prefix.length == 9){
                        console.info('Valeur Correcte !!!!')
                        input.setCustomValidity("");
                        input.setAttribute("isvalid", "true")
                        phoneIsValid = true
                    }else{
                        console.log('En ecriture')
                        phoneIsValid = false
                        input.setCustomValidity("Numéro non valide");
                        input.setAttribute("isvalid", "false")
                        return null
                    }
                    return '243'+input.value.slice(prefix.length)
                }

                input.addEventListener('input', (e)=>{
                    const value = e.target.value;
                    console.log('input: '+e.target.value);
                    if(checkPrefix('00243', value)){
                        console.log('00243');
                        phoneNumber = formatValue('00243', value)
                    }else if(checkPrefix('243', value)){
                        console.log('243');
                        phoneNumber = formatValue('243', value)
                    }else if(checkPrefix('0', value) && value[1] !=0){
                        console.log('0x');
                        phoneNumber = formatValue('0', value)
                    }else{
                        console.error('Valuer incorrecte')
                        input.setCustomValidity("Numéro non valide");
                        input.setAttribute("isvalid", "false")
                        phoneIsValid = false
                    }
                })
                function initPaiment(e) {
                    e.preventDefault()
                    if(phoneIsValid && phoneNumber){
                        document.querySelector('.paiementcourtvd').style.display = 'none';
                        chargement.style.display = 'grid';
                        axiosInstance.post(`/api/commands/${c}/paiment/`, {
                            type: 'MOBILE_MONEY',
                            phone: phoneNumber
                        }).then(({ data }) => {
                            console.log(data)
                            const paimentChecker = () => {
                                setTimeout(() => {
                                    axiosInstance.get(data.callback_paiment_url, ).then(({ data }) => {
                                        if (data.paiment?.is_processing){
                                            paimentChecker()
                                        }else{
                                            if(data.command?.is_paid){
                                                console.log('PAIMENT SUCCESS')
                                                alert('Paiement éffectué ✅')
                                                window.location.replace(data.redirect_url)
                                            }else{
                                                console.log('PAIMENT FAILLED')
                                                chargement.style.display = 'none';
                                                document.querySelector('.paiementcourtvd').style.display = 'flex';
                                                alert('Paiement échoué ❌')
                                            }
                                        }
                                    })
                                }, 3000);
                            }
                            paimentChecker()
                        }).catch(error=>{
                            setTimeout(() => {
                                chargement.style.display = 'none';
                                document.querySelector('.paiementcourtvd').style.display = 'flex';
                            }, 200);
                        })
                    }else{
                        input.setCustomValidity("Numéro non valide");
                        input.setAttribute("isvalid", "false")
                    }
                };
                //btnPaiement.addEventListener('click', initPaiment);
                paimentForm.addEventListener('submit', initPaiment);
            }
            
           
        },

        counterUpActivation: function () {
            var _counter = $('.count');
            if (_counter.length) {s
                _counter.counterUp({
                    delay: 10,
                    time: 1000,
                    triggerOnce: true
                });
            }
        },

        scrollSmoth: function (e) {
            $(document).on('click', '.smoth-animation', function (event) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href')).offset().top
                }, 200);
            });
        },

        shopFilterWidget: function () {
            $('.toggle-list > .title').on('click', function (e) {

                var target = $(this).parent().children('.shop-submenu');
                var target2 = $(this).parent();
                $(target).slideToggle();
                $(target2).toggleClass('active');
            });

            $('.toggle-btn').on('click', function (e) {

                var target = $(this).parent().siblings('.toggle-open');
                var target2 = $(this).parent();
                $(target).slideToggle();
                $(target2).toggleClass('active');
            });
        },

        mobileMenuActivation: function (e) {

            $('.menu-item-has-children > a').on('click', function (e) {

                var targetParent = $(this).parents('.header-main-nav');
                var target = $(this).siblings('.lax-submenu');

                if (targetParent.hasClass('open')) {
                    $(target).slideToggle(400);
                    $(this).parent('.menu-item-has-children').toggleClass('open');
                }

            });

            /* $('.nav-link.has-megamenu').on('click', function (e) {
 
                 var $this = $(this),
                     targetElm = $this.siblings('.megamenu-mobile-toggle');
                 targetElm.slideToggle(500);
             });*/

            // Mobile Sidemenu Class Add
            function resizeClassAdd() {
                if (window.matchMedia('(max-width: 1199px)').matches) {
                    $('.department-title').addClass('department-side-menu');
                    $('.department-megamenu').addClass('megamenu-mobile-toggle');
                } else {
                    $('.department-title').removeClass('department-side-menuu');
                    $('.department-megamenu').removeClass('megamenu-mobile-toggle').removeAttr('style');
                }
            }

            $(window).resize(function () {
                resizeClassAdd();
            });

            resizeClassAdd();
        },

        menuLinkActive: function () {
            var currentPage = location.pathname.split("/"),
                current = currentPage[currentPage.length - 1];
            $('.mainmenu li a, .main-navigation li a').each(function () {
                var $this = $(this);
                if ($this.attr('href') === current) {
                    $this.addClass('active');
                    $this.parents('.menu-item-has-children').addClass('menu-item-open')
                }
            });
        },

        headerIconToggle: function () {

            $('.my-account > a').on('click', function (e) {
                $(this).toggleClass('open').siblings().toggleClass('open');
            })
        },

        priceRangeSlider: function (e) {
            $('#slider-range').slider({
                range: true,
                min: 0,
                max: 5000,
                values: [0, 3000],
                slide: function (event, ui) {
                    $('#amount').val('$' + ui.values[0] + '  $' + ui.values[1]);
                }
            });
            $('#amount').val('$' + $('#slider-range').slider('values', 0) +
                '  $' + $('#slider-range').slider('values', 1));

        },

        quantityRanger: function () {
            $('.pro-qty').prepend('<span class="dec qtybtn">-</span>');
            $('.pro-qty').append('<span class="inc qtybtn">+</span>');
            $('.qtybtn').on('click', function () {
                var $button = $(this);
                var oldValue = $button.parent().find('input').val();
                if ($button.hasClass('inc')) {
                    var newVal = parseFloat(oldValue) + 1;
                } else {
                    // Don't allow decrementing below zero
                    if (oldValue > 0) {
                        var newVal = parseFloat(oldValue) - 1;
                    } else {
                        newVal = 0;
                    }
                }
                $button.parent().find('input').val(newVal);

                console.log("la quantité a changé")

                const url = '/api/cart/' + (getCookie("cart_id") || 0) + '/'
                const productId = $button.parent().find('input').attr('data-id')
                axiosInstance.post(url, {
                    type: 'set_cart_product_quantity',
                    content: {
                        product_id: productId,
                        quantity: newVal
                    }
                }).then(({ data }) => {
                    console.log(data)
                    document.querySelectorAll(`.product-${productId}-quantity`).forEach(el => {
                        el.value = data.content.quantity || newVal
                    })
                    document.querySelectorAll(`.product-${productId}-total-price`).forEach(el => {
                        el.innerHTML = '$' + data.content.product_total_price
                    })
                    document.querySelectorAll(`.cart-total`).forEach(el => {
                        el.innerHTML = '$' + data.content.cart_total_price
                    })
                    document.querySelectorAll(`.cart-tax`).forEach(el => {
                        el.innerHTML = '$' + data.content.tax
                    })
                    document.querySelectorAll(`.invoice-total`).forEach(el => {
                        el.innerHTML = '$' + data.content.invoice_total
                    })
                })
            });
        },

        axilSlickActivation: function (e) {
            $('.categrie-product-activation').slick({
                infinite: true,
                slidesToShow: 7,
                slidesToScroll: 7,
                arrows: true,
                dots: false,
                autoplay: false,
                speed: 1000,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 6,
                            slidesToScroll: 6
                        }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 479,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 400,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },

                ]
            });

            $('.categrie-product-activation-3').slick({
                infinite: true,
                slidesToShow: 6,
                slidesToScroll: 6,
                arrows: true,
                dots: false,
                autoplay: true,
                speed: 1000,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 5,
                            slidesToScroll: 5
                        }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 479,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 400,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    },

                ]
            });

            $('.categrie-product-activation-2').slick({
                infinite: true,
                slidesToShow: 7,
                slidesToScroll: 7,
                arrows: true,
                dots: false,
                autoplay: true,
                speed: 1000,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [
                    {
                        breakpoint: 1399,
                        settings: {
                            slidesToShow: 6,
                            slidesToScroll: 6
                        }
                    },
                    {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 5,
                            slidesToScroll: 5
                        }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 479,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });

            $('.explore-product-activation').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: false,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',

            });

            $('.new-arrivals-product-activation').slick({
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                arrows: true,
                dots: false,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [{
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
                ]
            });

            $('.new-arrivals-product-activation-2').slick({
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                arrows: true,
                dots: false,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [{
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        variableWidth: true,
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
                ]
            });

            $('.recent-product-activation').slick({
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                arrows: true,
                dots: false,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [{
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 479,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
                ]
            });

            $('.header-campaign-activation').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: false,
                autoplay: true,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>'
            });

            $('.testimonial-slick-activation-two').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: true,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>'
            });

            $('.testimonial-slick-activation').slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: true,
                dots: false,
                speed: 500,
                draggable: true,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [{
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 1,
                    }
                }
                ]
            });

            $('.product-small-thumb').slick({
                infinite: true,
                slidesToShow: 6,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                focusOnSelect: true,
                vertical: true,
                speed: 800,
                asNavFor: '.product-large-thumbnail',
                responsive: [{
                    breakpoint: 992,
                    settings: {
                        vertical: false,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        vertical: false,
                        slidesToShow: 4,
                    }
                }
                ]

            });

            $('.product-large-thumbnail').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                speed: 800,
                draggable: false,
                asNavFor: '.product-small-thumb'
            });

            $('.product-small-thumb-2').slick({
                infinite: true,
                slidesToShow: 6,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                focusOnSelect: true,
                speed: 800,
                asNavFor: '.product-large-thumbnail-2',
                responsive: [{
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 5,
                    }
                },
                {
                    breakpoint: 479,
                    settings: {
                        slidesToShow: 4,
                    }
                }
                ]

            });

            $('.product-large-thumbnail-2').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: false,
                speed: 800,
                draggable: false,
                asNavFor: '.product-small-thumb-2',
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>'
            });

            $('.product-small-thumb-3').slick({
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                focusOnSelect: true,
                vertical: true,
                speed: 800,
                draggable: false,
                swipe: false,
                asNavFor: '.product-large-thumbnail-3',
                responsive: [{
                    breakpoint: 992,
                    settings: {
                        vertical: false,
                    }
                }
                ]

            });

            $('.product-large-thumbnail-3').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                speed: 800,
                draggable: false,
                swipe: false,
                asNavFor: '.product-small-thumb-3'
            });


            $('.related-blog-activation').slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: true,
                dots: false,
                speed: 500,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [{
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                    }
                }

                ]
            });

            $('.blog-gallery-activation').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: false,
                speed: 500,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
            });

            $('#quick-view-modal').on('shown.bs.modal', function (event) {
                $('.slick-slider').slick('setPosition');
            });

            $('.slider-thumb-activation-one').slick({
                infinite: true,
                slidesToShow: 2,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                fade: true,
                focusOnSelect: false,
                speed: 1000,
                autoplay: true,
                asNavFor: '.slider-content-activation-one',
                responsive: [{
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 1,
                    }
                }
                ]

            });

            $('.slider-thumb-activation-two').slick({
                infinite: true,
                slidesToShow: 3,
                centerPadding: '0',
                arrows: false,
                dots: true,
                speed: 1500,
                autoplay: true,
                centerMode: true,
                responsive: [{
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 1,
                    }
                }
                ]
            });

            $('.slider-thumb-activation-three').slick({
                infinite: true,
                slidesToShow: 2,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                focusOnSelect: false,
                speed: 1500,
                autoplay: true,
                responsive: [{
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 1,
                    }
                }
                ]

            });

            $('.slider-content-activation-one').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                focusOnSelect: false,
                speed: 500,
                fade: true,
                autoplay: true,
                asNavFor: '.slider-thumb-activation-one',
            });

            $('.slider-activation-one').slick({
                infinite: true,
                autoplay: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                fade: true,
                focusOnSelect: false,
                speed: 400

            });

            $('.slider-activation-two').slick({
                infinite: true,
                autoplay: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                fade: true,
                adaptiveHeight: true,
                cssEase: 'linear',
                speed: 400
            });

            $('.team-slide-activation').slick({
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                arrows: true,
                dots: false,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [{
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
                ]
            });
        },

        countdownInit: function (countdownSelector, countdownTime) {
            var eventCounter = $(countdownSelector);
            if (eventCounter.length) {
                eventCounter.countdown(countdownTime, function (e) {
                    $(this).html(
                        e.strftime(
                            "<div class='countdown-section'><div><div class='countdown-number'>%-D</div> <div class='countdown-unit'>Day</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%H</div> <div class='countdown-unit'>Hrs</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%M</div> <div class='countdown-unit'>Min</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%S</div> <div class='countdown-unit'>Sec</div> </div></div>"
                        )
                    );
                });
            }
        },

        campaignCountdown: function (countdownSelector, countdownTime) {
            var eventCounter = $(countdownSelector);
            if (eventCounter.length) {
                eventCounter.countdown(countdownTime, function (e) {
                    $(this).html(
                        e.strftime(
                            "<div class='countdown-section'><div><div class='countdown-number'>%-D</div> <div class='countdown-unit'>D</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%H</div> <div class='countdown-unit'>H</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%M</div> <div class='countdown-unit'>M</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%S</div> <div class='countdown-unit'>S</div> </div></div>"
                        )
                    );
                });
            }
        },

        sideOffcanvasToggle: function (selectbtn, openElement) {

            $('body').on('click', selectbtn, function (e) {
                e.preventDefault();

                var $this = $(this),
                    wrapp = $this.parents('body'),
                    wrapMask = $('<div / >').addClass('closeMask'),
                    cartDropdown = $(openElement);

                if (!(cartDropdown).hasClass('open')) {
                    wrapp.addClass('open');
                    cartDropdown.addClass('open');
                    cartDropdown.parent().append(wrapMask);
                    wrapp.css({
                        'overflow': 'hidden'

                    });

                } else {
                    removeSideMenu();
                }

                function removeSideMenu() {
                    wrapp.removeAttr('style');
                    wrapp.removeClass('open').find('.closeMask').remove();
                    cartDropdown.removeClass('open');
                }

                $('.sidebar-close, .closeMask').on('click', function () {
                    removeSideMenu();
                });

            });
        },

        stickyHeaderMenu: function (menuid) {

            $(window).on('scroll', function () {
                // Sticky Class Add
                if ($('body').hasClass('sticky-header')) {
                    var stickyPlaceHolder = $('#lax-sticky-placeholder'),
                        menu = $(menuid),
                        menuH = menu.outerHeight(),
                        topHeaderH = $('.lax-header-topnone').outerHeight() || 0,
                        headerCampaign = $('.header-top-campaign').outerHeight() || 0,
                        targrtScroll = topHeaderH + headerCampaign;
                    if ($(window).scrollTop() > targrtScroll) {
                        menu.addClass('lax-sticky');
                        stickyPlaceHolder.height(menuH);
                    } else {
                        menu.removeClass('lax-sticky');
                        stickyPlaceHolder.height(0);
                    }
                }
            });
        },

        salActivation: function () {
            sal({
                threshold: 0.3,
                once: true
            });
        },

        magnificPopupActivation: function () {

            var yPopup = $('.popup-youtube');
            if (yPopup.length) {
                yPopup.magnificPopup({
                    disableOn: 300,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false
                });
            }

            if ($('.zoom-gallery').length) {
                $('.zoom-gallery').each(function () {
                    $(this).magnificPopup({
                        delegate: 'a.popup-zoom',
                        type: 'image',
                        gallery: {
                            enabled: true
                        }
                    });
                });
            }
        },



        colorVariantActive: function () {
            $('.color-variant > li').on('click', function (e) {
                $(this).addClass('active').siblings().removeClass('active');
            })
        },

        headerCampaignRemove: function () {
            $('.remove-campaign').on('click', function () {
                var targetElem = $('.header-top-campaign');
                targetElem.slideUp(function () {
                    $(this).remove();
                });
            });
        },

        offerPopupActivation: function () {
            if ($('body').hasClass('newsletter-popup-modal')) {
                setTimeout(function () {
                    $('body').addClass('open');
                    $('#offer-popup-modal').addClass('open');
                }, 1000);
            }
        },

        axilMasonary: function () {
            $('.lax-isotope-wrapper').imagesLoaded(function () {
                // filter items on button click
                $('.isotope-button').on('click', 'button', function () {
                    var filterValue = $(this).attr('data-filter');
                    $grid.isotope({
                        filter: filterValue
                    });
                });

                // init Isotope
                var $grid = $('.isotope-list').isotope({
                    itemSelector: '.product',
                    percentPosition: true,
                    transitionDuration: '0.7s',
                    layoutMode: 'fitRows',
                    masonry: {
                        // use outer width of grid-sizer for columnWidth
                        columnWidth: 1,
                    }
                });
            });

            $('.isotope-button button').on('click', function (event) {
                $(this).siblings('.is-checked').removeClass('is-checked');
                $(this).addClass('is-checked');
                event.preventDefault();
            });
        },
    }
    axilInit.i();

})(window, document, jQuery);





