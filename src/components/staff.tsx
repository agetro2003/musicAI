'use client';
import { StaffData } from "@/types/staffData";
import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Voice, Dot, Accidental } from "vexflow";
import * as Tone from "tone";
import { NoteData } from "@/types/note";

export default function Staff() {
  const containerRef = useRef<HTMLDivElement>(null);
const scoreData: StaffData = {
  clef: "treble",
  timeSignature: "4/4",
  keySignature: "B",
  measures: [
    [
      {
        chord: ["c/4", "e/4", "g/4"],
        duration: "q",
        dotted: false,
        accidentals: ["#", null, null]
      },
      {
        chord: ["d/4", "f/4", "a/4"],
        duration: "q",
        dotted: false,
        accidentals: [null, null, null]
      }, 
      {
        chord: ["e/4", "g/4", "b/4"],
        duration: "q",
        dotted: true,
        accidentals: [null, "#", null]
      },
      {
        chord: ["f/4"],
        duration: "8",
        dotted: false,
        accidentals: [null, null, null]
      }
    ],
    [
      {
        chord: ["e/4", "g/4", "b/4"],
        duration: "q",
        dotted: true,
        accidentals: [null, "#", null]
      },
      {
        chord: ["f/4"],
        duration: "q",
        dotted: false,
        accidentals: [null, null, null]
      },
      {
        chord: ["g/4"],
        duration: "q",
        dotted: false,
        accidentals: [null, null, null]
      },
      {
        chord: ["a/4", "c/5"],
        duration: "8",
        dotted: false,
        accidentals: [null, null]
      }
    ],
    [
      {
        chord: ["g/4"],
        duration: "h"
      },
      {
        chord: ["g/4"],
        duration: "hr"
      }

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
      const measures = measure.map(notedata => {

        const duration = notedata.duration + (notedata.dotted ? 'd' : '');

          const staveNote = new StaveNote({
            keys: notedata.chord,
            duration: duration,
          });

          if (notedata.dotted) {
            Dot.buildAndAttach([staveNote], { all: true });
          }

          if (notedata.accidentals) {
            notedata.accidentals.forEach((acc, i) => {
              if (acc) staveNote.addModifier(new Accidental(acc), i);
            });
          }
          return staveNote;
            }
      );

      const notes = measures.flat(); // Flatten the array of arrays
      const numBeats = parseInt(scoreData.timeSignature.split('/')[0], 10);
      const beatValue = parseInt(scoreData.timeSignature.split('/')[1], 10);
    
      const voice = new Voice({ numBeats: numBeats, beatValue: beatValue });
      voice.addTickables(notes);
      new Formatter().joinVoices([voice]).formatToStave([voice], stave);
      voice.draw(context, stave);
    });
  }, []);

  // function to parse the note data and play the sound (ej: c/4 becomes C4)
  // if the note have an accidental, it should be added to the note (ej: c#/4 becomes C#4)
  const parseNote = (noteData: NoteData) => {
    return noteData.chord.map((note, index) => {
      const [pitch, octave] = note.split('/');
      const accidental = noteData.accidentals ? noteData.accidentals[index] : null;
      return pitch.toUpperCase() + (accidental ? accidental : '') + octave; // Convert to C4, D4, C#4, etc.
    });
  };

  //function to parse the duration (ej: "q" becomes "4n"
  const parseDuration = (duration: string, dotted: boolean) => {
    let newDuration = duration;
    switch (duration) {
      case 'q':
        newDuration = '4n';
        break;
      case 'h':
        newDuration = '2n';
        break;
      case '8':
        newDuration = '8n';
        break;
      case'16':
        newDuration = '16n';
        break;
      case 'w':
        newDuration = '1n';
        break;
        // silent notes
      case 'hr':
        newDuration = '2n';
        break;
      case '8r':
        newDuration = '8n';
        break;
      case '16r':
        newDuration = '16n';
        break;
      case 'qr':
        newDuration = '4n';
        break;
      case 'wr':
        newDuration = '1n';
        break;
      default: 
        newDuration = duration; // Keep original if no match
    }
    if (dotted) {
      newDuration += '.'; // Add dotted if applicable
    }

    return newDuration;
  }

  const playStaff = async () => {
   await Tone.start();
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    
  let now = Tone.now();
  let currentTime = now;
    scoreData.measures.forEach((measure) => {
      measure.forEach((noteData) => {
          const note = parseNote(noteData);
          const duration = parseDuration(noteData.duration, noteData.dotted || false);

          //silent notes
          if (!noteData.duration.includes('r')) {
          synth.triggerAttackRelease(note, duration, currentTime);
        }
        currentTime += Tone.Time(duration).toSeconds();

    
    });

  })
};
  return (
  <div>
    <div ref={containerRef}></div>
    <button onClick={playStaff}>Play Staff</button>
  </div>
  );
  
}
