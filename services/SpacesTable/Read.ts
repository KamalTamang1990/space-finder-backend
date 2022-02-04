// This file will insert data into our dynamodb table

import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';


// env varialbes
const TABLE_NAME = process.env.TABLE_NAME
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
        // the action is Scan, this scan method only requires us to provide a table name
        const queryResponse = await dbClient.scan({
            // Tablename from spacestack
            //! means to make sure that it exist 
            TableName: TABLE_NAME!,
            
        }).promise()
        // returning our query
        result.body = JSON.stringify(queryResponse)
    } catch (error) {
        result.body = (error as Error).message
    }

    
    return result
}
export { handler }