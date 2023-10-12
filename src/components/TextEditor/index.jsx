import React from "react";
import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {Button} from '@mui/material'
import commands from "../../utils/commands";
import { red } from "@mui/material/colors";



const TextEditor = () => {
   const editorCommands = commands;
   const { transcript, resetTranscript } = useSpeechRecognition({ editorCommands });
   const [isListening, setIsListening] = useState(false);
   const [concurrentText, setConcurrentText] = useState('');
   const microphoneRef = useRef(null);
   

   const editorStyle = {
      width: '100%',
      height: '100vw',
      fontSize: '50px'
      
   };

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      return (
        <div className="microphone-container">
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
      setConcurrentText('');
    };
    return (
      <div className="microphone-wrapper">
        <div className="mircophone-container">
          <div
            className="microphone-icon-container"
            ref={microphoneRef}
            onClick={handleUserInput}
          >
            {!isListening && <Button className="Button" variant="contained">Start Transcription</Button>}
          </div>
          {isListening && 
            <Button className="Button" onClick={stopRecording} variant="contained" sx={{color: red}}>
              Stop
            </Button>
          }
          {!isListening && transcript && 
            <Button className="Button" variant="contained" onClick={handleReset}>
              Reset
            </Button>
          }
        </div>
        
          <div className="microphone-result-container">
            <textarea 
              style={editorStyle} 
              className="microphone-result-text" 
              value={concurrentText.length === 0 ? transcript : concurrentText} 
              onChange={(e) => setConcurrentText(e.target.value)}>
            </textarea>
          </div>
        
      </div>
    );
};

export default TextEditor;
