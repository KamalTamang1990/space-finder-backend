import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Read";


const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: 'dafb4e9b-e946-4347-87a8-71fefc0e195f'
    }
    
} as any;

//calling handler 
// passing event to handler
const reslut = handler(event,{}as any).then((apiResult)=>{
    const items= JSON.parse(apiResult.body);
    console.log(123)
}); 