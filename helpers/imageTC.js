const { SchemaComposer } = require('graphql-compose');
const schemaComposer = new SchemaComposer();

exports.fileTC = schemaComposer.createObjectTC({
    name: 'file',
    fields: {
      filename: 'String!',
      mimetype: 'String!',
      encoding: 'String!',
    }
});

  