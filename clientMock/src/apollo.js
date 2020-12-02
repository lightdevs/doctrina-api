import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImFuc3dlcnMiOltdLCJjb3Vyc2VzVGFrZXNQYXJ0IjpbXSwiY291cnNlc0NvbmR1Y3RzIjpbXSwiX2lkIjoiNWZjM2UzNWRlMDAyOTIyMTkwNTM1YTZmIiwiZW1haWwiOiJWbGFkIiwicGFzc3dvcmQiOiIkMmEkMTAkSkV0ZEtOSUE0LlR5V2lFS1hzVTBDLmpZb0JrRy9PdGxIalBKSGEuejlqNkFkUmdyNC5NTmUiLCJuYW1lIjoiVmxhZCIsInN1cm5hbWUiOiJWbGFkIiwiYWNjb3VudFR5cGUiOiJ0ZWFjaGVyIiwiY3JlYXRlZEF0IjoiMjAyMC0xMS0yOVQxODowNzoyNS4xMjFaIiwidXBkYXRlZEF0IjoiMjAyMC0xMS0yOVQxODowNzoyNS4xMjFaIiwiX192IjowfSwiaWF0IjoxNjA2NjczMjQ1LCJleHAiOjE2MDcyNzgwNDV9.IDfOX6vZ91fYyok4kRyVbtxfAy0KAg7c5DLj2jMcv2w";
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
