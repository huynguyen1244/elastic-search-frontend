import { useEffect, useState } from "react";
import {
    getIndices,
    createIndex,
    deleteIndex
} from "../services/api";
import { Database, RefreshCw, AlertCircle, Plus } from "lucide-react";

export default function IndicesPage() {
    const [indices, setIndices] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newIndexName, setNewIndexName] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchIndices = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getIndices();
            setIndices(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch indices");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateIndex = async () => {
        if (!newIndexName.trim()) return;
        setCreating(true);
        const success = await createIndex(newIndexName.trim());
        if (success) {
            setNewIndexName("");
            fetchIndices();
        } else {
            alert("Failed to create index");
        }
        setCreating(false);
    };

    const handleDeleteIndex = async (index: string) => {
        if (!confirm(`Delete index "${index}"? This cannot be undone!`)) return;
        const success = await deleteIndex(index);
        if (success) fetchIndices();
        else alert("Failed to delete index");
    };

    useEffect(() => {
        fetchIndices();
    }, []);

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Elasticsearch Indices</h2>
                        <p className="text-blue-100 text-sm mt-0.5">
                            {loading ? "Loading..." : `${indices.length} indices found`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="New index name"
                        value={newIndexName}
                        onChange={(e) => setNewIndexName(e.target.value)}
                        className="px-3 py-1 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={handleCreateIndex}
                        disabled={creating || !newIndexName.trim()}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        {creating ? "Creating..." : "Create"}
                    </button>
                    <button
                        onClick={fetchIndices}
                        disabled={loading}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh indices"
                    >
                        <RefreshCw className={`w-5 h-5 text-white ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {loading && indices.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
                            <p className="text-slate-600">Loading indices...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-red-800">Error loading indices</p>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                ) : indices.length === 0 ? (
                    <div className="text-center py-12">
                        <Database className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600 font-medium">No indices found</p>
                        <p className="text-slate-400 text-sm mt-1">Create an index to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {indices.map((idx, i) => (
                            <div
                                key={idx}
                                className="group relative px-4 py-3 bg-gradient-to-br from-slate-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 border border-slate-200 hover:border-blue-300 rounded-xl text-sm font-medium text-slate-700 hover:text-blue-900 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 group-hover:bg-blue-600 transition-colors duration-300"></div>
                                        <span className="truncate">{idx}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteIndex(idx)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete index"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
