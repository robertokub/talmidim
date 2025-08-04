
import React from 'react';
import { ClassData, StudentProgress, Comment } from '../types';
import ClassItem from './ClassItem';

interface ClassListProps {
  classes: ClassData[];
  studentProgress: StudentProgress;
  allComments: { [lessonId: number]: Comment[] };
  onTrackVideoWatch: (lessonId: number) => void;
  onTrackPdfRead: (lessonId: number) => void;
  onAddComment: (lessonId: number, commentText: string) => void;
}

const ClassList: React.FC<ClassListProps> = ({ classes, studentProgress, allComments, onTrackVideoWatch, onTrackPdfRead, onAddComment }) => {
  return (
    <div className="space-y-4">
      {classes.map(classInfo => (
        <ClassItem
          key={classInfo.id}
          classInfo={classInfo}
          studentProgress={studentProgress}
          comments={allComments[classInfo.id] || []}
          onTrackVideoWatch={() => onTrackVideoWatch(classInfo.id)}
          onTrackPdfRead={() => onTrackPdfRead(classInfo.id)}
          onAddComment={(commentText) => onAddComment(classInfo.id, commentText)}
        />
      ))}
    </div>
  );
};

export default ClassList;
