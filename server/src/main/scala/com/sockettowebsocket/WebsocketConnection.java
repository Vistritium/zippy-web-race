package com.sockettowebsocket;

import org.java_websocket.WebSocket;
import org.java_websocket.drafts.Draft;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import scala.Function;
import scala.Function1;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.Collection;
import java.util.List;

public class WebsocketConnection extends WebSocketServer {
    private MessageSender messageSender;
    private WebSocket webSocket;

    public WebsocketConnection(InetSocketAddress address, MessageSender messageSender) {
        super(address);
        this.messageSender = messageSender;
    }


    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("WEBSOCKET Connected");
        webSocket = conn;
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("WEBSOCKET closed");
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        messageSender.send(message);
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.out.println("WEBSOCKET error");
    }

    public void broadcast(String message) {
        if (webSocket == null) {
            System.out.println("Websocket does not exist: ");
        } else if (webSocket.isOpen()) {
            webSocket.send(message);
        } else {
            System.out.println("Websocket is not open: " + webSocket.getDraft());
        }

    }
}
