import React from "react";
import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {Paper} from '@mui/material'
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';


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
      <Paper className="microphone-wrapper" variant="elevation" elevation={0}>
        <div className="icon-container">
          {!isListening && <button className="icon-button" title="Start Recording" ref={microphoneRef} onClick={handleUserInput}><KeyboardVoiceOutlinedIcon/></button>}
          
          {isListening && 
            <button title="Stop" className="icon-button" ref={microphoneRef} onClick={stopRecording} variant="contained">
              <StopCircleIcon/>
            </button>
          }
          {!isListening && transcript && 
            <button title="Delete" className="icon-button" onClick={handleReset}>
              <DeleteForeverOutlinedIcon/>
            </button>
          }
          {!isListening && transcript && 
            <button title="Download" className="icon-button" onClick={downloadFile}>
              <FileDownloadOutlinedIcon/>
            </button>
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
