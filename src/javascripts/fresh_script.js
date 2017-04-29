global.jQuery = require('jquery');
var validetta = require('./validetta/validetta.js');
var $ = require("jquery");
var background_color = '#fff'
require('slick-carousel');

(function($) {
	// Validetta
	$(document).ready(function() {
		$('#form').validetta({
			onValid: function(e) {
				e.preventDefault();
				var $form = $('#form');
				var $button = $form.find('button');

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
						if (result == 0) {
							$form[0].reset();
							$('.c-input__checkboxTick').addClass('s-hidden');
							alert('送信完了しました');
						} else {
							if (result == 1) {
								alert('未入力項目があります');
							} else {
								alert('メールアドレスが無効です');
							}
						}
					},
					error: function() {
						alert('送信に失敗しました');
					}
				});
			},
			onError: function(e) {
				var height;
				var width = $(window).width();
				$(".validetta-bubble").each(function() {
					height = $(this).offset().top - 120;
					return false;
				});
				$('html,body').animate({ scrollTop: height });
			},
			realTime: true
		});
	});
	// slickでスライド
	$('.p-infographics__slider').slick({
		// normal options... 
		infinite: true,
		slidesToShow: 3,
		prevArrow: '<button class="p-infographics__btn p-infographics__btn--prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button class="p-infographics__btn p-infographics__btn--next"><i class="fa fa-angle-right"></i></button>',
		adaptiveHeight: true,
		autoplay: true,
		pauseOnFocus: true,
		pauseOnHover: true,
		// the magic 
		responsive: [{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				arrows: false
			}
		}, {
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
			}
		}]
	});
	//メニュークリックで各sectionに遷移させる 
	$('a[href^="#"]').click(function() {
		var offsetY = -10;
		var time = 500;
		var target = $(this.hash);
		if (!target.length) return;
		var targetY = target.offset().top + offsetY;
		$('html,body').animate({ scrollTop: targetY }, time, 'swing', function() {
			// $('.l-header--sp__menuList').slideUp(200);
			// $('.l-header--sp__menubutton i').addClass('fa-bars');
			// $('.l-header--sp__menubutton i').removeClass('fa-times');
			// $('.c-layer--underLayer').addClass('s-hidden');
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
		if (targetContents.charAt(0) == '#' && $(targetContents) && $(targetContents).offset() && $(targetContents).parent()) {
			// ページ上部からコンテンツの開始位置までの距離を取得
			var targetContentsTop = $(targetContents).offset().top - parseInt($(targetContents).parent().css("marginTop")) - 30;
			// ページ上部からコンテンツの終了位置までの距離を取得
			var targetContentsBottom = $(targetContents).offset().top + $(targetContents).parent().height() + parseInt($(targetContents).parent().css("paddingBottom"));

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
			if (contentsArr[i][0] - 300 <= windowScrolltop && contentsArr[i][1] - 300 >= windowScrolltop) {
				// 開始位置と終了位置の間にある場合、ナビゲーションにclass="current"をつける
				navLink.removeClass('active');
				navLink.eq(i).addClass('active');

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
			curNum2 = curNum + 1; //HTML順序用
			$('#nav li').removeClass('on');
			$('#nav li:nth-child(' + curNum2 + ')').addClass('on');
		}
	};

	// ヘッダのメニューボタンのクリクエベント
	$('.l-header--sp__menubutton').click(function() {
		toggleMenu();
	});
	// スクロールトップボタンの表示
	// 現在の画面の位置をチェック。
	// 画面高さを過ぎたらボタンを表示させる
	$(window).scroll(function(event) {
		var scroll = $(window).scrollTop();
		if (scroll > $(window).height()) {
			$('.c-btn--scrollTop').fadeIn();
		} else {
			$('.c-btn--scrollTop').hide();
		}
	});

	// トップにスクロールする
	$('.c-btn--scrollTop').click(function() {
		var body = $("html, body");
		body.stop().animate({ scrollTop: 0 }, '500', 'swing');
	});

	// 背景、メニュうーボタンじゃないエレメントをクリックするとヘッダメニューが閉じる
	$(window).click(function(e) {
		if ($(e.target).hasClass('c-layer--underLayer')) {
			closeMenu();
			closeModal();
			return false;
		} else {
			if (!$(e.target).hasClass('l-header--sp__menubutton') &&
				!$(e.target).parent().hasClass('l-header--sp__menubutton') &&
				!$(e.target).parents().hasClass('l-header--sp__menuList')) {
				closeMenu();
			}
		}
	});
	
  // $(document).ready(function () {
  //   // イメージの幅のリサイズ
  //   var screenWidth = $(window).width();
  //   $('.p-seminar img').each(function () {
  //     if ($(this).width() > (screenWidth * 0.9) || $(this).width() > 500) {
  //       $(this).css('width', '100%');
  //       $(this).css('height', 'auto');
  //     }
  //   });
  // });
	// スライダー
	$('.p-jumbotron__pictureSlider').slick({
		// normal options... 
		infinite: true,
		slidesToShow: 1,
		appendArrows: $('.p-jumbotron__message'),
		prevArrow: '<button class="p-jumbotron__btn p-jumbotron__btn--prev"><i class="fa fa-angle-left"></i></button>',
		nextArrow: '<button class="p-jumbotron__btn p-jumbotron__btn--next"><i class="fa fa-angle-right"></i></button>',
		adaptiveHeight: true,
		autoplay: true,
		pauseOnFocus: true,
		pauseOnHover: true,
		// the magic 
		responsive: [{
			breakpoint: 769,
			settings: {
				arrows: false
			}
		}]
	});
	// Input checkbox 処理
	$('input[type=checkbox]').change(function() {
		checkBox($(this));
	});

	function checkBox($target) {
		$target.parent().find('.c-input__checkboxTick').toggleClass('s-hidden');
	}

	// Input radio 処理
	$('input[type=radio]').change(function() {
		checkRadio($(this));
		if ($(this).val()==='other') {
			$(this).parent().find('input[name=viaOther]').attr('data-validetta','required');
		} else {
			$(this).parent().parent().find('input[name=viaOther]').attr('data-validetta','');
			$(this).parent().parent().find('.validetta-bubble').hide();
		}
	});

	function checkRadio($target) {
		$target.parent().parent().find('.c-inputRadio__circle').addClass('s-hidden');
		$target.parent().parent().find('.c-inputRadio__circleBox').removeClass('s-hidden');
		$target.parent().parent().find('input[type=radio]').prop('checked', false);
		$target.parent().find('.c-inputRadio__circle').removeClass('s-hidden');
		$target.parent().find('.c-inputRadio__circleBox').removeClass('s-hidden');
		$target.prop('checked', true);
	}

	function closeMenu(time) {
		$('.l-header--sp__menubutton i').addClass('fa-bars');
		$('.l-header--sp__menubutton i').removeClass('fa-times');
		$('.l-header--sp__menuList').stop().slideUp(time || 500);
		$('.c-layer--underLayer').addClass('s-hidden');
	}

	function toggleMenu() {
		$('.l-header--sp__menuList').stop().slideToggle();
		$('.l-header--sp__menubutton i').toggleClass('fa-bars');
		$('.l-header--sp__menubutton i').toggleClass('fa-times');
		$('.c-layer--underLayer').toggleClass('s-hidden');
	}

	function openModal(top) {
		$('.c-modal').css('top', top + 'px').fadeIn();
		$('.c-layer--underLayer').fadeIn();
		if (top) {
			$('html,body').animate({ scrollTop: top - 100 }, 700, 'swing');
		}
	}

	function closeModal() {
		$('.c-modal').fadeOut();
		$('.c-layer--underLayer').fadeOut();
		$('.c-modal').fadeOut();
	}
})(jQuery);
