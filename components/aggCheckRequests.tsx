import Link from "next/link";
import { CheckDetail, UserCheckRequests, Vendor } from "../types/checkrequests";
import dateFormat from "../utils/dateformat";
import styles from "../styles/Home.module.css";
export default function AggCheckRequests({
  check_requests,
}: {
  check_requests: UserCheckRequests;
}) {
  const { requests, total_amount } = check_requests;
  if (total_amount === 0) {
    return (
      <main className={styles.main}>
        <h1>No Check Requests for {check_requests.user.name}</h1>
      </main>
    );
  }
  return (
    <main className={styles.main}>
      <h1>{check_requests.user.name} Check Requests</h1>
      <h2>Total Amount - ${Math.floor(total_amount).toPrecision(4)}</h2>
      <div className="hr" />
      <table>
        <thead>
          <th className="table-cell">Date</th>
          <th className="table-cell">Status</th>
          <th className="table-cell">Category</th>
          <th className="table-cell">Total</th>
        </thead>
        <tbody>
          {requests.map((request: CheckDetail) => {
            const {
              id,
              date,
              current_status,
              order_total,
              category,
              created_at,
            } = request;
            return (
              <Link key={id} href={`/check_request/detail/${id}`}>
                <tr id="table-row" className={current_status}>
                  <td className="table-cell">{dateFormat(date)}</td>
                  <td className="table-cell">{current_status}</td>
                  <td className="table-cell">{category}</td>
                  <td className="table-cell">
                    ${Math.floor(order_total).toPrecision(4)}
                  </td>
                </tr>
              </Link>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
