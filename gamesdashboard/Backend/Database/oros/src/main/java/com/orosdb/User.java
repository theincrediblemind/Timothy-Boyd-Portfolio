package com.orosdb;

public class User
{
    private String _username;


    private String _ekpassword; //make sure password is encrypted by frontend before being sent to DB

    private String _email;

    private String _birthDate;
    


    public User(String username, String pw, String email, String _birthDate)
    {
        this._username = username;
        this._ekpassword = pw;
        this._email = email;
        this._birthDate = _birthDate;
    }

    public String get_username() {
        return _username;
    }

    public String get_ekpassword() {
        return _ekpassword;
    }

    public String get_email() {
        return _email;
    }

    public String get_birthDate() {
        return _birthDate;
    }
}