import React from "react";
import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import {Paper, Select, Button, TextField, MenuItem} from '@mui/material'
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


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

   const microphoneRef = useRef(null);
   const { transcript, resetTranscript } = useSpeechRecognition({ commands });
   const [isListening, setIsListening] = useState(false);
   const [concurrentText, setConcurrentText] = useState('');
   const [open, setIsOpen] = useState(false);
   const [fileName, setFileName] = useState('');
   const [fileType, setFileType] = useState('');

   const openDialog = () => {
      setIsOpen(true);
   };

   const closeDialog = () => {
      setIsOpen(false);
   };
   

   const editorStyle = {
      width: '99.7%',
      height: '86.7vh',
      fontSize: '50px',
      overflow: 'auto'
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

      if (fileName != null && fileName.trim().length > 1){
        const link = document.createElement("a");
        const content = concurrentText.length === 0 ? transcript : concurrentText;
        const generatedFile = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
        link.href = URL.createObjectURL(generatedFile);
        link.download = `${fileName}${fileType}`;
        link.click();
        URL.revokeObjectURL(link.href);
        closeDialog();
    } else {
       return;
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
            <button title="Download" className="icon-button" onClick={openDialog}>
              <FileDownloadOutlinedIcon/>
            </button>
          }
        </div>
        <div className="microphone-result-container">
          <textarea 
            style={editorStyle} 
            className="microphone-result-text" 
            value={concurrentText.length === 0 ? transcript : concurrentText} 
            onChange={(e) => setConcurrentText(e.target.value)}
            >
          </textarea>
        </div>
        <Dialog open={open} onClose={closeDialog}> 
          <DialogTitle textAlign={"center"}><b>Create File</b></DialogTitle>
          <DialogContent>
            <DialogContentText>Enter a file-name below!</DialogContentText>
          </DialogContent>
            <DialogActions 
            autoFocus={true} 
            sx={{justifyContent: "center"}}
            > 
              <TextField 
              required={true}
              onKeyDown={e => e.code === "Space" ? e.preventDefault() : e }
              onChange={e => setFileName(e.target.value)}
              value={fileName}
              />
              <Select>
                <MenuItem value=".docx" onClick={() => setFileType('.doc')}>.doc</MenuItem>
                <MenuItem value=".txt" onClick={() => setFileType('.txt')}>.txt</MenuItem>
              </Select>
            </DialogActions> 
            <DialogActions 
            autoFocus={true} 
            sx={ {justifyContent: "center"} }
            >
              <Button 
              onClick={closeDialog} 
              variant="contained" 
              color="error"
              >
                  Close 
              </Button> 
              <Button 
              onClick={downloadFile} 
              disabled={fileName.length <= 0}
              variant="contained" 
              color="success"> 
                  Create File
              </Button> 
            </DialogActions> 
        </Dialog> 
      </Paper>
    );
};

export default TextEditor;
