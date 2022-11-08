export default function ApproveRejectRow({
  execReview,
  setExecReview,
  approveRequest,
  rejectRequest,
  user_permissions,
}: {
  execReview: boolean;
  setExecReview: any;
  approveRequest: any;
  rejectRequest: any;
  user_permissions: string[];
}) {
  return (
    <section>
      <div className="hr" />
      <br />
      <div className="button-row">
        <input
          name="exec_review"
          className="check-box"
          type="checkbox"
          onClick={() => setExecReview(!execReview)}
        />
        <label className="check-box-label">Flag for Executive Review</label>
      </div>
      <div
        className="button-row"
        style={{ display: user_permissions.length > 1 ? "block" : "none" }}
      >
        <label className="check-box-label">Approve as</label>
        <select
          defaultValue={user_permissions[0]}
          style={{ width: "55%" }}
          id="selected_permission"
        >
          {user_permissions.map((permission: string) => (
            <option value={permission} key={permission}>{permission}</option>
          ))}
        </select>
      </div>
      <div className="button-row">
        <a onClick={approveRequest} className="approve-btn">
          Approve
        </a>
        <a onClick={rejectRequest} className="reject-btn">
          Reject
        </a>
      </div>
    </section>
  );
}
