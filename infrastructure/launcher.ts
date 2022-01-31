import { spacestack } from './spacestack';
import { App } from 'aws-cdk-lib';

const app = new App()

const spaceStack = new spacestack(app, 'Space-finder',{
    // name of the stack 
    stackName: 'SpaceFinder'
})

