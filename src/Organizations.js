import React from 'react';
import Topper from './Topper.js'
import { Accordion, Nav, Navbar, NavDropdown, Image, Jumbotron, ListGroup, Container, Col, Row, Carousel, Card, Button, Form, CardColumns } from 'react-bootstrap';

class Organizations extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            name: '',
            user: '',
            users: []
        }
    }
    render(){
        return(
            <div>
                <Topper/>
                <Jumbotron>
                   <Form id = 'CreateOrganizations'>
                        <Form.Group controlId="formName">
                            <Form.Label>Organization Name</Form.Label><br/>
                            <Form.Control type = 'text' onChange = {this.onNameChange} value = {this.state.name} />
                        </Form.Group>
                        <Form.Group controlId="formUsers">
                            <Form.Label>Users</Form.Label><br/>
                            <Form.Control type = 'text' onChange = {this.onUserChange} value = {this.state.user} /><br/>
                            <Form.Label>Current Users</Form.Label>
                            {this.state.users.map( (user) => {
                                <strong>{user}</strong>
                            })}
                        </Form.Group>
                    </Form> 
                </Jumbotron>
            </div>
        );
    }
};

export default Organizations;