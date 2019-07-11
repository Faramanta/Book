var API_URL = 'http://salon.megafon.ru/api';
var SERVICE_ID = 'litres_try'; //id подписки 
var SERVICE_NAME = "Книги"; //Название подписки
var SERVICE_URL = 'https://moscow.megafon.ru/services/joy/books/'; //URL услуги на сайте Мегафона
var SERVICE_URL_2 = 'https://books.megafon.ru'; //Ссылка на страницу сервиса (для использования)
var MEGAFON_PAY_URL = "https://pay.megafon.ru";
var GOOGLE_RECAPTCHA_SITE_KEY = '6LdMnKkUAAAAAPlY8ES6JfO3oTf16FxC2JJ2mdQx';


var ERROR_DATA = {
    '400002': {
        title: 'Что-то пошло не так...',
        message: 'Попробуйте подключить услугу на нашем сайте.',
        image: 'img/error_3.svg',
        btn_url: SERVICE_URL,
    },
    '405001': {
        title: '',
        message: 'Слишком много попыток. Попробуйте ещё раз через 10 минут.',
        image: '',
        btn_url: '',
    },
    '406001': {
        title: '',
        message: 'Срок действия проверочного кода истек',
        image: '',
        btn_url: '',
    },
    '409001': {
        title: '',
        message: 'Код подтверждения неверный',
        image: '',
        btn_url: '',
    },
    '415001': {
        title: 'Что-то пошло не так...',
        message: 'Похоже на вашем номере действует запрет на подключение услуг. Позвоните по бесплатному номеру 0500, чтобы снять ограничения.',
        image: 'img/error_3.svg',
        btn_url: '',
    },
    '501001': {
        title: 'Что-то пошло не так...',
        message: 'Убедитесь, что денег на вашем счёте достаточно. Пополнить баланс быстро и без комиссии можно на нашем сайте или в терминале салона «МегаФон».',
        image: 'img/error_1.svg',
        btn_url: MEGAFON_PAY_URL,
    },
    '506001': {
        title: 'Услуга «' + SERVICE_NAME + '» уже подключена',
        message: 'Начните пользоваться прямо сейчас.',
        image: 'img/success.svg',
        btn_url: SERVICE_URL_2,
    },
    '504000-c-error': { //ошибка генерируется на клиенте, не возвращается сервером
        title: 'Что-то пошло не так...',
        message: 'Превышено время ожидания ответа от сервера. Попробуйте еще раз.',
        image: 'img/error_3.svg',
        btn_url: '',
    },
    '500000': {
        title: 'Что-то пошло не так...',
        message: 'Попробуйте подключить услугу на нашем сайте.',
        image: 'img/error_3.svg',
        btn_url: SERVICE_URL,
    },

}