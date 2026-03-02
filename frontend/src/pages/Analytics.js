import React from "react";

export default function Analytics() {

  const emotions = [
    "Happy",
    "Sad",
    "Angry",
    "Fear",
    "Surprise",
    "Neutral"
  ];

  return (

    <div>

      <h1>Analytics</h1>
      <p>Emotion data visualization</p>

      <div className="table">

        <h2>Emotion Distribution Table</h2>

        <table>

          <thead>

            <tr>
              <th>Emotion</th>
              <th>Percentage</th>
            </tr>

          </thead>

          <tbody>

            {emotions.map(e => (

              <tr key={e}>
                <td>{e}</td>
                <td>0.00%</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}