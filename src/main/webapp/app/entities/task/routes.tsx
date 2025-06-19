import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundary from 'app/shared/error/error-boundary';

import Task from './task';
import TaskModern from './task-modern';
import TaskDetail from './task-detail';
import TaskUpdate from './task-update';
import TaskDeleteDialog from './task-delete-dialog';

const TaskRoutes = () => (
  <ErrorBoundary>
    <Route index element={<TaskModern />} />
    <Route path="classic" element={<Task />} />
    <Route path="new" element={<TaskUpdate />} />
    <Route path=":id">
      <Route index element={<TaskDetail />} />
      <Route path="edit" element={<TaskUpdate />} />
      <Route path="delete" element={<TaskDeleteDialog />} />
    </Route>
  </ErrorBoundary>
);

export default TaskRoutes;
