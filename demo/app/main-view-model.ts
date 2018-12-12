import { Observable } from 'tns-core-modules/data/observable';
import { Nativemediapicker } from 'nativescript-nativemediapicker';

export class HelloWorldModel extends Observable {
  public message: string;
  public counter: number;
  private nativemediapicker: Nativemediapicker;

  constructor() {
    super();
    // this.nativemediapicker = new Nativemediapicker();
    this.message = 'this.nativemediapicker.get()';
    this.counter = 0;
  }
}
