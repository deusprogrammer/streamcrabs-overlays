import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.speechSynthesis.onvoiceschanged = () => {
  window.maleVoice = window.speechSynthesis.getVoices().find((element) => {
      return element.name === "Microsoft David - English (United States)";
  });

  window.femaleVoice = window.speechSynthesis.getVoices().find((element) => {
      return element.name === "Microsoft Zira - English (United States)";
  });

  console.log("MAN:   " + window.maleVoice);
  console.log("WOMAN: " + window.femaleVoice);
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
