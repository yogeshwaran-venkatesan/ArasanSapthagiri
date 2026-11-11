import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { buildMessage, EmailResult, EnquiryService } from '../../core/enquiry';
import { HOTEL, ROOM_TYPES, TRAVEL_PACKAGES, whatsappUrl } from '../../core/hotel.config';
import { IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { addDays, isIsoDate, nightsBetween, toIsoDate } from '../../shared/booking/dates';
import { phoneValidator, stayValidator } from '../../shared/forms/validators';
import { Icon } from '../../shared/ui/icon';
import { PageHero } from '../../shared/ui/page-hero';

type Status = 'idle' | 'sending' | 'done';

/** Upper limits for the guest counters (UI guard-rails, not hotel policy). */
export const BOOKING_LIMITS = { rooms: 10, adults: 20, children: 10 } as const;

@Component({
  selector: 'app-book-page',
  imports: [NgOptimizedImage, ReactiveFormsModule, RouterLink, TranslatePipe, Icon, PageHero],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book.page.html',
})
export class BookPage {
  private readonly route = inject(ActivatedRoute);
  private readonly t = inject(TranslateService);
  private readonly enquiry = inject(EnquiryService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly hotel = HOTEL;
  protected readonly img = IMAGES;
  protected readonly rooms = ROOM_TYPES;
  protected readonly limits = BOOKING_LIMITS;
  protected readonly today = toIsoDate(new Date());

  protected readonly form = this.fb.group(
    {
      checkIn: [this.today, Validators.required],
      checkOut: [addDays(this.today, 1), Validators.required],
      room: [ROOM_TYPES[0].id as string, Validators.required],
      roomCount: [1, [Validators.required, Validators.min(1), Validators.max(BOOKING_LIMITS.rooms)]],
      adults: [2, [Validators.required, Validators.min(1), Validators.max(BOOKING_LIMITS.adults)]],
      children: [0, [Validators.min(0), Validators.max(BOOKING_LIMITS.children)]],
      name: ['', [Validators.required, Validators.maxLength(80)]],
      phone: ['', [Validators.required, phoneValidator]],
      email: ['', [Validators.email, Validators.maxLength(120)]],
      message: ['', Validators.maxLength(1000)],
      /** Honeypot: hidden from people, bots fill it in. */
      botcheck: [''],
    },
    { validators: stayValidator(() => this.today) },
  );

  private readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly nights = computed(() => nightsBetween(this.value().checkIn ?? '', this.value().checkOut ?? ''));
  protected readonly roomId = computed(() => this.value().room ?? ROOM_TYPES[0].id);
  protected readonly minCheckOut = computed(() => addDays(isIsoDate(this.value().checkIn) ? this.value().checkIn! : this.today, 1));

  protected readonly submitted = signal(false);
  protected readonly status = signal<Status>('idle');
  protected readonly emailResult = signal<EmailResult>('skipped');

  constructor() {
    pageSeo('book', '/book', { image: IMAGES.hero });
    this.prefillFromQuery();

    // Moving check-in on or past check-out pushes check-out to the next day.
    this.form.controls.checkIn.valueChanges.pipe(takeUntilDestroyed()).subscribe((checkIn) => {
      if (isIsoDate(checkIn) && nightsBetween(checkIn, this.form.controls.checkOut.value) === 0) {
        this.form.controls.checkOut.setValue(addDays(checkIn, 1));
      }
    });
  }

  /** Accepts ?in=YYYY-MM-DD&out=YYYY-MM-DD&room=id (booking bar, room pages) and ?package=id (travel page). */
  private prefillFromQuery(): void {
    const q = this.route.snapshot.queryParamMap;
    const checkIn = q.get('in');
    const checkOut = q.get('out');
    const room = q.get('room');
    if (isIsoDate(checkIn) && checkIn >= this.today) {
      this.form.patchValue({ checkIn, checkOut: addDays(checkIn, 1) });
      if (isIsoDate(checkOut) && nightsBetween(checkIn, checkOut) > 0) this.form.patchValue({ checkOut });
    }
    if (room && ROOM_TYPES.some((r) => r.id === room)) this.form.patchValue({ room });
    const pkg = TRAVEL_PACKAGES.find((p) => p.id === q.get('package'));
    if (pkg) {
      const name = this.t.instant(`travel.packages.${pkg.id}.name`);
      this.form.patchValue({ message: this.t.instant('bookPage.packageNote', { name }) });
    }
  }

  /** Show a control's error once it was touched or the form was submitted. */
  protected invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  protected stayInvalid(): boolean {
    return !!this.form.errors && (this.form.controls.checkOut.touched || this.form.controls.checkIn.touched || this.submitted());
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    const v = this.form.getRawValue();
    if (v.botcheck) return;

    const t = (k: string, p?: object) => this.t.instant(k, p) as string;
    const message = buildMessage(t('bookPage.message.heading', { hotel: HOTEL.name }), [
      [t('booking.checkIn'), v.checkIn],
      [t('booking.checkOut'), v.checkOut],
      [t('bookPage.nightsLabel'), this.nights()],
      [t('booking.room'), t(`rooms.types.${v.room}.name`)],
      [t('bookPage.roomCount'), v.roomCount],
      [t('bookPage.adults'), v.adults],
      [t('bookPage.children'), v.children],
      [t('form.name'), v.name],
      [t('form.phone'), v.phone],
      [t('form.email'), v.email],
      [t('form.message'), v.message],
    ]);

    // WhatsApp first, synchronously, so the browser doesn't block the new tab.
    this.enquiry.openWhatsApp(whatsappUrl(message));
    this.status.set('sending');
    setTimeout(() => document.getElementById('enquiry-status')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    this.emailResult.set(
      await this.enquiry.sendEmail({
        subject: t('bookPage.message.subject', { name: v.name, checkIn: v.checkIn }),
        name: v.name,
        phone: v.phone,
        email: v.email,
        message,
      }),
    );
    this.status.set('done');
  }

  protected reset(): void {
    this.status.set('idle');
    this.submitted.set(false);
    this.form.patchValue({ message: '' });
    this.form.markAsUntouched();
  }
}
