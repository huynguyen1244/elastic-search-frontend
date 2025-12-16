import { useEffect, useState } from "react";
import {
    getIndices,
    createIndex,
    deleteIndex,
    getDocumentsByIndex
} from "../services/api";
import { Database, RefreshCw, AlertCircle, Plus, Trash2, FolderOpen, X, FileText } from "lucide-react";
import ResultTable from "../components/ResultTable";

export default function IndicesPage() {
    const [indices, setIndices] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newIndexName, setNewIndexName] = useState("");
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Advanced Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [indexSettings, setIndexSettings] = useState("");
    const [indexMappings, setIndexMappings] = useState("");

    // Document Viewing State
    const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
    const [indexDocuments, setIndexDocuments] = useState<any[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    const fetchIndices = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getIndices();
            setIndices(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Không thể tải danh sách index");
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        if (!newIndexName.trim()) return;
        setIndexSettings('{\n  "number_of_shards": 1,\n  "number_of_replicas": 1\n}');
        setIndexMappings('{\n  "properties": {\n    "title": { "type": "text" },\n    "description": { "type": "text" }\n  }\n}');
        setShowCreateModal(true);
    };

    const handleConfirmCreate = async () => {
        try {
            setCreating(true);
            let settingsObj = undefined;
            let mappingsObj = undefined;

            if (indexSettings.trim()) {
                settingsObj = JSON.parse(indexSettings);
            }
            if (indexMappings.trim()) {
                mappingsObj = JSON.parse(indexMappings);
            }

            const success = await createIndex(newIndexName.trim(), settingsObj, mappingsObj);
            if (success) {
                setNewIndexName("");
                setShowCreateModal(false);
                fetchIndices();
            } else {
                alert("Tạo index thất bại. Vui lòng kiểm tra console.");
            }
        } catch (err) {
            alert("Lỗi cú pháp JSON! Vui lòng kiểm tra lại Settings hoặc Mappings.");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteIndex = async (index: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening the modal
        if (!confirm(`Bạn có chắc chắn muốn xóa index "${index}"? Hành động này không thể hoàn tác!`)) return;
        setDeleting(index);
        const success = await deleteIndex(index);
        setDeleting(null);
        if (success) {
            fetchIndices();
            if (selectedIndex === index) setSelectedIndex(null);
        } else {
            alert("Xóa index thất bại");
        }
    };

    const handleIndexClick = async (index: string) => {
        setSelectedIndex(index);
        setLoadingDocs(true);
        setIndexDocuments([]);
        try {
            const docs = await getDocumentsByIndex(index);
            setIndexDocuments(docs);
        } catch (error) {
            console.error("Failed to fetch documents for index", index, error);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleRefreshDocs = () => {
        if (selectedIndex) handleIndexClick(selectedIndex);
    };

    useEffect(() => {
        fetchIndices();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="p-3 bg-primary-50 rounded-xl">
                        <Database className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Quản lý Index</h2>
                        <p className="text-sm text-slate-500">Quản lý các index trong Elasticsearch</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="New index name..."
                            value={newIndexName}
                            onChange={(e) => setNewIndexName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && openCreateModal()}
                            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none"
                        />
                        <button
                            onClick={openCreateModal}
                            disabled={creating || !newIndexName.trim()}
                            className="absolute right-1.5 top-1.5 p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-slate-300"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={fetchIndices}
                        disabled={loading}
                        className="p-2.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="min-h-[300px]">
                {loading && indices.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                ) : indices.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                        <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-700">Không tìm thấy index nào</h3>
                        <p className="text-slate-500">Hãy tạo index đầu tiên để bắt đầu</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {indices.map((idx, i) => (
                            <div
                                key={idx}
                                onClick={() => handleIndexClick(idx)}
                                className="group relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300 cursor-pointer"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-50 to-indigo-50 rounded-full flex items-center justify-center text-primary-600">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteIndex(idx, e)}
                                        disabled={deleting === idx}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        {deleting === idx ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-1 truncate" title={idx}>{idx}</h3>
                                <p className="text-xs text-slate-400 font-mono">Bấm để xem tài liệu</p>

                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Document Viewer Modal */}
            {selectedIndex && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100/50 rounded-lg text-primary-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Nội dung Index: {selectedIndex}</h3>
                                    <p className="text-xs text-slate-500">{indexDocuments.length} tài liệu được tải</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedIndex(null)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                            <ResultTable
                                results={indexDocuments}
                                onRefresh={handleRefreshDocs}
                                loading={loadingDocs}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Create Index Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">Tạo Index mới: {newIndexName}</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-red-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Settings (JSON)</label>
                                <textarea
                                    className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-primary-100 outline-none"
                                    value={indexSettings}
                                    onChange={(e) => setIndexSettings(e.target.value)}
                                    placeholder="{}"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Mappings (JSON)</label>
                                <textarea
                                    className="w-full h-48 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-primary-100 outline-none"
                                    value={indexMappings}
                                    onChange={(e) => setIndexMappings(e.target.value)}
                                    placeholder="{}"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmCreate}
                                disabled={creating}
                                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-300"
                            >
                                {creating ? "Đang tạo..." : "Xác nhận tạo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
