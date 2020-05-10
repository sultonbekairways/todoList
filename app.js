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

  /* Color themes */

  const themes = {
    default: {
      '--base-text-color': '#212529',
      '--header-bg': '#007bff',
      '--header-text-color': 'rgba(255, 255, 255, 0.9)',
      '--default-btn-bg': '#007bff',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#0077d9',
      '--default-btn-border-color': '#0069d9',
      '--danger-btn-bg': '#dc3545',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#bd2130',
      '--danger-btn-border-color': '#dc3545',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#80bdff',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 247, 255, 0.568)',
      '--body-bg': 'cadetblue',
      '--card-bg': '#f49f36',
      '--list-bg': '#f49f36',
    },
    dark: {
      '--base-text-color': '#212529',
      '--header-bg': '#343a40',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#58616b',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#292d31',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#b52d3a',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#88222c',
      '--danger-btn-border-color': '#88222c',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--body-bg': 'darkslategray',
      '--card-bg': 'dimgray',
      '--list-bg': 'dimgray',
    },
    light: {
      '--base-text-color': '#212529',
      '--header-bg': '#fff',
      '--header-text-color': '#212529',
      '--default-btn-bg': '#fff',
      '--default-btn-text-color': '#212529',
      '--default-btn-hover-bg': '#e8e7e7',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#f1b5bb',
      '--danger-btn-text-color': '#212529',
      '--danger-btn-hover-bg': '#ef808a',
      '--danger-btn-border-color': '#e2818a',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--body-bg': '#ced4da',
      '--card-bg': 'hsla(83, 64%, 74%, 0.64)',
      '--list-bg': 'hsla(83, 64%, 74%, 0.64)',
    },
  };
  let lastSelectedTheme = localStorage.getItem('app_theme') || 'default'

  /* Element UI */
  const listContainer = document.querySelector(
    '.tasks-list-section .list-group'
  )
  const form = document.forms['addTask']
  const inputTitle = form.elements['title']
  const inputBody = form.elements['body']
  const themeSelect = document.getElementById('themeSelect')

  /* Events */
  setTheme(lastSelectedTheme)
  renderAllTasks(arrOfTasks)
  form.addEventListener('submit', onFormSubmitHandler)
  listContainer.addEventListener('click', onDeleteHandler)
  listContainer.addEventListener('click', onDoneHandler)
  themeSelect.addEventListener('click', onThemeSelectHandler)

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
    deleteBtn.textContent = 'Delete'
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
      titleValue = 'No Title'
    } else if (!bodyValue) {
      bodyValue = 'No description'
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
      background.classList.toggle('bg-success')
      target.classList.toggle('btn-success')
      target.classList.toggle('btn-info')
      if(target.textContent === 'Done') {
        target.textContent = 'Undo'
      } else {
        target.textContent = 'Done'
      }
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
        background: 'rgba(23,134,23,.625)',
        padding: '7px 0',
        fontWeight: 'bold',
        color: 'rgb(0, 255, 231)'
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

  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value
    setTheme(selectedTheme)
    localStorage.setItem('app_theme', selectedTheme)
  }

  function setTheme(name) {
    const selectedThemeObj = themes[name]
    Object.entries(selectedThemeObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }
})(tasks);
