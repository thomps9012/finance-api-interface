// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import authOptions from "./auth/[...nextauth]"

export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  session ? res.send({
    content: "this is protected content"
  }) : res.send({
    error: "you must be signed in"
  })
}
