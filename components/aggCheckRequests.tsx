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
                <th className='table-cell'>Link</th>
                <th className='table-cell'>Date</th>
                <th className='table-cell'>Status</th>
                <th className='table-cell'>Total</th>
            </thead>
            <tbody>
                {requests.map((request: CheckDetail) => {
                    const { id, date, current_status, order_total } = request;
                    return <tr id='table-row' key={id} className={current_status}>
                        <td className='table-cell'><Link href={`/check_request/detail/${id}`}><a>Detail</a></Link></td>
                        <td className='table-cell'>{dateFormat(date)}</td>
                        <td className='table-cell'>{current_status}</td>
                        <td className='table-cell'>${order_total}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </main>
}
