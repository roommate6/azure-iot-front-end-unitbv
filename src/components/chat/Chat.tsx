import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import "./Chat.css";

import { post } from "./../../services/httpClientService";

enum ButtonState {
    Enable,
    Disable,
}

enum SenderType {
    Client,
    Assistant,
}

interface Message {
    text: string;
    senderType: SenderType;
}

interface PostMessageRequestDTO {
    textMessage: string;
}
interface PostMessageResponseDTO {
    textMessage: string;
}

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesReference = useRef(messages);
    const [buttonState, setButtonState] = useState<ButtonState>(ButtonState.Enable);

    useEffect(() => {
        messagesReference.current = messages;
    }, [messages]);

    const handleInputChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleSubmitEvent = (event: FormEvent) => {
        event.preventDefault();
        setButtonState(ButtonState.Disable);

        setMessages(
            [...messagesReference.current, {
                text: message,
                senderType: SenderType.Client
            }]
        );

        post<PostMessageRequestDTO, PostMessageResponseDTO>(
            "api/AI/assistant/message",
            {
                textMessage: message
            }
        ).then(
            (response: PostMessageResponseDTO) => {
                setMessages(
                    [...messagesReference.current, {
                        text: response.textMessage,
                        senderType: SenderType.Assistant
                    }]
                );
                setMessage("");
                setButtonState(ButtonState.Enable);
            }
        );
    }

    return (
        <div className="main-container">
            <div className="messages-container">
                {
                    messages.map((m, index) => (
                        <div key={index} className={SenderType[m.senderType].toLowerCase() + "-message message"}>
                            {m.text}
                        </div>
                    ))
                }
            </div>

            <form onSubmit={handleSubmitEvent} className="message-form">
                <input className="message-input" type="text" value={message} onChange={handleInputChangeEvent} />
                <button className="send-button" type="submit" disabled={buttonState === ButtonState.Disable}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;