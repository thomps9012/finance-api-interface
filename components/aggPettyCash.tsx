import Link from "next/link";
import { PettyCashOverview } from "../types/pettycash";
export default function AggPettyCash({ petty_cash }: { petty_cash: PettyCashOverview }) {
    const { receipts, request_ids, total_amount } = petty_cash;
    if (total_amount === 0) { return <h5>No Requests</h5> }
    return <>
        <h5>Total Petty Cash Amount: {total_amount}</h5>
        <h5>Requests</h5>
        {request_ids.map((id: string) => <><Link href={`/petty_cash/detail/${id}`}><a>Record Detail</a></Link><br /></>)}
        <h5>Receipts</h5>
        {receipts.map((receipt_url: string) => {
            <img src={receipt_url} />
        })}
    </>

}