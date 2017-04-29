global.jQuery = require('jquery');
var validetta = require('./validetta/validetta.js');
var background_color = '#fff'
require('slick-carousel');
var scrollFlag = 0;
var rotateFlag = false;

(function ($) {
    // validetta
    $(document).ready(function(){
      $('#form').validetta({
        onValid: function(e) {
          e.preventDefault();
          var $form = $('#form');
          var $button = $form.find('button');
          console.log($form.typeContacter);
          $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: $form.serialize(),
            timeout: 10000,

            beforeSend: function() {
              $button.attr('disabled', true);
            },
            complete: function() {
              $button.attr('disabled', false);
            },
            success: function(result) {
              if(result == 0) {
                $form[0].reset();
                $('.c-input__checkboxTick').addClass('s-hidden');
                alert('送信完了しました');
              }else{
                if (result == 1) {
                  alert('未入力項目があります');
                }else{
                  alert('メールアドレスが無効です');
                }
              }
            },
            error: function() {
              alert('送信に失敗しました');
            }
                  });
        },
        onError: function(e){
            var height;
            var width = $(window).width();
            $(".validetta-bubble").each(function(){
                height = $(this).offset().top - 120;
                return false;
            });
            $('html,body').animate({ scrollTop: height });
        },
        realTime: true
      });
        });
    // iOSクリック対応
    if ($(window).width() <= 768) {
        $('*').css('cursor', 'pointer');
    }
    //メニュークリックで各sectionに遷移させる 
    $('a[href^="#"]').click(function() {
        var offsetY = -10;
        var time = 500;
        var target = $(this.hash);
        if (!target.length) return;
        var targetY = target.offset().top + offsetY +10;
        $('html,body').animate({scrollTop: targetY}, time, 'swing', function () {
            closeMenu(200);
        });
        window.history.pushState(null, null, this.hash);
        return false;
    });

    var navLink = $('.l-header--pc__menuList li .l-header--pc__menuItem');

    // 各コンテンツのページ上部からの開始位置と終了位置を配列に格納しておく
    var contentsArr = new Array();
    for (var i = 0; i < navLink.length; i++) {
        // コンテンツのIDを取得
        var targetContents = navLink.eq(i).attr('href');
        // ページ内リンクでないナビゲーションが含まれている場合は除外する
        if(targetContents.charAt(0) == '#' && $(targetContents) && $(targetContents).offset() && $(targetContents).parent()) {
            // ページ上部からコンテンツの開始位置までの距離を取得
            var targetContentsTop = $(targetContents).offset().top - parseInt($(targetContents).parent().css("marginTop"))  - 30;
            // ページ上部からコンテンツの終了位置までの距離を取得
            var targetContentsBottom = $(targetContents).offset().top + $(targetContents).parent().height() 
                + parseInt($(targetContents).parent().css("paddingBottom")); 

            // 配列に格納
            contentsArr[i] = [targetContentsTop, targetContentsBottom]
        }
    };

    // 現在地をチェックする
    function currentCheck() {
        // 現在のスクロール位置を取得
        var windowScrolltop = $(window).scrollTop();
        for (var i = 0; i < contentsArr.length; i++) {
            // 現在のスクロール位置が、配列に格納した開始位置と終了位置の間にあるものを調べる
            if(contentsArr[i][0] -300  <= windowScrolltop && contentsArr[i][1] -300  >= windowScrolltop) {
                // 開始位置と終了位置の間にある場合、ナビゲーションにclass="current"をつける
                navLink.removeClass('active');
                navLink.next().removeClass('active');
                navLink.eq(i).addClass('active');
                navLink.eq(i).next().addClass('active');

                i == contentsArr.length;
            }
        };
    }

    // ページ読み込み時とスクロール時に、現在地をチェックする
    $(window).on('load scroll', function() {
        currentCheck();
    });

    function changeNavCurrent(curNum) {
        if (curNum != current) {
            current = curNum;
            curNum2 = curNum + 1;//HTML順序用
            $('#nav li').removeClass('on');
            $('#nav li:nth-child(' + curNum2 +')').addClass('on');
        }
    };

    // ヘッダのメニューボタンのクリクエベント
    $('.l-header--sp__menubutton').click(function () {
        toggleMenu();
    });
    // スクロールトップボタンの表示
    // 現在の画面の位置をチェック。
    // 画面高さを過ぎたらボタンを表示させる
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if (scroll > $(window).height()) {
            $('.c-btnScrollTop').fadeIn();
        } else {
            $('.c-btnScrollTop').hide();
        }
    });

    // トップにスクロールする
    $('.c-btnScrollTop').click(function () {
        var body = $("html, body");
        body.stop().animate({scrollTop:0}, '500', 'swing');
    });
    
    // 背景、メニュうーボタンじゃないエレメントをクリックするとヘッダメニューが閉じる
    $(window).click(function (e) {
        if ($(e.target).hasClass('c-layer--underLayer')) {
            closeMenu();
            return false;
        } else {
            if (!$(e.target).hasClass('l-header--sp__menubutton') && 
                !$(e.target).parent().hasClass('l-header--sp__menubutton') &&
                !$(e.target).parents().hasClass('l-header--sp__menuList')) {
                if (!$('.c-modal').is(':visible')) {
                    closeMenu();
                }
            }
        }
    });
    // 採用サイトのニュースの開閉
    // + - ボタン
    $('.p-news__itemBtn').click(function () {
        var isClose = $(this).hasClass('fa-plus');
        $('.p-news__itemBtn').removeClass('fa-minus');
        $('.p-news__itemBtn').addClass('fa-plus');
        $('.p-news__itemDesc').slideUp();
        // var isClose = $(this).parent().find('.p-news__itemDesc').hasClass('fa-plus');
        if (isClose) {
            $(this).parent().find('.p-news__itemDesc').slideDown();
            $(this).addClass('fa-minus');
            $(this).removeClass('fa-plus');
        }
    });
    // タイトル
    $('.p-news__itemTitle').click(function () {
        var isClose = $(this).parent().parent().find('.fa').hasClass('fa-plus');
        $('.p-news__itemBtn').removeClass('fa-minus');
        $('.p-news__itemBtn').addClass('fa-plus');
        $('.p-news__itemDesc').slideUp();
        if (isClose) {
            $(this).parent().parent().find('.p-news__itemDesc').slideDown();
            $(this).parent().parent().find('.fa').addClass('fa-minus').removeClass('fa-plus');
        }
    });
    // スライダー
    $('.p-office__pictureSlider').slick({
        // normal options... 
        infinite: true,
        slidesToShow: 1,
        prevArrow: '<button class="p-office__btn p-office__btn--prev"><i class="fa fa-angle-left"></i></button>',
        nextArrow: '<button class="p-office__btn p-office__btn--next"><i class="fa fa-angle-right"></i></button>',
        waitForAnimate: true,
        adaptiveHeight: true,
        autoplay: true,
        pauseOnFocus: true,
        pauseOnHover: true
    });
    // 社員のモーダルの開閉
    $('.c-card').click(function () {
        var number = $(this).data('interview');
        openModal(number);

    });
    // モーダルを閉じるボタン
    $('.c-modal__btn').click(function () {
        closeModal();
    });
    $('.c-modal').click(function (e) {
        if ($(e.target).hasClass('c-modal')) {
            closeModal();
        }
    });
    // checkboxとradioインプット
    $('input[type=checkbox]').change(function () {
        checkBox($(this));
    });

    $('input[type=radio]').change(function () {
        checkRadio($(this));
    });

    // hoverRotate($('.c-hoverRotate'));

    function checkBox($target) {
        $target.parent().find('.c-input__checkboxTick').toggleClass('s-hidden');
    }

    function checkRadio($target) {
        $target.parent().parent().find('.c-inputRadio__circle').addClass('s-hidden');
        $target.parent().parent().find('.c-inputRadio__circleBox').removeClass('s-hidden');
        $target.parent().parent().find('input[type=radio]').prop('checked',false);
        $target.parent().find('.c-inputRadio__circle').removeClass('s-hidden');
        $target.parent().find('.c-inputRadio__circleBox').removeClass('s-hidden');
        $target.prop('checked', true);
    }

    function closeMenu(time) {
        $('.l-header--sp__menubutton i').addClass('fa-bars');
        $('.l-header--sp__menubutton i').removeClass('fa-times');
        $('.l-header--sp__menuList').stop().slideUp(time || 500);
        closeModal();
    }

    function toggleMenu() {
        $('.l-header--sp__menuList').stop().slideToggle();
        $('.l-header--sp__menubutton i').toggleClass('fa-bars');
        $('.l-header--sp__menubutton i').toggleClass('fa-times');
        if (!$('.c-modal').is(':visible')) {
            if ($('.l-header--sp__menubutton i').hasClass('fa-times')) {
                $('.c-layer--underLayer').fadeIn();
            } else {
                $('.c-layer--underLayer').fadeOut();
            }
        }
    }
    function openModal(number) {
        var top = ($(window).width() < 768) ? 60 : 90;
        var height = $(window).height() - top * 1.2;
        $modal = $('#interview_' + number);
        $modal.find('.c-modal__body').css('height',  (height - $modal.find('.c-modal__picture').height()) + 'px');
        $modal.css('top',  top + 'px').css('height',  height + 'px').fadeIn();
        $('.c-layer--underLayer').fadeIn();
    }

    function closeModal() {
        $('.c-modal').fadeOut();
        $('.c-layer--underLayer').fadeOut();
    }

    function hoverRotate($target) {
        $target.hover(function () {
            if (!rotateFlag) {
                rotateFlag = true;
                $img = $(this).find('img');
                var height = $img.height();
                $img.height(height/2);
                $img.animateRotate(360,2000,'swing', function () {
                    rotateFlag = false;
                    $img.height(height);
                })  
            }
        }, function () {
            $(this).stop();
        });
    }

    $.fn.animateRotate = function(angle, duration, easing, complete) {
      return this.each(function() {
        var $elem = $(this);
        var plus = 0.52;
        if ($(window).width() < 768) {
            plus = 0.15;
        }
        $({deg: 0}).animate({deg: angle}, {
          duration: duration,
          easing: easing,
          step: function(now) {
            var height = $elem.height();
            $elem.css({
               transform: 'rotate(' + now + 'deg)',
               height: (height+plus)+'px'
             });
          },
          complete: complete || $.noop
        });
      });
    };
})(jQuery);