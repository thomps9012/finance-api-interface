import { MileageDetail } from "./mileage";
import { PettyCashDetail } from "./pettycash";

export interface GrantInfo {
    id: string;
    name: string;
}
// update backend to match expected return type on the front end
export interface GrantMileage {
    grant: GrantInfo;
    mileage: number;
    tolls: number;
    parking: number;
    reimbursement: number;
    requests: MileageDetail[];
}
export interface GrantPettyCash {
    total_amount: number;
    grant: GrantInfo;
    total_requests: number;
    requests: PettyCashDetail[];
}

export interface GrantCheckRequest {
    grant: GrantInfo;
    requests: PettyCashDetail[]
    total_amount: number;
    total_requests: number;
}