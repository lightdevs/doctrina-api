import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImNvdXJzZXNUYWtlc1BhcnQiOltdLCJjb3Vyc2VzQ29uZHVjdHMiOltdLCJfaWQiOiI1ZmE4NTVkZTMxOTJhMzNhNTA3M2ZhMGEiLCJlbWFpbCI6IlZsYWQiLCJwYXNzd29yZCI6IiQyYSQxMCRYUmhJWnZiU3ZZZzBocUdqcFBUNGNldFVxSS9aVW1HdE5UR1RaYmN5a2xJMFZBeG5IY2tXVyIsIm5hbWUiOiJWbGFkIiwic3VybmFtZSI6IlZsYWQiLCJhY2NvdW50VHlwZSI6InRlYWNoZXIiLCJjcmVhdGVkQXQiOiIyMDIwLTExLTA4VDIwOjMyOjMwLjYyOFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTExLTA4VDIwOjMyOjMwLjYyOFoiLCJfX3YiOjB9LCJpYXQiOjE2MDQ4Njc1NTAsImV4cCI6MTYwNTQ3MjM1MH0.M19nE7K64XPIeuT9RrBnJnw7EMyk-cto8zjVRDN7l4A";
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
