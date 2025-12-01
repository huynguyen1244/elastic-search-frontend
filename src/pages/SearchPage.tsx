import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ResultTable from "../components/ResultTable";
import CountDisplay from "../components/CountDisplay";
import { searchElastic } from "../services/api";
import { Search, AlertCircle } from "lucide-react";

export default function SearchPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (query: string) => {
        try {
            setLoading(true);
            setError(null);
            setHasSearched(true);
            const data = await searchElastic(query);
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to search");
            console.error(err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        // Implement refresh logic if needed
        console.log("Refresh triggered");
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
                        <Search className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Search Documents</h2>
                        <p className="text-slate-500 text-sm mt-0.5">Query your Elasticsearch indices</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    <div className="flex-1">
                        <SearchBar onSearch={handleSearch} loading={loading} />
                    </div>
                    <div className="lg:min-w-[200px]">
                        <CountDisplay />
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-slideIn">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-red-800">Search Error</p>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {hasSearched && !error && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Search Results</h3>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {loading ? (
                                        "Searching..."
                                    ) : (
                                        `${results.length} ${results.length === 1 ? "result" : "results"} found`
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <ResultTable results={results} onRefresh={handleRefresh} loading={loading} />
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!hasSearched && !error && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Start Searching</h3>
                        <p className="text-slate-500">
                            Enter a search query above to find documents in your Elasticsearch indices
                        </p>
                    </div>
                </div>
            )}

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