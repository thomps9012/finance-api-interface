const uri = process.env.GRAPHQL_URL;

export default async function handler(req: { body: string }, res: { json: (arg0: any) => void; }) {
    // let data = JSON.parse(req.body);
    // const { email, name, id } = data;
    const api_route = `https://agile-tundra-78417.herokuapp.com/graphql?query=mutation+_{sign_in(id:"101614399314441368253", name:"Samuel Thompson", email:"sthompson@norainc.org")}`
    // const api_route = `https://agile-tundra-78417.herokuapp.com/graphql?query=mutation+_{sign_in(id:"${id}", email:"${email}", name:"${name}")}`
    const json = await fetch(api_route).then(res => res.json())
    res.json(json)
}
