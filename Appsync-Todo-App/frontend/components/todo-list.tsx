'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo } from '@/types/api';
import { useAPI } from '@/hooks/use-api';
import { useAuth } from '@/lib/auth-context';
import CreateTodoForm from './create-todo-form';
import TodoItem from './todo-item';
import TodoFilters, { FilterType } from './todo-filters';
import LoadingSpinner from './loading-spinner';
import ErrorAlert from './error-alert';

export default function TodoList() {
  const { user } = useAuth();
  const { listTodos } = useAPI();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchTodos = useCallback(async () => {
    if (!user?.userId) return;
    
    setError('');
    try {
      const fetchedTodos = await listTodos({ UserID: user.userId });
      setTodos(fetchedTodos);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, [user?.userId, listTodos]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  if (!user?.userId) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Todos</h1>
      
      <CreateTodoForm userId={user.userId} onTodoCreated={fetchTodos} />
      
      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            totalCount={todos.length}
            activeCount={activeCount}
            completedCount={completedCount}
          />
          
          <div className="mt-4 space-y-2">
            {filteredTodos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {filter === 'all' ? 'No todos yet. Create one above!' : `No ${filter} todos.`}
              </p>
            ) : (
              filteredTodos.map(todo => (
                <TodoItem
                  key={todo.TodoID}
                  todo={todo}
                  onUpdate={fetchTodos}
                  onDelete={fetchTodos}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}