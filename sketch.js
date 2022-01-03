// GLOBALS
const HEIGHT = window.innerHeight
const WIDTH = window.innerWidth
/*
const HEIGHT = 1080
const WIDTH = 1920*/
var diameter = 4
var dnaHeight = 10;
var waveCount = 10;
let DNAs = []
var gui;

// GLOBALS FOR RANDOM MODE
var initialDnaCountRandom = 10;

// COLOR PALETTES
let myPalette1 = ["#95998A", "#BDCC94", "#FFEC67", "#FFFFFF", "#A9B6CC"];
let dnaPalette = ["#6060FF", "#FEFE00", "#3EFB00", "#F82620", "#B45A00"];

let customPalette1 = ["#f72585", "#b5179e", "#7209b7", "#560bad", "#480ca8", "#3a0ca3", "#3f37c9", "#4361ee", "#4895ef", "#4cc9f0"];

let customPalette2 = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"];
let customPalette3 = ["#053c5e", "#1d3958", "#353652", "#4c334d", "#643047", "#7c2e41", "#942b3b", "#ab2836", "#c32530", "#db222a"];

var colorPalette = [
    customPalette1,
    myPalette1,
    dnaPalette,
    customPalette2,
    customPalette3

]


// SETTINGS
var mode = ["RANDOM", "STATIC_LOOP", "STATIC_W_START", "STATIC"];
var lastMode, lastPalette, lastDnaCount

function customUI() {
    let h5 = createElement('div', 'im an h5 p5.element!');
    h5.style('color', '#00a1d3');
    h5.position(0, 0);
}
function setup() {
    createCanvas(WIDTH, HEIGHT);
    angleMode(DEGREES)
    gui = createGui('My awesome GUI');

    gui.addGlobals('colorPalette', 'mode', 'initialDnaCountRandom', 'diameter', 'dnaHeight', 'waveCount');
    customUI()
    if (mode == "RANDOM")
        createRandomScene();
    else if (mode == "STATIC")
        createScene();
    else if (mode == "STATIC_LOOP")
        createScene();
    else if (mode == "STATIC_W_START")
        createScene();
}

function createScene() {
    let scaleBy = 5;
    let transX = 0, transY = 0;
    let rot = 0;

    // Starts with right most
    // Right 1
    scaleBy = 5;
    DNAs.push(new DNA(-150,
        HEIGHT / scaleBy,
        -90,
        scaleBy))

    // Right 2
    scaleBy = 0.6
    DNAs.push(new DNA(WIDTH,
        HEIGHT / scaleBy,
        -90,
        scaleBy))
    // Right 3
    scaleBy = 2
    DNAs.push(new DNA(-dnaHeight * scaleBy * 2,
        HEIGHT / scaleBy,
        -90,
        scaleBy))

    // Starts from top
    // top 1
    scaleBy = 2.5
    DNAs.push(new DNA(0,
        -300,
        0,
        scaleBy))
    // top 2
    scaleBy = 1
    DNAs.push(new DNA(0,
        0,
        0,
        scaleBy))
    // top 3

    scaleBy = 3
    DNAs.push(new DNA(0,
        100 - HEIGHT / scaleBy,
        0,
        scaleBy))

    // cross 1
    scaleBy = 1
    DNAs.push(new DNA(-100,
        700,
        -45,
        scaleBy))

    // cross 2
    scaleBy = 1.5
    DNAs.push(new DNA(0,
        -600,
        60,
        scaleBy))

    /* Sorting the DNA array by their scale
       So that the bigger DNAs stay closer to the screen */
    DNAs.sort((a, b) => a.scaleBy - b.scaleBy)
}

function createRandomScene() {
    for (let i = 0; i < initialDnaCountRandom; i++) {
        addRandomDNA()
    }
    /* Sorting the DNA array by their scale
       So that the bigger DNAs stay closer to the screen */
    DNAs.sort((a, b) => a.scaleBy - b.scaleBy)
}

function addRandomDNA() {
    let scaleBy = random(0.5, 2.5)
    if (random() > 0.5) {

        DNAs.push(new DNA(0,
            HEIGHT,
            -90,
            scaleBy))
    }
    else {

        DNAs.push(new DNA(0,
            noise((-HEIGHT / 2 + dnaHeight * scaleBy, -dnaHeight * scaleBy)),
            0,
            scaleBy))
    }
}

function removeRandom() {

    DNAs.splice((Math.random() * DNAs.length) | 0, 1);

}

function draw() {
    background(0);

    for (let index = 0; index < DNAs.length; index++) {
        push()
        DNAs[index].display()
        pop()
    }

    updateCanvasOnChange()
}

function updateCanvasOnChange() {
    // Reset After Changes
    if (mode != lastMode) {
        DNAs = []
        if (mode == "RANDOM")
            createRandomScene();
        else if (mode == "STATIC")
            createScene();
        else if (mode == "STATIC_LOOP")
            createScene();
        else if (mode == "STATIC_W_START")
            createScene();
    }
    if (colorPalette != lastPalette) {
        for (let index = 0; index < DNAs.length; index++) {
            DNAs[index].color = random(colorPalette)

        }

    }
    if (lastDnaCount != initialDnaCountRandom) {
        DNAs = []
        if (mode == "RANDOM")
            createRandomScene();
        else if (mode == "STATIC")
            createScene();
        else if (mode == "STATIC_LOOP")
            createScene();
        else if (mode == "STATIC_W_START")
            createScene();

    }
    lastPalette = colorPalette
    lastMode = mode
    lastDnaCount = initialDnaCountRandom
}

class DNA {
    constructor(x = 0, y = 0, rot = 0, scaleBy = 1, circleNum = 1) {
        this.circleNum = circleNum
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.scaleBy = scaleBy;
        this.target = 0
        this.connected = false;
        this.color = random(colorPalette)
        this.colorChanged = false;
    }

    display() {
        scale(this.scaleBy)

        translate(this.x, this.y)
        rotate(this.rot)

        for (let i = 0; i < this.circleNum; i++) {
            var x = i * (width) / (this.circleNum) / this.scaleBy * 2;


            if (this.connected) {
                fill(this.color);
            }
            else {
                fill(this.color);
            }

            // Lines
            strokeWeight(1);

            stroke(this.color);
            if (i % 2 == 1 && this.connected) {
                line(x, height / 2 + dnaHeight * sin(i * waveCount + frameCount),
                    x, height / 2 - dnaHeight * sin(i * waveCount + frameCount))
            }

            noStroke();
            // Helix 1
            circle(x,
                height / 2 + dnaHeight * sin(i * waveCount + frameCount),
                diameter);
            // Helix 2
            circle(x,
                height / 2 - dnaHeight * sin(i * waveCount + frameCount),
                diameter);
        }
        this.bounce(15, 300);
    }

    bounce(x, y) {
        if (mode == "RANDOM") {
            if (this.circleNum < x + 5) {
                this.target = y;
                this.connected = true
                this.color = random(colorPalette)
            }
            else if (this.circleNum > y - 5) {
                this.target = x;
                this.connected = false
                this.color = random(colorPalette)


                if (random(1) > 0.5) {
                    removeRandom()
                    addRandomDNA()
                    DNAs.sort((a, b) => a.scaleBy - b.scaleBy)
                }

            }
            this.circleNum = lerp(this.circleNum, this.target, 0.002)
        }
        else if (mode == "STATIC_LOOP") {
            if (this.circleNum < x + 5) {
                this.target = y;
                this.connected = true
                this.color = random(colorPalette)
            }
            else if (this.circleNum > y - 5) {
                this.target = x;
                this.connected = false
                this.color = random(colorPalette)

            }
            this.circleNum = lerp(this.circleNum, this.target, 0.002)
        }
        else if (mode == "STATIC_W_START") {

            this.connected = false
            this.target = y;
            if (this.target - this.circleNum < 100)
                this.connected = true
            this.circleNum = lerp(this.circleNum, this.target, 0.0005)
        }
        else if (mode == "STATIC") {
            this.circleNum = 500
            this.connected = true
        }




    }
}



