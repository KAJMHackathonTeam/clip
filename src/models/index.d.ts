import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Response {
  readonly id: string;
  readonly response: string;
  readonly messageID: string;
  readonly user: string;
  readonly time: string;
  constructor(init: ModelInit<Response>);
  static copyOf(source: Response, mutator: (draft: MutableModel<Response>) => MutableModel<Response> | void): Response;
}

export declare class Message {
  readonly id: string;
  readonly message: string;
  readonly subject: string;
  readonly organization: string;
  readonly user: string;
  readonly time: string;
  constructor(init: ModelInit<Message>);
  static copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}

export declare class Organization {
  readonly id: string;
  readonly name: string;
  readonly users?: string[];
  constructor(init: ModelInit<Organization>);
  static copyOf(source: Organization, mutator: (draft: MutableModel<Organization>) => MutableModel<Organization> | void): Organization;
}

export declare class User {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly phone: string;
  readonly organizations?: string[];
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}