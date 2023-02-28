import { EditorView } from 'codemirror';

import {
    keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
    rectangularSelection, crosshairCursor,
    lineNumbers, highlightActiveLineGutter
} from '@codemirror/view';

import { EditorState, Compartment } from '@codemirror/state';

import {
    defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching,
    foldKeymap, indentUnit, LRLanguage, LanguageSupport
} from '@codemirror/language';

import {
    defaultKeymap, history, historyKeymap, indentWithTab
} from '@codemirror/commands';

import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import {
    autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap
} from '@codemirror/autocomplete';

import { vscodeDark } from '@uiw/codemirror-theme-vscode';


import { parser as htmlParser } from '@lezer/html';
import { parser as jsParser } from '@lezer/javascript';
import { parser as cssParser } from '@lezer/css';
import { parseMixed } from '@lezer/common';


const readOnlyCompartment = new Compartment();

const Editor = (options) => {

    // https://github.com/codemirror/basic-setup/
    const basicSetup = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, {
            fallback: true
        }),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
            ... closeBracketsKeymap,
            ... defaultKeymap,
            ... searchKeymap,
            ... historyKeymap,
            ... foldKeymap,
            ... completionKeymap,
            // custom
            indentWithTab
        ])
    ];

    const tabIndent = indentUnit.of('    ');
    const readOnly = readOnlyCompartment.of(EditorState.readOnly.of(true));

    const mixedHTMLParser = htmlParser.configure({
        wrap: parseMixed((node) => {
            if (node.name === 'StyleText') {
                return {
                    parser: cssParser
                };
            }

            if (node.name === 'ScriptText') {
                return {
                    parser: jsParser
                };
            }

            return null;
        })
    });

    const mixedHTML = LRLanguage.define({
        parser: mixedHTMLParser
    });

    const vue = () => {
        return new LanguageSupport(mixedHTML);
    };

    return new EditorView({
        parent: options.container,
        doc: options.content,
        indentUnit: 4,
        indentWithTabs: false,
        extensions: [
            basicSetup,

            tabIndent,
            readOnly,

            vue(),
            vscodeDark
        ]
    });

};

export default Editor;

