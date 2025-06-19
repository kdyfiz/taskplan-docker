import './home.scss';

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Alert, Col, Row, Button, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faCheckSquare, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { useAppSelector } from 'app/config/store';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);
  const navigate = useNavigate();

  if (account?.login) {
    // Redirect authenticated users to their task dashboard
    React.useEffect(() => {
      navigate('/task-dashboard');
    }, [navigate]);

    return (
      <div className="task-planner-home">
        <Row className="justify-content-center">
          <Col md="10" lg="8">
            <div className="text-center mb-4">
              <h1 className="display-4 text-primary">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-3" />
                Daily Task Planner
              </h1>
              <p className="lead text-muted">Welcome back, {account.login}! Ready to plan your day?</p>
            </div>

            <Row className="g-4">
              <Col md="6">
                <Card className="h-100 shadow-sm border-0 task-card">
                  <CardBody className="text-center">
                    <FontAwesomeIcon icon={faPlus} size="3x" className="text-success mb-3" />
                    <CardTitle tag="h4">Add New Task</CardTitle>
                    <CardText>Create a new task with description, due date, and priority level.</CardText>
                    <Button color="success" size="lg" tag={Link} to="/task/new" className="rounded-pill">
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Create Task
                    </Button>
                  </CardBody>
                </Card>
              </Col>

              <Col md="6">
                <Card className="h-100 shadow-sm border-0 task-card">
                  <CardBody className="text-center">
                    <FontAwesomeIcon icon={faList} size="3x" className="text-primary mb-3" />
                    <CardTitle tag="h4">View All Tasks</CardTitle>
                    <CardText>Browse, edit, and manage all your tasks in one organized view.</CardText>
                    <Button color="primary" size="lg" tag={Link} to="/task" className="rounded-pill">
                      <FontAwesomeIcon icon={faList} className="me-2" />
                      View Tasks
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="welcome-home">
      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <div className="text-center mb-5">
            <FontAwesomeIcon icon={faCheckSquare} size="4x" className="text-primary mb-4" />
            <h1 className="display-4 text-primary">Daily Task Planner</h1>
            <p className="lead text-muted">
              Organize your day, prioritize your tasks, and achieve your goals with our intuitive task management system.
            </p>
          </div>

          <Card className="shadow border-0">
            <CardBody className="p-4">
              <Alert color="info" className="border-0">
                <h5>
                  <FontAwesomeIcon icon={faList} className="me-2" />
                  Get Started
                </h5>
                <p className="mb-3">Sign in to start planning your day and managing your tasks efficiently.</p>
                <div className="d-grid gap-2 d-md-block">
                  <Button color="primary" size="lg" tag={Link} to="/login" className="me-2 rounded-pill">
                    <Translate contentKey="global.messages.info.authenticated.link">Sign In</Translate>
                  </Button>
                  <Button color="outline-primary" size="lg" tag={Link} to="/account/register" className="rounded-pill">
                    <Translate contentKey="global.messages.info.register.link">Register</Translate>
                  </Button>
                </div>
              </Alert>

              <div className="mt-4">
                <h6>Default Test Accounts:</h6>
                <ul className="list-unstyled small text-muted">
                  <li>• Administrator: login=&quot;admin&quot;, password=&quot;admin&quot;</li>
                  <li>• User: login=&quot;user&quot;, password=&quot;user&quot;</li>
                </ul>
              </div>
            </CardBody>
          </Card>

          <div className="mt-5 text-center">
            <h5 className="mb-3">Key Features</h5>
            <Row>
              <Col md="4" className="mb-3">
                <FontAwesomeIcon icon={faPlus} size="2x" className="text-success mb-2" />
                <h6>Add Tasks</h6>
                <small className="text-muted">Create tasks with descriptions, due dates, and priorities</small>
              </Col>
              <Col md="4" className="mb-3">
                <FontAwesomeIcon icon={faCheckSquare} size="2x" className="text-primary mb-2" />
                <h6>Track Progress</h6>
                <small className="text-muted">Mark tasks as complete and track your progress</small>
              </Col>
              <Col md="4" className="mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} size="2x" className="text-warning mb-2" />
                <h6>Due Dates</h6>
                <small className="text-muted">Set due dates and sort by priority or deadline</small>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
