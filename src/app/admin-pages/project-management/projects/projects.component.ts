import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EMPTY, Observable, catchError, debounceTime, startWith, switchMap, tap } from 'rxjs';
import { ConfirmDialogData } from 'src/app/confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { ProjectApiService } from 'src/app/services/api/project-api.service';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { EditProjectComponent } from '../edit-project/edit-project.component';
import { Project } from '../models/project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
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
  displayedColumns: string[] = ['name', 'description', 'startDate', 'endDate', 'team', 'tableActions'];
  filter!: string;

  projects: Array<Project> = new Array<Project>;

  data!: Array<Project>;
  filteredData!: Array<Project>;

  constructor(
    private dialog: MatDialog,
    private projectApiService: ProjectApiService
  ) { }

  ngOnInit(): void {
    this.getProjects().subscribe();
  }

  onFilter(): void {
    this.filteredData = this.projects.filter(x => {
      return x.projectName.includes(this.filter)
        || x.description.includes(this.filter)
        || x.startDate.toString().includes(this.filter)
        || x.endDate.toString().includes(this.filter)
        || x.teamDTO.teamName.includes(this.filter)
    })
    this._paginator?.page.emit({ pageIndex: 0, pageSize: this._paginator.pageSize, length: this.filteredData.length });
  }

  edit(project: Project): void {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      width: '1000px',
      data: project,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.projectApiService.update(result).pipe(switchMap(() => this.getProjects())).subscribe();
      }
    });
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateProjectComponent, { width: '1000px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.projectApiService.insert(result).pipe(switchMap(() => this.getProjects())).subscribe();
      }
    });
  }

  delete(project: Project): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { data: { title: 'Confirm Delete', message: `Are you sure you want to delete ${project.projectName}` } as ConfirmDialogData })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerVisible = true;
        this.projectApiService.deleteProject(project.projectID).pipe(switchMap(() => this.getProjects()),
          catchError(() => {
            this.spinnerVisible = false
            return EMPTY
          })).subscribe();
      }
    });
  }

  private getProjects(): Observable<Array<Project>> {
    return this.projectApiService.getAll().pipe(tap((data) => {
      this.projects = data;
      this.filteredData = data;
      this.spinnerVisible = false;
    }));
  }
}
