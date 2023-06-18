//PD Documentation
//Background() - https://p5js.org/reference/#/p5/background
//CreateCanvas() -https://p5js.org/reference/#/p5/createCanvas
//mouseReleased() -https://p5js.org/reference/#/p5/mouseReleased


/**
Example 7: Fractal plant
See also: Barnsley fern
variables : X F
constants : + − [ ]
start  : X
rules  : (X → F+[[X]-X]-F[-FX]+X), (F → FF)
angle  : 25°
Here, F means "draw forward", − means "turn right 25°", and + means "turn left 25°". X does not correspond to any drawing action and is used to control the 
evolution of the curve. The square bracket "[" corresponds to saving the current values for position and angle, which are restored when the corresponding "]"
is executed.

 */

/** Draw forward in p5.js:
 * In p5, a line has start position and end position, to draw forward, use a function called 'Translate'
 * meaning we move the origin of the line to the end of the next line and begin drawing from that point.
 */

//SYSTEM RULES
let rules = {
    "X": "F+[[X]-X]-F[-FX]+X",
    "F":"FF"
}

let len = 3;
let ang = 25;
let word = "X";

//DRAW RULES
//moved rules inside setup since push pop defined in p5 library
let drawRules;






function setup(){
    createCanvas(400,400);
    noLoop();

    drawRules ={
        //draw forward
        "F": ()=>{
            //-len means draw up
            line(0,0,0,-len);
            //move to end of drawn line
            translate(0,-len);
        },
        //turn right (ang) 25 degrees
        //p5 works with radians; must convert radians to degees PI/180* ang
        "-": ()=>{
            rotate(PI/180 * +ang);
        },
        //turn left 25 
        "+":()=>{
            rotate(PI/180 * -ang);
        },
        //push information into save state
        "[": push,
        //pop
        "]": pop,
    }
}

function draw(){
    //set background color of the canvas

    //set white and override style.css
    //background(255);

    //OPTIONAL:
    //since background is set in style, provides and incremental greening gradient
    //provides cumulative effect can see previous iteration of plant 
    background('rgba(0,255,0, 0.25)');
    //web reader description
    describe('canvas with soft green background');

    push();

    //start drawing at bottom of canvas, a quarter in to the canvas and rotate
    translate(width/4,height);
    rotate(PI/180 *ang);

    for(let i =0;i<word.length;i++){
        let c = word[i];
        if(c in drawRules){
            //run function in drawrules
            drawRules[c]();
        }
    }
    pop();
}

function mouseReleased(){
    word = generate()
    //.log(word);
    draw();

}

//generate() creates the sequence for the fractal structure
// returns string of next rule
function generate(){
    let next = "";
    //loop over every character in every word
    for(let i=0; i<word.length;i++){
        let c = word[i];
        //if c is in our rules, add rules sequnce to next 
        //else add character to next gen (symbols carry forward)
        if(c in rules){
            next+=rules[c];
        }else{
            next+=c;
        }
    }      
    return next;
}