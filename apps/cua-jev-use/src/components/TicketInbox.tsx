import type { Ticket } from "../types";

interface Props {
  tickets: Ticket[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TicketInbox({ tickets, selectedId, onSelect }: Props) {
  return (
    <aside className="ticket-inbox">
      <div className="inbox-header">
        <h2>Inbox</h2>
        <span className="inbox-count">{tickets.length} tickets</span>
      </div>
      <ul className="ticket-list">
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <button
              type="button"
              className={`ticket-item ${ticket.id === selectedId ? "selected" : ""}`}
              onClick={() => onSelect(ticket.id)}
            >
              <div className="ticket-meta">
                <span className="ticket-id">{ticket.id}</span>
                <span className="ticket-time">{ticket.receivedAt}</span>
              </div>
              <div className="ticket-subject">{ticket.subject}</div>
              <div className="ticket-preview">{ticket.preview}</div>
              <div className="ticket-tags">
                {ticket.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          </li>
        ))}
      </ul>
      <p className="inbox-hint">
        ↑↓ navigate · <kbd>j</kbd> Ask Jev
      </p>
    </aside>
  );
}
