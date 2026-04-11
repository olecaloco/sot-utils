type Props = {
    lines: string[];
};

export default function ErrorAlert({ lines }: Props) {
    if (lines.length === 0) return null;

    return (
        <div className="mt-3 alert alert-danger">
            <strong>Some lines didn't match the required template:</strong>
            <ul>
                {lines.map((line, i) => (
                    <li key={i}>{line}</li>
                ))}
            </ul>
        </div>
    );
}
