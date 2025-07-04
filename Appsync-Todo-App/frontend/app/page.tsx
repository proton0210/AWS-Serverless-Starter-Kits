'use client';

import ProtectedRoute from '@/components/protected-route';
import TodoList from '@/components/todo-list';
import Navbar from '@/components/navbar';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <TodoList />
      </div>
    </ProtectedRoute>
  );
}