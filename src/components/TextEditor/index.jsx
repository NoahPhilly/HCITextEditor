import React from "react";
import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import {Button} from '@mui/material'
import commands from "../../utils/commands";



const TextEditor = () => {
   const editorCommands = commands;
   const { transcript, resetTranscript } = useSpeechRecognition({ editorCommands });
   const [isListening, setIsListening] = useState(false);
   const microphoneRef = useRef(null);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      return (
        <div className="mircophone-container">
          Please use Google Chrome to use this appliction!
        </div>
      );
    }
    const handleUserInput = () => {
      setIsListening(true);
      microphoneRef.current.classList.add("listening");
      SpeechRecognition.startListening({
        continuous: true,
      });
    };
    const stopRecording = () => {
      setIsListening(false);
      microphoneRef.current.classList.remove("listening");
      SpeechRecognition.stopListening();
    };
    const handleReset = () => {
      stopRecording();
      resetTranscript();
    };
    return (
      <div className="microphone-wrapper">
        <div className="mircophone-container">
          <div
            className="microphone-icon-container"
            ref={microphoneRef}
            onClick={handleUserInput}
          >
            <img src={AddIcCallIcon} />
          </div>
          <div className="microphone-status">
            {isListening ? "Writing from Speech Input!" : "Click to start editor!"}
          </div>
          {isListening && 
            <Button className="microphone-stop btn" onClick={stopRecording}>
              Stop
            </Button>
          }
          {!isListening && transcript && 
            <Button className="microphone-reset btn" onClick={handleReset}>
              Reset
            </Button>
          }
        </div>
        {transcript && (
          <div className="microphone-result-container">
            <TextareaAutosize className="microphone-result-text" value={transcript}></TextareaAutosize>
          </div>
        )}
      </div>
    );
};

export default TextEditor;
