# -*- coding: utf-8 -*-
"""
=====================================================
@author: Chiang, Yu-Lun
@date: 2019.10.30
@goal: AI Smart Agriculture
@goal: module
@goal: (input)  raw data
@goal: (output)   
=====================================================
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
     
    parser.add_argument('-oc',
                        '--outputComparison',
                        dest = 'outputComparison',
                        default = 'comparison.csv',
                        type = str,
                        help = 'save output file')
    
    parser.add_argument('-ops',
                        '--outputPivotSensorData',
                        dest = 'outputPivotSensorData',
                        default = 'pivot_sensorData.csv',
                        type = str,
                        help = 'save output file')
    
    parser.add_argument('-opa',
                        '--outputPivotActuatorData',
                        dest = 'outputPivotActuatorData',
                        default = 'pivot_actuatorData.csv',
                        type = str,
                        help = 'save output file')
    
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

    #--- pivot table of sensordata---#
    pivotTable_sensorData = sensorData.pivot_table(index='d.type', columns='sensor_id', aggfunc='size', fill_value=0)
    sensor_id = pivotTable_sensorData.columns[0]
    pivotTable_sensorData.at['total', sensor_id] = pivotTable_sensorData[sensor_id].sum()
    pivotTable_sensorData[sensor_id] = pivotTable_sensorData[sensor_id].astype('int32')    
    
    #--- pivot table of actuatorData ---#
    actuatorData['field'] = actuatorData['device_id'].str.split("_").apply(lambda x: x[0])         ## split name of 'device_id' into field 
    actuatorData['serial_num'] = actuatorData['device_id'].str.split("_").apply(lambda x: x[2])    ## split name of 'device_id' into serial_num 
    pivotTable_actuatorData = actuatorData.pivot_table(index='serial_num', columns='d.type', aggfunc='size', fill_value=0) 
    total = pd.Series(pivotTable_actuatorData.sum(), name = 'toal')
    pivotTable_actuatorData = pivotTable_actuatorData.append(total.to_frame().T)
    
    #--- Total comparison ---#
    comparison = pd.DataFrame(columns=['SensorData', 'ActuatorData'], index=['start_time', 'end_time', '#data', '#data_types']) 
    comparison['SensorData']   = [sensorData.time.iloc[0],                         ## start_time
                                  sensorData.time.iloc[-1],                        ## end_time
                                  int(pivotTable_sensorData[sensor_id].iloc[-1]),  ## total number of sensor Data  
                                  pivotTable_sensorData.shape[0]-1]                ## total number of sensor types
    a = pivotTable_actuatorData.drop(pivotTable_actuatorData.tail(1).index) > 0
    comparison['ActuatorData'] = [actuatorData.time.iloc[0],                       ## start_time
                                  actuatorData.time.iloc[-1],                      ## end_time
                                  pivotTable_actuatorData.iloc[-1].sum(),          ## total number of actuator Data  
                                  a.sum().sum()]                                   ## total number of actuator types
    
    pivotTable_sensorData.to_csv( args.outputPivotSensorData)
    pivotTable_actuatorData.to_csv( args.outputPivotActuatorData)
    comparison.to_csv( args.outputComparison)
    