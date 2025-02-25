import { JSX, useCallback, useEffect, useState } from "react";
import * as Tone from "tone";
import { getToneNote } from "./music";

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sequence, setSequence] = useState<Tone.Sequence<string> | null>(null);
  const context: KeyContext = { tonic: "C", octave: 4, tonality: "major" };
  const getNote = useCallback(getToneNote(context), [context]);

  useEffect(() => {
    // create a synth
    const synth = new Tone.Synth().toDestination();
    // define a sequence
    const seq = new Tone.Sequence<string>(
      (time, note) => {
        synth.triggerAttackRelease(note, "8n", time);
      },
      [1, 3, 5, 7, 8].map(getNote), // notes
      "4n" // quarter note steps
    );

    setSequence(seq);

    return () => {
      seq.dispose(); // cleanup on unmount
    };
  }, []);

  const handlePlay = async () => {
    await Tone.start(); // unlock audio context
    if (sequence) {
      if (isPlaying) {
        sequence.stop();
        Tone.Transport.stop();
      } else {
        sequence.start(0);
        Tone.Transport.start();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const colors = ["red", "white"];
  const circles = [
    "bg-red-500 opacity-40",
    "bg-blue-500 opacity-30",
    "bg-yellow-500 opacity-20",
    "bg-green-500 opacity-10",
  ];
  return (
    <div className="bg-slate-500">
      <button
        onClick={handlePlay}
        disabled={!sequence}
        className="fixed right-0 bottom-0"
      >
        {isPlaying ? "Stop" : "Play"} Sequence
      </button>

      <Circles />
    </div>
  );
}

interface CirclesProps {
  visiblity: { [key: number]: boolean };
}

export function Circles({ visiblity }: CirclesProps) {
  const circles = [
    "bg-red-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-indigo-500",
  ];

  return (
    <div className="flex items-center justify-center min-h-screen fixed top-0 left-0">
      {circles.map((color, index) => (
        <div
          key={index}
          id={`ring-${index}`}
          className={`fixed rounded-full ${color} z-${index} opacity-100`}
          style={{
            width: `min(100vw, 100vh)`, // screen width on mobile, screen height on desktop
            height: `min(100vw, 100vh)`,
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${1 - index * 0.1})`,
          }}
        />
      ))}
    </div>
  );
}
