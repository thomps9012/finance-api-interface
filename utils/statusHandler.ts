export default function StatusHandler({
  user_permissions,
  exec_review,
}: {
  user_permissions: string[];
  exec_review: boolean;
}) {
  const user_permission = user_permissions[0];
  if (exec_review && user_permission === "FINANCE_TEAM") {
    return "FINANCE_APPROVED";
  }
  switch (user_permission) {
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
