import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-pwa';

  public users: Array<any> = [];

  private subscriptions = new Subscription();

  constructor(
    private http: HttpClient,
    private swUpdate: SwUpdate,
    private appRef: ApplicationRef
  ) {
    // this.checkForUpdate();
    this.updateClient();
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.subscriptions.add(
      this.http
        .get<Array<any>>('https://jsonplaceholder.typicode.com/users')
        .subscribe((res) => {
          this.users = res;
        })
    );
  }

  public reloadData() {
    this.loadData();
  }

  private updateClient() {
    try {
      if (!this.swUpdate.isEnabled) {
        console.log('Service worker is not enabled...');
        return;
      }
      this.subscriptions.add(
        this.swUpdate.available.subscribe((event) => {
          console.log(
            `Current : ${event.current} , available: ${event.available}, type : ${event.type}`
          );
          if (confirm('Update available for the app please confirm')) {
            this.swUpdate.activateUpdate().then(() => location.reload());
          }
        })
      );
      this.subscriptions.add(
        this.swUpdate.activated.subscribe((event) => {
          console.log(
            `Current : ${event.previous} , available: ${event.current}`
          );
        })
      );
    } catch (error) {
      console.error('Error: [updateClient]', error);
    }
  }

  checkForUpdate() {
    this.subscriptions.add(
      this.appRef.isStable.subscribe((stable) => {
        if (stable) {
          const timeInterval = interval(20000);

          this.subscriptions.add(
            timeInterval.subscribe(() => {
              this.swUpdate
                .checkForUpdate()
                .then(() => console.log('Checked for update...'));
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
