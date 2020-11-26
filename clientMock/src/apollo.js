import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImNvdXJzZXNUYWtlc1BhcnQiOltdLCJjb3Vyc2VzQ29uZHVjdHMiOltdLCJfaWQiOiI1ZmMwMGU4OTYyNTY0NzIxNGM5YzgwZDkiLCJlbWFpbCI6InQxIiwicGFzc3dvcmQiOiIkMmEkMTAkQlRwWTIzdUNILkRLeU1uL2JNQ2VVdWZKWk11RHlFRXR3RWQvYmxaZlMvQi95eEFpZDU4czIiLCJuYW1lIjoidDEiLCJzdXJuYW1lIjoidDEiLCJhY2NvdW50VHlwZSI6InN0dWRlbnQiLCJjcmVhdGVkQXQiOiIyMDIwLTExLTI2VDIwOjIyOjMzLjg0OFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTExLTI2VDIwOjIyOjMzLjg0OFoiLCJfX3YiOjB9LCJpYXQiOjE2MDY0MjIxNTMsImV4cCI6MTYwNzAyNjk1M30.lR5EkEuvPVrWIixaLwoIE8bL38dyd5E7KR84Jnc7bN4";
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
