export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Todo {
  TodoID: string;
  UserID: string;
  title: string;
  completed: boolean;
}

export interface CreateTodoInput {
  UserID: string;
  title: string;
}

export interface UpdateTodoInput {
  UserID: string;
  title: string;
}

export interface DeleteTodoInput {
  UserID: string;
  title: string;
}

export interface ListTodosInput {
  UserID: string;
}