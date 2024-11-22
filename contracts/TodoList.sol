pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    event TaskCompleted(
        uint id,
        bool completed
    );

    event TaskDeleted(
        uint id
    );

    event TaskEdited(
        uint id,
        string content
    );

    constructor() public {
        createTask("test");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Task storage _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }

    function deleteTask(uint _id) public {
        delete tasks[_id]; 

        emit TaskDeleted(_id);
    }

    function editTask(uint _id, string memory _content) public {
        Task storage _task = tasks[_id];
        _task.content = _content;
        tasks[_id] = _task;
        emit TaskEdited(_id, _task.content);
    }

}