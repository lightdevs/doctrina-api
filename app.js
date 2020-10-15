require('dotenv').config()
const express = require("express")
const { graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose")
const graphqlSchema = require("./graphql/schema")
const graphqlResolvers = require("./graphql/resolvers")

const app = express()

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true,
    })
)

const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose
    .connect(process.env.DB_URL, options)
    .then(() => app.listen(5000, console.log("Server is running")))
    .catch(error => {
        throw error
    })