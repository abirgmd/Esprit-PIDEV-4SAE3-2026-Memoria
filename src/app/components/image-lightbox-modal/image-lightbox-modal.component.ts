import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-lightbox-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-lightbox-modal.component.html',
  styleUrls: ['./image-lightbox-modal.component.css']
})
export class ImageLightboxModalComponent {
  @Input() imageUrl: string = '';
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('lightbox-overlay')) {
      this.close.emit();
    }
  }

  onClose() {
    this.close.emit();
  }

  downloadImage() {
    const a = document.createElement('a');
    a.href = this.imageUrl;
    a.download = this.imageUrl.split('/').pop() || 'image';
    a.target = '_blank';
    a.click();
  }
}
