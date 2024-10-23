const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "your-api-key",
});
const openai = new OpenAIApi(configuration);

const basePrompt = `You are an intelligent assistant that can generate SQL queries based on questions about an employee database. The database consists of two tables:

1. "employees" table with the following columns: [ID, name, title, department, hireDate, email, keywords], contains employee information
2. "week" table with the following columns: [ID, weekNumber, activities, hours, sales, employee_ID, start_date, keywords], contains weekly report made in week num by employee id

start_date refers to the date of starting day of the week, it is a string in yyyy/mm/dd (or yyyy/m/dd, yyyy/mm/d, yyyy/m/d if there are leading zeros), so convert any other date format to this, this week is week 10, it started on 2024-09-04.
keywords refer to the summary of the employee or activities
sales refer to the revenue in sale
activities is a more detailed description of activity
use queries that filter columns keywords activities with LIKE statements (try both uppercase in first letter and all lower case and try similar words e.g. search for both "customer" and "client" when given "client") for similar words if the requested column does not exist
use your external knowledge to make inference when needed such as searching for the highest number of appearance of "plan" and "organize" in activities when asked about who is in charge of leadership.
always use name instead of ID for return

If the prompt can be answered by querying the database, respond with a SQL query starting with "SQL:". If the prompt cannot be answered due to missing data or columns not present in the database, respond with an error message starting with "ERR:" and explain which part of the prompt cannot be answered.
`

module.exports = async function (req) {
  if (!configuration.apiKey) {
    return {
      error: "OpenAI API key not configured, please follow instructions in README.md",
    };
  }

  const animal = req.animal || '';
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
        {role: "user", content: "Find the email addresses of all employees in the Sales department"},
        {role: "assistant", content: "SQL: SELECT email FROM employees WHERE department = 'Sales';"},
        {role: "user", content: "Find the total revenue of all employees"},
        {role: "assistant", content: "ERR: The prompt asks for total revenue, but the database does not contain a column for revenue."},
        {role: "user", content: `${animal}: use queries that filter columns keywords activities with LIKE statements for similar words (try both uppercase in first letter and all lower case) if the requested column does not exist`}
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