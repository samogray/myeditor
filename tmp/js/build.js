/**
 * Created by Oleksandr on 30.06.2016.
 */
'use strict';

$(document).ready(function () {
    var i =0;
    $('.add-block').removeClass('active');
    console.log('hello');

    $('#addBlock').click(function(){
        /*  $('.add-block').toggleClass('active');*/
      /*  $('.web-container').toggleClass('active');*/
    });

    $('.next').click(function(e){
        e.preventDefault();
        if (i<42){
            i+=7;
            $('.menu_add-block').css("left",'-'+i+"%");
        }
    });
    $('.prev').click(function(e){
        e.preventDefault();
        if (i>0){
            i-=7;
            $('.menu_add-block').css("left",'-'+i+"%");
        }
    });

   /* $('.myselect').click(function(e){
        e.preventDefault();
        $(this).children('.myselect__options').toggle();
    });*/

    var select = $('.myselect');
    var open = $('.myselect__open');
    var options = $('.myselect__opt');

    open.click(function(e){
        e.preventDefault();
        $(this).siblings('.myselect__opt').toggleClass('active');
        $(this).toggleClass('active');

    });



});
