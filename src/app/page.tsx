import Staff from "@/components/staff";
import styles from "./page.module.css";
import Note from "@/components/note"

export default function Home() {
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

      <Staff />
      

    </div>
  );
}
