'use client';

import { useState } from 'react';
import { Todo } from '@/types/api';
import { useAPI } from '@/hooks/use-api';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [loading, setLoading] = useState(false);
  const { updateTodo, deleteTodo } = useAPI();

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await updateTodo({
        UserID: todo.UserID,
        title: todo.title,
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    
    setLoading(true);
    try {
      await deleteTodo({
        UserID: todo.UserID,
        title: todo.title,
      });
      onDelete();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 rounded-lg border p-4 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggleComplete}
        disabled={loading}
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span className={`flex-1 ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
        {todo.title}
      </span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 hover:text-red-800 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}