import { GifsService } from './../../../gifs/services/gifs.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(private gifsService: GifsService) {}

  get tags(): string[] {
    return this.gifsService.tagsHistory;
  }

  // searchTag(newTag: string) {
  searchTag(tag: string): void {
    this.gifsService.searchTag(tag);
  }
}
