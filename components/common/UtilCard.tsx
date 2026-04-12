import Link from "next/link";

export function UtilCard({
    title,
    description,
    href,
    icon,
}: Readonly<{
    title: string;
    description: string;
    href: string;
    icon?: React.ReactNode;
}>) {
    return (
        <Link
            href={href}
            className="block rounded-lg border bg-slate-900 border-gray-200 p-4 shadow w-full max-w-75 hover:bg-slate-800"
        >
            <div className="mb-2">{icon}</div>
            <h2 className="text-sm md:text-lg font-semibold">{title}</h2>
            <p className="text-xs text-gray-600">{description}</p>
        </Link>
    );
}
