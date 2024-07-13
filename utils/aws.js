const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
});

const s3 = new AWS.S3();

/**
 * Fetches an object from S3.
 * @param {string} bucket - The name of the S3 bucket.
 * @param {string} key - The key of the S3 object.
 * @returns {Promise<string>} - The content of the S3 object.
 */
const fetchS3Object = async (bucket, key) => {
    console.log('2')
    const params = {
        Bucket: bucket,
        Key: key
    };

    try {
        const data = await s3.getObject(params).promise();
        return data.Body.toString("utf-8");
    } catch (error) {
        // console.error('Error fetching object from S3:', error);
        throw error;
    }
};

module.exports = { fetchS3Object };