import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImFuc3dlcnMiOltdLCJjb3Vyc2VzVGFrZXNQYXJ0IjpbXSwiY291cnNlc0NvbmR1Y3RzIjpbIjVmYzdlMDBkZDVkOTY1MDMxMzYyNWJiZSIsIjVmYzdmMTUyNTBmODExMDMxYjMzYTJmZCJdLCJfaWQiOiI1ZmM3ZGY5M2Q1ZDk2NTAzMTM2MjViYmQiLCJlbWFpbCI6ImFuYXN0YXNpeWEuY2h1cHJ5bmFAbnVyZS51YSIsInBhc3N3b3JkIjoiJDJhJDEwJHh3V1lKZ2x5US4uaHNsdXM3RFR0SWVCbncwQkdQQWhPYW42YTQ0SndpVk1iLktIYy94c0VDIiwibmFtZSI6IkFuYXN0YXNpeWEiLCJzdXJuYW1lIjoiQ2h1cHJ5bmEiLCJhY2NvdW50VHlwZSI6InRlYWNoZXIiLCJjcmVhdGVkQXQiOiIyMDIwLTEyLTAyVDE4OjQwOjE5LjYyN1oiLCJ1cGRhdGVkQXQiOiIyMDIwLTEyLTAyVDE5OjU2OjAyLjgyM1oiLCJfX3YiOjB9LCJpYXQiOjE2MDY5NDM1NjIsImV4cCI6MTYwNzU0ODM2Mn0.iwK0dm_NMT_E3iYIxdlYCQxouIXeS4yMMkSjQIjWNM8";
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
