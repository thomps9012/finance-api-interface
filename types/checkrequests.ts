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
    user_id: string;
}

export interface CheckRequestOverview {
    purchases: [Purchase];
    receipts: [string];
    total_amount: number;
    vendors: [Vendor];
    request_ids: [string];
}

export interface CheckDetail {
    id: string;
    user_id: string;
    grant_id: string;
    date: string;
    vendor: Vendor;
    description: string;
    purchases: [Purchase];
    receipts: [string];
    order_total: number;
    credit_card: string;
    created_at: string;
    action_history: [Action];
    current_status: string;
    is_active: boolean;
}