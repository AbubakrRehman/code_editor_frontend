import React from 'react';
import './CodeEditor.css';
import { useState } from "react";
import axios from 'axios';
import Editor from '@monaco-editor/react';

function CodeEditor() {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");

    const handleRun = async () => {
        try {
            const response = await axios.post('http://localhost:3000/execute', { code, extension: 'js' });
            setOutput(response.data.output);
        } catch (error) {

        }
    }

    const handleEditorChange = (value) => {
        setCode(value);
    }

    return (
        <div>
            <section className="code-editor-header">
                <div>Code Editor</div>
                <button className='run' onClick={handleRun}>Run</button>
            </section>
            <section className="code-editor-grid">
                {/* <textarea
                    placeholder='Enter code here.....'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                /> */}
                <Editor
                    options={{  scrollBeyondLastLine: false,smoothScrolling: true, contextmenu: false, wordWrap: "off" }}
                    theme='vs-dark'
                    height="90vh"
                    defaultLanguage="javascript"
                    defaultValue={code}
                    onChange={handleEditorChange}
                />
                <div>{output}</div>
            </section>
        </div>
    )
}

export default CodeEditor