"use client";
import { useEffect, useRef, useState } from "react";
import abcjs from "abcjs";

export default function InstrumentPage() {
  const paperRef = useRef<HTMLDivElement | null>(null);
  const synthRef = useRef<any>(null);
  const [abcText, setAbcText] = useState(`
X: 1
T: Cooley's
M: 4/4
L: 1/8
K: Emin
|:D2|"Em"EBBA B2 EB|
    ~B2 AB dBAG|
    "D"FDAD BDAD|
    FDAD dAFD|
"Em"EBBA B2 EB|
    B2 AB defg|
    "D"afe^c dBAF|
    "Em"DEFD E2:|
`);

  const renderMusic = () => {
    if (paperRef.current) {
      // Renderiza partitura
      abcjs.renderAbc(paperRef.current, abcText, {
        responsive: "resize",
        scale: 0.8, // 🔹 más pequeña
      });

      // Configura el reproductor
      const visualObj = abcjs.renderAbc(paperRef.current, abcText)[0];
      const synth = new abcjs.synth.CreateSynth();
      synthRef.current = synth;

      synth
        .init({
          visualObj,
          options: { soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/" },
        })
        .then(() => synth.prime())
        .catch((err) => console.warn("Synth error:", err));
        
            }
    
  };

  useEffect(() => {
    renderMusic();
  }, []);

  const handlePlay = async () => {
    const synth = synthRef.current;
    if (synth) {
      await synth.prime();
      synth.start();
    }
  };

  const handleStop =  () => {
    synthRef.current?.stop();
  };

async function getMidi() {
  try {
    const midiHTML = abcjs.synth.getMidiFile(abcText)[0];
  const temp = document.createElement("div");
  temp.innerHTML = midiHTML;

    const midiHref = temp.querySelector("a")?.getAttribute("href");
    console.log("MIDI href:", midiHref);

    // ✅ fetch maneja automáticamente los data: URIs
    const response = await fetch(midiHref!);
    const arrayBuffer = await response.arrayBuffer();

    // ahora puedes convertirlo a Uint8Array para enviarlo a tu backend
    const midiBytes = new Uint8Array(arrayBuffer);
    console.log("Bytes del MIDI:", midiBytes.length);

    const midiBlob = new Blob([midiBytes], { type: "audio/midi" });
const formData = new FormData();
formData.append("file", midiBlob, "temp.mid");

await fetch("http://172.25.198.250:8000/upload-midi", {
  method: "POST",
  body: formData,
});
  } catch (err) {
    console.error("Error procesando MIDI:", err);
  }
}




  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">🎶 Compose Your Music</h1>

      {/* Editor de notación ABC */}
      <textarea
        className="w-full h-40 p-2 border rounded-md font-mono text-sm"
        value={abcText}
        onChange={(e) => setAbcText(e.target.value)}
      />

      {/* Botones */}
      <div className="space-x-2">
        <button
          onClick={renderMusic}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Renderizar
        </button>
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          ▶ Reproducir
        </button>
        <button
          onClick={handleStop}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          ⏹ Detener
        </button>
        <button
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        onClick={ getMidi       }>
          Midi
        </button>
      </div>

      {/* Contenedor de la partitura */}
      <div
        ref={paperRef}
        className="border rounded-lg shadow p-4 bg-white max-w-2xl mx-auto"
      ></div>
    </div>
  );
}
