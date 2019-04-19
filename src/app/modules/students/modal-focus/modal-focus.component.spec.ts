import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbdModalConfirmAutofocus } from './modal-focus.component';



describe('NgbdModalConfirmAutofocus', () => {
  let component: NgbdModalConfirmAutofocus;
  let fixture: ComponentFixture<NgbdModalConfirmAutofocus>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdModalConfirmAutofocus ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdModalConfirmAutofocus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
