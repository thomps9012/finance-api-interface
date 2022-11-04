import Link from "next/link";
import { PettyCashDetail, UserPettyCash } from "../types/pettycash";
import dateFormat from "../utils/dateformat";
import styles from '../styles/Home.module.css';
export default function AggPettyCash({ petty_cash }: { petty_cash: UserPettyCash }) {
    const { requests, total_amount } = petty_cash;
    if (total_amount === 0) { return <main className={styles.main}><h1>No Petty Cash Requests for {petty_cash.user.name}</h1> </main>}
    return <main className={styles.main}>
        <h1>{petty_cash.user.name} Petty Cash</h1>
        <h2>Total Amount - ${total_amount}</h2>
        <div className="hr" />
        <table>
            <thead>
                <th className='table-cell'>Date</th>
                <th className='table-cell'>Status</th>
                <th className='table-cell'>Category</th>
                <th className='table-cell'>Amount</th>
            </thead>
            <tbody>
                {requests.map((request: PettyCashDetail) => {
                    const { id, date, current_status, amount, category } = request;
                    return <Link key={id} href={`/petty_cash/detail/${id}`}>
                        <tr id='table-row' className={current_status}>
                            <td className='table-cell'>{dateFormat(date)}</td>
                            <td className='table-cell'>{current_status}</td>
                            <td className='table-cell'>{category}</td>
                            <td className='table-cell'>${amount}</td>
                        </tr>
                    </Link>
                })}
            </tbody>
        </table>
    </main>

}