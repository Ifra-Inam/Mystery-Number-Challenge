import { describe, it, expect } from "vitest";
import { updateCountdown, getLevelInfo } from "client.js";

describe('updateCountdown', () => {

  // Test when time > 0
  it('should update the countdown correctly when time > 0', () => { 
    // Starting time, 1 minute 15 seconds
    const countdown = updateCountdown();  // Call the function and capture the result
    
    expect(countdown).toBe("1:15");  // Countdown should be 1 minute 14 seconds
  });
});


describe('getLevelInfo', () => {
  it('should return correct attempts and starting minutes for EASY level', () => {
    // Mock the event for EASY level
    const mockEvent = { currentTarget: { textContent: "EASY" } };
    
    const result = getLevelInfo(mockEvent);

    expect(result.attempts).toBe(5);
    expect(result.startingMinutes).toBe(5);
  });

  it('should return correct attempts and starting minutes for MEDIUM level', () => {
    // Mock the event for MEDIUM level
    const mockEvent = { currentTarget: { textContent: "MEDIUM" } };

    const result = getLevelInfo(mockEvent);

    expect(result.attempts).toBe(3);
    expect(result.startingMinutes).toBe(3);
  });

  it('should return correct attempts and starting minutes for HARD level', () => {
    // Mock the event for HARD level
    const mockEvent = { currentTarget: { textContent: "HARD" } };

    const result = getLevelInfo(mockEvent);

    expect(result.attempts).toBe(1);
    expect(result.startingMinutes).toBe(1);
  });
});