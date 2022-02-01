import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { handler } from '../services/node-lambda/hello';

export class spacestack extends Stack{
    // statical initiliazor. will allow su to reference this API wherever we want in this class
    private api = new RestApi(this, 'SpaceApi')
    // using the createTable() class from GenericTable to spacestack
    //creating a new class spacesTable
    private spacesTable = new GenericTable(
        //name of the table in DynamoDB
        'SpacesTable',
        // PrimaryKey
         'SpaceId',
         // Stack
          this,
        
        )


    // constructor
    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)
        // Javascript
        /*const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..','services', 'hello')),
            handler: 'hello.main'
        } )*/
        // creating node js function
        const helloLambdaNodeJs = new NodejsFunction(this,'helloLambdaNodeJs',{
            //path that leads to typescript implementation
            // using join method
            entry: (join(__dirname, '..', 'services','node-lambda','hello.ts')),
            // our method handler from hello.ts
            handler: 'handler'
        })
        // Hello Api Lambda integration:
        const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs) // link Api gateway and Lambda
        const helloLambdaResource = this.api.root.addResource('hello'); // provide resource to api called hello as string
        //provide method. Add GET method to access with browser
        helloLambdaResource.addMethod('GET',helloLambdaIntegration)
    }

}