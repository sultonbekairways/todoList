const tasks = [/* 
  {
    _id: '5d2ca9e2e03d40b326596aa7',
    completed: true,
    body:
      'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
    title: 'Eu ea incididunt sunt consectetur fugiat non.',
  },*/
];

(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task
    return acc
  }, {})

  /* Element UI */
  const listContainer = document.querySelector(
    '.tasks-list-section .list-group'
  )
  const form = document.forms['addTask']
  const inputTitle = form.elements['title']
  const inputBody = form.elements['body']

  /* Events */
  renderAllTasks(arrOfTasks)
  form.addEventListener('submit', onFormSubmitHandler)
  listContainer.addEventListener('click', onDeleteHandler)
  listContainer.addEventListener('click', onDoneHandler)

  anyTaskChecker()

  function renderAllTasks(taskList) {
    if (!taskList.length) {
      // no tasks - no further actions
      return;
    }

    const fragment = document.createDocumentFragment()
    Object.values(taskList).forEach(task => {
      const li = ListItemTemplate(task)
      fragment.appendChild(li)
    })
    listContainer.appendChild(fragment)
  }

  function ListItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement('li')
    li.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center',
      'flex-wrap',
      'mt-2',
      'bg-info'
    )
    li.setAttribute('data-task-id', _id)

    const span = document.createElement('span')
    span.textContent = title
    span.style.fontWeight = 'bold'

    const taskDone = document.createElement('button')
    taskDone.textContent = 'Done'
    taskDone.classList.add(
      'btn',
      'btn-success',
      'ml-auto',
      'task-done-btn'
    )
    taskDone.setAttribute('data-task-id', _id)

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete task'
    deleteBtn.classList.add(
      'btn',
      'btn-danger',
      'ml-3',
      'delete-btn'
    )

    const div = document.createElement('div')
    div.classList.add(
      'ml-auto'
    )    
    div.appendChild(taskDone)
    div.appendChild(deleteBtn)

    const article = document.createElement('p')
    article.textContent = body
    article.classList.add(
      'mt-2',
      'w-100'
    )

    li.appendChild(span)
    li.appendChild(div)
    li.appendChild(article)

    return li
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    let titleValue = inputTitle.value
    let bodyValue = inputBody.value

    if (!titleValue && !bodyValue) {
      alert("Please, enter any kind of task into title or body! Otherwise, it's useless to create empty task.")
      return
    }

    if (!titleValue) {
      titleValue = 'No Title for this task'
    } else if (!bodyValue) {
      bodyValue = 'No description for this task'
    }

    const task = createNewTask(titleValue, bodyValue)
    const listItem = ListItemTemplate(task)
    anyTaskChecker()
    listContainer.insertAdjacentElement('afterbegin', listItem)
    form.reset()
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`
    }

    objOfTasks[newTask._id] = newTask

    return { ...newTask }
  }

  function onDoneHandler({ target }) {
    if (target.classList.contains('task-done-btn')) {
      const background = target.closest('.list-group-item')
      background.classList.toggle('bg-info')
      background.classList.toggle('bg-success')

      console.log(this);
      
    }
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id]
    const isConfirm = confirm(`Do you want to remove ${title}?`)
    if (!isConfirm) return isConfirm
    delete objOfTasks[id]
    return isConfirm
  }

  function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return
    el.remove();
    anyTaskChecker()
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]')
      const id = parent.dataset.taskId

      const confirmed = deleteTask(id)
      deleteTaskFromHtml(confirmed, parent)
    }
  }

  function anyTaskChecker() {
    if (listContainer.childElementCount === 0) {
      const p = document.createElement('p')
      p.textContent = 'No tasks left to do'
      Object.assign(p.style, {
        border: '1px solid rgba(0,0,0,.125)',
        'border-radius': '3px',
        background: 'rgba(23,134,23,.125)',
        padding: '7px 0',
        fontWeight: 'bold',
        color: '#007bff'
      })
      p.classList.add(
        'no-tasks',
        'text-center',
        'col-7',
        'col-sm-6',
        'm-auto'
      )
      listContainer.appendChild(p)
    } else {
      anyTaskRemove()
    }
  }

  function anyTaskRemove() {
    if (listContainer.children[0].tagName === "P") {
      listContainer.children[0].remove()
    }
  }
})(tasks);
