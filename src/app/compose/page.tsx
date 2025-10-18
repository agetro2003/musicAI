"use client";
import { useEffect, useRef, useState } from "react";

import { socket } from "@/socket";
import { useSearchParams } from "next/navigation";
import { Measure, NoteData } from "@/types/note";
import * as Tone from "tone";
export default function ComposePage() {
        const searchParams = useSearchParams();
        const roomId = searchParams.get("roomId") || "";
        const sendMessage = () => {
            if (roomId) {
                socket.emit("message", {
                    roomId,
                    msg: true
                });
            }
        }

        const [measure, setMeasure] = useState<Measure>([]);
        const [time, setTime] = useState<number | null>(null);
        const [prevTime, setPrevTime] = useState<number | null>(null);
        const [beats, setBeats] = useState<number>(0);
        const [testBool, setTestBool] = useState<boolean>(false);
        const [testMessage, setTestMessage] = useState<string>("");
        const beatsRef = useRef<number>(0);
        const measureRef = useRef<Measure>([]);

        // duration in ms to vexFlow note mapping. Ej: 4000 ms to w, 2000 ms to h, 1000 ms to q
        const durationMapping: { [key: number]: string } = {
            4000: "w",
            3000: "hd",
            2000: "h",
            1500: "qd",
            1000: "q",
            750: "8d",
            500: "8",
            250: "16"
        };
        // get the closer posible duration and make sure tha the sum of the duration plus the beats isn't greater than 4000
        const roundDuration = (duration: number): number => {
            const closest = Object.keys(durationMapping).reduce((prev, curr) => {
                return (Math.abs(Number(curr) - duration) < Math.abs(Number(prev) - duration) || Number(prev) + beatsRef.current > 4000) ? curr : prev;
            });
            return Number(closest);
        }

        const createNote = (duration: number, isRest: boolean = false) =>{

            let noteDuration = durationMapping[duration] || "q"; // Default to quarter note if not found
            let dotted = false;
            //check if the duration is dotted 
            if (noteDuration.endsWith("d")) {
                dotted = true;
                noteDuration = noteDuration.slice(0, -1);
            }
            if (isRest) {
                noteDuration += "r"; // Add rest indicator
            }
            const note: NoteData = {
                chord: ["b/4"],
                duration: noteDuration,
                dotted
            };
            if (beatsRef.current + duration <= 4000) {
            beatsRef.current += duration;
            setBeats((prev) => prev + duration);
            measureRef.current = [...measureRef.current, note]; // Actualiza el ref directamente
        setMeasure([...measureRef.current]); // Fuerza render
            }
        }
        

    useEffect(() => {
        if (!roomId){
            return;
        }
        socket.emit("join-room", roomId);

        sendMessage();
        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    const playSound = async() => {
        const player = new Tone.Player(
            "/drum.wav"
        ).toDestination();

        await Tone.loaded()
        player.start();
    }

    const press = () => {
        console.log("Press detected");
        if (!time) {
            setTime(Date.now());
            setTimeout(()=>{
                //let localBeats = beatsRef.current;

                if(beatsRef.current < 4000){
                    setTestMessage(`Total beats: ${beatsRef.current}`);
                    // End the last note
                    createNote(roundDuration(4000 - beatsRef.current));
                    //localBeats += roundDuration(4000 - localBeats);
                    // Fill the remaining time with rests
                    while (beatsRef.current < 4000) {
                        createNote(roundDuration(4000 - beatsRef.current), true);
                        //localBeats += roundDuration(4000 - localBeats);
                    }

                }
                setTime(null);
                setBeats(0);
                beatsRef.current = 0;
                setPrevTime(null);
                socket.emit("new-measure", { roomId, measure: measureRef.current });
                setMeasure([]);
                measureRef.current = [];
            }, 4000)
        }
        else {
            createNote(roundDuration(Date.now() - time));
            setPrevTime(time);
            setTime(Date.now());
        }
        playSound();

    }
    return (
        <div>
        <h1>Compose Your Music</h1>
        <button onClick={press}
        style={
            {
                width: "100px",
                height: "100px",
                border: "1px solid black",
                backgroundColor: "lightgray"
            }
        }
        > Tambor </button>

        <div>
            {measure.map((note, index) => (
                <div key={index}>
                    {note.chord} - {note.duration} {note.dotted && " (dotted)"}
                </div>
            ))}
        </div>
        <p> current beat: {beats}</p>
        {testBool && <p>Test boolean is true</p>}
        <p>{testMessage}</p>
        </div>
    );
}
