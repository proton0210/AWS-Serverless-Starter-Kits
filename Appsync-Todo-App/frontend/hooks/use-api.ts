'use client';

import { generateClient } from 'aws-amplify/api';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import {
  createTodoMutation,
  updateTodoMutation,
  deleteTodoMutation,
  listTodosQuery,
} from '@/lib/graphql-operations';
import { Todo, CreateTodoInput, UpdateTodoInput, DeleteTodoInput, ListTodosInput } from '@/types/api';

const client = generateClient();

export function useAPI() {
  const createTodo = async (input: CreateTodoInput): Promise<Todo> => {
    try {
      const result = await client.graphql({
        query: createTodoMutation,
        variables: { input },
      }) as GraphQLResult<{ createTodo: Todo }>;
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return result.data!.createTodo;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create todo');
    }
  };

  const updateTodo = async (input: UpdateTodoInput): Promise<boolean> => {
    try {
      const result = await client.graphql({
        query: updateTodoMutation,
        variables: { input },
      }) as GraphQLResult<{ updateTodo: boolean }>;
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return result.data!.updateTodo;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update todo');
    }
  };

  const deleteTodo = async (input: DeleteTodoInput): Promise<boolean> => {
    try {
      const result = await client.graphql({
        query: deleteTodoMutation,
        variables: { input },
      }) as GraphQLResult<{ deleteTodo: boolean }>;
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return result.data!.deleteTodo;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete todo');
    }
  };

  const listTodos = async (input: ListTodosInput): Promise<Todo[]> => {
    try {
      const result = await client.graphql({
        query: listTodosQuery,
        variables: { input },
      }) as GraphQLResult<{ listTodos: Todo[] }>;
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return result.data!.listTodos || [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to list todos');
    }
  };

  return {
    createTodo,
    updateTodo,
    deleteTodo,
    listTodos,
  };
}