import React from 'react';
import './CodeEditor.css';
import { useState } from "react";

function CodeEditor() {
    const [code, setCode] = useState("");

    const handleRun = () => {
        
    }

    return (
        <div>
            <section className="code-editor-header">
                <div>Code Editor</div>
                <button className='run' onClick={handleRun}>Run</button>
            </section>
            <section className="code-editor-grid">
                <textarea
                    placeholder='Enter code here.....'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <div>2</div>
            </section>
        </div>
    )
}

export default CodeEditor