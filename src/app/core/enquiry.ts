import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HOTEL } from './hotel.config';

export type EmailResult = 'sent' | 'skipped' | 'failed';

export interface EnquiryEmail {
  subject: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
}

/** Joins labelled lines into a plain-text message, skipping empty values. */
export const buildMessage = (heading: string, rows: [label: string, value: string | number | null | undefined][]): string =>
  [heading, '', ...rows.filter(([, v]) => v !== '' && v !== null && v !== undefined).map(([l, v]) => `${l}: ${v}`)].join('\n');

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Sends enquiries by email through Web3Forms (a free form-to-email service,
 * no backend needed). Until a real access key is set in hotel.config.ts the
 * email step is skipped and enquiries go by WhatsApp only.
 */
@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  get emailEnabled(): boolean {
    return !HOTEL.web3formsKey.startsWith('YOUR-');
  }

  async sendEmail(mail: EnquiryEmail): Promise<EmailResult> {
    if (!this.browser || !this.emailEnabled) return 'skipped';
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: HOTEL.web3formsKey,
          from_name: HOTEL.name + ' website',
          subject: mail.subject,
          name: mail.name,
          phone: mail.phone,
          email: mail.email || undefined,
          message: mail.message,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { success?: boolean };
      return res.ok && body.success !== false ? 'sent' : 'failed';
    } catch {
      return 'failed';
    }
  }

  /** Opens WhatsApp with the message. Must run inside the click handler so pop-up blockers allow it. */
  openWhatsApp(url: string): void {
    if (this.browser) window.open(url, '_blank', 'noopener');
  }
}
