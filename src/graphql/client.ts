import { GraphQLClient } from "graphql-request";

// ✅ Đây chính là "graphqlClient"
export const graphqlClient = new GraphQLClient("http://localhost:8080/graphql", {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Cho phép gửi cookie nếu có login/session
});
