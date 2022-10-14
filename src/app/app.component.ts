import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ReplaySubject} from "rxjs";
import {Option} from "./model/option";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {faker} from "@faker-js/faker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  selectControl: FormControl = new FormControl();
  filterControl: FormControl = new FormControl();
  placeholder: string = "Search or search";
  selectedValue: string = '';
  filter: string = '';
  options: Option[] = [];
  filteredList: Option[] = [];
  filteredSearch: ReplaySubject<Option[]> = new ReplaySubject<Option[]>(1);
  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewport: CdkVirtualScrollViewport | undefined;

  constructor() {
  }

  ngOnInit(): void {
    for (let i = 0; i < 1000; ++i) {
      const name = faker.name.firstName();
      const label: string = `${i + 1} - ${name}`;
      this.options.push({
        label: label,
        value: name
      });
    }

    this.filteredSearch.next(this.options);

    this.filterControl
      .valueChanges
      .subscribe({
        next: () => {
          this.filter = this.filterControl.value.toLowerCase();
          this.filteredList = this.options.filter(
            option => option.label.toLowerCase().indexOf(this.filter) >= 0
          );
          this.filteredSearch.next(this.filteredList);
        }
      });
  }

  openedChanged($event: any) {
    if ($event) {
      const scrollIndex = this.filteredList.length > 0 ?
        this.filteredList.findIndex(option => option.value === this.selectedValue)
        : 0;
      this.cdkVirtualScrollViewport?.scrollToIndex(scrollIndex);
      this.cdkVirtualScrollViewport?.checkViewportSize();
    }
  }

  selectionChange() {
    this.selectedValue = this.selectControl.value;
  }
}
