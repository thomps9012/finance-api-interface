import Link from "next/link";
import { CheckRequestOverview, Purchase, Vendor } from "../types/checkrequests";

export default function AggCheckRequests({ check_requests }: { check_requests: CheckRequestOverview }) {
    const { purchases, request_ids, receipts, total_amount, vendors } = check_requests;
    if (total_amount === 0) { return <h5>No Requests</h5> }
    return <>
        <h5>Total Petty Cash Amount: {total_amount}</h5>
        <h5>Requests</h5>
        {request_ids.map((id: string) => <><Link href={`/check_request/detail/${id}`}><a>Record Detail</a></Link><br /></>)}
        <h5>Receipts</h5>
        {receipts.map((receipt_url: string) => {
            <img src={receipt_url} />
        })}
        <h5>Vendors</h5>
        {vendors.map((vendor: Vendor) => <p>{vendor.name}</p>)}
        <h5>Purchases</h5>
        {purchases.map((purchase: Purchase, i: number) => {
            i++;
            const { amount, description, grant_line_item } = purchase;
            <div key={i}>
                <p>{grant_line_item}</p>
                <p>{description}</p>
                <p>{amount}</p>
            </div>
        })}
    </>
}