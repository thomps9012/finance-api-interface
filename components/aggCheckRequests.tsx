import Link from "next/link";
import { CheckDetail, CheckRequestOverview, Vendor } from "../types/checkrequests";
import dateFormat from "../utils/dateformat";
import styles from '../styles/Home.module.css'
import { useSession } from "next-auth/react";
export default function AggCheckRequests({ check_requests }: { check_requests: CheckRequestOverview }) {
    const { requests, total_amount, vendors } = check_requests;
    const session = useSession();
    const user_name = session?.data?.user.name;
    if (total_amount === 0) { return <main className={styles.main}><h1>No Check Requests for {user_name}</h1></main> }
    return <main className={styles.main}>
        <h1>{user_name} Check Requests</h1>
        <h2>Total Amount: ${Math.floor(total_amount).toPrecision(4)}</h2>
        <div className="hr" />
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {vendors?.map((vendor: Vendor) => <div key={vendor.name} className={styles.card}>
                <h2>{vendor.name}</h2>
                <p>{vendor.address.street}</p>
                <p>{vendor.address.city}, {vendor.address.state}</p>
                <p>{vendor.address.website}</p>
            </div>)}
        </div>
        <div className="hr" />
        <table>
            <thead>
                <th className='table-cell'>Date</th>
                <th className='table-cell'>Status</th>
                <th className='table-cell'>Items</th>
                <th className='table-cell'>Total</th>
            </thead>
            <tbody>
                {requests.map((request: CheckDetail) => {
                    const { id, date, current_status, order_total, purchases } = request;
                    return <Link key={id} href={`/check_request/detail/${id}`}>
                        <tr id='table-row' className={current_status}>
                            <td className='table-cell'>{dateFormat(date)}</td>
                            <td className='table-cell'>{current_status}</td>
                            <td className='table-cell'>{purchases.length}</td>
                            <td className='table-cell'>${Math.floor(order_total).toPrecision(4)}</td>
                        </tr>
                    </Link>
                })}
            </tbody>
        </table>
    </main>
}
