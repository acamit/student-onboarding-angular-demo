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
import {
  StudentInfoService
} from '../../../services/student-info/student-info.service.js';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Student
} from 'src/app/Entities/Student.js';
import {
  documentsValidator
} from 'src/app/validators/documents-validator/documents-validator.directive.js';
import RegDocument from 'src/app/Entities/Document.js';
import {
  CATEGORY_DOMESTIC,
  CATEGORY_INTERNATIONAL
} from 'src/app/data/constants.js';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl(CATEGORY_DOMESTIC, [Validators.required]),
    documents: this.fb.array([]),
    dateOfBirth: new FormControl('', [Validators.required]),
    fatherName: new FormControl('', [Validators.required]),
    motherName: new FormControl('', [Validators.required]),
    lastClassScore: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)])
  }, [documentsValidator()]);
  disableFields: boolean = false;
  requiredDocuments: RegDocument[] = [];
  editableStudent = null; //= new Student();
  message: string = "";
  alertType: string = "";
  constructor(private fb: FormBuilder, private _studentService: StudentInfoService, private router: Router,
    private route: ActivatedRoute) {}
  ngOnInit() {
    this.getDocuments(null);
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) { //either edit or view
        if (this.router.url.includes('/view/')) {
          this.disableFields = true;
        }
        this._studentService.getStudent(id).subscribe((result) => {
            this.editableStudent = result;
            this.setEditableValues(this.editableStudent);
          },
          (error) => {
            //use logger service to log error to server. and navigate to error page.
            this.router.navigate(['/error/404'])
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
      if ((this.registrationForm.value.category == CATEGORY_DOMESTIC && d.requiredDomestic) ||
        (this.registrationForm.value.category == CATEGORY_INTERNATIONAL && d.requiredInternational)) {
        this.documents.push(new FormControl(false, [Validators.required]));
      } else {
        this.documents.push(new FormControl(false));
      }
    });
  }
  setEditableValues(student: Student) {
    this.registrationForm.patchValue({
      name: student.name,
      category: student.category,
      fatherName: student.fatherName,
      motherName: student.motherName,
      dateOfBirth: student.dateOfBirth,
      lastClassScore: student.lastClassScore,
    });
    this.category.markAsDirty(); // to make the custom validator active
    this.setDocuments(student.documents);
    if (this.disableFields) // in case of view fields
    {
      this.makingFieldsDisable(); // making fiels disable
    }
  }
  /**
   * 
   * @param docs docs array which needs to be populated to form array
   * Function used to populate form array
   */
  setDocuments(docs) {
    this.documents.controls.forEach((c,i) => {
      if(docs.includes(i+1)){
        c.setValue(true);
      }
    });
  }

  /**
   * making the fields disabled for view route
   */
  makingFieldsDisable() {
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
  /**
   * Handle form submit
   */
  onSubmit() {
    //store document ids instead of true/false
    this.extractDocumentIds();
    //call update method for edit route
    if (this.editableStudent) {
      this._studentService.updateStudent(this.registrationForm.value, this.editableStudent.id).subscribe((result) => {
        this.alertType = "alert alert-success";
        this.message = "Student updated";
      }, (error) => {
        this.alertType = "alert alert-danger";
        this.message = error;
      })
    } else {
      this._studentService.registerStudent(this.registrationForm.value).subscribe((result) => {
          this.alertType = "alert alert-success";
          this.message = "Student Saved";
          this.registrationForm.reset();
        },
        (error) => {
          this.alertType = "alert alert-danger";
          this.message = error;
        });
    }
  }
  /**
   * extract document ids from select list. 
   */
  extractDocumentIds() {
    this.registrationForm.value.documents = this.documents.controls.map((control, index) => {
      if (control.value) {
        return this.requiredDocuments[index]["id"];
      } else {
        return null;
      }
    }).filter((c) => c != null);
  }
}
