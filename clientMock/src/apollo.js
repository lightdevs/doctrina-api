import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImNvdXJzZXNUYWtlc1BhcnQiOltdLCJjb3Vyc2VzQ29uZHVjdHMiOltdLCJfaWQiOiI1ZmI0MDNhYTgyZDk3OTFkODBlOWNkZWUiLCJlbWFpbCI6IlYiLCJwYXNzd29yZCI6IiQyYSQxMCRoVXcyc2ZqSEt5cHNuZU5vb1RRTzd1cFNZWmZXN0EzdDZGUy9ZLjVYY0lZOUFHR3lvN1RaYSIsIm5hbWUiOiJWIiwic3VybmFtZSI6IlYiLCJhY2NvdW50VHlwZSI6InRlYWNoZXIiLCJjcmVhdGVkQXQiOiIyMDIwLTExLTE3VDE3OjA4OjU4LjgxNFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTExLTE3VDE3OjA4OjU4LjgxNFoiLCJfX3YiOjB9LCJpYXQiOjE2MDU2MzI5MzgsImV4cCI6MTYwNjIzNzczOH0.eVTWRNlfygZJflBG7s9X817vGSXuSvbP70QsfyG3ctE";
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
