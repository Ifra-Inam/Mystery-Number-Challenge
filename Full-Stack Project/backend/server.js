// Importing express and creating an application instance
const express = require('express');
const app = express();
const port = 8095;

// Declare variables to store
// When running the server side test, let secretNumber = 5, and attemptsLeft = 3
let secretNumber;
let attemptsLeft;
let guess;
let username;

// Define an endpoint for starting a new game and retrieving the initial game state
app.get('/getresult', (req, res) => {
    console.log("Starting GET to getResult!");

    // Parse query parameters for the maximum number and number of attempts allowed
    let maxNum = parseInt(req.query.maxNum);
    let attempts = parseInt(req.query.attempts); 

    secretNumber = Math.floor(Math.random() * maxNum) + 1; // Generate a random secret number between 1 and maxNum
    attemptsLeft = attempts;

    console.log(`Game started with secret number: ${secretNumber} (max: ${maxNum}, attempts: ${attemptsLeft})`);

    // Create a JSON object with the initial game state
    var result =  JSON.stringify({secretNumber: secretNumber, attemptsLeft: attemptsLeft});

    res.header("Access-Control-Allow-Origin", "*");
    res.send(result);
});

// Define an endpoint for submitting a guess
app.get('/submitguess', (req, res) => {
    console.log("Starting GET to submitGuess!");

    guess = parseInt(req.query.guess); // Parse the guess from the query parameters
    username = JSON.parse(req.query.username); // Parse the username from the query parameters

    console.log(`Game started with number guess: ${guess} (user: ${username})`);

    // Use the getResult function to evaluate the guess and generate a response
    var result =  JSON.stringify(getResult(guess, username));

    res.header("Access-Control-Allow-Origin", "*");
    res.send(result);
}); 

// Define an endpoint when user wants to play again 
app.get('/playagain', (req, res) => {

    // Reset game variables to their initial undefined state
    secretNumber = undefined;
    attemptsLeft = undefined;

    console.log("Game has been reset.");

    var result = JSON.stringify({message: "Let's play again!"});

    res.header("Access-Control-Allow-Origin", "*");
    res.send(result);
});

// Define a function to evaluate the player's guess and return the result
function getResult(guess, username) {
    
    // Initialize the result object with default values
    let result = {
        correct: false,
        message: 'Enter a valid input.',
        attemptsLeft: attemptsLeft,
    };
    
    if (guess == secretNumber) {
        result.correct = true;
        result.message = `Correct! You guessed the right number, ${username}!`;
    } 
    else if (guess < secretNumber) {
        result.correct = false;
        result.message = 'Your guess is too LOW!';
    } 
    else if (guess > secretNumber) {
        result.correct = false;
        result.message = 'Your guess is too HIGH!';
    } 

    if (!result.correct) {
        attemptsLeft--;
        result.attemptsLeft = attemptsLeft; 
    }

    if (attemptsLeft <= 0) {
        result = {correct: false, message: `Game Over! You ran out of attempts, ${username}!`} }

    return result;
}

// Initialize the result object with default values
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

//export { getResult }