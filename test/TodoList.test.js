const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.todoList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('lists tasks', async () => {
    const taskCount = await this.todoList.taskCount()
    const task = await this.todoList.tasks(taskCount)
    assert.equal(task.id.toNumber(), taskCount.toNumber())
    assert.equal(task.content, 'test')
    assert.equal(task.completed, false)
    assert.equal(taskCount.toNumber(), 1)
  })

  it('creates tasks', async () => {
    const result = await this.todoList.createTask('A new task')
    const taskCount = await this.todoList.taskCount()
    assert.equal(taskCount, 2)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 2)
    assert.equal(event.content, 'A new task')
    assert.equal(event.completed, false)
  })

  it('toggles task completion', async () => {
    const result = await this.todoList.toggleCompleted(1)
    const task = await this.todoList.tasks(1)
    assert.equal(task.completed, true)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1)
    assert.equal(event.completed, true)
  })

  it('toggles task delete', async () => {
    const taskCountBefore = await this.todoList.taskCount()
    
    for (let i = 1; i <= taskCountBefore; i++) {
      const task = await this.todoList.tasks(i)
      console.log(`Task ${i} content: ${task.content}`)
    }

    const result = await this.todoList.deleteTask(1)
    const task = await this.todoList.tasks(1)

    const taskCountAfter = await this.todoList.taskCount()

    for (let i = 1; i <= taskCountAfter; i++) {
      const task = await this.todoList.tasks(i)
      console.log(`Task ${i} content: ${task.content}`)
    }

    assert.equal(task.content, '', 'Task content should be empty after deletion')
    assert.equal(task.completed, false, 'Task should not be completed after deletion')

    const taskCount = await this.todoList.taskCount()
    assert.equal(taskCount, 2, 'Task count should remain the same after deletion (it does not decrease)')
  })

  it('edits task', async () => {
    const result = await this.todoList.editTask(1, 'chinazes')
    const task = await this.todoList.tasks(1)
    assert.equal(task.content, 'chinazes')
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1, 'The task ID should be 1')
    assert.equal(event.content, 'chinazes', 'The task content should be updated to "chinazes"')
  })
})