
import React, { useState } from 'react';
import { ClassData, Comment, StudentProgress } from '../types';
import { CheckIcon, ChevronDownIcon, VideoCameraIcon, ChatBubbleIcon, DocumentTextIcon } from './icons';

interface ClassItemProps {
  classInfo: ClassData;
  studentProgress: StudentProgress;
  comments: Comment[];
  onTrackVideoWatch: () => void;
  onTrackPdfRead: () => void;
  onAddComment: (commentText: string) => void;
}

const ActionStatus: React.FC<{ label: string, isDone: boolean, icon: React.ReactNode }> = ({ label, isDone, icon }) => (
    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${isDone ? 'bg-teal-500/20 text-teal-300' : 'bg-gray-700 text-gray-400'}`}>
        {isDone ? <CheckIcon className="w-4 h-4 mr-1.5" /> : icon}
        <span>{label}</span>
    </div>
);


const ClassItem: React.FC<ClassItemProps> = ({ classInfo, studentProgress, comments, onTrackVideoWatch, onTrackPdfRead, onAddComment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const hasWatchedVideo = studentProgress.watchedVideos.includes(classInfo.id);
  const hasReadPdf = !classInfo.pdfUrl || studentProgress.readPdfs.includes(classInfo.id);
  const hasCommented = studentProgress.commentedLessons.includes(classInfo.id);

  const isLessonComplete = hasWatchedVideo && hasReadPdf && hasCommented;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(newComment);
    setNewComment('');
  };
  
  const handleVideoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!hasWatchedVideo) {
      onTrackVideoWatch();
    }
  };

  const handlePdfClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!hasReadPdf && classInfo.pdfUrl) {
      onTrackPdfRead();
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 ${isLessonComplete ? 'opacity-70' : ''}`}>
      <div className="flex items-center p-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        
        <div className={`w-8 h-8 flex-shrink-0 mr-4 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isLessonComplete ? 'bg-teal-500 border-teal-500' : 'bg-gray-700 border-gray-600'}`}>
            {isLessonComplete && <CheckIcon className="w-5 h-5 text-white" />}
            {!isLessonComplete && <span className="font-bold text-gray-400 text-sm">{classInfo.id}</span>}
        </div>
        
        <div className="flex-grow">
          <h3 className={`text-lg font-semibold ${isLessonComplete ? 'text-gray-400 line-through' : 'text-white'}`}>
            {classInfo.title}
          </h3>
        </div>
        <div className="ml-4 flex-shrink-0">
          <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-700/50">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <img src={classInfo.imageUrl} alt={classInfo.title} className="rounded-lg object-cover w-full h-48" />
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-300 mb-4">{classInfo.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                  <ActionStatus label="Vídeo" isDone={hasWatchedVideo} icon={<VideoCameraIcon className="w-4 h-4 mr-1.5"/>} />
                  {classInfo.pdfUrl && <ActionStatus label="PDF" isDone={hasReadPdf} icon={<DocumentTextIcon className="w-4 h-4 mr-1.5"/>} />}
                  <ActionStatus label="Comentário" isDone={hasCommented} icon={<ChatBubbleIcon className="w-4 h-4 mr-1.5"/>} />
              </div>

              <div className="flex flex-wrap gap-3">
                <a 
                  href={classInfo.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleVideoClick}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                  <VideoCameraIcon className="w-5 h-5 mr-2" />
                  Assistir Vídeo
                </a>
                {classInfo.pdfUrl && (
                  <a
                    href={classInfo.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handlePdfClick}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
                  >
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Ver PDF
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-700/50 pt-4">
            <h4 className="text-md font-semibold text-gray-200 mb-3 flex items-center">
              <ChatBubbleIcon className="w-5 h-5 mr-2 text-teal-400"/>
              Comentários da Turma
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {comments.length > 0 ? (
                comments.slice().reverse().map(comment => (
                  <div key={comment.id} className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                        <span className="font-semibold text-teal-300 text-sm">{comment.studentName}</span>
                        <span className="text-xs text-gray-500 ml-auto">{new Date(comment.timestamp).toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
              )}
            </div>
            <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2">
              <input 
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={!newComment.trim()}>
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassItem;
