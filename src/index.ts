import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers";

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver],
  });
  const apolloServer = new ApolloServer({ schema });

  const app = express();
  apolloServer.applyMiddleware({ app });

  app.use(express.static("public"));
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

bootstrap();
