

# Finance Request User Facing Web Application
The front end and user facing side of the finance request application that allows users to generate and track, mileage, check, and petty cash requests throughout an organization. Built with a mobile first mindset (barring the administrative report pages), as it was designed with the end user (request generator) in mind.

# Deployed Web Application
The publicly available option of this application is live [here](https://public-finance-requests.vercel.app/).
This application has been modified from an internal facing website, which restricted user sign up to emails only found within an organization. At the link above anyone with a google account can sign up as a default "Manager" role and begin making requests, users, and viewing reports.

![landing page](https://user-images.githubusercontent.com/60509970/194880590-693e74ed-5046-455f-89d0-58e3489bf29e.png)

# Tech Stack
1. [Next.js](https://nextjs.org/)
  - A lightweight React.js based layer that handles internal page routing and static/dynamic page generation
  - Allows for Server Side Rendering (SSR) and Static / Dynamic Page Generation when deploying the application
2. [Vercel](https://vercel.com/)
  - The hosting platform for Next.js where the live deployed application
3. [NextAuth.js](https://next-auth.js.org/) 
  - The authorzation lightweight middle layer that connects to Google to retreive basic account information when creating a new account (or logging in an existing user)
4. [Google Identity and Access Management (IAM)](https://cloud.google.com/iam/)
  - Used for releasing basic account information (email, name, id) which is used to create a unique user account for the application
5. [JWTs](https://jwt.io/)
  - Stores basic information about the user (id, admin status, name, email) which is validated on the backend API via a secret key
  - When generating a new request, the JSON Web Token is passed alongside the request as an authorization header to handle user identification of the generated request
6. [React Images Uploading](https://www.npmjs.com/package/react-images-uploading)
  - A lightweight NPM / Yarn Package that allows users to upload png and jpeg images to the application
  - The image data is stored in a base64 url string on the MongoDB backend
  - Point of note that the file upload size restrictions need to be increased to allow MongoDB to correctly save the image
7. [Apollo Client](https://www.npmjs.com/package/@apollo/client)
  - Used to create a server side Apollo client which caches and handles all data calls to the backend server, which is hosted on a google cloud run instance
  - Creating the client in a seperate file and calling an instance only when necessary allows for Server Side Rendering (SSR) to be used throughout the application (a key feature of the Next.js platform)
8. [GraphQL](https://graphql.org/)
  - Syntax that allows for gathering multiple pieces of connected information with a single API call 
  - i.e. generating all requests for a particular user, despite the fact that the information is sharded across different collections on the backend
  - Handles mutations and the return type associated with each request to the backend
9. [JWT Decode](https://www.npmjs.com/package/jwt-decode)
  - Decodes the user's authorizing JSON Web Token (JWT) in order to display basic information about the user on the landing, profile, and navigation components
10. [Typescript](https://www.typescriptlang.org/)
  - A superscript of javascript that allows the developer to specify which types are associated with props passed to components, function parameters and outputs, and array elements, etc.
  - Ensures that model integrity is consistent from the database to the HTML input elements that the user interacts with
11. [Yarn](https://yarnpkg.com/)
- Lighweight package manager that generates a lockfile which contains information about packages involved in the project, and their associated dependencies
- Useful tool for cross platform application development as it future proofs a specified, stable run set up that will continue to work, despite changes to packages
- Due to the ever evolving nature of open source projects, yarn helps protect against package dependency changes that would break a hosted application

# Connected Repository
The backend / middleware layer which is composed of a Golang GraphQL based Application Program Interface (API) can be found @ https://github.com/thomps9012/financial-api
