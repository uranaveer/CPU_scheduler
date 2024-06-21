#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <emscripten/bind.h>
using namespace emscripten;
using namespace std;

// a structure that defines a process with its parameters
struct process{

    int pid; // Process ID
    int arrivalTime; 
    int burstTime; 
    int startTime; 
    int completionTime; 
    int turnaroundTime; 
    int waitingTime;
    int remainingTime;
    int priority;
};
std::vector<process> processes;
EMSCRIPTEN_KEEPALIVE void initialize_processes(std::vector<vector<int>> jsProcesses) {
    for (const auto& p : jsProcesses) {
        processes.push_back({p[0], p[1], p[2], -1, -1, -1, -1, p[2], p[3]});
    }
}
// a function to caluclate average times in.e average waiting time and average turn around time.
std::vector<double> average_times(){
    double totalWaitingTime = 0;
    double totalTurnaroundTime = 0;
    for (const auto& process : processes) {
        totalWaitingTime += process.waitingTime;
        totalTurnaroundTime += process.turnaroundTime;
    }
    double averageWaitingTime = totalWaitingTime / processes.size();
    double averageTurnaroundTime = totalTurnaroundTime / processes.size();

    return {averageWaitingTime,averageTurnaroundTime};
}

// implementing FCFS scheduling algo and caluclating process parameters.
EMSCRIPTEN_KEEPALIVE vector<vector<int>> FCFS(){
    // arranging processes acc.to their arrival time
    sort(processes.begin(), processes.end(), [](const process& a, const process& b) {
        return a.arrivalTime < b.arrivalTime;
    });
    // schedulling/executing processes acc.to fcfs
    int current_time=0;
    for(auto &p:processes){
        if(current_time<p.arrivalTime){
           current_time=p.arrivalTime;
        }
        p.startTime=current_time;
        p.completionTime=p.startTime+p.burstTime;
        p.turnaroundTime=p.completionTime-p.arrivalTime;
        p.waitingTime=p.turnaroundTime-p.burstTime;
        current_time=p.completionTime;
    }
    std::vector<vector<int>> v;
    for(auto &p:processes){
        v.push_back({p.completionTime,p.turnaroundTime,p.waitingTime});
    }
    return v;
}

//implementing shortest job first(pre-emptive)/ Shortest Remaining Time First algo and caluclating process pararmeters
EMSCRIPTEN_KEEPALIVE vector<vector<int>> SJF() {
    int n = processes.size(),current_time = 0;
    int completed = 0,shortest_remanining_time = INT_MAX ,shortest_process = -1;
    bool flag = false;

    while (completed != n) {
        // Finding process with shortest remaining time at the current time
        for (int in = 0; in < n; in++) {
            if (processes[in].arrivalTime <= current_time && processes[in].remainingTime > 0 && processes[in].remainingTime < shortest_remanining_time) {
                shortest_remanining_time = processes[in].remainingTime;
                shortest_process = in;
                flag = true;
            }
        }

        if (!flag) {
            current_time++;
            continue;
        }

        // Executing the process with the shortest remaining time
        processes[shortest_process].remainingTime--;
        shortest_remanining_time = processes[shortest_process].remainingTime;
        current_time++;

        if (processes[shortest_process].remainingTime == 0) {
            processes[shortest_process].completionTime = current_time;
            processes[shortest_process].turnaroundTime = processes[shortest_process].completionTime - processes[shortest_process].arrivalTime;
            processes[shortest_process].waitingTime = processes[shortest_process].turnaroundTime - processes[shortest_process].burstTime;
            completed++;
            shortest_remanining_time = INT_MAX;
            flag = false;
        }
    }
    std::vector<vector<int>> v;
    for(auto &p:processes){
        v.push_back({p.completionTime,p.turnaroundTime,p.waitingTime});
    }
    return v;
}

//implementing priority-premptive algo and caluclating process pararmeters
EMSCRIPTEN_KEEPALIVE vector<vector<int>> priority_priemptive(){
    int n = processes.size();int current_time = 0;
    int completed = 0, next_highest_priority = INT_MAX;
    int highest_priority_process = -1;
    bool flag = false;

    while (completed != n) {
        // Finding process with the highest priority at the current time
        for (int i = 0; i < n; i++) {
            if (processes[i].arrivalTime <= current_time && processes[i].remainingTime > 0 && processes[i].priority < next_highest_priority) {
                next_highest_priority = processes[i].priority;
                highest_priority_process = i;
                flag = true;
            }
        }
        if (!flag) {
            current_time++;
            continue;
        }

        // Executing the process with the highest priority
        if (processes[highest_priority_process].startTime == -1) {
            processes[highest_priority_process].startTime = current_time;
        }
        
        processes[highest_priority_process].remainingTime--;
        current_time++;

        if (processes[highest_priority_process].remainingTime == 0) {
            processes[highest_priority_process].completionTime = current_time;
            processes[highest_priority_process].turnaroundTime = processes[highest_priority_process].completionTime - processes[highest_priority_process].arrivalTime;
            processes[highest_priority_process].waitingTime = processes[highest_priority_process].turnaroundTime - processes[highest_priority_process].burstTime;
            completed++;
            next_highest_priority = INT_MAX;
            flag = false;
        }
    }
    std::vector<vector<int>> v;
    for(auto &p:processes){
        v.push_back({p.completionTime,p.turnaroundTime,p.waitingTime});
    }
    return v;
}

EMSCRIPTEN_KEEPALIVE std::vector<vector<int>> round_robin(vector<process>& processes, int quantum) {
    int n = processes.size();
    queue<int> q;
    vector<int> burst_remaining(n);
    vector<int> waitingTime(n, 0);
    vector<int> turnaroundTime(n, 0);
    vector<bool> visited(n, false);

    for (int i = 0; i < n; ++i) {
        burst_remaining[i] = processes[i].burstTime;
        processes[i].remainingTime = burst_remaining[i];
    }

    int current_time = 0;
    int completed = 0;
    while (completed < n) {
        bool found = false;
        for (int i = 0; i < n; ++i) {
            if (burst_remaining[i] > 0 && processes[i].arrivalTime <= current_time && !visited[i]) {
                if (burst_remaining[i] <= quantum) {
                    current_time += burst_remaining[i];
                    burst_remaining[i] = 0;
                    visited[i] = true;
                    ++completed;
                } else {
                    burst_remaining[i] -= quantum;
                    current_time += quantum;
                     found = true;
            }
        }

        if (!found) {
            ++current_time;
            cout << "->" << current_time;
        }
    }
    cout << endl;

    for (int i = 0; i < n; ++i) {
        turnaroundTime[i] = processes[i].burstTime + waitingTime[i];
        processes[i].turnaroundTime = turnaroundTime[i];
        processes[i].completionTime = processes[i].arrivalTime + turnaroundTime[i];
        processes[i].waitingTime = turnaroundTime[i] - processes[i].burstTime;
    }
    std::vector<vector<int>> v;
    for(auto &p:processes){
        v.push_back({p.completionTime,p.turnaroundTime,p.waitingTime});
    }
    return v;
}
}



EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("initialize_processes", &initialize_processes);
    emscripten::function("average_times", &average_times);
    emscripten::function("FCFS", &FCFS);
    emscripten::function("SJF",&SJF);
    emscripten::function("priority_priemptive",&priority_priemptive);
    emscripten::function("round_robin",&round_robin);
    // Bind other functions here
}
