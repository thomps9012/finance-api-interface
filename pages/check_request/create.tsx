import { CREATE_CHECK_REQ } from "../../graphql/mutations"

import GrantSelect from "../../components/grantSelect";
import { useMutation } from "@apollo/client"
import { useState } from "react";
import ReceiptUpload from "../../components/receiptUpload";
import VendorInput from "../../components/vendorInput";
import PurchaseInput from "../../components/purchaseInput";
export default function CreateRequest() {
    const [addRequest, { data, loading, error }] = useMutation(CREATE_CHECK_REQ)
    const [receipts, setReceipts] = useState([]);
    const [grantID, setGrantID] = useState("N/A")
    const [vendorName, setVendorName] = useState("")
    const [vendorAddress, setVendorAddress] = useState({
        website: "",
        street: "",
        city: "",
        state: "",
        zip: 12345
    })
    const [creditCard, setCreditCard] = useState("N/A")
    const [requestDate, setDate] = useState("")
    const [rowCount, setRows] = useState(1)
    const [description, setDescription] = useState("")
    const handleDescription = (e: any) => {
        e.target.value.length < 76 &&
            setDescription(e.target.value)
    }
    const addPurchase = (e: any) => { e.preventDefault(); rowCount < 5 ? setRows(rowCount + 1) : null }
    const removePurchase = (e: any) => { e.preventDefault(); setRows(rowCount - 1) }
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    const submitRequest = async (e: any) => {
        e.preventDefault();
        const receiptArr: string[] = receipts.map((receipt: any) => receipt.data_url)
        if (grantID === "") { alert('select a grant'); return }
        const testUserID = '68125e1f-21c1-4f60-aab0-8efff5dc158e'
        console.log(requestDate)
        let purchaseArr = [];
        const purchaseRows = document.getElementsByClassName('purchase-row');
        for (let i = 0; i < purchaseRows.length; i++) {
            const purchaseData = Object.fromEntries(new FormData(purchaseRows[i] as HTMLFormElement))
            purchaseArr.push(purchaseData)

        }
        addRequest({
            variables: {
                user_id: testUserID,
                vendor: {
                    name: vendorName,
                    address: vendorAddress
                },
                request: {
                    grant_id: grantID,
                    receipts: receiptArr,
                    date: requestDate,
                    purchases: purchaseArr,
                    credit_card: creditCard,
                    description: description
                }
            }
        })
        console.log(data)
    }

    return <form>
        <h4>Grant</h4>
        <GrantSelect state={grantID} setState={setGrantID} />
        <h4>Date</h4>
        <input type="date" name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
        <h4>Description</h4>
        <textarea rows={5} name="description" value={description} onChange={handleDescription} />
        <span>{description.length}/75 characters</span>
        <VendorInput setAddress={setVendorAddress} setName={setVendorName} address={vendorAddress} />
        <h3>Purchases</h3>
        <span className="description">Limit of 5 Purchases per Request</span>
        <br />
        <button onClick={addPurchase}>Add</button>
        <button onClick={removePurchase}>Remove Last</button>
        <PurchaseInput />
        {rowCount >= 2 && <PurchaseInput />}
        {rowCount >= 3 && <PurchaseInput />}
        {rowCount >= 4 && <PurchaseInput />}
        {rowCount >= 5 && <PurchaseInput />}
        <h3>Credit Card Used</h3>
        <select name='creditCard' onChange={(e: any) => setCreditCard(e.target.value)} defaultValue="">
            <option value="" disabled hidden>Select Credit Card..</option>
            <option value="N/A">No Card</option>
            <option value="1234">Card 1</option>
            <option value="5678">Card 2</option>
        </select>
        <h4>{receipts.length} Receipt{receipts.length > 1 && "s"} Attached</h4>
        <span className="description">Limit of 5 Receipts per Request</span>
        <ReceiptUpload receipts={receipts} setReceipts={setReceipts} />
        <br />
        <button className='submit' onClick={submitRequest}>Submit Request</button>
    </form>
}
