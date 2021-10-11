import requests
SERVER = 'http://SERVER-593016722.us-east-1.elb.amazonaws.com:3000/'
a = input("Select Floor: ")
b = input("Select room: ")
c = input("Select id: ")
d = input("Select state (1 or 0): ")
username = input("Input User: ")
r = requests.post(SERVER+'api/createlight',data = {"floor": a, "room":b, "id":c,"state":d,"users":str(username)})
print(r.text)