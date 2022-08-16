import Link from "next/link";
import { MileageOverview } from "../types/mileage";

export default function AggMileage({ mileage_requests }: { mileage_requests: MileageOverview }) {
    const { mileage, request_ids, parking, tolls, reimbursement } = mileage_requests;
    if (mileage === 0) { return <h5>No Requests</h5> }
    return <>
        <h5>Total Mileage: {mileage}</h5>
        <h5>Requests</h5>
        {request_ids.map((id: string) => <><Link href={`/mileage/detail/${id}`}><a>Record Detail</a></Link><br /></>)}
        <h5>Parking: {parking}</h5>
        <h5>Tolls: {tolls}</h5>
        <h5>Total Reimbursement: {reimbursement}</h5>
    </>
}