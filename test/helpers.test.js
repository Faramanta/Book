jest.dontMock('fs').dontMock('jquery');
const $ = require('jquery');
const html = require('fs').readFileSync('./src/index.html').toString();

/* Испортируем JS */
const helpers = require('fs').readFileSync('./src/js/helpers.js').toString();
const config = require('fs').readFileSync('./src/js/config.js').toString();
const validate = require('../src/js/jquery.validate.min.js');

var $form_get_code_validator; //переменная для работы валидатора
var $form_enter_code_validator;//переменная для работы валидатора

eval(config); //выполняем js (импортируем функции и переменные в текущую область видимости)
eval(helpers); //выполняем js (импортируем функции и переменные в текущую область видимости)

describe('Test hide_all_form function', function() {

   it('Should hide all div in form', function() {
    document.documentElement.innerHTML = html;

    $('#form-enter-code').show();
    $('#form-get-code').show();
    $('#error').show();
    $('#success').show();

    hide_all_form(); //вызываем тестируемую функцию

    expect($('#form-enter-code').css('display')).toBe('none');
    expect($('#error').css('display')).toBe('none');
    expect($('#form-get-code').css('display')).toBe('none');
    expect($('#success').css('display')).toBe('none');

  });  
 
});

describe('Error handler test', function() {
    
    beforeEach(() => {
        document.documentElement.innerHTML = html;
        $form_get_code_validator = $('#form-get-code').validate() ; //Валидация формы получения проверочного кода (ввод msisdn)
        $form_enter_code_validator = $('#form-enter-code').validate(); //Валидация формы ввода проверочного кода (подписка)
    });

    afterEach(() => {
        $form_get_code_validator.resetForm();
        $form_enter_code_validator.resetForm();
        $('#error').hide();
    });

    const errors_in_popup = [ //ошибки, которые отображаются в новом popup
        '400002', 
        '415001', 
        '501001', 
        '506001', 
        '504000-c-error', 
        '500000',
    ];
    const error_inline = [ //ошибки, которые отображаются под полем ввода code
        '406001', 
        '409001',
    ];

    errors_in_popup.forEach(error => {
        it(`Should display right error message in new popup for error code: ${error}`, function(){
             handler_error(error);

             expect($('#error-title').html()).toBe(ERROR_DATA[error]['title']);
             expect($('#error-message').html()).toBe(ERROR_DATA[error]['message']);
             expect($('.error__img').attr('src')).toBe(ERROR_DATA[error]['image']);
             expect($('#error').css('display')).toBe('block');

             if ($('.error__img').attr('src') === 'img/error_3.svg'){
                 expect($('.error__img').hasClass('error-3__img')).toBe(true);
                 expect($('.error__img').hasClass('error-1__img')).toBe(false);
             } else if ($('.error__img').attr('src') === 'img/error_1.svg') {
                 expect($('.error__img').hasClass('error-1__img')).toBe(true);
                 expect($('.error__img').hasClass('error-3__img')).toBe(false);
             }

             if (error === '504000-c-error' || error === '415001') { //У этих ошибок нет кнопки
                expect($('#btn-goto-site').css('display')).toBe('none');
                expect($('#btn-goto-site').attr('href')).toBe('');
             } else {
                expect($('#btn-goto-site').css('display')).toBe('');
                expect($('#btn-goto-site').attr('href')).toBe(ERROR_DATA[error]['btn_url']);
             }

        });
    })

    error_inline.forEach(error => {
        it(`Should display right error message under field. Error code: ${error}`, function(){
            handler_error(error);
            expect($('#code-error').html()).toBe(ERROR_DATA[error]['message']);
        })
    })

    it('Should display right error message under field. Error code: 405001', function(){
        handler_error('405001');
        expect($('#msisdn-error').html()).toBe(ERROR_DATA['405001']['message']);
    })
    
});