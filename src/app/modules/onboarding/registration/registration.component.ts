import {
  Component
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from '@angular/forms';
import Documents from '../../../../assets/Documents.json';
import { StudentInfoService } from '../../../services/student-info/student-info.service.js';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
 
  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl('Domestic'),
    documents: this.fb.array([]),
    dateOfBirth: new FormControl(''),
    fatherName: new FormControl(''),
    motherName: new FormControl(''),
    lastClassScore: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)])
  });
  requiredDocuments:Object[]= [];
  message:string = "";
  alertType:string="";
  constructor(private fb: FormBuilder, private _studentService:StudentInfoService) {}
  ngOnInit(){
    this.getDocuments(null);
  }

  get documents() {
    return this.registrationForm.get('documents') as FormArray;
  }
  getErrorMessage() {
    return this.registrationForm.value.email.hasError('required') ? 'You must enter a value' :
      this.registrationForm.value.email.hasError('email') ? 'Not a valid email' : '';
  }
  getDocuments($event) {
    while (this.documents.length != 0) {
      this.documents.removeAt(0);
    }
    this.requiredDocuments.splice(0, this.requiredDocuments.length);
    Documents.forEach((d) => {
      this.requiredDocuments.push(d);
      if((this.registrationForm.value.category == "Domestic" && d.requiredDomestic)||
        (this.registrationForm.value.category == "International" &&  d.requiredInternational)){
        this.documents.push(new FormControl('', [Validators.required]));
      }else{
        this.documents.push(new FormControl(''));
      }
    });

  }

  onSubmit(){
    this.registrationForm.value.documents = this.documents.controls.map((control, index)=>{
      if(control.value){
        return this.requiredDocuments[index]["id"];
      }else{
        return null;
      }
    }).filter((c)=>c!=null);
    this._studentService.registerStudent(this.registrationForm.value).subscribe((result)=>{
      if(result.success){
        this.alertType = "alert alert-success";
        this.message = "Student Saved";
        this.registrationForm.reset();
      }else{
        this.alertType = "alert alert-danger";
        this.message = result.error;
      }
    });
  }
}
