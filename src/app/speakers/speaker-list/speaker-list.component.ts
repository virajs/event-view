import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/subscription';

import { FilterTextService, FilterTextComponent, Speaker, SpeakerService } from '../../../app/shared';

@Component({
  moduleId: module.id,
  selector: 'ev-speaker-list',
  templateUrl: 'speaker-list.component.html',
  styleUrls: ['speaker-list.component.css'],
})
export class SpeakerListComponent implements OnDestroy, OnInit {
  private dbResetSubscription: Subscription;

  speakers: Speaker[] = [];
  filteredSpeakers = this.speakers;
  @ViewChild(FilterTextComponent) filterComponent: FilterTextComponent;

  constructor(private speakerService: SpeakerService,
    private filterService: FilterTextService) { }

  filterChanged(searchText: string) {
    this.filteredSpeakers = this.filterService.filter(searchText, ['id', 'name', 'twitter'], this.speakers);
  }

  getSpeakers() {
    this.speakers = [];

    this.speakerService.getSpeakers()
      .subscribe(speakers => {
        this.speakers = this.filteredSpeakers = speakers;
        this.filterComponent.clear();
      });
  }

  ngOnDestroy() {
    this.dbResetSubscription.unsubscribe();
  }

  ngOnInit() {
    componentHandler.upgradeDom();
    this.getSpeakers();
    this.dbResetSubscription = this.speakerService.onDbReset
      .subscribe(() => this.getSpeakers());
  }

  trackBySpeakers(index: number, speaker: Speaker) {
    return speaker.id;
  }
}