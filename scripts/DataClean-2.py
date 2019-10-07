# -*- coding: utf-8 -*-
"""
========================================================
@author: Chiang, Yu-Lun
@date: 2019.09.30
@goal: AI Smart Agriculture
@goal: module
@goal: (input)  raw data
@goal: (output) merge data with irregulat time interval
========================================================
"""

import argparse
import pandas as pd

def process_command():
    parser = argparse.ArgumentParser(prog = 'DataClean-1',
                                     usage = 'python DataClean-1.py inputSensorData inputActuatorData',
                                     description = 'DataClean',
                                     epilog = None)
    
    parser.add_argument('isd', 
                        help = 'put input sensordata.csv here')
    
    parser.add_argument('iad', 
                        help = 'put input actuatordata.csv here')
    
    parser.add_argument('-os',
                        '--outputSensor',
                        dest = 'outputSensor',
                        default = 'sensor_irregular_time.csv',
                        type = str,
                        help = 'save output file')

    parser.add_argument('-om',
                        '--outputMerge',
                        dest = 'outputMerge',
                        default = 'merge_irregular_time.csv',
                        type = str,
                        help = 'save output file')
    
    parser.add_argument('-debug',
                        dest = 'debugmode',
                        default = False,
                        type = bool,
                        help = 'debug mode')

    return parser.parse_args()

if __name__ == '__main__':
    
    #--- argument ---#
    args = process_command()
    
    #--- read data ---#
    sensorData = pd.read_csv(args.isd)
    actuatorData = pd.read_csv(args.iad)
    
    #--- transform into datetime format ---#
    sensorData['time'] = pd.to_datetime(sensorData['d.valid_time_start'], unit='s')
    actuatorData['time'] = pd.to_datetime(actuatorData['d.log_time'], unit='s')
    
    #--- Assure that time is asending ---# 
    sensorData = sensorData.sort_values('time').reset_index(drop=True)
    actuatorData = actuatorData.sort_values('time').reset_index(drop=True)

    #--- split device_id from actuator data into two parts ---#
    actuatorData['field'] = actuatorData['device_id'].str.split("_").apply(lambda x: x[0])         ## split name of 'device_id' into field 
    actuatorData['serial_num'] = actuatorData['device_id'].str.split("_").apply(lambda x: x[2])    ## split name of 'device_id' into serial_num 

    #--- Step1: Insert Sensor Data Into DataFrame ---#
    allData = pd.DataFrame()
    for idx in sensorData.index:
        if args.debugmode: 
            print()
            print ('=== Step1: Insert sensor data into allData ===')
            print ('index: %d, type: %s' % (idx, str(sensorData['d.type'][idx])))
        
        #--- insert first sensor data ---#
        if idx == 0:
            allData.loc[idx, 'time'] = sensorData['time'][idx]
            allData.loc[idx, str(sensorData['d.type'][idx])] = sensorData['d.value'][idx]

        #--- after first data ---#
        else:
            #--- Time of inserted data is not in the allData. (New Time data)---#
            if sensorData['time'][idx] > allData['time'].iloc[-1]:  
                if args.debugmode: print ('*** New sensor data ***')
                inserted_index = len(allData)
                
            #--- Time of inserted data is in the allData. (Old Time data)---#
            elif sensorData['time'][idx] == allData['time'].iloc[-1]:
                if args.debugmode: print ('*** Old sensor data ***')
                inserted_index = len(allData) - 1                
                
            #--- This old-time data is not the last time in the dataframe ---#  
            else:
                raise ValueError("Please check if the time of sensor data is asending.")
                break

            allData.loc[inserted_index, 'time'] = sensorData['time'][idx]
            allData.loc[inserted_index, str(sensorData['d.type'][idx])] = sensorData['d.value'][idx]

    allData.to_csv(  args.outputSensor)
    
    #--- Step2: Insert Actuator Data into DataFrame ---#
    start = 0
    for idx in actuatorData.index:
        device_name = str(actuatorData['d.type'][idx]) + "_" + str(actuatorData['serial_num'][idx])

        if args.debugmode: 
            print()
            print ('=== Step2: Insert actuator data into allData ===')
            print ('index: %d, type: %s' % (idx, device_name))

        #--- Time of inserted data is not in the Dataframe. (New Time data)---#
        if actuatorData['time'][idx] not in (allData['time']).tolist():            
            if args.debugmode: print ('*** New time actuator data ***')
            #--- Find the location of time of inserted data in the dataframe  ---#
            while actuatorData['time'][idx] > allData['time'][start]:
                start += 1           
            
            #--- Insert new data in the dataframe  ---#
            insert_actuatorData = pd.DataFrame({device_name: [[actuatorData['d.device_switch'][idx], actuatorData['d.value'][idx], actuatorData['d.action_time'][idx]]], \
                                                'time': actuatorData['time'][idx]}, \
                                                index = [start-0.5])
            allData = allData.append(insert_actuatorData, ignore_index = False)
            allData = allData.sort_index().reset_index(drop = True)
            allData[device_name] = allData[device_name].astype(object)
               
        #--- Time of inserted data is in the Dataframe. (Old Time data)---#
        else:
            if args.debugmode: print ('*** Old time actuator data ***')
            index = allData[allData['time'] == actuatorData['time'][idx]].index[0]            
            allData.at[index, device_name] = 0
            allData[device_name] = allData[device_name].astype(object)
            allData.at[index, device_name] = [actuatorData['d.device_switch'][idx], actuatorData['d.value'][idx], actuatorData['d.action_time'][idx]]
    allData.to_csv( args.outputMerge)    
                    