import Link from "next/link";
import { MileageDetail, MileageOverview } from "../types/mileage";
import dateFormat from "../utils/dateformat";
import styles from '../styles/Home.module.css';
import { useSession } from "next-auth/react";
export default function AggMileage({ mileage_requests }: { mileage_requests: MileageOverview }) {
    const { mileage, requests, parking, tolls, reimbursement } = mileage_requests;
    const session = useSession();
    const user_name = session?.data?.user.name;
    if (mileage === 0) { return <h1>No Mileage Requests for {user_name}</h1> }
    return <main className={styles.main}>
        <h1>{user_name} Mileage</h1>
        <table>
        <table>
                <tr><th className='table-cell'>Total Reimbursement</th><td className='table-cell'>${Math.floor(reimbursement).toPrecision(4)}</td><th className='table-cell'>Total Mileage</th><td className='table-cell'>{mileage}</td></tr>
                <tr><th className='table-cell'>Total Tolls</th><td className='table-cell'>{tolls}</td><th className='table-cell'>Total Parking</th><td className='table-cell'>{parking}</td></tr>
            </table>
        </table>
        <div className="hr" />
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
                    return <Link key={id} href={`/mileage/detail/${id}`}>
                        <tr id='table-row' className={current_status}>
                            <td className='table-cell'>{dateFormat(date)}</td>
                            <td className='table-cell'>{current_status}</td>
                            <td className='table-cell'>{trip_mileage}</td>
                            <td className='table-cell'>${Math.floor(reimbursement).toPrecision(4)}</td>
                        </tr>
                    </Link>
                }
                )}
            </tbody>
        </table>
    </main>
}