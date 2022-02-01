
import { Stack } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

// each dynamo table has two important parameters table name and primarykey

export class GenericTable {

    private name: string;
    private primaryKey: string;

    //Because this GenericTable must be included in a stack 
    // Reference to a stack
    private stack: Stack;
    private table: Table;


    // injecting these paramanters using constuctor
    public constructor(name: string, primaryKey: string, stack: Stack){
        this.name = name;
        this.primaryKey = primaryKey;
        this.stack= stack;
        this.initialize();
    }
    // initializor method
    private initialize(){
        this.createTable();
    }
    // creating a table
    private createTable(){
        this.table= new Table(this.stack,this.name,{
            partitionKey:{
                name: this.primaryKey,
                type: AttributeType.STRING
            }, 
            // providing a table name 
            tableName: this.name
        })
    }

}