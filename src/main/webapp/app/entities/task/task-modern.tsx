import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Eye, Pencil, Trash2, Plus, RefreshCw, Calendar, User, Clock } from 'lucide-react';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Button } from 'app/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'app/shared/components/ui/card';
import { Badge } from 'app/shared/components/ui/badge';
import { cn, formatDate, formatDateTime } from 'app/shared/lib/utils';

import { getEntities } from './task.reducer';

const getPriorityVariant = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'secondary';
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '⚪';
  }
};

export const TaskModern = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const taskList = useAppSelector(state => state.task.entities);
  const loading = useAppSelector(state => state.task.loading);
  const totalItems = useAppSelector(state => state.task.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const handleSyncList = () => {
    sortEntities();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <Translate contentKey="taskplanDockerApp.task.home.title">Tasks</Translate>
          </h1>
          <p className="text-muted-foreground">Manage your tasks and track your progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSyncList} disabled={loading} className="gap-2">
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            <Translate contentKey="taskplanDockerApp.task.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Button asChild>
            <Link to="/task/new" className="gap-2">
              <Plus className="h-4 w-4" />
              <Translate contentKey="taskplanDockerApp.task.home.createLabel">Create new Task</Translate>
            </Link>
          </Button>
        </div>
      </div>

      {/* Task Grid */}
      {taskList && taskList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {taskList.map((task, i) => (
            <Card key={`entity-${i}`} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPriorityIcon(task.priority)}</span>
                    <Badge variant={getPriorityVariant(task.priority)}>
                      <Translate contentKey={`taskplanDockerApp.TaskPriority.${task.priority}`} />
                    </Badge>
                  </div>
                  {task.completed && <Badge variant="success">✓ Completed</Badge>}
                </div>
                <CardTitle className="text-lg line-clamp-2">{task.description || `Task #${task.id}`}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Task Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {task.dueDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                  )}
                  {task.user?.login && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{task.user.login}</span>
                    </div>
                  )}
                  {task.createdDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Created: {formatDateTime(task.createdDate)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 pt-2">
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                    <Link to={`/task/${task.id}`}>
                      <Eye className="h-3 w-3" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                    <Link
                      to={`/task/${task.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                    >
                      <Pencil className="h-3 w-3" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive hover:text-destructive"
                    onClick={() =>
                      (window.location.href = `/task/${task.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !loading && (
          <Card className="p-12 text-center">
            <div className="mx-auto max-w-sm">
              <h3 className="text-lg font-semibold">No tasks found</h3>
              <p className="text-muted-foreground mt-2">Get started by creating your first task.</p>
              <Button asChild className="mt-4">
                <Link to="/task/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create new Task
                </Link>
              </Button>
            </div>
          </Card>
        )
      )}

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          <JhiPagination
            activePage={paginationState.activePage}
            onSelect={page => setPaginationState({ ...paginationState, activePage: page })}
            maxButtons={5}
            itemsPerPage={paginationState.itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  );
};

export default TaskModern;
