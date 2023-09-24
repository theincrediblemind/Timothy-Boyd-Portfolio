# Author: Prof. MM Ghassemi <ghassem3@msu.edu>
from flask import current_app as app
from flask import render_template, redirect, request, session, url_for, copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
from .utils.database.database  import database
from werkzeug.datastructures   import ImmutableMultiDict
from PyMovieDb import IMDB
from imdb import IMDb
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pprint import pprint
import json
import random
import functools
from . import socketio
db = database()

#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        if "email" not in session:
            return redirect(url_for("login", next=request.url))
        return func(*args, **kwargs)
    return secure_function

def getUser():
	return db.reversibleEncrypt('decrypt', session['email']) if 'email' in session else 'Unknown'

@app.route('/login')
def login():
	return render_template('login.html', user=getUser())

@app.route('/logout')
def logout():
	session.pop('email', default=None)
	return redirect('/')

@app.route('/processlogin', methods = ["POST","GET"])
def processlogin():
	form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
	credentials = db.authenticate(form_fields['email'], db.onewayEncrypt(form_fields['password']))
	if (credentials['success'] == 1):
		session['email'] = db.reversibleEncrypt('encrypt', form_fields['email']) 
	return json.dumps(credentials)

@app.route('/processnewuser', methods = ["POST","GET"])
def processnewuser():
	form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
	print(form_fields)
	credentials = db.createUser(form_fields['email'], form_fields['password'], 'user')
	if (credentials['success'] == 1):
		session['email'] = db.reversibleEncrypt('encrypt', form_fields['email']) 
	return json.dumps(credentials)


#######################################################################################
# CHATROOM RELATED
#######################################################################################
@app.route('/chat')
@login_required
def chat():
    return render_template('chat.html', user=getUser())

@socketio.on('joined', namespace='/chat')
def joined(message):
    join_room('main')
    emit('status', {'msg': getUser() + ' has entered the room.', 'style': 'width: 100%;color:blue;text-align: right'}, room='main')

@socketio.on('left', namespace='/chat')
def left(message):
	emit('left', {'msg': getUser() + ' has left the room.', 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
	leave_room('main')



#######################################################################################
# TRELLO RELATED
#######################################################################################
@app.route('/boards')
@login_required
def boards():
    return render_template('boards.html', user=getUser())

@socketio.on('joined', namespace='/boardchat')
def joined(message):
    join_room('main')
    emit('status', {'msg': getUser() + ' has entered the room.', 'style': 'width: 100%;color:blue;text-align: right'}, room='main')

@socketio.on('message', namespace='/boardchat')
def message(data):
	print("server received message", data)
	emit('status', {'msg': data['message'], 'style': 'width: 100%;color:blue;text-align: right'}, room='main')

@socketio.on('update', namespace='/boardchat')
def update(data):
	print("server received message", data['update'].strip() + data['cardnumber'])
	emit('update_board', {'msg': data['update'].strip() + ">" + data['cardnumber'], 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
#######################################################################################
# OTHER
#######################################################################################

@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	x = random.choice(['I opened an ecommerce store in the summer of 2019.','I have a golden retriever and an english shepherd.','I\'m a songwriter and musician.', 'I am learning to play the electric guitar'])
	return render_template('home.html', user=getUser(), fun_fact = x)

@app.route('/resume')
def resume():
	resume_data = db.getResumeData()
	return render_template('resume.html', user=getUser(), resume_data = resume_data)


@app.route('/projects')
def projects():
	return render_template('projects.html', user=getUser())

@app.route('/piano')
def piano():
	return render_template('piano.html', user=getUser())


@app.route('/processfeedback', methods = ['POST'])
def processfeedback():
	feedback = request.form
	parameters = []
	for item in feedback.values():
		parameters.append(["'{0}'".format(item)])
	db.insertRows('feedback', ['name', 'email', 'comment'], parameters)
	#####Feedback processing for html display below
	feedback_structure = db.processFeedback()
	return render_template('processfeedback.html', feedback_structure = feedback_structure)

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r


#######################################################################################
# Movie
#######################################################################################

@app.route('/movies', methods=['GET', 'POST'])
def search_movies():
    return render_template('movies.html', search_results = [{}])

@socketio.on('movie')
def get_movie(data):
	movie_name = data['movie_name']
	print(f"Received movie name: {movie_name}")

	# Perform search and process the movie name
	imdb = IMDB()

	url = "https://moviesdatabase.p.rapidapi.com/titles/search/title/" + movie_name
	querystring = {"exact": "false", "titleType": "movie"}
	headers = {
		"X-RapidAPI-Key": "9f257e5abamshb6a527bf2764888p1944d0jsnf44c19da71f7",
		"X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com"
	}

	response = requests.get(url, headers=headers, params=querystring)
	movies_data = response.json()
	print(response.json())

	# Search for an exact match by movie name
	exact_match = None
	search_results = []
	try:
		for movie in movies_data['results']:
			title_text = movie['titleText']['text']
			if title_text.lower() == movie_name.lower():
				exact_match = movie
				break
		# If there is an exact match, use that movie
		if exact_match:
			selected_movie = exact_match
		else:
			# If there is no exact match, find the movie with the most recent release date
			movies_sorted_by_release_date = sorted(movies_data['results'], key=lambda m: m['releaseDate']['year'])
			selected_movie = movies_sorted_by_release_date[-1]

		# Extract relevant features for machine learning
		selected_movie_title = selected_movie['titleText']['text']
		selected_movie_year = selected_movie['releaseDate']['year']
		movie_features = [selected_movie_title + " " + str(selected_movie_year)]

		# Calculate similarity scores using TF-IDF and cosine similarity
		movie_titles = [movie['titleText']['text'] for movie in movies_data['results']]
		movie_years = [str(movie['releaseDate']['year']) for movie in movies_data['results']]
		all_movie_features = movie_titles + movie_years

		tfidf_vectorizer = TfidfVectorizer()
		tfidf_matrix = tfidf_vectorizer.fit_transform(all_movie_features)
		similarity_scores = cosine_similarity(tfidf_matrix[:-1], tfidf_matrix[-1].reshape(1, -1)).flatten()

		# Get indices of similar movies within the valid range
		valid_indices = [i for i, score in enumerate(similarity_scores) if i < len(movies_data['results'])]
		top_indices = sorted(valid_indices, key=lambda i: similarity_scores[i], reverse=True)[:4]

		# Prepare search_results with similar movies
		for index in top_indices:
			movie = movies_data['results'][index]
			title = movie['titleText']['text']
			try:
				image = movie['primaryImage']['url']
			except TypeError:
				image = "N/A"
			search_results.append({'title': title, 'image': image, 'description': "TBD"})
	except TypeError:
		search_results = [{'title': "No results found for " + movie_name, 'image': "N/A", 'description': "N/A"}]

	emit('search_results', search_results, namespace='/')


#######################################################################################
# Stocks
#######################################################################################


@app.route('/stocks', methods=["GET", "POST"])
def display_stocks():
    return render_template('stocks.html', search_results = [{}])

@socketio.on('stock')
def get_stocks(data):
	stock_symbol = data['stock_symbol']

	api_key = "GR58OJ3CUPPVTK12"
	api_url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock_symbol}&apikey={api_key}'
	interval = 'Daily'  # Time interval for data (e.g., daily, weekly, monthly)
	output_size = 'compact'  # Output size (e.g., compact, full)

	r = requests.get(api_url)
	data = r.json()
	# Get the key for the time series data
	print(data)
	time_series_key = f'Time Series ({interval})'
	time_series_data = data[time_series_key]

	# Extract the desired plot points
	timestamps = list(time_series_data.keys())[:30] # Get the timestamps for the first 3 data points
	prices = [float(time_series_data[timestamp]['4. close']) for timestamp in timestamps]  # Get the closing prices for the timestamps

	times_prices = {}
	count = 0
	# Print the plot points
	for timestamp, price in zip(timestamps, prices):
		times_prices[count] = {'date':timestamp, 'price':price}
		count += 1

	emit('results', times_prices, namespace='/')