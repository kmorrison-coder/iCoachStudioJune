import { useState, useMemo } from 'react';
import { IntegrationTask } from '../types';
import { playClickSound, playPageTurnSound } from '../utils/audio';
import { Search, SlidersHorizontal, Calendar, Info, CheckCircle2, FileSliders, CircleEllipsis } from 'lucide-react';

interface TaskListProps {
  tasks: IntegrationTask[];
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onUpdateStatus: (id: string, status: 'Planning' | 'Ready' | 'Completed') => void;
}

export default function TaskList({ tasks, selectedTaskId, onSelectTask, onUpdateStatus }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const subjectsList = useMemo(() => {
    const list = new Set(tasks.map(t => t.subject));
    return ['All', ...Array.from(list)];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (task.teacherNotes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (task.ccssId || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGrade = gradeFilter === 'All' || task.gradeLevel === gradeFilter;
      const matchesSubject = subjectFilter === 'All' || task.subject === subjectFilter;
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;

      return matchesSearch && matchesGrade && matchesSubject && matchesStatus;
    });
  }, [tasks, searchTerm, gradeFilter, subjectFilter, statusFilter]);

  const handleTaskClick = (id: string) => {
    playPageTurnSound();
    onSelectTask(id);
  };

  const getStatusIcon = (status: 'Planning' | 'Ready' | 'Completed') => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Ready':
        return <CheckCircle2 className="w-4 h-4 text-orange-600 fill-orange-150" />;
      default:
        return <CircleEllipsis className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: 'Planning' | 'Ready' | 'Completed') => {
    switch (status) {
      case 'Completed':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold">Done</span>;
      case 'Ready':
        return <span className="bg-orange-500/10 text-orange-800 border border-orange-400/20 text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold">Ready</span>;
      default:
        return <span className="bg-neutral-50 text-neutral-600 border border-neutral-200 text-[10px] uppercase font-mono px-2 py-0.5 rounded">Planning</span>;
    }
  };

  return (
    <div id="tasks-planner-list" className="space-y-4">
      {/* Search and Filters Deck */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-5 space-y-3 shadow-xs">
        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
          Search & Query
        </label>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
          <input
            id="input-task-search"
            type="text"
            placeholder="Search topic plans, standards, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>

        {/* Triple Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
          <div>
            <label htmlFor="filter-grade" className="sr-only">Grade Filter</label>
            <select
              id="filter-grade"
              value={gradeFilter}
              onChange={(e) => { playPageTurnSound(); setGradeFilter(e.target.value); }}
              className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-bold bg-white cursor-pointer"
            >
              <option value="All">All Grades</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="1st Grade">1st Grade</option>
              <option value="2nd Grade">2nd Grade</option>
              <option value="3rd Grade">3rd Grade</option>
              <option value="4th Grade">4th Grade</option>
              <option value="5th Grade">5th Grade</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-subject" className="sr-only">Subject Filter</label>
            <select
              id="filter-subject"
              value={subjectFilter}
              onChange={(e) => { playPageTurnSound(); setSubjectFilter(e.target.value); }}
              className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-bold bg-white cursor-pointer"
            >
              <option value="All">All Subjects</option>
              {subjectsList.filter(s => s !== 'All').map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-status" className="sr-only">Status Filter</label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => { playPageTurnSound(); setStatusFilter(e.target.value); }}
              className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-bold bg-white cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="Ready">Ready</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Cards Deck */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white border-2 border-gray-200 rounded-3xl p-6">
            <Info className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-black uppercase text-neutral-400 tracking-wider">Empty Sandbox</p>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-2 leading-relaxed">
              Adjust filters or press the button above to generate a new custom iPad technology combination.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isSelected = selectedTaskId === task.id;
            return (
              <div
                id={`task-card-${task.id}`}
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className={`relative bg-white border-2 rounded-3xl p-6 cursor-pointer transition-all hover:shadow-md ${
                  isSelected 
                    ? 'border-orange-500 shadow-lg ring-2 ring-orange-200 bg-orange-50/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Upper row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0">{getStatusIcon(task.status)}</span>
                    <h3 className="font-display font-black text-neutral-900 text-lg uppercase tracking-tight line-clamp-2">
                      {task.topic}
                    </h3>
                  </div>
                  {task.status === 'Completed' ? (
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">Done</span>
                  ) : task.status === 'Ready' ? (
                    <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">Ready</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">Plan</span>
                  )}
                </div>

                {/* Sub row badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3 mt-1">
                  <span className="px-3 py-1 bg-neutral-900 text-white rounded-lg text-xs font-black uppercase tracking-widest scale-90 origin-left">
                    {task.gradeLevel}
                  </span>
                  <span className="px-3 py-1 border-2 border-gray-200 rounded-lg text-xs font-black uppercase text-gray-500 scale-90 origin-left">
                    {task.subject}
                  </span>
                </div>

                {/* Micro preview snippet */}
                {task.aiSuggestion && (
                  <p className="text-sm text-neutral-600 line-clamp-2 italic font-sans mb-1 mt-2 border-t border-gray-100 pt-3">
                    {task.aiSuggestion.summary}
                  </p>
                )}

                {/* Optional planned date */}
                {task.plannedDate && (
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2 border-t border-gray-50">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Focus: {new Date(task.plannedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
