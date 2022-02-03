// This file will insert data into our dynamodb table

import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid';


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


    // we can get data from APIGatewayPRoxyEvent and put it into our dynamodb table
    const item = typeof event.body == 'object'? event.body: JSON.parse(event.body);
    item.spaceId = v4();

    // this is the iteam that will be insterted into our dynamodb
    /*const item = {
        // need to be unique so it has [uuid]
        spaceId: v4()
    
    }*/

    //action from dynamodb
    try {
        // the action is PutItemInput
        await dbClient.put({
            // Tablename from spacestack
            TableName: 'SpacesTable',
            Item: item
        }).promise()
    } catch (error) {
        result.body = (error as Error).message
    }

    result.body = JSON.stringify(item.spaceId)
    //result.body = JSON.stringify('Created item with id: ${item.spaceId}')
    return result
}
export { handler }