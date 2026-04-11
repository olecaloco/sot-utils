"use client";

import { useMemo, useState } from "react";
import { parseInput } from "./utils";

export default function TokenNotesApp() {
    const [value, setValue] = useState("");
    const [search, setSearch] = useState("");

    const { usermap, invalidLines } = useMemo(() => {
        if (!value.trim()) return { usermap: new Map(), invalidLines: [] };
        return parseInput(value);
    }, [value]);

    const rows = useMemo(() => {
        return [...usermap.entries()].map(([user, values]) => {
            const counts: Record<string, number> = {};
            values.forEach((v: string) => {
                counts[v] = (counts[v] || 0) + 1;
            });

            const detailsArr = Object.entries(counts).map(([item, count]) =>
                count > 1 ? `${item} (${count})` : item,
            );

            return {
                user,
                detailsArr,
                detailsText: detailsArr.join(", "),
            };
        });
    }, [usermap]);

    const filteredRows = useMemo(() => {
        if (!search) return rows;

        const s = search.toLowerCase();

        return rows.filter(
            (r) =>
                r.user.toLowerCase().includes(s) ||
                r.detailsText.toLowerCase().includes(s),
        );
    }, [rows, search]);

    const exportCSV = () => {
        const header = ["Username", "Details"];
        const csvRows = [
            header.join(","),
            ...filteredRows.map((r) =>
                [
                    `"${r.user}"`,
                    `"${r.detailsArr.join("\n").replace(/"/g, '""')}"`,
                ].join(","),
            ),
        ];

        const blob = new Blob([csvRows.join("\n")], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const date = new Date().toISOString().split("T")[0];

        a.href = url;
        a.download = `tip-menu-notes_${date}.csv`;
        a.click();
    };

    return (
        <main className="max-w-[10000px]">
            <div className="flex gap-4">
                {/* LEFT */}

                <div className="w-full max-w-100">
                    <label className="block text-sm font-medium mb-2">
                        Tips
                    </label>

                    <textarea
                        className="w-full h-130 p-3 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={value}
                        cols={80}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={`Template:

username tipped 500 tokens

username tipped 25 tokens
Notice: @username 💰 tipped for → menu item 🥰`}
                    />
                </div>

                {/* RIGHT */}
                <div>
                    {/* Controls */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <button
                            onClick={exportCSV}
                            className="px-3 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                            Export CSV
                        </button>

                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-60 px-3 py-2 text-sm border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Table */}
                    <div className="border border-slate-800 rounded-lg overflow-hidden max-h-124 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left">
                                <tr>
                                    <th className="px-4 py-2 font-medium">
                                        Username
                                    </th>
                                    <th className="px-4 py-2 font-medium">
                                        Details
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRows.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-4 py-3 text-gray-500"
                                            colSpan={2}
                                        >
                                            No items yet. Paste to see updates
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRows.map((row) => (
                                        <tr
                                            key={row.user}
                                            className="border-t border-t-slate-800 hover:bg-slate-900"
                                        >
                                            <td className="px-4 py-2">
                                                {row.user}
                                            </td>
                                            <td className="px-4 py-2">
                                                {row.detailsArr.map((d, i) => (
                                                    <div key={i}>{d}</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Errors */}
                    {invalidLines.length > 0 && (
                        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                            <strong className="block mb-2">
                                Some lines didn't match the required template:
                            </strong>
                            <ul className="list-disc ml-5">
                                {invalidLines.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
