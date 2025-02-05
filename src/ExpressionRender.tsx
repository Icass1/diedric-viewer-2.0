import { useEffect, useState } from "react";
import { Expression } from "./expression";
import { DiedricNumber } from "./diedric/number";

export function ExpressionRender({ expression }: { expression: Expression }) {
    const [text, setText] = useState(expression.text);

    let tempSliderValue = undefined;

    if (
        expression.values.length == 1 &&
        expression.values[0] instanceof DiedricNumber
    ) {
        tempSliderValue = expression.values[0].x;
    }

    const [sliderValue, setSliderValue] = useState(tempSliderValue);

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
            <input
                value={text}
                onChange={(e) => {
                    setText(e.currentTarget.value);
                    expression.text = e.currentTarget.value;
                    if (
                        expression.values.length == 1 &&
                        expression.values[0] instanceof DiedricNumber
                    ) {
                        setSliderValue(expression.values[0].x);
                    }
                }}
                className="bg-neutral-300 focus:outline-none border-b-2 w-full border-neutral-600 border-solid"
            />

            {(sliderValue == 0 || sliderValue) && (
                <div className="flex flex-row items-center">
                    <label>-10</label>
                    <input
                        type="range"
                        min={-100}
                        max={100}
                        value={sliderValue}
                        onChange={(e) => {
                            setSliderValue(Number(e.currentTarget.value));

                            if (
                                expression.values.length == 1 &&
                                expression.values[0] instanceof DiedricNumber
                            ) {
                                const newText = text.replace(
                                    expression.values[0].x.toString(),
                                    e.currentTarget.value
                                );
                                setText(newText);
                                expression.text = newText;
                            }
                        }}
                    ></input>
                    <label>10</label>
                </div>
            )}
        </div>
    );
}
