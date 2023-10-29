package com.orosdb;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import org.mindrot.jbcrypt.BCrypt;



public class DBConnector {

    private Connection c = null;
    private Statement stmt = null;


    public boolean connect()
    {
        try {
            Class.forName("org.postgresql.Driver");
            c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/oros_dev", "postgres", "Stickems1@");
            System.out.println("Successfully Connected.");
            return true;
        } catch (Exception e) {
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
        } 
        return false;
    }

    public boolean insertUser(User user)
    {
        if (!checkUser(user.get_email()))
        {

            final String INSERT_USERS_SQL = "INSERT INTO public.users" +
            " (username, password, email, \"birthDate\") VALUES (?, ?, ?, ?);";

            try {


                PreparedStatement preparedStatement = c.prepareStatement(INSERT_USERS_SQL);
                preparedStatement.setString(1, user.get_username());
                preparedStatement.setString(2, user.get_ekpassword());
                preparedStatement.setString(3, user.get_email());
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date birthDate = dateFormat.parse(user.get_birthDate());
                java.sql.Date sqlBirthDate = new java.sql.Date(birthDate.getTime());
                preparedStatement.setDate(4, sqlBirthDate);

                System.out.println(preparedStatement);
                // Step 3: Execute the query or update query
                preparedStatement.executeUpdate();
                return true;
                
            }
            catch (Exception ex)
            {
                System.err.println(ex.getClass().getName() + ": " + ex.getMessage());
                return false;
            }
        }
        System.out.println("Account could not be created. Email: " + user.get_email() + " already has an account");
        return false;
    
    }


    public boolean checkUser(String email)
    {
        try {
                stmt = c.createStatement();
                ResultSet rs = stmt.executeQuery("select * from public.users where email = '" + email + "';");
                if (rs.next())
                {
                    return true;
                }
                return false;
        }

        catch (Exception ex)
        {
            System.err.println(ex.getClass().getName() + ": " + ex.getMessage());
            return false;
        }
    }


    public HashMap<String,String> authenticateUser(String email, String password) {
        HashMap<String, String> credentials = new HashMap<>();
        try {
            PreparedStatement preparedStatement = c.prepareStatement("SELECT password, username FROM public.users WHERE email = ?");
            preparedStatement.setString(1, email);
    
            ResultSet rs = preparedStatement.executeQuery();
    
            if (rs.next()) {
                String hashedPassword = rs.getString("password");
                // Use BCrypt to compare the provided password with the stored hashed password
                credentials.put("authenticated", String.valueOf(BCrypt.checkpw(password, hashedPassword)));
                credentials.put("username", rs.getString("username"));
                return credentials;
            } else {
                credentials.put("authenticated", String.valueOf(false));
                return credentials; // No user found with the given email.
            }
        } catch (SQLException ex) {
            System.err.println(ex.getClass().getName() + ": " + ex.getMessage());
            credentials.put("authenticated", String.valueOf(false));
            return credentials;
        }
    }
}
