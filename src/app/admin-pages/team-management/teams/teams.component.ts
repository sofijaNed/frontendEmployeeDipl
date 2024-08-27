import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EMPTY, Observable, catchError, debounceTime, startWith, switchMap, tap } from 'rxjs';
import { ConfirmDialogData } from 'src/app/confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { TeamApiService } from 'src/app/services/api/team-api.service';
import { CreateTeamComponent } from '../create-team/create-team.component';
import { EditTeamComponent } from '../edit-team/edit-team.component';
import { Team } from '../models/team';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
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
  displayedColumns: string[] = ['id', 'name', 'maxNumber', 'tableActions'];
  filter!: string;

  teams: Array<Team> = new Array<Team>;

  data!: Array<Team>;
  filteredData!: Array<Team>;

  constructor(
    private dialog: MatDialog,
    private teamApiService: TeamApiService
  ) { }

  ngOnInit(): void {
    this.getTeams().subscribe();
  }

  onFilter(): void {
    this.filteredData = this.teams.filter(x => {
      return x.teamID.toString().includes(this.filter)
        || x.teamName.includes(this.filter)
        || x.maxNumber.toString().includes(this.filter)
    })
    this._paginator?.page.emit({ pageIndex: 0, pageSize: this._paginator.pageSize, length: this.filteredData.length });
  }

  edit(team: Team): void {
    const dialogRef = this.dialog.open(EditTeamComponent, {
      data: team,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.teamApiService.update(result).pipe(switchMap(() => this.getTeams())).subscribe();
      }
    });
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateTeamComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.teamApiService.insert(result).pipe(switchMap(() => this.getTeams())).subscribe();
      }
    });
  }

  delete(team: Team): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { data: { title: 'Confirm Delete', message: `Are you sure you want to delete ${team.teamName}` } as ConfirmDialogData })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.teamApiService.deleteTeam(team.teamID).pipe(switchMap(() => this.getTeams()),
          catchError(() => {
            this.spinnerVisible = false
            return EMPTY
          })).subscribe();
      }
    });
  }

  private getTeams(): Observable<Array<Team>> {
    return this.teamApiService.getAll().pipe(tap((data) => {
      this.teams = data;
      this.filteredData = data;
      this.spinnerVisible = false;
    }));
  }
}
