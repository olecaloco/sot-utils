import UpsertForm from "@/components/portal/checklist/UpsertForm";

export default async function PortalChecklistPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <UpsertForm id={id} />;
}
