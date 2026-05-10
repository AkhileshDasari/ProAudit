import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { api } from '../api/api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your ProAudit Assistant. Ask me about your tenders, bids, or compliance checks.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for context (exclude last user message we just added visually)
            const history = messages.map(m => ({ text: m.text, sender: m.sender }));

            const responseText = await api.chatWithAI(userMessage.text, history);

            const botMessage = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'var(--accent-primary)', color: 'white',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                    border: 'none', cursor: 'pointer', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.2s ease'
                }}
                className="card-hover"
            >
                <MessageCircle size={32} />
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            width: '380px', height: '600px', maxHeight: '80vh',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column',
            zIndex: 1000, overflow: 'hidden',
            animation: 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem', background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Bot size={20} color="white" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>ProAudit Assistant</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--status-green)' }}>● Online</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1, padding: '1rem', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '1rem',
                background: 'var(--bg-app)'
            }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            maxWidth: '85%',
                            padding: '0.8rem 1rem',
                            borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                            background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
                            color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                            fontSize: '0.9rem', lineHeight: '1.4'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            padding: '0.8rem 1rem', borderRadius: '12px 12px 12px 2px',
                            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)', fontSize: '0.85rem'
                        }}>
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '1rem', background: 'var(--bg-panel)',
                borderTop: '1px solid var(--border-subtle)'
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--bg-app)', padding: '0.5rem',
                    borderRadius: '24px', border: '1px solid var(--border-subtle)'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask about compliance, bids..."
                        style={{
                            flex: 1, background: 'transparent', border: 'none',
                            padding: '0.5rem 0.5rem 0.5rem 1rem', outline: 'none',
                            color: 'var(--text-primary)', fontSize: '0.9rem'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: input.trim() ? 'var(--accent-primary)' : 'var(--bg-card)',
                            color: input.trim() ? 'white' : 'var(--text-muted)',
                            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s ease'
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
