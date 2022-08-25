import Link from "next/link";
import { CheckDetail, CheckRequestOverview, Purchase, Vendor } from "../types/checkrequests";
import dateFormat from "../utils/dateformat";

export default function AggCheckRequests({ check_requests }: { check_requests: CheckRequestOverview }) {
    const { purchases, requests, receipts, total_amount, vendors } = check_requests;
    if (total_amount === 0) { return <h5>No Requests</h5> }
    return <>
        <h5>Total Check Request Amount: {total_amount}</h5>
        <h5>Requests</h5>
        {requests.map((request: CheckDetail) => {
            const { id, date, current_status } = request;
            return <div key={id}>
                <Link href={`/check_request/detail/${id}`}><a>Record Detail</a></Link><br />
                <p>{dateFormat(date)}</p>
                <p>{current_status}</p>
            </div>
        })}
        <h5>Vendors</h5>
        {vendors.map((vendor: Vendor) => <p key={vendor.name}>{vendor.name}</p>)}
    </>
}