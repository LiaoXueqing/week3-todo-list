import { browserHistory } from 'react-router';
import $ from 'jquery';
export const loginToServer = (name, password) => dispatch => {
  console.log(name, password);
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name.value,
      password: password.value
    })
  })
    .then(response => {
      return response.text();
    })
    .then(token => {
      localStorage.setItem(name.value, token);
      console.log('storage token', localStorage.getItem('token'));
      dispatch(browserHistory.push('/'));
    });
};
export const editTodo = (id, name) => ({ type: 'EDIT_TODO', id, name });
export const addTodo = (name, time) => ({ type: 'ADD_TODO', name, time });
export const deleteTodo = id => ({ type: 'DELETE_TODO', id });
export const completeTodo = id => ({ type: 'COMPLETE_TODO', id });
export const canEditTodo = id => ({ type: 'CAN_EDIT_TODO', id });
export const searchTodo = searchItem => ({ type: 'SEARCH_TODO', searchItem });
export const setDetailTodo = id => ({ type: 'SET_DETAIL_TODO', id });
export const gotTodos = todos => ({ type: 'GOT_TODOS', todos });
export const getTodosFromServer = () => dispatch => {
  $.ajax({
    method: 'GET',
    url: '/api/todos',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
    },
    success: function(data) {
      console.log(data);
      dispatch({
        type: 'GOT_TODOS',
        data
      });
    },
    error: function(data) {
      if (data.status === 401) {
        dispatch(push('/login'));
      }
    }
  });
};
export const completeServerTodo = id => dispatch => {
  fetch('/api/todos/completed/' + id, {
    method: 'PUT'
  })
    .then(response => {
      console.log('response', response);
    })
    .then(() => {
      dispatch({
        type: 'COMPLETE_TODO',
        id
      });
    });
};
export const deleteServerTodo = id => dispatch => {
  return fetch('/api/todos/' + id, {
    method: 'delete'
  })
    .then(response => {
      console.log('response', response);
    })
    .then(() => {
      console.log('todos after delete');
      fetch('/api/todos')
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(todos => {
          return dispatch({
            type: 'GOT_TODOS',
            todos
          });
        });
    });
};
