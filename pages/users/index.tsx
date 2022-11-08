import { NextApiRequest, NextApiResponse } from "next";
import Link from "next/link";
import createClient from "../../graphql/client";
import { UserInfo } from "../../types/users";
import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";
import { ALL_USERS } from "../../graphql/queries";
import { getCookie } from "cookies-next";

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const jwt = getCookie("jwt", { req, res });
  const client = createClient(jwt);
  const response = await client.query({ query: ALL_USERS });
  console.log(response.data, "userdata on server");
  return {
    props: {
      userdata: jwt != undefined ? response.data.all_users : [],
    },
  };
};

export default function UsersInfo({ userdata }: { userdata: UserInfo[] }) {
  const [userList, setUserList] = useState(userdata);
  const [selectedPermissions, setSelectedPermissions] = useState([
    "FINANCE_TEAM",
    "EXECUTIVE",
    "SUPERVISOR",
    "MANAGER",
    "EMPLOYEE",
  ]);
  useEffect(() => {
    let filteredUsers: any[] = [];
    for (const item in selectedPermissions) {
      console.log(selectedPermissions[item]);
      filteredUsers.push(
        userdata.filter((user: UserInfo) =>
          user.permissions.includes(selectedPermissions[item])
        )
      );
    }
    setUserList(filteredUsers.flatMap((x) => x));
  }, [selectedPermissions]);
  const handleChange = (e: any) => {
    const elements = e.target.children;
    const emptyArr = [];
    for (let i = 0; i < elements.length; i++) {
      elements[i].selected && emptyArr.push(elements[i].value);
    }
    setSelectedPermissions(emptyArr);
  };
  return (
    <main className={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Active Users</h1>
        <div style={{ flexDirection: "column", margin: 10 }}>
          <h3>Filter by Role</h3>
          <select
            onChange={handleChange}
            value={selectedPermissions}
            style={{ height: 80 }}
            multiple
          >
            <option value="FINANCE_TEAM">Finance Team Members</option>
            <option value="EXECUTIVE">Executives</option>
            <option value="SUPERVISOR">Supervisors</option>
            <option value="MANAGER">Managers</option>
            <option value="EMPLOYEE">Employees</option>
          </select>
        </div>
      </div>
      <hr />
      {userList.map((user: UserInfo) => {
        const { name, id, email, permissions } = user;
        return (
          <div key={id}>
            <Link href={`/users/${id}/overview`}>
              <a>
                <h3>{name}</h3>
              </a>
            </Link>
            {permissions.map((permission) => (
              <p key={permission}>{permission}</p>
            ))}
            <p>{email}</p>
            <div className="hr" />
          </div>
        );
      })}
    </main>
  );
}
