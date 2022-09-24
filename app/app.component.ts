import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable }    from 'rxjs/Observable';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  companyForm: FormGroup;
  isSubmitted: boolean;
  titleAlert: string = 'This field is required';
  post: any = '';
  phoneRegex: RegExp = /^((3[0-9])|(6[0-9])|(8[1-9])|(9[0-8]))[0-9]{6}$/;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    // init form
    this.createForm();
  }

  createForm() {

    this.companyForm = this.formBuilder.group({
      companyName: ['', Validators.required],

      // nested form group
      address: this.formBuilder.group({
        unit: ['', Validators.required],
        street: ['', Validators.required],
      }),

      // nested form array
      emails: this.formBuilder.array([
        this.formBuilder.control('', Validators.required),
        this.formBuilder.control('')
      ]),

      // nested form array with form group
      contacts: this.formBuilder.array([
        this.formBuilder.group({
          name: ['', Validators.required],
          phone: ['', [ Validators.required, Validators.pattern(this.phoneRegex)]],
        })
      ])
    });
    //this.companyForm.markAsTouched();
    this.companyForm.updateValueAndValidity();
  }

  onSubmit(post, isValid) {

    this.isSubmitted = true;

    if (!isValid)
      return;

    this.post = post;
  }

  // add new form group to contacts array
  addContactField(){
    let control = <FormArray>this.companyForm.controls.contacts;
    control.push(
      this.formBuilder.group({
        name: ['', Validators.required],
        phone: ['', [ Validators.required, Validators.pattern(this.phoneRegex)]],
      })
    )
  }

  // remove last index of contacts array 
  removeContactField() {
    let control = <FormArray>this.companyForm.controls.contacts;
    control.removeAt(control.length - 1)
  }

  // form controls access for validation
  get companyName(){
    return this.companyForm.get('companyName');
  }

  get address(){
    return this.companyForm.get('address') as FormGroup;
  }

  get unit(){
    return this.address.get('unit');
  }

  get street(){
    return this.address.get('street');
  }

  get emails(){
    return this.companyForm.get('emails') as FormArray;
  }

  get contacts(){
    return this.companyForm.get('contacts') as FormArray;
  }
}