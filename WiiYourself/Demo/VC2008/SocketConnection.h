#pragma once
#define WIN32_LEAN_AND_MEAN

#include <windows.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdlib.h>
#include <stdio.h>
#include <condition_variable>

#pragma comment (lib, "Ws2_32.lib")
#pragma comment (lib, "Mswsock.lib")
#pragma comment (lib, "AdvApi32.lib")
#include <string>
#include <thread>
#include <mutex>
#include <queue>
#include  "Connection.h"

class SocketConnection : public Connection
{
public:
	void sendMessage(std::string message) override;
	std::string receiveMessage() override;
public:
	SocketConnection();
	~SocketConnection();

	
	void sendData(char* data);

	void receiver();

	std::string tryReceive();
private:
	void setupSocket();
	

	WSADATA wsa;
	SOCKET s;
	struct sockaddr_in server;
	char server_reply[2000];
	char server_reply_temp[2000];
	int recv_size;

	std::thread* receiveThread;

	std::mutex m;
	//std::condition_variable cv;
	//bool receivedSomethig;

	std::queue<std::string> messagesQueue;

};

