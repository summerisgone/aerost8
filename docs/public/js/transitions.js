(function($, History) {
    'use strict';
    var $wrap = $('#wrap');
    $wrap.on('click', '.js-link', function(event) {
        event.preventDefault();
        if (window.location === this.href) {
            return;
        }
        var pageTitle = (this.title) ? this.title : this.textContent;
        History.pushState(null, pageTitle, this.href);
    });

    History.Adapter.bind(window, 'statechange', function() {
        var state = History.getState();
        $.get(state.url, function(res) {
            $.each($(res), function(index, elem) {
                if ($wrap.selector !== '#' + elem.id) {
                    return;
                }
                $wrap.html($(elem).html());
                window.scroll(0,0);
                window.player && window.player.updateControls();
            });
        });
    });
}(window.jQuery, History));
