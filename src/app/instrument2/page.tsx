"use client";
import { useEffect, useRef, useState } from "react";
import abcjs from "abcjs";

export default function Instrument2Page() {
  const paperRef = useRef<HTMLDivElement | null>(null);
  const synthRef = useRef<any>(null);
  const [abcText, setAbcText] = useState(`
X: 1
T: Cooley's
M: 4/4
L: 1/8
K: Emin
|D2|"Em"EBBA B2 EB|
    ~B2 AB dBAG|
    "D"FDAD BDAD|
    FDAD dAFD|
"Em"EBBA B2 EB|
    B2 AB defg|
    "D"afe^c dBAF|
    "Em"DEFD E2|
`);
  const [instrument, setInstrument] = useState(0); // Default: Acoustic Grand Piano

  const [bars, setBars] = useState<number>(0);


  const renderMusic = () => {
    if (paperRef.current) {

      const abcWithInstrument = updateInstrumentInABC(abcText, instrument);

      // Renderiza partitura
      abcjs.renderAbc(paperRef.current, abcWithInstrument, {
        responsive: "resize",
        scale: 0.8, // 🔹 más pequeña
      });

      // Configura el reproductor
      const visualObj = abcjs.renderAbc(paperRef.current, abcWithInstrument)[0];
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

    const updateInstrumentInABC = (text: string, programNumber: number) => {
    const midiLine = `%%MIDI program ${programNumber}`;

    if (text.includes("%%MIDI program"))
      return text.replace(/%%MIDI program \d+/, midiLine);

    // Insertarlo después de la línea K:
    return text.replace(/K:[^\n]+/, (match) => `${match}\n${midiLine}`);
  };

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

async function getNewAbc() {
  try {
const body = {
  abcText: abcText,
  bars: bars
}

const res = await fetch("http://172.25.198.250:8000/upload-abc", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
  
});

    if (!res.ok) throw new Error("Error en la petición");

    // Aquí leemos la respuesta JSON
    const data = await res.json();

    const newAbc = data.abc

    setAbcText(newAbc)

    
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
        onClick={ getNewAbc       }>
          AI
        </button>
          <label className="block font-semibold">Instrumento:</label>
      <select
        className="border p-2 rounded-md"
        value={instrument}
        onChange={(e) => {
          setInstrument(Number(e.target.value));
          renderMusic();
        }}
      >
        <option value={0}>🎹 Piano Acústico</option>
        <option value={24}>🎸 Guitarra Acústica</option>
        <option value={32}>🎻 Bajo</option>
        <option value={40}>🎻 Violín</option>
        <option value={41}>🎻 Viola</option>
        <option value={42}>🎻 Cello</option>
        <option value={56}>🎺 Trompeta</option>
        <option value={73}>🎤 Flauta</option>
      </select>
      <input
      className="border p-2 rounded-md"
      value={bars}
      type="number"
      onChange={(e) => {
        setBars(Number(e.target.value));
      }}
      placeholder="Numero de compaces para IA"
      ></input>
      </div>

      {/* Contenedor de la partitura */}
      <div
        ref={paperRef}
        className="border rounded-lg shadow p-4 bg-white max-w-2xl mx-auto"
      ></div>
    </div>
  );
}
