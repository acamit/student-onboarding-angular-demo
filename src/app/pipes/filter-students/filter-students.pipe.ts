import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'filterStudents'
})
export class FilterStudentsPipe implements PipeTransform {

  transform(students: any[], category: string = "all", searchText: string = ""): any {
    if (category.toLowerCase() != "all") {
      students = students.filter(s => s.category.toLowerCase() == category.toLowerCase());
    }
    searchText = searchText.trim().toLowerCase()
    if (searchText != "") {
      students = students.filter(s => s.name.toLowerCase().indexOf(searchText)!=-1);
    }
    return students;
  }
}