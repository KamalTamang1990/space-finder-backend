// to initiate multiple dynamo table 

import { Stack } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';
import { handler } from '../services/node-lambda/hello';


// interface which contain the properties of GenericTable
export interface TableProps {
    tableName: string,
    primaryKey: string,
    // (?) means fields is optional
    createLambdaPath?: string,
    readLambdaPath?: string,
    updateLambdaPath?: string,
    deleteLambdaPaht?: string,
    // optional field for query on secondary indexes
    secondaryIndexes?: string

}

// each dynamo table has two important parameters table name and primarykey

export class GenericTable {

    //Because this GenericTable must be included in a stack 
    // Reference to a stack (private stack and table )
    private stack: Stack;
    private table: Table;
    private pros: TableProps 

    // creating LambdaIntegration in Generic Table class 
    // undefined : optional
    private createLambda: NodejsFunction | undefined;
    private readLambda: NodejsFunction | undefined;
    private updateLambda: NodejsFunction | undefined;
    private deleteLambda: NodejsFunction | undefined;
    
    // import lambda integration from apigateway library
    public createLambdaIntegration: LambdaIntegration;
    public readLambdaIntegration: LambdaIntegration;
    public updateLambdaIntegration: LambdaIntegration;
    public deleteLambdaIntegration: LambdaIntegration;


    // injecting these properties Lambda, using constuctor
    public constructor(stack: Stack, pros: TableProps){
        //this.name = name;
        //this.primaryKey = primaryKey;
        this.stack= stack;
        this.pros= pros
        this.initialize();
    }
    // initializor method
    private initialize(){
        this.createTable();
        this.SecondaryIndexes(); 
        this.createLambdas();
        this.grantTableRight();
    }
    // creating a table
    private createTable(){
        this.table= new Table(this.stack,this.pros.tableName,{
            // to do a dynamodb query based on partition key
            partitionKey:{
                name: this.pros.primaryKey,
                type: AttributeType.STRING
            }, 
            // providing a table name 
            tableName: this.pros.tableName
        })
    }
    // for Query on secondary indexes
    private SecondaryIndexes(){
        if(this.pros.secondaryIndexes){
            for (const secondaryIndex of this.pros.secondaryIndexes){
                this.table.addGlobalSecondaryIndex({
                    indexName: secondaryIndex,
                    partitionKey: {
                        name: secondaryIndex,
                        type: AttributeType.STRING
                    }
                })
            }
        }
    }
    
    //
    private createLambdas(){
        if (this.pros.createLambdaPath){
            this.createLambda = this.createSingleLambda(this.pros.createLambdaPath)
            this.createLambdaIntegration = new LambdaIntegration(this.createLambda);
        }
        if (this.pros.readLambdaPath){
            this.readLambda = this.createSingleLambda(this.pros.readLambdaPath)
            this.readLambdaIntegration = new LambdaIntegration(this.readLambda);
        }
        if (this.pros.updateLambdaPath){
            this.updateLambda = this.createSingleLambda(this.pros.updateLambdaPath)
            this.updateLambdaIntegration = new LambdaIntegration(this.updateLambda);
        }
        if (this.pros.deleteLambdaPaht){
            this.deleteLambda = this.createSingleLambda(this.pros.deleteLambdaPaht)
            this.deleteLambdaIntegration = new LambdaIntegration(this.deleteLambda);
        }
    }

    private grantTableRight(){
        if(this.createLambda){
            this.table.grantWriteData(this.createLambda);
        }
        if(this.readLambda){
            this.table.grantReadData(this.readLambda);
        }
        if(this.updateLambda){
            this.table.grantWriteData(this.updateLambda);
        }
        if(this.deleteLambda){
            this.table.grantWriteData(this.deleteLambda);
        }
    }
    // creating single Lambda
    private createSingleLambda(lambdaName: string): NodejsFunction{
        const LambdaId= `${this.pros.tableName}-${lambdaName}` 
        return new NodejsFunction(this.stack, LambdaId, {
            entry: (join(__dirname, '..', 'services', this.pros.tableName, `${lambdaName}.ts`)),
            handler: 'handler',
            // if not pass Lambdaname then it will have an ugly generated cloudformation name
            functionName: LambdaId,
            environment:{
                TABLE_NAME: this.pros.tableName,
                PRIMARY_KEY: this.pros.primaryKey
            }
        })
    }

}