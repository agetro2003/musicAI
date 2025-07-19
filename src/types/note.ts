
export type NoteData = {
    keys: string[]; // Array of note keys (e.g., ["c/4", "d/4"])
    duration: string; // Duration of the note (e.g., "8", "hd", "8r")
    dotted?: boolean; // Optional flag for dotted notes
    accidental?: "#"| "b" | "n" | "##" | "bb"; // Optional accidental 
}


export type Measures = NoteData[]; // Array of Note objects