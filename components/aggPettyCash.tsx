import Link from "next/link";
import { PettyCashDetail, PettyCashOverview } from "../types/pettycash";
import dateFormat from "../utils/dateformat";
import styles from '../styles/Home.module.css';
import { useSession } from "next-auth/react";
export default function AggPettyCash({ petty_cash }: { petty_cash: PettyCashOverview }) {
    const { requests, total_amount } = petty_cash;
    const session = useSession();
    const user_name = session?.data?.user.name;
    if (total_amount === 0) { return <h1>No Petty Cash Requests for {user_name}</h1> }
    return <main className={styles.main}>
        <h1>{user_name} Petty Cash</h1>
        <div className="hr" />
        <h1>Total Amount: ${Math.floor(total_amount).toPrecision(4)}</h1>
        <table>
            <thead>
                <th className='table-cell'>Date</th>
                <th className='table-cell'>Status</th>
                <th className='table-cell'>Amount</th>
            </thead>
            <tbody>
                {requests.map((request: PettyCashDetail) => {
                    const { id, date, current_status, amount } = request;
                    return <Link key={id} href={`/petty_cash/detail/${id}`}>
                        <tr id='table-row' className={current_status}>
                            <td className='table-cell'>{dateFormat(date)}</td>
                            <td className='table-cell'>{current_status}</td>
                            <td className='table-cell'>${amount}</td>
                        </tr>
                    </Link>
                })}
            </tbody>
        </table>
    </main>

}