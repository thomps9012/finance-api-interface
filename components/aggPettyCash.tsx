import Link from "next/link";
import { PettyCashDetail, PettyCashOverview } from "../types/pettycash";
import dateFormat from "../utils/dateformat";
import styles from '../styles/Home.module.css';
export default function AggPettyCash({ petty_cash }: { petty_cash: PettyCashOverview }) {
    const { receipts, requests, total_amount } = petty_cash;
    if (total_amount === 0) { return <h1>No Requests</h1> }
    return <main className={styles.main}>
        <h1>Total Petty Cash Amount: {total_amount}</h1>
        <h1>Requests</h1>
        <table>
            <thead>
                <th>Link</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
            </thead>
            <tbody>
                {requests.map((request: PettyCashDetail) => {
                    const { id, date, current_status, amount } = request;
                    return <tr key={id} className={current_status}>
                        <tr><Link href={`/petty_cash/detail/${id}`}><a>Detail</a></Link></tr>
                        <td>{dateFormat(date)}</td>
                        <td>{current_status}</td>
                        <td>${amount}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </main>

}