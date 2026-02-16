import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ShopOverviewComponent } from './shop-overview/shop-overview.component';
import { SplashComponent } from './splash/splash.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ShopOverviewComponent, SplashComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent implements OnInit {
  constructor() {}
  
  ngOnInit(): void {
    // No initialization needed anymore as search functionality moved to ShopOverviewComponent
  }
}
