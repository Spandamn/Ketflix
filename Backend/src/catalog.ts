import { DynamoDB } from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamodb = new DynamoDB.DocumentClient({ region: 'eu-west-2' });
const movieCatalogTable = "MovieCatalogDB";
const sessionTable = "SessionDB";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log("Inside catalog handler");
    console.log(event);
    try {
        // Check for the presence of the session key in the headers
        const sessionKey = event.headers['Authorization'] || event.headers.Authorization;
        console.log('Session Key:', sessionKey); // Log the session key

        if (!sessionKey) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ error: 'Unauthorized: Missing session key' }),
            };
        }

        // Validate the session key in DynamoDB
        /*const sessionDataResponse = await dynamodb.getItem({
            TableName: sessionTable,
            Key: {
                "sessionKey": sessionKey,
            },
        }).promise();

        // Check if sessionDataResponse.Item exists before accessing its properties
        if (!sessionDataResponse.Item) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ error: 'Unauthorized: Session key not found' }),
            };
        }

        const sessionData = sessionDataResponse.Item;

        if (!sessionData || sessionData.expirationTime < Math.floor(Date.now() / 1000)) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ error: 'Unauthorized: Invalid session key or session expired' }),
            };
        }*/

        // Fetch movies from DynamoDB
        const params = {
            TableName: movieCatalogTable,
        };

        const result = await dynamodb.scan(params).promise();

        // Extract relevant information from the result and use a static link for thumbnails
        const movies = result.Items.map(item => ({
            movieid: item.movieid,
            genre: item.genre,
            title: item.name,
            thumbnail: `https://ketflix.s3.eu-west-2.amazonaws.com/${item.movieid}.jpg`, 
        }));

        console.log('Movies:', movies); // Log the movies

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(movies),
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
