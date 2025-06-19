import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faExclamationTriangle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, deleteEntity } from './task.reducer';

export const TaskDeleteDialog = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const taskEntity = useAppSelector(state => state.task.entity);
  const updateSuccess = useAppSelector(state => state.task.updateSuccess);

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const handleClose = () => {
    navigate('/task-dashboard');
  };

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    dispatch(deleteEntity(taskEntity.id));
  };

  return (
    <Modal isOpen toggle={handleClose} className="task-delete-modal" backdrop="static">
      <ModalHeader toggle={handleClose} className="bg-danger text-white border-0">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        Confirm Task Deletion
      </ModalHeader>
      <ModalBody className="p-4">
        <Alert color="warning" className="border-0 mb-4">
          <div className="d-flex align-items-start">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-3 mt-1 text-warning" size="lg" />
            <div>
              <h6 className="alert-heading mb-2">Warning: This action cannot be undone</h6>
              <p className="mb-0">You are about to permanently delete this task. All data associated with this task will be lost.</p>
            </div>
          </div>
        </Alert>

        {taskEntity?.description && (
          <div className="task-preview bg-light p-3 rounded-3 mb-3">
            <h6 className="mb-2 text-dark">Task to be deleted:</h6>
            <div className="d-flex align-items-start">
              <FontAwesomeIcon icon={faTrash} className="text-danger me-2 mt-1" />
              <div>
                <p className="mb-1 fw-semibold">{taskEntity.description}</p>
                {taskEntity.dueDate && <small className="text-muted">Due: {new Date(taskEntity.dueDate).toLocaleDateString()}</small>}
                {taskEntity.priority && (
                  <span
                    className={`badge ms-2 bg-${
                      taskEntity.priority === 'HIGH' ? 'danger' : taskEntity.priority === 'MEDIUM' ? 'warning' : 'info'
                    }`}
                  >
                    {taskEntity.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="text-muted mb-0">Are you absolutely sure you want to delete this task?</p>
      </ModalBody>
      <ModalFooter className="border-0 p-4">
        <div className="d-flex justify-content-between w-100 gap-3">
          <Button color="secondary" onClick={handleClose} size="lg" className="flex-fill rounded-pill">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDelete} size="lg" className="flex-fill rounded-pill">
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete Task
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default TaskDeleteDialog;
