import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Users } from '../data/users';
import { Student } from '../Entities/Student';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() {
        var nextId = localStorage.getItem("nextId");
        if(!nextId){
            localStorage.setItem("nextId","1");
        }
     }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        let users = Users
        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {
            // authenticate
            if (request.url.endsWith('users/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    let user = filteredUsers[0];
                    let body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }
            
            //register student
            if (request.url.endsWith('students/register') && request.method === 'POST') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    var result = {success:true,error:""}
                    var students = localStorage.getItem("students");
                    var id = +localStorage.getItem("nextId");

                    var newStudents = [];
                    if(students){
                        newStudents = JSON.parse(students);
                    }
                    request.body.student.id = id;
                    newStudents.push(request.body.student);
                    localStorage.setItem("students",JSON.stringify(newStudents));
                    localStorage.setItem("nextId",`${id+1}`);
                    return of(new HttpResponse({ status: 200, body: result}));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // get student by id
            if (request.url.match(/students\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find student by id in students array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    students = localStorage.getItem("students");
                    newStudents = [];
                    if(students){
                        newStudents = JSON.parse(students);
                    }
                    let matchedStudent = newStudents.filter(s => { return s.id === id; });
                    let studentToEdit = matchedStudent.length ? matchedStudent[0] : null;
                    if(studentToEdit){
                        return of(new HttpResponse({ status: 200, body: studentToEdit }));
                    }else{
                        return throwError({ status: 404, error: { message: 'Invalid id' } });    
                    }
                    
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // get users
  /*          if (request.url.endsWith('users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
  
*/

            // update user
            if (request.url.match(/student\/\d+$/) && request.method === 'PATCH') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    students = localStorage.getItem("students");
                    newStudents = [];
                    if(students){
                        newStudents = JSON.parse(students);
                    }
                    for (let i = 0; i < newStudents.length; i++) {
                        let newStudent = newStudents[i];
                        if (newStudent.id === id) {
                            newStudents.splice(i, 1);
                            newStudents.push(request.body.student);
                            localStorage.setItem('students', JSON.stringify(newStudents));
                            break;
                        }
                    }
                    var result = {success:true,error:""}
                    // respond 200 OK
                    return of(new HttpResponse({ status: 200, body:result }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // delete user
            if (request.url.match(/student\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }
            // pass through any requests not handled above
            return next.handle(request);
            
        }))
        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};