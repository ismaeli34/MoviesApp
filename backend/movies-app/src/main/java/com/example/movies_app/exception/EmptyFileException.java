package com.example.movies_app.exception;

public class EmptyFileException extends RuntimeException{

    public EmptyFileException(String message){
        super(message);
    }
}
