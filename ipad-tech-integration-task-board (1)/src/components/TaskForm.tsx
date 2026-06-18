import React, { useState, useMemo } from 'react';
import { 
  IntegrationTask, 
  COMMON_CORE_STANDARDS, 
  ISTE_STANDARDS 
} from '../types';
import { Sparkles, BookOpen, User, Keyboard, CheckSquare } from 'lucide-react';
import { playClickSound, playPageTurnSound } from '../utils/audio';

interface TaskFormProps {
  onSaveTask: (taskData: Omit<IntegrationTask, 'id' | 'createdAt' | 'status'> & { id?: string }) => Promise<void>;
  editingTask?: IntegrationTask | null;
  onCancel?: () => void;
  isGenerating: boolean;
}

export default function TaskForm({ onSaveTask, editingTask, onCancel, isGenerating }: TaskFormProps) {
  const [topic, setTopic] = useState(editingTask?.topic || '');
  const [gradeLevel, setGradeLevel] = useState(editingTask?.gradeLevel || '2nd Grade');
  const [subject, setSubject] = useState(editingTask?.subject || 'Science');
  const [ccssId, setCcssId] = useState(editingTask?.ccssId || '');
  const [isteStandard, setIsteStandard] = useState(editingTask?.isteStandard || 'Auto-select Best Match');
  const [teacherNotes, setTeacherNotes] = useState(editingTask?.teacherNotes || '');

  // Filter Common Core State Standards by selected Grade level if any
  const filteredCCSS = useMemo(() => {
    return COMMON_CORE_STANDARDS.filter(std => std.grade === gradeLevel);
  }, [gradeLevel]);

  // When changing Grade Level, play page turn sound and reset ccss to empty/first
  const handleGradeChange = (val: string) => {
    playPageTurnSound();
    setGradeLevel(val);
    setCcssId(''); // clear selection
  };

  const handleSubjectChange = (val: string) => {
    playPageTurnSound();
    setSubject(val);
  };

  const handleIsteChange = (val: string) => {
    playPageTurnSound();
    setIsteStandard(val);
  };

  const handleCcssChange = (val: string) => {
    playPageTurnSound();
    setCcssId(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    playClickSound();

    // Find full standard text
    const standardObj = COMMON_CORE_STANDARDS.find(std => std.id === ccssId);
    const ccssText = standardObj ? `${standardObj.code}: ${standardObj.description}` : '';

    await onSaveTask({
      id: editingTask?.id,
      topic,
      gradeLevel,
      subject,
      ccssId,
      ccssText,
      isteStandard,
      teacherNotes,
    });
    
    // Clear unless editing
    if (!editingTask) {
      setTopic('');
      setCcssId('');
      setTeacherNotes('');
    }
  };

  return (
    <form id="integration-task-form" onSubmit={handleSubmit} className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h2 id="form-title" className="text-lg font-display font-black uppercase tracking-tight text-neutral-800 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          {editingTask ? 'Modify Planning Integration Task' : 'Plan New iPad Technology Class'}
        </h2>

        <div className="space-y-4">
          {/* Topic Title Input */}
          <div>
            <label htmlFor="input-topic" className="block text-[10px] font-black uppercase text-neutral-400 mb-2 tracking-widest">
              Upcoming Unit Topic / Concept
            </label>
            <input
              id="input-topic"
              type="text"
              required
              disabled={isGenerating}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Butterfly Life Cycles, Introductory Fractions"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-base font-semibold bg-white"
            />
          </div>

          {/* Grade & Subject Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="select-grade" className="block text-[10px] font-black uppercase text-neutral-400 mb-2 tracking-widest">
                Elementary Grade Level
              </label>
              <select
                id="select-grade"
                disabled={isGenerating}
                value={gradeLevel}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-sm font-semibold bg-white appearance-none cursor-pointer"
              >
                <option value="Kindergarten">Kindergarten</option>
                <option value="1st Grade">1st Grade</option>
                <option value="2nd Grade">2nd Grade</option>
                <option value="3rd Grade">3rd Grade</option>
                <option value="4th Grade">4th Grade</option>
                <option value="5th Grade">5th Grade</option>
              </select>
            </div>

            <div>
              <label htmlFor="select-subject" className="block text-[10px] font-black uppercase text-neutral-400 mb-2 tracking-widest">
                Subject Area
              </label>
              <select
                id="select-subject"
                disabled={isGenerating}
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-sm font-semibold bg-white appearance-none cursor-pointer"
              >
                <option value="English Language Arts">English Language Arts</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Visual & Media Arts">Visual & Media Arts</option>
                <option value="Music & Rhythm">Music & Rhythm</option>
                <option value="PE & Movement">PE & Health</option>
                <option value="Other / Interdisciplinary">Other / Custom</option>
              </select>
            </div>
          </div>

          {/* Common Core Pull-Down */}
          <div>
            <label htmlFor="select-ccss" className="block text-[10px] font-black uppercase text-neutral-400 mb-2 tracking-widest flex items-center justify-between">
              <span>USA Common Core Standard (Optional)</span>
              <span className="text-[10px] text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full font-black uppercase">
                {gradeLevel}
              </span>
            </label>
            <select
              id="select-ccss"
              disabled={isGenerating}
              value={ccssId}
              onChange={(e) => handleCcssChange(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-sm font-semibold bg-white cursor-pointer overflow-hidden text-ellipsis"
            >
              <option value="">No CCSS Associated / Skip Selection</option>
              {filteredCCSS.map((std) => (
                <option key={std.id} value={std.id} title={std.description}>
                  {std.code}: {std.description.slice(0, 75)}...
                </option>
              ))}
            </select>
            {ccssId && (
              <p className="mt-2 text-xs text-neutral-600 italic bg-amber-50/60 border border-orange-100 p-3 rounded-xl">
                {COMMON_CORE_STANDARDS.find(s => s.id === ccssId)?.description}
              </p>
            )}
          </div>

          {/* Desired ISTE Standard */}
          <div>
            <label htmlFor="select-iste" className="block text-[10px] font-black uppercase text-neutral-400 mb-2 tracking-widest">
              Target ISTE Student Standard
            </label>
            <select
              id="select-iste"
              disabled={isGenerating}
              value={isteStandard}
              onChange={(e) => handleIsteChange(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-sm font-semibold bg-white cursor-pointer"
            >
              <option value="Auto-select Best Match">💡 Auto-select Best Pedagogical Match</option>
              {ISTE_STANDARDS.map((iste) => (
                <option key={iste.id} value={iste.code}>
                  {iste.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes for context */}
          <div>
            <label htmlFor="textarea-notes" className="block text-[10px] font-black uppercase text-neutral-400 mb-2 tracking-widest">
              Lesson Notes / Special Context
            </label>
            <textarea
              id="textarea-notes"
              disabled={isGenerating}
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder="e.g., My students struggle with oral presentations; we have access to green screen; some are English learners."
              rows={2}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none text-sm font-semibold bg-white resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            id="btn-cancel-edit"
            type="button"
            disabled={isGenerating}
            onClick={() => {
              playClickSound();
              onCancel();
            }}
            className="px-5 py-3 text-sm border-2 border-neutral-300 text-neutral-700 font-black uppercase rounded-xl hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          id="btn-submit-task"
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="w-full py-4 bg-orange-500 text-black font-black text-base rounded-2xl border-b-4 border-orange-700 active:border-b-0 hover:bg-orange-400 hover:shadow-md transition-all uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing iPad Options...</span>
            </>
          ) : (
            <>
              <BookOpen className="w-5 h-5 text-black" />
              <span>{editingTask ? 'Update Strategy' : 'Generate Ideas'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
