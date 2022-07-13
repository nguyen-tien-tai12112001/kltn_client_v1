import { Tooltip } from 'antd';
import moment from 'moment';
function ListMessage(props) {
  const { messages, user } = props;

  const name = user.first_name + user.last_name;
  return (
    <div className="chatuser-listmessage">
      {messages?.map((message) => (
        <div
          className={
            name === message.sender
              ? 'chatuser-listmessage-message me'
              : 'chatuser-listmessage-message'
          }
        >
          <div
            className={name === message.sender ? 'message me' : 'message admin'}
          >
            <Tooltip
              placement="bottom"
              color="red"
              title={moment(message?.createdAt).calendar()}
            >
              <p className="message_content">{message?.message}</p>
            </Tooltip>
            {/* <p className="message_createAt">
              <i class="fa-solid fa-check"></i>
              {moment(message?.createdAt).calendar()}
            </p> */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListMessage;
