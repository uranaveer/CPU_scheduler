
# Cpu scheduler

Implementation cpu scheduling algorithims(i.e fcfs,sjf,proirity-premptive, round-robin) in cpp and comparing there performance by various stats.


## Installation

To run this project, first clone the repo
<br>
for python interface
```bash
run python_gui.py
```



for terminal interface
```bash
run implementaion_main.cpp 
```

for web interface
```bash
cd web_interface/frontend
npm run dev
```
## Working
This project implements a set of CPU scheduling algorithms to manage process execution in an operating system. The supported algorithms include First-Come, First-Served (FCFS), Shortest Job First (SJF), Priority Preemptive, and Round Robin. Each algorithm is implemented to handle processes with varying arrival times, burst times, and priorities, scheduling them efficiently based on specific criteria.

In FCFS, processes are executed in the order they arrive. SJF selects the process with the shortest burst time next, optimizing for the shortest average waiting time. Priority Preemptive scheduling chooses the process with the highest priority (lowest numerical value) for execution, preempting lower-priority processes if needed. Round Robin allocates CPU time slices (quantum) to each process in a cyclic order, ensuring a fair sharing of CPU time.

The project also includes functionality to display the scheduling results and visualize the Gantt chart for the Round Robin algorithm. This visualization helps to understand the time distribution of processes in a time-shared system. The user can select the desired scheduling algorithm, input process details, and view the calculated metrics such as completion time, turnaround time, and waiting time for each process, providing insights into the efficiency of different scheduling strategies.

## Learnings
This project provided valuable insights into various CPU scheduling algorithms, including FCFS, SJF, Priority Preemptive, and Round Robin. Implementing these algorithms helped in understanding their mechanics, strengths, and weaknesses. Additionally, visualizing scheduling results with Gantt charts enhanced comprehension of process execution flow and performance metrics, deepening knowledge of efficient CPU time management in operating systems.

## Screenshots
[Drive link interface images](https://drive.google.com/drive/folders/1O0d2uchKPUzoHJkT8Cc0MCL69PuTJ3HO?usp=sharing)


## Report_link
