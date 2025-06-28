import './CodeEditor.css';
import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from 'axios';
import Editor from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from 'react-responsive';
import { Button } from "@/components/ui/button"
import { ButtonLoading } from '../ButtonLoading/ButtonLoading';
import { extensions } from '@/constants/contants';
import type { language } from '@/constants/contants';
import { useCode } from '@/contexts/CodeProvider.tsx';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

type CodeEditorProps = {
    lang: language;
}

function CodeEditor(props: CodeEditorProps) {
    let { lang } = props;
    const { codeMap, setCodeMap } = useCode();
    const [currTab, setCurrTab] = useState("editor");
    const isBigScreen = useMediaQuery({ minWidth: 1024 });
    const [isLoading, setIsLoading] = useState(false);
    const clearBtnRef = useRef<HTMLButtonElement | null>(null);
    const tabBtnRef = useRef<HTMLButtonElement | null>(null);

    function removeComments(code: string) {
        return code
            // Remove multi-line comments: /* ... */
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove single-line comments: // and #
            .replace(/^\s*(\/\/|#).*$/gm, '')
            // Trim extra lines
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
    }

    useEffect(() => {
        setCurrTab("editor");
    }, [lang])


    const handleRun = async () => {
        let intervalId: null | NodeJS.Timeout = null;
        try {
            let backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;
            setIsLoading(true);
            const response = await axios.post(`${backendDomain}/execute`, { code: codeMap[lang].value || '', extension: extensions[lang!] });
            intervalId = setInterval(async () => {
                let jobDetails = await axios.get(`${backendDomain}/job/${response.data.id}`);
                if (jobDetails.data.status === "COMPLETED") {
                    setIsLoading(false);
                    let newCodeMap = structuredClone(codeMap);
                    newCodeMap[lang].output = jobDetails.data.output || '';
                    setCodeMap(newCodeMap);
                    clearInterval(intervalId!);
                    !isBigScreen && setCurrTab("output");
                } else if (jobDetails.data.status === "FAILED") {
                    setIsLoading(false);
                    let newCodeMap = structuredClone(codeMap);
                    newCodeMap[lang].output = jobDetails.data.output || '';
                    setCodeMap(newCodeMap);
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
        let newCodeMap = structuredClone(codeMap);
        newCodeMap[lang].value = value || '';
        setCodeMap(newCodeMap);
    }

    const handleClear = () => {
        let newCodeMap = structuredClone(codeMap);
        newCodeMap[lang].output = '';
        setCodeMap(newCodeMap);
    }

    return (
        <div className='h-full w-full'>

            {!isBigScreen ?
                <section className='h-full lg:hidden'>
                    <section style={{ height: 'calc(100vh - 50px)' }}>
                        <Tabs className="h-full w-full" value={currTab} onValueChange={(value) => setCurrTab(value)}>
                            <div className='flex items-center justify-between px-2'>
                                <TabsList>
                                    <TabsTrigger ref={tabBtnRef} value="editor" className="cursor-pointer">index.{extensions[lang!]}</TabsTrigger>
                                    <TabsTrigger value="output" className="cursor-pointer">Output</TabsTrigger>
                                </TabsList>
                                <div className="ml-auto">
                                    {isLoading ?
                                        <ButtonLoading /> :
                                        <Button disabled={removeComments(codeMap[lang].value) === ''} className="hover:cursor-pointer" size="sm" variant="outline" onClick={handleRun}>Run</Button>
                                    }
                                </div>
                            </div>

                            <TabsContent value="editor">
                                <Editor
                                    options={{
                                        lineNumbers: "off",
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        smoothScrolling: true,
                                        contextmenu: false,
                                        wordWrap: "off"
                                    }}
                                    theme='vs-dark'
                                    height="100%"
                                    language={lang || 'javascript'}
                                    value={codeMap[lang].value || ''}
                                    onChange={handleEditorChange}
                                    onMount={(editor, monaco) => {
                                        editor.addCommand(monaco.KeyCode.Escape, () => {
                                            tabBtnRef.current?.focus();
                                        });
                                    }}
                                />
                            </TabsContent>
                            <TabsContent value="output">
                                <pre style={{ whiteSpace: "pre-wrap", tabSize: 4, paddingInline: "10px" }}>
                                    {codeMap[lang].output}
                                </pre>
                            </TabsContent>
                        </Tabs>
                    </section>

                </section>
                :
                <section className='hidden h-full lg:flex'>

                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={60}>
                            <section>
                                <header className='flex h-[40px] px-4 border items-center'>
                                    <span className='font-medium text-gray-900'>index.{extensions[lang]}</span>
                                    <div className='ms-auto'>
                                        {isLoading ? <ButtonLoading /> : <Button disabled={removeComments(codeMap[lang].value) === ''} className="hover:cursor-pointer" size="sm" variant="outline" onClick={handleRun}>Run</Button>}
                                    </div>
                                </header>
                                <section style={{ height: 'calc(100vh - 90px)' }}>
                                    <Editor
                                        options={{ scrollBeyondLastLine: false, smoothScrolling: true, contextmenu: false, wordWrap: "off" }}
                                        theme='vs-dark'
                                        height="100%"
                                        language={lang || 'javascript'}
                                        value={codeMap[lang].value || ''}
                                        onChange={handleEditorChange}
                                        onMount={(editor, monaco) => {
                                            editor.addCommand(monaco.KeyCode.Escape, () => {
                                                clearBtnRef.current?.focus()
                                            });
                                        }}
                                    />
                                </section>
                            </section>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={40}>
                            <section>
                                <header className='flex h-[40px] px-4 border items-center'>
                                    <span className='font-medium text-gray-900'>Output</span>
                                    <div className='ms-auto'>
                                        <Button ref={clearBtnRef} className="hover:cursor-pointer" size="sm" variant="outline" onClick={handleClear}>Clear</Button>
                                    </div>
                                </header>
                                <section style={{ height: 'calc(100vh - 90px)' }}>
                                    <pre style={{ whiteSpace: "pre-wrap", tabSize: 4, paddingInline: "10px" }}>
                                        {codeMap[lang].output}
                                    </pre>
                                </section>
                            </section>
                        </ResizablePanel>
                    </ResizablePanelGroup>



                </section>
            }
        </div>
    )
}

export default CodeEditor