import React from 'react';
import Topper from './Topper';
import { searchJSONArray } from './functions/searchJSON'
import { Input, IconButton, Center, Button, Flex } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { DataStore } from '@aws-amplify/datastore';
import { Response, Message, Organization, User } from './models';

import MessageBoard from './MessageBoard';

class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            message: '',
            searchQuery: ''
        }
        
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this)
    }

    handleSearchChange(event) {
        this.setState({searchQuery: event.target.value})
    }

    handleMessageChange(event) {
       this.setState({message: event.target.value});
    }

    async handleSearchSubmit(event) {
        //fetch Messages
        const models = await DataStore.query(Message);

        var result = searchJSONArray(models, 'message', this.state.searchQuery)
        console.log('message: ', this.state.searchQuery);
        console.log('all: ', models);
        console.log('search: ', result);
    }

    async handleMessageSubmit(event) {
        console.log("message submit" ,this.state)
        
        await DataStore.save(
            new Message({
                "message": this.state.message,
                "subject": "TODO: Not yet implemented",
                "organization": "TODO: Not yet implemented",
                "user": "TODO: Not yet implemented",
                "time": (new Date()).toString()
            })
        );
        
        
    }

    render(){
        return(
            <div>
                <Topper/>
                
                {/* Search Bar */}
                <Center m="auto" w="50%" my="2rem">
                    <Input placeholder="Search" onChange={this.handleSearchChange} /> 
                    <IconButton bgColor="#2EC4B6" color="#FDFFFC" onClick={this.handleSearchSubmit} icon={<SearchIcon/>}/>
                </Center> 

                {/* Message Submit */}
                <Center m="auto" w="50%" my="2rem">
                    <Input placeholder="Enter Message" onChange={this.handleMessageChange}/>
                    <Button bgColor="#2EC4B6" color="#FDFFFC" onClick={this.handleMessageSubmit}>Submit</Button>
                </Center>

                <MessageBoard/>
            </div>
        );
    }
};

export default Dashboard;