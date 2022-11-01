import { GrantInfo } from "./grants";
import { UserInfo } from "./users";

export interface Purchase {
    amount: number;
    description: string;
    grant_line_item: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    website: string;
}

export interface Vendor {
    name: string;
    address: Address;
}
export interface Action {
    id: string;
    created_at: string;
    status: string;
    user: string;
    request_id: string;
    request_type: string;
}

export interface CheckRequestOverview {
    created_at: string;
    current_status: string;
    date: Date;
    grant: GrantInfo;
    grant_id: string;
    id: string;
    is_active: boolean;
    order_total: number;
    user: UserInfo;
    user_id: string;
    vendor: Vendor;
}

export interface UserCheckRequests {
    end_date: Date;
    start_date: Date;
    requests: CheckDetail[];
    total_amount: number;
    user: UserInfo;
    vendors: Vendor[];
}

export interface CheckDetail {
    action_history: Action[];
    category: string;
    created_at: Date;
    current_status: string;
    current_user: string;
    date: Date;
    description: string;
    grant_id: string;
    id: string;
    is_active: boolean;
    order_total: number;
    purchases: Purchase[];
    receipts: string[];
    user_id: string;
    vendor: Vendor;
}