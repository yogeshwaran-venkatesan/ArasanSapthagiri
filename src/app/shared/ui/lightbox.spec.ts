import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GalleryImage } from '../../core/images';
import { Lightbox } from './lightbox';

describe('Lightbox', () => {
  const images: GalleryImage[] = [
    { src: 'images/a.webp', alt: 'a', category: 'rooms' },
    { src: 'images/b.webp', alt: 'b', category: 'rooms' },
    { src: 'images/c.webp', alt: 'c', category: 'dining' },
  ];

  async function open(index: number) {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideTranslateService()] });
    const fixture = TestBed.createComponent(Lightbox);
    fixture.componentRef.setInput('images', images);
    fixture.componentInstance.index.set(index);
    await fixture.whenStable();
    return { fixture, box: fixture.componentInstance, dialog: fixture.nativeElement.querySelector('dialog') as HTMLDialogElement };
  }

  it('opens as a modal dialog showing the chosen photo', async () => {
    const { fixture, dialog } = await open(1);
    expect(dialog.open).toBeTrue();
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe('images/b.webp');
    fixture.componentInstance.close();
  });

  it('wraps around in both directions', async () => {
    const { box } = await open(2);
    box.step(1);
    expect(box.index()).toBe(0);
    box.step(-1);
    expect(box.index()).toBe(2);
    box.close();
  });

  it('closes and restores page scrolling', async () => {
    const { fixture, box, dialog } = await open(0);
    expect(document.documentElement.style.overflow).toBe('hidden');
    box.close();
    await fixture.whenStable();
    expect(dialog.open).toBeFalse();
    expect(document.documentElement.style.overflow).toBe('');
  });
});
