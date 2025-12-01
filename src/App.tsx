import { useState } from "react";
import Header from "./components/Header";
import SearchPage from "./pages/SearchPage";
import IndicesPage from "./pages/IndicesPage";
import UploadPage from "./pages/UploadPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("search");

  let pageContent;
  switch (activeTab) {
    case "search":
      pageContent = <SearchPage />;
      break;
    case "indices":
      pageContent = <IndicesPage />;
      break;
    case "upload":
      pageContent = <UploadPage />;
      break;
    default:
      pageContent = <SearchPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-5xl mx-auto p-6">
        <div className="space-y-6">{pageContent}</div>
      </main>
    </div>
  );
}
