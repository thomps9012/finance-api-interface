import { Action } from "./checkrequests";
import { GrantInfo } from "./grants";
import { UserInfo } from "./users";

export interface PettyCashDetail {
    action_history: Action[];
    amount: number;
    category: string;
    created_at: string;
    current_status: string;
    current_user: string;
    date: string;
    description: string;
    grant_id: string;
    id: string;
    is_active: boolean;
    receipts: string[];
    user_id: string;
}
export interface PettyCashOverview {
    receipts: [string];
    requests: [PettyCashDetail];
    last_request: PettyCashDetail;
    total_amount: number;
}
interface PettyCashRequestInput {
    amount: number;
    created_at: Date;
    current_status: string;
    date: Date;
    grant: GrantInfo;
    grant_id: string;
    id: string;
    is_active: boolean;
    user: UserInfo;
    user_id: string;
}
export interface PettyCashInput {
    user_id: string;
    grant_id: string;
    request: PettyCashRequestInput;
}
export interface UserPettyCash {
    user: UserInfo;
    end_date: string;
    requests: PettyCashDetail[];
    start_date: string;
    total_amount: number;
}

