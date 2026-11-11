import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { buildMessage, EmailResult, EnquiryService } from '../../core/enquiry';
import { HOTEL, mapsDirectionsUrl, mapsEmbedUrl, whatsappUrl } from '../../core/hotel.config';
import { IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { phoneValidator } from '../../shared/forms/validators';
import { Icon } from '../../shared/ui/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { SafeUrlPipe } from '../../shared/ui/safe-url.pipe';

export const CONTACT_TOPICS = ['general', 'rooms', 'conference', 'travel'] as const;

@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule, TranslatePipe, Icon, PageHero, SafeUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero [image]="img.reception" [eyebrow]="'contactPage.eyebrow' | translate" [title]="'contactPage.title' | translate"
                   [lead]="'contactPage.lead' | translate" />

    <!-- Ways to reach us -->
    <section class="relative z-10 -mt-12">
      <ul class="container-x grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        @for (c of channels; track c.key) {
          <!-- Email and address are long: give them a full row on phones. -->
          <li [class.col-span-2]="c.key === 'email' || c.key === 'visit'" class="sm:col-span-1">
            <a [href]="c.href" [attr.target]="c.external ? '_blank' : null" [attr.rel]="c.external ? 'noopener' : null"
               class="group flex h-full flex-col rounded-3xl bg-ivory p-4 shadow-soft sm:p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <span class="grid size-10 place-items-center rounded-2xl bg-forest-800 sm:size-12 text-gold-300 transition group-hover:bg-gold-500 group-hover:text-forest-900">
                <app-icon [name]="c.icon" class="size-6" />
              </span>
              <span class="mt-3 text-xs font-bold tracking-widest text-gold-600 uppercase sm:mt-4">{{ 'contactPage.channels.' + c.key | translate }}</span>
              <span class="mt-1 text-sm font-semibold [overflow-wrap:anywhere] text-forest-900 sm:text-base">{{ c.value ?? ('contactPage.channels.' + c.key + 'Value' | translate) }}</span>
            </a>
          </li>
        }
      </ul>
    </section>

    <section class="py-14 sm:py-20">
      <div class="container-x grid gap-10 lg:grid-cols-2">
        <!-- Form -->
        @if (status() === 'idle') {
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="min-w-0 rounded-[2rem] bg-white p-5 shadow-soft sm:p-10">
            <h2 class="section-title">{{ 'contactPage.formTitle' | translate }}</h2>
            <p class="mt-3 text-muted">{{ 'contactPage.formLead' | translate }}</p>
            <div class="mt-8 grid gap-5 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label for="c-name" class="field-label">{{ 'form.name' | translate }} *</label>
                <input id="c-name" class="field" formControlName="name" autocomplete="name" [attr.aria-invalid]="invalid('name')" />
                @if (invalid('name')) { <p class="field-error">{{ 'form.errors.name' | translate }}</p> }
              </div>
              <div>
                <label for="c-phone" class="field-label">{{ 'form.phone' | translate }} *</label>
                <input id="c-phone" type="tel" class="field" formControlName="phone" autocomplete="tel" placeholder="+91 98765 43210" [attr.aria-invalid]="invalid('phone')" />
                @if (invalid('phone')) { <p class="field-error">{{ 'form.errors.phone' | translate }}</p> }
              </div>
              <div>
                <label for="c-email" class="field-label">{{ 'form.email' | translate }} <span class="font-normal text-muted">({{ 'form.optional' | translate }})</span></label>
                <input id="c-email" type="email" class="field" formControlName="email" autocomplete="email" [attr.aria-invalid]="invalid('email')" />
                @if (invalid('email')) { <p class="field-error">{{ 'form.errors.email' | translate }}</p> }
              </div>
              <div class="sm:col-span-2">
                <label for="c-topic" class="field-label">{{ 'contactPage.topic' | translate }}</label>
                <select id="c-topic" class="field" formControlName="topic">
                  @for (t of topics; track t) { <option [value]="t">{{ 'contactPage.topics.' + t | translate }}</option> }
                </select>
              </div>
              <div class="sm:col-span-2">
                <label for="c-message" class="field-label">{{ 'form.message' | translate }} *</label>
                <textarea id="c-message" rows="5" class="field resize-y" formControlName="message" [attr.aria-invalid]="invalid('message')"></textarea>
                @if (invalid('message')) { <p class="field-error">{{ 'form.errors.message' | translate }}</p> }
              </div>
              <input type="text" formControlName="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />
            </div>
            <button type="submit" class="btn btn-gold mt-8 w-full sm:w-auto sm:px-8">
              <app-icon name="send" class="size-4" /> {{ 'contactPage.submit' | translate }}
            </button>
          </form>
        } @else {
          <div id="enquiry-status" class="grid place-items-center rounded-[2rem] bg-white p-10 text-center shadow-soft" role="status" aria-live="polite">
            @if (status() === 'sending') {
              <p class="text-muted">{{ 'form.sending' | translate }}</p>
            } @else {
              <div>
                <span class="mx-auto grid size-16 place-items-center rounded-full bg-forest-50 text-forest-700"><app-icon name="check" class="size-8" /></span>
                <h2 class="section-title mt-6">{{ 'contactPage.done' | translate }}</h2>
                <p class="mx-auto mt-4 max-w-md text-muted">{{ 'bookPage.done.whatsapp' | translate }}</p>
                @if (emailResult() === 'sent') { <p class="mt-2 text-sm text-forest-700">{{ 'form.emailSent' | translate }}</p> }
                @if (emailResult() === 'failed') { <p class="mt-2 text-sm font-semibold text-[#b42318]">{{ 'form.emailFailed' | translate }}</p> }
                <button type="button" (click)="reset()" class="btn btn-ghost mt-8">{{ 'contactPage.again' | translate }}</button>
              </div>
            }
          </div>
        }

        <!-- Map + address -->
        <div class="flex flex-col overflow-hidden rounded-[2rem] bg-forest-900 text-ivory shadow-lift">
          <iframe [src]="mapUrl | safeUrl" class="h-80 w-full flex-1 border-0 lg:h-auto lg:min-h-[22rem]" loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade" [title]="'home.location.mapTitle' | translate"></iframe>
          <div class="grid gap-4 p-8 sm:grid-cols-2">
            <address class="not-italic">
              <p class="eyebrow !text-gold-300">{{ 'locationPage.address' | translate }}</p>
              <p class="mt-2 text-sm leading-relaxed text-ivory/80">{{ hotel.address.line1 }}, {{ hotel.address.line2 }},<br />{{ hotel.address.city }} – {{ hotel.address.pin }}<br />
                <span class="text-ivory/60">{{ 'footer.landmark' | translate }}</span></p>
            </address>
            <div>
              <p class="eyebrow !text-gold-300">{{ 'contactPage.fax' | translate }}</p>
              <p class="mt-2 text-sm text-ivory/80">{{ hotel.fax }}</p>
              <a [href]="directions" target="_blank" rel="noopener" class="btn btn-gold mt-4"><app-icon name="directions" class="size-4" /> {{ 'common.directions' | translate }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactPage {
  private readonly t = inject(TranslateService);
  private readonly enquiry = inject(EnquiryService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly hotel = HOTEL;
  protected readonly img = IMAGES;
  protected readonly topics = CONTACT_TOPICS;
  protected readonly mapUrl = mapsEmbedUrl();
  protected readonly directions = mapsDirectionsUrl();

  protected readonly channels: { key: string; icon: string; href: string; value?: string; external?: boolean }[] = [
    { key: 'call', icon: 'phone', href: HOTEL.phoneHref, value: HOTEL.phone },
    { key: 'whatsapp', icon: 'whatsapp', href: whatsappUrl(''), external: true },
    { key: 'email', icon: 'mail', href: 'mailto:' + HOTEL.email, value: HOTEL.email },
    { key: 'visit', icon: 'pin', href: mapsDirectionsUrl(), value: `${HOTEL.address.line2}, ${HOTEL.address.city}`, external: true },
  ];

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    phone: ['', [Validators.required, phoneValidator]],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    topic: ['general' as string],
    message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    botcheck: [''],
  });

  protected readonly submitted = signal(false);
  protected readonly status = signal<'idle' | 'sending' | 'done'>('idle');
  protected readonly emailResult = signal<EmailResult>('skipped');

  constructor() {
    pageSeo('contact', '/contact', { image: IMAGES.reception });
  }

  protected invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || this.submitted());
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
    const topic = t('contactPage.topics.' + v.topic);
    const message = buildMessage(t('contactPage.message.heading', { hotel: HOTEL.name }), [
      [t('contactPage.topic'), topic],
      [t('form.name'), v.name],
      [t('form.phone'), v.phone],
      [t('form.email'), v.email],
      [t('form.message'), v.message],
    ]);
    this.enquiry.openWhatsApp(whatsappUrl(message));
    this.status.set('sending');
    setTimeout(() => document.getElementById('enquiry-status')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    this.emailResult.set(
      await this.enquiry.sendEmail({ subject: t('contactPage.message.subject', { topic, name: v.name }), name: v.name, phone: v.phone, email: v.email, message }),
    );
    this.status.set('done');
  }

  protected reset(): void {
    this.form.reset();
    this.submitted.set(false);
    this.status.set('idle');
  }
}
