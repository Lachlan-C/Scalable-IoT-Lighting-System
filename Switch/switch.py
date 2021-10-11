import requests

SERVER = 'http://SERVER-593016722.us-east-1.elb.amazonaws.com:3000/'

a = input("Select Floor: ")
b = input("Select room: ")
c = input("Select id: ")
d = input("Select state (1 or 0): ")
r = requests.post(SERVER+'api/light',data = {"floor": a, "room":b, "id":c,"state":d,"users":["USER1"]})
print(r.text)