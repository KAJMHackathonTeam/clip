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
        this.onNameChange = this.onNameChange.bind(this)
        this.onUserChange = this.onUserChange.bind(this)
        this.onUserSubmit = this.onUserSubmit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    onNameChange(e){
        this.setState({name: e.target.value})
    }
    onUserChange(e){
        this.setState({user: e.target.value})
    }
    onUserSubmit(){
        let users = this.state.users
        if(this.state.user !== ""){
            users.push(this.state.user)
            let uniqueUsers = [...new Set (users)]
            users = uniqueUsers
            this.setState({users: users})
            this.setState({user: ""})
        }

        console.log(users)
    }
    handleSubmit(){

    }
    render(){
        return(
            <>
                <Topper/>
                <Jumbotron style = {{margin: '10px'}}>
                   <Form id = 'CreateOrganizations'>
                        <Form.Group controlId="formName">
                            <Form.Label>Organization Name</Form.Label><br/>
                            <Form.Control type = 'text' onChange = {this.onNameChange} value = {this.state.name} />
                        </Form.Group>
                        <Form.Group controlId="formUsers">
                            <Form.Label>Users</Form.Label><br/>
                            <div style = {{display:'flex'}}><Form.Control type = 'text' onChange = {this.onUserChange} value = {this.state.user} /><Button variant = 'secondary' style = {{marginLeft:'30px'}} onClick = {this.onUserSubmit}>Enter User</Button></div><br/>
                            <Form.Label>Current Users</Form.Label>
                            {this.state.users.map(user => {
                                return(
                                    <div key = {user}><p><strong>{user}</strong></p></div>
                                )
                            })}<br/>
                        </Form.Group><br/>
                        <Button onClick = {this.handleSubmit}>Submit</Button>
                    </Form> 
                </Jumbotron>
            </>
        );
    }
};

export default Organizations;