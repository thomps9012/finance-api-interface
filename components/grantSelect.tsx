import { gql } from "@apollo/client";
import { unstable_getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next/types";
import createClient from "../graphql/client";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { GrantInfo } from "../types/grants";

const GET_GRANTS = gql`query AllGrants {
	all_grants{
		__typename
		id
		name
	}
}`

export const getServerSideProps =async (context:GetServerSidePropsContext) => {
    const sessionData = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    )
    const jwt = sessionData?.user.token;
    const client = createClient(jwt)
    const res = await client.query({query: GET_GRANTS})
    return {
        props: {
            grant_data: sessionData ? res.data.all_grants : [],
            jwt: jwt ? jwt : ""
        }
    }
}
export default function GrantSelect({ state, setState, grants }: {grants: GrantInfo[], state: any, setState: any}) {
    let handleChange = (event: any) => {
        const value = event.target.value;
        setState(value);
    }
    return <>
        <h3>Grant</h3>
        <select name={state} onChange={handleChange} defaultValue={state}>
            <option value="" disabled hidden>Select Grant...</option>
            <option value="N/A">None</option>
            {grants.map((grant: GrantInfo) => {
                const {id, name} = grant;
                return <option key={id} value={id}>{name}</option>
            })}
        </select>
    </>
}