import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog ,MatDialogConfig} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentService } from 'src/app/shared/department.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { EmployeeService } from 'src/app/shared/employee.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { EmployeeComponent } from '../employee/employee.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  listData: MatTableDataSource<any>;
  searchKey: string;
  displayedColumns: string[] = ['fullName', 'email', 'mobile', 'city','departmentName','actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) pagintor: MatPaginator;
  constructor(public empService: EmployeeService,
              public departService: DepartmentService,
              public dialog:MatDialog,
              public notificationService:NotificationService,
              public dialogService:DialogService
  ) { }

  ngOnInit(){
    this.empService.getEmployees()
    .subscribe(list=>{
      let array=list.map(
        item => {
          let departmentName = this.departService.getDepartmentName(item.payload.val()
          ['department'])
        return {
            $key: item.key,
            departmentName,
            ...item.payload.val()
          }
        }
        )
      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.pagintor;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(
          ele => {
            return ele != 'actions' &&
              data[ele].toLowerCase().
                indexOf(filter) != -1;
          }
        )
      }
    })

  }
  onSearchClear() {
    this.searchKey ="";
    this.applyFilter();
  }
  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }
  onCreate() {
    this.empService.initializeFormGroup();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent,dialogConfig)
  }
  onEdit(row) {
    this.empService.populateForm(row);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent,dialogConfig)
  }
  onDelete($key) {
  //   if (confirm('Are you sure to delete this record ?')) {
  //     this.empService.deleteEmployee($key);
  //     this.notificationService.warn("Record has been Deleted.")
  // }
    this.dialogService.openConfirmDialog("Are you Sure to Delete?")
      .afterClosed().subscribe(
      res=>{
          if (res) {
            this.empService.deleteEmployee($key);
            this.notificationService.warn("Record Deleted.")
        }
      }
    )

}
}
