import { LineOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ENDPOINT } from '../../constants/api';
import ListMessage from './Components/ListMessage';
import TypeMessage from './Components/TypeMessage';
import './styles.css';

function AppChat(props) {
  const [messages, setMessages] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const { userInfo, socket } = useSelector((state) => state?.common);

  useEffect(() => {
    const getAllMessageByConversation = async () => {
      const { data } = await axios.get(
        `${ENDPOINT}/api/v1/chat/message?idUser=${userInfo?._id}`
      );

      setMessages(data?.messageList);
    };

    getAllMessageByConversation();
  }, [messages, setMessages]);

  useEffect(() => {
    socket.emit('join_conversation', userInfo?._id);
    socket.on('schedule', () => {
      notification.success({
        placement: 'topRight',
        message: 'Notification Schedule!!!',
        // description: `Please login to Tiki`,
        duration: 3,
      });
    });

    //setup response
    socket.on('newMessage', (message) => {
      setMessages([...messages, message]);
    });
    // disconnect ||cleanup the effect
    return () => socket.disconnect();
    // eslint-disable-next-line
  });

  useEffect(() => {
    const scrollMessage = () => {
      var element = document.querySelector('.chatuser-listmessage');
      element.scrollTop = element.scrollHeight;
    };
    if (openChat) {
      scrollMessage();
    }
  });

  const handleChatFormSubmit = async (message) => {
    const sender = userInfo?.first_name + userInfo?.last_name;

    //emit create conversation and chat
    if (messages.length === 0) {
      socket.emit('create_conversation', userInfo);

      socket.on('response_room', async (conversation) => {
        const payload = {
          sender,
          message,
          idConversation: conversation?._id,
        };
        const { data } = await axios.post(
          `${ENDPOINT}/api/v1/chat/save`,
          payload
        );
        socket.emit('chat', data);
      });
    } else {
      const idConversation =
        messages[0]?.idConversation._id || messages[0]?.idConversation;
      // request save message
      const payload = {
        sender,
        message,
        idConversation,
      };
      const { data } = await axios.post(
        `${ENDPOINT}/api/v1/chat/save`,
        payload
      );
      socket.emit('chat', data);
    }
  };

  return (
    <div className="appchat">
      {openChat ? (
        ''
      ) : (
        <div className="openchat" onClick={() => setOpenChat(!openChat)}>
          Chat
        </div>
      )}

      {openChat ? (
        <div className="chatuser">
          <div className="chatuser-user">
            <span className="chatuser-user-name">Admin TIKI</span>
            <span
              className="chatuser-user-line"
              onClick={() => setOpenChat(!openChat)}
            >
              <LineOutlined></LineOutlined>
            </span>
          </div>

          {messages ? (
            <ListMessage messages={messages} user={userInfo}></ListMessage>
          ) : (
            ''
          )}

          <TypeMessage onSubmit={handleChatFormSubmit}></TypeMessage>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default AppChat;
