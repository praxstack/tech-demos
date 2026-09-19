import type { Ticket } from "../types";

export const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "TK-98423",
    subject: "Double charge on order #98423",
    from: "alex.m@email.com",
    receivedAt: "2 min ago",
    preview: "I was charged twice for my order last Thursday...",
    body: "Hi, I placed an order (#98423) last Thursday and was charged twice on my card. I need a refund for the duplicate charge ASAP. This is getting frustrating — I've already emailed twice with no response.",
    tags: ["billing", "urgent"],
  },
  {
    id: "TK-98401",
    subject: "Can't log in after site update",
    from: "dev.sam@startup.io",
    receivedAt: "18 min ago",
    preview: "Login broken since yesterday's deploy...",
    body: "Since yesterday's deploy I can't log in at all — I get a 500 error after entering credentials. Steps: 1) Go to app.example.com/login 2) Enter email/password 3) Click Sign in → blank page with 500. No workaround. Blocking our whole team.",
    tags: ["bug", "blocking"],
  },
  {
    id: "TK-98388",
    subject: "You're all incompetent",
    from: "anonymous@mail.ru",
    receivedAt: "1 hr ago",
    preview: "Threatening language and personal attacks...",
    body: "You people are absolute garbage. I'm going to make sure everyone knows how useless your support is. Fix my account NOW or I'll report you everywhere. [profanity removed]",
    tags: ["abuse", "flagged"],
  },
  {
    id: "TK-98372",
    subject: "Apple Pay support?",
    from: "jordan.k@icloud.com",
    receivedAt: "3 hr ago",
    preview: "Would love Apple Pay at checkout...",
    body: "Hi! Love the product. Any plans to add Apple Pay at checkout? Would make mobile purchases much smoother for me. Thanks!",
    tags: ["feature"],
  },
  {
    id: "TK-98355",
    subject: "Something's wrong?",
    from: "confused.user@gmail.com",
    receivedAt: "5 hr ago",
    preview: "Vague message about account issues...",
    body: "hey so um my thing isn't working?? i tried stuff but idk. can someone help me figure out what's going on with my account maybe?",
    tags: ["unclear"],
  },
];
