# Production Deploy Status
[![Netlify Status](https://api.netlify.com/api/v1/badges/87d23f05-7c30-4b68-9a90-cd4890ae95d7/deploy-status)](https://app.netlify.com/sites/shapeshiftapp/deploys)

# ShapeShift

TODO -

Overview of the Software: Briefly describe what the software does, its main features, and its intended users.

Purpose of the Document: Explain the purpose of this documentation, including how it should be used to install, configure, and use the software.

Scope: Outline the functionalities covered by this documentation.

## Project Dependencies

- Python 3.11 or newer
- NodeJS 18 or newer

# Running the dev environment

## Backend

### Setup

\*\*Optional: Create python virtual environment

From the \backend directory:

```sh
python3 -m venv venv
```

To start the virtual environment (run every time you run the dev env)

Mac:

```sh
source venv/bin/activate
```

Windows:

```sh
.\venv\Scripts\Activate.ps1
```

### Install dependencies

```sh
pip install -r requirements.txt
```

### Run the server

```sh
# check dir
# cd backend
python3 main.py
```

Navigate to [http://localhost:8000](http://localhost:8000)

## Frontend

### Setup

Install dependencies

```sh
npm install
```

### Run the expo app

```sh
npm run start

## You can also run directly on your machine
# npm run web
# npm run ios
# npm run android
```

Scan the qr code to access the expo app on your phone

# Software Architecture

### Database

- MongoDB

  [MongoDB docs](https://www.mongodb.com/docs/)

### Backend (API's)

- FastAPI (Python)

  [FastAPI docs](https://fastapi.tiangolo.com/)

- Exercise API's

  [API Ninjas](https://api-ninjas.com/api/exercises)

### Frontend

- React Native

  [React Native docs](https://reactnative.dev/docs/getting-started)
