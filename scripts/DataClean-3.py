# -*- coding: utf-8 -*-
"""
========================================================
@author: Chiang, Yu-Lun
@date: 2019.10.06
@goal: AI Smart Agriculture
@goal: module
@goal: (input)  merge data with irregular time interval
@goal: (output) transfer data with regular time interval
========================================================
"""

import argparse
import pandas as pd
import numpy as np

def process_command():
	parser = argparse.ArgumentParser(prog = 'DataClean-3',
									 usage = 'python DataClean-3.py inputMergeIrregularData',
									 description = 'DataClean',
									 epilog = None)
	
	parser.add_argument('imd', 
						help = 'put input mergeirregulardata.csv here')        

	parser.add_argument('-om',
						'--outputMerge',
						dest = 'outputMerge',
						default = 'merge_regular_time.csv',
						type = str,
						help = 'save output file')
	
	parser.add_argument('-os1',
						'--outputStatistics1',
						dest = 'outputStatistic1',
						default = 'output_statistics1.csv',
						type = str,
						help = 'save output file')
	
	parser.add_argument('-os2',
						'--outputStatistics2',
						dest = 'outputStatistic2',
						default = 'output_statistics2.csv',
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
	merge_irregular_data = pd.read_csv(args.imd, index_col=0)   ## remove unnamed:0  
	merge_irregular_data['time'] = pd.to_datetime(merge_irregular_data['time'])
	merge_irregular_data = merge_irregular_data.set_index('time')

	#--- define acceptable range of sensor data ---# 
	accept_range = {'A01': [0,80],        ## indoor air temperature
					'A02': [0,100],       ## indoor air humidity
					'A03': [-1,200000],   ## indoor air illumination
					'A09': [0,5000],      ## indoor air CO2
					'A10': [0,80],        ## outdoor air temperature
					'A11': [0,100],       ## outdoor air humidity
					'A12': [-1,200000],   ## outdoor air illumination
					'A14': [0,359],       ## outdoor wind direction
					'A15': [0,10],        ## outdoor wind speed
					'A16': [0,102],       ## outdoor rainfall
					'S01': [0,80],        ## indoor soil temperature
					'S02': [0,100],       ## indoor soil humidity
					'S03': [-1,10],       ## indoor soil Electrical Conductivity
					'S04': [0,14]}        ## indoor soil PH

	#--- step1: mark outliers as np.nan of sensordata ---#	
	for col in merge_irregular_data.columns:
		if col in accept_range:
			lower_limit = accept_range.get(col)[0]
			upper_limit = accept_range.get(col)[1]
			merge_irregular_data[col][(merge_irregular_data[col] <= lower_limit) | (merge_irregular_data[col] > upper_limit)] = np.nan 	

	#--- step2: convert raw allData to regular time frequency allDataa (5 min) ---#
	#--- setting time range ---#
	start_time = merge_irregular_data.index[0] - \
				 pd.Timedelta(minutes = merge_irregular_data.index[0].minute, \
							  seconds = merge_irregular_data.index[0].second)

	end_time = merge_irregular_data.index[-1] + \
			   pd.Timedelta(hours = 1) - \
			   pd.Timedelta(minutes = merge_irregular_data.index[-1].minute, \
							seconds = merge_irregular_data.index[-1].second)

	rng = pd.date_range(start = start_time, end = end_time, freq='5min')

	#--- convert to regular time frequency allData ---#
	merge_regular5min_data = pd.DataFrame(columns=merge_irregular_data.columns)
	for t in rng:
		if t <= rng[-1]:
			df = merge_irregular_data[(merge_irregular_data.index >= t) & (merge_irregular_data.index < t+1)]  ## select data within 5 min
			if args.debugmode: print ('======= start-end: ' + str(t) + ' to ' + str(t+1) + ' ========')

			## if df has data
			if len(df) != 0:
				for col in df.columns:                    
					#--- sensor data ---#
					if 'B' not in col:
						merge_regular5min_data.at[t, col] = df[col].mean()

					#--- actuator data ---#
					else:
						#--- the device data of actuator data doesnot exist within 5 min ---#
						if len(df[col][df[col].notna()]) == 0:
							merge_regular5min_data.at[t, col] = np.nan
							
						#--- the device data of actuator data exist only one within 5 min ---#
						elif len(df[col][df[col].notna()]) == 1:
							merge_regular5min_data.at[t, col] = 0    ## initialization
							merge_regular5min_data[col] = merge_regular5min_data[col].astype(object)  ## dtype to object, so we can push list into it
							merge_regular5min_data.at[t, col] = df[col][df[col].notna()][0]
						
						#--- the device data of actuator data exist more than one within 5 min ---#
						else:
							merge_regular5min_data.at[t, col] = 0    ## initialization
							merge_regular5min_data[col] = merge_regular5min_data[col].astype(object)  ## dtype to object, so we can push list into it
							merge_regular5min_data.at[t, col] = df[col][df[col].notna()][-1]    ## use the lastest actuator data as state
							if args.debugmode:
								print ('= multiple same actuator datas within 5 min =')
								print (df[col][df[col].notna()])
								print ()                            
			## df has no data
			else: 
				merge_regular5min_data.loc[t] = np.nan

	#--- statistics ---#
#	merge_irregular_data = merge_irregular_data.sort_index()
#	merge_regular5min_data = merge_regular5min_data.sort_values('index')
	statistics = pd.DataFrame(columns = ['merge_irregular_time_data_w/_nan', 
										 'merge_regular_time_data_w/_nan'] , 
							   index  = ['start_time',     
										 'end_time',       
										 '#data_num',      
										 '#sensor_type',   
										 '#actuator_type', 
										 ])
	
	statistics['merge_irregular_time_data_w/_nan'] = [merge_irregular_data.index[0],
													  merge_irregular_data.index[-1],
													  len(merge_irregular_data),
													  sum(merge_irregular_data.columns.str.match('A')) + sum(merge_irregular_data.columns.str.match('S')),
													  sum(merge_irregular_data.columns.str.match('B'))]

	statistics['merge_regular_time_data_w/_nan'] =   [merge_regular5min_data.index[0],
													  merge_regular5min_data.index[-1],
													  len(merge_regular5min_data),
													  sum(merge_regular5min_data.columns.str.match('A')) + sum(merge_regular5min_data.columns.str.match('S')),
													  sum(merge_regular5min_data.columns.str.match('B'))]
		
	#--- statistics about the count of np.nan of each sensor colomn in merge_regular5min_data ---#
	nan_statistics = merge_regular5min_data.isnull().sum(axis=0).to_frame().T  #@merge_regular_time_data_w/_na
	nan_statistics = nan_statistics.rename(index={0: 'count'})

	#----------------------- step3: interpolate np.nan of sensordata in raw allData      ----------------------#    
	#--- interpolate with time ---#
	for col in merge_regular5min_data.columns:
		if 'B' not in col: 
			merge_regular5min_data[col] = merge_regular5min_data[col].astype(float).interpolate(method='time', limit=24)     
			
	#--- interpolate with mean value in the rest np.nan of sensordata (A16) ---#       
	for col in merge_regular5min_data.columns:
		if 'B' not in col: 
			merge_regular5min_data[col] = merge_regular5min_data[col].fillna(merge_regular5min_data[col].mean())  
			nan_statistics.at['mean', col] = merge_regular5min_data[col].mean()

	merge_regular5min_data.to_csv( args.outputMerge)   ## index = time
	statistics.to_csv( args.outputStatistic1)
	nan_statistics.to_csv( args.outputStatistic2)
