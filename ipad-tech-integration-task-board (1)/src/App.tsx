import { useState, useEffect } from 'react';
import { IntegrationTask } from './types';
import { DEFAULT_INTEGRATION_TASKS } from './defaultData';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';
import { playClickSound, playPageTurnSound } from './utils/audio';
import { 
  Plus, 
  HelpCircle, 
  Info, 
  Briefcase, 
  BookOpen, 
  Sparkles, 
  Github, 
  Share2, 
  Tablet, 
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<IntegrationTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  // Initialize and load saved tasks from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ipad-integration-tasks-v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          setTasks(parsed);
          setSelectedTaskId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage tasks:', e);
    }
    // Fallback to beautiful pre-generated, standard-aligned seeds
    setTasks(DEFAULT_INTEGRATION_TASKS);
    setSelectedTaskId(DEFAULT_INTEGRATION_TASKS[0].id);
  }, []);

  // Sync tasks back to localStorage
  const saveTasksToStore = (updatedTasks: IntegrationTask[]) => {
    setTasks(updatedTasks);
    try {
      localStorage.setItem('ipad-integration-tasks-v2', JSON.stringify(updatedTasks));
    } catch (e) {
      console.error('Storage sync failed:', e);
    }
  };

  const handleSelectTask = (id: string) => {
    setSelectedTaskId(id);
    setShowNewForm(false);
    setErrorMessage(null);
  };

  const handleNewPlanToggle = () => {
    playClickSound();
    setShowNewForm(true);
    setSelectedTaskId(null);
    setErrorMessage(null);
  };

  const handleCancelForm = () => {
    setShowNewForm(false);
    if (tasks.length > 0) {
      setSelectedTaskId(tasks[0].id);
    }
  };

  // Submit form data to AI and generate strategies
  const handleSaveTask = async (taskData: Omit<IntegrationTask, 'id' | 'createdAt' | 'status'> & { id?: string }) => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const suggestion = await response.json();

      const newTask: IntegrationTask = {
        id: taskData.id || `task-${Date.now()}`,
        topic: taskData.topic,
        gradeLevel: taskData.gradeLevel,
        subject: taskData.subject,
        ccssId: taskData.ccssId,
        ccssText: taskData.ccssText,
        isteStandard: taskData.isteStandard === 'Auto-select Best Match' 
          ? suggestion.isteStudentStandard 
          : taskData.isteStandard,
        status: 'Planning',
        createdAt: new Date().toISOString(),
        teacherNotes: taskData.teacherNotes,
        aiSuggestion: suggestion
      };

      // Add to tasks list or overwrite if editing
      let updatedList: IntegrationTask[];
      if (taskData.id) {
        updatedList = tasks.map(t => t.id === taskData.id ? { ...newTask, status: t.status } : t);
      } else {
        updatedList = [newTask, ...tasks];
      }

      saveTasksToStore(updatedList);
      setSelectedTaskId(newTask.id);
      setShowNewForm(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 
        'Could not complete generating technology design. Please ensure your backend Gemini API key is configured in Secrets panel.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateStatus = (id: string, status: 'Planning' | 'Ready' | 'Completed') => {
    const updated = tasks.map(t => t.id === id ? { ...t, status } : t);
    saveTasksToStore(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasksToStore(updated);
    if (updated.length > 0) {
      setSelectedTaskId(updated[0].id);
    } else {
      setSelectedTaskId(null);
      setShowNewForm(true);
    }
  };

  const currentSelectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col p-4 md:p-8">
      {/* Upper Navigation & Context Banner */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-2 border-gray-100 pb-4 max-w-7xl w-full mx-auto gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-display font-black tracking-tight uppercase">iCoach Studio</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Meaningful iPad Integration Board</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Active Coach Mode
          </span>
          <button 
            onClick={handleNewPlanToggle}
            className="px-4 py-2 bg-orange-500 text-black font-bold rounded-xl border-2 border-orange-600 hover:shadow-md hover:bg-orange-400 transition-all uppercase text-xs cursor-pointer"
          >
            New Tech Design Task
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="max-w-7xl w-full mx-auto flex-grow">
        {/* Quick Help introduction card */}
        <div className="bg-orange-50 border-2 border-orange-100 rounded-3xl p-6 mb-8 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
          <div className="max-w-3xl">
            <label className="block text-[10px] font-black uppercase text-orange-400 mb-2 tracking-widest">
              Integration Philosophy
            </label>
            <p className="text-base text-gray-800 leading-relaxed font-semibold">
              We design simple, high-impact workflows focusing directly on what an iPad does **out-of-the-box** (Camera, Keynote, voice journals, soundscapes) or well-respected, **free login-free web tools** (PhET Interactive, GeoGebra, Chrome Music Lab). No subscription traps or student logins required!
            </p>
          </div>
          <button
            id="btn-trigger-new-plan"
            onClick={handleNewPlanToggle}
            className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3.5 bg-orange-500 text-black font-black text-sm rounded-2xl border-b-4 border-orange-700 active:border-b-0 hover:bg-orange-400 transition-all uppercase cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            New Tech Design Task
          </button>
        </div>

        {/* Global Error Prompt (often indicating keys missing) */}
        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-200 text-red-900 rounded-3xl p-6 mb-8 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm font-sans">
              <strong className="block text-[10px] font-black uppercase text-red-500 mb-2 tracking-widest">Pedagogical Generation Suspended</strong>
              <p className="text-red-800 leading-relaxed font-semibold">
                {errorMessage}
              </p>
              <p className="mt-3 text-xs text-red-700">
                👉 Make sure you have entered the <code>GEMINI_API_KEY</code> within the <strong>Secrets</strong> panel of the Google AI Studio build workspace. Your changes will test immediately.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Task Deck list */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5 font-bold">
                <Briefcase className="w-4 h-4 text-orange-500" />
                Lesson Tasks ({tasks.length})
              </h3>
              
              {!showNewForm && (
                <button
                  id="btn-sub-new-task"
                  onClick={handleNewPlanToggle}
                  className="text-xs text-orange-600 hover:text-orange-700 font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              )}
            </div>

            <TaskList 
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={handleSelectTask}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>

          {/* RIGHT PANEL: Dynamic Viewport */}
          <div className="lg:col-span-7">
            {isGenerating ? (
              <div className="bg-white border-4 border-orange-500 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative mb-6">
                  <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 bg-orange-400 opacity-20"></div>
                  <div className="relative rounded-full p-3 bg-orange-100 border border-orange-300">
                    <Tablet className="w-6 h-6 text-orange-600 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-display font-black uppercase italic tracking-tight text-neutral-900">
                  Building Bento Opportunity Layout...
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2 max-w-sm text-center leading-relaxed">
                  Connecting with Gemini AI to map out-of-the-box iPad templates and student-safe, login-free simulations.
                </p>
                
                {/* Visual dynamic loading sequence */}
                <div className="w-48 bg-neutral-100 rounded-full h-1.5 mt-6 overflow-hidden">
                  <div className="bg-orange-500 h-1.5 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
                </div>
              </div>
            ) : showNewForm ? (
              <div>
                <TaskForm 
                  onSaveTask={handleSaveTask}
                  onCancel={tasks.length > 0 ? handleCancelForm : undefined}
                  isGenerating={isGenerating}
                />
              </div>
            ) : currentSelectedTask ? (
              <div>
                <TaskDetails 
                  task={currentSelectedTask}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteTask}
                />
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <Tablet className="w-12 h-12 text-neutral-300 mb-4" />
                <h3 className="text-sm font-black uppercase text-neutral-500 tracking-wider">No Task Selected</h3>
                <p className="text-xs text-neutral-400 max-w-xs mt-2 leading-relaxed">
                  Create a new planning task or select an existing iPad integration blueprint from the deck list.
                </p>
                <button
                  id="btn-secondary-new-plan"
                  onClick={handleNewPlanToggle}
                  className="mt-6 px-4 py-2 bg-orange-500 text-black border-2 border-orange-600 font-bold rounded-xl hover:bg-orange-400 transition-colors uppercase text-xs cursor-pointer"
                >
                  Create Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Instructions & Core Strategy footer */}
      <footer className="max-w-7xl w-full mx-auto mt-12 pt-8 border-t-2 border-gray-150">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-neutral-600 text-xs mb-8">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-6">
            <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-orange-500" />
              Teacher Playbook Walkthrough
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-neutral-700 font-semibold leading-relaxed">
              <li>Click <strong>New Tech Design Task</strong> to set up a teaching topic, grade level, and optional custom instructions.</li>
              <li>Wait briefly as our AI assistant designs safe, login-free web simulations and out-of-the-box iPad activities.</li>
              <li>Toggle the lesson status in the dropdown between <strong>Planning</strong>, <strong>Ready</strong>, or <strong>Done</strong>.</li>
              <li>Keep this workspace open or bookmark it—your custom plans stay stored securely in your browser cache!</li>
            </ol>
          </div>

          <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-6">
            <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest flex items-center gap-1 font-bold">
              <Plus className="w-3.5 h-3.5 text-orange-500" />
              Why Private Local Persistence?
            </h4>
            <p className="text-neutral-700 font-semibold leading-relaxed font-sans">
              This app keeps all your lesson planning synced instantly with your browser's <code>localStorage</code>. It has no external cloud accounts or database requirements, making it completely private, student-safe, and incredibly fast as a personal planning portfolio!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-4 gap-2">
          <p>© 2026 instructional coach studio // No Login Required Tools Only</p>
          <div className="flex gap-6">
            <span>Privately Saved Offline</span>
            <span>Local Persistency Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
