import React from 'react';
// eslint-disable-next-line
import { Heading, Link, Image, Flex, Center, Box, IconButton, Text, Button, Container } from '@chakra-ui/react';
import banner from "./assets/profile.png"
import {DASHBOARD} from './App.js'
import Topper from './Topper.js';

function Landing() {
    return (
        <>
          <Topper/>
          <div id="main">
        {
          /* 
          <header>
            <Box bgColor="#fffffc">
              <Center>
                <Image src={banner} alt="Clip! logo" boxSize="100px" objectFit="cover"></Image>
              </Center>
          </Box>
        </header>
        */
        }
  
        <Flex justify="center" minHeight="100vh" alignItems="center">
          <Box>
            <Image src={banner} alt="Clip! logo" height="auto" width="40rem"></Image> 
          </Box>
          <Box>
            <Text fontSize="5xl">Bringing <strong>community</strong> back into <strong>online learning.</strong></Text>
            <Center>
              <Link to = {DASHBOARD} isExternal><Button bgColor="#2ec4b6" marginTop="2rem">Get Started</Button></Link>
            </Center>
          </Box>
        </Flex>
  
      </div>
      </>
    );
  }
  
  export default Landing;