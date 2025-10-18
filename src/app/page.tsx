import Staff from "@/components/staff";
import styles from "./page.module.css";
import Note from "@/components/note"
import { StaffData } from "@/types/staffData";

export default function Home() {

  const scoreData: StaffData = {
    clef: "treble",
    timeSignature: "4/4",
    keySignature: "Em",
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
  

  return (
    <div >
      <Note 
      note="C4"
      duration="4n"
      buttonText="Do"
      />
      <Note 
      note="C#4"
      duration="4n"
      buttonText="Do#"
      />
      <Note
      note="D4"
      duration="4n"
      buttonText="Re"
      />
     
       <Note
      note="Eb4"
      duration="4n"
      buttonText="Mib"
      />
      <Note
      note="E4"
      duration="4n"
      buttonText="Mi"
      />
      <Note
      note="F4"
      duration="4n"
      buttonText="Fa"
      />
      <Note
      note="G4"
      duration="4n"
      buttonText="Sol"
      />
      <Note
      note="A4"
      duration="4n"
      buttonText="La"
      />
      <Note
      note="B4"
      duration="4n"
      buttonText="Si"
      />
      <Note
      note="C5"
      duration="4n"
      buttonText="Do"
      />
      <Note
      note="D5"
      duration="4n"
      buttonText="Re"
      />
      <Note
      note="E5"
      duration="4n"
      buttonText="Mi"
      />
      <Note
      note="F5"
      duration="4n"
      buttonText="Fa"

      />
      <Note
      note="G5"
      duration="4n"
      buttonText="Sol"
      />
      <Note
      note="A5"
      duration="4n"
      buttonText="La"
      />
      <Note
      note="B5"
      duration="4n."
      buttonText="Si"
      />

      <Staff scoreData={scoreData} />

    </div>
  );
}
