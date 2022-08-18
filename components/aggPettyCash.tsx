import Link from "next/link";
import { PettyCashDetail, PettyCashOverview } from "../types/pettycash";
import dateFormat from "../utils/dateformat";
export default function AggPettyCash({ petty_cash }: { petty_cash: PettyCashOverview }) {
    const { receipts, requests, total_amount } = petty_cash;
    if (total_amount === 0) { return <h5>No Requests</h5> }
    return <>
        <h5>Total Petty Cash Amount: {total_amount}</h5>
        <h5>Requests</h5>
        {requests.map((request: PettyCashDetail) => {
            const { id, date, current_status } = request;
            return <div key={id}>
                <Link href={`/petty_cash/detail/${id}`}><a>Record Detail</a></Link><br />
                <p>{dateFormat(date)}</p>
                <p>{current_status}</p>
            </div>
        })}
    </>

}