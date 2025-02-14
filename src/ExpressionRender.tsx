import { useEffect, useState } from "react";
import { Expression } from "./expression";
import { DiedricNumber } from "./diedric/number";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";

addStyles();

export function ExpressionRender({
    expression,
    index,
    deleteExpression,
}: {
    expression: Expression;
    index: number;
    deleteExpression: (expression: Expression) => void;
}) {
    const [latex, setLatex] = useState(expression.text);
    const [matches, setMatches] = useState<string[]>([]);
    const [match, setMatch] = useState<string>();

    const [sliderValue, setSliderValue] = useState<number>();

    const [sliderMin, setSliderMin] = useState<number>();
    const [sliderMax, setSliderMax] = useState<number>();

    const [error, setError] = useState<boolean>(expression.error);
    useEffect(() => {
        expression.addEventListener("errorUpdate", (e) => {
            setError(e.error);
        });

        expression.addEventListener("multipleMatches", (e) => {
            setMatches(e.matches);
            setMatch(e.currentMatch);
        });
        // Once event listeners are added, call parseText to process expression.
        expression.parseText();

        let tempSliderValue = undefined;

        if (
            expression.values.length == 1 &&
            expression.values[0] instanceof DiedricNumber
        ) {
            tempSliderValue = expression.values[0].x;
        }
        setSliderValue(tempSliderValue);
        setSliderMax(Math.max(tempSliderValue, 200));
        setSliderMin(Math.min(tempSliderValue, -200));
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
                        if (latex == "" && mathField.latex() == "") {
                            deleteExpression(expression);
                        }

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
                {matches.length > 1 && !error && (
                    <div className="flex flex-col gap-y-1">
                        <label className="text-xs">
                            There are multiple options
                        </label>
                        {matches.map((_match, index) => (
                            <label
                                key={index}
                                onClick={() => {
                                    expression.preferredMatch = _match;
                                }}
                                className={
                                    "text-sm p-1 rounded" +
                                    (_match == match
                                        ? " bg-blue-400  text-blue-800"
                                        : "")
                                }
                            >
                                {_match}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
