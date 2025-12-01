import { useState } from "react";
import { deleteDocument } from "../services/api";
import { Trash2, Database, Hash, FileJson, AlertCircle, Loader2 } from "lucide-react";

type ResultTableProps = {
    results: any[];
    onRefresh: () => void;
    loading?: boolean;
};

export default function ResultTable({ results, onRefresh, loading = false }: ResultTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (index: string, id: string) => {
        if (confirm("Are you sure you want to delete this document?")) {
            try {
                setDeletingId(`${index}-${id}`);
                await deleteDocument(index, id);
                onRefresh();
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Failed to delete document");
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Loading results...</p>
                </div>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileJson className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No Documents Found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your search query</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-slate-500" />
                                    Index
                                </div>
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-slate-500" />
                                    Document ID
                                </div>
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <FileJson className="w-4 h-4 text-slate-500" />
                                    Content
                                </div>
                            </th>
                            <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {results.map((doc, index) => {
                            const docKey = `${doc._index}-${doc._id}`;
                            const isDeleting = deletingId === docKey;

                            return (
                                <tr
                                    key={docKey}
                                    className="hover:bg-slate-50/50 transition-colors duration-150 group"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: "fadeIn 0.4s ease-out forwards",
                                        opacity: 0
                                    }}
                                >
                                    {/* Index Column */}
                                    <td className="px-6 py-4 align-top">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            {doc._index}
                                        </span>
                                    </td>

                                    {/* ID Column */}
                                    <td className="px-6 py-4 align-top">
                                        <span className="text-sm text-slate-700 font-mono font-medium">
                                            {doc._id}
                                        </span>
                                    </td>

                                    {/* Content Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="relative max-h-48 overflow-auto rounded-lg bg-slate-50 border border-slate-200 group-hover:border-slate-300 transition-colors duration-200">
                                            <pre className="p-3 text-xs font-mono text-slate-700 leading-relaxed">
                                                {JSON.stringify(doc._source, null, 2)}
                                            </pre>
                                            {/* Scroll indicator */}
                                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
                                        </div>
                                    </td>

                                    {/* Actions Column */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleDelete(doc._index, doc._id)}
                                                disabled={isDeleting}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                                                title="Delete document"
                                            >
                                                {isDeleting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Deleting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                                                        <span>Delete</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Results count footer */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-3 border-t border-slate-200">
                <p className="text-xs text-slate-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Showing <span className="font-semibold text-slate-800">{results.length}</span> {results.length === 1 ? "document" : "documents"}
                </p>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Custom scrollbar for content preview */
                .overflow-auto::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }

                .overflow-auto::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 3px;
                }

                .overflow-auto::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }

                .overflow-auto::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}