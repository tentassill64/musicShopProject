using System;

namespace musicShopProject.Tools.Infrastructure;

public class TasksWorker
{
    private readonly List<Action<Object>> _actions = new();

    public Int32 ActionsCount => _actions.Count;

    public TasksWorker AddTask(Action<Object> action)
    {
        _actions.Add(action);

        return this;
    }

    public void ClearTasks()
    {
        _actions.Clear();
    }

    public void Start()
    {
        Task[] tasks = _actions.Select(x => Task.Factory.StartNew(x, null)).ToArray();
        Task.WaitAll(tasks);
        TaskException.Throw(tasks);
    }

    public void StartSync()
    {
        foreach (Action<Object> action in _actions) action(null);
    }

    public static void New(Action<TasksWorker> action)
    {
        if (action == null) throw new ArgumentNullException(nameof(action));

        TasksWorker tw = new TasksWorker();
        action(tw);
        tw.Start();
        tw.ClearTasks();
    }

    public static void Start(params Action[] actions)
    {
        TasksWorker tw = new TasksWorker();

        foreach (Action action in actions)
            tw.AddTask(_ => action());

        tw.Start();
        tw.ClearTasks();
    }
}
public static class TaskException
{
    public static void Throw(params Task[] tasks)
    {
        foreach (Task task in tasks)
        {
            if (task != null && task.Exception != null)
                throw task.Exception;
        }
    }
}
