package com.example.movies_app.exception;

public class FileExistsException extends RuntimeException{

    public FileExistsException(String message){
        super(message);
    }
}
