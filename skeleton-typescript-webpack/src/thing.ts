import { ValidationRules } from 'aurelia-validation';
import { IThing } from './thing';
import { autoinject, bindable, bindingMode } from 'aurelia-framework';

export interface IThing {
  value: string;
}

@autoinject()
export class thing {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) thing: IThing;

  constructor() {

  }

  bind() {
    ValidationRules.ensure((t: IThing) => t.value).required().on(this.thing);
  }
}
