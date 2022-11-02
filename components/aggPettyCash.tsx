import Link from "next/link";
import { PettyCashDetail, UserPettyCash } from "../types/pettycash";
import dateFormat from "../utils/dateformat";
import styles from '../styles/Home.module.css';
export default function AggPettyCash({ petty_cash }: { petty_cash: UserPettyCash }) {
    const { requests, total_amount } = petty_cash;
    if (total_amount === 0) { return <h1>No Petty Cash Requests for {petty_cash.user.name}</h1> }
    return <main className={styles.main}>
        <h1>{petty_cash.user.name} Petty Cash</h1>
        <div className="hr" />
        <h1>Total Amount: ${Math.floor(total_amount).toPrecision(4)}</h1>
        <table>
            <thead>
                <th className='table-cell'>Date</th>
                <th className='table-cell'>Status</th>
                <th className='table-cell'>Amount</th>
                <th className='table-cell'>Category</th>
                <th className='table-cell'>Created @</th>
            </thead>
            <tbody>
                {requests.map((request: PettyCashDetail) => {
                    const { id, date, current_status, amount, category, created_at } = request;
                    return <Link key={id} href={`/petty_cash/detail/${id}`}>
                        <tr id='table-row' className={current_status}>
                            <td className='table-cell'>{dateFormat(date)}</td>
                            <td className='table-cell'>{current_status}</td>
                            <td className='table-cell'>${amount}</td>
                            <td className='table-cell'>{category}</td>
                            <td className='table-cell'>{dateFormat(created_at)}</td>
                        </tr>
                    </Link>
                })}
            </tbody>
        </table>
    </main>

}