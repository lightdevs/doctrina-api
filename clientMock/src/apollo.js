import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImFuc3dlcnMiOlsiNWZjMTY1ZGJjMWMwMjAyYzEwYWI0ODkxIl0sImNvdXJzZXNUYWtlc1BhcnQiOltdLCJjb3Vyc2VzQ29uZHVjdHMiOlsiNWZjMTU3MzRlZTViYzgzOGNjNTdhYzVlIl0sIl9pZCI6IjVmYzE1NzFmZWU1YmM4MzhjYzU3YWM1ZCIsImVtYWlsIjoiVmxhZCIsInBhc3N3b3JkIjoiJDJhJDEwJDdrMmFpajN4Y3lrRG5OMEs2T2ZwSGVxRHhrOUhwdnpjdUJobWVRS093cHI2bnRwTXFHelNHIiwibmFtZSI6IlZsYWQiLCJzdXJuYW1lIjoiVmxhZCIsImFjY291bnRUeXBlIjoidGVhY2hlciIsImNyZWF0ZWRBdCI6IjIwMjAtMTEtMjdUMTk6NDQ6MzEuMzIwWiIsInVwZGF0ZWRBdCI6IjIwMjAtMTEtMjdUMjA6NDc6MjMuOTgxWiIsIl9fdiI6MH0sImlhdCI6MTYwNjU3NDQ5MiwiZXhwIjoxNjA3MTc5MjkyfQ.e19d3_vNO6hlL4UgG0zCCoLASOI50MUevQ4MBtPXCNw";
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
