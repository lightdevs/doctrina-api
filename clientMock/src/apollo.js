import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImNvdXJzZXNUYWtlc1BhcnQiOltdLCJjb3Vyc2VzQ29uZHVjdHMiOlsiNWZhODU1ZmMzMTkyYTMzYTUwNzNmYTBiIiwiNWZhODU2MDczMTkyYTMzYTUwNzNmYTBjIiwiNWZhODU2MGMzMTkyYTMzYTUwNzNmYTBkIiwiNWZhODU2MTIzMTkyYTMzYTUwNzNmYTBlIiwiNWZiMTU1ZGQ3NTRlN2MxM2YwYzhkODQ1IiwiNWZiMTY0YTlhNzE2YTIwOWY4NDRmOTY2Il0sIl9pZCI6IjVmYTg1NWRlMzE5MmEzM2E1MDczZmEwYSIsImVtYWlsIjoiVmxhZCIsInBhc3N3b3JkIjoiJDJhJDEwJFhSaEladmJTdllnMGhxR2pwUFQ0Y2V0VXFJL1pVbUd0TlRHVFpiY3lrbEkwVkF4bkhja1dXIiwibmFtZSI6IlZsYWQiLCJzdXJuYW1lIjoiVmxhZCIsImFjY291bnRUeXBlIjoidGVhY2hlciIsImNyZWF0ZWRBdCI6IjIwMjAtMTEtMDhUMjA6MzI6MzAuNjI4WiIsInVwZGF0ZWRBdCI6IjIwMjAtMTEtMTVUMTc6MjY6MDEuODA1WiIsIl9fdiI6MCwicGhvdG8iOiI1ZmIxNWFhMDQ3NGRhOTJhNzgwYmJkOGQifSwiaWF0IjoxNjA1NDc2NDQ1LCJleHAiOjE2MDYwODEyNDV9.lbRnRi0Z4u1aqQfvigZ5FnFYETYvYxY1WGmTv8Fv8rw";
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
