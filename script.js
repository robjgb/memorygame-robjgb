// global constants
//const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
let numbers = [1,2,3,4] 
let randomPattern, pattern = [];
var lives = 3;
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound

document.getElementById("livesCount").classList.add("hidden");

function randomizer() {
  for(let i=0;i<=7;i++) {
    randomPattern = numbers[Math.floor(Math.random() * numbers.length)]
    pattern.push(randomPattern)
  }
  console.log(pattern)
}

function startGame() {
    //initialize game variables
    randomizer()
    clueHoldTime = 1000
    lives = 3
    progress = 0;
    gamePlaying = true;
    document.getElementById("livesCount").classList.remove("hidden");
    document.getElementById("lives").innerHTML = lives 
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
}

function stopGame() {
    randomPattern, pattern = [];
    gamePlaying = false;
    document.getElementById("livesCount").classList.add("hidden");
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn) {
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn) {
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn) {
  if(gamePlaying) {
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++) { // for each clue that is revealed so far
    clueHoldTime -= 25
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue,delay,pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function guess(btn) {
  console.log("user guessed: " + btn);
  console.log("progress: " + progress + " guessCounter: " + guessCounter)
  document.getElementById("lives").innerHTML = lives 
  if(!gamePlaying) {
    return;
  }
  
  if(pattern[guessCounter] != btn) {
      lives-=1; //wrong pattern, -1 life. 
      document.getElementById("lives").innerHTML = lives 
      if(lives==0){
      loseGame();//wrong patterns, no more lives, game lost. 
    }
  }
  else {
    if(guessCounter == progress) {
      if(progress != pattern.length - 1) {
        progress++;
        playClueSequence(); //correct pattern. play next clue
      }
      else {
        winGame(); //all correct patterns, finished game, game won!
      }
    }
    else {
      guessCounter++; //check next guess
      document.getElementById("lives").innerHTML = lives 
    }
  } 
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

// Sound Synthesis Functions
const freqMap = {
  1: 130.8128,
  2: 164.8138,
  3: 195.9977,
  4: 261.6256   
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)