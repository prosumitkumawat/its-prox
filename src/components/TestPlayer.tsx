import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Timer, CheckCircle, AlertCircle, X } from 'lucide-react';
import { getTestData } from '../services/api';

interface TestPlayerProps {
  test: any;
  batchId: string;
  subjectId: string;
  onClose: () => void;
}

const TestPlayer: React.FC<TestPlayerProps> = ({ test, batchId, subjectId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchTest = async () => {
      const token = localStorage.getItem('pw_token') || '';
      const data = await getTestData(token, test, batchId, subjectId);
      if (data) {
        setTestData(data);
        setTimeLeft((data.duration || 60) * 60); // mins to seconds
      }
      setLoading(false);
    };
    fetchTest();
  }, [test, batchId, subjectId]);

  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, loading]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-body-2 font-medium">Loading your test...</p>
        </div>
      </div>
    );
  }

  if (!testData || !testData.questions || testData.questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-headings mb-2">Test Not Available</h2>
          <p className="text-body-2 mb-6">We couldn't load the questions for this test. It might not be ready yet.</p>
          <button onClick={onClose} className="w-full bg-primary text-white py-3 rounded-xl font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  const questions = testData.questions;
  const currentQuestion = questions[currentQuestionIdx];

  const handleSelectOption = (optionIdx: number) => {
    setAnswers({ ...answers, [currentQuestion._id]: optionIdx });
  };

  return (
    <div className="fixed inset-0 bg-tertiary-6 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-stroke-light px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-tertiary-6 rounded-lg transition-colors">
            <X className="w-5 h-5 text-body-2" />
          </button>
          <div>
            <h1 className="font-bold text-headings text-sm sm:text-base line-clamp-1">
              {testData.testName || testData.name || testData.testTitle || testData.title || test.topic}
            </h1>
            <p className="text-[10px] text-body-2 uppercase font-bold tracking-wider">Question {currentQuestionIdx + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 text-primary px-3 py-1.5 rounded-full border border-primary/20">
          <Timer className="w-4 h-4" />
          <span className="text-sm font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Card */}
          <div className="bg-white rounded-2xl border border-stroke-light p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <span className="px-2 py-1 bg-tertiary-6 text-headings text-[10px] font-bold rounded uppercase">
                 Section 01
               </span>
               <span className="text-body-2 text-xs font-medium italic">Single Correct Type</span>
            </div>
            
            <div className="prose prose-sm max-w-none text-headings font-medium mb-8 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }} />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options?.map((option: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 text-left group ${
                    answers[currentQuestion._id] === idx 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                      : 'border-stroke-light hover:border-primary/50 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                    answers[currentQuestion._id] === idx 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-stroke-light group-hover:border-primary/50 text-body-2'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="text-sm font-medium text-headings flex-1" dangerouslySetInnerHTML={{ __html: option.optionText }} />
                  {answers[currentQuestion._id] === idx && (
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-stroke-light px-4 py-4 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button 
            disabled={currentQuestionIdx === 0}
            onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
            className="flex items-center gap-2 px-4 py-2 text-body-2 font-bold hover:bg-tertiary-6 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex gap-2">
            {currentQuestionIdx === questions.length - 1 ? (
              <button 
                onClick={() => {
                  alert('Thank you for completing the test demo!');
                  onClose();
                }}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                Submit Test
              </button>
            ) : (
              <button 
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="flex items-center gap-2 px-8 py-3 bg-headings text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TestPlayer;
