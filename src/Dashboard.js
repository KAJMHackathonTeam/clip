import React from 'react';
import Topper from './Topper';
import { searchJSONArray } from './functions/searchJSON'
import { Input, IconButton, Center, Button, Flex, Box, Select, Text } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.css';
import { Jumbotron } from 'react-bootstrap';
import { SearchIcon } from '@chakra-ui/icons';
import { Amplify, Auth} from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import MessageBoard from './MessageBoard';
import { DataStore } from '@aws-amplify/datastore';
import { Response, Message, Organization, User } from './models';

let organizations = [{}];
let subjects = [{}];
class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            message: '',
            searchQuery: '',
            messages: [],
            inOrg: [],
            activeMessages: [],
            targetOrg: '',
            targetSubject: '',
        }
        
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.handleOrganizationSelectChange = this.handleOrganizationSelectChange.bind(this)
        this.handleSubjectChange = this.handleSubjectChange.bind(this)

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this)
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


        const messageAll = await DataStore.query(Message);
        const organizations = await DataStore.query(Organization);
        let messages = [];
        let inOrg = [];
        let fullOrgs = []
        for (var i = 0; i < organizations.length; i ++){
            if (organizations[i].users.indexOf(username) !== -1){
                inOrg.push(organizations[i].id)
                fullOrgs.push(organizations[i])
            }
        }
        this.setState({inOrg: fullOrgs})

        for (i = 0; i < messageAll.length; i++){
            if (inOrg.indexOf(messageAll[i].organization) !== -1){
                messages.push(messageAll[i])
            }
        }

        this.setState({messages: messages})

    }
    handleSearchChange(event) {
        this.setState({searchQuery: event.target.value})
    }

    handleMessageChange(event) {
       this.setState({message: event.target.value});
    }
    
    handleOrganizationSelectChange(event) {
        this.setState({targetOrg: event.target.value})
    }

    handleSubjectChange(event) {
        this.setState({targetSubject: event.target.value})
    }
    
    handleReplyChange(event) {

    }

    async handleSearchSubmit() {
        if (this.state.searchQuery !== ""){
            var result = searchJSONArray(this.state.messages, 'message', this.state.searchQuery)
            console.log('message: ', this.state.searchQuery);
            console.log('all: ', this.state.messages);
            console.log('search: ', result);
            this.setState({activeMessages: result})
        }
        else{
            this.setState({activeMessages: this.state.messages})
        }

    }

    async handleMessageSubmit() {
        console.log("message submit" ,this.state)
        
        await DataStore.save(
            new Message({
                "message": this.state.message,
                "subject": this.state.targetSubject,
                "organization": this.state.targetOrg,
                "user": this.state.message,
                "time": (new Date()).toString()
            })
        );
        
        
    }

    render(){
        return(
            <div>
                <Topper/>
                
                <Jumbotron style = {{margin: '50px'}}> 
                    {/* Search Bar */}
                    <Center m="auto" w="50%" my="2rem">
                        <Input bgColor="white" placeholder="Search" onChange={this.handleSearchChange} /> 
                        <IconButton bgColor="#2EC4B6" color="#FDFFFC" onClick={this.handleSearchSubmit} icon={<SearchIcon/>}/>
                    </Center> 

                    {/* Message Submit */}
                    <Center m="auto" w="50%" my="2rem">
                        <Input bgColor="white" placeholder="Enter Message" onChange={this.handleMessageChange}/>
                        <Input bgColor="white" placeholder="Subject" onChange={this.handleSubjectChange} width="15rem"/>
                        <Select bgColor="white" name="subject-select" id="subject-select" width="15rem" placeholder="Organization" onChange={this.handleSubjectSelectChange}>
                            {this.state.inOrg.map((org) => 
                                <option key = {org.id} value={org.id}>{org.name}</option>
                            )}
                        </Select>
                        <Button bgColor="#2EC4B6" color="#FDFFFC" onClick={this.handleMessageSubmit}>Submit</Button>
                    </Center>
                </Jumbotron>
                                
                <div>
                    <Center>
                        {this.state.activeMessages.map((message) => 
                            <Box bgColor="#011627" color="#FDFFFC" width="40rem" height="auto" minHeight="5rem" borderRadius="2%" padding="1rem"> 
                                <Box>
                                    <Flex>
                                        <Text fontWeight="bold">{message.user}</Text>
                                        <Text marginLeft=".5rem" fontWeight="light">{message.time}</Text>
                                    </Flex>
                                    
                                    <Text mt=".5rem">{message.message}</Text>
                                </Box>
                                

                                <Box>
                                    <Flex>
                                        <Input placeholder="Reply" onChange={this.handleReplyChange}></Input>
                                        <Button color="black" bgColor="#2EC4B6">Submit</Button>
                                    </Flex> 
                                </Box>
                            </Box>
                        )}
                    </Center>
                </div>
            </div>
        );
    }
};

export default withAuthenticator(Dashboard);