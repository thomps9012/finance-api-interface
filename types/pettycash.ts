import { Action } from "./checkrequests";

export interface PettyCashDetail {
    id: string;
    user_id: string;
    grant_id: string;
    date: string;
    description: string;
    amount: number;
    receipts: [string];
    created_at: string;
    action_history: [Action];
    current_status: string;
    is_active: string;
}
export interface PettyCashOverview {
    receipts: [string];
    requests: [PettyCashDetail];
    last_request: PettyCashDetail;
    total_amount: number;
}
interface PettyCashRequestInput {
    amount: number;
    date: string;
    receipts: string[];
    description: string;
}
export interface PettyCashInput {
    user_id: string;
    grant_id: string;
    request: PettyCashRequestInput;
}