const AWS = require('aws-sdk');
const sns = new AWS.SNS();
require("dotenv").config()

const handleSns = async (event, context) => {
    try {
        // Check if the request is for creating a new topic
        if (event.requestContext.http.method === 'POST' && event.body) {
            const { TopicName } = JSON.parse(event.body);
            
            // Create a new SNS topic
            const createTopicResult = await sns.createTopic({ Name: TopicName }).promise();
            const newTopicArn = createTopicResult.TopicArn;

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Topic created successfully', topicArn: newTopicArn })
            };
        } else if (event.requestContext.http.method === 'GET') {
            // List existing SNS topics
            const topics = await sns.listTopics().promise();
            const topicArns = topics.Topics.map(topic => topic.TopicArn);

            return {
                statusCode: 200,
                body: JSON.stringify({ topics: topicArns })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid request. Use POST to create a topic or GET to fetch topic list.' })
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Serverrr Error' })
        };
    }
};


module.exports = {
    handler: handleSns,
  };
