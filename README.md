# LLM based database management tool

database management tool for companies to track employee performance without coding: LLM converts text prompt to SQL queries, and converts the output to natural language.

Example: Who worked for the longest time in week 10

LLM: SELECT name FROM employees JOIN weeks ON employees.ID = weeks.ID GROUP BY name SORT BY hours DESC LIMIT 1

output: [{name: Wei Zhang}]

LLM: Wei Zhang worked for the longest time in week 10.