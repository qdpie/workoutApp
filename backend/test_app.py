from main import app
import pytest
import uvicorn
import multiprocessing
import requests

BASE_URL = "http://localhost:8000/api/v1"

def run_server():
    uvicorn.run(app)

server_process = multiprocessing.Process(target=run_server)

@pytest.fixture(scope="session", autouse=True)
def start_server():
    server_process.start()
    yield
    server_process.terminate()

client = requests

@pytest.fixture(scope="module")
def auth_token():
    response = client.post(f"{BASE_URL}/auth/login",
        data={
            "grant_type": "password",
            "username": "test@mail.com",
            "password": "password"
        })
    access_token = response.json()["access_token"]
    refresh_token = response.json()["refresh_token"]
    return [access_token, refresh_token]

def login():
    response = client.post(f"{BASE_URL}/auth/login",
        data={
            "grant_type": "password",
            "username": "test@test.com",
            "password": "securepassword"
        })
    return response.json()["access_token"]

### User & Auth Tests

def test_create_user():
    response = client.post(f"{BASE_URL}/user/create",
        json={
            "email": "test@test.com",
            "username": "testuser",
            "password": "securepassword"
        })
    assert response.status_code == 200
    assert "user_id" in response.json()

def test_create_existing_user():
    response = client.post(f"{BASE_URL}/user/create",
        json={
            "email": "test@test.com",
            "username": "testuser",
            "password": "securepassword"
        })
    assert response.status_code == 400
    assert response.json() == {"detail": "User with this email or username already exists"}

def test_delete_current_user():
    temp_auth_token = login()
    response = client.delete(f"{BASE_URL}/user/delete", headers={"Authorization": f"Bearer {temp_auth_token}"})
    assert response.status_code == 200
    assert response.json() == None

def test_login():
    response = client.post(f"{BASE_URL}/auth/login",
        data={
            "grant_type": "password",
            "username": "test@mail.com",
            "password": "password"
        })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_get_current_user(auth_token):
    response = client.get(f"{BASE_URL}/user/me", headers={"Authorization": f"Bearer {auth_token[0]}"})
    assert response.status_code == 200
    assert "user_id" in response.json()

def test_update_current_user(auth_token):
    response = client.put(f"{BASE_URL}/user/update",
        json={
            "email": "test@mail.com",
            "first_name": "John",
            "last_name": "Doe",
            "birth_date": "1990-01-01",
            "gender": "male",
            "height_in": 72,
            "weight": 180
        },
        headers={"Authorization": f"Bearer {auth_token[0]}"
    })
    assert response.status_code == 200
    assert "user_id" in response.json()

def test_update_name_change(auth_token):
    response = client.put(f"{BASE_URL}/user/update",
        json={
            "email": "test@mail.com",
            "first_name": "Jane",
            "last_name": "Doe",
            "birth_date": "1990-01-01",
            "gender": "male",
            "height_in": 72,
            "weight": 180
        },
        headers={"Authorization": f"Bearer {auth_token[0]}"
    })
    assert response.status_code == 200
    assert response.json()["first_name"] == "Jane"

def test_update_bad_data(auth_token):
    response = client.put(f"{BASE_URL}/user/update",
        json={},
        headers={"Authorization": f"Bearer {auth_token[0]}"}
    )
    assert response.status_code == 422

def test_refresh_token(auth_token):
    response = client.post(f"{BASE_URL}/auth/refresh",
        json=auth_token[1])
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_invalid_token():
    response = client.post(f"{BASE_URL}/auth/test-token", headers={"Bearer": "invalid_token"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

### Workout Tests

@pytest.fixture(scope="module")
def created_workout(auth_token):
    response = client.post(f"{BASE_URL}/workout/",
        json={
            "title": "Test Workout for Update and Delete",
            "day_of_week": [1, 4]
        },
        headers={"Authorization": f"Bearer {auth_token[0]}"}
    )
    assert response.status_code == 200
    workout_id = response.json()["workout_id"]
    return workout_id

def test_update_workout(auth_token, created_workout):
    workout_id = created_workout
    response = client.put(f"{BASE_URL}/workout/{workout_id}",
        json={
            "title": "Updated Workout Title",
            "duration_mins": 0,
            "day_of_week": [3]
        },
        headers={"Authorization": f"Bearer {auth_token[0]}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Workout Title"

def test_delete_workout(auth_token, created_workout):
    workout_id = created_workout
    response = client.delete(f"{BASE_URL}/workout/{workout_id}",
        headers={"Authorization": f"Bearer {auth_token[0]}"}
    )
    assert response.status_code == 200

def test_create_workout_invalid_data(auth_token):
    response = client.post(f"{BASE_URL}/workout/",
        json={
            # Omitting required fields or providing invalid data
        },
        headers={"Authorization": f"Bearer {auth_token[0]}"}
    )
    assert response.status_code == 422  # Assuming 422 for validation errors

def test_create_workout_unauthorized():
    response = client.post(f"{BASE_URL}/workout/",
        json={
            "title": "Unauthorized Workout",
            "day_of_week": [2, 5]
        }
        # No auth header
    )
    assert response.status_code == 401  # Unauthorized

def test_get_workouts(auth_token):
    response = client.get(f"{BASE_URL}/workout/", headers={"Authorization": f"Bearer {auth_token[0]}"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)  # Check if the response is a list

#### Currently failing, gets 422 instead of 404
def test_update_nonexistent_workout(auth_token):
    workout_id = "nonexistent_workout_id"
    response = client.put(f"{BASE_URL}/workout/{workout_id}",
        json={
            "title": "Ghost Workout",
            "day_of_week": [1]
        },
        headers={"Authorization": f"Bearer {auth_token[0]}"}
    )
    assert response.status_code == 404  # Not Found

def test_update_workout_unauthorized():
    workout_id = "existing_workout_id"
    response = client.put(f"{BASE_URL}/workout/{workout_id}",
        json={
            "title": "Unauthorized Update",
            "day_of_week": [1, 2]
        }
        # No auth header
    )
    assert response.status_code == 401  # Unauthorized

### Goals Tests

### Exercise Tests

### Session Tests