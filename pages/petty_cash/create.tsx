import { useState } from "react";
import GrantSelect from "../../components/grantSelect";
import { CREATE_PETTY_CASH } from "../../graphql/mutations";
import ReceiptUpload from "../../components/receiptUpload";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { useSession } from "next-auth/react";
import createClient from "../../graphql/client";
import CategorySelect from "../../components/categorySelect";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { GET_GRANTS } from "../../graphql/queries";
import { authOptions } from "../api/auth/[...nextauth]";
import { GrantInfo } from "../../types/grants";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const sessionData = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const jwt = sessionData?.user.token;
  const client = createClient(jwt);
  const res = await client.query({ query: GET_GRANTS });
  return {
    props: {
      grant_data: sessionData ? res.data.all_grants : [],
      jwt: jwt ? jwt : "",
    },
  };
};
export default function CreateRequest({
  grant_data,
}: {
  grant_data: GrantInfo[];
}) {
  const router = useRouter();
  const { data } = useSession();
  const jwt = data?.user.token;
  const [receipts, setReceipts] = useState([]);
  const [requestDate, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0.0);
  const [grantID, setGrantID] = useState("");
  const [category, setCategory] = useState("");
  const submitRequest = async (e: any) => {
    e.preventDefault();
    if (requestDate === "") {
      alert("enter valid request date");
      return;
    }
    if (description === "") {
      alert("add a description");
      return;
    }
    if (category === "") {
      alert("select a request category");
      return;
    }
    if (grantID === "") {
      alert("select a grant");
      return;
    }
    if (amount === 0.0) {
      alert("add an amount");
      return;
    }
    const client = createClient(jwt);
    const res = await client.mutate({
      mutation: CREATE_PETTY_CASH,
      variables: {
        grant_id: grantID,
        request: {
          category: category,
          amount: amount,
          description: description,
          receipts: receipts,
          date: requestDate,
        },
      },
    });
    res.data.create_petty_cash.created_at ? router.push("/me") : null;
  };
  return (
    <main className={styles.container}>
      <form id="petty-cash-form">
        <GrantSelect
          state={grantID}
          setState={setGrantID}
          grants={grant_data}
        />
        <CategorySelect state={category} setState={setCategory} />
        <h4>Amount</h4>
        <input
          type="number"
          onChange={(e: any) => setAmount(parseFloat(e.target.value))}
        />
        <h4>Date</h4>
        <input
          type="date"
          name="date"
          onChange={(e: any) => setDate(new Date(e.target.value).toISOString())}
        />
        <h4>Description</h4>
        <textarea
          rows={5}
          maxLength={75}
          name="description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
        />
        <br />
        <span>{description.length}/75 characters</span>
        <div className="hr" />
        <h3>Receipts</h3>
        <span className="description">
          Limit 5 Receipts in PNG or JPEG Format
        </span>
        <ReceiptUpload receipts={receipts} setReceipts={setReceipts} />
        <br />
        <button className="submit" onClick={submitRequest}>
          Submit Request
        </button>
      </form>
    </main>
  );
}
