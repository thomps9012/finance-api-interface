export default function StatusHandler({
  selected_permission,
  exec_review,
}: {
  selected_permission: string;
  exec_review: boolean;
}) {
  if (exec_review && selected_permission === "FINANCE_TEAM") {
    return "FINANCE_APPROVED";
  }
  switch (selected_permission) {
    case "MANAGER":
      return "MANAGER_APPROVED";
    case "SUPERVISOR":
      return "SUPERVISOR_APPROVED";
    case "EXECUTIVE":
      return "EXECUTIVE_APPROVED";
    case "FINANCE_TEAM":
      return "ORGANIZATION_APPROVED";
    default:
        return "MANAGER_APPROVED"
  }
}
