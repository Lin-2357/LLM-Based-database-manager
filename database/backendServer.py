import pandas as pd
import sqlite3
from flask import Flask, request, jsonify, make_response
import os
import csv
from flask_cors import CORS

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}}, allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Function to load CSV data into SQLite in-memory database
def load_csv_to_sqlite():
    # Create an in-memory SQLite database
    conn = sqlite3.connect(':memory:')

    # Construct paths to the CSV files
    employees_csv_path = os.path.join(BASE_DIR, 'employee.csv')
    week_csv_path = os.path.join(BASE_DIR, 'week.csv')

    # Load employees.csv
    employees_df = pd.read_csv(employees_csv_path, encoding='unicode_escape')
    employees_df.to_sql('employees', conn, index=False, if_exists='replace')

    # Load week.csv
    week_df = pd.read_csv(week_csv_path, encoding='unicode_escape')
    week_df.to_sql('week', conn, index=False, if_exists='replace')

    return conn

# Route to execute SQL query
@app.route('/query', methods=['POST'])
def query():
    try:
        # Get the SQL query from the request body
        sql_query = request.json.get('query')

        sql_query = sql_query[sql_query.index('SELECT'):].replace("`", '')
        print(sql_query)

        # Load CSV data into SQLite
        conn = load_csv_to_sqlite()

        # Execute the SQL query
        result_df = pd.read_sql_query(sql_query, conn)

        # Close the connection
        conn.close()

        # Return the result as JSON
        return jsonify(result_df.to_dict(orient="records"))

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/report', methods=['OPTIONS','POST'])
def report():
    if request.method == 'OPTIONS':
        response = make_response("")
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3001")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 204  # Return success for preflight request
    if request.method == 'POST':
        try:
            # Get the SQL query from the request body
            report = request.json.get('query')
            name = request.json.get('name')
            sales = request.json.get('sale')
            hours = request.json.get('hours')
            keywords = request.json.get('keywords')

            weeknum = 11
            start_date = '2024/9/11'

            title = ['ID','weekNumber','activities','hours','sales','employee_ID','start_date','keywords']
            body = []

            conn = load_csv_to_sqlite()
            # Execute the SQL query
            result_df = pd.read_sql_query("SELECT max(ID) FROM week", conn)
            body.append(int(result_df.iloc[0,0])+1)
            body.append(weeknum)
            body.append(str(report))
            body.append(hours)
            body.append(sales)
            result_df = pd.read_sql_query("SELECT ID FROM employees WHERE name = ?", conn, params=(name,))
            print(result_df)
            body.append(str(result_df.iloc[0,0]))
            body.append(start_date)
            body.append(keywords)
            
            # Close the connection
            conn.close()

            # Load CSV data into SQLite
            with open(os.path.join(BASE_DIR, 'week.csv'), 'a', newline='') as f:
                f1 = csv.writer(f)
                f1.writerow(body)

            # Return the result as JSON
            return jsonify({'success': True})

        except Exception as e:
            return jsonify({'error': str(e)}), 400


# Run the server
if __name__ == '__main__':
    app.run(debug=True)