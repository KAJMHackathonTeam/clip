import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Topper from './Topper.js'
import { Accordion, Nav, Navbar, NavDropdown, Image, Jumbotron, ListGroup, Container, Col, Row, Carousel, Card, Button, Form, CardColumns } from 'react-bootstrap';
import { Text } from '@chakra-ui/react';
import Amplify, {Auth} from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { DataStore } from '@aws-amplify/datastore';
import { Organization } from './models';

class Organizations extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            name: '',
            user: '',
            users: [],
            id: "",
            exists: false
        }
        this.onNameChange = this.onNameChange.bind(this)
        this.onUserChange = this.onUserChange.bind(this)
        this.onUserSubmit = this.onUserSubmit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async componentDidMount(){
        let username = ""
        try {
            const currentUserInfo = await Auth.currentUserInfo();
            username = currentUserInfo.username
            this.setState({username: username});
          } catch (err) {
            console.log('error fetching user info: ', err);
          }
        
        const organizations = await DataStore.query(Organization);
        console.log(organizations)
        let organization;
        let exists = false;
        for(var i = 0; i < organizations.length; i ++){
            if (organizations[i].creator === username){
                organization = organizations[i]
                exists = true
            }
        }
        if(exists === true){
            this.setState({users: organization.users})
            this.setState({name: organization.name})
            this.setState({id: organization.id})
            this.setState({exists: true})
        }else{
            this.setState({users: [username]})
        }

    }
    onNameChange(e){
        console.log(this.state.users)
        this.setState({name: e.target.value})
    }
    onUserChange(e){
        console.log(this.state.users)
        this.setState({user: e.target.value})
    }
    onUserSubmit(){
        let users = []
        for (var i = 0; i < this.state.users.length; i ++){
            users.push(this.state.users[i])
        }
        if(this.state.user !== ""){
            users.push(this.state.user)
            let uniqueUsers = [...new Set (users)]
            users = uniqueUsers
            this.setState({users: users})
            this.setState({user: ""})
        }
    }
    async handleSubmit(){
        try{
        if (this.state.exists === true){
            const organization = await DataStore.query(Organization, this.state.id);
            await DataStore.save(Organization.copyOf(organization, item => {
                item.name = this.state.name
                item.users = this.state.users
            }))
            .then(() => {
                alert("Organization Updated")
                window.location.reload();
              })
        }else{

            await DataStore.save(
                new Organization({
                    "name": this.state.name,
                    "users": this.state.users,
                    "creator":this.state.username
                })
            )
            .then(() => {
                alert("Organization Created")
                window.location.reload();
              })
        }
        }catch{
            alert("Error in creation")
        }
    }
    render(){
        return(
            <>
                <Topper/>
                <Jumbotron style = {{margin: '50px'}}>
                    <Text fontSize="5xl">Manage Organizations</Text><br/>
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

export default withAuthenticator(Organizations);