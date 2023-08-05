import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-pwa';

  public users: Array<any> = [];

  private subscriptions = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.subscriptions.add(
      this.http
        .get<Array<any>>('https://jsonplaceholder.typicode.com/users')
        .subscribe((res) => {
          console.log(res);
          this.users = res;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
