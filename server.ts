import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const CONTACT_EMAIL = 'purvabhadange06@gmail.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

interface InquiryPayload {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  _honey?: string;
}

interface StoredInquiry {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  deliveredVia: string;
}

async function persistInquiry(entry: StoredInquiry): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  let existing: StoredInquiry[] = [];
  try {
    const raw = await fs.readFile(INQUIRIES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) existing = parsed;
  } catch {
    existing = [];
  }
  existing.push(entry);
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(existing, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  app.post('/api/contact', async (req, res) => {
    try {
      const body = (req.body || {}) as InquiryPayload;
      const honeypot = typeof body._honey === 'string' ? body._honey.trim() : '';

      // Silently accept and drop automated honeypot submissions
      if (honeypot.length > 0) {
        return res.status(200).json({ ok: true });
      }

      const cleanName = typeof body.name === 'string' ? body.name.trim() : '';
      const cleanEmail = typeof body.email === 'string' ? body.email.trim() : '';
      const cleanTopic =
        typeof body.topic === 'string' && body.topic.trim()
          ? body.topic.trim()
          : 'Internship / Role';
      const cleanMessage = typeof body.message === 'string' ? body.message.trim() : '';

      if (!cleanName) {
        return res.status(400).json({ ok: false, error: 'Please enter your name.' });
      }
      if (!EMAIL_PATTERN.test(cleanEmail)) {
        return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
      }
      if (!cleanMessage) {
        return res
          .status(400)
          .json({ ok: false, error: 'Please enter a brief message about the role or project.' });
      }

      const formspreeEndpoint =
        process.env.FORMSPREE_ENDPOINT || process.env.VITE_FORMSPREE_ENDPOINT;
      const web3FormsKey =
        process.env.WEB3FORMS_ACCESS_KEY || process.env.VITE_WEB3FORMS_ACCESS_KEY;

      let deliveredVia = 'local-inbox';

      if (formspreeEndpoint) {
        const upstream = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            topic: cleanTopic,
            message: cleanMessage,
          }),
        });
        if (upstream.ok) {
          deliveredVia = 'formspree';
        }
      } else if (web3FormsKey) {
        const upstream = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: cleanName,
            email: cleanEmail,
            subject: `[${cleanTopic}] Portfolio Inquiry from ${cleanName}`,
            message: `Topic: ${cleanTopic}\n\n${cleanMessage}`,
          }),
        });
        const result = (await upstream.json()) as { success?: boolean };
        if (upstream.ok && result.success) {
          deliveredVia = 'web3forms';
        }
      } else {
        const originHeader =
          req.get('origin') ||
          process.env.APP_URL ||
          `http://localhost:${PORT}`;
        const refererHeader = req.get('referer') || `${originHeader}/`;

        try {
          const upstream = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Origin: originHeader,
              Referer: refererHeader,
            },
            body: JSON.stringify({
              name: cleanName,
              email: cleanEmail,
              topic: cleanTopic,
              message: cleanMessage,
              _subject: `[${cleanTopic}] Portfolio Inquiry from ${cleanName}`,
              _template: 'table',
            }),
          });
          const result = (await upstream.json()) as { success?: boolean | string };
          if (upstream.ok && (result.success === true || result.success === 'true')) {
            deliveredVia = 'formsubmit';
          }
        } catch {
          deliveredVia = 'local-inbox';
        }
      }

      await persistInquiry({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        name: cleanName,
        email: cleanEmail,
        topic: cleanTopic,
        message: cleanMessage,
        deliveredVia,
      });

      return res.status(200).json({ ok: true, deliveredVia });
    } catch {
      return res.status(500).json({
        ok: false,
        error: 'Unable to process your message right now. Please try again or email directly.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
