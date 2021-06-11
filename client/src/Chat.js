import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const myId = uuidv4();
const socket = io('http://localhost:8080', { transports: ['websocket'] });
socket.on('connect', () => console.log('IO Connect => New connection has estabilished'));

const Chat = () => {
    const [message, updateMessage] = useState('');
    const [messages, updateMessages] = useState([]);

    useEffect(() => {
        const handleNewMessage = newMessage => {
            updateMessages([...messages, newMessage]);
        };
        socket.on('chat.message', handleNewMessage);
        return () => socket.off('chat.message', handleNewMessage);
    }, [messages]);

    const handleOnChange = e => {
        updateMessage(e.target.value);
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('chat.message', {
                id: myId,
                message,
            });
            updateMessage('');
        }
    };

    const handleDateNow = () => {
        const currentdate = new Date();
        const datetime = "Enviado em: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        return datetime;
    };

    return (
        <main className="container">
            <ul className="list">
                {messages.map((m, index) => {
                    const idOrigin = m.id === myId ? 'mine' : 'other';
                    return (
                        <li
                            className={`list__item list__item--${idOrigin}`}
                            key={index}
                        >
                            <span className={`message message--${idOrigin}`}>
                                {m.message}
                                <br/>
                                <span className="message__date">{handleDateNow()}</span>
                            </span>
                        </li>
                    )
                })}
            </ul>
            <form
                className="form"
                onSubmit={handleFormSubmit}
            >
                <input
                    className="form__field"
                    onChange={handleOnChange}
                    placeholder="Digite uma nova mensagem aqui"
                    type="text"
                    value={message}
                />
            </form>
        </main>
    )
};

export default Chat;