import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = new DynamoDB({ region: 'eu-west-2' });
const sessionTable = "SessionDB";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log("Inside logout handler");
    try {
        const sessionKey = event.headers['Authorization']; // Assuming session key is sent in Authorization header

        // Delete the session from DynamoDB
        await dynamodb.deleteItem({
            TableName: sessionTable,
            Key: {
                "sessionKey": { "S": sessionKey }
            }
        }).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'https://spandamn.github.io',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Logout successful!' }),
        };
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
