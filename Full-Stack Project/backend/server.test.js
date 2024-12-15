import { describe, it, expect } from "vitest";
import { getResult } from "server.js";

describe('getResult', () => {
    
    let username = 'Player1';
    
    it('should return correct message for a correct guess', () => {
        const result = getResult(5, username);
        expect(result.correct).toBe(true);
        expect(result.message).toBe(`Correct! You guessed the right number, ${username}!`);
    });

    it('should return message for a guess that is too low', () => {
        const result = getResult(3, username);
        expect(result.correct).toBe(false);
        expect(result.message).toBe('Your guess is too LOW!');
        expect(result.attemptsLeft).toBe(2); // Attempts left should decrease
    });

    it('should return message for a guess that is too high', () => {
        const result = getResult(8, username);
        expect(result.correct).toBe(false);
        expect(result.message).toBe('Your guess is too HIGH!');
    });

    it('should return Game Over message when attempts run out', () => {
        const result = getResult(10, username);
        expect(result.correct).toBe(false);
        expect(result.message).toBe(`Game Over! You ran out of attempts, ${username}!`);
    });
});