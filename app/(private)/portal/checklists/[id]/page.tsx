import UpdateChecklistForm from "@/components/portal/checklist/UpdateForm";

export default async function PortalChecklistDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <UpdateChecklistForm id={id} />;
}
