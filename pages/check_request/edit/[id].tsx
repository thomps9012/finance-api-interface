import { gql } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import GrantSelect from "../../../components/grantSelect";
import PurchaseInput from "../../../components/purchaseInput";
import ReceiptUpload from "../../../components/receiptUpload";
import VendorInput from "../../../components/vendorInput";
import createClient from "../../../graphql/client";
import { CheckDetail } from "../../../types/checkrequests";
import { authOptions } from "../../api/auth/[...nextauth]";
import styles from '../../../styles/Home.module.css';
import dateFormat from "../../../utils/dateformat";

const EDIT_CHECK_REQUEST = gql`mutation editCheckRequest($request_id: ID!, $grant_id: ID!, $request: CheckRequestInput!) {
    edit_check_request(request_id: $request_id, grant_id: $grant_id, request: $request){
        id
        current_status
    }
}`

const CHECK_DETAIL = gql`query checkDetail($id: ID!){
    check_request_detail(id: $id) {
      id
      grant_id
      date
      vendor {
        name
        address {
          website
          street
          city
          state
          zip
        }
      }
      description
      purchases {
        amount
        description
        grant_line_item
      }
      receipts
      order_total
      credit_card
    }
  }`;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token
    const client = createClient(jwt);
    const res = await client.query({ query: CHECK_DETAIL, variables: { id } })
    return {
        props: {
            recorddata: sessionData ? res.data.check_request_detail : [],
            jwt: jwt ? jwt : ""
        }
    }
}

export default function EditCheckRequest({ recorddata, jwt }: { recorddata: CheckDetail, jwt: string }) {
    const router = useRouter();
    const [receipts, setReceipts] = useState(recorddata.receipts);
    const [grantID, setGrantID] = useState(recorddata.grant_id)
    const [vendorName, setVendorName] = useState(recorddata.vendor.name)
    const [vendorAddress, setVendorAddress] = useState(recorddata.vendor.address)
    const [creditCard, setCreditCard] = useState(recorddata.credit_card)
    const [requestDate, setDate] = useState(recorddata.date)
    const [rowCount, setRows] = useState(recorddata.purchases.length)
    const [description, setDescription] = useState(recorddata.description)
    console.log(recorddata.purchases)
    const addPurchase = (e: any) => { e.preventDefault(); rowCount < 5 ? setRows(rowCount + 1) : null }
    const removePurchase = (e: any) => { e.preventDefault(); setRows(rowCount - 1) }
    const submitEdit = async (e: any) => {
        e.preventDefault();
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
            mutation: EDIT_CHECK_REQUEST,
            variables: {
                request_id: recorddata.id,
                grant_id: grantID,
                request: {
                    receipts: receipts,
                    date: requestDate,
                    purchases: purchaseArr,
                    credit_card: creditCard,
                    description: description
                }
            }
        })
        res.data.edit_check_request.id ? router.push(`/check_request/detail/${res.data.edit_check_request.id}`) : null
    }
    return <main className={styles.main}>
        <form>
            <h4>Grant</h4>
            <GrantSelect state={grantID} setState={setGrantID} />
            <h4>Date {dateFormat(requestDate)}</h4>
            <input type="date" value={requestDate} name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
            <h4>Description</h4>
            <textarea rows={5} maxLength={75} name="description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
            <br />
            <span>{description.length}/75 characters</span>
            <VendorInput setAddress={setVendorAddress} setName={setVendorName} name={vendorName} address={vendorAddress} />
            <h3>Purchases</h3>
            <span className="description">Limit of 5 Purchases per Request</span>
            <br />
            <br />
            <PurchaseInput purchase={recorddata.purchases[0]} />
            <hr />
            {rowCount >= 2 && <><PurchaseInput purchase={recorddata.purchases[1] ? recorddata.purchases[1] : {grant_line_item: '', description: '', amount: 0.0}} /><hr /></>}
            {rowCount >= 3 && <><PurchaseInput purchase={recorddata.purchases[2] ? recorddata.purchases[2] : {grant_line_item: '', description: '', amount: 0.0}} /><hr /></>}
            {rowCount >= 4 && <><PurchaseInput purchase={recorddata.purchases[3] ? recorddata.purchases[3] : {grant_line_item: '', description: '', amount: 0.0}} /><hr /></>}
            {rowCount >= 5 && <><PurchaseInput purchase={recorddata.purchases[4] ? recorddata.purchases[4] : {grant_line_item: '', description: '', amount: 0.0}} /><hr /></>}
            <br />
            <button onClick={addPurchase}>Add</button>
            <button onClick={removePurchase}>Remove Last</button>
            <h3>Company Credit Card Used</h3>
            <select name='creditCard' value={creditCard} onChange={(e: any) => setCreditCard(e.target.value)}>
                <option value="" disabled hidden>Select Credit Card..</option>
                <option value="N/A">No Card</option>
                <option value="1234">Card 1</option>
                <option value="5678">Card 2</option>
            </select>
            <h4>{receipts.length} Attached</h4>
            <span className="description">Limit of 5 Receipts per Request</span>
            <span className="description">Allowed File Types are .png, .jpg, .pdf</span>
            <ReceiptUpload receipts={receipts} setReceipts={setReceipts} />
            <br />
            <button className='submit' onClick={submitEdit}>Resubmit Request</button>
        </form>
    </main>
}