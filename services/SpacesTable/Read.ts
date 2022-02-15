// This file will insert data into our dynamodb table

import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda';


// env varialbes
const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
// this is lambda it is best for us to use the imports from Lambda
// need some types from aws [npm i @types/aws-lambda]
// now we will use the lambda with API Gateway
const dbClient = new DynamoDB.DocumentClient();


async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    // return APIGatewayPRoxyResult
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from Dynamodb'
    }

    //action from dynamodb
    try {
        
        // the action is Query. Query is based upon spaceId
        if (event.queryStringParameters) {
            if(PRIMARY_KEY! in event.queryStringParameters){
                const keyValue = event.queryStringParameters[PRIMARY_KEY!];
                const queryResponse = await dbClient.query({
                    TableName: TABLE_NAME!,
                    KeyConditionExpression: '#zz = :zzzz',
                    ExpressionAttributeNames: {
                        '#zz': PRIMARY_KEY!
                    },
                    ExpressionAttributeValues: {
                        ':zzzz': keyValue
                    }
                }).promise();
                result.body = JSON.stringify(queryResponse);
            }

        }else {
             // the action is Scan, this scan method only requires us to provide a table name
        const queryResponse = await dbClient.scan({
            // Tablename from spacestack
            //! means to make sure that it exist 
            TableName: TABLE_NAME!,
            
        }).promise()
        // returning our query
        result.body = JSON.stringify(queryResponse)

        }
       
    } catch (error) {
        result.body = await scanTable();
    }

    
    return result
}
// qeury with Primary partition
async function queryWithPrimaryPartition(queryParms: APIGatewayProxyEventQueryStringParameters) {
    
}

// differnet function outside our main function....query on secondary indexes 
async function scanTable() {
    //the action is Scan
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME!

    }).promise();
    return JSON.stringify(queryResponse.Items)
}
export { handler }