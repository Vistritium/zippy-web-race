#include "SocketConnection.h"

#define DEFAULT_BUFLEN 8183
#define DEFAULT_PORT "27015"
#include <thread>
#include <iostream>

void doReceiver2(SocketConnection* socketConnection)
{
	puts("in do receiver\n");
	socketConnection->receiver();
}

void SocketConnection::sendMessage(std::string message)
{
	sendData(const_cast<char*>(message.c_str()));
}

std::string SocketConnection::receiveMessage()
{
	return tryReceive();
}

SocketConnection::SocketConnection()
{
	setupSocket();
}


SocketConnection::~SocketConnection()
{
}


void SocketConnection::setupSocket()
{

	printf("\nInitialising Winsock...");
	if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0)
	{
		printf("Failed. Error Code : %d", WSAGetLastError());
		return;
	}

	printf("Initialised.\n");

	//Create a socket
	if ((s = socket(AF_INET, SOCK_STREAM, 0)) == INVALID_SOCKET)
	{
		printf("Could not create socket : %d", WSAGetLastError());
	}

	printf("Socket created.\n");


	server.sin_addr.s_addr = inet_addr("127.0.0.1");
	server.sin_family = AF_INET;
	server.sin_port = htons(8183);

	//Connect to remote server
	if (connect(s, (struct sockaddr *)&server, sizeof(server)) < 0)
	{
		puts("connect error");
		return;
	}

	puts("Connected");

	
	receiveThread = new std::thread(doReceiver2, this);


}

void SocketConnection::sendData(char* data)
{
	//char* message = "GET / HTTP/1.1\r\n\r\n";
	if (send(s, data, strlen(data)+1, 0) < 0)
	{
		puts("Send failed");
		return;
	}	
	return;
}

void SocketConnection::receiver()
{
	puts("Receiver started...");
	while (true)
	{	
		if ((recv_size = recv(s, server_reply, 2000, 0)) == SOCKET_ERROR)
		{
			puts("recv failed");
			exit(-1);
		}

		//puts("Reply received");

		//Add a NULL terminating character to make it a proper string before printing
		server_reply[recv_size] = '\0';

		puts(server_reply);

		m.lock();
		int last = 0;
		for (int i = 0; i <= recv_size; i++)
		{
			if (server_reply[i] == '\0')
			{
				int howMany = i - last;
				memcpy(server_reply_temp, &server_reply[last], howMany * sizeof(char));
				server_reply_temp[howMany] = '\0';
				std::string msg(server_reply_temp);
				if (!msg.empty())
				{
					messagesQueue.push(msg);
				}				
				last = i + 1;
			}			
		}
				
		m.unlock();
	}

}

std::string SocketConnection::tryReceive()
{
	std::string result;

	m.lock();
	if (!messagesQueue.empty())
	{
		result = messagesQueue.front();
		messagesQueue.pop();
		std::cout << "queue status: " << messagesQueue.size() << std::endl;
	}	

	m.unlock();
	return result;
}