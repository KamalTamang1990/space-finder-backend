import { handler } from "../../services/SpacesTable/Read";

// we need to pass an object wich requires body
const event = {
    body: {
        // SpaceId 
        location: 'Paris'
    }
}

//calling handler 
// passing event to handler
const reslut = handler({}as any, {} as any).then((apiResult)=>{
    const items= JSON.parse(apiResult.body);
    console.log()
}); 