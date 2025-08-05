// Importações do React e dos seus componentes
import React, { useState, useEffect, useMemo } from 'react';
import { studentNames } from './data/students';
// import { classList } from './data/classes'; // <-- REMOVEMOS ISSO, VAI VIR DO FIREBASE
import { useStudentProgress } from './hooks/useStudentProgress';

import Header from './components/Header';
import StudentSelector from './components/StudentSelector';
import ProgressBar from './components/ProgressBar';
import ClassList from './components/ClassList';
import Ranking from './components/Ranking';

// ===== IMPORTAÇÕES DO FIREBASE =====
import { db } from './firebase'; // Importa a conexão com o banco de dados
import { collection, getDocs, orderBy, query } from "firebase/firestore"; // Funções para buscar os dados

// Definindo o tipo de uma aula para o TypeScript entender
interface ClassData {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  pdfUrl?: string;
  order: number; // Adicionamos um campo para ordenar as aulas
}

const App: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>(studentNames[0]);
  const { appData, trackVideoWatch, trackPdfRead, addComment } = useStudentProgress();

  // ===== AQUI VAMOS GUARDAR OS DADOS VINDOS DO FIREBASE =====
  const [classList, setClassList] = useState<ClassData[]>([]);

  // ===== ESTE BLOCO BUSCA OS DADOS DO FIREBASE QUANDO O APP CARREGA =====
  useEffect(() => {
    const fetchClasses = async () => {
      // Cria uma consulta na coleção 'aulas' e ordena pelo campo 'order'
      const q = query(collection(db, "aulas"), orderBy("order"));
      const classesSnapshot = await getDocs(q);
      const classesData = classesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClassData[];
      
      setClassList(classesData); // Guarda a lista de aulas no estado do React
      console.log("Aulas carregadas do Firebase:", classesData);
    };

    fetchClasses();
  }, []); // O [] vazio faz isso rodar apenas uma vez

  // O resto do seu código continua igual, usando a 'classList' que agora vem do Firebase
  const handleSelectStudent = (student: string) => {
    setSelectedStudent(student);
  };
  
  const currentStudentProgress = useMemo(
    () => appData.progress[selectedStudent] || { watchedVideos: [], readPdfs: [], commentedLessons: [] },
    [selectedStudent, appData.progress]
  );
  
  const handleTrackVideoWatch = (lessonId: number) => {
    trackVideoWatch(selectedStudent, lessonId);
  };
  
  const handleTrackPdfRead = (lessonId: number) => {
    trackPdfRead(selectedStudent, lessonId);
  };

  const handleAddComment = (lessonId: number, commentText: string) => {
    addComment(selectedStudent, lessonId, commentText);
  };

  const totalCourseActions = useMemo(() => {
    return classList.reduce((total, lesson) => total + 2 + (lesson.pdfUrl ? 1 : 0), 0);
  }, [classList]); // Adicionamos classList como dependência

  const completedActions = useMemo(() => {
    if (!currentStudentProgress) return 0;
    return currentStudentProgress.watchedVideos.length +
           currentStudentProgress.readPdfs.length +
           currentStudentProgress.commentedLessons.length;
  }, [currentStudentProgress]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label htmlFor="student-selector" className="block text-sm font-medium text-gray-300 mb-2">
                Aluno(a) Selecionado(a)
              </label>
              <StudentSelector 
                students={studentNames}
                selectedStudent={selectedStudent}
                onSelectStudent={handleSelectStudent}
              />
            </div>
            <ProgressBar 
              completed={completedActions}
              total={totalCourseActions}
            />
          </div>

          <Ranking
            studentNames={studentNames}
            progressData={appData.progress} 
            totalActions={totalCourseActions} 
          />

          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-100">Aulas do Curso</h2>
            <ClassList 
              classes={classList}
              studentProgress={currentStudentProgress}
              allComments={appData.comments}
              onTrackVideoWatch={handleTrackVideoWatch}
              onTrackPdfRead={handleTrackPdfRead}
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
