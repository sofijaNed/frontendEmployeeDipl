import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EMPTY, Observable, catchError, debounceTime, startWith, switchMap, tap } from 'rxjs';
import { ConfirmDialogData } from 'src/app/confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { RequestApiService } from 'src/app/services/api/request-api.service';
import { CreateTeamComponent } from '../../team-management/create-team/create-team.component';
import { Request } from '../models/request';
import { RequestStatus } from '../models/request-status.enum';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  _paginator?: MatPaginator;
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this._paginator = paginator;
      this._paginator.page.pipe(
        startWith({ pageIndex: 0, pageSize: this._paginator.pageSize, length: this.filteredData.length }),
        debounceTime(0))
        .subscribe((pageEvent: PageEvent) => {
          if (pageEvent.previousPageIndex != pageEvent.pageIndex) {
            const startIndex = pageEvent.pageIndex * pageEvent.pageSize
            this.data = [...this.filteredData].splice(startIndex, pageEvent.pageSize)
            return;
          }
          this.data = [...this.filteredData].splice(0, pageEvent.pageSize)
        })
    }
  };

  spinnerVisible = true;
  displayedColumns: string[] = ['employee', 'reason', 'startDate', 'endDate', 'status', 'tableActions'];
  filter!: string;

  requests: Array<Request> = new Array<Request>;

  data!: Array<Request>;
  filteredData!: Array<Request>;

  constructor(
    private dialog: MatDialog,
    private requestApiService: RequestApiService
  ) { }

  ngOnInit(): void {
    this.getRequests().subscribe();
  }

  onFilter(): void {
    this.filteredData = this.requests.filter(x => {
      return x.reason.includes(this.filter)
        || x.employeeDTO.email.includes(this.filter)
        || x.startDate.toString().includes(this.filter)
        || x.endDate.toString().includes(this.filter)
        || x.status.includes(this.filter)
    })
    this._paginator?.page.emit({ pageIndex: 0, pageSize: this._paginator.pageSize, length: this.filteredData.length });
  }

  edit(request: Request): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { data: { title: 'Accept Request', message: `Accept request for employee ${request.employeeDTO.email}` } as ConfirmDialogData });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        request.status = RequestStatus.Accepted;
        this.requestApiService.update(request).pipe(switchMap(() => this.getRequests())).subscribe();
      }
    });
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateTeamComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.requestApiService.insert(result).pipe(switchMap(() => this.getRequests())).subscribe();
      }
    });
  }

  delete(requst: Request): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { data: { title: 'Confirm Delete', message: `Are you sure you want to delete request from ${requst.employeeDTO.email}` } as ConfirmDialogData })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.requestApiService.deleteRequest(requst.requestID).pipe(switchMap(() => this.getRequests()),
          catchError(() => {
            this.spinnerVisible = false
            return EMPTY
          })).subscribe();
      }
    });
  }

  private getRequests(): Observable<Array<Request>> {
    return this.requestApiService.getAll().pipe(tap((data) => {
      this.requests = data;
      this.filteredData = data;
      this.spinnerVisible = false;
    }));
  }
}
