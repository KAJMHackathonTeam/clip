import React from "react";
import { DataStore } from '@aws-amplify/datastore';
import { Response, Message, Organization, User } from './models';

class MessageBoard extends React.Component {
    async componentDidMount() {
        const models = await DataStore.query(Response);
        console.log(models);
    }

    render() {
      return <h1>Hello, {this.props.name}</h1>;
    }
}


export default MessageBoard;