import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from 'src/app/shared/department.service';
import { EmployeeService } from 'src/app/shared/employee.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
// departments=[
//   {id:1,name:'Angular'},
//   {id:2,name:'React'},
//   {id:3,name:'Node'},
//   {id:4,name:'Bootstrap'},
//   {id:5,name:'Firebase'},
// ]
  constructor(public empService:EmployeeService,
    public deptService:DepartmentService,
    public notificationService: NotificationService,
    public dialogRef:MatDialogRef<EmployeeComponent>) { }

  ngOnInit(){
    this.empService.getEmployees();
  }
  onClear(){
  this.empService.form.reset();
    this.empService.initializeFormGroup();
    this.dialogRef.close();
}
onSubmit(){
  if (this.empService.form.valid) {
    if (!this.empService.form.get('$key').value)
      this.empService.insertEmployee(this.empService.form.value);
    else
      this.empService.updateEmployee(this.empService.form.value);
    this.empService.form.reset();
   
    this.empService.initializeFormGroup();
   this.notificationService.success('Record Inserted Successfully');
   this.onClear();
 }
}
  
}
