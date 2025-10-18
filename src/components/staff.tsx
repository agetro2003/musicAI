'use client';
import { StaffData } from "@/types/staffData";
import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Voice, Dot, Accidental } from "vexflow";
import * as Tone from "tone";
import { NoteData } from "@/types/note";
import { parseDuration } from "@/utils/parseDuration";

export default function Staff(
  { scoreData }: { scoreData: StaffData }
) {
  const containerRef = useRef<HTMLDivElement>(null);

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
      voice.setStrict(false);
      voice.addTickables(notes);
      new Formatter().joinVoices([voice]).formatToStave([voice], stave);
      voice.draw(context, stave);
    });
  }, [scoreData]);

  // function to parse the note data and play the sound (ej: c/4 becomes C4)
  // if the note have an accidental, it should be added to the note (ej: c#/4 becomes C#4)
  const parseNote = (noteData: NoteData) => {
    return noteData.chord.map((note, index) => {
      const [pitch, octave] = note.split('/');
      const accidental = noteData.accidentals ? noteData.accidentals[index] : null;
      return pitch.toUpperCase() + (accidental ? accidental : '') + octave; // Convert to C4, D4, C#4, etc.
    });
  };


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
