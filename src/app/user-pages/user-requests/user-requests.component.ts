import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Observable, debounceTime, startWith, switchMap, tap } from "rxjs";
import { Request } from "src/app/admin-pages/requests/models/request";
import { RequestStatus } from "src/app/admin-pages/requests/models/request-status.enum";
import { EmployeeApiService } from "../../services/api/employee-api.service";
import { RequestApiService } from "../../services/api/request-api.service";
import { AuthenticationService } from "../../services/authentication.service";
import { CreateRequestComponent } from "../create-request/create-request.component";


@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.scss']
})
export class UserRequestsComponent implements OnInit {
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
  displayedColumns: string[] = ['reason', 'startDate', 'endDate', 'status'];
  filter!: string;

  requests?: Array<Request>;

  data!: Array<Request>;
  filteredData!: Array<Request>;

  constructor(
    private dialog: MatDialog,
    private requestApiService: RequestApiService,
    private employeeApiService: EmployeeApiService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getRequests().subscribe();
  }

  onFilter(): void {
    this.filteredData = this.requests!.filter(x => {
      return x.reason.includes(this.filter)
        || x.employeeDTO.email.includes(this.filter)
        || x.startDate.toString().includes(this.filter)
        || x.endDate.toString().includes(this.filter)
        || x.status.includes(this.filter)
    })
    this._paginator?.page.emit({ pageIndex: 0, pageSize: this._paginator.pageSize, length: this.filteredData.length });
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateRequestComponent);

    dialogRef.afterClosed().subscribe((result: Request) => {
      if (result) {
        this.spinnerVisible = true;
        result.employeeDTO.employeeID = this.authService.currentUser.value!.id;
        result.status = RequestStatus.InProcess;
        this.requestApiService.insert(result).pipe(switchMap(() => this.getRequests())).subscribe();
      }
    });
  }

  private getRequests(): Observable<Array<Request>> {
    return this.employeeApiService.getRequests(this.authService!.currentUser!.value!.id).pipe(tap((data) => {
      this.requests = data;
      this.filteredData = data;
      this.spinnerVisible = false;
    }));
  }
}
