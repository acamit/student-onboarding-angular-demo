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
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/Entities/Student.js';

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
  disableFields:boolean = false;
  requiredDocuments:Object[]= [];
  editableStudent =null;//= new Student();
  message:string = "";
  alertType:string="";
  constructor(private fb: FormBuilder, private _studentService:StudentInfoService, private router: Router,
    private route: ActivatedRoute) {}
  ngOnInit(){
    this.getDocuments(null);
    this.route.paramMap.subscribe(params=>{
      const id  = +params.get('id');
      if(id){//either edit or view
        if(this.router.url.includes('/view/'))
        {
          this.disableFields = true;
        }
        this._studentService.getStudent(id).subscribe((result)=>{
          this.editableStudent = result;
          this.setEditableValues(this.editableStudent);// setting value in form
        }, 
        (error)=>{
          //redirect to 404
          console.log(error);
        });
      }
    })
  }
/**
   * getter for name
   */
  get name() {
    return this.registrationForm.get("name");
  }

  /**
   * getter for fatherName
   */
  get fatherName() {
    return this.registrationForm.get("fatherName");
  }

  /**
   * getter for fatherName
   */
  get motherName() {
    return this.registrationForm.get("motherName");
  }

  /**
   * getter for category
   */
  get category() {
    return this.registrationForm.get("category");
  }

  /**
   * getter for dateOfBirth
   */
  get dateOfBirth() {
    return this.registrationForm.get("dateOfBirth");
  }

  /**
   * getter for lastMarks
   */
  get lastClassScore() {
    return this.registrationForm.get("lastClassScore");
  }

  get documents() {
    return this.registrationForm.get('documents') as FormArray;
  }
  // getErrorMessage() {
  //   return this.registrationForm.value.email.hasError('required') ? 'You must enter a value' :
  //     this.registrationForm.value.email.hasError('email') ? 'Not a valid email' : '';
  // }
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
  setEditableValues(student:Student){
    this.registrationForm.patchValue({
        name: student.name,
        category:  student.category,
        fatherName:  student.fatherName,
        motherName:  student.motherName,
        dateOfBirth: student.dateOfBirth,
        lastClassScore:  student.lastClassScore,
    });
    this.category.markAsDirty();// to make the custom validator active
    this.registrationForm.setControl('documents', this.setDocuments(student.documents))// to set the form array
    if(this.disableFields) // in case of view fields
    {
      this.makingFieldsDisable(); // making fiels disable
    }
  }
    /**
   * 
   * @param docs docs array which needs to be populated to form array
   * Function used to populate form array
   */
  setDocuments(docs):FormArray{
    const formArray = new FormArray([]); 
    formArray.controls = [];
    docs.map((o, i) => {
      const control = new FormControl(o); // if first item set to true, else false
      (formArray as FormArray).push(control);//filling the form array with form controls
    });
    return formArray
  }

 /**
   * making the fields disabled for view route
   */
  makingFieldsDisable(){
    this.name.disable();
    this.fatherName.disable();
    this.motherName.disable();
    this.category.disable();
    this.dateOfBirth.disable();
    this.lastClassScore.disable();
    this.documents.controls
      .forEach(control => {
        control.disable();
      })
  }

  onSubmit(){
    this.extractDocumentIds();
    if(this.editableStudent){
      this._studentService.updateStudent(this.registrationForm.value, this.editableStudent.id).subscribe((result)=>{
        if(result.success){
          this.alertType = "alert alert-success";
          this.message = "Student updated";
          //this.registrationForm.reset();
        }else{
          this.alertType = "alert alert-danger";
          this.message = result.error;
        }
      })
    }else{
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
  extractDocumentIds ()
  {
    this.registrationForm.value.documents = this.documents.controls.map((control, index)=>{
      if(control.value){
        return this.requiredDocuments[index]["id"];
      }else{
        return null;
      }
    }).filter((c)=>c!=null);
  }
}