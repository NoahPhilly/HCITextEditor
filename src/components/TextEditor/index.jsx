import React from "react";
import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {Button, Paper} from '@mui/material'
import { red } from "@mui/material/colors";


const TextEditor = () => {
   
  const commands = [
    {
      command: "reset",
      callback: () => {
        handleReset();
      }
    },
    {
      command: "download file",
      callback: () => {
        downloadFile();
      }
    }
  ];
  
   const { transcript, resetTranscript } = useSpeechRecognition({ commands });
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

    const downloadFile = async () => {

      let inputtedName = prompt("Input a file-name!");

      if (inputtedName != null && inputtedName.trim().length > 1){
        const link = document.createElement("a");
        const content = concurrentText.length === 0 ? transcript : concurrentText;
        const generatedFile = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(generatedFile);
        link.download = inputtedName;
        link.click();
        URL.revokeObjectURL(link.href);
    } else if (inputtedName === null) {
       return;
    } else {
      alert('You cannot have an empty file name!');
    }
 };
    
    
    return (
      <Paper className="microphone-wrapper" variant="outlined" elevation={0}>
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
          {!isListening && transcript && 
            <Button className="Button" variant="contained" onClick={downloadFile}>
              Download Text
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
        
      </Paper>
    );
};

export default TextEditor;
