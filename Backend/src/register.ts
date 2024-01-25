import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = new DynamoDB({ region: 'eu-west-2' });
const userTable = "LoginDB";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log("Inside registration handler");
    try {
        // Parse the request body
        const requestBody = JSON.parse(event.body || '');
        console.log(JSON.stringify(requestBody));
        const email = requestBody.email;
        const password = requestBody.password;
        const fullName = requestBody.fullName;
        
        // Check if the user already exists
        const existingUser = await dynamodb.getItem({
            TableName: userTable,
            Key: {
                "email": { "S": email }
            }
        }).promise();

        if (existingUser.Item) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'User with this email already exists.' }),
            };
        }

        // Encrypt the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user information in DynamoDB
        await dynamodb.putItem({
            TableName: userTable,
            Item: {
                "email": { "S": email },
                "password": { "S": hashedPassword },
                "fullName": { "S": fullName }
            }
        }).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Registration successful!' }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
