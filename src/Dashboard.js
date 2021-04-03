import React from 'react';
import Topper from './Topper';
import { Input, IconButton, Center, Button, Flex } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { DataStore } from '@aws-amplify/datastore';

const handleSearchChange = (event) => {
    console.log(event.target.value);
}

const handleMessageChange = (event) => {
    console.log(event.target.value);
}

const handleSearchSubmit = (event) => {
    console.log(event);
}

const handleMessageSubmit = (event) => {
    console.log(event);
}

class Dashboard extends React.Component {
    render(){
        return(
            <div>
                <Topper/>
                
                {/* Search Bar */}
                <Center m="auto" w="50%" my="2rem">
                    <Input placeholder="Search" onChange={handleSearchChange} /> 
                    <IconButton bgColor="#2EC4B6" color="#FDFFFC" onClick={handleSearchSubmit} icon={<SearchIcon/>}/>
                </Center> 

                {/* Message Submit */}
                <Center m="auto" w="50%" my="2rem">
                    <Input placeholder="Enter Message" onChange={handleMessageChange}/>
                    <Button bgColor="#2EC4B6" color="#FDFFFC" onClick={handleMessageSubmit}>Submit</Button>
                </Center>
            </div>
        );
    }
};

export default Dashboard;