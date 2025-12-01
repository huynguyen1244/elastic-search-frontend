const ELASTIC_URL = import.meta.env.VITE_ELASTIC_API; // VITE_ prefix bắt buộc

// 1️⃣ Search documents
export const searchElastic = async (query: string, index?: string) => {
    try {
        const url = index ? `${ELASTIC_URL}/${index}/_search` : `${ELASTIC_URL}/_search`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: {
                    match: { content: query },
                },
            }),
        });
        const data = await res.json();
        return data.hits?.hits || [];
    } catch (error) {
        console.error("searchElastic error:", error);
        return [];
    }
};

// 2️⃣ Get all indices
export const getIndices = async (): Promise<string[]> => {
    try {
        // _cat/indices?format=json trả về danh sách index
        const url = ELASTIC_URL.replace(/\/_search$/, ""); // lấy base URL
        const res = await fetch(`${url}/_cat/indices?format=json`);
        const data = await res.json();
        return data.map((idx: any) => idx.index);
    } catch (error) {
        console.error("getIndices error:", error);
        return [];
    }
};

// 3️⃣ Index (create/update) document
// Count all documents across cluster
export const countDocuments = async (): Promise<number> => {
    try {
        const url = ELASTIC_URL.replace(/\/_search$/, "");
        const res = await fetch(`${url}/_count`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        return typeof data.count === "number" ? data.count : 0;
    } catch (error) {
        console.error("countDocuments error:", error);
        return 0;
    }
};

// Index (create/update) document
// Supports two call forms:
//  - indexDocument(index, id, doc)
//  - indexDocument(id, doc) -> uses VITE_DEFAULT_INDEX or 'documents'
export const indexDocument = async (...args: any[]) => {
    let index: string;
    let id: string;
    let doc: Record<string, any>;

    if (args.length === 2) {
        id = args[0];
        doc = args[1];
        index = import.meta.env.VITE_DEFAULT_INDEX || "documents";
    } else {
        index = args[0];
        id = args[1];
        doc = args[2];
    }

    try {
        const url = ELASTIC_URL.replace(/\/_search$/, "");
        const res = await fetch(`${url}/${index}/_doc/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(doc),
        });
        return res.ok;
    } catch (error) {
        console.error("indexDocument error:", error);
        return false;
    }
};

// 4️⃣ Optional: delete document
export const deleteDocument = async (index: string, id: string) => {
    try {
        const url = ELASTIC_URL.replace(/\/_search$/, "");
        const res = await fetch(`${url}/${index}/_doc/${id}`, {
            method: "DELETE",
        });
        return res.ok;
    } catch (error) {
        console.error("deleteDocument error:", error);
        return false;
    }
};
// 5️⃣ Create a new index with optional settings and mappings
export const createIndex = async (
    index: string,
    settings?: Record<string, any>,
    mappings?: Record<string, any>
): Promise<boolean> => {
    try {
        const url = ELASTIC_URL.replace(/\/_search$/, "");
        const body: Record<string, any> = {};

        if (settings) body.settings = settings;
        if (mappings) body.mappings = mappings;

        const res = await fetch(`${url}/${index}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`createIndex failed: ${res.status} ${text}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error("createIndex error:", error);
        return false;
    }
};
// 6️⃣ Delete an index
export const deleteIndex = async (index: string): Promise<boolean> => {
    try {
        const url = ELASTIC_URL.replace(/\/_search$/, "");
        const res = await fetch(`${url}/${index}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            const text = await res.text();
            console.error(`deleteIndex failed: ${res.status} ${text}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error("deleteIndex error:", error);
        return false;
    }
};
// 7️⃣ Get index details (settings and mappings)
export const getIndexDetails = async (index: string): Promise<any> => {
    try {
        const url = ELASTIC_URL.replace(/\/_search$/, "");
        const res = await fetch(`${url}/${index}`, {
            method: "GET",
        });
        if (!res.ok) {
            const text = await res.text();
            console.error(`getIndexDetails failed: ${res.status} ${text}`);
            return null;
        }
        const data = await res.json();
        return data[index] || null;
    } catch (error) {
        console.error("getIndexDetails error:", error);
        return null;
    }
};
