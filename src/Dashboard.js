import React from 'react';
import Topper from './Topper';
import { Input, IconButton, Center, Button, Flex } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Amplify,{ Auth} from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'

class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            message: '',
            searchQuery: ''
        }
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.handleMessageSubmit = this.handleMessageSubmit.bind(this)
    }

    handleSearchChange(event) {
        this.setState({searchQuery: event.target.value})
    }

    handleMessageChange(event) {
       this.setState({message: event.Button});
    }

    handleSearchSubmit(event) {
        
    }

    handleMessageSubmit(event) {
        
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
            </div>
        );
    }
};

export default withAuthenticator(Dashboard);