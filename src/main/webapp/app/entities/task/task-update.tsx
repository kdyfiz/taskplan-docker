import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody, CardHeader, Form } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faCalendarAlt, faExclamationTriangle, faClock, faListUl } from '@fortawesome/free-solid-svg-icons';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { TaskPriority } from 'app/shared/model/enumerations/task-priority.model';
import { createEntity, getEntity, reset, updateEntity } from './task.reducer';
import './task-form.scss';

export const TaskUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const taskEntity = useAppSelector(state => state.task.entity);
  const loading = useAppSelector(state => state.task.loading);
  const updating = useAppSelector(state => state.task.updating);
  const updateSuccess = useAppSelector(state => state.task.updateSuccess);
  const account = useAppSelector(state => state.authentication.account);
  const taskPriorityValues = Object.keys(TaskPriority);

  const handleClose = () => {
    navigate('/task-dashboard');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
    dispatch(getUsers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }

    // Ensure description is never empty
    if (!values.description || values.description.trim().length === 0) {
      values.description = `Task created on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
    }

    // Set current user if creating new task
    if (isNew) {
      values.createdDate = convertDateTimeToServer(displayDefaultDateTime());
      values.completed = false;
      values.user = account?.id;
    } else {
      values.lastModifiedDate = convertDateTimeToServer(displayDefaultDateTime());
    }

    const entity = {
      ...taskEntity,
      ...values,
      user: account?.id ? { id: account.id, login: account.login } : taskEntity?.user,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const getPriorityIcon = priority => {
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

  const getPriorityColor = priority => {
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

  const defaultValues = () =>
    isNew
      ? {
          createdDate: displayDefaultDateTime(),
          completed: false,
          priority: 'MEDIUM',
        }
      : {
          priority: 'MEDIUM',
          ...taskEntity,
          createdDate: convertDateTimeFromServer(taskEntity.createdDate),
          lastModifiedDate: convertDateTimeFromServer(taskEntity.lastModifiedDate),
          user: taskEntity?.user?.id,
        };

  return (
    <div className="task-form-container">
      <Row className="justify-content-center">
        <Col lg="8" md="10">
          <Card className="task-form-card shadow border-0">
            <CardHeader className="bg-primary text-white">
              <h2 className="mb-0">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-3" />
                {isNew ? 'Create New Task' : 'Edit Task'}
              </h2>
              <p className="mb-0 opacity-75">{isNew ? 'Add a new task to your daily planner' : 'Update your task details'}</p>
            </CardHeader>
            <CardBody className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading task...</p>
                </div>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  {!isNew ? (
                    <ValidatedField
                      name="id"
                      required
                      readOnly
                      id="task-id"
                      label="Task ID"
                      validate={{ required: true }}
                      className="d-none"
                    />
                  ) : null}

                  {/* Task Description */}
                  <div className="form-group mb-4">
                    <ValidatedField
                      label="Task Description"
                      id="task-description"
                      name="description"
                      data-cy="description"
                      type="textarea"
                      rows="3"
                      placeholder="Enter a clear description of your task..."
                      className="form-control-lg"
                      validate={{
                        required: { value: true, message: 'Task description is required' },
                        maxLength: { value: 255, message: 'Description cannot exceed 255 characters' },
                      }}
                    />
                    <small className="form-text text-muted">Be specific and clear about what you need to accomplish</small>
                  </div>

                  {/* Due Date */}
                  <div className="form-group mb-4">
                    <ValidatedField
                      label="Due Date (Optional)"
                      id="task-dueDate"
                      name="dueDate"
                      data-cy="dueDate"
                      type="date"
                      className="form-control-lg"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <small className="form-text text-muted">Set a deadline to help prioritize your task</small>
                  </div>

                  {/* Priority Selection */}
                  <div className="form-group mb-4">
                    <label className="form-label">Task Priority</label>
                    <ValidatedField id="task-priority" name="priority" data-cy="priority" type="select" className="form-control-lg">
                      {taskPriorityValues.map(taskPriority => (
                        <option value={taskPriority} key={taskPriority}>
                          {taskPriority === 'HIGH' && '🔴 High Priority'}
                          {taskPriority === 'MEDIUM' && '🟡 Medium Priority'}
                          {taskPriority === 'LOW' && '🟢 Low Priority'}
                        </option>
                      ))}
                    </ValidatedField>
                    <small className="form-text text-muted">Choose priority level to help organize your tasks</small>
                  </div>

                  {/* Completion Status - Only show for editing */}
                  {!isNew && (
                    <div className="form-group mb-4">
                      <div className="form-check form-switch">
                        <ValidatedField
                          label="Mark as Completed"
                          id="task-completed"
                          name="completed"
                          data-cy="completed"
                          type="checkbox"
                          className="form-check-input"
                        />
                        <small className="form-text text-muted d-block mt-2">Check this box if the task has been completed</small>
                      </div>
                    </div>
                  )}

                  {/* Hidden fields for timestamp management */}
                  {!isNew && (
                    <>
                      <ValidatedField name="createdDate" type="hidden" validate={{ required: true }} />
                      <ValidatedField name="lastModifiedDate" type="hidden" />
                      <ValidatedField name="user" type="hidden" />
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-between align-items-center mt-5">
                    <Button tag={Link} to="/task-dashboard" color="secondary" size="lg" className="rounded-pill px-4">
                      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                      Back to Dashboard
                    </Button>

                    <Button color="primary" type="submit" disabled={updating} size="lg" className="rounded-pill px-4">
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {isNew ? 'Creating...' : 'Updating...'}
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          {isNew ? 'Create Task' : 'Update Task'}
                        </>
                      )}
                    </Button>
                  </div>
                </ValidatedForm>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskUpdate;
