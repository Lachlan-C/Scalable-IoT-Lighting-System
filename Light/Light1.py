import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
  print("Connected with result code "+str(rc))
  client.subscribe("/smartlightsystem/1/1/1")

def on_message(client, userdata, message):
    x = str(message.topic).split('/')
    print(str(message.payload.decode("utf-8")))
    

broker_url = "broker.hivemq.com"
broker_port = 1883

client = mqtt.Client()
client.connect(broker_url, broker_port,60)

client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()