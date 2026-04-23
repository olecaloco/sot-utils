"use client";

import { useEffect, useMemo, useState } from "react";
import { parseInput } from "./utils";
import Link from "next/link";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import ErrorAlert from "./ErrorAlert";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { cn } from "@/utils";

export default function TokenNotesApp() {
    const [value, setValue] = useState("");

    const [search, setSearch] = useState("");
    const [showPreview, setShowPreview] = useState(true);

    // read AFTER mount
    useEffect(() => {
        const stored = localStorage.getItem("token_notes");
        if (stored !== null) {
            setValue(stored);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("token_notes", value);
    }, [value]);

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

        const s = search.toLowerCase().trim();

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
        <main className="h-full">
            <div className="flex flex-col w-full h-dvh">
                <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-1">
                        <IconButton LinkComponent={Link} href="/">
                            <ArrowLeftIcon className="w-6 h-6 text-gray-500" />
                        </IconButton>
                        <h1 className="text-lg font-semibold">Token Notes</h1>
                    </div>
                    <IconButton
                        type="button"
                        onClick={() => setShowPreview((prev) => !prev)}
                    >
                        {showPreview ? (
                            <EyeIcon className="w-6 h-6 text-gray-500" />
                        ) : (
                            <EyeOffIcon className="w-6 h-6 text-gray-500" />
                        )}
                    </IconButton>
                </div>

                <Divider />

                <div
                    className={cn("grid flex-1 gap-4 p-2 overflow-y-auto", {
                        "grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1":
                            showPreview,
                        "grid-cols-1": !showPreview,
                    })}
                >
                    <textarea
                        className="w-full h-full p-3 rounded-lg border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#f89f8e] text-sm resize-none"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                        placeholder={`Paste your notes here

Template:

username tipped 500 tokens

username tipped 25 tokens
Notice: @username 💰 tipped for → menu item 🥰`}
                    />

                    {showPreview && (
                        <Paper className="flex flex-col p-2">
                            {/* Controls */}
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <TextField
                                    size={"small"}
                                    type={"text"}
                                    label="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    sx={{ width: "100%" }}
                                    placeholder="Enter a username or detail"
                                />
                            </div>

                            {/* Table */}
                            <div className="flex-1 rounded-lg overflow-hidden overflow-y-auto">
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
                                                    className=" hover:bg-[#f89f8e]/10"
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

                            {invalidLines.length > 0 && (
                                <ErrorAlert lines={invalidLines} />
                            )}
                        </Paper>
                    )}
                </div>

                <Divider />

                <div className="flex justify-end p-2">
                    <Button
                        variant="contained"
                        onClick={exportCSV}
                        disabled={
                            filteredRows.length === 0 || invalidLines.length > 0
                        }
                    >
                        Export CSV
                    </Button>
                </div>
            </div>
        </main>
    );
}
