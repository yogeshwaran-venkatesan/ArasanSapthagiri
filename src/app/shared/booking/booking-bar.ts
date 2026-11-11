import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ROOM_TYPES } from '../../core/hotel.config';
import { Icon } from '../ui/icon';
import { addDays, nightsBetween, toIsoDate } from './dates';

/**
 * Compact "check availability" bar for the hero. Check-out can never be on or
 * before check-in, and dates can't be in the past. Hands off to /book.
 */
@Component({
  selector: 'app-booking-bar',
  imports: [FormsModule, TranslatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <form (ngSubmit)="go()" class="grid gap-3 rounded-3xl bg-ivory/95 p-3 shadow-lift backdrop-blur sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:rounded-full lg:p-2 lg:pl-6">
      <label class="flex flex-col justify-center rounded-2xl px-3 py-1.5 lg:border-r lg:border-forest-900/10">
        <span class="text-xs font-bold tracking-wider text-gold-600 uppercase">{{ 'booking.checkIn' | translate }}</span>
        <input type="date" name="checkIn" [min]="today" [ngModel]="checkIn()" (ngModelChange)="setCheckIn($event)" required
               class="min-h-9 w-full bg-transparent text-base font-semibold text-forest-900 outline-none sm:text-sm" />
      </label>
      <label class="flex flex-col justify-center rounded-2xl px-3 py-1.5 lg:border-r lg:border-forest-900/10">
        <span class="text-xs font-bold tracking-wider text-gold-600 uppercase">{{ 'booking.checkOut' | translate }}
          @if (nights()) { <span class="normal-case tracking-normal text-muted">· {{ 'booking.nights' | translate: { count: nights() } }}</span> }</span>
        <input type="date" name="checkOut" [min]="minCheckOut()" [ngModel]="checkOut()" (ngModelChange)="checkOut.set($event)" required
               class="min-h-9 w-full bg-transparent text-base font-semibold text-forest-900 outline-none sm:text-sm" />
      </label>
      <label class="flex flex-col justify-center rounded-2xl px-3 py-1.5 sm:col-span-2 lg:col-span-1">
        <span class="text-xs font-bold tracking-wider text-gold-600 uppercase">{{ 'booking.room' | translate }}</span>
        <select name="room" [ngModel]="room()" (ngModelChange)="room.set($event)"
                class="min-h-9 w-full bg-transparent text-base font-semibold text-forest-900 outline-none sm:text-sm">
          @for (r of rooms; track r.id) {
            <option [value]="r.id">{{ 'rooms.types.' + r.id + '.name' | translate }}</option>
          }
        </select>
      </label>
      <button type="submit" class="btn btn-forest sm:col-span-2 lg:col-span-1 lg:px-8" [disabled]="!nights()">
        <app-icon name="calendar" class="size-4" /> {{ 'booking.check' | translate }}
      </button>
    </form>
  `,
})
export class BookingBar {
  private readonly router = inject(Router);
  protected readonly rooms = ROOM_TYPES;
  protected readonly today = toIsoDate(new Date());

  protected readonly checkIn = signal(this.today);
  protected readonly checkOut = signal(addDays(this.today, 1));
  protected readonly room = signal<string>(ROOM_TYPES[0].id);
  protected readonly minCheckOut = computed(() => addDays(this.checkIn() || this.today, 1));
  protected readonly nights = computed(() => nightsBetween(this.checkIn(), this.checkOut()));

  /** Moving check-in past check-out pushes check-out to the next day. */
  setCheckIn(value: string): void {
    this.checkIn.set(value);
    if (nightsBetween(value, this.checkOut()) === 0) this.checkOut.set(addDays(value, 1));
  }

  go(): void {
    if (!this.nights()) return;
    void this.router.navigate(['/book'], {
      queryParams: { in: this.checkIn(), out: this.checkOut(), room: this.room() },
    });
  }
}
