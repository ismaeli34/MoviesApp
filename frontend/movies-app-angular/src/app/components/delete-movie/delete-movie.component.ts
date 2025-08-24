import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MovieDto, MovieService} from '../../services/movie.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {response} from 'express';

@Component({
  selector: 'app-delete-movie',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './delete-movie.component.html',
  styleUrl: './delete-movie.component.css'
})
export class DeleteMovieComponent {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data:{movie:MovieDto},
    private dialogRef:MatDialogRef<DeleteMovieComponent>,
    private http:HttpClient,
    private authService:AuthService,
    private router: Router,
    private  formBuilder: FormBuilder,
    private movieService: MovieService
  ) {


  }

  delete(){

    if (this.authService.isAuthenticated()){
      this.movieService.deleteMovieService(this.data.movie.movieId!).subscribe({
        next:(response) => {
          console.log()
        },error :(err)=>{
          console.log(err);
        },complete:()=>{
          this.dialogRef.close(true);
        }
      })
    }

  }

  cancel(){
    this.dialogRef.close();

  }


}
