import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

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
                        Use <Chip size="small" label="{items}" /> to insert
                        checklist values.
                    </div>
                </div>
                <Button
                    size="small"
                    variant="contained"
                    form="checklist-template-form"
                    type="submit"
                >
                    Save
                </Button>
            </div>
            <ChecklistTemplateForm type="regular" />
        </div>
    );
}
