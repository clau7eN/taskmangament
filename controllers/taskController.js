const Task = require('../models/tasks.js')

exports.createTask = async (req, res) => {
  const {title, description} = req.body;

  const userId = req.user.id

  const newTask = new Task({title, description, userId});

  try {
    await newTask.save()
    console.log('Задача создана!', newTask)
    res.send('Задача успешно создана!')
  } catch (e) {
    res.status(500).send('Error!')
    console.error(e)
  }
}

exports.getTasks = async (req, res) => {
  try {
    const allTasks = await Task.find()
    res.json(allTasks)
} catch (e) {console.log(e)}
}

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if(!task) {
      return res.status(404).send('Задача не найдена!')
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).send('Вы не автор этой задачи и не имеет право удалять!')
    }

   const deletedTask = await Task.findByIdAndDelete(req.params.id);
   if (deletedTask) {
    res.send('Успешно удален!')
   } else {
    res.status(400).send('Проблема!')
   }
  } catch (e) {'ошибка', e}
}


exports.editTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Задача не найдена.' });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Вы не автор этой задачи и не можете её отредактировать!' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description
      },
      { new: true }
    );

    res.json({
      msg: 'Успешное редактирование!',
      task: updatedTask
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Ошибка при редактировании задачи.' });
  }
};