import {Server as NetServer, Socket} from "net";
import { NextApiResponse } from "next";
import {Server as SocketIOServer} from "socket.io";



export type NextAPIResponseServerIO = NextApiResponse & {
    socket : Socket & {
        server : NetServer & {
            io : SocketIOServer
        }
    }
}