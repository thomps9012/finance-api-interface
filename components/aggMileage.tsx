import Link from "next/link";
import { MileageDetail, MileageOverview } from "../types/mileage";
import dateFormat from "../utils/dateformat";
import styles from '../styles/Home.module.css';
export default function AggMileage({ mileage_requests }: { mileage_requests: MileageOverview }) {
    const { mileage, requests, parking, tolls, reimbursement } = mileage_requests;
    if (mileage === 0) { return <h1>No Requests</h1> }
    return <main className={styles.main}>
        <h1>Total Mileage: {mileage}</h1>
        <div style={{ display: 'flex' }}>
            <h1 style={{ margin: 5, padding: 5 }}>Parking: {parking}</h1>
            <h1 style={{ margin: 5, padding: 5 }}>Tolls: {tolls}</h1>
            <h1 style={{ margin: 5, padding: 5 }}>Total Reimbursement: {reimbursement}</h1>
        </div>
        <h1>Requests</h1>
        <table>
            <thead>
                <th>Link</th>
                <th>Date</th>
                <th>Status</th>
                <th>Mileage</th>
                <th>Reimbursement</th>
            </thead>
            <tbody>
                {requests.map((request: MileageDetail) => {
                    const { id, date, current_status, trip_mileage, reimbursement } = request;
                    return <tr key={id} className={current_status}>
                        <td>
                            <Link href={`/mileage/detail/${id}`}><a>Trip Detail</a></Link><br />
                        </td>
                        <td>{dateFormat(date)}</td>
                        <td>{current_status}</td>
                        <td>{trip_mileage}</td>
                        <td>${reimbursement}</td>
                    </tr>
                }
                )}
            </tbody>
        </table>
    </main>
}