import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
        uri: process.env.API_BASEURL
          ? `${process.env.API_BASEURL}/graphql`
          : "http://localhost:3000/graphql",
      }),
      cache: new InMemoryCache(),
      headers: {
         Authorization: `Bearer ${process.env.NEXT_PUBLIC_BearerToken}`,
      }
  });
};

export default createApolloClient;