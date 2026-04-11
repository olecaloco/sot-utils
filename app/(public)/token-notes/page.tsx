import TokenNotesApp from "@/components/token-notes";

export default async function TokenNotesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold mb-4">Token Notes</h1>
            <TokenNotesApp />
        </div>
    );
}
