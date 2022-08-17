import { CREATE_CHECK_REQ } from "../../graphql/mutations"

import GrantSelect from "../../components/grantSelect";
import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react";
import ReceiptUpload from "../../components/receiptUpload";
import VendorInput from "../../components/vendorInput";
import PurchaseInput from "../../components/purchaseInput";
export default function CreateRequest() {
    // {
    //     "user_id": "2374fc70-737b-4bae-96e0-aeb44721e0ae",
    //     "request": {
    //       "date": "1203jflds",
    //       "description": "test",
    //       "grant_id": "test",
    //       "receipts": ["", ""],
    //       "credit_card": "string",
    //       "purchases": [
    //         {
    //           "grant_line_item": "test1",
    //           "description": "description",
    //           "amount": 10.9
    //         }
    //       ]
    //     },
    //     "vendor": {
    //       "name": "test",
    //       "address": {
    //         "website": "",
    //         "street": "",
    //         "city": "",
    //         "state": "",
    //         "zip": 111
    //       }
    //     }
    //   }
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
        const purchaseArr = [{ grant_line_item: "", description: "", amount: 0.0 }]
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
                    credit_card: creditCard
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
