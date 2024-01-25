// Import the AWS Lambda types
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

// Lambda handler function
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event.body);
  console.log("test");
  try {
    // Parse the JSON body from the request
    const body = JSON.parse(event.body || '');

    // Extract the name from the body
    const name = body.name || 'Guest';

    // Construct the greeting
    const greeting = `Hello, ${name}!`;

    // Return a successful response with the greeting
    return {
      statusCode: 200,
      body: JSON.stringify({ message: greeting }),
    };
  } catch (error) {
    // Return an error response if there's an issue
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
