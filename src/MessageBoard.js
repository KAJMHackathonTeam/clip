import React from "react";
import { DataStore } from '@aws-amplify/datastore';
import { Response, Message, Organization, User } from './models';
import { Box, Text, Flex, Center, Input, Button } from "@chakra-ui/react";

const messages = [{}];
class MessageBoard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            messages: this.props.messages
        }
    }
    async componentDidMount() {
        const models = await DataStore.query(Response);
        console.log(models);
    }

    render() {
      return (
          <div>
              <Center>
                {messages.map((message) => 
                    <Box bgColor="#011627" color="#FDFFFC" width="40rem" height="auto" minHeight="5rem" borderRadius="2%" padding="1rem">
                        <Box mb="2rem"> 
                            <Flex>
                                <Text fontWeight="bold">Message User</Text>
                                <Text marginLeft=".5rem" fontWeight="light">Message Time</Text>
                            </Flex>

                            <Text mt=".5rem">Message Content</Text>
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
      )
    }
}


export default MessageBoard;