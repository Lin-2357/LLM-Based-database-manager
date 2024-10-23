const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "your-api-key",
});
const openai = new OpenAIApi(configuration);

const basePrompt = `You are an intelligent assistant that interprets SQL query outputs and provides explanations in natural language. Based on the original question, you will receive one or multiple JSON-formatted responses from the database. Your task is to read the original question, review the data, and explain the result clearly in natural language. If there is no response it means there are no rows in the database that matches the prompt.`

module.exports = async function (req) {
  if (!configuration.apiKey) {
    return {
      error: "OpenAI API key not configured, please follow instructions in README.md",
    };
  }

  const original_prompt = req.prompt || '';
  const json_response = req.response || '';

  if (original_prompt.trim().length === 0) {
    return {
      error: "Prompt not detected",
    };
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {role: "system", content: basePrompt},
        {role: "user", content: `Original question: "What are the total hours worked by all employees in the last week?"
   JSON response:
   [
     {"total_hours": 120}
   ]`},
        {role: "assistant", content: "The total number of hours worked by all employees in the last week is 120 hours."},
        {role: "user", content: `Original question: "${original_prompt}"
JSON response: ${json_response}
Provide a natural language explanation of what this data means in relation to the original question.
`}
      ],
    });
    console.log(completion['data'].choices[0].message['content']);
    return ({ result: completion.data.choices[0].message['content'] });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return {
        error: "Error with OpenAI API request: ${error.message}",
      };
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return {
        error: "Error with OpenAI API request: ${error.message}",
      };
    }
  }
}