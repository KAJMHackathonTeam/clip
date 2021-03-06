import React from 'react';
import Topper from './Topper';
import { searchJSONArray } from './functions/searchJSON'
import { sortJSONArray } from './functions/sortJSON'    
import { Input, IconButton, Center, Button, Flex, Box, Select, Text } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import { Jumbotron } from 'react-bootstrap';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';
import { Amplify, Auth, API} from 'aws-amplify'
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
            clicked: false,
            inOrg: [],
            activeMessages: [],
            targetOrg: '',
            targetSubject: '',
            responses: [],
            organizations: []
        }
        
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.handleOrganizationSelectChange = this.handleOrganizationSelectChange.bind(this)
        this.handleSubjectChange = this.handleSubjectChange.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this)

        this.handleReplyChange = this.handleReplyChange.bind(this)
        this.handleReplySubmit = this.handleReplySubmit.bind(this)
        this.handleSortChange = this.handleSortChange.bind(this)
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


        let messageAll = await API.graphql({ query: queries.listMessages})
        messageAll = messageAll.data.listMessages.items


        let organizations = await API.graphql({ query: queries.listOrganizations})
        organizations = organizations.data.listOrganizations.items
        this.setState({organizations: organizations})

        let responses = await API.graphql({ query: queries.listResponses})
        responses = responses.data.listResponses.items

        let messages = [];
        let inOrg = [];
        let fullOrgs = []
        console.log(organizations)
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

    }

    async deleteMessage(id){
        //delete message and all responses associated
        const modelToDelete = {
            id: id
        }

        await API.graphql({query: mutations.deleteMessage, variables: {input: modelToDelete}})

        var toDelete = []
        for (var i = 0; i < this.state.responses.length; i ++){
            if (this.state.responses[i].messageID === id){
                toDelete.push(this.state.responses[i])
            }
        }
        for (i = 0; i < toDelete.length; i ++){
            await API.graphql({query: mutations.deleteMessage, variables: {input: toDelete[i]}})
        }
        
        
        
        let responses = await API.graphql({ query: queries.listResponses})
        .then(() => {
        window.location.reload()
        });
    
    }
    renderReply(message, reply)
    {
        if(message.id == reply.messageID)
            return (<div key = {reply.id}>
                    <Box border="1px" mb="2rem" borderColor="white" padding = "1rem">
                        <Flex >
                            <Text marginLeft="1rem"><strong>{reply.user}:</strong></Text>
                            <Text marginLeft=".5rem" fontWeight="hairline">{reply.time}</Text>
                        </Flex>
                        <Text fontWeight = "light" marginLeft="2rem">{reply.response}</Text>
                    </Box>
                   </div>)
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


        let response = {
                "response": this.state.reply[event.target.id],
                "messageID": messageRef.id,
                "user": this.state.username,
                "time": (new Date()).toString()
        }
        await API.graphql({query: mutations.createResponse, variables: {input: response}})
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
        this.setState({clicked: true})
        var time = (new Date()).toString()
        let message = {
                "message": this.state.message,
                "subject": this.state.targetSubject,
                "organization": this.state.targetOrg,
                "user": this.state.username,
                "time": (new Date()).toString()
            }
        
        await API.graphql({query: mutations.createMessage, variables: {input: message}})
        
        let models = await API.graphql({ query: queries.listMessages})
        models = models.data.listMessages.items

        var searchID;
        for (var i = 0; i < models.length; i++){
            if (models[i].message === this.state.message && models[i].user === this.state.username && models[i].time === time){
                searchID = models[i].id
            }
        }

        const api = 'https://agu8mq4047.execute-api.us-east-1.amazonaws.com/staging'
        const data = {"query" : this.state.message}
        axios
            .post(api, data)
            .then((response) => {
                response = {
                        "response": response["data"].body,
                        "messageID": searchID,
                        "user": "Clip! Bot",
                        "time": time
                }
                API.graphql({query: mutations.createResponse, variables: {input: response}})
                .then(() => {
                    alert('Question Asked')
                    window.location.reload()
                })
            })
            .catch((error) => {
                console.log(error)
            });
        }else{
            alert("Please fill out all fields")
        }
        
    }

    handleSortChange(event) {
        console.log(event.target.value)

        this.setState({activeMessages: sortJSONArray(this.state.activeMessages.copyWithin(), "time", false) });
        
    }
    getOrgName(id){
        let models = this.state.organizations
        for (var i = 0; i < models.length; i ++){
            if (models[i].id === id){
                return models[i].name
            }
        }
    }
    render(){
        return(
            <div>
                <Topper/>
                
                <Jumbotron style = {{margin: '50px'}}> 
                    <Text fontSize="5xl">Dashboard</Text><br/>
                    {/* Search Bar */}
                    <Center m="auto" w="80%" my="2rem">
                        <Input bgColor="white" placeholder="Search" onChange={this.handleSearchChange} /> 
                        <IconButton bgColor="#2EC4B6" color="#FDFFFC" onClick={this.handleSearchSubmit} icon={<SearchIcon/>}/>
                    </Center> 

                    {/* Message Submit */}
                    <Center m="auto" w="80%" my="2rem">
                        <Input bgColor="white" placeholder="Enter Message" onChange={this.handleMessageChange}/>
                        <Input bgColor="white" placeholder="Subject" onChange={this.handleSubjectChange} width="15rem"/>
                        <Select bgColor="white" name="organization-select" id="subject-select" width="30rem" placeholder="Organization" onChange={this.handleOrganizationSelectChange}>
                            {this.state.inOrg.map((org) => 
                                <option key = {org.id} value={org.id}>{org.name}</option>
                            )}
                        </Select>
                        <Button bgColor="#2EC4B6" color="#FDFFFC" isLoading={this.state.clicked === true ? "true" : ""} onClick={this.handleMessageSubmit}>Submit</Button>
                    </Center>

                    {/*Message sort*/}
                    <Center m="auto" w="80%" my="2rem">
                        <Select bgColor = "white" name = "sort-select" id="sort-select" width="30rem" placeholder="Sort by" onChange={this.handleSortChange} >
                            {["Time"].map((category) => (
                                <option key={category} value = {category}>{category}</option>
                            ))}
                        </Select>
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
                        <div key = {message.id} style = {{margin:"1rem"}}>
                            <Center>
                                <Box bgColor="#011627" color="#FDFFFC" width="80vw" height="auto" minHeight="5rem" borderRadius="10px" padding="1rem"> 
                                    <Box marginBottom = "1rem">
                                        <Flex justify="space-between">
                                            <Flex>
                                                <Text fontWeight="bold">{message.user}</Text>
                                                <Text marginLeft=".5rem" fontWeight="light">{this.getOrgName(message.organization)}</Text>
                                                <Text marginLeft=".5rem" fontWeight="light">{message.time}</Text>
                                            </Flex>
                                            <IconButton bgColor="red" color="white" onClick={() => this.deleteMessage(message.id)} icon={<CloseIcon/>}/>
                                        </Flex>
                                        
                                        <Text mt=".5rem">{message.message}</Text>
                                    </Box>
                                        {this.state.responses.map((resp) =>
                                            <Box >
                                                { this.renderReply(message, resp) }
                                            </Box>
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

