import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImNvdXJzZXNUYWtlc1BhcnQiOltdLCJjb3Vyc2VzQ29uZHVjdHMiOltdLCJfaWQiOiI1ZmIyYjE2MzdmNjhkNTNlMzQ1N2UzNWUiLCJlbWFpbCI6IlZMQUQiLCJwYXNzd29yZCI6IiQyYSQxMCQ5ZWcxWW4ucTh0MEVrYU9WLnpOY1dPVko1YjMyNnY4ZFRaT1BzVlE5WTJCdHMydkNPbmE1bSIsIm5hbWUiOiJWTEFEIiwic3VybmFtZSI6IlZMQUQiLCJhY2NvdW50VHlwZSI6InRlYWNoZXIiLCJjcmVhdGVkQXQiOiIyMDIwLTExLTE2VDE3OjA1OjM5LjQzNFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTExLTE2VDE3OjA1OjM5LjQzNFoiLCJfX3YiOjB9LCJpYXQiOjE2MDU1NDYzMzksImV4cCI6MTYwNjE1MTEzOX0.rQpR4bBZIiXyw1Df_SbFw8LxLDzXOBBxjn-7LtalOLE";
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "", //Bearer ${}
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache()
});
