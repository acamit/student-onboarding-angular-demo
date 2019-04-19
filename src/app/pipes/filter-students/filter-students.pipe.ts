import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'filterStudents'
})
export class FilterStudentsPipe implements PipeTransform {

  transform(students: any[], category: string = "all", searchText: string = ""): any {
    if (category != "all") {
      students = students.filter(s => s.category == category);
    }
    if (searchText != "") {
      students = students.filter(s => s.name.indexOf(searchText)!=-1);
    }
    return students;
  }
}
