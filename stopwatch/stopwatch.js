var status = 0; //0:stop 1:running
var time = 0;
                 
    function start(){
        status = 1;
        document.getElementById("startBtn").disabled = true;
        timer();
    }
    function stop(){
        status = 0;
        document.getElementById("startBtn").disabled = false;
    }
    function reset(){
        status = 0;
        time = 0;
        document.getElementById('SW-timerLabel').innerHTML = '00:00:00';
        document.getElementById("startBtn").disabled = false;
    }
    function timer(){
        if(status == 1){
            setTimeout(function(){
                time++;
                var min = Math.floor(time/100/60);
                var sec = Math.floor(time/100);
                var mSec = time % 100;
                 
                if(min < 10) {
                    min = "0" + min;
                }
                if(sec >= 60) {
                    sec = sec % 60;
                }
                if(sec < 10) {
                    sec = "0" + sec;
                }
                 
                document.getElementById('SW-timerLabel').innerHTML = min + ":" + sec + ":" + mSec;
                timer();
            }, 10);
        }
    }