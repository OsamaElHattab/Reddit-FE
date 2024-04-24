import Message from './Containers/Message';
import ContentContainer from './Containers/ContentContainer';
import { useQuery } from 'react-query';
import { fetchRequest } from '../../API/User';
import LoadingProvider from '../../Components/LoadingProvider';

const Sent = () => {
  const { data, isError, isLoading, refetch } = useQuery('messages', () =>
    fetchRequest('messages/read-all-messages')
  );
  console.log(data?.data);

  // const parentIds = data?.data
  //   .filter((message) => message.parentMessageId === null)
  //   .map((message) => message._id);

  const parentChildrenMap = data?.data.reduce((acc, message) => {
    if (message.parentMessageId !== null) {
      if (acc[message.parentMessageId]) {
        acc[message.parentMessageId].push(message);
      } else {
        acc[message.parentMessageId] = [message];
      }
    }
    return acc;
  }, {});

  console.log(parentChildrenMap, 'parentChildrenMap');

  return (
    <LoadingProvider error={isError} isLoading={isLoading}>
      <ContentContainer length={data?.data.length}>
        <div className=''>
          {!!data?.data &&
            data?.data.map((mess) => {
              if (mess.parentMessageId == null) {
                return (
                  <Message
                    unread={mess['unread_flag']}
                    type='message'
                    isSent={mess['isSent']}
                    messageContent={mess.message}
                    senderType={mess['sender_type']}
                    receiverType={mess['receiver_type']}
                    receiverUsername={mess['receiver_username']}
                    senderUsername={mess['sender_username']}
                    sendingDate={new Date(mess['created_at'])}
                    subject={mess['subject']}
                    isReply={mess['isReply']}
                    repliesArr={parentChildrenMap[mess['_id']] || null}
                    messageId={mess['_id']}
                    key={mess['_id']}
                    senderVia={mess['senderVia']}
                    refetch={refetch}
                    parentMessageId={mess['parentMessageId']}
                    query='messages'
                  />
                );
              }
            })}
          {/* <Message type='message' />
        <Message /> */}
        </div>
      </ContentContainer>
    </LoadingProvider>
  );
};

export default Sent;