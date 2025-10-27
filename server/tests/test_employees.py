from fastapi import status


def get_token(client):
    response = client.post(
        "/auth/token",
        data={"username": "admin@wavepark.local", "password": "ChangeMe123!"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    response.raise_for_status()
    return response.json()["access_token"]


def test_create_and_list_employee(client):
    token = get_token(client)
    create_response = client.post(
        "/employees",
        json={
            "first_name": "Ali",
            "last_name": "Rezaei",
            "position": "Lifeguard",
            "phone": "09120000000",
            "notes": "Rescue certified",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert create_response.status_code == status.HTTP_201_CREATED

    list_response = client.get("/employees", headers={"Authorization": f"Bearer {token}"})
    data = list_response.json()
    assert list_response.status_code == status.HTTP_200_OK
    assert len(data) == 1
    assert data[0]["first_name"] == "Ali"
