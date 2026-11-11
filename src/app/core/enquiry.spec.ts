import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { buildMessage, EnquiryService } from './enquiry';

describe('buildMessage', () => {
  it('writes a heading and labelled lines, skipping empty values', () => {
    const text = buildMessage('Booking request', [
      ['Name', 'Ravi'],
      ['Email', ''],
      ['Children', 0],
      ['Notes', undefined],
    ]);
    expect(text).toBe('Booking request\n\nName: Ravi\nChildren: 0');
  });
});

describe('EnquiryService', () => {
  let service: EnquiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), { provide: PLATFORM_ID, useValue: 'browser' }] });
    service = TestBed.inject(EnquiryService);
  });

  it('skips email while the Web3Forms key is still the placeholder', async () => {
    const fetchSpy = spyOn(window, 'fetch');
    expect(service.emailEnabled).toBeFalse();
    expect(await service.sendEmail({ subject: 's', name: 'n', phone: '9876543210', message: 'm' })).toBe('skipped');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('opens WhatsApp in a new tab without giving it access to this page', () => {
    const open = spyOn(window, 'open');
    service.openWhatsApp('https://wa.me/910000000000?text=hi');
    expect(open).toHaveBeenCalledWith('https://wa.me/910000000000?text=hi', '_blank', 'noopener');
  });
});
