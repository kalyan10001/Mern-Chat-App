import { useEffect, useRef } from 'react';
import useGetMessages from '../hooks/useGetMessages.js';
import MessageSkeleton from '../skeletons/MessageSkeleton.jsx';
import Message from './Message.jsx';

const Messages = () => {
    const { messages, loading } = useGetMessages();
    const lastMessageRef = useRef();

    useEffect(() => {
      setTimeout(()=>{
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      },100);
    }, [messages]);

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {!loading && messages.length > 0 && messages.map((message, index) => (
                <div key={message._id} ref={lastMessageRef}>
                    <Message message={message} />
                </div>
            ))}
            {loading && [...Array(3)].map((__, idx) => <MessageSkeleton key={idx} />)}
            {!loading && messages.length === 0 && (<p className='text-center'>start a conversation here</p>)}
        </div>
    );
};

export default Messages;
