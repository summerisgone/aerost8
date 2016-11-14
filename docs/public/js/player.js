function Player(options) {
    this.element = options.element;
    // input event streams
    this.urlClickSubject = new Rx.BehaviorSubject(null);
    this.pauseToggleSubject = new Rx.Subject();
    // UI events
    this.statusObservable = new Rx.BehaviorSubject();
    this.infoObservable = new Rx.BehaviorSubject();
    this.progressSubject = new Rx.BehaviorSubject([0,0]);
    this.loadingSubject = new Rx.BehaviorSubject(0);
    this.sound = null;
    this.init();
    this.setupUI();
}
Player.sound = null;

Player.prototype.init = function() {
    // input to output mapping setup
    var urlClickObservable = this.urlClickSubject.bufferCount(2, 1).map((args) => {
        var prev = args[0], curr = args[1];
        if (prev === curr) {
            return { url: curr, type: 'PAUSE' };
        } else {
            return { url: curr, type: 'SWITCH' };
        }
    });
    var pauseToggleObservable = urlClickObservable
        .filter(d => d.type === 'PAUSE')
        .merge(this.pauseToggleSubject);
    var trackUrlObseravble = urlClickObservable
        .filter(d => d.type === 'SWITCH')
        .map(d => d.url);

    // sound stuff
    trackUrlObseravble.subscribe(url => {
        if (this.sound) {
            this.sound.destruct();
            this.sound = null;
        }
        this.sound = soundManager.createSound({
            url: url,
            autoLoad: true,
            whileloading: () => {
                this.loadingSubject.next(Math.ceil(this.sound.bytesLoaded * 100));
            },
            whileplaying: () => {
                this.progressSubject.next([this.sound.position, this.sound.duration]);
            },
            onpause: () => {
                this.statusObservable.next('pause');
            },
            onresume: () => {
                this.statusObservable.next('play');
            },
            onplay: () => {
                this.statusObservable.next('play');
            }
        });
        this.sound.play();
    });
    pauseToggleObservable.subscribe(pause => {
        this.sound && this.sound.togglePause();
    });
};

Player.prototype.setupUI = function() {
    var $player = $(this.element);
    this.statusObservable.subscribe(status => {
        if (status === 'pause') {
            $player.find('#id_player_status').attr('class', 'fa fa-pause');
        }
        if (status === 'play') {
            $player.find('#id_player_status').attr('class', 'fa fa-play');
        }
        if (status === 'play') {
            $player.addClass('active');
        }
    });

    this.loadingSubject.subscribe(percent => {
        $player.find('#id_player_progress_loading').css('width', percent + '%');
    });

    this.progressSubject.subscribe((args) => {
        var position = args[0], duration = args[1];
        $player.find('#id_player_progress_playing').css('width', position / duration * 100 + '%');
        var current = (position / 1000 / 60).toFixed() + ':' + (position / 1000 % 60).toFixed();
        var total = (duration / 1000 / 60).toFixed() + ':' + (duration / 1000 % 60).toFixed();
        $player.find('#id_player_play_time').text(current);
        $player.find('#id_player_total_time').text(total);
    });
};

Player.prototype.urlClick = function(url, el) {
    this.urlClickSubject.next(url);
    if (el) {
        $('.js-play').removeClass('btn-primary');
        player.statusObservable.take(1).subscribe(function(status) {
            var $el = $(el);
            $(el).addClass('btn-primary');
            if (status === 'pause') {
                $el.find('i.fa').attr('class', 'fa fa-pause');
            }
            if (status === 'play') {
                $el.find('i.fa').attr('class', 'fa fa-play');
            }
        });
    }
};

Player.prototype.togglePause = function() {
    this.pauseToggleSubject.next();
};


(function() {
    soundManager.setup({
        onready: function() {
            var player = window.player = new Player({
                element: document.getElementById('id_player')
            });
            $(document).on('keypress', function(e) {
                if (e.target.tagName.toLowerCase() === 'body' && e.keyCode === 32) {
                    e.stopPropagation();
                    player.togglePause();
                }
            });
        }
    });
})();
