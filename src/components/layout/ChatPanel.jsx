import { useEffect, useRef, useState } from 'react';
import { useLayout } from './LayoutContext';
import IconButton from '../ui/IconButton';
import { CHAT_SEED } from '../../mock';

/** Props : messages [{id, role:'user'|'assistant', text}], loading, onSend(text). Sans props : mode démo local. */
export default function ChatPanel({ messages: controlled, loading, onSend }) {
  const { setChatOpen } = useLayout();
  const [local, setLocal] = useState(CHAT_SEED);
  const [draft, setDraft] = useState('');
  const messages = controlled ?? local;
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [messages, loading]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend ? onSend(text) : setLocal((m) => [...m, { id: Date.now(), role: 'user', text }]);
    setDraft('');
  };
  return (
    <aside className="side chat" aria-label="Assistant">
      <div className="side-inner">
        <div className="panel-head">
          <span><i className="bi bi-stars" style={{ color: 'var(--violet-hi)', marginRight: 8 }} />Assistant</span>
          <IconButton icon="x-lg" label="Masquer l’assistant" onClick={() => setChatOpen(false)} />
        </div>
        <div className="chat-scroll">
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.role}`}>
              <span className="msg-avatar"><i className={`bi bi-${m.role === 'user' ? 'person' : 'stars'}`} /></span>
              <div className="msg-bubble">{m.text}</div>
            </div>
          ))}
          {loading && <div className="msg"><span className="msg-avatar"><i className="bi bi-stars" /></span><div className="msg-bubble"><span className="typing"><span /><span /><span /></span></div></div>}
          <div ref={endRef} />
        </div>
        <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <textarea className="textarea" rows={1} placeholder="Posez une question…" aria-label="Message" value={draft}
            onChange={(e) => { setDraft(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`; }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
          <button type="submit" className="btn btn-primary" aria-label="Envoyer" disabled={!draft.trim()}><i className="bi bi-send" /></button>
        </form>
      </div>
    </aside>
  );
}
