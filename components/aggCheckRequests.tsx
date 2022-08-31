import Link from "next/link";
import { CheckDetail, CheckRequestOverview, Purchase, Vendor } from "../types/checkrequests";
import dateFormat from "../utils/dateformat";
import styles from '../styles/Home.module.css'
export default function AggCheckRequests({ check_requests }: { check_requests: CheckRequestOverview }) {
    const { purchases, requests, receipts, total_amount, vendors } = check_requests;
    if (total_amount === 0) { return <h1>No Requests</h1> }
    return <main className={styles.main}>
        <h1>Total Check Request Amount: {total_amount}</h1>
        <h1>Vendors</h1>
        {vendors.map((vendor: Vendor) => <div key={vendor.name} className={styles.vendor}>
            <p >{vendor.name}</p>
            <p>{vendor.address.street}</p>
            <p>{vendor.address.city}, {vendor.address.state}</p>
            <p>{vendor.address.website}</p>
        </div>)}
        <h1>Requests</h1>
        <table>
            <thead>
                <th>Link</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
            </thead>
            <tbody>
                {requests.map((request: CheckDetail) => {
                    const { id, date, current_status, order_total } = request;
                    return <tr key={id} className={current_status}>
                        <td><Link href={`/check_request/detail/${id}`}><a>Detail</a></Link></td>
                        <td>{dateFormat(date)}</td>
                        <td>{current_status}</td>
                        <td>${order_total}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </main>
}
