import Link from "next/link";
import { MileageDetail, MileageOverview } from "../types/mileage";
import dateFormat from "../utils/dateformat";
import styles from '../styles/Home.module.css';
import { useSession } from "next-auth/react";
export default function AggMileage({ mileage_requests }: { mileage_requests: MileageOverview }) {
    const { mileage, requests, parking, tolls, reimbursement } = mileage_requests;
    const session = useSession();
    const user_name = session?.data?.user.name;
    if (mileage === 0) { return <h1>No Requests</h1> }
    return <main className={styles.main}>
        <h1>{user_name} Mileage</h1>
        <h2 >Total Reimbursement - ${reimbursement}</h2>
        <div style={{ display: 'flex' }}>
            <h3 style={{ margin: 5, padding: 5 }}>Total Mileage - {mileage}</h3>
            <h3 style={{ margin: 5, padding: 5 }}>Parking - ${parking}</h3>
            <h3 style={{ margin: 5, padding: 5 }}>Tolls - ${tolls}</h3>
        </div>
        <hr />
        <table>
            <thead>
                <th className='table-cell'>Date</th>
                <th className='table-cell'>Status</th>
                <th className='table-cell'>Mileage</th>
                <th className='table-cell'>Reimbursement</th>
            </thead>
            <tbody>
                {requests.map((request: MileageDetail) => {
                    const { id, date, current_status, trip_mileage, reimbursement } = request;
                    return <Link href={`/mileage/detail/${id}`}>
                        <tr id='table-row' key={id} className={current_status}>
                            <td className='table-cell'>{dateFormat(date)}</td>
                            <td className='table-cell'>{current_status}</td>
                            <td className='table-cell'>{trip_mileage}</td>
                            <td className='table-cell'>${reimbursement}</td>
                        </tr>
                    </Link>
                }
                )}
            </tbody>
        </table>
    </main>
}