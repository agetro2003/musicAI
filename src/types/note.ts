import { Note } from "vexflow";

export type NoteData = {
    chord: string[]; // Array of note keys (e.g., ["c/4", "d/4"])
    duration: string; // Duration of the note (e.g., "8", "hd", "8r")
    dotted?: boolean; // Optional flag for dotted notes
    accidentals?: ("#"| "b" | "n" | "##" | "bb" | null)[]; // Optional accidental 
}



export type Measure = NoteData[];


export type Measures = Measure[]; // Array of Note objects

