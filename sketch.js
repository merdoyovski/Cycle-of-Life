// GLOBALS
const HEIGHT = 1080
const WIDTH = 1920
var diameter = 10
var dnaHeight = 30;
var waveCount = 10;
let DNAs = []
var gui;

// GLOBALS FOR RANDOM MODE
var initialDnaCountRandom = 10;

// COLOR PALETTES
let myPalette1 = ["#95998A", "#BDCC94", "#FFEC67", "#FFFFFF", "#A9B6CC"];
let dnaPalette = ["#6060FF", "#FEFE00", "#3EFB00", "#F82620", "#B45A00"];

let customPalette1 = ["#f72585", "#b5179e", "#7209b7", "#560bad", "#480ca8", "#3a0ca3", "#3f37c9", "#4361ee", "#4895ef", "#4cc9f0"];

let customPalette2 = ["#6060FF", "#FEFE00", "#3EFB00", "#F82620", "#B45A00"];
let customPalette3 = ["#6060FF", "#FEFE00", "#3EFB00", "#F82620", "#B45A00"];

var colorPalette = [
    customPalette1,
    myPalette1,
    dnaPalette,

]


// SETTINGS
var mode = ["STATIC", "RANDOM", "STATIC_LOOP", "STATIC_W_START", "STATIC"];
var lastMode, lastPalette, lastDnaCount

function setup() {
    createCanvas(WIDTH, HEIGHT);
    angleMode(DEGREES)
    gui = createGui('My awesome GUI');

    gui.addGlobals('colorPalette', 'mode', 'initialDnaCountRandom', 'diameter', 'dnaHeight', 'waveCount');

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
    let scaleBy = 1;
    let transX = 0, transY = 0;
    let rot = 0;




    DNAs.push(new DNA(-100,
        HEIGHT / 2,
        -90,
        4))

    DNAs.push(new DNA(0,
        noise((-HEIGHT / 2 + dnaHeight * scaleBy, -dnaHeight * scaleBy)),
        0,
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



