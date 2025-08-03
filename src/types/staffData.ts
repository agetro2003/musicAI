import { Measures } from "./note";

export type StaffData = {
    clef: string; // Clef type (e.g., "treble", "bass")
    timeSignature: string; // Time signature (e.g., "4/4", "3/4")
    keySignature: string; // Key signature (e.g., "C", "G", "F")
    measures: Measures; // Array of measures, each containing an array of chords
}
