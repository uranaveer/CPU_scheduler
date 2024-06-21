#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
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
// a function to caluclate average times in.e average waiting time and average turn around time.
vector<double> average_times(vector<process> processes){
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
void FCFS(vector<process>& processes){
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
    
}
vector<vector<int>> fcfsganttchart(vector<process>& processes){
    vector<vector<int>> gantt_chart;

    int current_time = 0;
    for (const auto& p : processes) {
        if (current_time < p.arrivalTime) {
            current_time = p.arrivalTime;
        }
        gantt_chart.push_back({p.pid, current_time, current_time + p.burstTime});
        current_time += p.burstTime;
    }

    return gantt_chart;
}

//implementing shortest job first(pre-emptive)/ Shortest Remaining Time First algo and caluclating process pararmeters
vector<vector<int>> SJF(vector<process> &processes) {
    int n = processes.size(),current_time = 0;
    int completed = 0,shortest_remanining_time = INT_MAX ,shortest_process = -1;
    bool flag = false;
    vector<vector<int>> gantt_chart;

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
        gantt_chart.push_back({processes[shortest_process].pid, current_time, current_time + 1});
        processes[shortest_process].remainingTime--;
        shortest_remanining_time = processes[shortest_process].remainingTime;
        current_time++;

        if (processes[shortest_process].remainingTime == 0){
            processes[shortest_process].completionTime = current_time;
            processes[shortest_process].turnaroundTime = processes[shortest_process].completionTime - processes[shortest_process].arrivalTime;
            processes[shortest_process].waitingTime = processes[shortest_process].turnaroundTime - processes[shortest_process].burstTime;
            completed++;
            shortest_remanining_time = INT_MAX;
            flag = false;
        }
    }
    return gantt_chart;
}


//implementing priority-premptive algo and caluclating process pararmeters
vector<vector<int>> priority_priemptive(vector<process> &processes){
    int n = processes.size();int current_time = 0;
    int completed = 0, next_highest_priority = INT_MAX;
    int highest_priority_process = -1;
    bool flag = false;
    vector<vector<int>> gantt_chart;

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
        gantt_chart.push_back({processes[highest_priority_process].pid, current_time, current_time + 1});
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
    return gantt_chart;
}

//implementing round robin algorithim
vector<vector<int>> round_robin(vector<process>& processes, int quantum){

    int n = processes.size();
    queue<int> q;
    vector<int> burst_remaining(n);
    vector<int> waitingTime(n, 0);
    vector<int> turnaroundTime(n, 0);
    vector<bool> visited(n, false);
    vector<vector<int>> gantt_chart;

    for (int i = 0; i < n; ++i) {
        burst_remaining[i] = processes[i].burstTime;
        processes[i].remainingTime = burst_remaining[i];
    }

    int current_time = 0;
    int completed = 0;
    while(completed < n) {
        bool found = false;
        for(int i = 0; i < n; ++i) {
            if(burst_remaining[i] > 0 && processes[i].arrivalTime <= current_time && !visited[i]) {
                if(burst_remaining[i] <= quantum) {
                    gantt_chart.push_back({processes[i].pid, current_time, current_time + burst_remaining[i]});
                    current_time += burst_remaining[i];
                    burst_remaining[i] = 0;
                    visited[i] = true;
                    ++completed;
                } 
                else{
                    gantt_chart.push_back({processes[i].pid, current_time, current_time + quantum});
                    burst_remaining[i] -= quantum;
                    current_time += quantum;
                     found = true;
                }
            }

        if(!found){
            ++current_time;
        }
    }

    for(int i = 0; i < n; ++i) {
        turnaroundTime[i] = processes[i].burstTime + waitingTime[i];
        processes[i].turnaroundTime = turnaroundTime[i];
        processes[i].completionTime = processes[i].arrivalTime + turnaroundTime[i];
        processes[i].waitingTime = turnaroundTime[i] - processes[i].burstTime;
    }
    } 
    return gantt_chart;
}



void displayGanttChart(const vector<vector<int>>& gantt_chart) {
    cout << "\nGantt Chart:\n";
    for (const auto& slot : gantt_chart) {
        cout << "| P" << slot[0] << " ";
    }
    cout << "|\n";

    for (const auto& slot : gantt_chart) {
        cout << slot[1] << "\t";
    }
    cout << gantt_chart.back()[2] << "\n";
}


//displaying results
void displayResults(const vector<process>& processes) {
    cout << "PID\tArrival\tBurst\tCompletion\tTurnaround\tWaiting\n";
    for (const auto& p : processes) {
        cout << p.pid << "\t" << p.arrivalTime << "\t" << p.burstTime << "\t" << p.completionTime
             << "\t\t" << p.turnaroundTime << "\t\t" << p.waitingTime << "\n";
    }
    vector<double> v=average_times(processes);
    cout<<"Average Turnaround time = "<<v[1]<<'\n';
    cout<<"Average Waiting time = "<<v[0]<<'\n';
}
int main(){
    cout << "Select algorithim "<<'\n';
    cout<<"1 for FCFS"<<'\n'<<"2 for SJF"<<'\n'<<"3 for prority premptive"<<'\n'<<"4 for roundd robin"<<'\n'<<'\n';
    cout<<"Enter your choice :";
    int choice;
    cin>>choice;
    cout<<'\n'<<"Enter no.of process:";
    int n;
    cin>>n;
    vector<process> processes(n);
    if(choice==3){
        for (int i = 0; i < n; i++) {
            cout << "Enter arrival time and burst time for process and priority " << i + 1 << ": ";
            cin >> processes[i].arrivalTime >> processes[i].burstTime >> processes[i].priority;
            processes[i].pid = i + 1;
            processes[i].remainingTime = processes[i].burstTime;
            processes[i].startTime = -1;
        }
    }
    else{
        for (int i = 0; i < n; i++) {
            cout << "Enter arrival time and burst time for process " << i + 1 << ": ";
            cin >> processes[i].arrivalTime >> processes[i].burstTime;
            processes[i].pid = i + 1;
            processes[i].remainingTime = processes[i].burstTime;
            processes[i].startTime = -1;
        }
    }
    
    vector<vector<int>> GanttChart;
    switch (choice) {
        case 1:
            FCFS(processes);
            GanttChart=fcfsganttchart(processes);
            break;
        case 2:
            GanttChart=SJF(processes);
            break;
        case 3: {
            GanttChart=priority_priemptive(processes);
            break;
        }
        case 4:{
            int quantum;
            cout << "Enter the time quantum for Round Robin: ";
            cin >> quantum;
            GanttChart=round_robin(processes, quantum);
            break;

        }
        default:
            cout << "invaild input! choose among four" << endl;
            return 1;
    }
    displayGanttChart(GanttChart);
    displayResults(processes);
    return 0;
}
