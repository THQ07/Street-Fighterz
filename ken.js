var people = document.getElementById('people');
var screen = document.getElementById('screen');
var hit = document.getElementsByClassName('obs');
var hadouken = document.getElementById('hadouken');

var ktop, kleft, kheight, kwidth;               //var for ken hurtbox
var bleft, btop, bheight, bwidth;               //var for hit(obstacle)
var hleft, htop, hheight, hwidth;               //var for hitbox
var hadoleft, hadotop, hadoheight, hadowidth;   //var for hitbox hadouken

//var for jump, punch, kick, hadouken, and crouch states
var flagFrameJump = false;
var flagFramePunch = false;
var flagFrameKick = false;
var flagFrameHadouken = false;
var flagFireHadouken = false;
var flagCrouch = false;

var flagL = false;  //flag for Ken facing direction

var score = 0;      //counting score
var disappear = 0;  //to count how many hit has disappear
var lastIndex = 0;  //to count last index of hit

var vxHit = [];     //x-speed of hit
var vyHit = [];     //y-speed of hit
var vxAdd;          //add speed for level (minimum value = 0)

var vx = 0;         //x-speed during jump, value will be 0 when ken is not jumping
var vxJump = 3.5;   //determine the speed of jump

var vxHadouken = 1; //speed of hadouken
var flagLHado;      //flag for Hadouken fire ball facing direction

idle();
//----------------------------------------------------------------
function startFunction(){
    if(document.getElementById("easy").checked){
        vxAdd = 1;
        spawn();  
    } else if(document.getElementById('medium').checked){
        vxAdd = 2;
        spawn();
        spawn(); 
    } else if(document.getElementById('hard').checked){
        vxAdd = 3;
        spawn();
        spawn();
        spawn();
        spawn();     
    } 
}

document.addEventListener('keydown', function(event) {sprite()});

function sprite(){
    var keyPress = String.fromCharCode(event.keyCode);
        
    if(keyPress == "D" && (kHurtBox.offsetLeft + kHurtBox.offsetWidth) <= (screen.offsetWidth - 10) )
    {   
        flagCrouch = false;
        if(flagL){
          flagL = false;
        }
        people.style.animation = 'runR 0.5s steps(4) infinite';
        people.style.left = (people.offsetLeft += 10) + "px";
        if(flagFrameJump){
            vx = -vxJump;
        };
    }

    else if(keyPress == "A" && kHurtBox.offsetLeft >= 10 )
    {
        flagCrouch = false;
        people.style.animation = 'runL 0.5s steps(4) infinite';
        if(flagL == false){
          flagL = true;
        }
        people.style.left = (people.offsetLeft += -10) + "px";
        if(flagFrameJump){
            vx = vxJump;
        };
    }

    else if(keyPress == "W" && flagFrameJump == false)
    {
        jumpAnimation();
    }

    else if(keyPress == "S")
    {
        flagCrouch = true;

        if (flagL){
            people.style.animation = "crouchL 0.5s steps(1) infinite";
        }else{
            people.style.animation = "crouchR 0.5s steps(1) infinite";
        }  
    }

    else if(keyPress == "K" && flagFrameKick == false && flagFramePunch == false && flagFrameHadouken == false)
    {
        kickAnimation();
    }

    else if(keyPress == "P" && flagFrameKick == false && flagFramePunch == false && flagFrameHadouken == false)
    {
        punchAnimation();
    }

    else if(keyPress == "H" && flagFrameKick == false && flagFramePunch == false && flagFireHadouken == false){
        hadoukenAnimation();
    }
}

document.addEventListener('keyup', function(event)
{idle()});

function idle(){
    flagCrouch = false;

    people.style.animationPlayStates = "paused";
    if (flagL){
        people.style.animation = "standL 0.5s steps(3) infinite";
    } else{
        people.style.animation = "standR 0.5s steps(3) infinite";
    }
}

function jumpAnimation()
{  
    var pos = 410;
    var id = setInterval(animate, 10);
    var Vup = -11.4;
    
    var gravity = 0.19;
    var initial = people.style.top;

    flagFrameJump = true;

    function animate() 
    {
        if (flagFramePunch == false && flagFrameKick == false){
            if (flagL == true){
                people.style.animation = "jumpL 0.5s steps(6) infinite";
            } else{
                people.style.animation = "jumpR 0.5s steps(6) infinite";
            }
        }
        
        if (pos > 410) 
        {
            people.style.top = initial;
            flagFrameJump = false;
            clearInterval(id);
            idle();
            vx = 0;
        } 
        else 
        {
            pos += Vup;
            Vup += gravity;
            people.style.top = pos;
        }

        if ( (kHurtBox.offsetLeft + kHurtBox.offsetWidth) <= (screen.offsetWidth - 10) && kHurtBox.offsetLeft >= 10){
            people.style.left = (people.offsetLeft -= vx) + "px";
        }  
    }     
};

function punchAnimation(){
    var id = setInterval(animate, 1);
    var count = 0;

    flagFramePunch = true;

    function animate(){
        if (flagL){
            people.style.animation = "punchL 0.6s steps(2)";
        } else{
            people.style.animation = "punchR 0.6s steps(2)";
        }

        count += 1;

        if (count == 130) 
        {
            flagFramePunch = false;
            clearInterval(id);
            idle();
        } 
    }
}    

function kickAnimation(){
    var id = setInterval(animate, 1);
    var count = 0;

    flagFrameKick = true;

    function animate(){
        if (flagL){
            people.style.animation = "kickL 0.5s steps(4)";
        } else{
            people.style.animation = "kickR 0.5s steps(4)";
        }

        count += 1;

        if (count == 120) 
        {
            flagFrameKick = false;
            clearInterval(id);
            idle();
        } 
    }
}   

function hadoukenAnimation(){
    var id = setInterval(animate, 1);
    var count = 0;

    hadoukenFire();

    flagFrameHadouken = true;

    function animate(){
        if (flagL){
            people.style.animation = "hadoukenL 0.5s steps(3)";
        } else{
            people.style.animation = "hadoukenR 0.5s steps(3)";
        }

        count += 1;

        if (count == 150) 
        {
            clearInterval(id);
            idle();
            flagFrameHadouken = false;
        } 
    }
}     

function hadoukenFire(){
    var vxH;
    //spawn hadouken fire
    hadouken.style.left = people.offsetLeft;
    hadouken.style.top = people.offsetTop;
    hadouken.style.width = 70;
    hadouken.style.height = 80;
    flagLHado = flagL;
    flagFireHadouken = true;

    //spawn hadouken hitbox
    hadowidth = 30;
    hadoheight = 25;
    hitBoxHadouken.style.width = hadowidth;
    hitBoxHadouken.style.height = hadoheight;

    var id = setInterval(animate, 1);
    var count = 0;


    function animate(){

        if (flagLHado){
            hadouken.style.animation = "hadoukenFireL 0.5s steps(1) infinite";
            vxH = -vxHadouken;
        } else{
            hadouken.style.animation = "hadoukenFireR 0.5s steps(1) infinite";
            vxH = vxHadouken;
        }

        if ( (hitBoxHadouken.offsetLeft + hitBoxHadouken.offsetWidth) <= (screen.offsetWidth) && hitBoxHadouken.offsetLeft >= 0){
            hadouken.style.left = (hadouken.offsetLeft += vxH) + "px";
        } else{
            flagFireHadouken = false;
            destroyHadouken();
            clearInterval(id);
        } 
    }    
}

function destroyHadouken(){
    hadouken.style.left = 0;
    hadouken.style.top = 0;
    hadouken.style.width = 0;
    hadouken.style.height = 0;

    hitBoxHadouken.style.left = 0;
    hitBoxHadouken.style.top = 0;
    hitBoxHadouken.style.width = 0;
    hitBoxHadouken.style.height = 0;
}

//------------------------------------------------------------

setInterval(moveHit, 30);
moveHit();

setInterval(getHit, 1);
getHit();

function getHit()
{
    //ken hurtbox when crouch or stand
    if (flagCrouch){
        ktop = people.offsetTop + 28;
        kheight = people.offsetHeight - 28;
    } else{
        ktop = people.offsetTop + 2;
        kheight = people.offsetHeight - 2;
    }
    kwidth = people.offsetWidth - 30;
    kleft = people.offsetLeft + 15;

    //assign hurtbox css
    kHurtBox.style.top = ktop ;
    kHurtBox.style.height = kheight;
    kHurtBox.style.width = kwidth;
    kHurtBox.style.left = kleft;

    if (flagFramePunch){

        hheight = 10;
        hwidth = 35;

        //assign hitbox variable when punching
        if(flagL == true){
            htop = people.offsetTop + 12;       
            hleft = people.offsetLeft;  
        } else{
            htop = people.offsetTop + 12;
            hleft = people.offsetLeft + 35;  
        }

        //assign hitbox css
        hitBox.style.top = htop;
        hitBox.style.height = hheight;
        hitBox.style.width = hwidth;
        hitBox.style.left = hleft;

    }
    else if(flagFrameKick){
        //assign hitbox variable when kicking
        if(flagL == true){
            htop = people.offsetTop + 2;
            hheight = 50;
            hwidth = 31;
            hleft = people.offsetLeft + 2;  
        } else{
            htop = people.offsetTop + 2;
            hheight = 50;
            hwidth = 31;
            hleft = people.offsetLeft + 37;  
        }

        //assign hitbox css when punching
        hitBox.style.top = htop;
        hitBox.style.height = hheight;
        hitBox.style.width = hwidth;
        hitBox.style.left = hleft;
    } 
    else{

        //delete hitbox
        hitBox.style.top = 0 ;
        hitBox.style.height = 0;
        hitBox.style.width = 0;
        hitBox.style.left = 0;
    }

    if(flagFireHadouken){
        //assign hadouken hitbox variable when firing hadouken
        if(flagLHado == true){
            hadotop = hadouken.offsetTop + 20;
            hadoleft = hadouken.offsetLeft + 30;  
        } else{
            hadotop = hadouken.offsetTop + 20;
            hadoleft = hadouken.offsetLeft + 10;  
        }

        //assign hadouken hitbox css
        hitBoxHadouken.style.top = hadotop;
        hitBoxHadouken.style.left = hadoleft;
    } 

    //collision detection
    for (i = 0; i < hit.length; i++)
    {
        //assign hit(obstacle) variable
        btop = hit[i].offsetTop;
        bheight = hit[i].offsetHeight;
        bwidth = hit[i].offsetWidth;
        bleft = hit[i].offsetLeft;

        //ken hurtbox -- hit
        if((kleft+kwidth) > bleft && kleft < (bleft+bwidth) && (ktop+kheight) > btop && ktop < (btop+bheight))
        {
            people.remove(people);
            kHurtBox.remove(kHurtBox);
            hitBox.remove(hitBox);
            result.style.backgroundImage = "url('lose.jpg')";
        }

        //hitbox -- hit
        if (flagFramePunch || flagFrameKick){
            if ( ((hleft+hwidth) > bleft && hleft < (bleft+bwidth) && (htop+hheight) > btop && htop < (btop+bheight)))
            {
                score += 1;       
                flagFramePunch =false; flagFrameKick = false; 
                hitDisappear(i);
                spawn();
            }   
        } 

        if(flagFireHadouken){
            if ((hadoleft+hadowidth) >  bleft && hadoleft < (bleft+bwidth) && (hadotop+hadoheight) > btop && hadotop < (btop+bheight))
            {
                score += 1;
                flagFireHadouken = false;
                destroyHadouken();
                hitDisappear(i);
                spawn();
            }
        }
    }
}

//---------------------------------------------------------------------------------------------


function spawn(){
    var spawnCase;

    spawnCase =  Math.floor(Math.random() * 2);
    if (spawnCase == 0){
        hit[lastIndex].style.left = 0;
        vxHit[lastIndex] =  (4 *  Math.random()) + vxAdd;
    } else{
        hit[lastIndex].style.left = screen.offsetWidth - hit[lastIndex].offsetWidth;
        vxHit[lastIndex] = (-4 * Math.random()) - vxAdd;
    }

    hit[lastIndex].style.top = Math.random() * (screen.offsetHeight - hit[lastIndex].offsetHeight);

    vyHit[lastIndex] = Math.random() * 2;

    hit[lastIndex].style.opacity = 1;
    lastIndex += 1;
}

function moveHit(){
    for (i = 0; i<lastIndex; i++){

        hit[i].style.top = (hit[i].offsetTop += vyHit[i]) + "px";
        

        if (hit[i].offsetLeft >= 0 && (hit[i].offsetLeft + hit[i].offsetWidth) <= screen.offsetWidth)
        {
            hit[i].style.left = (hit[i].offsetLeft += vxHit[i]) + "px";
        }
        else if(vxHit[i] != 0)
        {
            hitDisappear(i);
            spawn();
        }

        if (hit[i].offsetTop <= 0 || (hit[i].offsetHeight + hit[i].offsetTop) >= screen.offsetHeight)
        {
            vyHit[i] = vyHit[i] * -1;
        }
    }
};

function hitDisappear(i){
    hit[i].style.top = -1;
    hit[i].style.left = -1;
    hit[i].style.height = 0;
    hit[i].style.width = 0;
    hit[i].style.opacity = 1;

    vyHit[i] = 0;
    vxHit[i] = 0;

    disappear += 1;

    if(disappear == 20){
        result.style.backgroundImage = "url('win.jpg')";
        document.getElementById("score").innerHTML = "Your score is : " + score;
    }
}