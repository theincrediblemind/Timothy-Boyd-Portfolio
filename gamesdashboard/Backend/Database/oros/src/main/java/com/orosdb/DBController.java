package com.orosdb;

import java.sql.Driver;


public final class DBController {
    private DBController() {
    }


    public static void main(String[] args) {
        DBConnector connector = new DBConnector();
        connector.connect();

        User testUser = new User("TestInsert", "To_BE_Encrypyted", "testinsert@gmail.com", "2001-01-15");

        connector.insertUser(testUser);

    }
}
