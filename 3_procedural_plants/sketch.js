//Procedural growth using linear interpolation

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
let drawRules;






function setup(){
    createCanvas(600,600);
    noLoop();

    strokeWeight(2);

    //Add t valued to all functions for LERPing, allows to draw trainsitional state
    drawRules ={
        //fruiting rules
        "A":(t)=>{
            noStroke();
            fill("#E5CEDC");
            circle(0,0,len*2 * t); //grow size of berry
        },

        "B": (t)=>{
            noStroke();
            fill("#FCA17D");
            circle(0,0,len*2 * t); //grow size of berry
        },

        //draw forward
        //plant stalk
        "F": (t)=>{
            //color green
            stroke("#9ea93f");
            //-len means draw up
            line(0,0,0,-len); //grow stalk
            //move to end of drawn line
            translate(0,-len); //necessary for consistent line (no dashes)
        },
        //turn right (ang) 25 degrees
        //p5 works with radians; must convert radians to degees PI/180* ang
        "-": (t)=>{
            rotate(PI/180 * +ang * t) ;
        },
        //turn left 25 
        "+":(t)=>{
            rotate(PI/180 * -ang * t);
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