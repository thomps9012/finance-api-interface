export default function ApproveRejectRow({
  execReview,
  setExecReview,
  approveRequest,
  rejectRequest,
}: {
  execReview: boolean;
  setExecReview: any;
  approveRequest: any;
  rejectRequest: any;
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
