import { createContext, useContext, useState, type ReactNode } from 'react';
import { codes } from '../constants/contants.ts';

type CodeProviderProps = {
    children: ReactNode;
}

type CodeContext = {
    codeMap: typeof codes;
    setCodeMap: React.Dispatch<React.SetStateAction<typeof codes>>;
}


export const Code = createContext<CodeContext | undefined>(undefined)

function CodeProvider(props: CodeProviderProps) {
    const [codeMap, setCodeMap] = useState(codes)
    return (
        <Code.Provider value={{ codeMap: codeMap, setCodeMap: setCodeMap }}>
            {props.children}
        </Code.Provider>
    )
}

const useCode = () => {
    const context = useContext(Code);
    if (!context) {
        throw new Error('useCode must be used within a CodeProvider');
    }
    return context;
};

export default CodeProvider;
export { useCode }