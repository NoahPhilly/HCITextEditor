import React from 'react';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import './header.css';

const Header = () => {
    return (
        <div className="header">
            <h1>Speaking and Texting</h1>
            <div className="divider"></div>
            <div className="icon-container">
                <button title='Listen' className='icon-button'>
                    <KeyboardVoiceOutlinedIcon />
                </button>
                <button title='Download' className='icon-button'>
                    <FileDownloadOutlinedIcon />   
                </button>
                <button title='Reset' className='icon-button'>
                    <DeleteForeverOutlinedIcon />
                </button>
            </div>
            <div className="divider"></div>
        </div>
    );
}

export default Header;