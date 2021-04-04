import React from 'react';
import Topper from './Topper';
import { searchJSONArray } from './functions/searchJSON'
import { Input, IconButton, Center, Button, Flex, Box, Select, Text } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import { Jumbotron } from 'react-bootstrap';
import { SearchIcon } from '@chakra-ui/icons';
import { Amplify, Auth} from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import MessageBoard from './MessageBoard';
import { DataStore } from '@aws-amplify/datastore';
import { Response, Message, Organization, User } from './models';
import InfiniteScroll from "react-infinite-scroll-component";

let organizations = [{}];
let subjects = [{}];
class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            message: '',
            reply: {},
            searchQuery: '',
            messages: [],
            inOrg: [],
            activeMessages: [],
            targetOrg: '',
            targetSubject: '',
            responses: [],
        }
        
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.handleOrganizationSelectChange = this.handleOrganizationSelectChange.bind(this)
        this.handleSubjectChange = this.handleSubjectChange.bind(this)

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this)

        this.handleReplyChange = this.handleReplyChange.bind(this)
        this.handleReplySubmit = this.handleReplySubmit.bind(this)
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
        const responses = await DataStore.query(Response);

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
        this.setState({activeMessages: messages})
        this.setState({responses: responses})

        console.log(this.state.responses);

    }


    renderReply(message, reply)
    {
        if(message.id == reply.messageID)
            return (<Flex>
                         <Text> {reply.response} </Text>

                   </Flex>)
        return;
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
        this.setState({reply: {
            ...this.state.reply,
            [event.target.id] : event.target.value
        } })
    }

    async handleReplySubmit(event) {

        //message reference: this.state.messages[parseInt(event.target.id)]
        var messageRef = this.state.messages[parseInt(event.target.id)];


        await DataStore.save(
            new Response({
                "response": this.state.reply[event.target.id],
                "messageID": messageRef.id,
                "user": this.state.username,
                "time": (new Date()).toString()
            })
        );
        window.location.reload();
    }

    async handleSearchSubmit() {
        if (this.state.searchQuery !== ""){
            var result = searchJSONArray(this.state.messages, 'message', this.state.searchQuery)

            this.setState({activeMessages: result})
        }
        else{
            this.setState({activeMessages: this.state.messages})
        }
    }

    async handleMessageSubmit() {
        if (this.state.message !== "" && this.state.targetSubject !== "" && this.state.targetOrg !== ""){
        var time = (new Date()).toString()
        await DataStore.save(
            new Message({
                "message": this.state.message,
                "subject": this.state.targetSubject,
                "organization": this.state.targetOrg,
                "user": this.state.username,
                "time": (new Date()).toString()
            }));
        
        const models = await DataStore.query(Message);
        var searchID;
        for (var i = 0; i < models.length; i++){
            if (models[i].message === this.state.message && models[i].user === this.state.username && models[i].time === time){
                searchID = models[i].id
            }
        }

        const api = 'https://agu8mq4047.execute-api.us-east-1.amazonaws.com/staging'
        const data = {"query" : this.state.message}
        const headers = {'Access-Control-Allow-Origin': '*'}
        axios
            .post(api, headers, data)
            .then((response) => {
                console.log(response)
                DataStore.save(
                    new Response({
                        "response": response,
                        "messageID": searchID,
                        "user": "Clip! Aid",
                        "time": time
                    })
                ).then(() => {
                    alert('Question Asked')
                })
            })
            .catch((error) => {
                console.log(error)
            });
        }else{
            alert("Please fill out all fields")
        }
        window.location.reload();
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
                        <Select bgColor="white" name="organization-select" id="subject-select" width="15rem" placeholder="Organization" onChange={this.handleOrganizationSelectChange}>
                            {this.state.inOrg.map((org) => 
                                <option key = {org.id} value={org.id}>{org.name}</option>
                            )}
                        </Select>
                        <Button bgColor="#2EC4B6" color="#FDFFFC" onClick={this.handleMessageSubmit}>Submit</Button>
                    </Center>
                </Jumbotron>

                <div>
                    <hr />
                    <InfiniteScroll
                        dataLength={this.state.activeMessages.length}
                        next={this.state.messages}
                        hasMore={false}
                        loader={<h4>Loading...</h4>}
                    > {this.state.activeMessages.map((message, index) => (
                        <div>
                            <Center>
                                <Box bgColor="#011627" color="#FDFFFC" width="40rem" height="auto" minHeight="5rem" borderRadius="2%" padding="1rem"> 
                                    <Box>
                                        <Flex>
                                            <Text fontWeight="bold">{message.user}</Text>
                                            <Text marginLeft=".5rem" fontWeight="light">{message.time}</Text>
                                        </Flex>
                                        
                                        <Text mt=".5rem">{message.message}</Text>
                                    </Box>
                                    
                                    {this.state.responses.map((resp) =>
                                        this.renderReply(message, resp)
                                    )}

                                    <Box>
                                        <Flex>
                                            <Input placeholder="Reply" onChange={this.handleReplyChange} id={index} ></Input>
                                            <Button color="black" bgColor="#2EC4B6" onClick={this.handleReplySubmit} id={index}>Submit</Button>
                                        </Flex> 
                                    </Box>
                                </Box>
                            </Center>
                        </div>
                    ))}
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
};

export default withAuthenticator(Dashboard);

