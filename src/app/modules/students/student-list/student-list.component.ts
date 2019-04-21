import { Component, OnInit } from '@angular/core';
import { StudentInfoService } from '../../../services/student-info/student-info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalConfirmAutofocus } from '../modal-focus/modal-focus.component';
import { Student } from 'src/app/Entities/Student';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  categoryFilter:string = "All";
  searchFilter:string = "";
  constructor(private _studentService:StudentInfoService, private _modalService: NgbModal) { }
  students :Student[];
  ngOnInit() {
    this.students = this._studentService.getStudents();
  }
  setCategoryFilter(filter:string){
    this.categoryFilter = filter;
  }
  DeleteStudent(id){
   var modalRef =  this._modalService.open(NgbdModalConfirmAutofocus);
   modalRef.componentInstance.student = this.students.filter(x=>x.id==id)[0];
   modalRef.result.then(x=>{
     if(x=='Confirm'){
       this._studentService.DeleteStudent(id).subscribe((result)=>{
          this.students = this._studentService.getStudents();
          alert("deleted");
       }, (error)=>{alert(error)});
     }
   }).catch(x=>{
    if(x=='Cancel'){
      //alert("Cancelled");
    }else{
      console.log(x);
    }
   });
   
  }
}
