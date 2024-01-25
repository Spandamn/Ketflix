import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = new DynamoDB({ region: 'eu-west-2' });
const userTable = "LoginDB";
const sessionTable = "SessionDB";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log("Inside login handler");
    try {
        // Parse the request body
        const requestBody = JSON.parse(event.body || '');
        console.log(JSON.stringify(requestBody));
        const email = requestBody.email;
        const password = requestBody.password;

        // Check if the provided email exists in the DynamoDB table
        const userData = await dynamodb.getItem({
            TableName: userTable,
            Key: {
                "email": { "S": email }
            }
        }).promise();

        if (!userData.Item) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': 'https://spandamn.github.io',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'Invalid email or password.' }),
            };
        }

        // Compare the hashed password using bcrypt
        const hashedPasswordInDB = userData.Item.password.S;
        const passwordMatch = await bcrypt.compare(password, hashedPasswordInDB);

        if (passwordMatch) {
            // Generate a session key
            const sessionKey = uuidv4();
            
            // Calculate expiration time (e.g., 1 hour)
            const expirationTime = Math.floor(Date.now() / 1000) + 3600;

            // Save session in DynamoDB
            await dynamodb.putItem({
                TableName: sessionTable,
                Item: {
                    "sessionKey": { "S": sessionKey },
                    "expirationTime": { "N": expirationTime.toString() },
                    "email": { "S": email }
                }
            }).promise();

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': 'https://spandamn.github.io',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'Login successful!', sessionKey }),
            };
        } else {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': 'https://spandamn.github.io',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'Invalid email or password.' }),
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': 'https://spandamn.github.io',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
