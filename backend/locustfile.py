from locust import HttpUser, task, between

class AuthenticatedUser(HttpUser):
    wait_time = between(1, 30)
    host = "http://localhost:8000/api/v1"

    def on_start(self):
        """on_start is called when a Locust instance is started. You can use this to
        setup things that are needed for the test."""
        self.login()

    def login(self):
        # Replace these with the appropriate login endpoint and credentials
        response = self.client.post("http://localhost:8000/api/v1/auth/login", {"grant_type": "password","username": "test@mail.com", "password": "password"})
        # Assuming the response contains a JSON object with the auth token
        self.token = response.json()["access_token"]

    @task(10)
    def load_workouts(self):
        self.client.get("/workout/", headers={"Authorization": f"Bearer {self.token}"})

    # @task(1)
    # def create_workout(self):
    #     self.client.post("/workout/", headers={"Authorization": f"Bearer {self.token}"}, json={"title": "Test Workout", "day_of_week": [0]})
    @task
    def update_user(self):
        self.client.put("/user/update", headers={"Authorization": f"Bearer {self.token}"},
                            json={
                                "email": "test@mail.com",
                                "first_name": "John",
                                "last_name": "Doe",
                                "birth_date": "1990-01-01",
                                "gender": "male",
                                "height_in": 72,
                                "weight": 180
                            })

    @task(8)
    def load_goals(self):
        self.client.get("/goal/", headers={"Authorization": f"Bearer {self.token}"})