import { CREATE_CHECK_REQ } from "../../graphql/mutations"
import GrantSelect from "../../components/grantSelect";
import { useState } from "react";
import ReceiptUpload from "../../components/receiptUpload";
import VendorInput from "../../components/vendorInput";
import PurchaseInput from "../../components/purchaseInput";
import { useRouter } from "next/router";
import createClient from "../../graphql/client";
import { useSession } from "next-auth/react";
import styles from '../../styles/Home.module.css';
export default function CreateRequest() {
    const router = useRouter();
    const { data } = useSession();
    const jwt = data?.user.token;
    const [receipts, setReceipts] = useState([]);
    const [grantID, setGrantID] = useState("N/A")
    const [vendorName, setVendorName] = useState("test vendor")
    const [vendorAddress, setVendorAddress] = useState({
        website: "www.test.com",
        street: "123 st",
        city: "Test City",
        state: "TN",
        zip: 12345
    })
    const [creditCard, setCreditCard] = useState("N/A")
    const [requestDate, setDate] = useState("")
    const [rowCount, setRows] = useState(1)
    const [description, setDescription] = useState("test description")
    const addPurchase = (e: any) => { e.preventDefault(); rowCount < 5 ? setRows(rowCount + 1) : null }
    const removePurchase = (e: any) => { e.preventDefault(); setRows(rowCount - 1) }
    const submitRequest = async (e: any) => {
        e.preventDefault();
        const receiptArr: string[] = receipts.map((receipt: any) => receipt.data_url)
        if (grantID === "") { alert('select a grant'); return }
        console.log(requestDate)
        let purchaseArr = [];
        const purchaseRows = document.getElementsByClassName('purchase-row');
        for (let i = 0; i < purchaseRows.length; i++) {
            const purchaseData = Object.fromEntries(new FormData(purchaseRows[i] as HTMLFormElement))
            purchaseArr.push(purchaseData)

        }
        const client = createClient(jwt);
        const res = await client.mutate({
            mutation: CREATE_CHECK_REQ,
            variables: {
                vendor: {
                    name: vendorName,
                    address: vendorAddress
                },
                grant_id: grantID,
                request: {
                    receipts: receiptArr,
                    date: requestDate,
                    purchases: purchaseArr,
                    credit_card: creditCard,
                    description: description
                }
            }
        })
        res.data.create_check_request.created_at ? router.push('/me') : null;
    }

    return <main className={styles.main}>
        <form>
            <h4>Grant</h4>
            <GrantSelect state={grantID} setState={setGrantID} />
            <h4>Date</h4>
            <input type="date" name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
            <h4>Description</h4>
            <textarea rows={5} maxLength={75} name="description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
            <br />
            <span>{description.length}/75 characters</span>
            <VendorInput setAddress={setVendorAddress} setName={setVendorName} address={vendorAddress} />
            <h3>Purchases</h3>
            <span className="description">Limit of 5 Purchases per Request</span>
            <br />
            <br />
            <PurchaseInput />
            <hr />
            {rowCount >= 2 && <><PurchaseInput /><hr /></>}
            {rowCount >= 3 && <><PurchaseInput /><hr /></>}
            {rowCount >= 4 && <><PurchaseInput /><hr /></>}
            {rowCount >= 5 && <><PurchaseInput /><hr /></>}
            <br />
            <button onClick={addPurchase}>Add</button>
            <button onClick={removePurchase}>Remove Last</button>
            <h3>Company Credit Card Used</h3>
            <select name='creditCard' value={creditCard} onChange={(e: any) => setCreditCard(e.target.value)} defaultValue="">
                <option value="" disabled hidden>Select Credit Card..</option>
                <option value="N/A">No Card</option>
                <option value="1234">Card 1</option>
                <option value="5678">Card 2</option>
            </select>
            <h4>{receipts.length} Receipt{receipts.length === 0 && 's'}{receipts.length > 1 && "s"} Attached</h4>
            <span className="description">Limit of 5 Receipts per Request</span>
            <ReceiptUpload receipts={receipts} setReceipts={setReceipts} />
            <br />
            <button className='submit' onClick={submitRequest}>Submit Request</button>
        </form>
    </main>
}
