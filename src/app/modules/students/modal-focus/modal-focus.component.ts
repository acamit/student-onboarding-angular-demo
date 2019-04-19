import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-confirm',
  templateUrl: './modal-focus.component.html',
  styleUrls: ['./modal-focus.component.css']
})
export class NgbdModalConfirmAutofocus implements OnInit {
  @Input() public student;
  constructor(public modal: NgbActiveModal) {}
  ngOnInit() {
    console.log(this.student);
  }

}
