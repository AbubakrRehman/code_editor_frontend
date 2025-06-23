import React from 'react';
import './CodeEditor.css';
import { useState } from "react";
import axios, { AxiosError } from 'axios';
import Editor from '@monaco-editor/react';
import { Code } from 'lucide-react';
import CodeTabs from '../CodeTabs/Tabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from 'react-responsive';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '../ButtonLoading/ButtonLoading';

function CodeEditor() {
    const [code, setCode] = useState<string | undefined>("");
    const [output, setOutput] = useState("");
    const [currTab, setCurrTab] = useState("editor");
    const isBigScreen = useMediaQuery({ minWidth: 768 });
    const [isLoading, setIsLoading] = useState(false);

    const handleRun = async () => {
        let intervalId: null | NodeJS.Timeout = null;
        try {
            let backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;
            setIsLoading(true);
            const response = await axios.post(`${backendDomain}/execute`, { code, extension: 'js' });
            intervalId = setInterval(async () => {
                let jobDetails = await axios.get(`${backendDomain}/job/${response.data.id}`);
                if (jobDetails.data.status === "COMPLETED") {
                    setIsLoading(false);
                    setOutput(jobDetails.data.output);
                    clearInterval(intervalId!);
                    !isBigScreen && setCurrTab("output");
                } else if (jobDetails.data.status === "FAILED") {
                    // setOutput(jobDetails.data.output);
                    setIsLoading(false);
                    clearInterval(intervalId!);
                }
            }, 2000);

        } catch (error) {
            setIsLoading(false);
            if (axios.isAxiosError(error)) {
                if (error.response?.data.errorCode === 1003)
                    clearInterval(intervalId!);
            }
        }
    }

    const handleEditorChange = (value: string | undefined) => {
        setCode(value);
    }

    return (
        <div className='h-[100vh] flex flex-col justify-between'>
            <section className="code-editor-header">
                <div>Code Editor</div>
                {isLoading ? <ButtonLoading /> : <Button variant="outline" onClick={handleRun}>Run</Button>}
            </section>

            <section className='flex flex-grow'>
                <Tabs defaultValue="editor" className={!isBigScreen ? 'w-[100%]' : 'w-[50%]'} value={!isBigScreen ? currTab : "editor"} onValueChange={(value) => setCurrTab(value)}>
                    <TabsList className={isBigScreen ? 'hidden' : ''}>
                        <TabsTrigger value="editor" className="cursor-pointer" disabled={isBigScreen}>index.js</TabsTrigger>
                        <TabsTrigger value="output" className="cursor-pointer" disabled={isBigScreen}>Output</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor">
                        <Editor
                            options={{ scrollBeyondLastLine: false, smoothScrolling: true, contextmenu: false, wordWrap: "off" }}
                            theme='vs-dark'
                            height="100%"
                            defaultLanguage="javascript"
                            defaultValue={code}
                            onChange={handleEditorChange}
                        />
                    </TabsContent>
                    <TabsContent value="output">
                        <pre style={{ whiteSpace: "pre-wrap", tabSize: 4, paddingInline: "10px" }}>
                            {output}
                        </pre>
                    </TabsContent>
                </Tabs>

                <section className={!isBigScreen ? 'hidden' : 'flex'}>
                    <pre style={{ whiteSpace: "pre-wrap", tabSize: 4, paddingInline: "10px" }}>
                        {output}
                    </pre>
                </section>
            </section>
        </div>
    )
}

export default CodeEditor