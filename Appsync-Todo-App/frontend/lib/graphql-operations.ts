export const createTodoMutation = /* GraphQL */ `
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      TodoID
      UserID
      title
      completed
    }
  }
`;

export const updateTodoMutation = /* GraphQL */ `
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input)
  }
`;

export const deleteTodoMutation = /* GraphQL */ `
  mutation DeleteTodo($input: DeleteTodoInput!) {
    deleteTodo(input: $input)
  }
`;

export const listTodosQuery = /* GraphQL */ `
  query ListTodos($input: ListTodosInput!) {
    listTodos(input: $input) {
      TodoID
      UserID
      title
      completed
    }
  }
`;