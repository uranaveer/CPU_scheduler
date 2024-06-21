import React, { useState } from 'react';

const AutomaticPage = () => {
  const [selectedSorting, setSelectedSorting] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [processes, setProcesses] = useState([]);
  const [quantumTime, setQuantumTime] = useState('');
  const [priority, setPriority] = useState('');
  const [results, setResults] = useState(null);

  const handleSortingChange = (sorting) => {
    setSelectedSorting(sorting);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    generateGrid(event.target.value);
  };

  const generateGrid = (value) => {
    if (!value) return;
    const numProcesses = parseInt(value, 10);
    if (isNaN(numProcesses) || numProcesses <= 0) return;
    const newProcesses = Array.from({ length: numProcesses }, (_, index) => ({
      id: `P${index + 1}`,
      arrivalTime: '',
      burstTime: '',
      priority: '',
    }));
    setProcesses(newProcesses);
  };

  const handleProcessInputChange = (index, field, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][field] = value;
    setProcesses(updatedProcesses);
  };

  const handleQuantumTimeChange = (event) => {
    setQuantumTime(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleReset = () => {
    setSelectedSorting(null);
    setInputValue('');
    setProcesses([]);
    setQuantumTime('');
    setPriority('');
    setResults(null);
  };

  const handleSubmit = () => {
    // Implement logic to send data to backend and receive results
    // Mocking results for demonstration
    const mockResults = {
      fcfs: {
        completionTime: [10, 20, 30, 40],
        turnaroundTime: [5, 15, 25, 35],
        waitingTime: [2, 8, 15, 20],
        averageTurnaroundTime: 20,
        averageWaitingTime: 11.25,
      },
      sjf: {
        completionTime: [15, 25, 35, 45],
        turnaroundTime: [8, 18, 28, 38],
        waitingTime: [3, 10, 20, 25],
        averageTurnaroundTime: 22.5,
        averageWaitingTime: 14.5,
      },
      // Add results for other algorithms here
    };

    // Sort results based on selected sorting method
    const sortedResults = { ...mockResults };
    if (selectedSorting === 'avgTurnaround') {
      for (const key in sortedResults) {
        sortedResults[key] = sortResultsByTurnaroundTime(sortedResults[key]);
      }
    } else if (selectedSorting === 'avgWaiting') {
      for (const key in sortedResults) {
        sortedResults[key] = sortResultsByWaitingTime(sortedResults[key]);
      }
    }

    setResults(sortedResults);
  };

  const sortResultsByTurnaroundTime = (results) => {
    return Object.keys(results).sort((a, b) => {
      return results[a].averageTurnaroundTime - results[b].averageTurnaroundTime;
    }).reduce((obj, key) => {
      obj[key] = results[key];
      return obj;
    }, {});
  };

  const sortResultsByWaitingTime = (results) => {
    return Object.keys(results).sort((a, b) => {
      return results[a].averageWaitingTime - results[b].averageWaitingTime;
    }).reduce((obj, key) => {
      obj[key] = results[key];
      return obj;
    }, {});
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Automatic Page</h2>
      <div className="mt-4">
        <p className="text-lg">Select Sorting Method</p>
        <div>
          <input
            type="radio"
            id="avgTurnaround"
            name="sorting"
            value="avgTurnaround"
            checked={selectedSorting === "avgTurnaround"}
            onChange={() => handleSortingChange("avgTurnaround")}
          />
          <label htmlFor="avgTurnaround">Sort by Average Turnaround Time</label>
        </div>
        <div>
          <input
            type="radio"
            id="avgWaiting"
            name="sorting"
            value="avgWaiting"
            checked={selectedSorting === "avgWaiting"}
            onChange={() => handleSortingChange("avgWaiting")}
          />
          <label htmlFor="avgWaiting">Sort by Average Waiting Time</label>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-lg">Enter Number of Processes</p>
        <input
          type="number"
          className="p-2 border border-gray-300 rounded"
          placeholder="Enter number of processes"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      {processes.length > 0 && (
        <div className="mt-4">
          <p className="text-lg">Enter Time Quantum (if applicable)</p>
          <input
            type="number"
            className="p-2 border border-gray-300 rounded"
            placeholder="Enter time quantum"
            value={quantumTime}
            onChange={handleQuantumTimeChange}
          />
          <p className="text-lg">Enter Priority (if applicable)</p>
          <input
            type="number"
            className="p-2 border border-gray-300 rounded"
            placeholder="Enter priority"
            value={priority}
            onChange={handlePriorityChange}
          />
          <div className="mt-4">
            {results && (
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(results).map((algorithm, index) => (
                  <div key={index}>
                    <h3 className="text-lg">{algorithm}</h3>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 px-4 py-2">Process ID</th>
                          <th className="border border-gray-300 px-4 py-2">Arrival Time</th>
                          <th className="border border-gray-300 px-4 py-2">Burst Time</th>
                          <th className="border border-gray-300 px-4 py-2">Priority</th>
                          <th className="border border-gray-300 px-4 py-2">Completion Time</th>
                          <th className="border border-gray-300 px-4 py-2">Turnaround Time</th>
                          <th className="border border-gray-300 px-4 py-2">Waiting Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processes.map((process, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{process.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{process.arrivalTime}</td>
                            <td className="border border-gray-300 px-4 py-2">{process.burstTime}</td>
                            <td className="border border-gray-300 px-4 py-2">{process.priority}</td>
                            <td className="border border-gray-300 px-4 py-2">{results[algorithm].completionTime[index]}</td>
                            <td className="border border-gray-300 px-4 py-2">{results[algorithm].turnaroundTime[index]}</td>
                            <td className="border border-gray-300 px-4 py-2">{results[algorithm].waitingTime[index]}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="border border-gray-300 px-4 py-2" colSpan={4}>Average Turnaround Time</td>
                          <td className="border border-gray-300 px-4 py-2" colSpan={2}>{results[algorithm].averageTurnaroundTime}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2" colSpan={4}>Average Waiting Time</td>
                          <td className="border border-gray-300 px-4 py-2" colSpan={2}>{results[algorithm].averageWaitingTime}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-4 text-center">
        <button
          className="mr-2 p-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="p-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={handleSubmit}
        >
          Run
        </button>
      </div>
    </div>
  );
};

export default AutomaticPage;
