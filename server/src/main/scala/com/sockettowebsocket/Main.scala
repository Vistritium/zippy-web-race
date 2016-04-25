package com.sockettowebsocket

import java.io.PrintStream
import java.net.{InetSocketAddress, ServerSocket, Socket, SocketException}

import com.typesafe.scalalogging.StrictLogging

object Main extends StrictLogging {


  val messageSender: MessageSender = new MessageSender {
    override def send(msg: String): Unit = {
      if (someConnection.isDefined) {
        write(someConnection.get, msg)
      } else {
        logger.info("No game-socket connection!")
      }
    }
  }

  val connection = new WebsocketConnection(new InetSocketAddress("127.0.0.1", 8184), messageSender)

  var someConnection: Option[Socket] = None


  def main(args: Array[String]) {
    connection.start()
    createSocketServer
  }

  def reader(s: Socket): Unit = {

    val input = s.getInputStream
    val sb = new StringBuilder();

    try {
      var breakLoop = false;
      while (!breakLoop) {

        val ch = input.read()
        if (ch == -1) {
          breakLoop = true
        } else if (ch == 0) {
          val msg = sb.toString()
          logger.info(s"READ: $msg")
          connection.broadcast(msg)
          sb.clear()
        } else {
          sb.append(ch.asInstanceOf[Char])
        }

      }
    } catch {
      case e: SocketException => logger.info("Socket finished", e.getMessage)
      case e: Exception => logger.error("Socket finished", e)
    } finally {
      logger.info("Closed")
      input.close()
    }


  }

  def write(s: Socket, msg: String) = {
    val out = new PrintStream(s.getOutputStream)
    out.print(msg + '\0')
    out.flush()
  }


  def createSocketServer(): Unit = {
    val server = new ServerSocket(8183)
    logger.info("Waiting for connection")

    while (true) {
      val s = server.accept()
      someConnection = Some(s)
      logger.info("Accepted new connection")

      new Thread(new Runnable {
        override def run(): Unit = {
          reader(s)
        }
      }).start()
      logger.info("abc")
    }
  }
}
