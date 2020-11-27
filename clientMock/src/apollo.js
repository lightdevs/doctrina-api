import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImFuc3dlcnMiOltdLCJjb3Vyc2VzVGFrZXNQYXJ0IjpbXSwiY291cnNlc0NvbmR1Y3RzIjpbXSwiX2lkIjoiNWZjMTU3MWZlZTViYzgzOGNjNTdhYzVkIiwiZW1haWwiOiJWbGFkIiwicGFzc3dvcmQiOiIkMmEkMTAkN2syYWlqM3hjeWtEbk4wSzZPZnBIZXFEeGs5SHB2emN1QmhtZVFLT3dwcjZudHBNcUd6U0ciLCJuYW1lIjoiVmxhZCIsInN1cm5hbWUiOiJWbGFkIiwiYWNjb3VudFR5cGUiOiJ0ZWFjaGVyIiwiY3JlYXRlZEF0IjoiMjAyMC0xMS0yN1QxOTo0NDozMS4zMjBaIiwidXBkYXRlZEF0IjoiMjAyMC0xMS0yN1QxOTo0NDozMS4zMjBaIiwiX192IjowfSwiaWF0IjoxNjA2NTA2MjcxLCJleHAiOjE2MDcxMTEwNzF9.vOXRKkjN8zmYpg16x3f4LHtakr5KUwsh-s1CunM59lw";
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
