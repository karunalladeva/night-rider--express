const { SchemaComposer } = require('graphql-compose');

const schemaComposer = new SchemaComposer();

const { UserQuery, UserMutation } = require('./user');

schemaComposer.Query.addFields({
    ...UserQuery
});

schemaComposer.Mutation.addFields({
    ...UserMutation
});

// schemaComposer.Subscription.addFields({
// });

exports.schema = schemaComposer.buildSchema();