import Link from "next/link";
import { MileageDetail, UserMileage } from "../types/mileage";
import dateFormat from "../utils/dateformat";
import styles from "../styles/Home.module.css";
export default function AggMileage({
  mileage_requests,
}: {
  mileage_requests: UserMileage;
}) {
  const { mileage, requests, reimbursement } = mileage_requests;
  if (mileage === 0) {
    return (
      <main className={styles.main}>
        <h1>No Mileage Requests for {mileage_requests.user.name}</h1>
      </main>
    );
  }
  return (
    <main className={styles.main}>
      <h1>{mileage_requests.user.name} Mileage</h1>
      <h2>Total Reimbursement - ${reimbursement}</h2>
      <div className="hr" />
      <table>
        <thead>
          <th className="table-cell">Date</th>
          <th className="table-cell">Status</th>
          <th className="table-cell">Category</th>
          <th className="table-cell">Reimbursement</th>
        </thead>
        <tbody>
          {requests.map((request: MileageDetail) => {
            const {
              id,
              date,
              current_status,
              created_at,
              category,
              reimbursement,
            } = request;
            return (
              <Link key={id} href={`/mileage/detail/${id}`}>
                <tr id="table-row" className={current_status}>
                  <td className="table-cell">{dateFormat(date)}</td>
                  <td className="table-cell">{current_status}</td>
                  <td className="table-cell">{category}</td>
                  <td className="table-cell">
                    ${Math.floor(reimbursement).toPrecision(4)}
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
