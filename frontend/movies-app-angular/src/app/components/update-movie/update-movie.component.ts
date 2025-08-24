import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MovieDto, MovieService} from '../../services/movie.service';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA,  MatDialogRef} from '@angular/material/dialog';
import {response} from 'express';

@Component({
  selector: 'app-update-movie',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-movie.component.html',
  styleUrl: './update-movie.component.css'
})
export class UpdateMovieComponent {
  movieId:any;
  poster:any;
  title: FormControl<string | null>;
  director: FormControl<string | null>;
  studio: FormControl<string | null>;
  movieCast: FormControl<string | null>;
  releaseYear: FormControl<string | null>;
  selectedFile: File | null = null;
  updateMovieForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:{movie:MovieDto},
    private dialogRef:MatDialogRef<UpdateMovieComponent>,
    private http:HttpClient,
    private authService:AuthService,
    private router: Router,
    private  formBuilder: FormBuilder,
    private movieService: MovieService
  ) {

    this.title = new FormControl(this.data.movie.title, Validators.required);
    this.director = new FormControl(this.data.movie.director, Validators.required);
    this.studio = new FormControl(this.data.movie.studio, Validators.required);
    this.movieCast = new FormControl(this.data.movie.movieCast.join(","), Validators.required);
    this.releaseYear = new FormControl(this.data.movie.releaseYear.toString(), Validators.required);
    this.movieId = this.data.movie!;
    this.poster = this.data.movie.poster
    this.updateMovieForm = this.formBuilder.group({
      title: this.title,
      studio: this.studio,
      director: this.director,
      movieCast: this.movieCast,
      releaseYear: this.releaseYear,
      poster: [null],
    });
  }

  inlineNotification ={
    show:false,
    type:'',
    text:''
  }



  updateMovie(){
  if (this.authService.isAuthenticated() && this.updateMovieForm.valid){
    let movieCast = this.updateMovieForm.get('movieCast')?.value as string;
    const mvc = movieCast.split(",").map(e=> e.trim()).filter(e=> e.length > 0);


    const  movieDto: MovieDto ={
      title: this.updateMovieForm.get('title')?.value,
      director: this.updateMovieForm.get('director')?.value,
      studio: this.updateMovieForm.get('studio')?.value,
      movieCast:mvc,
      releaseYear: this.updateMovieForm.get('releaseYear')?.value,
      poster: this.selectedFile ? this.updateMovieForm.get("poster")?.value:null,
    };
    console.log("movie id", this.movieId.movieId);
    this.movieService.updateMovieService(this.movieId.movieId,movieDto, this.selectedFile).subscribe({
      next:(response)=>{
        console.log("movie data after update: ",response);
        this.inlineNotification ={
          show:true,
          type:'Success',
          text:'Movie Updated !'
        }

      },
      error:(err)=>{
        console.log("some error : ",err);
        this.inlineNotification ={
          show:true,
          type:'Error',
          text:'Some error occured !'
        }
      },
      complete:()=>{
        this.dialogRef.close(true);
      }
    });

  }else{
    console.log("form not valid");
  }
  }

  onFileSelected(event:any){
    this.selectedFile =event.target.files[0];
    this.updateMovieForm.patchValue({file: this.selectedFile});

  }

  cancel(){
    this.dialogRef.close();
  }

}
