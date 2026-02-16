import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss'
})
export class ImageViewerComponent implements OnChanges {
  @Input() images: { path: string }[] = [];
  
  currentIndex: number = 0;
  
  ngOnChanges() {
    this.currentIndex = 0; // Reset to first image when images change
  }
  
  nextImage() {
    if (this.images && this.images.length > 1) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }
  
  prevImage() {
    if (this.images && this.images.length > 1) {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }
  
  selectImage(index: number) {
    this.currentIndex = index;
  }
  
  getCurrentImageUrl(): string {
    if (!this.images || this.images.length === 0) {
      return 'assets/images/placeholder.png';
    }
    return this.images[this.currentIndex].path;
  }
}