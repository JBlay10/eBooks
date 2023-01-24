const express = require('express');
const path = require('path');
// Apollo import
const { ApolloServer } = require('apollo-server-express');

// Import resolvers and typeDefs
const { typeDefs, resolvers } = require('./schema');

const db = require('./config/connection');

const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3002;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 API server running on localhost:${PORT}`);
    console.log(`graphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
