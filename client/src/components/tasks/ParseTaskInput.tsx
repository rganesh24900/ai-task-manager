import React, { useState } from "react";
import useParseTask from "../../hooks/useParseTask";
import Button from "../../common/components/Button";

interface Props {
    onParsed: (data: any) => void;
}

const ParseTaskInput: React.FC<Props> = ({ onParsed }) => {
    const [input, setInput] = useState("");
    const { mutate, isPending } = useParseTask();

    const handleParse = () => {
        mutate(input, {
            onSuccess: (data) => {
                onParsed(data);
            },
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your task in natural language..."
                className="border rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-indigo-400"
            />
            <Button onClick={handleParse} disabled={isPending}>
                {isPending ? "Analyzing..." : "Auto-fill Form"}
            </Button>
        </div>
    );
};

export default ParseTaskInput;
