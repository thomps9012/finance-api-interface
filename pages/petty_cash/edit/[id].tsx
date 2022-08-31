import { gql } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import createClient from "../../../graphql/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import jwt_decode from "jwt-decode";
import { PettyCashDetail } from "../../../types/pettycash";
import { useState } from "react";
import styles from '../../../styles/Home.module.css';
import GrantSelect from "../../../components/grantSelect";
import ReceiptUpload from "../../../components/receiptUpload";
import dateFormat from "../../../utils/dateformat";
const PETTY_CASH_DETAIL = gql`query PettyCashDetail($id: ID!){
    petty_cash_detail(id: $id) {
      id
      grant_id
      date
      description
      amount
      receipts
    }
  }`;
const EDIT_PETTY_CASH = gql`mutation editPettyCash($request_id: ID!, $grant_id: ID!, $request: PettyCashInput!){
    edit_petty_cash(request_id: $request_id, grant_id: $grant_id, request: $request){
        id
        action_history {
            id
            status
            created_at
        }
        current_status
    }
}
`;
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token;
    const client = createClient(jwt);
    const res = await client.query({ query: PETTY_CASH_DETAIL, variables: { id } })
    return {
        props: {
            recorddata: sessionData ? res.data.petty_cash_detail : [],
            jwt: jwt ? jwt : ""
        }
    }
}

export default function EditRecord({ recorddata, jwt }: { jwt: string, recorddata: PettyCashDetail }) {
    const router = useRouter();
    const [receipts, setReceipts] = useState(recorddata.receipts);
    const [requestDate, setDate] = useState(recorddata.date)
    const [description, setDescription] = useState(recorddata.description)
    const [amount, setAmount] = useState(recorddata.amount)
    const [grantID, setGrantID] = useState(recorddata.grant_id)
    const submitEdit = async (e: any) => {
        e.preventDefault();
        const client = createClient(jwt);
        const res = await client.mutate({
            mutation: EDIT_PETTY_CASH, variables: {
                request_id: recorddata.id, 
                grant_id: grantID, 
                request: {
                    amount: amount,
                    description: description,
                    receipts: receipts,
                    date: requestDate
                }
            }
        })
        res.data.edit_petty_cash.current_status ? router.push(`/petty_cash/detail/${res.data.edit_petty_cash.id}`) : null;
    }
    return <main className={styles.main}>
        <form id='petty-cash-form'>
            <GrantSelect state={grantID} setState={setGrantID} />
            <h4>Amount</h4>
            <input type="number" value={amount} onChange={(e: any) => setAmount(parseFloat(e.target.value))} />
            <h4>Date {dateFormat(requestDate)}</h4>
            <input type="date" value={requestDate} name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
            <h4>Description</h4>
            <textarea rows={5} maxLength={75} name="description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
            <br />
            <span>{description.length}/75 characters</span>
            <h4>{receipts.length} Attached</h4>
            <span className="description">Limit of 5 Receipts per Request</span>
            <span className="description">Allowed File Types are .png, .jpg</span>
            <ReceiptUpload receipts={receipts.map((receipt: any, i: number) => receipt= {data_url: receipt, file: {name: 'image'+i}})} setReceipts={setReceipts} />
            <br />
            <button className='submit' onClick={submitEdit}>Resubmit Request</button>
        </form>
    </main>
}