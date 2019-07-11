
$(document).ready(function(){
    //Отправка формы получения кода
    $('.js-form-get-code').on('submit', function(e){
        e.preventDefault();
        if ($('.js-form-get-code').valid()){
            loading_with_overlay(true);
            grecaptcha.execute(captchaGetCode);
        }        
    })
    //Отправка формы ввода проверочного кода
    $('.js-form-enter-code').on('submit', function(e){
        e.preventDefault();
        if ($('.js-form-enter-code').valid()){
            loading_with_overlay(true);
            submitConfirmCode();
        }
    })
    //Нажатия на кнопку отправить код повторно
    $('.js-resend-code-btn').on('click', function(e){
        e.preventDefault();
        $form_enter_code_validator.resetForm(); //сбрасываем ошибки, если есть
        loading_with_overlay(true);
        grecaptcha.execute(captchaResendCode);
    })
    
    //Нажатия на кнопку отправить код
    $('.js-form-get-code button').on('click', function(){
        grecaptcha.reset(captchaGetCode);
    })

    //Нажатие на кнопку перейти на сайт
    $('#btn-goto-site').on('click', function(){
        trackEventBound(2, 'd-v175-e11', 'clickElement', 'Перейти на сайт / '+ $(this).attr('href'));
    })

    /* Обработчик popup и подписка по открытию*/
    $('.js-btn-try').magnificPopup({ 
        type: 'inline',
        preloader: false,
        modal: true,
        fixedContentPos: false,
        focus: '#msisdn',
        callbacks: {
            open: function() {
                //$.magnificPopup.instance.st.closeOnBgClick = true //закрытие по outside click
                $('#throbber').show();

                var clicked_element_id = $.magnificPopup.instance.st.el.attr('id');
                if (clicked_element_id === 'btn-try-top') {//Если клик произошел на верхней кнопке
                    trackEventBound(1, 'd-v175-e1', 'submit1', 'Читать / top');
                } else if (clicked_element_id === 'btn-try-bottom'){//Если клике произошел на нижней кнопке
                    trackEventBound(1, 'd-v175-e1', 'submit1', 'Попробовать / bottom');
                }
                subscribe_apn(); //Пробуем подписать абонента
            },
            close: function() {
                $('#throbber').show();
                ajax_request.abort(); //останавливаем все запросы, если есть
                hide_all_form(); //from helpers.js
                $('.js-resend-code').hide();   
                $('.js-resend-code-success').hide();   
                loading_with_overlay(false);
                $('.js-resend-code-msg').show(); //Показываем блок с обратным отсчетом для отправки повторного кода
                $('.js-resend-code-msg').find('.countdown').html('5:00'); //Меняем время в блоке
                $('.js-resend-code-btn').hide(); //Скрываем кнопку отпроавить код повторно
                clearInterval(sms_timer); //очищаем timer повторной отправки sms
                clearTimeout(sms_timeout);
                $('#code').val('');
                $form_get_code_validator.resetForm(); //сбрасываем валидацию формы
                $('#form-get-code').find('.input__wrap_phone').removeClass('correct').removeClass('error')
                $form_enter_code_validator.resetForm(); //сбрасываем валидацию формы
                $('#form-enter-code').find('.input__wrap_code').removeClass('correct').removeClass('error');
            }
		},

    });
})
function subscribe_apn(){
    ajax_request = $.ajax({
    url: API_URL + '/subscribe/apn',
    type: 'POST', 
    dataType: 'json',
    timeout: 30000,
    data: {
        service_id: SERVICE_ID,
        service_name: SERVICE_NAME,
    },
    success: function(data){
        $('#success').show();
        trackEventBound(1, 'd-v175-e3', 'submitTransaction', 'Сеть МФ / Услуга подключена');
    },
    error: function(error, status) {

        try {
            var errorCode = error.responseJSON.code;
            errorCode = errorCode === undefined ? error.status : errorCode;
        }
        catch(err) {
            $('#throbber').hide();
            if (status === 'timeout') {
                handler_error('504000-c-error') //from helpers.js
                trackEventBound(1, 'd-v175-e4', 'sendError1', 'Сеть МФ / Таймаут / 504000-c-error');
                return;
            }
            handler_error('500000'); //from helpers.js
            trackEventBound(1, 'd-v175-e4', 'sendError1', 'Сеть МФ / Ошибка сервера / 500000');
            return;
        }
        //вызываем функцию, обрабатывающую ошибки
        handler_error(errorCode);
        if (errorCode === '400001') {
            trackEventBound(1, 'd-v175-e5', 'checkOut1', 'Другая сеть / Загружена форма ввода телефона');
        } else {
            trackEventBound(1, 'd-v175-e4', 'sendError1', 'Сеть МФ / BackEnd / '+errorCode);
        }
        
    },
    complete: function(){
        $('#throbber').hide();
    }
})
}
/* reCaptcha callbacks */
function submitGetCode(token){
    msisdn = '7' + $('.js-form-get-code').find('#msisdn').val().replace(/\D/g,'');
    loading_with_overlay(false);
    if ($('.js-form-get-code').valid()) {
        loading_with_overlay(true);
        ajax_request = $.ajax({
            url: API_URL + '/subscribe/otp/send',
            type: 'POST', 
            dataType: 'json',
            timeout: 30000,
            data: {
                'msisdn': msisdn,
                'service_id': SERVICE_ID,
                'g-recaptcha-response': token,
            },
            success: function(data){
                hide_all_form();
                $('#form-enter-code').show();
                sms_timer = start_timer('5:00', function(){
                    $('.js-resend-code-msg').hide();
                    $('.js-resend-code-btn').show();
                });
                trackEventBound(1, 'd-v175-e6', 'checkOut2', 'Другая сеть / Введен номер телефона');
            },
            error: function(error, status) {
                try {
                    var errorCode = error.responseJSON.code;
                    errorCode = errorCode === undefined ? error.status : errorCode;
                }
                catch(err) {
                    $('#throbber').hide();
                    if (status === 'timeout') {
                        //возвращаем ошибку по тайм-ауту
                        handler_error('504000-c-error');
                        trackEventBound(1, 'd-v175-e7', 'sendError2', 'Другая сеть / Таймаут / 504000-c-error');
                        return;
                    }
                    handler_error('500000');
                    trackEventBound(1, 'd-v175-e7', 'sendError2', 'Другая сеть / Ошибка сервера / 500000');
                    return;
                }
                //вызываем функцию, обрабатывающую ошибки
                trackEventBound(1, 'd-v175-e7', 'sendError2', 'Другая сеть / BackEnd / ' + errorCode);
                handler_error(errorCode)
            },
            complete: function(){
                $('#throbber').hide();
                loading_with_overlay(false);
            }
        })         
    }
}
function submitConfirmCode(){

    loading_with_overlay(false);
    msisdn = '7' + $('.js-form-get-code').find('#msisdn').val().replace(/\D/g,'');
    code = $('.js-form-enter-code').find('#code').val().replace(/\D/g,'');
    if ($('.js-form-enter-code').valid()) {
        loading_with_overlay(true);
        ajax_request = $.ajax({
            url: API_URL + '/subscribe/otp/confirm',
            type: 'POST', 
            dataType: 'json',
            timeout: 30000,
            data: {
                'msisdn': msisdn,
                'service_id': SERVICE_ID,
                'code': code,
            },
            success: function(data){
                hide_all_form(); //from helpers.js
                $('#success').show();
                trackEventBound(1, 'd-v175-e8', 'checkOut3', 'Другая сеть / Введен код из СМС');
                trackEventBound(1, 'd-v175-e10', 'submitTransaction', 'Другая сеть / Услуга подключена');
            },
            error: function(error, status) {
                try {
                    var errorCode = error.responseJSON.code;
                    errorCode = errorCode === undefined ? error.status : errorCode;
                }
                catch(err) {
                    $('#throbber').hide();
                    if (status === 'timeout') {
                        //возвращаем ошибку по тайм-ауту
                        handler_error('504000-c-error'); //from helpers.js
                        trackEventBound(1, 'd-v175-e9', 'sendError3', 'Другая сеть / Таймаут / 504000-c-error');
                        return;
                    }
                    handler_error('500000'); //from helpers.js
                    trackEventBound(1, 'd-v175-e9', 'sendError3', 'Другая сеть / Ошибка сервера / 500000');
                    return;
                }
                //вызываем функцию, обрабатывающую ошибки
                handler_error(errorCode); //from helpers.js
                trackEventBound(1, 'd-v175-e9', 'sendError3', 'Другая сеть / BackEnd / ' + errorCode);
            },
            complete: function(){
                $('#throbber').hide();
                loading_with_overlay(false);
            }
        })
    } 
}

function submitResendCode(token){
    msisdn = '7' + $('.js-form-get-code').find('#msisdn').val().replace(/\D/g,'');
    ajax_request = $.ajax({
        url: API_URL + '/subscribe/otp/send',
        type: 'POST', 
        dataType: 'json',
        timeout: 30000,
        data: {
            'msisdn': msisdn,
            'service_id': SERVICE_ID,
            'g-recaptcha-response': token,
        },
        success: function(data){
            $('.js-resend-code-btn').hide();
            $('.js-resend-code-success').show();

            sms_timeout = setTimeout(function() {
                $('.js-resend-code-msg').show();
                $('.js-resend-code-msg').find('.countdown').html('5:00'); //Меняем время в блоке
                $('.js-resend-code-success').hide();
                sms_timer = start_timer('5:00', function(){
                    $('.js-resend-code-msg').hide();
                    $('.js-resend-code-btn').show();
                })
            }, 30000);      
        },
        error: function(error, status) {
            try {
                var errorCode = error.responseJSON.code
            }
            catch(err) {
                $('#throbber').hide();
                if (status === 'timeout') {
                    //возвращаем ошибку по тайм-ауту
                    handler_error('504000-c-error');
                    return;
                }
                handler_error('500000');
                return;
            }
            //вызываем функцию, обрабатывающую ошибки
            handler_error('500000');
        },
        complete: function(){
            $('#throbber').hide();
            loading_with_overlay(false);
            grecaptcha.reset(captchaResendCode);
        }
    })         

}