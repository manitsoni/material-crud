import { Component, OnInit, ViewChild } from '@angular/core';
import { CommanService } from 'src/app/comman.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddEditDataComponent } from 'src/app/add-edit-data/add-edit-data.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
enum PageData {
  URL1 = "http://localhost:3000/posts",
  COUNTRY_URL = "https://api.first.org/data/v1/countries"
}

export interface Posts {
  id: string;
  email: string;
  fname: string;
  lname: string;
  country: string;
}
@Component({
  selector: 'app-get-data',
  templateUrl: './get-data.component.html',
  styleUrls: ['./get-data.component.css']
})
export class GetDataComponent implements OnInit {
  postLists: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['fname', 'lname', 'email', 'gender', 'country.name', 'dob', 'action']
  options: string[] = ['Title', 'Author', 'Created date'];
  myControl = new FormControl();
  filteredOptions!: Observable<string[]>;
  countryList: Array<any> = [];
  searchValue = "";
  constructor(private cs: CommanService, public dialog: MatDialog, private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.getData();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  getCountries() {
    this.cs.getData(PageData.COUNTRY_URL).subscribe((response: any) => {
      response.data.forEach((element: any, index: number) => {
        var data = {
          id: index,
          name: element.country
        }
        this.countryList.push(data);
      });
    })
  }
  AddData(id?: any) {
    
    const dialogRef = this.dialog.open(AddEditDataComponent, {
      width: '500px',
      data: { user: this.postLists.filteredData,id:id },
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'save') {
        this.addNewRow(result.data)
      } else {
        this.updateRow(result.data);
      }
    });
  }
  addNewRow(data: any) {
    var existsData = this.postLists.filteredData;
    existsData.push(data);
    this.postLists = new MatTableDataSource<Posts>(existsData);
    this.postLists.sortingDataAccessor = ((item: { [x: string]: any; project: { name: any; }; }, property: string | number) => {
      switch (property) {
        case 'country.name': return item.country.name;
        default: return item[property];
      }
    });
    this.postLists.sort = this.sort;
    this.postLists.paginator = this.paginator;
  }
  updateRow(data: any) {
    var index = this.postLists.filteredData.findIndex((x: any) => x.id === data.id);
    this.postLists.filteredData[index] = data;
    this.postLists.sortingDataAccessor = ((item: { [x: string]: any; project: { name: any; }; }, property: string | number) => {
      switch (property) {
        case 'country.name': return item.country.name;
        default: return item[property];
      }
    });
    this.postLists.sort = this.sort;
    this.postLists.paginator = this.paginator;
  }
  getData() {
    this.cs.getData(PageData.URL1).subscribe((response: any) => {
      this.postLists = new MatTableDataSource<Posts>(response);
      this.postLists.sortingDataAccessor = ((item: { [x: string]: any; project: { name: any; }; }, property: string | number) => {
        switch (property) {
          case 'country.name': return item.country.name;
          default: return item[property];
        }
      });
      this.postLists.sort = this.sort;
      this.postLists.paginator = this.paginator;
    });
  }
  deleteUser(id: any) {
    this.cs.deleteData(PageData.URL1 + "/" + id).subscribe((response: any) => {
      //this.getData();
      var index = this.postLists.filteredData.findIndex((x: any) => x.id === id);
      this.postLists.filteredData.splice(index,1);
      this.postLists.sortingDataAccessor = ((item: { [x: string]: any; project: { name: any; }; }, property: string | number) => {
        switch (property) {
          case 'country.name': return item.country.name;
          default: return item[property];
        }
      });
      this.postLists.sort = this.sort;
      this.postLists.paginator = this.paginator;
      this._snackBar.open('Data deleted successfully!', "dismiss", {
        duration: 2500,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    })
  }
  applyFilter(filterValue: any) {
    this.postLists.filter = filterValue.target.value.trim().toLowerCase();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(item => item.toLowerCase().includes(filterValue));
  }
}
