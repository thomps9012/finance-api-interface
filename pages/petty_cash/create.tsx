import { useState } from "react";
import GrantSelect from "../../components/grantSelect";
import { CREATE_PETTY_CASH } from "../../graphql/mutations";
import ReceiptUpload from "../../components/receiptUpload";
import { useRouter } from "next/router";
import styles from '../../styles/Home.module.css'
import { useSession } from "next-auth/react";
import createClient from "../../graphql/client";

export default function CreateRequest() {
    const router = useRouter();
    const { data } = useSession();
    const jwt = data?.user.token;
    const [receipts, setReceipts] = useState([]);
    const [requestDate, setDate] = useState("")
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(0.0)
    const [grantID, setGrantID] = useState("N/A")
    const submitRequest = async (e: any) => {
        e.preventDefault();
        const receiptArr: string[] = receipts.map((receipt: any) => receipt.data_url)
        if (description.length === 0) { alert('add a description'); return }
        if (grantID === "") { alert('select a grant'); return }
        if (amount === 0.0) { alert('add an amount'); return }
        const client = createClient(jwt);
        const res = await client.mutate({
            mutation: CREATE_PETTY_CASH,
            variables: {
                grant_id: grantID,
                request: {
                    amount: amount,
                    description: description,
                    receipts: receiptArr,
                    date: requestDate
                }
            }
        })
        res.data.create_petty_cash.created_at ? router.push('/me') : null;
    }
    return <main className={styles.main}>
        <form id='petty-cash-form'>
            <GrantSelect state={grantID} setState={setGrantID} />
            <h4>Amount</h4>
            <input type="number" onChange={(e: any) => setAmount(parseFloat(e.target.value))} />
            <h4>Date</h4>
            <input type="date" name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
            <h4>Description</h4>
            <textarea rows={5} maxLength={75} name="description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
            <br />
            <span>{description.length}/75 characters</span>
            <h4>{receipts.length} Receipt{receipts.length > 1 && "s"} Attached</h4>
            <span className="description">Limit of 5 Receipts per Request</span>
            <span className="description">Allowed File Types are .png, .jpg, .pdf</span>
            <ReceiptUpload receipts={receipts} setReceipts={setReceipts} />
            <br />
            <button className='submit' onClick={submitRequest}>Submit Request</button>
        </form>
    </main>
}