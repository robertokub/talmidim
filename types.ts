
export interface ClassData {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  pdfUrl?: string; // Link opcional para o PDF
}

export interface Comment {
  id: string;
  studentName: string; // Adicionado para identificar o autor
  text: string;
  timestamp: string;
}

export interface StudentProgress {
  watchedVideos: number[];
  readPdfs: number[];
  commentedLessons: number[];
}

export interface AllStudentsProgress {
  [studentName: string]: StudentProgress;
}

// Nova estrutura de dados para o estado global do aplicativo
export interface AppData {
  progress: AllStudentsProgress;
  comments: { [lessonId: number]: Comment[] };
}
