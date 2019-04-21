import {
  Injectable
} from '@angular/core';
import {
  Student
} from 'src/app/Entities/Student';
import Students from '../../../assets/StudentData.json';
import {
  Observable,
  of ,
  from
} from 'rxjs';
import {
  HttpClient
} from '@angular/common/http';
import {
  map
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentInfoService {
  constructor(private http: HttpClient) {}
  DeleteStudent(id: any) {
    return this.http.delete<any> (`student/${id}`)
    .pipe(map(result => {
      return result;
    }));
  }
   public getStudent(id: number): Observable < any > {
    return this.http.get < any > (`students/${id}`)
      .pipe(map(result => {
        return result;
      }));
  }

  public getStudents(): any[] {
    return JSON.parse(localStorage.getItem("students"));
  }

  public registerStudent(student) {
    return this.http.post < any > (`students/register`, {
        student
      })
      .pipe(map(result => {
        return result;
      }));
  }
  public updateStudent(student, id:number) {
    return this.http.patch < any > (`student/${id}`, {
        student
      })
      .pipe(map(result => {
        return result;
      }));
  }
}
