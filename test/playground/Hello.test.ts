import { handler } from "../../services/SpacesTable/Create";

const event = {
    body: {
        location: 'Paris'
    }
}

//calling handler 
handler(event as any, {} as any); 