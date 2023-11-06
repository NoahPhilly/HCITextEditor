import React, {Component} from "react";
import TextEditor from "./components/TextEditor/index.jsx";
import Header from './components/header/header.jsx';

function App() {
  return(
    <div className="App">
      <Header />
      <div>
        <TextEditor/>
      </div>
    </div>
    )
}
export default App;