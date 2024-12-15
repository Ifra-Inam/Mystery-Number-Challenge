/**
 * FULL-STACK PROJECT
 * Authors: Ifra Inam

=== Module Description ===
This is the client side code for a number guessing game.
It contains an API call to code that will run on a node server.
**/

/** CONSTANTS **/
const levels = document.querySelectorAll(".level"); // Select all elements with the class "level
// Retrieve stored username and game parameters from localStorage
const username = localStorage.getItem("username");
const maxNum = parseInt(localStorage.getItem("maxNum"));
const attempts = parseInt(localStorage.getItem("attempts"));
const guess = parseInt(localStorage.getItem("guess"));
const apiUrl = 'http://localhost:8095/'; // Base URL for API requests
 
/** GLOBAL VARIABLES **/
var time; // Set to 75 when running client side test
var countdown; 
var countAttempts = 1; // Track the number of attempts made
// Track and update score from localStorage, and manage next steps after a guess
let score = Number(localStorage.getItem("score"));
// Initialize sounds 
var winAudio = new Audio("music/gameWon.mp3");
var loseAudio = new Audio("music/gameLost.mp3");

// Fetches the game result (initializes a new game with parameters)
function getResult() {
  fetch(apiUrl + 'getresult?maxNum=' + JSON.stringify(maxNum) + '&attempts=' + JSON.stringify(attempts))
  .then(response => {
    if (!response.ok) { 
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem("secretNumber", data.secretNumber); // Store the secret number in localStorage and log the game start
    console.log('Game started! Guess the number between 1 and', maxNum, "secretNumber: ", data.secretNumber);
  })
  .catch(error => console.error('Error:', error));
}

// Submits a guess to the server and handles the result
function submitGuess(guess) {
  fetch(apiUrl + 'submitguess?guess=' + JSON.stringify(guess) + '&username=' + JSON.stringify(username))
  .then(response => {
    if (!response.ok) { 
      throw new Error('Network response was not ok');
    }
    return response.json(); 
  })
  .then(data => {
    // Show overlay with the server's response
    document.getElementById("overlay").style.visibility = "visible";
    document.getElementById("windowText").innerText = data.message;
    const contButton = document.getElementById("continueButton2");
    contButton.disabled = false; // Enable the continue button
    
    // Check whether attempts have ran out and play the lose sound + redirect to the lose page 
    if (data.message == `Game Over! You ran out of attempts, ${username}!`) {
      contButton.addEventListener('click', goToLosePage);
      loseAudio.play();
    }
    // Save whether the guess was correct and play win sound if correct
    localStorage.setItem("correct", JSON.stringify(data.correct));
    if (data.correct) {
      winAudio.play();
    }
  })
  .catch(error => console.error('Error:', error));
}

// Resets the game state and clears relevant localStorage items which allows for the a user to play multiple times
function playAgain() {
  fetch(apiUrl + 'playagain')
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Alert user of reset

        const keysToKeep = ['username', 'score']; // Keys that should not be removed

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          // Remove keys not in the keep list
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        }
        window.location.href = "levelsPage.html"; // Redirect to levels page
    })
    .catch(error => console.error('Error resetting game:', error));
}

// Function that redirects to lose page
function goToLosePage() {
  window.location.href = "losePage.html";
}

// Resets the entire game when a user decides to stop playing
function reStart() {
  localStorage.clear();
}

// Sets up event listeners for the username page
function loadUsernamePage() {
  const enterUsername = document.getElementById("enterButton1");
  enterUsername.addEventListener('click', getUsername); 
}

// Saves the entered username and moves to the levels page
function getUsername() {
  const username = document.getElementById("username").value;
  if (username == "") { 
    alert("Enter a valid username.") } // Prompt user for valid input
  else {
    localStorage.setItem("username", username);
    window.location.href = "levelsPage.html"; } // Redirect to levels page
}

// Sets up event listeners for each level button (EASY, MEDIUM, HARD)
function loadLevelPage() {
  for (const level of levels) {
    level.addEventListener('click', getLevelInfo); }
}


// When running client side test, comment out line 134,156-159, and add a return statement of 'return {attempts, startingMinutes}' at the end
// Saves level details and navigates to the chosen level page
function getLevelInfo(event) {
  const element = event.currentTarget;
  const level = element.textContent;
  localStorage.setItem('level', level);

  var attempts; 
  var startingMinutes;

  // Configure attempts and time based on the selected difficulty level
  switch (level) {
    case "EASY":
        attempts = 5;
        startingMinutes = 5;
        break;
    case "MEDIUM":
        attempts = 3;
        startingMinutes = 3;
        break;  
    case "HARD":
        attempts = 1;
        startingMinutes = 1;
        break;  
  }

  // Store configuration in localStorage and navigate to the next page
  localStorage.setItem("startingMinutes", startingMinutes);
  localStorage.setItem("attempts", attempts);

  window.location.href = "chosenLevelPage.html"; 
}

// Displays username, level, and attempts on the chosen level page
function loadChosenLevelPage() {
  const username = localStorage.getItem("username");
  const usernameDisplayed = document.getElementById("usernameDisplayed");
  usernameDisplayed.textContent = username;
  
  const level = localStorage.getItem("level");
  const chosenLevel = document.getElementById("chosenLevel");
  chosenLevel.textContent = level;

  const attemptsDisplayed = document.getElementById("attempts");
  attemptsDisplayed.textContent = attempts;

  const singplePlural = document.getElementById("singlePlural");
  singplePlural.textContent = (level == "HARD") ? "try" : "tries";
} 

// Sets up event listeners for entering the max number
function loadMaxNumPage() {
  const enterMaxNum = document.getElementById("enterButton2");
  enterMaxNum.addEventListener('click', getMaxNum); 
}

// Validates max number input and navigates to the game page
function getMaxNum() {
  const maxNum = parseInt(document.getElementById("maxNum").value); 
  if (isNaN(maxNum) || maxNum == "" || maxNum < 1) { 
    alert("Enter a valid input.") } // Prompt user for valid input
  else {
    localStorage.setItem("maxNum", maxNum);
    window.location.href = "gamePage.html"; // Redirect to game page
  }
}

// Load the game page, initialize game settings, and start countdown
function loadGamePage() {
  const maxNum = localStorage.getItem("maxNum"); // Get max number from localStorage and display it
  const maxNumDisplayed = document.getElementById("maxNumDisplayed");
  maxNumDisplayed.textContent = maxNum; 

  getResult(); // Call getResult to initialize the game and set up the secret number
  
  // Display current attempt number (starts at 1)
  const currentAttempt = document.getElementById("currentAttempt");
  currentAttempt.innerText = 1;
  
  // Add an event listener to the guess button
  const enterGuess = document.getElementById("enterButton3");
  enterGuess.addEventListener('click', getGuess);

  // Get starting minutes for countdown from localStorage
  const startingMinutes = localStorage.getItem('startingMinutes');
  time = startingMinutes * 60;

  updateCountdown(); // displays the initial countdown immediately after the page loads, without a 1-second delay
  setInterval(updateCountdown, 1000); // Update countdown every second

  // Hide overlay window initially
  const overlay = document.getElementById("overlay"); 
  overlay.style.visibility = "hidden";

  // Disable the continue button until a guess is made
  const contButton = document.getElementById("continueButton2");
  contButton.addEventListener('click', nextStep); 
  contButton.disabled = true; 
} 

function nextStep() {
  const correct = JSON.parse(localStorage.getItem("correct")); // Get whether the guess was correct from localStorage

  // If guess was incorrect, increment score and reset overlay
  if (!correct) {
    const overlay = document.getElementById("overlay"); 
    overlay.style.visibility = "hidden";
    const contButton = document.getElementById("continueButton2");
    contButton.disabled = true; }
  // If correct, go to win page and increment score
  else {
    score++;
    localStorage.setItem("score", score);
    window.location.href = "winPage.html"; }
}

// Function to get the user's guess and handle submission
function getGuess() {
  // Get guess value and store it in localStorage
  const guess = parseInt(document.getElementById("numGuess").value);
  // Validates number number input 
  if (isNaN(guess) || guess == "" || guess < 1 || guess > maxNum) { 
    alert("Enter a valid input.") }
  else {
    localStorage.setItem("guess", guess); 
    submitGuess(guess); // Send guess to server

    // Update current attempt number
    const currentAttempt = document.getElementById("currentAttempt");
    currentAttempt.innerText = countAttempts;

    // If there are more attempts left, increment and update attempt number
    if (countAttempts < attempts) {
      countAttempts++;  
      currentAttempt.innerText = countAttempts; } 
  }
}

// When running the client side test comment out lines 273-278, 289-290 and add 'return countdown' to line 279 and at the end of the function
// Function to update countdown timer and handle "time's up" scenario
function updateCountdown() {
  // If time is up, display message, play sound, and show overlay
  if (time < 0) {
    countdown = "00:00";  
    document.getElementById("overlay").style.visibility = "visible";
    document.getElementById("windowText").textContent = "Time's Up!";
    const contButton = document.getElementById("continueButton2"); 
    contButton.disabled = false; // Enable continue button
    contButton.addEventListener('click', goToLosePage); // Redirects to lose page
    loseAudio.play(); // Play lose audio
    return; } 

  // Calculate minutes and seconds for the countdown
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds; // Format seconds with leading zero
  countdown = `${minutes}:${seconds}`;
  time--; // Decrease time by one second

  // Update the countdown timer display
  const timer = document.getElementById("time");  
  timer.textContent = countdown; 
}

// Function to load the lose page and display score and secret number
function loadLosePage() {
  document.getElementById("score").textContent = localStorage.getItem("score") || 0; 
  document.getElementById("usernameDisplayed").textContent = localStorage.getItem("username");

  document.getElementById("secretNumber").textContent = localStorage.getItem("secretNumber");

  // Set up event listener for playing the game again
  const playAgainBut = document.getElementById("playAgain");
  playAgainBut.addEventListener('click', playAgain);

  // Set up event listener for quitting the game
  const quit = document.getElementById("quit");
  quit.addEventListener('click', reStart)
}

// Function to load the win page
function loadWinPage() {
  const usernameDisplayed = document.getElementById("usernameDisplayed"); 
  usernameDisplayed.textContent = localStorage.getItem("username");

  // Set up event listener for playing the game again
  const playAgainBut = document.getElementById("playAgain");
  playAgainBut.addEventListener('click', playAgain);

  // Set up event listener for quitting the game
  const quit = document.getElementById("quit");
  quit.addEventListener('click', reStart)
}

// When running client side test, comment out everything except the two functions being tested, along with the related variables (time, countdown) and export line.
//export { updateCountdown, getLevelInfo }