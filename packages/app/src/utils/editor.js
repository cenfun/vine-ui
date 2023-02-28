import { EditorView } from 'codemirror';

import {
    keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
    rectangularSelection, crosshairCursor,
    lineNumbers, highlightActiveLineGutter
} from '@codemirror/view';

import { EditorState, Compartment } from '@codemirror/state';

import {
    defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching,
    foldGutter, foldKeymap, indentUnit
} from '@codemirror/language';

import {
    defaultKeymap, history, historyKeymap, indentWithTab
} from '@codemirror/commands';

import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import {
    autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap,
    snippetCompletion
} from '@codemirror/autocomplete';

import {
    lintKeymap, linter, lintGutter
} from '@codemirror/lint';

import {
    javascript, javascriptLanguage, autoCloseTags, esLint
} from '@codemirror/lang-javascript';

import { vscodeDark } from '@uiw/codemirror-theme-vscode';

import { Linter } from 'eslint-linter-browserify';

const readOnlyCompartment = new Compartment();

const Editor = (options) => {

    // https://github.com/codemirror/basic-setup/
    const basicSetup = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter({
            // custom fold icon
            markerDOM: function(open) {
                const div = document.createElement('div');
                div.className = open ? 'cm-fold cm-fold-open' : 'cm-fold cm-fold-close';
                return div;
            }
        }),
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
            ... lintKeymap,
            // custom
            indentWithTab,
            {
                key: 'Ctrl-s',
                run: function(view) {
                    options.saveScript(view);
                }
            }
        ])
    ];


    const tabIndent = indentUnit.of('    ');
    const readOnly = readOnlyCompartment.of(EditorState.readOnly.of(false));

    const customSnippets = {
        run_steps: 'await run_steps([async () => {}, async () => {}], () => true);',
        send_key_press: 'await send_key_press(key, ms1, ms2);',
        send_mouse_press: 'await send_mouse_press(button, ms1, ms2);',
        get_check_info: 'const info = await get_check_info();',
        delay: 'await delay(ms);',
        log: "log('');"
    };

    const javascriptAutoComplete = javascriptLanguage.data.of({
        autocomplete: Object.keys(customSnippets).map((label) => snippetCompletion(customSnippets[label], {
            label
        }))
    });

    const esLinter = linter(esLint(new Linter(), options.EslintConfig));


    return new EditorView({
        parent: options.container,
        doc: options.content,
        indentUnit: 4,
        indentWithTabs: false,
        extensions: [
            basicSetup,

            tabIndent,
            readOnly,

            javascript(),
            javascriptAutoComplete,
            autoCloseTags,
            lintGutter(),
            esLinter,
            vscodeDark
        ]
    });

};

const setEditable = (editor, editable) => {
    // console.log(editor);
    // console.log('editable', editable);

    const readOnly = EditorState.readOnly.of(!editable);

    editor.dispatch({
        effects: readOnlyCompartment.reconfigure(readOnly)
    });

};

const setEditorScroll = (editor, line) => {
    const lineTop = line * editor.defaultLineHeight;
    const top = lineTop - editor.viewState.editorHeight * 0.5;
    console.log(top);
    if (top > 0) {
        editor.scrollDOM.scrollTop = top;
    }
};

export {
    Editor,
    setEditable,
    setEditorScroll
};

