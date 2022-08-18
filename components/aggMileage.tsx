import Link from "next/link";
import { MileageDetail, MileageOverview } from "../types/mileage";
import dateFormat from "../utils/dateformat";

export default function AggMileage({ mileage_requests }: { mileage_requests: MileageOverview }) {
    const { mileage, requests, parking, tolls, reimbursement } = mileage_requests;
    if (mileage === 0) { return <h5>No Requests</h5> }
    return <>
        <h5>Total Mileage: {mileage}</h5>
        <h5>Requests</h5>
        {requests.map((request: MileageDetail) => {
            const { id, date, current_status } = request;
            return <div key={id}>
                <Link href={`/mileage/detail/${id}`}><a>Record Detail</a></Link><br />
                <p>{dateFormat(date)}</p>
                <p>{current_status}</p>
            </div>
        }
        )}
        <h5>Parking: {parking}</h5>
        <h5>Tolls: {tolls}</h5>
        <h5>Total Reimbursement: {reimbursement}</h5>
    </>
}