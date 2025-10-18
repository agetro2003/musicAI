"use client";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

import { socket } from "@/socket";
import {v4 as uuidv4 } from "uuid";
import PercussionStaff from "@/components/percussionStaff";
import { StaffData } from "@/types/staffData";
import { Measure } from "@/types/note";

export default function PercusionPage() {

    const [qrValue, setQrValue] = useState("");

    const [roomId, setRoomId] = useState("");

    const [connection, setConnection] = useState(false);

        const scoreData1: StaffData = {
          clef: "percussion",
          timeSignature: "4/4",
          keySignature: "C",
          measures: [
            [
              {
                chord: ["b/4"],
                duration: "q",
                dotted: false,
              },
              {
                chord: ["b/4"],
                duration: "8",
                dotted: false,
              },
              {
                chord: ["b/4"],
                duration: "8",
                dotted: false,
              },
              {
                chord: ["b/4"],
                duration: "q",
                dotted: false,
              },
               {
                chord: ["b/4"],
                duration: "8",
                dotted: false,
              },
              {
                chord: ["b/4"],
                duration: "8",
                dotted: false,
              },
            ],
            [
              {
                chord: ["b/4"],
                duration: "8",
                dotted: false,
              },
              {
                chord: ["b/4"],
                duration: "8",
                dotted: false,
              },
              {
                chord: ["b/4"],
                duration: "qr",
                dotted: false,
              },
              {
                chord: ["b/4"],
                duration: "q",
                dotted: false,
              },
               {
                chord: ["b/4"],
                duration: "8",
                dotted: false,
              },
              {
                chord: ["b/4"],
                duration: "8",
                dotted: false,
              },
            ]
          ]
        }
    
  const scoreDataTest2: StaffData = {
          clef: "percussion",
          timeSignature: "4/4",
          keySignature: "C",
          measures: [
            
          ]
        }
  const [scoreData, setScoreData] = useState<StaffData>(scoreData1);
  const [scoreData2, setScoreData2] = useState<StaffData>(scoreDataTest2);

  /*const addMeasureToStaff = (staffData: StaffData, setStaffData: React.Dispatch<React.SetStateAction<StaffData>>, measure: Measure) => {
      setStaffData({
          ...staffData,
          measures: [...staffData.measures, measure]
      });
  }*/

  const addMeasureToStaff = (
  setStaffData: React.Dispatch<React.SetStateAction<StaffData>>,
  measure: Measure
) => {
  setStaffData(prevStaffData => ({
    ...prevStaffData,
    measures: [...prevStaffData.measures, measure]
  }));
};

    useEffect(() => {
      
        const id = uuidv4();
        setRoomId(id);
        socket.emit("join-room", id);
        setQrValue(`${window.location.origin}/compose?roomId=${id}`);
        socket.on("message", (msg: boolean) => {
            setConnection(msg);
        });

        socket.on("new-measure", (measure: Measure) => {
  console.log("New measure received:", measure);
  addMeasureToStaff(setScoreData2, measure);
});

        return () => {
            socket.off("message");
        };
    }, []);

 
    
    return (
        <div>
        <h1>Compose Your Music</h1>
        <p>Scan the QR to start creating your melody.</p>
        {(qrValue && !connection) && (
            <QRCodeSVG value={qrValue} size={256}/>
        )}

        <PercussionStaff scoreData={scoreData} />
        <PercussionStaff scoreData={scoreData2} />
        </div>
    );
    }