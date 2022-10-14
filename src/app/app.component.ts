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
  options: Option[] = [];
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
          const filteredList: Option[] = this.options.filter(
            option => option.label.toLowerCase().indexOf(this.filterControl.value.toLowerCase()) >= 0
          );
          this.filteredSearch.next(filteredList);
        }
      });
  }

  openedChanged($event: any) {
    this.cdkVirtualScrollViewport?.scrollToIndex(0);
    this.cdkVirtualScrollViewport?.checkViewportSize();
  }
}
