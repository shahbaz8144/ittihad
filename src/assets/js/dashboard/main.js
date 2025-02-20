

!function ($) {
    "use strict";

    var Components = function () { };


    //peity charts

    Components.prototype.initKnob = function() {
        $('[data-plugin="knob"]').each(function(idx, obj) {
           $(this).knob();
        });
    },


    //initilizing
    Components.prototype.init = function () {
        this.initKnob();
        console.log("test");
    },

    $.Components = new Components, $.Components.Constructor = Components

}(window.jQuery),



function ($) {
    'use strict';

    var App = function () {    };


    //initilizing
    App.prototype.init = function () {
        $.Components.init();


    },

    $.App = new App, $.App.Constructor = App


}(window.jQuery),
//initializing main application module
function ($) {
    "use strict";
    $.App.init();
}(window.jQuery);
