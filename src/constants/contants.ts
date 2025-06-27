const languageList = [
    { id: 1, title: 'JavaScript', key: 'javascript', logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { id: 2, title: 'Python', key: 'python', logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { id: 3, title: 'C++', key: 'cpp', logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
    { id: 4, title: 'C', key: 'c', logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
    { id: 5, title: 'Java', key: 'java', logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
]

export type language = 'javascript' | 'python' | 'cpp' | 'c' | 'java';
type code = {
    value: string,
    output: string
}

const codes: Record<language, code> = {
    javascript: {
        value: "// Press Esc to move focus to next focusable element\n// Write your Javascript code here...\n",
        output: ""
    },
    python: {
        value: "#Press Esc to move focus to next focusable element\n# Write your Python code here...\n",
        output: ""
    },
    cpp: {
        value: "//Press Esc to move focus to next focusable element\n#include <iostream>\n\nint main() {\n    // Write C++ code here\n    std::cout << \"Try quick-compile\";\n\n    return 0;\n}",
        output: ""
    },
    java: {
        value: "//Press Esc to move focus to next focusable element\n\nclass Main {\n    public static void main(String[] args) {\n      // Write Java code here\n      System.out.println(\"Try quick-compile\");\n    }\n}",
        output: ""
    },
    c: {
        value: "//Press Esc to move focus to next focusable element\n#include <stdio.h>\n\nint main() {\n    // Write C code here\n    printf(\"Try quick-compile\");\n\n    return 0;\n}",
        output: ""
    }
}


const extensions: Record<string, string> = {
    javascript: "js",
    python: "py",
    cpp: "cpp",
    c: "c",
    java: "java"
}

export { languageList, codes, extensions }