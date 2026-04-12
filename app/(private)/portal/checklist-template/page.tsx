import { ChecklistTemplateForm } from "@/components/portal/checklist/TemplateForm";

export default async function ChecklistTemplate() {
    return (
        <div className="flex flex-col px-4 py-10 h-full gap-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-xl font-semibold ">
                        Checklist Templates
                    </h1>
                    <div className="text-sm text-gray-500">
                        Update the template for pre and post stream checklists.
                        Use{" "}
                        <code className="bg-slate-700 text-gray-300 px-1 py-0.5 rounded">
                            {`{items}`}
                        </code>{" "}
                        to insert checklist values.
                    </div>
                </div>
                <button
                    form="checklist-template-form"
                    type="submit"
                    className="px-2 py-1 text-sm bg-slate-800 hover:bg-slate-900 rounded cursor-pointer"
                >
                    Save
                </button>
            </div>
            <ChecklistTemplateForm type="regular" />
        </div>
    );
}
