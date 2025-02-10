import { useEffect, useState } from "react";
import { Expression } from "./expression";
import { DiedricNumber } from "./diedric/number";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";

addStyles();

export function ExpressionRender({
    expression,
    index,
}: {
    expression: Expression;
    index: number;
}) {
    const [latex, setLatex] = useState(expression.text);

    let tempSliderValue = undefined;

    if (
        expression.values.length == 1 &&
        expression.values[0] instanceof DiedricNumber
    ) {
        tempSliderValue = expression.values[0].x;
    }

    const [sliderValue, setSliderValue] = useState(tempSliderValue);

    const [sliderMin, setSliderMin] = useState(Math.min(sliderValue, -200));
    const [sliderMax, setSliderMax] = useState(Math.max(sliderValue, 200));

    const [error, setError] = useState<boolean>(expression.error);
    useEffect(() => {
        expression.addEventListener("errorUpdate", (e) => {
            setError(e);
        });
    }, [expression]);

    return (
        <div
            className={
                "bg-[#ffffff] border-t border-b border-[#d7d7d7] relative grid grid-cols-[2.5rem_1fr] " +
                (error && latex != "" ? " bg-red-400 " : " ")
            }
        >
            <div className="bg-[#eeeeee] h-full min-h-0 max-h-full flex flex-col items-center">
                <label className="text-xs w-full pl-1">{index + 1}</label>
                <div className="bg-red-400 w-6 h-6 rounded-full" />
            </div>
            <div className="h-full w-full p-2">
                <EditableMathField
                    id="react-mathquill-styles"
                    latex={latex}
                    onChange={(mathField) => {
                        setLatex(mathField.latex());
                        expression.text = mathField.latex();
                        if (
                            expression.values.length == 1 &&
                            expression.values[0] instanceof DiedricNumber
                        ) {
                            setSliderValue(expression.values[0].x);
                            setSliderMin(
                                Math.min(expression.values[0].x, -200)
                            );
                            setSliderMax(Math.max(expression.values[0].x, 200));
                        }
                    }}
                />
                {(sliderValue == 0 || sliderValue) && (
                    <div className="flex flex-row items-center gap-x-1 px-1">
                        <StaticMathField className="text-sm">
                            {sliderMin.toString()}
                        </StaticMathField>
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
                                    expression.values[0] instanceof
                                        DiedricNumber
                                ) {
                                    const newText = latex.replace(
                                        expression.values[0].x.toString(),
                                        e.currentTarget.value
                                    );
                                    setLatex(newText);
                                    // expression.text = newText;
                                }
                            }}
                        />
                        <StaticMathField className="text-sm">
                            {sliderMax.toString()}
                        </StaticMathField>
                    </div>
                )}
            </div>
        </div>
    );
}
