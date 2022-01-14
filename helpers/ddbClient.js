const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

var endpoint = undefined;

if(["production","staging"].indexOf(process.env.NODE_ENV)== -1){
    endpoint = 'http://localhost:8000'
    console.log(`Connectiong to DynamoDB local endpoint on ${endpoint} `)
}

const ddbClient = new DynamoDBClient({
    region:  process.env.REGION || 'us-west-2',
    endpoint: endpoint
    //endpoint: process.env.ENDPOINT || 'http://localhost:8000'
})

module.exports = { ddbClient }