const chromaticScale = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
const minorIntervals = [0, 2, 3, 5, 7, 8, 10];

const flatToSharp: { [key: string]: string } = {
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
  Cb: "B",
};

function normalizeKey(key: string): string {
  // si es flat, lo cambiamos a sharp
  if (key.includes("b")) {
    return flatToSharp[key] || key;
  }
  return key;
}

export function getToneNote(
  { tonic, octave, tonality }: KeyContext = {
    tonic: "C",
    octave: 4,
    tonality: "major",
  }
): [(degree: number) => string, (note: string) => number] {
  const normalizedKey = normalizeKey(tonic);
  const keyIndex = chromaticScale.indexOf(normalizedKey);
  if (keyIndex === -1) {
    throw new Error("Invalid key.");
  }
  const intervals = tonality === "major" ? majorIntervals : minorIntervals;
  const noteToDegree = new Map<string, number>();
  for (let i = 0; i < intervals.length; i++) {
    const noteIndex = (keyIndex + intervals[i]) % 12;
    const note = chromaticScale[noteIndex];
    noteToDegree.set(note, i + 1);
  }

  function getNote(degree: number): string {
    const semitoneOffset = intervals[(degree - 1) % 7];
    const totalSemitones = keyIndex + semitoneOffset;
    const extraOctave =
      Math.floor(totalSemitones / 12) + Math.floor((degree - 1) / 7);
    const noteIndex = totalSemitones % 12;
    const note = chromaticScale[noteIndex];
    return `${note}${octave + extraOctave}`;
  }
  function getDegree(note: string): number {
    const noteWithoutOctave = String(note).replace(/\d+/g, "");
    const degree = noteToDegree.get(noteWithoutOctave);
    if (degree === undefined) {
      throw new Error(`Could not find degree for note ${note}`);
    }
    return degree;
  }
  return [getNote, getDegree];
}
