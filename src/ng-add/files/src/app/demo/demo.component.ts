import {Component, OnInit} from '@angular/core';
import {NowUserService, User} from 'yunzai';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less']
})
export class DemoComponent implements OnInit {


  constructor(private nowUser: NowUserService) {
  }

  ngOnInit() {
    this.nowUser.getUser().subscribe((user: User) => {
      if (user) {
        console.log(user);
      }
    });
  }

}
