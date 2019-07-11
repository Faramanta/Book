$(document).ready(function() {

$form_get_code_validator = $('.js-form-get-code').validate({
        rules: {
            msisdn: {
                required: true,
                minlength: 15,
            },
            code: {
                required: true,
                minlength: 15,
            },
        },
        messages: {
            msisdn: {
                required: "Обязательное поле",
                minlength: "Номер телефона должен состоять из 10 цифр",
            },
            code: {
                required: "Обязательное поле",
            }
        },
        validClass: "correct",
        errorPlacement: function(error, element) {
            element.parent(".input__wrap").after(error);
        },
        highlight: function(element, errorClass, validClass) {
            $(element).parent(".input__wrap").addClass(errorClass);
            $(element).parent(".input__wrap").removeClass(validClass);
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).parent(".input__wrap").removeClass(errorClass);
            $(element).parent(".input__wrap").addClass(validClass);
        },
});

$form_enter_code_validator = $('.js-form-enter-code').validate({
        rules: {
            code: {
                required: true,
                minlength: 4,
                maxlength: 4,
            },
        },
        messages: {
            code: {
                required: "Обязательное поле",
                minlength: "Проверочный код должен состоять из 4 цифр",
            }
        },
        validClass: "correct",
        errorPlacement: function(error, element) {
            element.parent(".input__wrap").after(error);
        },
        highlight: function(element, errorClass, validClass) {
            $(element).parent(".input__wrap").addClass(errorClass);
            $(element).parent(".input__wrap").removeClass(validClass);
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).parent(".input__wrap").removeClass(errorClass);
            $(element).parent(".input__wrap").addClass(validClass);
        },
});


})

