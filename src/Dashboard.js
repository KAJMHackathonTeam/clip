import React from 'react';
import Topper from './Topper';
import { Input, IconButton, Center } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const handleChange = (event) => {
    console.log(event.target.value);
}

const handleSubmit = (event) => {
    console.log(event);
}

class Dashboard extends React.Component {
    render(){
        return(
            <div>
                <Topper/>

                {/* Search Bar */}
                <Center m="auto" w="50%" my="2rem">
                    <Input placeholder="Search" onChange={handleChange} /> 
                    <IconButton bgColor="#2EC4B6" color="white" onClick={handleSubmit} icon={<SearchIcon/>}/>
                </Center>

                {/* Message Submit */}
                
            </div>
        );
    }
};

export default Dashboard;