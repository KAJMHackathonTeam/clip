import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Topper from './Topper.js'
import { Accordion, Nav, Navbar, NavDropdown, Image, Jumbotron, ListGroup, Container, Col, Row, Carousel, Card, Form, CardColumns } from 'react-bootstrap';
import { Text, Flex, Button } from '@chakra-ui/react';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';
import Amplify, {API, graphqlOperation, Auth} from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import styles from './Organizations.module.css';

class Organizations extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            inOrg: [],
            name: '',
            user: '',
            users: [],
            id: "",
            organizations: [],
            exists: false
        }
        this.onNameChange = this.onNameChange.bind(this)
        this.onUserChange = this.onUserChange.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
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
        
        let organizations = await API.graphql({ query: queries.listOrganizations})
        organizations = organizations.data.listOrganizations.items
        this.setState({organizations: organizations})
        let organization;
        let exists = false;
        for(var i = 0; i < organizations.length; i ++){
            if (organizations[i].creator === username){
                organization = organizations[i]
                exists = true
            }
        }
        if(exists === true){        
        let users = []
        for (var i = 0; i < organization.users.length; i ++){
            users.push(organization.users[i])
        }
        let uniqueUsers = [...new Set (users)]
        users = uniqueUsers
        console.log(users)
            this.setState({users: users})
            this.setState({name: organization.name})
            this.setState({id: organization.id})
            this.setState({exists: true})
        }else{
            this.setState({users: [username]})
        }
        var inOrg = []
        for (var i = 0; i < organizations.length; i ++){
            if (organizations[i].users.indexOf(username) !== -1){
                inOrg.push(organizations[i])
            }
        }
        for (var j = 0; j < inOrg.length; j++){
            let users = []
            for (var i = 0; i < inOrg[j].users.length; i ++){
                users.push(inOrg[j].users[i])
            }
            let uniqueUsers = [...new Set (users)]
            users = uniqueUsers
            inOrg[j].users = users
        }
        
        this.setState({inOrg: inOrg})
    }
    onNameChange(e){
        this.setState({name: e.target.value})
    }
    onUserChange(e){
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
    deleteUser(user){
        let users = this.state.users
        let index = users.indexOf(user)
        users.splice(index)
        this.setState({users: users})
    }
    async handleSubmit(){
        if (this.state.name !== "" && this.state.users !== []){
        try{
        if (this.state.exists === true){
            
            const organization = {
                id: this.state.id,
                name: this.state.name,
                users: this.state.users
            }
            console.log(organization)
            await API.graphql({query: mutations.updateOrganization, variables: {input: organization}})
            .then(() => {
                alert("Organization Updated")
                window.location.reload();
              })
        }else{
            const organization = {
                name: this.state.name,
                users: this.state.users,
                creator: this.state.username
            }
            await API.graphql({query: mutations.createOrganization, variables: {input: organization}})
            .then(() => {
                alert("Organization Created")
                window.location.reload();
              })
        }
        }catch(e){
            alert("Error in creation")
            console.log(e)
        }
        }else{
            alert("Please fill out all fields")
        }
    }
    render(){
        return(
            <>
            <div className={styles.main}>
            <Topper/>
                <Jumbotron style = {{margin: '50px', backgroundColor: "#02223C", color:"white"}}>
                    <Text fontSize="5xl">Manage Organizations</Text><br/>
                   <Form id = 'CreateOrganizations'>
                        <Form.Group controlId="formName">
                            <Form.Label>Organization Name</Form.Label><br/>
                            <Form.Control type = 'text' onChange = {this.onNameChange} value = {this.state.name} className={styles.TextBox}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formUsers">
                            <Form.Label>Users</Form.Label><br/>
                            <Flex style = {{display:'flex'}}>
                                <Form.Control type = 'text' onChange = {this.onUserChange} value = {this.state.user} className={styles.TextBox} />
                                <Button  ml="1rem"color="#fdfffc" bgColor="#2EC4B6" onClick = {this.onUserSubmit}>Enter User</Button>
                            </Flex>
                                <br/>
                            <Form.Label>Current Users</Form.Label>
                            {this.state.users.map(user => {
                                return(
                                    <div onClick = {this.deleteUser(user)} style = {{marginLeft: '1rem'}} key = {user}><strong>{user}</strong></div>
                                )
                            })}<br/>
                        </Form.Group><br/>
                        <Button color="#fdfffc" bgColor="#2EC4B6" onClick = {this.handleSubmit}>Submit</Button>
                    </Form> 
                </Jumbotron>
                <CardColumns style = {{columns: 'auto'}}>
                {this.state.inOrg.map((org) => (
                     <div key = {org.id} >
                     <Card  style={{ width: '18rem', margin: '5vw',  backgroundColor: "#02223C", color: 'white' }} > 
                         <Card.Body>
                             <Card.Title>{org.name}</Card.Title>
                                 <strong>Users:</strong>
                                 {org.users.map((user) => (
                                     <div style = {{marginLeft: '1rem'}}  key = {user}>{user}</div>
                                 ))}
                         </Card.Body>                         
                     </Card>
                     </div>
                ))}
                </CardColumns>
            </div>
            </>
        );
    }
};

export default withAuthenticator(Organizations);