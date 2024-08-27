import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { Subject, fromEvent } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-search-input",
  templateUrl: "./search-input.component.html",
  styleUrls: ["./search-input.component.scss"],
})
export class SearchInputComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data!: string;
  @Output() dataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() search: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild("searchInput") searchInput!: ElementRef;

  unsubscribe: Subject<void> = new Subject();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput!.nativeElement, 'input')
      .pipe(debounceTime(500), takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.dataChange.emit(this.data);
        this.search.emit();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.complete();
  }
}
