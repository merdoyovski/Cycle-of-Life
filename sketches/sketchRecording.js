// GLOBALS
const HEIGHT = 1080
const WIDTH = 1920
/*
const HEIGHT = 1080
const WIDTH = 1920*/
var diameter = 4
var dnaHeight = 14;
var waveCount = 10;
let DNAs = []
var gui;
let maxScale = 2;

// GLOBALS FOR RANDOM MODE
var initialDnaCountRandom = 25;
p5.disableFriendlyErrors = true; // disables FES
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
var colorPaletteDummy = [
    customPalette1,
    myPalette1,
    dnaPalette,
    customPalette2,
    customPalette3
]

// SETTINGS
var mode = ["RANDOM", "STATIC_LOOP", "STATIC_W_START", "STATIC"];
var lastMode, lastPalette, lastDnaCount

// Record settings
let encoder

let cwidth = WIDTH
let cheight = HEIGHT

const frate = 30 // frame rate
const numFrames = 9000 // num of frames to record
let recording = false
let recordedFrames = 0

function preload() {
    HME.createH264MP4Encoder().then(enc => {
        encoder = enc
        encoder.outputFilename = 'test'
        encoder.width = cwidth
        encoder.height = cheight
        encoder.frameRate = frate
        encoder.kbps = 50000 // video quality
        encoder.groupOfPictures = 10 // lower if you have fast actions.
        encoder.initialize()
    })
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    angleMode(DEGREES)
    gui = createGui('My awesome GUI');

    gui.addGlobals('colorPalette', 'mode', 'initialDnaCountRandom', 'diameter', 'dnaHeight', 'waveCount');
    //customUI()
    if (mode == "RANDOM")
        createRandomScene();
    else if (mode == "STATIC")
        createScene();
    else if (mode == "STATIC_LOOP")
        createScene();
    else if (mode == "STATIC_W_START")
        createScene();
    translate(0, 0)
    recording = true
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
    let scaleBy = random(0.5, 5)

    let xOffset = 500
    let yOffset = 0

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
}

function removeRandom() {
    DNAs.splice((Math.random() * DNAs.length) | 0, 1);
}

function draw() {
    background(0);
    print(frameCount)
    for (let index = 0; index < DNAs.length; index++) {
        push()
        DNAs[index].display()
        pop()
    }
    // keep adding new frame
    if (recording) {
        encoder.addFrameRgba(drawingContext.getImageData(0, 0, encoder.width, encoder.height).data);
        recordedFrames++
    }
    // finalize encoding and export as mp4
    if (recordedFrames === numFrames) {
        recording = false
        recordedFrames = 0

        encoder.finalize()
        const uint8Array = encoder.FS.readFile(encoder.outputFilename);
        const anchor = document.createElement('a')
        anchor.href = URL.createObjectURL(new Blob([uint8Array], { type: 'video/mp4' }))
        anchor.download = encoder.outputFilename
        anchor.click()
        encoder.delete()

        preload() // reinitialize encoder
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
        this.rot = rot;
        this.scaleBy = scaleBy;
        this.x = x;
        this.y = y;
        this.target = 0
        this.connected = false;
        this.color = random(colorPalette)
        this.colorChanged = false;

        let dnaOffset = (dnaHeight + diameter) * this.scaleBy
        if (this.rot == -90) {
            this.x = constrain(this.x + dnaOffset, dnaOffset, width - dnaOffset)
        } else if (this.rot == 0) {
            this.x = this.x - width * scaleBy
            this.y = constrain(this.y + dnaOffset, dnaOffset, height - dnaOffset)

        } else {

        }
    }

    display() {


        // DNAs.push(new DNA(random(-width / 1.1, width / 1.1),
        //     random((dnaHeight + diameter) * scaleBy, height - (dnaHeight + diameter) * scaleBy),
        //     0,
        //     scaleBy))


        // for rot -90
        //translate(this.x, this.y - 1 * (HEIGHT / (maxScale / this.scaleBy)))
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
                line(x, dnaHeight * sin(i * waveCount + frameCount),
                    x, - dnaHeight * sin(i * waveCount + frameCount))
            }

            noStroke();
            // Helix 1
            circle(x,
                +dnaHeight * sin(i * waveCount + frameCount),
                diameter);
            // Helix 2
            circle(x,
                -dnaHeight * sin(i * waveCount + frameCount),
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
                    changeColor()
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



