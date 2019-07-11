var sms_timer; //переменная в которую записывается id таймера повторной отправки sms
var sms_timeout; //переменная в которой храниться timeout (показа ссылки повторной отправки sms)
var ajax_request; //переменная в которую пишем запрос, чтобы его можно было остановить
/* Валидация */
var $form_get_code_validator; //Валидация формы получения проверочного кода (ввод msisdn)
var $form_enter_code_validator; //Валидация формы ввода проверочного кода (подписка)

/* For Google reCaptcha */
var captchaGetCode, captchaConfirmCode;
var onLoadHandler = function() {
	captchaGetCode = grecaptcha.render('captchaGetCodeID', {
        'sitekey' : GOOGLE_RECAPTCHA_SITE_KEY, 
        'callback': 'submitGetCode',
        'size': 'invisible',
    });
    captchaResendCode = grecaptcha.render('captchaResendCodeID', {
        'sitekey' : GOOGLE_RECAPTCHA_SITE_KEY, 
        'callback': 'submitResendCode',
        'size': 'invisible',
    });
}

/* обработчик закрытия popup */
$('.popup__close').on('click', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
});

//Активируем маску 
$('.msisdn').mask("(000) 000-00-00");
$('.code').mask("0000");

$(document).ready(function(){
    var service_name_text = $('#success').find('.ttl2').html();
    service_name_text = service_name_text.replace('(SERVICE_NAME)', SERVICE_NAME);
    $('#success').find('.ttl2').html(service_name_text);
})