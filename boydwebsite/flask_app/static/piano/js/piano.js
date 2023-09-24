const box= document.querySelector(".box");
const keys= document.querySelectorAll(".key");
const controls = document.querySelectorAll(".controlKeys");
const sound = {"A":"http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav",
                "W":"http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav",
                "S":"http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav",
                "E":"http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav",
                "D":"http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav",
                "F":"http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav",
                "T":"http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav",
                "G":"http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav",
                "Y":"http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav",
                "H":"http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav",
                "U":"http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav",
                "J":"http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav",
                "K":"http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav",
                "O":"http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav",
                "L":"http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav",
                "P":"http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav",
                ";":"http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"};

const demonSound = new Audio("https://orangefreesounds.com/wp-content/uploads/2020/09/Creepy-piano-sound-effect.mp3?_=1");
const demonImage = document.getElementById("demonPicture");

let previousColor;
let checkDemons;


for (let key of keys){
    key.addEventListener("mouseenter", (event) => {

        
        for (let control of controls){
            control.style.opacity = 1.0;
        }

    }, false);
}

for (let key of keys){
    key.addEventListener("mouseout", (event) => {

        
        for (let control of controls)
        {
            control.style.opacity = 0;
        }

    }, false);
}

function fadeOut(element) {
    let op = 1;
    let timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function fadeIn(element) {
    var op = 0.1; 
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

window.addEventListener("keydown", (event) => {

    for (let control of controls)
    {
        if ( event.key === control.innerText ||  event.key === control.innerText.toLowerCase())
        {
            if ((!checkDemons?.toLowerCase().includes("weseeyou")))
            {
                previousColor = control.parentNode.style.backgroundColor;
                control.parentNode.style.backgroundColor = "darkgrey"
                let audio = new Audio(sound[control.innerText]);
                audio.play();
                if (checkDemons?.length === 8 && (!checkDemons.toLowerCase().includes("weseeyou")))
                {
                    checkDemons = checkDemons.substr(1);
                }
                checkDemons += control.innerText;
                window.addEventListener("keyup", (event) => {
                    control.parentNode.style.backgroundColor = previousColor;
                }, false);
            }
            window.removeEventListener("keyup", event);
            if (checkDemons.toLowerCase().includes("weseeyou"))
            {
                demonSound.play();
                fadeOut(control);
                for (let key of keys)
                {
                    fadeOut(key);
                }
                box.style.backgroundImage = "url('../static/piano/images/texture.jpeg')";
                box.style.backgroundSize = "cover";
                fadeIn(box);
                

            }
        }
    }
    


}, false);
