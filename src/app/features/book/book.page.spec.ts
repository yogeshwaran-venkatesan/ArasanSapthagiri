import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import en from '../../../i18n/en.json';
import { EnquiryService } from '../../core/enquiry';
import { addDays, toIsoDate } from '../../shared/booking/dates';
import { BookPage } from './book.page';

describe('BookPage', () => {
  const today = toIsoDate(new Date());
  let enquiry: jasmine.SpyObj<EnquiryService>;

  async function setup(query: Record<string, string> = {}): Promise<{ fixture: ComponentFixture<BookPage>; page: any; el: HTMLElement }> {
    enquiry = jasmine.createSpyObj<EnquiryService>('EnquiryService', ['openWhatsApp', 'sendEmail']);
    enquiry.sendEmail.and.resolveTo('skipped');

    await TestBed.configureTestingModule({
      imports: [BookPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(query) } } },
        { provide: EnquiryService, useValue: enquiry },
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', en);
    translate.use('en');

    const fixture = TestBed.createComponent(BookPage);
    await fixture.whenStable();
    return { fixture, page: fixture.componentInstance as any, el: fixture.nativeElement };
  }

  it('starts with tonight and one night', async () => {
    const { page } = await setup();
    expect(page.form.value.checkIn).toBe(today);
    expect(page.form.value.checkOut).toBe(addDays(today, 1));
    expect(page.nights()).toBe(1);
  });

  it('pre-fills dates, room and travel package from the URL', async () => {
    const checkIn = addDays(today, 10);
    const checkOut = addDays(today, 13);
    const { page } = await setup({ in: checkIn, out: checkOut, room: 'suite', package: 'rameswaram' });
    expect(page.form.value.checkIn).toBe(checkIn);
    expect(page.form.value.checkOut).toBe(checkOut);
    expect(page.form.value.room).toBe('suite');
    expect(page.form.value.message).toContain('Rameswaram Pilgrimage');
    expect(page.nights()).toBe(3);
  });

  it('ignores invalid or past query values', async () => {
    const { page } = await setup({ in: '2020-01-01', room: 'penthouse', package: 'moon' });
    expect(page.form.value.checkIn).toBe(today);
    expect(page.form.value.room).toBe('standard');
    expect(page.form.value.message).toBe('');
  });

  it('moves check-out forward when check-in passes it', async () => {
    const { page } = await setup();
    page.form.controls.checkIn.setValue(addDays(today, 5));
    expect(page.form.value.checkOut).toBe(addDays(today, 6));
  });

  it('does not send anything while the form is invalid, and shows the errors', async () => {
    const { fixture, page, el } = await setup();
    await page.submit();
    await fixture.whenStable();
    expect(enquiry.openWhatsApp).not.toHaveBeenCalled();
    expect(el.textContent).toContain('Please enter your name.');
    expect(el.querySelector('#name')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('opens WhatsApp with the full request and shows the confirmation', async () => {
    const { fixture, page, el } = await setup({ room: 'mini-suite' });
    page.form.patchValue({ name: 'Ravi Kumar', phone: '98765 43210', adults: 3 });
    await page.submit();
    await fixture.whenStable();

    expect(enquiry.openWhatsApp).toHaveBeenCalledTimes(1);
    const text = decodeURIComponent(enquiry.openWhatsApp.calls.mostRecent().args[0]);
    expect(text).toContain('Ravi Kumar');
    expect(text).toContain('Mini Suite');
    expect(text).toContain('Adults: 3');
    expect(enquiry.sendEmail).toHaveBeenCalled();
    expect(el.textContent).toContain('Almost done!');
  });

  it('silently drops submissions that fill the bot trap', async () => {
    const { page } = await setup();
    page.form.patchValue({ name: 'Bot', phone: '9876543210', botcheck: 'http://spam' });
    await page.submit();
    expect(enquiry.openWhatsApp).not.toHaveBeenCalled();
  });
});
