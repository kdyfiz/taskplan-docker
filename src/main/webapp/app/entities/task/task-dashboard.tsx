import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Badge,
  Progress,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faCheckSquare,
  faCalendarAlt,
  faExclamationTriangle,
  faCheck,
  faEdit,
  faTrash,
  faSort,
  faClock,
  faListUl,
} from '@fortawesome/free-solid-svg-icons';
import { TextFormat } from 'react-jhipster';
import { APP_LOCAL_DATE_FORMAT, APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities, updateEntity, deleteEntity } from './task.reducer';
import { ITask } from 'app/shared/model/task.model';
import './task-dashboard.scss';

export const TaskDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const taskList = useAppSelector(state => state.task.entities);
  const loading = useAppSelector(state => state.task.loading);
  const account = useAppSelector(state => state.authentication.account);

  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdDate'>('dueDate');
  const [showCompleted, setShowCompleted] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; task: ITask | null }>({ isOpen: false, task: null });

  useEffect(() => {
    dispatch(getEntities({ page: 0, size: 100, sort: 'dueDate,asc' }));
  }, [dispatch]);

  const userTasks = taskList.filter(task => task.user?.login === account?.login);
  const pendingTasks = userTasks.filter(task => !task.completed);
  const completedTasks = userTasks.filter(task => task.completed);
  const overdueTasks = pendingTasks.filter(task => task.dueDate && task.dueDate.toDate() < new Date());
  const todayTasks = pendingTasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    const taskDate = task.dueDate.toDate();
    return taskDate.toDateString() === today.toDateString();
  });

  const completionRate = userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return faExclamationTriangle;
      case 'MEDIUM':
        return faClock;
      case 'LOW':
        return faListUl;
      default:
        return faListUl;
    }
  };

  const sortTasks = (tasks: ITask[]) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.valueOf() - b.dueDate.valueOf();
        case 'priority': {
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        case 'createdDate':
          return b.createdDate.valueOf() - a.createdDate.valueOf();
        default:
          return 0;
      }
    });
  };

  const toggleTaskCompletion = async (task: ITask) => {
    const updatedTask = { ...task, completed: !task.completed };
    await dispatch(updateEntity(updatedTask));
    dispatch(getEntities({ page: 0, size: 100, sort: 'dueDate,asc' }));
  };

  const confirmDelete = (task: ITask) => {
    setDeleteModal({ isOpen: true, task });
  };

  const handleDelete = async () => {
    if (deleteModal.task) {
      await dispatch(deleteEntity(deleteModal.task.id));
      setDeleteModal({ isOpen: false, task: null });
      dispatch(getEntities({ page: 0, size: 100, sort: 'dueDate,asc' }));
    }
  };

  const displayTasks = showCompleted ? userTasks : pendingTasks;
  const sortedTasks = sortTasks(displayTasks);

  return (
    <div className="task-dashboard">
      <div className="dashboard-header mb-4">
        <Row className="align-items-center">
          <Col md="8">
            <h1 className="display-5 mb-0">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-3 text-primary" />
              My Task Dashboard
            </h1>
            <p className="lead text-muted">Welcome back, {account?.login}!</p>
          </Col>
          <Col md="4" className="text-end">
            <Button color="primary" size="lg" tag={Link} to="/task/new" className="rounded-pill">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add New Task
            </Button>
          </Col>
        </Row>
      </div>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md="3" sm="6" className="mb-3">
          <Card className="stats-card border-0 shadow-sm">
            <CardBody className="text-center">
              <FontAwesomeIcon icon={faListUl} size="2x" className="text-primary mb-2" />
              <h3 className="mb-1">{userTasks.length}</h3>
              <small className="text-muted">Total Tasks</small>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" sm="6" className="mb-3">
          <Card className="stats-card border-0 shadow-sm">
            <CardBody className="text-center">
              <FontAwesomeIcon icon={faClock} size="2x" className="text-warning mb-2" />
              <h3 className="mb-1">{pendingTasks.length}</h3>
              <small className="text-muted">Pending</small>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" sm="6" className="mb-3">
          <Card className="stats-card border-0 shadow-sm">
            <CardBody className="text-center">
              <FontAwesomeIcon icon={faCheckSquare} size="2x" className="text-success mb-2" />
              <h3 className="mb-1">{completedTasks.length}</h3>
              <small className="text-muted">Completed</small>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" sm="6" className="mb-3">
          <Card className="stats-card border-0 shadow-sm">
            <CardBody className="text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="text-danger mb-2" />
              <h3 className="mb-1">{overdueTasks.length}</h3>
              <small className="text-muted">Overdue</small>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Progress Card */}
      <Row className="mb-4">
        <Col md="12">
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Overall Progress</h5>
                <Badge color="primary" pill>
                  {Math.round(completionRate)}% Complete
                </Badge>
              </div>
              <Progress value={completionRate} color="primary" className="mb-2" style={{ height: '8px' }} />
              <small className="text-muted">
                {completedTasks.length} of {userTasks.length} tasks completed
              </small>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Today's Tasks Alert */}
      {todayTasks.length > 0 && (
        <Alert color="info" className="mb-4">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          You have {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''} due today!
        </Alert>
      )}

      {/* Task List Controls */}
      <Card className="border-0 shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-0">Tasks</h5>
              <small className="text-muted">
                Showing {displayTasks.length} {showCompleted ? 'tasks' : 'pending tasks'}
              </small>
            </div>
            <div className="d-flex gap-2">
              <Button color={showCompleted ? 'secondary' : 'outline-secondary'} size="sm" onClick={() => setShowCompleted(!showCompleted)}>
                {showCompleted ? 'Hide Completed' : 'Show Completed'}
              </Button>
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                style={{ width: 'auto' }}
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="createdDate">Sort by Created Date</option>
              </select>
            </div>
          </div>

          {sortedTasks.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faCheckSquare} size="3x" className="text-muted mb-3" />
              <h5 className="text-muted">No tasks found</h5>
              <p className="text-muted">{showCompleted ? 'No tasks to display.' : 'No pending tasks. Great job!'}</p>
              {!showCompleted && (
                <Button color="primary" tag={Link} to="/task/new" className="rounded-pill">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Create Your First Task
                </Button>
              )}
            </div>
          ) : (
            <div className="task-list">
              {sortedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? 'completed' : ''} ${
                    task.dueDate && task.dueDate.toDate() < new Date() && !task.completed ? 'overdue' : ''
                  }`}
                >
                  <div className="task-content">
                    <div className="task-header">
                      <div className="d-flex align-items-center">
                        <Button
                          color={task.completed ? 'success' : 'outline-secondary'}
                          size="sm"
                          className="rounded-circle me-3 completion-btn"
                          onClick={() => toggleTaskCompletion(task)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </Button>
                        <div className="flex-grow-1">
                          <h6 className={`mb-1 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>{task.description}</h6>
                          <div className="task-meta">
                            {task.priority && (
                              <Badge color={getPriorityColor(task.priority)} className="me-2">
                                <FontAwesomeIcon icon={getPriorityIcon(task.priority)} className="me-1" />
                                {task.priority}
                              </Badge>
                            )}
                            {task.dueDate && (
                              <small className="text-muted">
                                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                                Due: <TextFormat type="date" value={task.dueDate.toDate()} format={APP_LOCAL_DATE_FORMAT} />
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="task-actions">
                    <Button color="info" size="sm" tag={Link} to={`/task/${task.id}/edit`} className="me-2">
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button color="danger" size="sm" onClick={() => confirmDelete(task)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.isOpen} toggle={() => setDeleteModal({ isOpen: false, task: null })}>
        <ModalHeader toggle={() => setDeleteModal({ isOpen: false, task: null })}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the task &ldquo;
          {deleteModal.task?.description}
          &rdquo;? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModal({ isOpen: false, task: null })}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDelete}>
            Delete Task
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TaskDashboard;
