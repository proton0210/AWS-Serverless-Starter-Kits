import { AxiosError } from "axios";
import { GRAPHQL_URL } from "./test-constants";

let GraphQLClient: any;

export const makeGraphQLRequest = async (
  query: string,
  variables = {},
  accessToken: string
) => {
  if (!GraphQLClient) {
    const module = await import("graphql-request");
    GraphQLClient = module.GraphQLClient;
  }

  const client = new GraphQLClient(GRAPHQL_URL);
  client.setHeader("Authorization", `${accessToken}`);
  try {
    return await client.request(query, variables);
  } catch (err) {
    throw err;
  }
};

function handleAxiosError(error: AxiosError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error("Response error:", error.response.status);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Request error:", error.request);
  } else {
    // Something happened in setting up the request that triggered an error
    console.error("Error:", error.message);
  }
}
