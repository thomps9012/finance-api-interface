import { useState } from "react";
import { useMutation } from "@apollo/client";
import GrantSelect from "../../components/grantSelect";
import { CREATE_PETTY_CASH } from "../../graphql/mutations";
import ReceiptUpload from "../../components/receiptUpload";
import { useRouter } from "next/router";
export default function CreateRequest() {
    const router = useRouter();
    const [addRequest, { data, loading, error }] = useMutation(CREATE_PETTY_CASH)
    const [receipts, setReceipts] = useState([]);
    const [requestDate, setDate] = useState("")
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(0.0)
    const [grantID, setGrantID] = useState("N/A")
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    const submitRequest = async (e: any) => {
        e.preventDefault();
        const receiptArr: string[] = receipts.map((receipt: any) => receipt.data_url)
        if (description.length === 0) { alert('add a description'); return }
        if (grantID === "") { alert('select a grant'); return }
        if (amount === 0.0) { alert('add an amount'); return }
        const testUserID = '68125e1f-21c1-4f60-aab0-8efff5dc158e'
        console.log(requestDate)
        addRequest({
            variables: {
                user_id: testUserID,
                grant_id: grantID,
                request: {
                    amount: amount,
                    description: description,
                    receipts: receiptArr,
                    date: requestDate
                }
            }
        })
        data && router.push("/")
    }
    return <form>
        <GrantSelect state={grantID} setState={setGrantID} />
        <h4>Amount</h4>
        <input type="number" onChange={(e: any) => setAmount(parseFloat(e.target.value))} />
        <h4>Date</h4>
        <input type="date" name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
        <h4>Description</h4>
        <textarea rows={5} maxLength={75} name="description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
        <span>{description.length}/75 characters</span>
        <h4>{receipts.length} Receipt{receipts.length > 1 && "s"} Attached</h4>
        <span className="description">Limit of 5 Receipts per Request</span>
        <ReceiptUpload receipts={receipts} setReceipts={setReceipts} />
        <br />
        <button className='submit' onClick={submitRequest}>Submit Request</button>
    </form>
}