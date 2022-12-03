from function import Turbidity_measurement
# Path: opencv\function.py
import time

standard_Time = time.localtime
Turbidity_limit_difference = 1000
#put image in Turbitity measurement
standard_turbidity = Turbidity_measurement()

while True:
    if standard_Time.tm_hour is not time.localtime:
        #put image in Turbitity measurement
        now_turbidity = Turbidity_measurement()
        if now_turbidity - standard_turbidity >Turbidity_limit_difference:
            print("fish die")
        else:
            standard_turbidity = now_turbidity
