import { Component, createRef } from "react";

// Import JQuery, required for the functioning of the equation editor
// import $ from "jquery";

// Import the styles from the Mathquill editor
import "mathquill/build/mathquill.css";

import * as MathQuill from "mathquill-typescript";

MathQuill.MathQuillLoader.

const mathQuill = MathQuill.getInterface(2);

type EquationEditorProps = {
    onChange(latex: string): void;
    value: string;
    spaceBehavesLikeTab?: boolean;
    autoCommands: string;
    autoOperatorNames: string;
    onEnter?(): void;
};

/**
 * @typedef {EquationEditorProps} props
 * @prop {Function} onChange Triggered when content of the equation editor changes
 * @prop {string} value Content of the equation handler
 * @prop {boolean}[false] spaceBehavesLikeTab Whether spacebar should simulate tab behavior
 * @prop {string} autoCommands List of commands for which you only have to type the name of the
 * command with a \ in front of it. Examples: pi theta rho sum
 * @prop {string} autoOperatorNames List of operators for which you only have to type the name of the
 * operator with a \ in front of it. Examples: sin cos tan
 * @prop {Function} onEnter Triggered when enter is pressed in the equation editor
 * @extends {Component<EquationEditorProps>}
 */
class EquationEditor extends Component<EquationEditorProps> {
    element: any;
    mathField: any;
    ignoreEditEvents: number;

    // Element needs to be in the class format and thus requires a constructor. The steps that are run
    // in the constructor is to make sure that React can succesfully communicate with the equation
    // editor.
    async constructor(props: EquationEditorProps) {


        
        super(props);

        this.element = createRef();
        this.mathField = null;

        // MathJax apparently fire 2 edit events on startup.
        this.ignoreEditEvents = 2;
    }

    componentDidMount() {
        const {
            onChange,
            value,
            spaceBehavesLikeTab,
            autoCommands,
            autoOperatorNames,
            onEnter,
        } = this.props;

        const config = {
            handlers: {
                edit: () => {
                    if (this.ignoreEditEvents > 0) {
                        this.ignoreEditEvents -= 1;
                        return;
                    }
                    if (this.mathField.latex() !== value) {
                        onChange(this.mathField.latex());
                    }
                },
                enter: onEnter,
            },
            spaceBehavesLikeTab,
            autoCommands,
            autoOperatorNames,
        };

        this.mathField = mathQuill.MathField(this.element.current, config);
        this.mathField.latex(value || "");
    }

    render() {
        return (
            <span
                ref={this.element}
                style={{ border: "0px", boxShadow: "None" }}
            />
        );
    }
}

export default EquationEditor;
