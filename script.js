document.addEventListener("DOMContentLoaded", function(event) { 
    let life = 3;
    let score = 0;
    let hammer = {
        x: 0,
        y: 0
    }

    let mole = [[],[],[]];

    for(let i = 0; i<mole.length; i++) {
        for(let j =0; j<5; j++) {
            mole[i].push({x:16, y:94, moving:false, active: false, dead: false, life: 0, type: 2});
        }
    }

    function displayScore() {
        if(life <= 0) {
            location.reload();
            alert("gameover\nyour score is "+score);
        }

        let output ='';

        for(let i =0; i<life; i++) {      
            let left = 35 +(65 * i);
            output += "<img src='assets/heart.png' style='position: absolute; left: "+left+"px; top: 70px;' width='auto' height='60px' />";
        }

        document.getElementById('score').innerHTML = "Score: " + score;
        document.getElementById('life').innerHTML = output;
    }

    function displayMole() {
        document.getElementById('bgMusic').play();
        document.getElementById('bgMusic').loop =true;
        let output ="";

        for(let i =0; i<mole.length; i++) {
            let top = 100+(200*i);
            
            for(let j =0; j<mole[i].length; j++) {
                let left = 180 + (250 * j);
                mole[i][j].left = left;
                mole[i][j].top = top;
                output += "<div class='moleContainer' style='top: "+top+"px; left:"+left+"px;'>";
                output += "<div class='mole"+mole[i][j].type+"' style='top: "+mole[i][j].y+"px; left: 16px;'></div>";
                output += "<div class='soil' style='top: 90px; left:0px;'></div>";
                output += "</div>";
            }
        }

        document.getElementById('world').innerHTML = output;
    }

    document.onclick = function(e) {

        let sound = new Audio('assets/whack.mp3').play();
        document.getElementById('hammer').style.backgroundImage ="url('assets/Hammer2.png')";
        setTimeout(function() {
            document.getElementById('hammer').style.backgroundImage ="url('assets/Hammer1.png')";
        }, 50);

        for(let i =0; i<mole.length; i++) {

            for(let j=0; j<mole[i].length; j++) {

                if( e.clientX-50 >= mole[i][j].left +15 &&
                    e.clientX-50 <= mole[i][j].left +138 &&
                    e.clientY-20 >= mole[i][j].top &&
                    e.clientY-20 <= mole[i][j].top + 95) {

                    if(!(mole[i][j].dead) && mole[i][j].active) {

                        if(mole[i][j].life > 1) {
                            mole[i][j].life--;
                        }
                        else {
                            if(mole[i][j].type != 4) {
                                score += 10 *mole[i][j].type;
                            }else {
                                life--;
                            }
                        
                            let sound = new Audio('assets/die.m4a').play();
                            mole[i][j].type += "Dead";
                            mole[i][j].active = false;
                            mole[i][j].dead = true;
                        }
                    }
                }
            }
        }
    }

    setInterval(function() {
        document.getElementById('hammer').style.left =hammer.x+"px";
        document.getElementById('hammer').style.top =hammer.y+"px";
    }, 1);

    function moleDown(moles) {
        if(moles.y < 94) {
            moles.y += 10;
            displayMole();
        }
        else {
            moles.y = 94;
            moles.active = false;
            moles.dead = false;
        }
    }

    function moleUp(moles) {
        mole.moving = true;
        if(moles.y > 0) {
            moles.y-= 6;
            displayMole();
        }else {
            if(moles.y < 0) {
                moles.y = 0;
            }
            setTimeout(() => {
                moles.moving = false;
            }, 1500);  
        }
    }

    function randomUp() {
        let i = Math.floor(Math.random() * 3);
        let j = Math.floor(Math.random() * 5);
        if(!(mole[i][j].active) && !(mole[i][j].dead)) {
            mole[i][j].type = Math.floor((Math.random()* 4) +1);
            if(mole[i][j].type != 4) {
                mole[i][j].life = mole[i][j].type;
            }else {
                mole[i][j].life = 1;
            }
            mole[i][j].active = true;
            mole[i][j].moving = true;
        }              
    }

    let counter = 0;
    let op = 2;
    let start = setInterval(function() {
        document.getElementById('container').style.opacity = op;
        op -= 0.1;
        if(op <= 0) {
            document.getElementById('container').style.display = "none";
            clearInterval(start);
        }
    }, 100);
    
    setInterval(() => {
        counter++;
        if(counter % 20 == 0) {
            randomUp();
        }
        for(let i =0; i<mole.length; i++) {
                for(let j =0; j<mole[i].length; j++) {
                if(mole[i][j].moving) {
                    moleUp(mole[i][j]);
                }else {
                    moleDown(mole[i][j]);
                }
            }
        }
        document.onmousemove = function(e) {
            hammer.x = e.clientX -90;
            hammer.y = e.clientY -70;
        }
        displayMole();
        displayScore();
    }, 30);
});