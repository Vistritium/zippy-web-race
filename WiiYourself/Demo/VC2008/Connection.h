#pragma once
#include <string>

class Connection
{
public:
	Connection();
	virtual ~Connection();

	virtual void sendMessage(std::string message) = 0;
	//returns empty string if there is no message awaiting
	virtual std::string receiveMessage() = 0;
};

