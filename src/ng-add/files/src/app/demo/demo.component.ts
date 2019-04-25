import {Component, OnInit} from '@angular/core';
import {UserService} from 'yunzai';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less']
})
export class DemoComponent implements OnInit {


  constructor(private user: UserService) {
  }

  ngOnInit() {
    console.log(this.user.get());
  }

}
