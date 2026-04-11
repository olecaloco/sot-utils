type Props = {
    lines: string[];
};

export default function ErrorAlert({ lines }: Props) {
    if (lines.length === 0) return null;

    return (
        <div className="mt-3 border border-red-800/50 rounded p-3 bg-red-900/50 text-xs">
            <strong>Some lines didn't match the required template:</strong>
            <ul className="mt-2">
                {lines.map((line, i) => (
                    <li key={i}>{line}</li>
                ))}
            </ul>
        </div>
    );
}
