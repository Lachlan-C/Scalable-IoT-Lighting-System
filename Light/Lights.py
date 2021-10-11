import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
  print("Connected with result code "+str(rc))
  client.subscribe("/smartlightsystem/#")

def on_message(client, userdata, message):
    x = str(message.topic).split('/')
    print("Floor:"+x[2]+ " Room:"+x[3] + " ID:"+x[4]+" "+str(message.payload.decode("utf-8")))
    

broker_url = "broker.hivemq.com"
broker_port = 1883

client = mqtt.Client()
client.connect(broker_url, broker_port,60)

client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()