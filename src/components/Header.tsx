type HeaderProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const tabs = [
    { id: "search", label: "Search" },
    { id: "indices", label: "Indices" },
    { id: "upload", label: "Upload" },
];

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
    return (
        <header className="w-full bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
            <div className="mx-auto px-4 py-3">
                <nav className="flex justify-center md:justify-start gap-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative px-6 py-2.5 font-semibold text-sm
                                    transition-all duration-300 ease-out
                                    rounded-xl
                                    ${isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                                        : "bg-white/60 text-slate-600 hover:bg-white hover:shadow-md hover:scale-102 hover:text-slate-800"}
                                `}
                            >
                                {tab.label}

                                {/* Active indicator glow effect */}
                                {isActive && (
                                    <>
                                        <span className="absolute inset-0 rounded-xl bg-blue-400 opacity-20 blur-sm"></span>
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"></span>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}