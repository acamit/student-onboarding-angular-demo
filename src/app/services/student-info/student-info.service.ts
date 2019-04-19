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
                // login successful if there's a jwt token in the response
                // if (result && result.Success) {
                //     // // store user details and jwt token in local storage to keep user logged in between page refreshes
                //     // localStorage.setItem('currentUser', JSON.stringify(user));
                //     // this.currentUserSubject.next(user);

                // }
                // //return user;
                return result;
            }));
  }
}
