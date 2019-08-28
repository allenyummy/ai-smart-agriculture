# -*- coding: utf-8 -*-
"""
=====================================================
@author: Chiang, Yu-Lun
@date: 2019.08.23
@goal: AI Smart Agriculture
@goal: module
@goal: (input)  cleaned 5-min sensor data and trained model
@goal: (output) 5-min actuator data  
=====================================================
"""

import argparse
import pandas as pd
from joblib import dump, load
#from keras.models import load_model

def process_command():
    parser = argparse.ArgumentParser(prog = 'AI_Decision',
                                     usage = 'python AT_Decision.py input',
                                     description = 'classification for actuator action',
                                     epilog = None)
    
    parser.add_argument('inputdata', 
                        help = 'put sensordata.csv here')
    
#    parser.add_argument('model',
#                        help = 'put trained model here')
    
    parser.add_argument('-t', 
                        '--timeFrequency', 
                        dest = 'timeFrequency', 
                        default = 6,
                        type = int,
                        help = 'better same as trained model (6)', )
    
    parser.add_argument('-f', 
                        '--feature', 
                        dest = 'feature',
                        default = "A01,A02,A03,A09,A10,A11,A12,A14,A15,A16",
                        type = str,
                        help = 'delimited by comma, better same as trained model',)
    
    parser.add_argument('-o',
                        '--outputFilename',
                        dest = 'outputFilename',
                        default = 'outputDecision.csv',
                        type = str,
                        help = 'save output file')
    
    return parser.parse_args()

def check_input(input_data):
    if 'E01' in input_data.columns: input_data = input_data.drop(["E01"], axis=1)
    if 'nan' in input_data.columns: input_data = input_data.drop(["nan"], axis=1)
    return input_data
    
def transfer_input(input_data):
    input_data = input_data.rename(columns={"Unnamed: 0": "Time"})
    input_data = input_data.set_index(['Time'])
    return input_data

def filter_column(input_data): ## if necessary
    keep = list()
    for col in input_data.columns:
        if 'B' not in col: keep.append(col)
    return input_data[keep]
            
def filter_feature(input_data, feature):
    return input_data[feature]

def SupervisedDataSet(data, inputLen):
    cols = list()
    for i in range(inputLen-1, -1, -1):      ## if no current data (inputLen, 0, -1)
        cols.append(data.shift(i))
    data_s = pd.concat(cols, axis=1)
    data_s.dropna(inplace=True)
    data_s.index.name = 'outputTime'
    return data_s

if __name__ == '__main__':
    
    #--- argument ---#
    args = process_command()
    
    #--- read data and model ---#
    input_data = pd.read_csv(args.inputdata)
    input_model = load('default_model/006_RFmodel.joblib')
    
    #--- adjust model parameter ---#
    time_frequency = args.timeFrequency
    feature = [item for item in args.feature.split(',')]
    
    #--- organize data ---#
    input_data = check_input(input_data)
    input_data = transfer_input(input_data)
    input_data = filter_column(input_data)
    input_data = filter_feature(input_data, feature)
    
    #--- generate labeled data from input data ---#
    labeled_data_X = SupervisedDataSet(input_data, time_frequency)
    
    #--- genereate output decision ---#
    output_decision = pd.DataFrame(input_model.predict(labeled_data_X), columns=['B03', 'B04', 'm_B01', 'm_B02_1', 'm_B02_2'], index = labeled_data_X.index)
    output_decision.to_csv(args.outputFilename)


