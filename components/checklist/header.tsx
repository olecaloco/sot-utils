import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export function ChecklistHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-2 p-2 border-b border-slate-700">
            <Link href="/">
                <ArrowLeftIcon className="w-6 h-6 text-gray-500" />
            </Link>
            <h1 className="text-lg font-semibold">{title}</h1>
        </div>
    );
}
