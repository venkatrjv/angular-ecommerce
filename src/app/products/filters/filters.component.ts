import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ProductsService } from "../../services/products.service";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"]
})
export class FiltersComponent implements OnInit {
  filterBy: string;
  filterToggle: boolean;
  @ViewChild("searchInput") searchText: ElementRef;
  layoutMode: boolean; // true for grid, false for list

  constructor(private prodService: ProductsService) {}

  ngOnInit() {
    this.setFilterToggle();
    this.filterBy = this.prodService.getFilter();
    this.prodService.filterTypeEmitter.subscribe((filverValue: string) => {
      this.filterBy = filverValue;
    });
    this.layoutMode = this.prodService.getLayout();
    this.prodService.layoutModeEmitter.subscribe((layoutVal: boolean) => {
      this.layoutMode = layoutVal;
    });

    this.getAllCategory();
  }
  categoryList = [];

  getAllCategory() {
    this.prodService.fetchCategoryFromDB().subscribe(
      result => {
        this.categoryList = result;
        if (result.length > 0) this.prodService.setFilter(result[0].id);
      },
      error => {
        alert("Error while retrieving the data");
      }
    );
  }

  setLayout(layoutVal: boolean) {
    this.prodService.setLayout(layoutVal);
  }

  setFilterToggle() {
    this.filterToggle = window.outerWidth > 768 ? true : false;
  }

  setFilter(filterValue: string) {
    this.prodService.setFilter(filterValue);
  }
}
