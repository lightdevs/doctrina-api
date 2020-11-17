import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from 'apollo-link-context';

const link = createUploadLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImNvdXJzZXNUYWtlc1BhcnQiOltdLCJjb3Vyc2VzQ29uZHVjdHMiOltdLCJfaWQiOiI1ZmIyYjI3ODY2ZTAzNjA4Njg0MmI0MTMiLCJlbWFpbCI6Imx1cGFAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkSk8uOXRlRGtBa1B3T3VyL3lXc0cwT2V5U3F1Tjh6em9tcHhJbmh2L0JDT1pXRFRHOC8vc1ciLCJuYW1lIjoibHVwYSIsInN1cm5hbWUiOiJwdXBhIiwiYWNjb3VudFR5cGUiOiJ0ZWFjaGVyIiwiY3JlYXRlZEF0IjoiMjAyMC0xMS0xNlQxNzoxMDoxNi43MDVaIiwidXBkYXRlZEF0IjoiMjAyMC0xMS0xN1QxMjozNDoxNi43MjRaIiwiX192IjowfSwiaWF0IjoxNjA1NjI1NDg3LCJleHAiOjE2MDYyMzAyODd9.ZwmEpomxaMcqhMYimfkeIqRjXrD2prcPdL4oJm3Ex3s";
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
