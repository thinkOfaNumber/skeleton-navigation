import { autoinject } from 'aurelia-framework';
import { ValidationControllerFactory, validateTrigger, ValidationController, ValidationRules } from 'aurelia-validation';
//import {computedFrom} from 'aurelia-framework';

import { IThing } from './thing';

interface IPerson {
  firstName: string;
  lastName: string;
  thing1?: IThing[];
  thing2?: IThing[];
}

@autoinject()
export class Welcome {
  heading: string = 'Welcome to the Aurelia Navigation App';
  person: IPerson;
  previousValue: string = this.fullName;
  controller: ValidationController;

  constructor(private readonly validationControllerFactory: ValidationControllerFactory) {
    this.controller = validationControllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.person = {
      firstName: 'John',
      lastName: 'Doe'
    }
  }

  bind() {
    ValidationRules
      .ensure((p: IPerson) => p.firstName).required()
      .on(this.person);
  }

  //Getters can't be directly observed, so they must be dirty checked.
  //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
  //To optimize by declaring the properties that this getter is computed from, uncomment the line below
  //as well as the corresponding import above.
  //@computedFrom('firstName', 'lastName')
  get fullName(): string {
    if (!this.person) {
      return null;
    }
    return `${this.person.firstName} ${this.person.lastName}`;
  }

  submit() {
    this.controller.validate().then((result) => {
      if (result.valid) {
        this.previousValue = this.fullName;
        alert(`Welcome, ${this.fullName}!`);
      }
      else {
        var invalid = result.results.filter(r => !r.valid).map(r => { return { propertyName: r.propertyName, message: r.message }; });
        console.log("invalid", invalid);
      }
    });
  }

  canDeactivate(): boolean | undefined {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }

  add1() {
    if (this.person.thing1 == null) {
      this.person.thing1 = [];
    }
    this.person.thing1.push({} as IThing);
  }

  delete1(thing: IThing) {
    var index = this.person.thing1.indexOf(thing);
    if (index >= 0) {
      this.person.thing1.splice(index, 1);
    }
  }
}

export class UpperValueConverter {
  toView(value: string): string {
    return value && value.toUpperCase();
  }
}
