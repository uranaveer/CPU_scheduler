import React, { useState,useEffect } from 'react';
import loadWasm from 'C:/Users/urana/Projects/CPU_scheduler/wasm_module.js';

const ManualPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [wasmModule, setWasmModule] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [processes, setProcesses] = useState([]);
  const [quantumTime, setQuantumTime] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    loadWasm()
      .then(module => {
        console.log('WASM module loaded', module);
        setWasmModule(module);
      })
      .catch(error => {
        console.error('Error loading WASM module:', error);
      });
  }, []);

  const runFCFS = () => {
    if (!wasmModule) {
      console.error('WASM module is not loaded');
      return;
    }

    if (typeof wasmModule.initialize_processes !== 'function') {
      console.error('initialize_processes is not a function in the WASM module');
      return;
    }

    const processes = [
      [1, 0, 4, 1], // pid, arrivalTime, burstTime, priority
      [2, 1, 3, 2],
      [3, 2, 2, 3],
    ];

    try {
      wasmModule.initialize_processes(processes);
      const results = wasmModule.FCFS();
      setResults(results);
      console.log('FCFS Results:', results);
    } catch (error) {
      console.error('Error running FCFS:', error);
    }
  };

  const handleAlgorithmClick = (algorithm) => {
    setSelectedAlgorithm(algorithm);
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

  const handleReset = () => {
    setSelectedAlgorithm(null);
    setInputValue('');
    setProcesses([]);
    setQuantumTime('');
    setResults(null);
  };

  const handleSubmit = () => {
    // Implement logic to send data to backend and receive results
    const mockResults = {
      completionTime: [10, 20, 30, 40],
      turnaroundTime: [5, 15, 25, 35],
      waitingTime: [2, 8, 15, 20],
      averageTurnaroundTime: 20,
      averageWaitingTime: 11.25,
    };
    setResults(mockResults);
  };

  const getAlgorithmClassName = (algorithm) => {
    return `p-4 border border-black rounded cursor-pointer ${
      selectedAlgorithm === algorithm ? 'bg-cyan-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
    }`;
  };

  return (
    <div className="p-4">
      <button onClick={runFCFS}>ClickMe</button>
      <h2 className="text-2xl mb-4">Select algorithm</h2>
      <div className="grid grid-cols-2 gap-4">
        <div
          className={getAlgorithmClassName('FCFS')}
          onClick={() => handleAlgorithmClick('FCFS')}
        >
          FCFS
        </div>
        <div
          className={getAlgorithmClassName('SJF/SRTF')}
          onClick={() => handleAlgorithmClick('SJF/SRTF')}
        >
          SJF/SRTF
        </div>
        <div
          className={getAlgorithmClassName('Priority-Premptive')}
          onClick={() => handleAlgorithmClick('Priority-Premptive')}
        >
          Priority-Premptive
        </div>
        <div
          className={getAlgorithmClassName('Round-Robin')}
          onClick={() => handleAlgorithmClick('Round-Robin')}
        >
          Round-Robin
        </div>
      </div>
      {selectedAlgorithm && (
        <div className="mt-4">
          <p className='text-lg'> Enter no.of Processes</p>
          <input
            type="number"
            className="p-2 border border-gray-300 rounded"
            placeholder="Enter number of processes"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
      )}
      {processes.length > 0 && (
        <div className="mt-4">
          {selectedAlgorithm === 'Round-Robin' && (
            <div className="mt-4 p-2">
              <h3 className='text-lg'>Enter Time quantum</h3>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded"
                placeholder="Enter quantum time"
                value={quantumTime}
                onChange={handleQuantumTimeChange}
              />
            </div>
          )}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Process ID</th>
                <th className="border border-gray-300 px-4 py-2">Arrival Time</th>
                <th className="border border-gray-300 px-4 py-2">Burst Time</th>
                {selectedAlgorithm === 'Priority-Premptive' && (
                  <th className="border border-gray-300 px-4 py-2">Priority</th>
                )}
                {results && (
                  <>
                    <th className="border border-gray-300 px-4 py-2">Completion Time</th>
                    <th className="border border-gray-300 px-4 py-2">Turnaround Time</th>
                    <th className="border border-gray-300 px-4 py-2">Waiting Time</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {processes.map((process, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{process.id}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={process.arrivalTime}
                      onChange={(e) => handleProcessInputChange(index, 'arrivalTime', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={process.burstTime}
                      onChange={(e) => handleProcessInputChange(index, 'burstTime', e.target.value)}
                    />
                  </td>
                  {selectedAlgorithm === 'Priority-Premptive' && (
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={process.priority}
                        onChange={(e) => handleProcessInputChange(index, 'priority', e.target.value)}
                      />
                    </td>
                  )}
                  {results && (
                    <>
                      <td className="border border-gray-300 px-4 py-2">{results.completionTime[index]}</td>
                      <td className="border border-gray-300 px-4 py-2">{results.turnaroundTime[index]}</td>
                      <td className="border border-gray-300 px-4 py-2">{results.waitingTime[index]}</td>
                    </>
                  )}
                </tr>
              ))}
              {results && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2" colSpan={4}>Average Turnaround Time</td>
                  <td className="border border-gray-300 px-4 py-2" colSpan={2}>{results.averageTurnaroundTime}</td>
                </tr>
              )}
              {results && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2" colSpan={4}>Average Waiting Time</td>
                  <td className="border border-gray-300 px-4 py-2" colSpan={2}>{results.averageWaitingTime}</td>
                </tr>
              )}
            </tbody>
          </table>
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
      )}
    </div>
  );
};

export default ManualPage;
