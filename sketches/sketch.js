// GLOBALS
const HEIGHT = window.innerHeight
const WIDTH = window.innerWidth
/*
const HEIGHT = 1080
const WIDTH = 1920*/
var Atom_Diameter = 4
var DNA_Height = 14;
var DNA_Wave_Count = 10;
let DNAs = []
var gui;
let maxScale = 2;

// GLOBALS FOR RANDOM MODE
var Initial_DNA_Count = 25;
p5.disableFriendlyErrors = true; // disables FES
// COLOR PALETTES
let myPalette1 = ["#95998A", "#BDCC94", "#FFEC67", "#FFFFFF", "#A9B6CC"];
let dnaPalette = ["#6060FF", "#FEFE00", "#3EFB00", "#F82620", "#B45A00"];

let customPalette1 = ["#f72585", "#b5179e", "#7209b7", "#560bad", "#480ca8", "#3a0ca3", "#3f37c9", "#4361ee", "#4895ef", "#4cc9f0"];

let customPalette2 = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"];
let customPalette3 = ["#053c5e", "#1d3958", "#353652", "#4c334d", "#643047", "#7c2e41", "#942b3b", "#ab2836", "#c32530", "#db222a"];

var colorPalette

var Color_Palette = [
    "Neon Knights",
    "Soft Touch",
    "ATGS",
    "Child's Play",
    "Dracula"
]


var colorPaletteStr1 = {
    "Neon Knights": customPalette1,
    "Soft Touch": myPalette1,
    "ATGS": dnaPalette,
    "Child's Play": customPalette2,
    "Dracula": customPalette3
}

var colorPaletteDummy = [
    customPalette1,
    myPalette1,
    dnaPalette,
    customPalette2,
    customPalette3
]

// SETTINGS
var mode = ["RANDOM", "STATIC_LOOP (In Progress)", "STATIC_W_START (In Progress)", "STATIC (In Progress)"];
var lastMode, lastPalette, lastDnaCount, lastPaletteStr

function setup() {
    createCanvas(WIDTH, HEIGHT);
    angleMode(DEGREES)
    gui = createGui('Cycle of Life');
    sliderRange(0, 30, 1);
    gui.addGlobals("Color_Palette", 'mode', 'Initial_DNA_Count', 'Atom_Diameter');
    sliderRange(0, 100, 1);
    gui.addGlobals('DNA_Height', 'DNA_Wave_Count');

    if (mode == "RANDOM")
        createRandomScene();
    else if (mode == "STATIC (In Progress)")
        createScene();
    else if (mode == "STATIC_LOOP (In Progress)")
        createScene();
    else if (mode == "STATIC_W_START (In Progress)")
        createScene();

}

function createScene() {
    let scaleBy = 1;
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
    DNAs.push(new DNA(-DNA_Height * scaleBy * 2,
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
    for (let i = 0; i < Initial_DNA_Count; i++) {
        addRandomDNA()
    }
    /* Sorting the DNA array by their scale
       So that the bigger DNAs stay closer to the screen */
    DNAs.sort((a, b) => a.scaleBy - b.scaleBy)
}

function addRandomDNA() {
    let scaleBy = random(0.5, 5)

    let xOffset = 500
    let yOffset = 0

    // Fully random
    DNAs.push(new DNA(random((-width / 2), width / 1.5),
        random(-height, height * 2),
        random(-90, 90),
        scaleBy))

    // For random but vertically and horizontally straight DNAs
    /*
let rand = 0.1
if (rand > 0.66) {

    DNAs.push(new DNA(random(-xOffset, width * 1.5),
        random(yOffset, height - yOffset),
        0,
        scaleBy))
}
else if (rand > 0.33) {

    DNAs.push(new DNA(random(0, width),
        random(yOffset, height * 2.5),
        - 90,
        scaleBy))
}
else {
    DNAs.push(new DNA(random((-width / 2), width / 1.5),
        random(-height, height * 2), //random(-height, height * 2)
        random(-90, 90),
        scaleBy))
}
*/
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

function changeColor() {
    let randPalette = random(colorPaletteDummy)
    while (lastPalette == randPalette) {
        randPalette = random(colorPaletteDummy)
    }
    colorPalette = randPalette
}

function updateCanvasOnChange() {
    // Reset After Changes
    if (mode != lastMode) {
        DNAs = []
        if (mode == "RANDOM")
            createRandomScene();
        else if (mode == "STATIC (In Progress)")
            createScene();
        else if (mode == "STATIC_LOOP (In Progress)")
            createScene();
        else if (mode == "STATIC_W_START (In Progress)")
            createScene();
    }
    if (Color_Palette != lastPaletteStr) {
        colorPalette = colorPaletteStr1[Color_Palette]
        for (let index = 0; index < DNAs.length; index++) {
            DNAs[index].color = random(colorPalette)
        }
    }
    if (lastDnaCount != Initial_DNA_Count) {
        DNAs = []
        if (mode == "RANDOM")
            createRandomScene();
        else if (mode == "STATIC (In Progress)")
            createScene();
        else if (mode == "STATIC_LOOP (In Progress)")
            createScene();
        else if (mode == "STATIC_W_START (In Progress)")
            createScene();

    }
    lastPalette = colorPalette
    lastMode = mode
    lastDnaCount = Initial_DNA_Count
    lastPaletteStr = Color_Palette
}

class DNA {
    constructor(x = 0, y = 0, rot = 0, scaleBy = 1, circleNum = 1) {
        this.circleNum = circleNum
        this.rot = rot;
        this.scaleBy = scaleBy;
        this.x = x;
        this.y = y;
        this.target = 0
        this.connected = false;
        this.color = random(colorPalette)
        this.colorChanged = false;

        let dnaOffset = (DNA_Height + Atom_Diameter) * this.scaleBy
        if (this.rot == -90) {
            this.x = constrain(this.x + dnaOffset, dnaOffset, width - dnaOffset)
        } else if (this.rot == 0) {
            this.x = this.x - width * scaleBy
            this.y = constrain(this.y + dnaOffset, dnaOffset, height - dnaOffset)

        }
    }

    display() {
        translate(this.x, this.y)
        rotate(this.rot)
        scale(this.scaleBy)


        for (let i = 0; i < this.circleNum; i++) {
            var x = i * (WIDTH) / (this.circleNum);


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
                line(x, DNA_Height * sin(i * DNA_Wave_Count + frameCount),
                    x, - DNA_Height * sin(i * DNA_Wave_Count + frameCount))
            }

            noStroke();
            // Helix 1
            circle(x,
                +DNA_Height * sin(i * DNA_Wave_Count + frameCount),
                Atom_Diameter);
            // Helix 2
            circle(x,
                -DNA_Height * sin(i * DNA_Wave_Count + frameCount),
                Atom_Diameter);
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
                    changeColor()
                    removeRandom()
                    addRandomDNA()
                    DNAs.sort((a, b) => a.scaleBy - b.scaleBy)
                }
            }
            this.circleNum = lerp(this.circleNum, this.target, 0.002)
        }
        else if (mode == "STATIC_LOOP (In Progress)") {
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
        else if (mode == "STATIC_W_START (In Progress)") {

            this.connected = false
            this.target = y;
            if (this.target - this.circleNum < 100)
                this.connected = true
            this.circleNum = lerp(this.circleNum, this.target, 0.0005)
        }
        else if (mode == "STATIC (In Progress)") {
            this.circleNum = 500
            this.connected = true
        }
    }
}



