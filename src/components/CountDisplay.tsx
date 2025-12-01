import { useEffect, useState } from "react";
import { countDocuments } from "../services/api";

export default function CountDisplay() {
    const [count, setCount] = useState<number>(0);

    const fetchCount = async () => {
        const total = await countDocuments();
        setCount(total);
    };

    useEffect(() => {
        fetchCount();
    }, []);

    return (
        <div className="inline-flex items-center gap-4 px-4 py-3 bg-white rounded-2xl shadow">
            <div className="text-xs text-slate-500">Total</div>
            <div className="text-2xl font-bold text-slate-800">{count.toLocaleString()}</div>
        </div>
    );
}
