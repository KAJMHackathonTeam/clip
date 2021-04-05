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
import { Response, Message, Organization, User } from './models';
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./NewDashboard.module.css";

class Dashboard extends React.Component {
    constructor(props) {
        //initialize super
        super (props)

        this.state = {
            usr_username : "",
            usr_message : "", //message that the user wants to send
            usr_replies : {}, //stores the replies that the user is making
            usr_search : "", //stores the user search query
            usr_targetOrg : "", //the organization the user wants to submit to
            usr_targetSubject : "", //the subject the user wants to add. 

            all_messages : [], //stores all messages 
            all_messagesActive: [],  //stores all active messages 
            all_responses : [], //stores all responses
            all_organizations : [], //stores all user orgs
            all_messagesAndResponsesMapped : {}, //{message id: num_resp}
            
            state_clicked: false,
        }

        //we create our handlers here
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)

        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this)

        this.handleSubjectChange = this.handleSubjectChange.bind(this)

        this.handleOrganizationSelectChange = this.handleOrganizationSelectChange.bind(this)




        this.handleReplyChange = this.handleReplyChange.bind(this)
        this.handleReplySubmit = this.handleReplySubmit.bind(this)
        this.handleSortChange = this.handleSortChange.bind(this)


    }

    async componentDidMount(){
        //get username
        let username = ""

        try {
            const currentUserInfo = await Auth.currentUserInfo();
            username = currentUserInfo.username; 
            this.setState({usr_username : username});
        } catch (err) {
            console.log('error fetching user info: ', err);
        }

        //update local data
        this.updateLocalData();
    }

    async updateLocalData() {
            //grab all messages, organizations, and responses
            let messagesAll = await API.graphql({ query: queries.listMessages})
            messagesAll = messagesAll.data.listMessages.items
    
            let organizationsAll = await API.graphql({ query: queries.listOrganizations})
            organizationsAll = organizationsAll.data.listOrganizations.items
    
            let responsesAll = await API.graphql({ query: queries.listResponses})
            responsesAll = responsesAll.data.listResponses.items


            let messages = []
            for (var i = 0; i < messagesAll.length; i++){
                if (messagesAll[i]._deleted !== true || messagesAll[i]._deleted === null){
                    messages.push(messagesAll[i])
                }
            }
            messagesAll = messages

            let responses = []
            for (var i = 0; i < responsesAll.length; i++){
                if (responsesAll[i]._deleted !== true || responsesAll[i]._deleted === null){
                    responses.push(responsesAll[i])
                }
            }
            responsesAll = responses

            //determine which organizations is the user subscribed to.
            let organizationsSubscribed = [];
            let orgIdSet = new Set();
            
            for ( i = 0; i < organizationsAll.length; i++) {
                if (organizationsAll[i].users.indexOf(this.state.usr_username) !== -1)
                {
                    organizationsSubscribed.push(organizationsAll[i]);
                    orgIdSet.add(organizationsAll[i].id)
                }
            }
            

            //make sure that all the messages/responses are from the organization the user is in

            let messagesSubscribed = [];
            let messageIdSet = new Set();
            let responsesSubscribed = [];


            for (let i = 0; i < messagesAll.length; i++) {
                if (orgIdSet.has(messagesAll[i].organization))
                {
                    messagesSubscribed.push(messagesAll[i]);
                    messageIdSet.add(messagesAll[i].id);
                }
            }
            for (let i = 0; i < responsesAll.length; i++) {
                if(messageIdSet.has(responsesAll[i].messageID))
                {
                    responsesSubscribed.push(responsesAll[i]);
                }
            }


            //build all_messagesAndResponsesMapped array
            let messagesAndResponsesMapped = {};
            for (let i = 0; i < messagesSubscribed.length; i++) {
                messagesAndResponsesMapped[messagesSubscribed[i].id] = 0;
            }
            for (let i = 0; i < responsesSubscribed.length; i++) {
                messagesAndResponsesMapped[responsesSubscribed[i].messageID] += 1;
            }

            //set states
            this.setState({all_messages : messagesSubscribed});
            this.setState({all_messagesActive : messagesSubscribed});
            this.setState({all_responses : responsesSubscribed});
            this.setState({all_organizations : organizationsSubscribed})
            this.setState({all_messagesAndResponsesMapped : messagesAndResponsesMapped});


            console.log("messagesAll: ", messagesAll);
            console.log("organizationsAll: ",organizationsAll);
            console.log("responsesAll: ", responsesAll);


            console.log("-----------------------------")
            console.log("messagesSubscribed: ",messagesSubscribed);
            console.log("messageIdSet: ",messageIdSet);
            console.log("organizationsSubscribed: ",organizationsSubscribed);
            console.log("orgIdSet: ",orgIdSet);
            console.log("responsesSubscribed: ",responsesSubscribed);
            console.log("messagesAndResponsesMapped: ",messagesAndResponsesMapped);

            
    }


    //########################################## DASHBOARD INPUT HANDLERS + RENDER
    handleSearchChange(event) {
        this.setState({usr_search : event.target.value});
    }

    handleSearchSubmit() {

        if (this.state.usr_search !== ""){
            let result = searchJSONArray(this.state.all_messages, ['message', 'subject'], this.state.usr_search)
            this.setState({all_messagesActive: result})
        }
        else{
            this.setState({all_messagesActive : this.state.all_messages})
        }
    }

    handleSubjectChange(event) {
        this.setState({usr_targetSubject: event.target.value})
    }
    handleOrganizationSelectChange(event) {
        this.setState({usr_targetOrg: event.target.value})
    }
        
    handleMessageChange(event) {
        this.setState({usr_message: event.target.value});
    }
    async handleMessageSubmit(event) {
        if (this.state.usr_message !== "" && this.state.usr_targetSubject !== "" && this.state.usr_targetOrg !== ""){
            this.setState({state_clicked: true})
            var time = (new Date()).toString()
            let message = {
                "message": this.state.usr_message,
                "subject": this.state.usr_targetSubject,
                "organization": this.state.usr_targetOrg,
                "user": this.state.usr_username,
                "time": time
            }
        
            await API.graphql({query: mutations.createMessage, variables: {input: message}})
            
            let models = await API.graphql({ query: queries.listMessages})
            models = models.data.listMessages.items

            var searchID;
            for (var i = 0; i < models.length; i++){
                if (models[i].message === this.state.usr_message && models[i].user === this.state.usr_username && models[i].time === time){
                    searchID = models[i].id
                }
            }

            const api = 'https://agu8mq4047.execute-api.us-east-1.amazonaws.com/staging'
            const data = {"query" : this.state.usr_message}
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
                        this.updateLocalData()
                        this.handleSearchSubmit();
                    })
                })
                .catch((error) => {
                    console.log(error)
                });


        }else{
            alert("Please fill out all fields")
        }
    }


    renderDashboardInput() {
        return (
            <Jumbotron style = {{margin: '50px', color: 'white', borderRadius: "10px", backgroundColor: "#02223C"}}> 
                <Text fontSize="5xl">Dashboard</Text><br/>
                {/* Search Bar */}
                <Center m="auto" w="80%" my="2rem">
                    <Input bgColor="white" placeholder="Search" onChange={this.handleSearchChange} className={styles.TextBox}/> 
                    <IconButton bgColor="#2EC4B6" color="#FDFFFC" onClick={this.handleSearchSubmit} icon={<SearchIcon/>}/>
                </Center>


                {/* Message Submission*/}
                <Center m="auto" w="80%" my="2rem">
                    <Input bgColor="white" placeholder="Enter Message" onChange={this.handleMessageChange} className={styles.TextBox}/>
                    <Input bgColor="white" placeholder="Subject" onChange={this.handleSubjectChange} width="15rem" className={styles.TextBox}/>
                    <Select color="black" bgColor="white" name="organization-select" id="subject-select" width="30rem" placeholder="Organization" onChange={this.handleOrganizationSelectChange} className={styles.TextBox}>
                        {this.state.all_organizations.map((org) => 
                        <option key = {org.id} value={org.id}>{org.name}</option>
                        )}
                    </Select>
                    <Button bgColor="#2EC4B6" color="#FDFFFC" isLoading={this.state.state_clicked === true ? "true" : ""} onClick={this.handleMessageSubmit} >Submit</Button>
                </Center>
                
                {/*Message sort*/}
                <Center m="auto" w="80%" my="2rem">
                    <Select className={styles.TextBox} color="black" bgColor = "white" name = "sort-select" id="sort-select" width="30rem" placeholder="Sort by" onChange={this.handleSortChange} >
                        {["Time", "Responses"].map((category) => (
                        <option key={category} value = {category}>{category}</option>
                        ))}
                    </Select>
                </Center>
            </Jumbotron>
        );
    };


    //########################################## TABLE INPUT HANDLERS + RENDER
    async deleteMessage(message){
        //delete message and all responses associated
        const modelToDelete = {
            id: message.id,
            _version: message._version
        }
        await API.graphql({query: mutations.deleteMessage, variables: {input: modelToDelete}})

        var toDelete = []
        for (var i = 0; i < this.state.all_responses.length; i ++){
            if (this.state.all_responses[i].messageID === message.id){
                toDelete.push(this.state.all_responses[i])
            }
        }
        for (i = 0; i < toDelete.length; i ++){
            let newDelete = {
                id: toDelete[i].id,
                _version: toDelete[i]._version
            }
            await API.graphql({query: mutations.deleteResponse, variables: {input: newDelete}})
        }
        let responses = await API.graphql({ query: queries.listResponses})
        .then((e) => {
            this.updateLocalData();
            this.handleSearchSubmit();
        });
    }

    handleReplyChange(event) {
        this.setState({usr_replies: {
            ...this.state.usr_replies,
            [event.target.id] : event.target.value
        } })

    }

    async handleReplySubmit(event) {

        let messageRef = this.state.all_messagesActive[parseInt(event.target.id)];


        let response = {
            "response": this.state.usr_replies[event.target.id],
            "messageID": messageRef.id,
            "user": this.state.usr_username,
            "time": (new Date()).toString()
    }
    await API.graphql({query: mutations.createResponse, variables: {input: response}})
        this.updateLocalData();
        this.handleSearchSubmit();
    }

    renderReply(message, reply) {

        if(message.id == reply.messageID)
            return (
                <Box border="1px" mb="2rem" borderColor="white" bgColor = "#022D4F" padding = "1rem" borderRadius="10px">
                    <Flex >
                        <Text marginLeft="1rem"><strong>{reply.user}:</strong></Text>
                        <Text marginLeft=".5rem" fontWeight="hairline">{reply.time}</Text>
                    </Flex>
                    <Text fontWeight = "light" marginLeft="2rem">{reply.response}</Text>
                </Box>
            );
        return;
    }
    getOrgName(id){
        let models = this.state.all_organizations
        for (var i = 0; i < models.length; i ++){
            if (models[i].id === id){
                return models[i].name
            }
        }
    }
    renderTable(){
        return (
            
            <Box maxHeight="40rem" overflow="scroll">
                <Jumbotron style = {{backgroundColor: '#011627'}}>
                    <InfiniteScroll
                        dataLength={this.state.all_messagesActive.length}
                        next={this.state.all_messagesActive}
                        hasMore={false}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="scrollableDiv"
                        >
                        {this.state.all_messagesActive.map((message,index) => (
                            <div key = {message.id} style = {{margin:"1rem"}}>
                                <Center>
                                    <Box bgColor="#02223C" color="white" width="100%" height="auto" minHeight="5rem" borderRadius="10px" padding="1rem"> 
                                        <Box marginBottom = "1rem">
                                            <Flex justify="space-between">
                                            <Flex>
                                            <Text fontWeight="bold">{message.user} &gt; </Text>
                                            <Text marginLeft=".5rem"><u>{this.getOrgName(message.organization)}</u> </Text>
                                            <Text marginLeft=".5rem" fontWeight="light">{message.time} </Text>
                                            <Text marginLeft=".5rem" fontWeight="bold">{"Subject: " + message.subject}</Text>
                                            </Flex>
                                            <IconButton bgColor="#2EC4B6" color="white" onClick={() => this.deleteMessage(message)} icon={<CloseIcon/>}/>
                                            </Flex>

                                            <Text mt=".5rem">{message.message}</Text>
                                        </Box>

                                        {this.state.all_responses.map((resp) =>
                                            <Box key = {resp.id}>
                                                { this.renderReply(message, resp) }
                                            </Box>
                                        )}

                                        <Box>
                                            <Flex>
                                                <Input placeholder="Reply" onChange={this.handleReplyChange} id={index} key={"input"+index} ></Input>
                                                <Button color="white" bgColor="#2EC4B6" onClick={this.handleReplySubmit} id={index} key={"btn"+index}>Reply</Button>
                                            </Flex> 
                                        </Box>
                                    </Box>
                                </Center>
                            </div>
                        ))}
                    </InfiniteScroll>
                </Jumbotron>
            </Box>
            
        );
    }



     //########################################## SORTING LOGIC
    handleSortChange(event) {
        
        let copy = this.state.all_messagesActive.copyWithin()
        
        if (event.target.value == "Time") {
            sortJSONArray(copy, "time", false)
        }     
        else if (event.target.value == "Responses") {
            //iterate through all active messages
            let tempSort = [];
            for(let i = 0; i < copy.length; i++)
            {
                if (this.state.all_messagesAndResponsesMapped.hasOwnProperty(copy[i].id))
                {
                    tempSort.push({
                        'data' : copy[i],
                        'numresp' : this.state.all_messagesAndResponsesMapped[copy[i].id]
                    })
                }
                else
                {
                    tempSort.push({
                        'data' : copy[i],
                        'numresp' : 0
                    })
                }
            }
            
            sortJSONArray(tempSort, "numresp", false);
            //extract
            for(let i = 0; i < copy.length; i++)
            {
                copy[i] = tempSort[i].data;
            }
            
        }

        this.setState({activeMessages: copy});
        
    }
    render(){
        return (
            <div className={styles.main}>
                <Topper/>
                {this.renderDashboardInput()}

                {this.renderTable()}
            </div>
        );
    }
}

export default withAuthenticator(Dashboard);