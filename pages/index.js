import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

function displayObj(obj) {
  return JSON.stringify(obj)
}

export default function Home() {

  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState("");
  const [popup, setPopup] = useState(false);
  const [employee, setEmployee] = useState("");
  const [report, setReport] = useState("");
  const [sale, setSale] = useState();
  const [hours, setHours] = useState();
  const [keywords, setKeywords] = useState('');
  const [instruction, setInstruction] = useState('describe what you have done this week!');

  async function generate(event) {
    event.preventDefault();
    setResult("creating queries...");
    const prt = animalInput;
    console.log(prt)
    try {
      const response = await fetch("http://localhost:4000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prt }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      if (data.result.substring(0, 4)=="SQL:") {
        console.log(data.result.substring(4, data.result.length))
        setResult("loading data...");

        const dat = await fetch("http://localhost:5000/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: data.result.substring(4, data.result.length) }),
        });

        const dat2 = await dat.json();
        if (dat.status !== 200) {
          throw data.error || new Error(`Request failed with status ${dat.status}`);
        }

        setResult("interpreting result...")
        const interpretation = await fetch("http://localhost:4000/interpret", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prt, response: displayObj(dat2) }),
        });
        const out = await interpretation.json()
        setResult(out.result);

      } else {
        setResult(data.result)
      }
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function populate() {
    try {
      const interpretation = await fetch("http://localhost:4000/populate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: report }),
      });
      const out = await interpretation.json()
      console.log(out)
      if (parseInt(out.hours) >= 0) {
        setHours(parseInt(out.hours));
      }
      if (parseInt(out.sale) >= 0) {
        setSale(parseInt(out.sale));
      }
      setKeywords(out.keywords);
      setInstruction(out.instruction);
    } catch (error) {
      console.error(error.message)
    }
  }

  function renderpop() {
    if (popup) {
      return (<div className={styles.popup}>
          <form style={{width: '80%'}} onSubmit={async(e)=>{
            e.preventDefault()
            try {
              const response = await fetch("http://localhost:5000/report", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: report, name: employee, sale: sale, hours: hours, keywords: keywords }) // Example payload
              });
            
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            
              const data = await response.json();
              console.log("Report successfully sent", data);
              setInstruction("Report successfully sent")
            } catch (error) {
              console.error("Error in POST request:", error.message);
              setInstruction("Failed to send report")
            }
    
          }}>
            <h3>Generate Weekly Report</h3>
            <input
            type="text"
            name="employee"
            placeholder="Enter your name"
            value={employee}
            onChange={(e) => {
              setEmployee(e.target.value)
            }}></input>
            <p>{instruction}</p>
            <textarea className={styles.textbox} value={report} onChange={(e)=>{setReport(e.target.value)}} placeholder="type your report here, include sales value and hours."></textarea>
            <div className={styles.add} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px'}} onClick={()=>{populate()}}>Populate your statistics with AI</div>
            <input
            type="text"
            name="hours"
            placeholder="Enter your hours, number only"
            value={hours}
            onChange={(e) => {
              setHours(e.target.value)
            }}></input>
            <input
            type="text"
            name="sales"
            placeholder="Enter your sales value, number only"
            value={sale}
            onChange={(e) => {
              setSale(e.target.value)
            }}></input>
            <input
            type="text"
            name="key"
            placeholder="Enter keywords that can summarize your activities"
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value)
            }}></input>
            <input type="submit" value="Submit report" />
          </form>
          <div className={styles.add} onClick={()=>{setPopup(false);setInstruction('describe what you have done this week!');}}>Close Tab</div>
      </div>)
    }
  }

  return (
    <div>
      <Head>
        <title>Employee Reports</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Fetch employee and reports</h3>
        <form onSubmit={generate}>
          <input
            type="text"
            name="animal"
            placeholder="Enter a query or a prompt"
            value={animalInput}
            onChange={(e) => {
              setAnimalInput(e.target.value)
            }}
          />
          <input type="submit" value="Generate report" />
        </form>
        <div className={styles.add} onClick={()=>{setPopup(true)}}>Create a Weekly Report as Employee</div>
        {renderpop()}
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
