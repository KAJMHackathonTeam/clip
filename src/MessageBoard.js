import React from "react";
import { DataStore } from '@aws-amplify/datastore';
import { Response, Message, Organization, User } from './models';
import { Box, Text, Flex, Center } from "@chakra-ui/react";

const messages = [{}];
const messagesList = messages.map((number) => 
    <Box mx="2rem" bgColor="#011627" color="#FDFFFC" width="40rem" height="auto" minHeight="5rem" minWidth="10rem" borderRadius="2%" padding="1rem"> 
        <Flex>
            <Text fontWeight="bold">User Name</Text>
            <Text marginLeft=".5rem" fontWeight="light">Message Date</Text>
        </Flex>

        <Text mt=".5rem">Message Content</Text>
    </Box>
);
class MessageBoard extends React.Component {
    async componentDidMount() {
        const models = await DataStore.query(Response);
        console.log(models);
    }

    render() {
      return (
          <div>
              <Center>
                { messagesList }
              </Center>
          </div>
      )
    }
}


export default MessageBoard;