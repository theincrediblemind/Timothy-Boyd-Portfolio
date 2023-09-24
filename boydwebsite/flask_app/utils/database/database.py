from operator import truediv
from xml.sax.handler import property_interning_dict
import mysql.connector
import glob
import json
import csv
import os
from io import StringIO
from pprint import pprint
import hashlib
import cryptography
from cryptography.fernet import Fernet
import itertools
import datetime
class database:

    def __init__(self, purge = False):

        # Grab information from the configuration file
        self.database       = 'db'
        self.host           = '127.0.0.1'
        self.user           = 'master'
        self.port           = 3306
        self.password       = 'master'

        ###encryption key
        self.encryption     =  {   'oneway': {'salt' : b'averysaltysailortookalongwalkoffashortbridge',
                                                    'n' : int(pow(2,5)),
                                                    'r' : 9,
                                                    'p' : 1
                                                },
                                    'reversible': { 'key' : '7pK_fnSKIjZKuv_Gwc--sZEMKn2zc8VvD6zS96XcNHE='}
                                    }
        #------------------------

    def query(self, query = "SELECT CURDATE()", parameters = None):

        cnx = mysql.connector.connect(host     = self.host,
                                      user     = self.user,
                                      password = self.password,
                                      port     = self.port,
                                      database = self.database,
                                      charset  = 'latin1'
                                     )


        if parameters is not None:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query, parameters)
        else:
            cur = cnx.cursor(dictionary=True)
            cur.execute(query)

        # Fetch one result
        row = cur.fetchall()
        cnx.commit()

        if "INSERT" in query:
            cur.execute("SELECT LAST_INSERT_ID()")
            row = cur.fetchall()
            cnx.commit()
        cur.close()
        cnx.close()
        return row

    def about(self, nested=False):    
        query = """select concat(col.table_schema, '.', col.table_name) as 'table',
                          col.column_name                               as column_name,
                          col.column_key                                as is_key,
                          col.column_comment                            as column_comment,
                          kcu.referenced_column_name                    as fk_column_name,
                          kcu.referenced_table_name                     as fk_table_name
                    from information_schema.columns col
                    join information_schema.tables tab on col.table_schema = tab.table_schema and col.table_name = tab.table_name
                    left join information_schema.key_column_usage kcu on col.table_schema = kcu.table_schema
                                                                     and col.table_name = kcu.table_name
                                                                     and col.column_name = kcu.column_name
                                                                     and kcu.referenced_table_schema is not null
                    where col.table_schema not in('information_schema','sys', 'mysql', 'performance_schema')
                                              and tab.table_type = 'BASE TABLE'
                    order by col.table_schema, col.table_name, col.ordinal_position;"""
        results = self.query(query)
        if nested == False:
            return results

        table_info = {}
        for row in results:
            table_info[row['table']] = {} if table_info.get(row['table']) is None else table_info[row['table']]
            table_info[row['table']][row['column_name']] = {} if table_info.get(row['table']).get(row['column_name']) is None else table_info[row['table']][row['column_name']]
            table_info[row['table']][row['column_name']]['column_comment']     = row['column_comment']
            table_info[row['table']][row['column_name']]['fk_column_name']     = row['fk_column_name']
            table_info[row['table']][row['column_name']]['fk_table_name']      = row['fk_table_name']
            table_info[row['table']][row['column_name']]['is_key']             = row['is_key']
            table_info[row['table']][row['column_name']]['table']              = row['table']
        return table_info
    
    def insertRows(self, table='table', columns=['x','y'], parameters=[['v11','v12'],['v21','v22']]):
        query_list = []
        query = "INSERT IGNORE INTO " + table + "("
        for x in range(len(columns)):
            if x != len(columns) - 1:
                query += columns[x] + ", "
            else:
                query += columns[x] + " )\n"
        
        query += "VALUES ("
        y = 0
        for i in range(len(parameters)):
            while y < len(list(parameters)[i]):
                x = 0
                items = ''
                while x < len(list(parameters)):
                    if x < len(list(parameters)) - 1:
                        items += list(parameters)[x][y] + ","
                    else:
                        items += list(parameters)[x][y] + ");"
                    x += 1
                query_list.append(query + items)
                y += 1
        
        
        for insertion in query_list:
            self.query(insertion)     


    def createTables(self, purge=False, data_path = '/flask_app/database'):
        directory = os.getcwd()+data_path
        sql_files = {'/create_tables/institutions.sql':1, '/create_tables/positions.sql':2, '/create_tables/experiences.sql':3, '/create_tables/skills.sql':4, '/create_tables/feedback.sql':5, '/create_tables/users.sql':6}
        csv_files = {'/initial_data/institutions.csv':1, '/initial_data/positions.csv':2, '/initial_data/experiences.csv':3, '/initial_data/skills.csv':4}
        for file in sql_files.keys():
            f = open(directory + "/" + file)
            self.query(f.read())

        
        columns = []
        for file in csv_files.keys():
            f = open(directory + "/" + file)
            reader = csv.reader(f)
            columns = next(reader)
            table = file[file.rfind('/') + 1:file.find('.')]
            parameter_maker = {column_num : [] for column_num in range(len(columns))}
            for row in reader:
                print(columns, row)
                for item in range(len(row)):
                    parameter_maker[item].append(row[item])

            self.insertRows(table, columns, parameter_maker.values())



        


               
    def getResumeData(self):
        #refresh CSVS
        # skills = self.query("DELETE FROM `skills`")
        # experiences = self.query("DELETE FROM `experiences`")
        # positions = self.query("DELETE FROM `positions`")
        # institutions = self.query("DELETE FROM `institutions`")
        # Pulls data from the database to genereate data like this:
        data = {}
        institutions = self.query("SELECT * FROM `institutions`")
        positions = self.query("SELECT * FROM `positions`")
        experiences = self.query("SELECT * FROM `experiences`")
        skills = self.query("SELECT * FROM `skills`")
        for inst in institutions:
            data[inst['inst_id']] = inst
            for pos in positions:
                if pos['inst_id'] == inst['inst_id']:
                    if not 'positions' in inst:
                        inst['positions'] = {pos['position_id'] : pos}
                    elif 'positions' in inst:
                        inst['positions'][pos['position_id']] = pos
                    for exp in experiences:
                        if exp['position_id'] == pos['position_id']:
                            if not 'experiences' in pos:
                                pos['experiences'] = {exp['experience_id'] : exp}
                            elif 'experiences' in pos:
                              pos['experiences'][exp['experience_id']] = exp
                            for skill in skills:
                                if skill['experience_id'] == exp['experience_id']:
                                    if not 'skills' in exp:
                                        exp['skills'] = {skill['skill_id'] : skill}
                                    elif 'skills' in exp:
                                        exp['skills'][skill['skill_id']] = skill
        return data

    def processFeedback(self):
        feedback = self.query("SELECT * FROM `feedback`")
        return feedback

#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
    def createUser(self, email='me@email.com', password='password', role='user'):
        encrypted_pw = self.onewayEncrypt(password)
        parameters = [["'{0}'".format(role)], ["'{0}'".format(email)], ["'{0}'".format(encrypted_pw)]]
        if (self.authenticate(email, encrypted_pw)['success'] == 1):
            return {'success': 0, 'error':1}
        self.insertRows('users', ['role', 'email', 'password'], parameters)
        return {'success':1, 'error':0}

    def authenticate(self, email='me@email.com', password='password'):
        check_user = self.query("SELECT email, password FROM `users` WHERE `email` = '" + email + "'")
        #self.query("DELETE FROM `users`")
        if (check_user):
            if (check_user[0]['email'] == email and check_user[0]['password'] == password):
                return {'success':1, 'error':0}
        return {'success':0, 'error':1}
                
    def onewayEncrypt(self, string):
        encrypted_string = hashlib.scrypt(string.encode('utf-8'),
                                          salt = self.encryption['oneway']['salt'],
                                          n    = self.encryption['oneway']['n'],
                                          r    = self.encryption['oneway']['r'],
                                          p    = self.encryption['oneway']['p']
                                          ).hex()
        return encrypted_string


    def reversibleEncrypt(self, type, message):
        fernet = Fernet(self.encryption['reversible']['key'])
        
        if type == 'encrypt':
            message = fernet.encrypt(message.encode())
        elif type == 'decrypt':
            message = fernet.decrypt(message).decode()

        return message


