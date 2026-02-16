import { Component } from '@angular/core';
import { SearchBarComponent } from "./home/shop-overview/search-bar/search-bar.component";
import { SearchFiltersComponent } from "./home/shop-overview/search-filters/search-filters.component";
import { ShopOverviewComponent } from "./home/shop-overview/shop-overview.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
