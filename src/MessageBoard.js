import React from "react";
import { Box, Text, Flex, Center, Input, Button } from "@chakra-ui/react";
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';
import { Amplify, Auth, API} from 'aws-amplify'
const messages = [{}];
class MessageBoard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            messages: this.props.messages
        }
    }
    async componentDidMount() {
        let responsesAll = await API.graphql({ query: queries.listResponses})
        responsesAll = responsesAll.data.listResponses.items
        console.log(responsesAll)
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