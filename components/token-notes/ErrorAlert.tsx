import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

type Props = {
    lines: string[];
};

export default function ErrorAlert({ lines }: Props) {
    if (lines.length === 0) return null;

    return (
        <Alert severity="error">
            <AlertTitle>
                Some lines didn&apos;t match the required template:
            </AlertTitle>
            <ul className="mt-2">
                {lines.map((line, i) => (
                    <li key={i}>{line}</li>
                ))}
            </ul>
        </Alert>
    );
}
