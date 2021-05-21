import React from 'react';

let SpeechSynthesisTester = (props) => {
    let speechTest = () => {
        let msg = new SpeechSynthesisUtterance();
        msg.text = "This is a test of the web standard Speech Synthesis module.  If you can hear this, the test was a success.";
        window.speechSynthesis.speak(msg);
    }

    return (
        <div>
            <h1>Speech Synthesis Tester</h1>
            <table>
                <tr>
                    <td>SpeechSynthesisUtterance Supported</td>
                    <td>{SpeechSynthesisUtterance ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td>window.speechSynthesis Supported</td>
                    <td>{window.speechSynthesis ? "Yes" : "No"}</td>
                </tr>
            </table>
            <button onClick={() => {speechTest()}}>Test Speech Synthesis</button>
        </div>
    )
}

export default SpeechSynthesisTester;