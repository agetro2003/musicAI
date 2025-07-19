'use client';
import { StaffData } from "@/types/staffData";
import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Voice, Dot, Accidental } from "vexflow";
import * as Tone from "tone";
export default function Staff() {
  const containerRef = useRef<HTMLDivElement>(null);
const scoreData: StaffData = {
  clef: "treble",
  timeSignature: "4/4",
  keySignature: "B",
  measures: [
    [
      { keys: ["c/4"], duration: "q" },
      { keys: ["d/4"], duration: "q" },
      { keys: ["e/4"], duration: "qd", dotted: true },
      { keys: ["f/4"], duration: "8" }
    ],
    [
      { keys: ["g/4"], duration: "h", accidental: "#" },
      { keys: ["a/4"], duration: "q" },
      { keys: ["b/4"], duration: "q" }
    ],
    [
      { keys: ["c/5"], duration: "q", accidental: "b" },
      { keys: ["d/4"], duration: "q" },
      { keys: ["e/4"], duration: "8r" },
      { keys: ["f/4"], duration: "8" },
      { keys: ["g/4"], duration: "q" }
    ],
    [
      { keys: ["f/4"], duration: "q" },
      { keys: ["g/4"], duration: "q" },
      { keys: ["a/4"], duration: "qd", dotted: true },
      { keys: ["b/4"], duration: "8" }
    ],
    [
      { keys: ["b/4"], duration: "h" },
      { keys: ["c/4"], duration: "q" },
      { keys: ["d/4"], duration: "q" }
    ],
    [
      { keys: ["e/4"], duration: "q", accidental: "n" }, 
      { keys: ["f/4"], duration: "q" }, 
      { keys: ["g/4"], duration: "8r" },
      { keys: ["a/4"], duration: "8" },
      { keys: ["b/4"], duration: "q"},
  ],
    [
      { keys: ["c/5"], duration: "q" },
      { keys: ["d/5"], duration: "q" },
      { keys: ["e/5"], duration: "qd", dotted: true },
      { keys: ["f/4"], duration: "8" }
    ],
    [
      { keys: ["g/4"], duration: "h", accidental: "#" },
      { keys: ["a/4"], duration: "q" },
      { keys: ["b/4"], duration: "q" }
    ]

]
};

const measureSize = 250; // Width of each measure
const measureYSpacing = 100; // Vertical spacing between measures

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const renderer = new Renderer(containerRef.current!, Renderer.Backends.SVG);
    const context = renderer.getContext();
    
    // Que el tamaño del SVG sea dinámico, de acuerdo al número de compases
    // Que hayan 6 compases por línea
    const numMeasures = scoreData.measures.length;
    const width = Math.min(numMeasures, 6) * measureSize;
    const height = Math.ceil(numMeasures / 6) * measureYSpacing + 100; // 100 for padding
    renderer.resize(width, height);

    scoreData.measures.forEach((measure, index) => {
      const stave = new Stave(10 + (index % 6) * measureSize, 40 + Math.floor(index / 6) * measureYSpacing, measureSize);
      if (index === 0) {
        stave.addClef(scoreData.clef)
             .addKeySignature(scoreData.keySignature)
             .addTimeSignature(scoreData.timeSignature);
      }
      stave.setContext(context).draw();

      const notes = measure.map(noteData => {
        const note: StaveNote = new StaveNote({
          keys: noteData.keys,
          duration: noteData.duration
        });

        if (noteData.dotted) {
          Dot.buildAndAttach([note], { all: true });
        }

        if (noteData.accidental) {
          note.addModifier(new Accidental(noteData.accidental));
        }

        return note;
      });

      const numBeats = parseInt(scoreData.timeSignature.split('/')[0], 10);
      const beatValue = parseInt(scoreData.timeSignature.split('/')[1], 10);
    
      const voice = new Voice({ numBeats: numBeats, beatValue: beatValue });
      voice.addTickables(notes);
      new Formatter().joinVoices([voice]).formatToStave([voice], stave);
      voice.draw(context, stave);
    });
  }, []);

  // function to parse the note data and play the sound (ej: c/4 becomes C4)
  const parseNote = (noteData: { keys: string[]; duration: string }) => {
    const note = noteData.keys[0].replace('/', '');
    return note.charAt(0).toUpperCase() + note.slice(1);
  };

  //function to parse the duration (ej: "q" becomes "4n"
  const parseDuration = (duration: string) => {
    switch (duration) {
      case 'q':
        return '4n';
      case 'h':
        return '2n';
      case '8':
        return '8n';
      case '8r':
        return '8n';
      case 'qd':
        return '4n.';
      default:
        return duration;
    }
  }

  const playStaff = async () => {
   await Tone.start();
    const synth = new Tone.Synth().toDestination();
    
  let now = Tone.now();
  let currentTime = now;
    scoreData.measures.forEach((measure) => {
      measure.forEach((noteData) => {
        const note = parseNote(noteData);
        const duration = parseDuration(noteData.duration);
        
        //silent notes
        if (!noteData.duration.includes('r')) {
          synth.triggerAttackRelease(note, duration, currentTime);
        }
        currentTime += Tone.Time(duration).toSeconds();

      });
    });

  };
  return (
  <div>
    <div ref={containerRef}></div>
    <button onClick={playStaff}>Play Staff</button>
  </div>
  );
  
}
