import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Tag, AlertCircle, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

// --- Components ---

const Badge = ({ children, color, icon: Icon }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${color}`}>
    {Icon && <Icon size={12} />}
    {children}
  </span>
);

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const priorityColors = {
    'Bassa': 'bg-blue-50 text-blue-700 border-blue-200',
    'Media': 'bg-amber-50 text-amber-700 border-amber-200',
    'Alta': 'bg-red-50 text-red-700 border-red-200',
  };

  const statusIcons = {
    'Da fare': Circle,
    'In corso': ArrowRight,
    'Fatto': CheckCircle2
  };

  const nextStatus = {
    'Da fare': 'In corso',
    'In corso': 'Fatto',
    'Fatto': 'Da fare'
  };

  return (
    <div className="group bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 relative">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-stone-800 leading-tight">{task.title}</h3>
        <button 
          onClick={() => onDelete(task.id)}
          className="text-stone-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
          aria-label="Elimina task"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge color={priorityColors[task.priority]} icon={AlertCircle}>
          {task.priority}
        </Badge>
        <Badge color="bg-stone-100 text-stone-600 border-stone-200" icon={Tag}>
          {task.category}
        </Badge>
        <Badge color="bg-stone-100 text-stone-600 border-stone-200" icon={Clock}>
          {task.time}
        </Badge>
      </div>

      <div className="pt-2 border-t border-stone-100 flex justify-end">
        <button 
          onClick={() => onStatusChange(task.id, nextStatus[task.status])}
          className="text-xs font-medium text-forest-600 hover:text-forest-700 flex items-center gap-1 transition-colors"
        >
          Sposta in {nextStatus[task.status]}
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

const TaskColumn = ({ title, status, tasks, onDelete, onStatusChange, icon: Icon, colorClass }) => {
  const filteredTasks = tasks.filter(t => t.status === status);
  
  return (
    <div className="flex-1 min-w-[300px] flex flex-col gap-4">
      <div className={`flex items-center justify-between p-3 rounded-lg border ${colorClass} bg-opacity-50`}>
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-stone-600" />
          <h2 className="font-semibold text-stone-700">{title}</h2>
        </div>
        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-stone-600 border border-stone-200 shadow-sm">
          {filteredTasks.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-3 min-h-[200px]">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-stone-400 border-2 border-dashed border-stone-200 rounded-xl">
            <span className="text-sm">Nessun task</span>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={onDelete} 
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

const NewTaskModal = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onAdd({
      title: formData.get('title'),
      priority: formData.get('priority'),
      category: formData.get('category'),
      time: formData.get('time'),
      status: 'Da fare',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-stone-800">Nuovo Task</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <span className="sr-only">Chiudi</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Titolo</label>
            <input 
              name="title" 
              required 
              autoFocus
              placeholder="Cosa devi fare?"
              className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Priorità</label>
              <select name="priority" className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-forest-500 outline-none bg-white">
                <option value="Bassa">Bassa</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Categoria</label>
              <select name="category" className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-forest-500 outline-none bg-white">
                <option value="Lavoro">Lavoro</option>
                <option value="Studio">Studio</option>
                <option value="Personale">Personale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Tempo Stimato</label>
            <div className="grid grid-cols-3 gap-2">
              {['15m', '30m', '60m'].map((t) => (
                <label key={t} className="cursor-pointer">
                  <input type="radio" name="time" value={t} defaultChecked={t === '30m'} className="peer sr-only" />
                  <div className="text-center py-2 rounded-lg border border-stone-200 text-stone-600 peer-checked:bg-forest-50 peer-checked:border-forest-500 peer-checked:text-forest-700 transition-all text-sm font-medium hover:bg-stone-50">
                    {t}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
            >
              Annulla
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-forest-600 text-white font-medium hover:bg-forest-700 shadow-md shadow-forest-200 transition-colors"
            >
              Crea Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('daily-task-tracker-data');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Analisi requisiti', priority: 'Alta', status: 'In corso', category: 'Lavoro', time: '60m' },
      { id: 2, title: 'Fare la spesa', priority: 'Bassa', status: 'Da fare', category: 'Personale', time: '30m' },
      { id: 3, title: 'Studiare React', priority: 'Media', status: 'Fatto', category: 'Studio', time: '60m' },
    ];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('daily-task-tracker-data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const changeStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-forest-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <CheckCircle2 size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-stone-800">Daily Task Tracker</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} />
            Nuovo Task
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 items-start">
          <TaskColumn 
            title="Da fare" 
            status="Da fare" 
            tasks={tasks} 
            onDelete={deleteTask} 
            onStatusChange={changeStatus}
            icon={Circle}
            colorClass="bg-stone-100 border-stone-200"
          />
          <TaskColumn 
            title="In corso" 
            status="In corso" 
            tasks={tasks} 
            onDelete={deleteTask} 
            onStatusChange={changeStatus}
            icon={Clock}
            colorClass="bg-amber-50 border-amber-100"
          />
          <TaskColumn 
            title="Fatto" 
            status="Fatto" 
            tasks={tasks} 
            onDelete={deleteTask} 
            onStatusChange={changeStatus}
            icon={CheckCircle2}
            colorClass="bg-forest-50 border-forest-100"
          />
        </div>
      </main>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addTask} 
      />
    </div>
  );
}