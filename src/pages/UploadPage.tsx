import { useState } from "react";
import { indexDocument } from "../services/api";
import { Upload, CheckCircle, XCircle, AlertCircle, FileJson, Database, Hash } from "lucide-react";

export default function UploadPage() {
    const [index, setIndex] = useState("");
    const [id, setId] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState<{ type: "success" | "error" | "warning" | null; message: string }>({
        type: null,
        message: ""
    });
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        // Validation
        if (!index || !id || !content) {
            setStatus({ type: "warning", message: "All fields are required" });
            return;
        }

        try {
            setLoading(true);
            setStatus({ type: null, message: "" });

            const parsedContent = JSON.parse(content);
            const success = await indexDocument(index, id, parsedContent);

            if (success) {
                setStatus({ type: "success", message: "Document uploaded successfully!" });
                // Reset form
                setIndex("");
                setId("");
                setContent("");
            } else {
                setStatus({ type: "error", message: "Upload failed. Please try again." });
            }
        } catch (err) {
            if (err instanceof SyntaxError) {
                setStatus({ type: "error", message: "Invalid JSON format. Please check your content." });
            } else {
                setStatus({ type: "error", message: "An error occurred during upload." });
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = () => {
        switch (status.type) {
            case "success":
                return "bg-green-50 border-green-200 text-green-800";
            case "error":
                return "bg-red-50 border-red-200 text-red-800";
            case "warning":
                return "bg-amber-50 border-amber-200 text-amber-800";
            default:
                return "";
        }
    };

    const getStatusIcon = () => {
        switch (status.type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case "error":
                return <XCircle className="w-5 h-5 text-red-600" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-amber-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Upload Document</h2>
                    <p className="text-green-100 text-sm mt-0.5">Index a new document to Elasticsearch</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
                {/* Status Message */}
                {status.type && (
                    <div className={`flex items-start gap-3 p-4 rounded-xl border ${getStatusStyles()} animate-slideIn`}>
                        {getStatusIcon()}
                        <p className="text-sm font-medium flex-1">{status.message}</p>
                    </div>
                )}

                {/* Index Input */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Database className="w-4 h-4 text-slate-500" />
                        Index Name
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., my-index"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                        value={index}
                        onChange={(e) => setIndex(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {/* Document ID Input */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Hash className="w-4 h-4 text-slate-500" />
                        Document ID
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., doc-001"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {/* JSON Content Textarea */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FileJson className="w-4 h-4 text-slate-500" />
                        Document Content (JSON)
                    </label>
                    <textarea
                        placeholder='{\n  "title": "Example Document",\n  "description": "This is a sample document",\n  "tags": ["example", "demo"]\n}'
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm font-mono text-sm resize-none"
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={loading}
                    />
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Content must be valid JSON format
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-2">
                    <button
                        onClick={() => {
                            setIndex("");
                            setId("");
                            setContent("");
                            setStatus({ type: null, message: "" });
                        }}
                        className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={loading || !index || !id || !content}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload Document
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}