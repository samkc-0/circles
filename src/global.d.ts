declare global {
  type Note = string;
  type Key =
    | "C"
    | "C#"
    | "Db"
    | "D"
    | "D#"
    | "Eb"
    | "E"
    | "F"
    | "F#"
    | "Gb"
    | "G"
    | "G#"
    | "Ab"
    | "A"
    | "A#"
    | "Bb"
    | "B";

  type KeyContext = { tonic: Key; octave: number; tonality: "major" | "minor" };
}

export {};
