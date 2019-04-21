import {
  FormArray,
  ValidatorFn,
  FormGroup
} from '@angular/forms';
import Documents from '../../../assets/Documents.json'
import { CATEGORY_DOMESTIC, CATEGORY_INTERNATIONAL } from 'src/app/data/constants.js';

export function documentsValidator(): ValidatorFn {
  return (form: FormGroup): {[key: string]: any} | null => {
    let documentsControl = form.get('documents') as FormArray;
    let category = form.get('category').value;
    let hasError:boolean =false;
    documentsControl.controls.forEach((control, i) => {
      if(!control.pristine && ((category==CATEGORY_DOMESTIC && Documents[i].requiredDomestic)
      ||(category==CATEGORY_INTERNATIONAL && Documents[i].requiredInternational)) && !control.value){
        control.setErrors({required:true})
        hasError = true;
      }
    });
    return hasError? {required:true}:null;
  };
}
