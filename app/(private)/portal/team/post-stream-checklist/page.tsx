import UpsertForm from "@/components/portal/checklist/UpsertForm";

export default async function TeamPostStreamChecklistPage() {
    return (
        <div className="flex flex-col px-4 py-10 h-full gap-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-semibold ">
                        Team Post-Stream Checklist
                    </h1>
                    <div className="text-sm text-gray-500">
                        Add or update checklist items
                    </div>
                </div>
                <button
                    form="checklist-form"
                    type="submit"
                    className="px-2 py-1 text-sm bg-slate-800 hover:bg-slate-900 rounded cursor-pointer"
                >
                    Save
                </button>
            </div>
            <UpsertForm type="team_poststream" />
        </div>
    );
}
