import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB, S3 } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient({ region: 'eu-west-2' });
const s3 = new S3();

const movieCatalogTable = "MovieCatalogDB";
const s3Bucket = "ketflix";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log("Inside player handler");
    try {
        const movieId = event.queryStringParameters?.movieid;

        if (!movieId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing movieid parameter' }),
            };
        }

        // Fetch movie details from DynamoDB
        const params = {
            TableName: movieCatalogTable,
            Key: {
                movieid: movieId,
            },
        };

        const result = await dynamodb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Movie not found' }),
            };
        }

        const movie = {
            movieid: result.Item.movieid,
            title: result.Item.name,
            description: result.Item.desc,
        };

        // Generate a signed URL for the S3 object
        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: s3Bucket,
            Key: `${movie.movieid}.mp4`, // Assuming the video file has a .mp4 extension
            Expires: 60, // URL expires in 60 seconds
        });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ movie, signedUrl }),
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
