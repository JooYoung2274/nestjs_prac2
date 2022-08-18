import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from "@nestjs/websockets";

import { Socket, Server } from "socket.io";
import { onlineMap } from "./onlineMap";

@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  @SubscribeMessage("test")
  handleTest(@MessageBody() data: string) {
    console.log("test", data);
  }

  @SubscribeMessage("login")
  handleLogin(@MessageBody() data: { id: number; channels: number[] }, @ConnectedSocket() socket: Socket) {
    const newNamespace = socket.nsp;
    console.log("login", newNamespace);

    onlineMap[socket.nsp.name][socket.id] = data.id;

    newNamespace.emit("onlineList", Object.values(onlineMap[socket.nsp.name]));

    data.channels.forEach(channel => {
      console.log("join", socket.nsp.name, channel);
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }

  afterInit(server: Server) {
    console.log("websocketServer init");
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log("connected", socket.nsp.name);
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }

    socket.emit("hello", socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log("disconnected", socket.nsp.name);
    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];
    newNamespace.emit("onlineList", Object.values(onlineMap[socket.nsp.name]));
  }
}
