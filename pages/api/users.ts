// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import authOptions from "./auth/[...nextauth]"
const userAPI = process.env.USER_API;
export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    const { query, query_res } = req.headers;
    const api_route = `${userAPI}/?query={${query}${query_res}}`
    const response = await fetch(api_route);
    const json = await response.json()
    res.json(json);
  }
  res.send({
    error: "You must be signed in"
  })
}
