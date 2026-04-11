"use client";

import { useMemo, useState } from "react";
import { parseInput } from "./utils";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

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
        <main className="h-full flex items-center justify-center p-4">
            <div className="flex flex-col bg-slate-800 rounded border border-slate-700 w-full max-w-3xl h-full max-h-125">
                <div className="flex items-center gap-2 p-2 border-b border-slate-700">
                    <Link href="/">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-500" />
                    </Link>
                    <h1 className="text-lg font-semibold">Token Notes</h1>
                </div>

                <div className="flex flex-1 gap-4 p-2 overflow-y-auto">
                    <textarea
                        className="w-1/2 max-w-300 h-full p-3 rounded-lg border border-slate-700 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={`Template:

username tipped 500 tokens

username tipped 25 tokens
Notice: @username 💰 tipped for → menu item 🥰`}
                    />

                    {/* RIGHT */}
                    <div className="flex flex-col w-1/2">
                        {/* Controls */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full px-3 py-2 text-sm border border-slate-700 bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Table */}
                        <div className="flex-1 border border-slate-700 rounded-lg overflow-hidden max-h-124 overflow-y-auto">
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
                                                No items yet. Paste to see
                                                updates
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
                                                    {row.detailsArr.map(
                                                        (d, i) => (
                                                            <div key={i}>
                                                                {d}
                                                            </div>
                                                        ),
                                                    )}
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
                                    Some lines didn't match the required
                                    template:
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

                <div className="flex justify-end p-2 border-t border-slate-700">
                    <button
                        className="bg-slate-700 hover:bg-slate-900 text-white py-2 px-4 rounded cursor-pointer"
                        onClick={exportCSV}
                    >
                        Export CSV
                    </button>
                </div>
            </div>
        </main>
    );
}
