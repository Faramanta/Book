/* Функция очищает вывод поп-апа */
function hide_all_form(){
    $('#form-enter-code').hide();
    $('#form-get-code').hide();
    $('#error').hide();
    $('#success').hide();
}

/* Функция отвечает за обработку ошибок, которые возвращаются с сервера */
function handler_error(errorCode){
    function show_error(errorCode, buttonUrl){
        $('.error__img').removeClass('error-3__img').removeClass('error-1__img');
        $('#error-title').html(ERROR_DATA[errorCode]['title']);
        $('#error-message').html(ERROR_DATA[errorCode]['message']);
        $('.error__img').attr('src', ERROR_DATA[errorCode]['image']);

        if (ERROR_DATA[errorCode]['btn_url'] === '' || ERROR_DATA[errorCode]['btn_url'] === false) {
            $('#btn-goto-site').hide(); //скрываем кнопку перейти на сайт
        } else {
            $('#btn-goto-site').show().attr('href', ERROR_DATA[errorCode]['btn_url']); //показываем кнопку перейти на сайт
        }
        $('#error').show();
    }

    switch(errorCode) {
        case "400001":
            //невозможно подключить услугу по apn
            $('#form-get-code').show();
            $('#msisdn').focus()
            break;
        case "405001": //Превышено допустимое количество отправок проверочного кода
            if ($('#form-enter-code').css('display') == 'none') {
                ///Если форма ввода проверочного кода скрыта, тогда добавляем ошибку к полю MSISDN в форме запроса проверчоного кода
                $form_get_code_validator.showErrors({ msisdn: ERROR_DATA[errorCode]['message'] }); 
            } else if ( $('#form-get-code').css('display') == 'none') {
                ///Если форма ввода запроса проверочного кода скрыта, тогда добавляем ошибку к полю code в форме ввода проверчного кода
                $form_enter_code_validator.showErrors({ code: ERROR_DATA[errorCode]['message'] }); 
            }
            break;
        case "406001": //Код подтверждениы устарел (нет данных)
        case "409001": //Код подтверждения неверный
            $form_enter_code_validator.showErrors({ code: ERROR_DATA[errorCode]['message'] }); 
            break;
        case '501001': //Недостаточно средств для подключения услуги
            hide_all_form();
            show_error(errorCode);
            $('.error__img').addClass('error-1__img');
            break;
        case '506001': //Подписка уже подключена
            hide_all_form();
            show_error(errorCode);
            break;
        case '400002': //Некорректный запрос к VAS-P
        case '415001': //Подключение подписки запрещено
        case '504000-c-error': //Таймаут
            hide_all_form();
            show_error(errorCode);
            $('.error__img').addClass('error-3__img');
            break;
        default: 
            hide_all_form();
            show_error('500000', SERVICE_URL);
            $('.error__img').addClass('error-3__img');
            break;
    }
}
function loading_with_overlay(enable){
    if (enable === true){
        $('.popup__loading').show();
        $('#throbber').show()
    } else if (enable === false) {
        $('.popup__loading').hide();
        $('#throbber').hide();
    }
}
/**
 * Запускает таймер обратного отсчета
 * основываясь на получаемом имени тэга
 *
 * @param <String> начальное время в формате MM:SS
   @param <Function> функция, которая выполниться после завершения отсчета
 * @return <Number> возвращает interval id, по которому его можно сбросить
 */
function start_timer(timer2, callback){
    var interval;
    interval =  setInterval(function() {
        var timer = timer2.split(':');
        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) {
            clearInterval(interval);
            callback();
            return true;
        } 
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        //minutes = (minutes < 10) ?  minutes : minutes;
        $('.countdown').html(minutes + ':' + seconds);
        timer2 = minutes + ':' + seconds;
    }, 1000);

    return interval;
}