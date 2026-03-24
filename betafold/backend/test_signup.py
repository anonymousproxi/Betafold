import traceback

try:
    from fastapi.testclient import TestClient
    from main import app
    
    print("TestClient initialized")
    client = TestClient(app)
    
    print("Sending POST request to /auth/signup")
    response = client.post('/auth/signup', json={'name': 'test', 'email': 'test2@test.com', 'password': 'password123'})
    
    print("STATUS:", response.status_code)
    print("TEXT:", response.text)
except Exception as e:
    print("Caught Exception!")
    traceback.print_exc()
