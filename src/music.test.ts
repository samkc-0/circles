// getToneNote.test.ts

import { describe, it, expect } from "vitest";
import { getToneNote } from "./music"; // adjust the path accordingly

describe("getToneNote", () => {
  it("gets all of C major in 4th octave correctly", () => {
    const [getNote, _] = getToneNote();
    expect(getNote(1)).toBe("C4");
    expect(getNote(2)).toBe("D4");
    expect(getNote(3)).toBe("E4");
    expect(getNote(4)).toBe("F4");
    expect(getNote(5)).toBe("G4");
    expect(getNote(6)).toBe("A4");
    expect(getNote(7)).toBe("B4");
  });

  it('returns "C#5" for key "B", degree 2 in a major scale', () => {
    // in B major, the 2nd degree is C# and it bumps up to the next octave
    const context: KeyContext = { tonic: "B", octave: 4, tonality: "major" };
    expect(getToneNote(context)[0](2)).toBe("C#5");
  });

  it('normalizes flats and returns "F4" for key "Db", degree 3 in a major scale', () => {
    const context: KeyContext = { tonic: "Db", octave: 4, tonality: "major" };
    expect(getToneNote(context)[0](3)).toBe("F4");
  });

  it('works for a minor scale: key "A", degree 3 in a minor scale', () => {
    // in A minor, the 3rd degree is C
    const context: KeyContext = { tonic: "A", octave: 4, tonality: "minor" };
    expect(getToneNote(context)[0](1)).toBe("A4");
    expect(getToneNote(context)[0](3)).toBe("C5");
  });

  it("Wraps the degree (e.g. 12 will get degree 4)", () => {
    expect(getToneNote()[0](8)).toBe("C5");
    expect(getToneNote()[0](12)).toBe("G5");
  });

  it("throws an error for an invalid key", () => {
    const context: KeyContext = {
      tonic: "H" as Key,
      octave: 4,
      tonality: "major",
    };
    expect(() => getToneNote(context)).toThrow("Invalid key.");
  });
  it("works generally, i.e. this sequence is what you'd expect.", () => {
    const sequence = [1, 3, 5, 7, 8];
    const [getNote, getDegree] = getToneNote();
    const noteNames = sequence.map(getNote);
    const degrees = noteNames.map(getDegree);
    expect(noteNames).toEqual(["C4", "E4", "G4", "B4", "C5"]);
    expect(degrees).toEqual([1, 3, 5, 7, 1]);
  });
});
