const verify = (client) => {
    return client.name === process.env.API_BASIC_AUTH_USERNAME && client.pass === process.env.API_BASIC_AUTH_PASSWORD;
}

exports.context = ({ req }) => {
    if (req) {
        const { AuthenticationError } = require('apollo-server-express');
        const auth = require('basic-auth'),
            user = {},
            client = auth(req);

        if (!client || !client.name || !client.pass) throw new AuthenticationError('Basic auth required');

        let isClent = verify(client);

        // we could also check user roles/permissions here
        if (!isClent) throw new AuthenticationError('Basic auth failed');

        // add the user to the context
        return { user, isClent };
    } else {
        return {}
    }
}

exports.subLifeCycle = {
    onConnect: (_, webSocket, context) => {
        console.log(`🚀 New client connected`)
        // For auto init or self call
        // webSocket.onmessage = (event) => {
        //     event = JSON.parse(event.data)
        //     if(event.type === "start")
        //         switch (event.payload.operationName){
        //             case "nearMeList":
        //                 break;
        //             case "documentStatus":
        //                 break;
        //         }
        // }
    },
    onDisconnect: (webSocket, context) => {
        console.log(`🚀 New client disconnected`)
    },
}