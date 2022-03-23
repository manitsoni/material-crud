import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommanService } from '../comman.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Guid } from 'guid-typescript';
interface Posts {
  id: string,
  fname: string,
  lname: string,
  email: string;
  gender: string;
  country: any;
  dob: string;
}
enum PageData {
  URL = "http://localhost:3000/posts",
  New = "Add user",
  Edit = "Modify user"
}
interface Country {
  id: string;
  name: string;
}
@Component({
  selector: 'app-add-edit-data',
  templateUrl: './add-edit-data.component.html',
  styleUrls: ['./add-edit-data.component.css']
})
export class AddEditDataComponent implements OnInit {
  userForm: FormGroup = new FormGroup({
    Fname: new FormControl(null, [Validators.required]),
    Lname: new FormControl(null, [Validators.required]),
    Email: new FormControl(null, [Validators.required, Validators.email]),
    Gender: new FormControl(null, [Validators.required]),
    Country: new FormControl(null, [Validators.required]),
    DOB: new FormControl(null, [Validators.required])
  });
  countries: Country[] = [
    { id: '1', name: 'India' },
    { id: '2', name: 'America' },
    { id: '3', name: 'Dubai' }
  ];
  formTitle = "";
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  totalUsers: any;
  constructor(private dialog: MatDialog, private http: HttpClient, private cs: CommanService, private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddEditDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.totalUsers = data.user;
    if (data.id === undefined) {
      this.formTitle = PageData.New;
    } else {
      var editUser = this.totalUsers.filter((user: any) => user.id === data.id)[0];
      var formEditUser = {
        Fname: editUser.fname,
        Lname: editUser.lname,
        Email: editUser.email,
        Gender: editUser.gender,
        Country: editUser.country.id,
        DOB: new Date(editUser.dob)
      }
      this.userForm.patchValue(formEditUser);
      this.formTitle = PageData.Edit;
    }
  }

  ngOnInit(): void {
    //this.getData()
  }
  resetForm() {
    this.userForm = new FormGroup({
      Fname: new FormControl(null, [Validators.required]),
      Lname: new FormControl(null, [Validators.required]),
      Email: new FormControl(null, [Validators.required, Validators.email]),
      Gender: new FormControl(null, [Validators.required]),
      Country: new FormControl(null, [Validators.required]),
      DOB: new FormControl(null, [Validators.required])
    });
  }
  getData() {
    this.cs.getData(PageData.URL).subscribe((response: any) => {
      this.totalUsers = response
    });
  }
  saveUser() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      if (this.formTitle === PageData.New) {
        var isExists = this.totalUsers.filter((x: any) => x.email === this.userForm.value.Email);
        if (isExists.length === 0) {
          var data: Posts = {
            id: Guid.create().toString(),
            fname: this.userForm.value.Fname,
            lname: this.userForm.value.Lname,
            email: this.userForm.value.Email,
            gender: this.userForm.value.Gender,
            country: this.userForm.value.Country ? this.countries.filter(x => x.id === this.userForm.value.Country)[0] : [],
            dob: this.userForm.value.DOB
          }
          this.cs.postData("http://localhost:3000/posts", data).subscribe((response: any) => {
            this.dialogRef.close({ data: data, action: 'save' })
            this.showMessage('Data inserted successfully!', 'dismiss')
          });
        } else {
          this.showMessage('Data already exists!', 'dismiss')
        }
      } else {
        var isExists = this.totalUsers.filter((x: any) => x.email === this.userForm.value.Email);
        if (isExists.length === 0) {
          this.updateUser();
        } else {
          if (isExists[0]['id'] === this.data.id) {
            this.updateUser()
          } else {
            this.showMessage('Data already exists!', 'dismiss')
          }
        }
      }
    }
  }
  updateUser() {
    var data: Posts = {
      id: this.data.id,
      fname: this.userForm.value.Fname,
      lname: this.userForm.value.Lname,
      gender: this.userForm.value.Gender,
      email: this.userForm.value.Email,
      country: this.userForm.value.Country ? this.countries.filter(x => x.id === this.userForm.value.Country)[0] : [],
      dob: this.userForm.value.DOB
    }
    this.cs.putData("http://localhost:3000/posts/" + data.id, data).subscribe((response: any) => {
      this.dialogRef.close({ data: data, action: 'edit' })
      this.showMessage('Data updated successfully', 'dismiss')
    });
  }
  closeDialog() {
    this.dialog.closeAll();
  }
  showMessage(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
