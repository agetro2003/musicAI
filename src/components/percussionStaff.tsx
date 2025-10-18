import { StaffData } from "@/types/staffData";
import { useEffect, useRef } from "react";
import { Dot, Formatter, Renderer, Stave, StaveNote, Voice } from "vexflow";
import * as Tone from "tone";
import { parseDuration } from "@/utils/parseDuration";

export default function PercussionStaff( 
  { scoreData }: { scoreData: StaffData }
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const noteToSample: Record<string, string> = {
  "a/4": "hihat",
  "b/4": "drum",
  "g/4": "drum"
};

    
const measureSize = 250; // Width of each measure
const measureYSpacing = 100; // Vertical spacing between measures
const durationToBeats = (duration: string): number => {
  switch (duration) {
    case "1n": return 4;    // redonda = 4 negras
    case "2n": return 2;    // blanca = 2 negras
    case "4n": return 1;    // negra = 1 negra
    case "8n": return 0.5;  // corchea = 0.5 negra
    case "16n": return 0.25; // semicorchea = 0.25 negra
    default: return 1;      // por defecto, negra
  }
}
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.innerHTML = "";
        }
        const renderer = new Renderer(
            containerRef.current!,
            Renderer.Backends.SVG
        );
        const context = renderer.getContext();
        const numMeasures = scoreData.measures.length;
        const width = Math.min(numMeasures, 6) * measureSize;
        const height = Math.ceil(numMeasures / 6) * measureYSpacing + 100; // 100 for padding
        renderer.resize(width, height);
       
       scoreData.measures.forEach((measure, index) => {
        const stave = new Stave(10 + (index % 6) * measureSize, 40 + Math.floor(index / 6) * measureYSpacing, measureSize);
        stave.setConfigForLines([
            { visible: false },
            { visible: false },
            { visible: true }, // Line 3 (centered)
            { visible: false },
            { visible: false }
        ]);

        if (index === 0 ) {
          stave.addClef(scoreData.clef);
        }
        stave.setContext(context).draw();

        const measures = measure.map(noteData => {
          const duration = noteData.duration + (noteData.dotted ? "d" : "");
          const staveNote =new StaveNote({
            keys: noteData.chord,
            duration: duration
          });
          if (noteData.dotted) {
            Dot.buildAndAttach([staveNote], { all: true });
          }
          return staveNote;
        });


      const notes = measures.flat(); // Flatten the array of arrays
      const numBeats = parseInt(scoreData.timeSignature.split('/')[0], 10);
      const beatValue = parseInt(scoreData.timeSignature.split('/')[1], 10);
    
      const voice = new Voice({ numBeats: numBeats, beatValue: beatValue });
      voice.addTickables(notes);
      new Formatter().joinVoices([voice]).formatToStave([voice], stave);
      voice.draw(context, stave);
       });

    }, [scoreData]);
        
    const playStaff = async (staffData: StaffData, loop: boolean) => {
    await Tone.start();
    const player = new Tone.Players({
      urls: {
        "drum": "/drum.wav",
      },
    }).toDestination();
    await Tone.loaded();
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    transport.position = 0;

    let currentBeat = 0; // en negras

staffData.measures.forEach((measure) => {
  measure.forEach((noteData) => {
    const noteDuration = parseDuration(noteData.duration, noteData.dotted);
    const beats = durationToBeats(noteDuration);
      if (noteData.duration.endsWith("r")) {
      currentBeat += beats;
      return; // saltar al siguiente
    }
    const noteSample = noteToSample[noteData.chord[0]];
    if (noteSample) {
      Tone.getTransport().schedule((time) => {
        player.player(noteSample).start(time);
      }, `${Math.floor(currentBeat / 4)}:${currentBeat % 4}:0`);
    }
    currentBeat += beats;
  });
});
transport.loop = loop;
transport.loopEnd = `${Math.floor(currentBeat / 4)}:${currentBeat % 4}:0`;

transport.start();
    };

    const stopStaff = () => {
  const transport = Tone.getTransport();
  transport.stop();   // Detiene la reproducción
  transport.cancel(); // Limpia eventos programados
};


    return (
        <div>
            <div ref={containerRef}></div>
        <button onClick={() => playStaff(scoreData, false)}>
  ▶ Reproducir ritmo
</button>
<button onClick={() => playStaff(scoreData, true)}>
  🔁 Reproducir en bucle
</button>
<button onClick={stopStaff}>
  ⏹ Detener
</button>
        </div>
    );
}