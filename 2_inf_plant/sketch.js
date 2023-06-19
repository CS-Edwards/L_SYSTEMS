//PD Documentation
//Background() - https://p5js.org/reference/#/p5/background
//CreateCanvas() -https://p5js.org/reference/#/p5/createCanvas
//mouseReleased() -https://p5js.org/reference/#/p5/mouseReleased


/**
Example : Barney Codes 
variables : X F
constants : + − [ ]
start  : X
rules  : (X → F[+X][-X]FX), (F → FF)


updated rules: (X → F[+X][-X]FX, X → F[-X]FX, X → F[+X]FX)



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
    "X": [{rule: "F[+X][-X]FX", prob: 0.5},
          {rule: "F[-X]FX", prob: 0.05},
          {rule: "F[+X]FX", prob: 0.05},
          {rule: "F[++X][-X]FX", prob: 0.1}, //extra rotations from side branches
          {rule: "F[+X][--X]FX", prob: 0.1},   //extra rotations from side 
          

          //Additional Fruiting Rules A and B
          {rule: "F[+X][-X]FA", prob: 0.1}, 
          {rule: "F[+X][-X]FB", prob: 0.1},
        ],
    "F":[{rule: "FF", prob: 0.85},
         {rule: "FFF", prob: 0.05}, //extra growth
         {rule: "F", prob: 0.1}, //stunting
        ]
}
const len = 4;
const ang = 25;
const numGens = 6;

let word = "X";

//DRAW RULES
//moved rules inside setup since push pop defined in p5 library
let drawRules;






function setup(){
    createCanvas(600,600);
    noLoop();

    strokeWeight(2);

    drawRules ={
        //fruiting rules
        "A":()=>{
            noStroke();
            fill("#E5CEDC");
            circle(0,0,len*2);
        },

        "B": ()=>{
            noStroke();
            fill("#FCA17D");
            circle(0,0,len*2);
        },

        //draw forward
        "F": ()=>{
            //color green
            stroke("#9ea93f");
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
        // meas we've reached the end of the branch
        "]": pop,
    }
}

function draw(){
    //set background color of the canvas

    //set white and override style.css
    background(255);

    //OPTIONAL:
    //since background is set in style, provides and incremental greening gradient
    //provides cumulative effect can see previous iteration of plant 
    //('rgba(0,255,0, 0.25)');
    //web reader description
    describe('canvas with soft green background');

    push();

    //start drawing at bottom of canvas, a quarter in to the canvas and rotate
    translate(width/4,height);
    //rotate(PI/180 *ang);

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

function chooseOne(ruleSet){
    //generate number between 0 and 1
    let n = random();
    let t = 0;

    //loop through all rules to sum probability (sum of all probs = 1)
    for(let i=0; i< ruleSet.length; i++){
        t += ruleSet[i].prob;
        //until total probability has surpassed random n
        if(t>n){
            return ruleSet[i].rule;
        }
    }
    return "";

}

//generate() creates the sequence for the fractal structure
// returns string of next rule
function generate(){
    let next = "";
    //loop over every character in every word
    for(let i=0; i<word.length;i++){
        let c = word[i];

        //Array of different rules that a single character can map to
        // and a series of probabilites so we can weight how the L- System will choose
        // the amoung the different rules.
        
        if(c in rules){
            let rule = rules[c];
            //If the rule is an array, chooseOne() choses one of the options from the rule set
            if(Array.isArray(rule)){
                next += chooseOne (rule);
            }else{
                next += rules[c];
            }
        }else{
            next+=c;
        }
    }      
    return next;
}