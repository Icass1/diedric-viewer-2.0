import { useEffect, useState } from "react";
import { Expression } from "./expression";
import { DiedricNumber } from "./diedric/number";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";

addStyles();

export function ExpressionRender({ expression }: { expression: Expression }) {
    const [latex, setLatex] = useState(expression.text);

    let tempSliderValue = undefined;

    if (
        expression.values.length == 1 &&
        expression.values[0] instanceof DiedricNumber
    ) {
        tempSliderValue = expression.values[0].x;
    }

    const [sliderValue, setSliderValue] = useState(tempSliderValue);

    const [sliderMin, setSliderMin] = useState(Math.min(sliderValue, -100));
    const [sliderMax, setSliderMax] = useState(Math.max(sliderValue, 100));

    const [error, setError] = useState<boolean>(expression.error);
    useEffect(() => {
        expression.addEventListener("errorUpdate", (e) => {
            setError(e);
        });
    }, [expression]);

    return (
        <div
            className={
                "bg-neutral-300 p-2 rounded " + (error ? " bg-red-400 " : " ")
            }
        >
            <EditableMathField
                id="react-mathquill-styles"
                latex={latex}
                onChange={(mathField) => {
                    console.log(mathField);
                    setLatex(mathField.latex());
                    expression.text = mathField.latex();
                    if (
                        expression.values.length == 1 &&
                        expression.values[0] instanceof DiedricNumber
                    ) {
                        setSliderValue(expression.values[0].x);
                        setSliderMin(Math.min(expression.values[0].x, -100));
                        setSliderMax(Math.max(expression.values[0].x, 100));
                    }
                }}
            />

            {(sliderValue == 0 || sliderValue) && (
                <div className="flex flex-row items-center gap-x-1 px-1">
                    <StaticMathField>{sliderMin.toString()}</StaticMathField>
                    <input
                        type="range"
                        min={sliderMin}
                        max={sliderMax}
                        value={sliderValue}
                        className="w-full"
                        onChange={(e) => {
                            setSliderValue(Number(e.currentTarget.value));

                            if (
                                expression.values.length == 1 &&
                                expression.values[0] instanceof DiedricNumber
                            ) {
                                const newText = latex.replace(
                                    expression.values[0].x.toString(),
                                    e.currentTarget.value
                                );
                                setLatex(newText);
                                expression.text = newText;
                            }
                        }}
                    />
                    <StaticMathField>{sliderMax.toString()}</StaticMathField>
                </div>
            )}
        </div>
    );
}
