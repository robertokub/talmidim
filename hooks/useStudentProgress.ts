
import { useState, useEffect } from 'react';
import { AppData, AllStudentsProgress, Comment, StudentProgress } from '../types';
import { studentNames } from '../data/students';

const STORAGE_KEY = 'learningAppData_v2'; // Chave atualizada para evitar conflitos com dados antigos

const initializeData = (): AppData => {
  const progress: AllStudentsProgress = {};
  studentNames.forEach(name => {
    progress[name] = {
      watchedVideos: [],
      readPdfs: [],
      commentedLessons: [],
    };
  });
  return {
    progress,
    comments: {},
  };
};

export const useStudentProgress = () => {
  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData: AppData = JSON.parse(savedData);
        // Garante que todos os alunos da lista existam nos dados salvos
        studentNames.forEach(name => {
          if (!parsedData.progress[name]) {
            parsedData.progress[name] = { watchedVideos: [], readPdfs: [], commentedLessons: [] };
          }
        });
        return parsedData;
      }
    } catch (error) {
      console.error('Failed to parse app data from localStorage', error);
    }
    return initializeData();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (error) {
      console.error('Failed to save app data to localStorage', error);
    }
  }, [appData]);

  const trackAction = (studentName: string, lessonId: number, action: keyof Omit<StudentProgress, 'commentedLessons'>) => {
    setAppData(prevData => {
      const studentProgress = prevData.progress[studentName];
      if (!studentProgress || studentProgress[action].includes(lessonId)) {
        return prevData; // Nenhuma mudança se o aluno não for encontrado ou a ação já foi rastreada
      }
      
      const newProgress = {
        ...studentProgress,
        [action]: [...studentProgress[action], lessonId]
      };

      return {
        ...prevData,
        progress: {
          ...prevData.progress,
          [studentName]: newProgress
        }
      };
    });
  };

  const trackVideoWatch = (studentName: string, lessonId: number) => {
    trackAction(studentName, lessonId, 'watchedVideos');
  };

  const trackPdfRead = (studentName: string, lessonId: number) => {
    trackAction(studentName, lessonId, 'readPdfs');
  };

  const addComment = (studentName: string, lessonId: number, commentText: string) => {
    if (!commentText.trim()) return;

    setAppData(prevData => {
      const newComment: Comment = {
        id: crypto.randomUUID(),
        studentName,
        text: commentText,
        timestamp: new Date().toISOString(),
      };

      // Atualiza comentários globais
      const lessonComments = prevData.comments[lessonId] || [];
      const updatedComments = {
        ...prevData.comments,
        [lessonId]: [...lessonComments, newComment]
      };

      // Atualiza a lista de aulas comentadas do aluno
      const studentProgress = prevData.progress[studentName];
      let updatedStudentProgress = studentProgress;
      if (!studentProgress.commentedLessons.includes(lessonId)) {
        updatedStudentProgress = {
            ...studentProgress,
            commentedLessons: [...studentProgress.commentedLessons, lessonId]
        }
      }

      return {
        comments: updatedComments,
        progress: {
            ...prevData.progress,
            [studentName]: updatedStudentProgress
        }
      };
    });
  };

  return { appData, trackVideoWatch, trackPdfRead, addComment };
};
