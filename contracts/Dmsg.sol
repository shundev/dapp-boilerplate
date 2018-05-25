pragma solidity ^0.4.23;

contract Dmsg {
  struct Message {
    address sender;
    address receiver;
    string text;
    uint created_at;
  }

  event MessageSent ( uint indexed id, address indexed sender, address indexed receiver, string text, uint created_at);

  Message[] public messages;
  mapping(address => uint[]) userToMessages;
  
  constructor() public
  {
    // To avoid id=0
    messages.push(Message(0, 0, "", now));
  }

  function getMessage(uint id) external view returns(uint, address, address, string, uint)
  {
    require(id < messages.length);
	Message memory message = messages[id];
    return (id, message.sender, message.receiver, message.text, message.created_at);
  }

  // returns latest 20 messages between msg.sender and theother.
  function getMessages(address theother) external view returns (uint[20])
  {
    uint[20] memory results;
	uint counter = 0;
    for (uint i=0; i < userToMessages[msg.sender].length && counter < 20; i++)
	{
	  uint mId = userToMessages[msg.sender][userToMessages[msg.sender].length - 1 - i];
	  Message memory m = messages[mId];
	  if ((m.sender == msg.sender && m.receiver == theother) || (m.sender == theother && m.receiver == msg.sender))
	  {
	    results[counter] = mId;
	    counter++;
	  }
	}

	return results;
  }

  // Send a message from msg.sender to receiver
  function sendMessage(address receiver, string text) external returns(uint)
  {
    require(msg.sender != receiver);
    require(bytes(text).length > 0);
    uint timestamp = now;
    uint id = messages.push(Message(msg.sender, receiver, text, timestamp)) - 1;
	userToMessages[msg.sender].push(id);
	userToMessages[receiver].push(id);
	emit MessageSent(id, msg.sender, receiver, text, timestamp);
	return id;
  }
}
