import { useState } from "react";
import { indexDocument } from "../services/api";

type DocumentFormProps = {
    onAdded: () => void;
};

export default function DocumentForm({ onAdded }: DocumentFormProps) {
    const [id, setId] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        if (!id || !content) return alert("ID and content required");
        let parsed: any;
        try {
            parsed = JSON.parse(content);
        } catch (err) {
            parsed = { content };
        }
        await indexDocument(id, parsed);
        setId("");
        setContent("");
        onAdded();
    };

    return (
        <div className="mb-4 p-4 border rounded-xl bg-white">
            <h3 className="font-bold mb-2">Add / Update Document</h3>
            <input
                type="text"
                placeholder="Document ID"
                className="border p-2 rounded mb-2 w-full"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <textarea
                placeholder="Content as JSON"
                className="border p-2 rounded mb-2 w-full h-24"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
            >
                Submit
            </button>
        </div>
    );
}
