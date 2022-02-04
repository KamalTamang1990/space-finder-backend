import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { handler } from '../services/node-lambda/hello';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class spacestack extends Stack{
    // statical initiliazor. will allow su to reference this API wherever we want in this class
    private api = new RestApi(this, 'SpaceApi')


    // using the createTable() class from GenericTable to spacestack
    //creating a new class spacesTable
    //private spacesTable = new GenericTable(
        //name of the table in DynamoDB
        //'SpacesTable',
        // PrimaryKey
         //'SpaceId',
         // Stack
          //this,
        
        //)

        private spacesTable = new GenericTable(this,{
            tableName: 'SpacesTable',
            primaryKey: 'spaceId',
            createLambdaPath: 'Create'
        })


    // constructor
    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)
        // Javascript (for hello.js)
        /*const helloLambda = new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..','services', 'hello')),
            handler: 'hello.main'
        } )*/


        // creating node js Lambda function
        const helloLambdaNodeJs = new NodejsFunction(this,'helloLambdaNodeJs',{
            //path that leads to typescript implementation
            // using join method
            entry: (join(__dirname, '..', 'services','node-lambda','hello.ts')),
            // our method handler from hello.ts
            handler: 'handler'
        })


        // Policy statement to list s3 buckets
        const s3ListPolicy = new PolicyStatement();
        // actions that can list all the buckets
        s3ListPolicy.addActions('s3:ListAllMyBuckets');
        s3ListPolicy.addResources('*')
        // attatching the policy to helloLambdaNodejs to list the s3 buckets 
        helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);



        // Hello Api Lambda integration:
        const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs) // link Api gateway and Lambda
        const helloLambdaResource = this.api.root.addResource('hello'); // provide resource to api called hello as string
        //provide method. Add GET method to access with browser
        helloLambdaResource.addMethod('GET',helloLambdaIntegration)


        //spaces API integrations:
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST',this.spacesTable.createLambdaIntegration);
    }

}