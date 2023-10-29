package com.orosdb;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.mindrot.jbcrypt.BCrypt;


@RestController
@RequestMapping("/api")
public class UserController {

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getUser")
    public ResponseEntity<String> getUser(
        @RequestParam String email,
        @RequestParam String password
    ) {
        try {
            DBConnector connector = new DBConnector();
            connector.connect();
            String connectionRes = "";
            String isValidLogin = connector.authenticateUser(email, password).get("authenticated");
            System.out.println(connector.authenticateUser(email, password));
            if (isValidLogin.equals("true"))
            {
                String username = connector.authenticateUser(email, password).get("username");
                System.out.println("Successfully Authenticated");
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(username);
            }
            else{
                connectionRes = "User Not Found";
                return ResponseEntity.status(500)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(connectionRes);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    @CrossOrigin(origins = "http://localhost:3000") 
    @GetMapping("/createUser")
    public ResponseEntity<String> createUser(
        @RequestParam String username,
        @RequestParam String email,
        @RequestParam String password, // The password is now in plaintext
        @RequestParam String birthDate
    ) {
        try {
            User newUser = new User(username, BCrypt.hashpw(password, BCrypt.gensalt()), email, birthDate);
            DBConnector connector = new DBConnector();
            connector.connect();
            String connectionRes = "";
            if (connector.checkUser(email)) {
                connectionRes = "User Already Found";
                return ResponseEntity.status(500)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(connectionRes);
            } else {
                if (connector.insertUser(newUser)) {
                    connectionRes = "Successfully Created New user";
                    return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(connectionRes);
                } else {
                    connectionRes = "User Unable to be created";
                    return ResponseEntity.status(500)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(connectionRes);
                }
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

