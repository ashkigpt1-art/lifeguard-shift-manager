from fastapi import status


def test_login_default_admin(client):
    response = client.post(
        "/auth/token",
        data={"username": "admin@wavepark.local", "password": "ChangeMe123!"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@wavepark.local"


def test_create_user_requires_auth(client):
    response = client.post(
        "/auth/users",
        json={
            "email": "manager@wavepark.local",
            "full_name": "Shift Manager",
            "role": "manager",
            "password": "password123",
        },
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
