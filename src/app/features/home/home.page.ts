import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FACILITIES, HOTEL, mapsDirectionsUrl, mapsEmbedUrl, NEARBY, ROOM_TYPES } from '../../core/hotel.config';
import { IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { BookingBar } from '../../shared/booking/booking-bar';
import { Icon } from '../../shared/ui/icon';
import { SectionHeading } from '../../shared/ui/section-heading';
import { SafeUrlPipe } from '../../shared/ui/safe-url.pipe';

@Component({
  selector: 'app-home-page',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Icon, SectionHeading, BookingBar, SafeUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
})
export class HomePage {
  protected readonly hotel = HOTEL;
  protected readonly img = IMAGES;
  protected readonly rooms = ROOM_TYPES;
  protected readonly facilities = FACILITIES.slice(0, 8);
  protected readonly nearby = NEARBY;
  protected readonly mapUrl = mapsEmbedUrl();
  protected readonly directions = mapsDirectionsUrl();
  protected readonly highlights = [
    { icon: 'bed', value: '31', key: 'home.highlights.rooms' },
    { icon: 'sunset', value: '', key: 'home.highlights.rooftop' },
    { icon: 'wifi', value: '', key: 'home.highlights.wifi' },
    { icon: 'bell', value: '24×7', key: 'home.highlights.service' },
  ];

  constructor() {
    pageSeo('home', '/');
  }
}
