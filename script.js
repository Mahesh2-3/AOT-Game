let cannondiv = document.body.querySelector(".cannon");
let animation = document.body.querySelector(".animation");
let cannon = document.body.querySelector(".cannonimg");
let flame = document.body.querySelector(".flame");
let right = document.body.querySelectorAll(".right");
let left = document.body.querySelectorAll(".left");
let fire = document.body.querySelectorAll(".fire");
let cannonballdiv = document.body.querySelectorAll(".cannonballdiv");
let start_pause = document.body.querySelector(".start_pause")
let infosvg = document.body.querySelector(".infosvg")
let menusvg = document.body.querySelector(".menusvg")
let crosstitle = document.getElementById("crosstitle")

let sscore;
let gamescore;
let count1;
let leftpx;
if (window.innerWidth < 1024) {
    gamescore = document.body.querySelector(".upgamescore")
    sscore = document.body.querySelector(".upscore")
} else {
    gamescore = document.body.querySelector(".downgamescore")
    sscore = document.body.querySelector(".downscore")
}

if (window.innerWidth<700) {
    count1 = -21;
    leftpx=40
} else {
    count1= -20
    leftpx + "%"
}

let count = 0;
let num = 0;
let width;
let titanInterval;
let game = "off";
let easymodetime=1600;
let gamemodetime = easymodetime
let score = 0


function generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 12; // Ensure it's more than 10 characters
    let randomId = '';

    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters[randomIndex];
    }

    return randomId;
}

let l = Array.from(cannonballdiv).filter(child =>
    getComputedStyle(child).display !== "none"
).length
function Go_right() {
    if (game == "on") {
        width = cannondiv.offsetWidth;
        num += 1;
        count += Math.floor(width / (l + 1));
        count1 += Math.floor(width / (l + 1));

        if (count > Math.floor(width / (l + 1)) * (l - 1)) {
            count = 0;
            num = 0;
            count1 = -22;
        }

        cannon.style.left = count + "px";
        flame.style.left = count1 + "px";
    } else {
        alert("Start a Game to operate")
    }
}

function Go_left() {
    if (game == "on") {
        width = cannondiv.offsetWidth;
        num -= 1;
        count -= Math.floor(width / (l + 1));
        count1 -= Math.floor(width / (l + 1));
        if (count < 0) {
            count = Math.floor(width / (l + 1)) * (l - 1);
            num = (l - 1);
            count1 = Math.floor(width / (l + 1)) * (l - 1) - 22;
        }

        cannon.style.left = count + "px";
        flame.style.left = count1 + "px";
    } else {
        alert("Start a Game to operate")
    }
}
let isResumestructCalled = false; // Global flag to ensure resumestruct is called once

function deletechild(num, element, time) {
    setTimeout(() => {
        let arr = cannonballdiv[num].children;

        for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            if (e.id === element.id) {
                if (start_pause.innerHTML != "Resume") {
                    const overlay = document.getElementById("overlay");
                    overlay.style.display = "flex";
                    overlay.innerText = `Game over \n Your Score ${score}`;

                    // Call resumestruct only once
                    if (!isResumestructCalled) {
                        resumestruct("fromdeletechild");
                        isResumestructCalled = true; // Set global flag
                    }

                    setTimeout(() => {
                        overlay.style.display = "none";
                        exitgamefunc();
                        overlay.innerText = "Paused";
                    }, 5000);

                    clearInterval(titanInterval);
                    game = "off";
                    start_pause.style.backgroundColor = "#60e50d";
                    start_pause.style.boxShadow = "0 0 20px 0px #3eb53e";
                    start_pause.innerHTML = "Start";
                }
            }
        }
        element.remove();
    }, time);
}


function exitgamefunc() {
    Array.from(document.querySelectorAll(".levels")).forEach(button => {
        button.style.pointerEvents = "all";
    })
    setTimeout(() => {
        gamescore.style.display = "none"

    }, 2000);
    let titans = document.querySelectorAll(".titan")
    let balls = document.querySelectorAll(".cannonball")
    for (let i = 0; i < titans.length; i++) {
        const e = titans[i];
        e.remove()
    }
    for (let i = 0; i < balls.length; i++) {
        const e = balls[i];
        e.remove()
    }
    clearInterval(titanInterval); // Stops the interval
    setTimeout(() => {
        document.querySelector(".exitgame").style.display = "none"
    }, 1000);
    start_pause.innerHTML = "Start"
    count1 = -22;
    count = 0
    cannon.style.left = 0 + "px";
    flame.style.left = -22 + "px";
    num = 0
    game = "off"
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    start_pause.style.zIndex = 0
    document.querySelector(".exitgame").style.zIndex = 0
    setTimeout(() => {
        document.querySelector(".exitgame").style.zIndex = 100
        start_pause.style.zIndex = 100
    }, 2000)
    setTimeout(() => {
        document.body.querySelector(".fire-bg").style.display = "flex"
        menusvg.style.zIndex = 900

        const overlay = document.getElementById("overlay");
        overlay.style.display = "flex";
        for (let i = 0; i < cannonballdiv.length; i++) {
            const element = cannonballdiv[i];
            element.style.border="1px solid grey"
        }
    }, 2000);
}
let Count = 0
function bombblast(number, length, titan) {
    let collisionflame = document.createElement("img")
    collisionflame.classList.add("blast")
    collisionflame.src = "assets/bombblastbg.png"
    cannonballdiv[number].appendChild(collisionflame)
    let titan_no = titan.src.split("titan")[1]
    if (titan_no == "2.png") {
        score += 5
    } else if (titan_no == "1.png") {
        score += 10
    }
    else if (titan_no == "3.png") {
        score += 20
    }
    collisionflame.style.top = (length - 50) + "px"
    collisionflame.style.width = "100px"
    collisionflame.style.position = "absolute"
    collisionflame.style.height = "100px"
    collisionflame.style.transition = "all 0.5s ease-in-out"
    collisionflame.style.scale = 1
    setTimeout(() => {
        collisionflame.style.scale = 0
    }, 500);
    setTimeout(() => {
        collisionflame.remove()
    }, 1000);
    sscore.innerHTML = score
}


let activeIntervals = {}; // Store interval IDs for each cannonball

function collide(x) {
    if (activeIntervals[x]) return; // Prevent multiple intervals for the same number

    function checkCollision() {
        let numcannonballdiv = document.querySelectorAll(".cannonballdiv")[x];
        if (!numcannonballdiv) {
            cancelAnimationFrame(activeIntervals[x]);
            delete activeIntervals[x];
            return;
        }

        let cannonballs = numcannonballdiv.querySelectorAll("img.cannonball");
        let titans = numcannonballdiv.querySelectorAll("img.titan");

        cannonballs.forEach(cannonball => {
            titans.forEach(titan => {
                const cannonballRect = cannonball.getBoundingClientRect();
                const titanRect = titan.getBoundingClientRect();

                if (
                    cannonballRect.top < titanRect.bottom &&
                    cannonballRect.bottom > titanRect.top &&
                    cannonballRect.left < titanRect.right &&
                    cannonballRect.right > titanRect.left
                ) {
                    cancelAnimationFrame(activeIntervals[x]); // Stop checking after collision
                    delete activeIntervals[x]; // Remove from tracking

                    bombblast(x, cannonballRect.top, titan);
                    cannonball.remove();
                    titan.remove();
                }
            });
        });

        activeIntervals[x] = requestAnimationFrame(checkCollision); // Continue checking
    }

    activeIntervals[x] = requestAnimationFrame(checkCollision);
}





function resumestruct(message) {
    let i = 0;
    document.querySelectorAll(".cannonballdiv").forEach(e => {
        const fragment = document.createDocumentFragment(); // Use a fragment to batch DOM changes
        let child = Array.from(e.children); // Ensure children are not live
        child.forEach(f => {
            if (f.className == "titan") {
                let lengths = f.getBoundingClientRect().top;
                if (start_pause.innerHTML == "Pause") {
                    let element = document.createElement("img");
                    element.classList.add("titan");
                    element.src = f.src;
                    deletechild(i, f, 10); // Ensure deletechild is safe and doesn’t create issues
                    element.style.position = "absolute"; // Make sure positioning is explicit
                    element.style.top = lengths + "px";
                    fragment.appendChild(element); // Add to the fragment
                } else {
                    const height = cannonballdiv[num].offsetHeight;
                    const ysec = (5 * (height - lengths)) / height
                    f.style.transition = ` top ${ysec}s linear`
                    f.style.top = height + "px"
                    deletechild(i, f, ysec * 1000)
                }
            }

        });
        e.appendChild(fragment); // Append everything at once
        i += 1;
    });
}



function fireball() {
    let n = num
    if (game == "on") {
        const cannonball = document.createElement("img");
        cannonball.classList.add("cannonball");
        cannonball.src = "assets/cannonball.svg";
        cannonballdiv[n].appendChild(cannonball);
        const height = cannonballdiv[n].offsetHeight;
        setTimeout(() => {
            cannonball.style.transition = "bottom 5s linear";
            cannonball.style.bottom = height + "px";
        }, 0);

        if (cannonballdiv[n].querySelector("img.cannonball").length > 0) {
            deletechild(n, cannonball, 5000);
        }

        flame.style.opacity = 1;
        setTimeout(() => {
            flame.style.opacity = 0;
        }, 250);
        let ballaudio = document.querySelector(".ballaudio")
        ballaudio.play()
        collide(n);

    } else {
        alert("Start a Game to operate")
    }

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function titanfunc() {
    if (game == "on") {
        let items = ['titan1', 'titan2', 'titan3'];
        let randomItem = items[Math.floor(Math.random() * items.length)];
        // let number = getRandomInt(0,0);///////////////////////////////
        let number = getRandomInt(0, l - 1);///////////////////////////////

        const titan = document.createElement("img");
        titan.classList.add("titan");
        titan.id = generateRandomId();
        titan.src = `assets/${randomItem}.png`;
        cannonballdiv[number].appendChild(titan);

        const height = cannonballdiv[number].offsetHeight;
        setTimeout(() => {
            titan.style.transition = "top 5s linear";
            titan.style.top = height + "px";
        }, 0);

        deletechild(number, titan, 5000);
    } else {
        return;
    }
}

const levelButtons = document.querySelectorAll(".levels");

function highlightButton(event) {
    if (start_pause.innerHTML == "Start") {
        levelButtons.forEach(button => {
            button.style.backgroundColor = "";
        });

        event.target.style.backgroundColor = "lightblue";
        if (event.target.classList[1] == "easy") {
            gamemodetime = easymodetime
        } else if (event.target.classList[1] == "medium") {
            gamemodetime = easymodetime -400
        }
        else {
            gamemodetime = easymodetime-600
        }
    }

}

function pause() {
    game = "off"
    start_pause.style.backgroundColor = "#60e50d"
    start_pause.style.boxShadow = "0 0 20px 0px #3eb53e"
    resumestruct("from pause")
    start_pause.innerHTML = "Resume"
    const overlay = document.getElementById("overlay");
    overlay.style.display = "flex";
    clearInterval(titanInterval); // Stops the interval
}

function resume() {
    game = "on"
    start_pause.style.backgroundColor = "#0098f7"
    start_pause.style.boxShadow = "0 0 20px 0px rgb(1, 85, 137)"
    resumestruct("from resume")
    start_pause.innerHTML = "Pause"
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    document.querySelector(".exitgame").style.display = "block"
    titanInterval = setInterval(() => {
        titanfunc();
    }, gamemodetime);
}

document.querySelector(".levels.easy").style.backgroundColor = "lightblue";

levelButtons.forEach(button => {
    button.addEventListener("click", highlightButton);
});

function start_pause_event() {
    if (start_pause.innerHTML == "Start") {
        score = 0
        Count = 0
        sscore.innerHTML = score
        Array.from(document.querySelectorAll(".levels")).forEach(button => {
            button.style.pointerEvents = "none";
        })
        document.body.querySelector(".fire-bg").style.display = "none"
        for (let i = 0; i < cannonballdiv.length; i++) {
            const element = cannonballdiv[i];
            element.style.border="none"
        }
        const overlay = document.getElementById("overlay");
        overlay.style.display = "none";
        menusvg.style.zIndex = 1610
    }
    if (game == "off") {
        resume()
        if (document.querySelector(".menu").style.left = "0%") {
            document.querySelector(".menu").style.left = "-100%"
            menusvg.style.left = "1%"
            menusvg.src = "https://mahesh2-3.github.io/AOT-Game/assets/menu.svg"
        }
    } else if (game == "on") {
        pause()
    }
    if (start_pause.innerHTML == "Pause" || start_pause.innerHTML == "Resume") {
        gamescore.style.display = "block"
    }
}
start_pause.addEventListener("click", () => {
    start_pause_event()
});

document.body.querySelector(".upstart_pause").addEventListener("click", () => {
    start_pause_event()
});

document.querySelector(".exitgame").addEventListener("click", () => {
    exitgamefunc()

    if (document.querySelector(".menu").style.left = "0%") {
        document.querySelector(".menu").style.left = "-100%"
        menusvg.style.left = "1%"
        menusvg.src = "https://mahesh2-3.github.io/AOT-Game/assets/menu.svg"
    }
    Count = 0
    menusvg.src = "https://mahesh2-3.github.io/AOT-Game/assets/menu.svg"
})




for (let i = 0; i < fire.length; i++) {
    const e = fire[i];
    e.addEventListener("click", () => {
        if (game == "on") {
            fireball();
        } else {
            alert("Start a Game to operate")
        }
    });
}

for (let i = 0; i < right.length; i++) {
    const element = right[i];
    element.addEventListener("click", () => {
        Go_right();
    });

}
for (let i = 0; i < left.length; i++) {
    const element = left[i];
    element.addEventListener("click", () => {
        Go_left();
    });

}



document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "d") {
        Go_right();
    }
    if (e.key === "ArrowLeft" || e.key === "a") {
        Go_left();
    }
    if (e.key === "ArrowUp" || e.key === "w") {
        fireball();
    }

});
function toggleDetails() {
    const details = document.getElementById('details');
    if (details.style.opacity == 0) {
        details.style.opacity = 1
        details.style.top = "39px"
        details.style.zIndex = 1100
    } else {
        details.style.opacity = 0
        details.style.top = "-48px"
        details.style.zIndex = 0
    }
}
infosvg.addEventListener("click", () => {
    if (infosvg.src == "https://mahesh2-3.github.io/AOT-Game/assets/info.svg") {
        infosvg.src = "https://mahesh2-3.github.io/AOT-Game/assets/cross.svg"
    } else {
        infosvg.src = "https://mahesh2-3.github.io/AOT-Game/assets/info.svg"
    }
    toggleDetails()
})
menusvg.addEventListener("click", () => {
    if (game == "on" && menusvg.src == "https://mahesh2-3.github.io/AOT-Game/assets/menu.svg") {
        document.querySelector(".menu").style.left = "0%"
        menusvg.style.left = leftpx + "%"
        menusvg.src = "https://mahesh2-3.github.io/AOT-Game/assets/cancel.svg"
        pause()
        return
    }
    if (menusvg.src == "https://mahesh2-3.github.io/AOT-Game/assets/cancel.svg") {
        document.querySelector(".menu").style.left = "-100%"
        menusvg.style.left = "1%"
        menusvg.src = "https://mahesh2-3.github.io/AOT-Game/assets/menu.svg"
    } else {
        document.querySelector(".menu").style.left = "0%"
        menusvg.style.left = leftpx + "%"
        menusvg.src = "https://mahesh2-3.github.io/AOT-Game/assets/cancel.svg"
    }
})

crosstitle.addEventListener("click", () => {
    document.body.querySelector(".fire-bg").style.display = "none"
    menusvg.style.zIndex = 1610
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
})
