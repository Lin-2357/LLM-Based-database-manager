const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "your-api-key",
});
const openai = new OpenAIApi(configuration);

const basePrompt = `You are an intelligent assistant that can generate a response that contains {hours, sale, keywords, instruction} from a given prompt.
The prompt is a description of an employee's week report activity or an instruction about how to write it. For each of the entries in the response:
the format of the output is
[the number of total hours that the employee worked this week, if not indicated by the prompt then -1.]
[the number of total money that the employee generated from sales this week, if not indicated by the prompt then -1.]
[a comprehensive list of keywords that can be used to search for the activity mentioned in the prompt, also include their synonyms (e.g. include "client" as keywords when the keyword contains "customer"), separated by ";"]
[a suggestion about what additional information needed to construct a more comprehensive report. Also include the current report in a refined and more organized language.]
an example:
[40]
[230]
[marketing;customer;client;sale]
[please include more detail about how you identified the potential customer! Suggestion: I have identified a potential customers base for our service: female 30-45 age are 30% more likely to purchase the product if given directed advertisement. Clocked in for 40 hours and used this model to generate 230 RMB sale through subscriptions.]
`

module.exports = async function (req) {
  if (!configuration.apiKey) {
    return {
      error: "OpenAI API key not configured, please follow instructions in README.md",
    };
  }

  const animal = req.prompt || '';
  if (animal.trim().length === 0) {
    return {
      error: "Prompt not detected",
    };
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {role: "system", content: basePrompt},
        {role: "user", content: animal},
      ],
    });
    var response = completion['data'].choices[0].message['content'];
    console.log(response);
    const hours = response.substring(response.indexOf("[")+1, response.indexOf("]"))
    response = response.substring(response.indexOf("]")+1)
    const sale = response.substring(response.indexOf("[")+1, response.indexOf("]"))
    response = response.substring(response.indexOf("]")+1)
    const keywords = response.substring(response.indexOf("[")+1, response.indexOf("]"))
    response = response.substring(response.indexOf("]")+1)
    const instruction = response.substring(response.indexOf("[")+1, response.indexOf("]"))
    return ({ 
      hours: hours,
      sale: sale,
      keywords: keywords,
      instruction: instruction
     });
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