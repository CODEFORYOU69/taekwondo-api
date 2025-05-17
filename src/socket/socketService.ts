import { Server } from "socket.io";

export class SocketService {
  private static io: Server;

  static initialize(io: Server) {
    SocketService.io = io;
  }

  emitMatchUpdate(matchId: string, data: any) {
    if (SocketService.io) {
      SocketService.io.to(`match:${matchId}`).emit("match:update", data);
    }
  }

  emitMatchAction(matchId: string, action: any) {
    if (SocketService.io) {
      SocketService.io.to(`match:${matchId}`).emit("match:action", action);
    }
  }
}
