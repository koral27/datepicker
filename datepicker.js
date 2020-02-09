$(document).ready(function () {
    
    // Datepicker component
    
    function Datepicker(id){
        this.wrapperId = '#' + id;
        this.wrapper = {
            elem: $('#' + id),
            addFocus: function(){
                $(this.elem).addClass('focus');
            },
            removeFocus: function(){
                $(this.elem).removeClass('focus');
            }
        };
        this.mainInput = $(this.wrapperId).find('.main-input');
        this.day = $(this.wrapperId).find('.day');
        this.month = $(this.wrapperId).find('.month');
        this.year = $(this.wrapperId).find('.year');
        this.close = $(this.wrapperId).find('.close');
        this.checkKeyCode = function(event){
            // Разрешаем: backspace, delete, tab и escape
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
                // Разрешаем: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Разрешаем: home, end, влево, вправо
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                // Ничего не делаем
                return;
            } else {
                // Убеждаемся, что это цифра, и останавливаем событие keypress
                if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        };
        this.init = function(){
            var that = this;
            var im = new Inputmask("99.99.9999");

            // main input events

            im.mask(that.mainInput); // Маска для main input
            $(that.mainInput).on('click', function() {
                if (this.value.length === 0) {
                    $(that.day).trigger('focus')
                } else if (this.value.length === 10) {
                    $(that.year).trigger('focus')
                }
            });
            $(that.mainInput).on('focus',    function() { 
                if (this.value.length > 0) {
                    $(that.close).css('display', 'flex');
                };
            });
            $(that.mainInput).on('change', function() { 
                // при выборе даты через календарь передаем в инпуты D, M, Y аналогичные значения dd.mm.yyyy
                var mainInputValue = $(that.mainInput).val();
                $(that.day).val(mainInputValue.substring(0, 2));
                $(that.month).val(mainInputValue.substring(3, 5));
                $(that.year).val(mainInputValue.substring(6, 10));
                $(that.month).css('padding-left', '2px');
                $(that.close).css('display', 'flex');
            });

            $(that.mainInput).datepicker(); // Инициализация датапикера
            
            // day events

            $(that.day).on('click', function(){
                if( $(that.mainInput).val().length === 0 ){
                    $(that.mainInput).trigger('focus');
                    $(this).trigger('focus');
                }
            })
            $(that.day).on('input', function() {
                // переключение фокуса на следующий инпут
                if (this.value.length === 2) {
                    $(that.month).trigger('focus');
                }
                // добавляем value инпута в основной инпут
                $(that.mainInput).val($(that.day) + $(that.month).val() + $(that.year).val());
            });
            $(that.day).on('focus',    function() { that.wrapper.addFocus(); });
            $(that.day).on('focusout', function() { that.wrapper.removeFocus(); });
            $(that.day).on('keydown',  function() { that.checkKeyCode(event); });

            // month events
            $(that.month).on('input', function() {
                // переключение фокуса на следующий инпут
                if (this.value.length === 2) {
                    $(that.year).trigger('focus');
                }

                // добавляем value инпута в основной инпут
                $(that.mainInput).val($(that.day).val() + $(that.month).val() + $(that.year).val());
            });
            $(that.month).on('focus',    function() { that.wrapper.addFocus(); });
            $(that.month).on('focusout', function() { that.wrapper.removeFocus(); });
            $(that.month).on('keydown', function(e) { 
                that.checkKeyCode(event); 
                // backspace
                if ( $(this).val().length === 0 && e.keyCode === 8 ) {
                    $(that.day).trigger('focus');
                }
                $(this).css('padding-left', '2px');
            });

            // year events

            $(that.year).on('input', function() {
                // переключение фокуса на следующий инпут
                if ($(this).val().length === 4) {
                    $(that.mainInput).trigger('focus');
                    setTimeout(function () {
                        $(this).trigger('focus');
                    }, 100);
                }

                // добавляем value инпута в основной инпут
                $(that.mainInput).val($(that.day).val() + $(that.month).val() + $(that.year).val());
            });
            $(that.year).on('focus',    function() { that.wrapper.addFocus(); });
            $(that.year).on('focusout', function() { that.wrapper.removeFocus(); });
            $(that.year).on('keydown', function(e) { 
                that.checkKeyCode(event); 
                // backspace
                if ( $(this).val().length === 0 && e.keyCode === 8 ) {
                    $(that.month).trigger('focus');
                }
            });

            // close button events

            $(that.close).on('click', function(){
                // очищение инпутов
                $(that.mainInput).val('');
                $(that.day).val('');
                $(that.month).val('');
                $(that.year).val('');
                // скрываем элемент
                $(this).hide();
                // стилизация по макету
                $(that.month).css('padding-left', '0px');
            });

        }
    }

    // ОБъявление и вызов датапикера

    var datepicker1 = new Datepicker('datepicker1');
    var datepicker2 = new Datepicker('datepicker2');
    
    datepicker1.init();
    datepicker2.init();


    // Дефолтные настройки датапикера
    $.datepicker.setDefaults({
        closeText: "Закрыть",
        prevText: "&#x3C;Пред",
        nextText: "След&#x3E;",
        currentText: "Сегодня",
        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ],
        monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
            "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
        ],
        dayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
        dayNamesShort: ["вск", "пнд", "втр", "срд", "чтв", "птн", "сбт"],
        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        weekHeader: "Нед",
        dateFormat: "dd.mm.yy",
        firstDay: 1,
        isRTL: false,
        showOtherMonths: true,
        showAnim: 'drop'
    });
})
