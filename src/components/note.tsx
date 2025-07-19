"use client";
import * as Tone from "tone";
// Note component to play a sound
// Should receive a note, a duration and a text for the button as a prop
export default function Note({ note = "C4", duration = "4n", buttonText = "Do" }) {
    const playNote = () => {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(note, duration);
    };
    
    return (
        <div>
        <button onClick={playNote}>{buttonText}</button>
        </div>
    );
    }