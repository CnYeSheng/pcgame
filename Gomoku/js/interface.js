$(document).ready(function(){
    var game = new Game($(".go-board"), $(".board tbody"));

    var adjustSize = adjustSizeGen();

    $(window).resize(adjustSize);

    adjustSize();
    $.mobile.defaultDialogTransition = 'flow';
    $.mobile.defaultPageTransition = 'flow';
    
    $('#mode-select input[type="radio"]').on('change', function(){
        gameData.mode=$(this).val();
    });
    
    $('#color-select input[type="radio"]').on('change', function(){
        gameData.color=$(this).val();
    });
    
    $('#level-select input[type="radio"]').on('change', function(){
        gameData.level=$(this).val();
    });
    
    $('.back-to-game').on('tap',function(){
        $.mobile.changePage('#game-page');
    });
    
    $("#start-game").on('click',function(){
        try{
            game.white.worker.terminate();
            game.black.worker.terminate();
        }catch(e){}
        if(gameData.mode==='vshuman'){
            game.mode='hvh';
            game.init(new HumanPlayer("black"), new HumanPlayer("white"));
        }else{
            var color, other;
            if(gameData.color==='black'){
                color='black';
                other='white';
            }else{
                color='white';
                other='black';
            }
            game.mode=gameData.level;
            game.init(new HumanPlayer(color), new AIPlayer(game.mode, other));
        }
        $.mobile.changePage('#game-page');
        game.start();
        setTimeout(function(){$('.back-to-game').button('enable');},100);
    });

    $("#undo-button").on('tap', function(){
        game.undo();
    });
    
    $('.fullscreen-wrapper').on('tap', function(){
        $(this).hide();
        $.mobile.changePage('#game-won');
    });
    
    $('#new-game').page();
    $('#game-won').page();
    gameData.load();
    $('.back-to-game').button('disable');
    $.mobile.changePage('#new-game',{changeHash: false});

    window.gameInfo = (function(){
        var blinking = false,
            text = "",
            color = "";

        var self = {};

        self.getBlinking = function(){
            return blinking;
        };

        var mainObj = $("#game-info");
        self.setBlinking = function(val){
            if(val !== blinking){
                blinking = val;
                if(val){
                    mainObj.addClass("blinking");
                }else{
                    mainObj.removeClass("blinking");
                }
            }
        };

        self.getText = function(){
            return text;
        };

        var textObj = $("#game-info>.cont");
        self.setText = function(val){
            text = val;
            textObj.html(val);
        };

        self.getColor = function(){
            return color;
        };

        var colorObj = $("#game-info>.go");
        self.setColor = function(color){
            colorObj.removeClass("white").removeClass("black");
            if(color){
                colorObj.addClass(color);
            }
        };

        return self;
    })();
});

function showWinDialog(game){
    gameInfo.setBlinking(false);
    if(game.mode === 'hvh'){
        var who=(function(string){ return string.charAt(0).toUpperCase() + string.slice(1);})(game.getCurrentPlayer().color);
        $("#game-won h4").html(who+' Won!');
        gameInfo.value=who+' won.'
        $("#win-content").html(who+' 贏了遊戲 再玩一次？');
        $('#happy-outer').fadeIn(500);
    }else{
        if(game.getCurrentPlayer() instanceof HumanPlayer){
            $("#game-won h4").html('你贏了!');
            $("#win-content").html('哇！ 你贏了 要不要再來一局？');
            gameInfo.value='You won.'
            $('#sad-outer').fadeIn(800);
        }else{
            $("#game-won h4").html('你輸了');
            $("#win-content").html("哈哈😄！ 你要再多練練啊 不服輸？ 再試一次吧！");
            gameInfo.value='AI won.'
            $('#happy-outer').fadeIn(800);
        }
    }
}