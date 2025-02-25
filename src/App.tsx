import {
  JSX,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import * as Tone from "tone";
import { getToneNote } from "./music";
import axios from "axios";
import { C } from "vitest/dist/chunks/reporters.QZ837uWx.js";

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sequence, setSequence] = useState<Tone.Sequence<string> | null>(null);
  const context: KeyContext = { tonic: "C", octave: 3, tonality: "major" };
  const [getNote, getDegree] = useCallback(getToneNote(context), [context]);
  const userSynth = useRef<Tone.Synth>();
  const contextDrone = useRef<Tone.Synth>();
  const [visibility, dispatch] = useReducer(reducer, [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  function showCircle(degree: number) {
    dispatch({ type: "show_degree", degree });
    setTimeout(() => dispatch({ type: "hide_degree", degree }), 300);
  }

  useEffect(() => {
    // create a synth
    userSynth.current = new Tone.Synth({
      oscillator: { type: "sawtooth" },
    }).toDestination();
    contextDrone.current = new Tone.Synth().toDestination();
    const synth = new Tone.Synth().toDestination();
    // define a sequence
    const seq = new Tone.Sequence<string>(
      (time, note) => {
        const degree = getDegree(note);
        const freq = Tone.Frequency(note).transpose(
          12 * Math.floor(Math.random() * 3)
        );
        synth.triggerAttackRelease(note, "8n", time);
        console.log(note);
        dispatch({ type: "show_degree", degree: getDegree(note) });
        showCircle(degree);
      },
      [
        1, 1, 2, 3, 3, 2, 1, 3, 5, 5, 4, 3, 3, 4, 5, 5, 4, 3, 2, 1, 1, 2, 3, 2,
        1,
      ].map(getNote),
      "4n"
    );

    setSequence(seq);

    return () => {
      seq.dispose(); // cleanup on unmount
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (Tone.context.state !== "running") {
      Tone.start();
    }
    switch (event.key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
        const degree = Number(event.key);
        userSynth.current.triggerAttack(getNote(degree), "1n");
        showCircle(degree);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
    if (Tone.context.state !== "running") {
      Tone.start();
    }
    switch (event.key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
        const degree = Number(event.key);
        userSynth.current.triggerRelease();
    }
  };

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

  return (
    <div
      tabIndex={0}
      className="bg-slate-500"
      onKeyPress={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <button
        style={{ zIndex: 100 }}
        onClick={handlePlay}
        disabled={!sequence}
        className="fixed right-10 bottom-10 text-white border-2 border-white rounded-xl p-5"
      >
        {isPlaying ? "Stop" : "Start"}
      </button>

      <Circles visibility={visibility} />
    </div>
  );
}

interface CirclesProps {
  visibility: boolean[];
}

export function Circles({ visibility }: CirclesProps) {
  const circles = [
    "bg-red-500 opacity-100 bg-center",
    "bg-blue-500 opacity-100",
    "bg-yellow-500 opacity-100",
    "bg-green-500 opacity-100 bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%",
    "bg-purple-500 opacity-100",
    "bg-pink-500 opacity-100",
    "bg-orange-500 opacity-100",
  ];

  return (
    <div className="flex items-center justify-center min-h-screen fixed top-0 left-0">
      {circles.map((color, index) => (
        <div
          key={index}
          id={`ring-${index}`}
          className={`fixed rounded-full ${
            visibility[index % 7] ? `${color}` : "bg-blue-300 opacity-10"
          } z-${
            10 * index
          } duration-300 ease-in-out ${`bg-[url(https://source.unsplash.com/random/800x600/?animal)]`}`}
          style={{
            width: `min(100vw, 100vh)`,
            height: `min(100vw, 100vh)`,
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${0.5 + index * 0.2})`,
          }}
        />
      ))}
    </div>
  );
}

function reducer(
  visibility: boolean[],
  action: { type: string; degree: number }
): boolean[] {
  let copy_: boolean[];
  switch (action.type) {
    case "show_degree":
      copy_ = [...visibility];
      copy_[action.degree - 1] = true;
      return copy_;
    case "hide_degree":
      copy_ = [...visibility];
      copy_[action.degree - 1] = false;
      return copy_;
    default:
      throw new Error(`Unimplemented action: ${action.type}`);
  }
}
