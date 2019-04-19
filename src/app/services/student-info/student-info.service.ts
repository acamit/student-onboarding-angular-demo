import { Injectable } from '@angular/core';
import { Student } from 'src/app/Entities/Student';
import Students from '../../../assets/StudentData.json';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentInfoService {
  DeleteStudent ( id: any )
  {
    return true;
  }
  getStudentDetails ( arg0: string ): Observable<{}>
  {
    return of(new Student());
  }
  getStudentDetailsLoaded ( arg0: string ): Student
  {
    return new Student();
  }
  

  constructor(private http: HttpClient) {}
  getStudents(): Student[] {
    return Students;
  }
  public registerStudent(student){

    return this.http.post<any>(`students/register`, { student})
            .pipe(map(result => {
                return result;
            }));
  }
}
