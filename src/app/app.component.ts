import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // por enquanto sempre fazendo logout ao subir a aplicação para evitar comportamento estranho
    this.authService.logout();
    this.authService.initAuthListener();
  }
}
