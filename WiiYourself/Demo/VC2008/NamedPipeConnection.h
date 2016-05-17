#pragma once
#include "Connection.h"

#define WIN32_LEAN_AND_MEAN
#include <windows.h>

#include <stdio.h>
#include <tchar.h>
#include <stdlib.h>

#include <string>

#define BUFSIZE 512

class NamedPipeConnection : public Connection
{
private:
	HANDLE hPipe;
	LPTSTR lpvMessage = TEXT("Default message from client.");
	TCHAR  chBuf[BUFSIZE];
	BOOL   fSuccess = FALSE;
	DWORD  cbRead, cbToWrite, cbWritten, dwMode;
	LPTSTR lpszPipename = TEXT("\\\\.\\pipe\\mynamedpipe");

public:
	void sendMessage(std::string message) override;
	std::string receiveMessage() override;

	NamedPipeConnection();
	~NamedPipeConnection();
};