# This file was created to run the application on heroku using gunicorn.
# Read more about it here: https://devcenter.heroku.com/articles/python-gunicorn
# Este archivo se usa para arrancar la aplicación con gunicorn en producción
import sys
import os


sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from app import app as application

if __name__ == "__main__":
    application.run()
